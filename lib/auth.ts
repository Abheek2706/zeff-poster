import crypto from "crypto"
import type { PoolClient } from "pg"
import type { NextRequest, NextResponse } from "next/server"
import { query, withTransaction } from "@/lib/db"

const SESSION_COOKIE_NAME = "zeff_session"
const GOOGLE_STATE_COOKIE_NAME = "zeff_google_state"
const SESSION_TTL_DAYS = 30
const GOOGLE_STATE_TTL_SECONDS = 60 * 10
const GOOGLE_CALLBACK_PATH = "/api/auth/callback/google"

type AuthProvider = "credentials" | "google" | "hybrid"

type DbUserRow = {
  id: string
  email: string
  username: string | null
  name: string | null
  avatar_url: string | null
  password_hash: string | null
  google_id: string | null
  auth_provider: AuthProvider
}

type DbSessionRow = DbUserRow & {
  expires_at: Date
}

export type AuthUser = {
  id: string
  email: string
  fullName: string
  username: string
  avatarUrl: string | null
  provider: AuthProvider
}

export type RegisterInput = {
  fullName: string
  username: string
  email: string
  password: string
}

export type GoogleProfile = {
  email: string
  name: string
  avatarUrl: string | null
  googleId: string
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function normalizeUsername(username: string) {
  return username.trim().toLowerCase()
}

function baseUsername(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24)

  return slug || "user"
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex")
}

function encodeStateCookie(payload: { state: string; nextPath: string }) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url")
}

function decodeStateCookie(value: string) {
  try {
    const payload = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as {
      state?: string
      nextPath?: string
    }

    if (!payload.state || !payload.nextPath) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

function createPasswordHash(password: string) {
  const salt = crypto.randomBytes(16).toString("hex")
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${derivedKey}`
}

function verifyPasswordHash(password: string, storedHash: string) {
  const [salt, expectedHash] = storedHash.split(":")
  if (!salt || !expectedHash) {
    return false
  }

  const actualHash = crypto.scryptSync(password, salt, 64)
  const expectedBuffer = Buffer.from(expectedHash, "hex")

  if (actualHash.length !== expectedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(actualHash, expectedBuffer)
}

function toAuthUser(row: DbUserRow): AuthUser {
  const emailPrefix = row.email.split("@")[0] || "user"

  return {
    id: row.id,
    email: row.email,
    fullName: row.name?.trim() || row.username || emailPrefix,
    username: row.username || emailPrefix,
    avatarUrl: row.avatar_url,
    provider: row.auth_provider,
  }
}

async function usernameExists(username: string, client?: PoolClient) {
  const result = client
    ? await client.query<{ exists: boolean }>(
        `
          SELECT EXISTS(
            SELECT 1
            FROM users
            WHERE lower(username) = $1
          ) AS exists
        `,
        [normalizeUsername(username)],
      )
    : await query<{ exists: boolean }>(
        `
          SELECT EXISTS(
            SELECT 1
            FROM users
            WHERE lower(username) = $1
          ) AS exists
        `,
        [normalizeUsername(username)],
      )

  return Boolean(result.rows[0]?.exists)
}

async function generateUniqueUsername(candidate: string, client?: PoolClient) {
  const base = baseUsername(candidate)

  if (!(await usernameExists(base, client))) {
    return base
  }

  for (let index = 1; index < 1000; index += 1) {
    const nextCandidate = `${base}-${index}`
    if (!(await usernameExists(nextCandidate, client))) {
      return nextCandidate
    }
  }

  return `${base}-${Date.now()}`
}

async function createSessionRecord(userId: string, client?: PoolClient) {
  const rawToken = crypto.randomBytes(32).toString("base64url")
  const sessionToken = hashToken(rawToken)
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000)

  if (client) {
    await client.query(
      `
        INSERT INTO sessions (user_id, session_token, expires_at)
        VALUES ($1, $2, $3)
      `,
      [userId, sessionToken, expiresAt],
    )
  } else {
    await query(
      `
        INSERT INTO sessions (user_id, session_token, expires_at)
        VALUES ($1, $2, $3)
      `,
      [userId, sessionToken, expiresAt],
    )
  }

  return { rawToken, expiresAt }
}

function sanitizeRedirectPath(nextPath: string | null) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/"
  }

  return nextPath
}

function getAuthBaseUrl(request: NextRequest) {
  const configuredBaseUrl =
    process.env.APP_URL?.trim() ||
    process.env.AUTH_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim()

  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/+$/, "")
  }

  return request.nextUrl.origin
}

export function buildGoogleAuthorizationUrl(request: NextRequest) {
  const state = crypto.randomBytes(24).toString("base64url")
  const nextPath = sanitizeRedirectPath(request.nextUrl.searchParams.get("next"))
  const redirectUri = new URL(GOOGLE_CALLBACK_PATH, getAuthBaseUrl(request)).toString()
  const authorizationUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")

  authorizationUrl.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID || "")
  authorizationUrl.searchParams.set("redirect_uri", redirectUri)
  authorizationUrl.searchParams.set("response_type", "code")
  authorizationUrl.searchParams.set("scope", "openid email profile")
  authorizationUrl.searchParams.set("prompt", "select_account")
  authorizationUrl.searchParams.set("state", state)

  return {
    authorizationUrl,
    stateCookieValue: encodeStateCookie({ state, nextPath }),
  }
}

export function readGoogleState(request: NextRequest) {
  const rawStateCookie = request.cookies.get(GOOGLE_STATE_COOKIE_NAME)?.value
  const parsedStateCookie = rawStateCookie ? decodeStateCookie(rawStateCookie) : null
  const state = request.nextUrl.searchParams.get("state")

  if (!parsedStateCookie || !state) {
    return null
  }

  try {
    const expectedStateBuffer = Buffer.from(parsedStateCookie.state, "base64url")
    const actualStateBuffer = Buffer.from(state, "base64url")

    if (expectedStateBuffer.length !== actualStateBuffer.length) {
      return null
    }

    if (!crypto.timingSafeEqual(expectedStateBuffer, actualStateBuffer)) {
      return null
    }

    return parsedStateCookie.nextPath
  } catch {
    return null
  }
}

export async function exchangeGoogleCode(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")
  if (!code) {
    throw new Error("Missing Google authorization code.")
  }

  const redirectUri = new URL(GOOGLE_CALLBACK_PATH, getAuthBaseUrl(request)).toString()
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  })

  if (!tokenResponse.ok) {
    throw new Error("Failed to exchange Google authorization code.")
  }

  const tokenPayload = (await tokenResponse.json()) as {
    access_token?: string
  }

  if (!tokenPayload.access_token) {
    throw new Error("Google access token missing from token response.")
  }

  const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${tokenPayload.access_token}`,
    },
    cache: "no-store",
  })

  if (!profileResponse.ok) {
    throw new Error("Failed to fetch Google profile.")
  }

  const profile = (await profileResponse.json()) as {
    sub?: string
    email?: string
    email_verified?: boolean
    name?: string
    picture?: string
  }

  if (!profile.sub || !profile.email || !profile.email_verified) {
    throw new Error("Google account is missing a verified email address.")
  }

  return {
    googleId: profile.sub,
    email: profile.email,
    name: profile.name?.trim() || profile.email.split("@")[0],
    avatarUrl: profile.picture || null,
  }
}

export async function registerUser(input: RegisterInput) {
  const email = normalizeEmail(input.email)
  const username = normalizeUsername(input.username)
  const fullName = input.fullName.trim()
  const password = input.password

  if (!fullName || !username || !email || !password) {
    throw new Error("All required fields must be provided.")
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.")
  }

  return withTransaction(async (client) => {
    const duplicateEmail = await client.query(
      `
        SELECT 1
        FROM users
        WHERE lower(email) = $1
        LIMIT 1
      `,
      [email],
    )

    if (duplicateEmail.rowCount) {
      throw new Error("An account with this email already exists.")
    }

    if (await usernameExists(username, client)) {
      throw new Error("Username already taken.")
    }

    const result = await client.query<DbUserRow>(
      `
        INSERT INTO users (email, username, name, password_hash, auth_provider)
        VALUES ($1, $2, $3, $4, 'credentials')
        RETURNING id, email, username, name, avatar_url, password_hash, google_id, auth_provider
      `,
      [email, username, fullName, createPasswordHash(password)],
    )

    const user = result.rows[0]
    const session = await createSessionRecord(user.id, client)

    return {
      user: toAuthUser(user),
      session,
    }
  })
}

export async function authenticateUser(identifier: string, password: string) {
  const normalizedIdentifier = identifier.trim().toLowerCase()

  if (!normalizedIdentifier || !password) {
    throw new Error("Please provide your username/email and password.")
  }

  const result = await query<DbUserRow>(
    `
      SELECT id, email, username, name, avatar_url, password_hash, google_id, auth_provider
      FROM users
      WHERE lower(email) = $1 OR lower(username) = $1
      LIMIT 1
    `,
    [normalizedIdentifier],
  )

  const user = result.rows[0]

  if (!user || !user.password_hash || !verifyPasswordHash(password, user.password_hash)) {
    throw new Error("Invalid username/email or password.")
  }

  const session = await createSessionRecord(user.id)

  return {
    user: toAuthUser(user),
    session,
  }
}

export async function findOrCreateGoogleUser(profile: GoogleProfile) {
  return withTransaction(async (client) => {
    const email = normalizeEmail(profile.email)
    const existingResult = await client.query<DbUserRow>(
      `
        SELECT id, email, username, name, avatar_url, password_hash, google_id, auth_provider
        FROM users
        WHERE google_id = $1 OR lower(email) = $2
        ORDER BY CASE WHEN google_id = $1 THEN 0 ELSE 1 END
        LIMIT 1
      `,
      [profile.googleId, email],
    )

    let user = existingResult.rows[0]

    if (!user) {
      const username = await generateUniqueUsername(profile.email.split("@")[0] || profile.name, client)
      const createdResult = await client.query<DbUserRow>(
        `
          INSERT INTO users (email, username, name, google_id, avatar_url, auth_provider)
          VALUES ($1, $2, $3, $4, $5, 'google')
          RETURNING id, email, username, name, avatar_url, password_hash, google_id, auth_provider
        `,
        [email, username, profile.name, profile.googleId, profile.avatarUrl],
      )

      user = createdResult.rows[0]
    } else {
      const nextProvider: AuthProvider =
        user.password_hash && user.auth_provider !== "google" ? "hybrid" : "google"
      const nextUsername =
        user.username || (await generateUniqueUsername(profile.email.split("@")[0] || profile.name, client))
      const updatedResult = await client.query<DbUserRow>(
        `
          UPDATE users
          SET
            username = $2,
            name = $3,
            avatar_url = $4,
            google_id = $5,
            auth_provider = $6,
            updated_at = NOW()
          WHERE id = $1
          RETURNING id, email, username, name, avatar_url, password_hash, google_id, auth_provider
        `,
        [user.id, nextUsername, profile.name, profile.avatarUrl, profile.googleId, nextProvider],
      )

      user = updatedResult.rows[0]
    }

    const session = await createSessionRecord(user.id, client)

    return {
      user: toAuthUser(user),
      session,
    }
  })
}

export async function getSession(request: NextRequest) {
  const rawToken = request.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!rawToken) {
    return null
  }

  const result = await query<DbSessionRow>(
    `
      SELECT
        sessions.expires_at,
        users.id,
        users.email,
        users.username,
        users.name,
        users.avatar_url,
        users.password_hash,
        users.google_id,
        users.auth_provider
      FROM sessions
      INNER JOIN users ON users.id = sessions.user_id
      WHERE sessions.session_token = $1
      LIMIT 1
    `,
    [hashToken(rawToken)],
  )

  const session = result.rows[0]

  if (!session) {
    return null
  }

  if (new Date(session.expires_at).getTime() <= Date.now()) {
    await deleteSessionByRawToken(rawToken)
    return null
  }

  return {
    user: toAuthUser(session),
    expiresAt: session.expires_at,
    rawToken,
  }
}

export async function deleteSessionByRawToken(rawToken: string) {
  await query("DELETE FROM sessions WHERE session_token = $1", [hashToken(rawToken)])
}

export function attachSessionCookie(response: NextResponse, session: { rawToken: string; expiresAt: Date }) {
  response.cookies.set(SESSION_COOKIE_NAME, session.rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: session.expiresAt,
  })
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  })
}

export function attachGoogleStateCookie(response: NextResponse, value: string) {
  response.cookies.set(GOOGLE_STATE_COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: GOOGLE_STATE_TTL_SECONDS,
  })
}

export function clearGoogleStateCookie(response: NextResponse) {
  response.cookies.set(GOOGLE_STATE_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  })
}

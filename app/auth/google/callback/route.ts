import { NextRequest, NextResponse } from "next/server"
import {
  attachSessionCookie,
  clearGoogleStateCookie,
  exchangeGoogleCode,
  findOrCreateGoogleUser,
  readGoogleState,
} from "@/lib/auth"

function redirectWithError(request: NextRequest, code: string) {
  return NextResponse.redirect(new URL(`/login?error=${code}`, request.url))
}

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get("error")) {
    return redirectWithError(request, "google_access_denied")
  }

  const nextPath = readGoogleState(request)
  if (!nextPath) {
    return redirectWithError(request, "google_state_mismatch")
  }

  try {
    const profile = await exchangeGoogleCode(request)
    const result = await findOrCreateGoogleUser(profile)
    const response = NextResponse.redirect(new URL(nextPath, request.url))
    attachSessionCookie(response, result.session)
    clearGoogleStateCookie(response)
    return response
  } catch (error) {
    console.error("Google OAuth callback failed:", error)
    const response = redirectWithError(request, "google_callback_failed")
    clearGoogleStateCookie(response)
    return response
  }
}

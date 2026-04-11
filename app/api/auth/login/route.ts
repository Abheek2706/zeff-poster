import { NextResponse } from "next/server"
import { attachSessionCookie, authenticateUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      identifier?: string
      password?: string
    }

    const result = await authenticateUser(body.identifier || "", body.password || "")
    const response = NextResponse.json({ user: result.user })
    attachSessionCookie(response, result.session)
    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign in."
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

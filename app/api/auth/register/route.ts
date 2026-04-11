import { NextResponse } from "next/server"
import { attachSessionCookie, registerUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      fullName?: string
      username?: string
      email?: string
      password?: string
    }

    const result = await registerUser({
      fullName: body.fullName || "",
      username: body.username || "",
      email: body.email || "",
      password: body.password || "",
    })

    const response = NextResponse.json({ user: result.user })
    attachSessionCookie(response, result.session)
    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create your account."
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

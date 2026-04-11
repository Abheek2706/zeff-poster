import { NextRequest, NextResponse } from "next/server"
import { clearSessionCookie, deleteSessionByRawToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const rawToken = request.cookies.get("zeff_session")?.value

  if (rawToken) {
    await deleteSessionByRawToken(rawToken)
  }

  const response = NextResponse.json({ success: true })
  clearSessionCookie(response)
  return response
}

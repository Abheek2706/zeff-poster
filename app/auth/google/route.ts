import { NextRequest, NextResponse } from "next/server"
import { attachGoogleStateCookie, buildGoogleAuthorizationUrl } from "@/lib/auth"

export async function GET(request: NextRequest) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.redirect(new URL("/login?error=google_not_configured", request.url))
  }

  const { authorizationUrl, stateCookieValue } = buildGoogleAuthorizationUrl(request)
  const response = NextResponse.redirect(authorizationUrl)
  attachGoogleStateCookie(response, stateCookieValue)
  return response
}

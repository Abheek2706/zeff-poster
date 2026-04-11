import { NextRequest, NextResponse } from "next/server"
import { clearSessionCookie, getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const session = await getSession(request)
  const response = NextResponse.json(
    { user: session?.user ?? null },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  )

  if (!session) {
    clearSessionCookie(response)
  }

  return response
}

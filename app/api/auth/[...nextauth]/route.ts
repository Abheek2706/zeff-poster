import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(
    {
      error: "This endpoint has been replaced by the custom auth implementation.",
    },
    { status: 410 },
  )
}

export { GET as POST }

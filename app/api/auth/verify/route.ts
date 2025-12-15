import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { secret } = await request.json()
    const ACCESS_SECRET = process.env.ACCESS_SECRET || "flexliving2024"

    if (secret === ACCESS_SECRET) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: "Invalid access secret" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
  }
}

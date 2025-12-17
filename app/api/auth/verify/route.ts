import APP_CONSTANTS from "@/lib/constants";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { secret } = await request.json();
    const ACCESS_SECRET = APP_CONSTANTS.MANAGEMENT_ACCESS_SECRET;

    if (secret === ACCESS_SECRET) {
      const authData = {
        authenticated: true,
        timestamp: Date.now(),
      };

      const response = NextResponse.json({ success: true });
      response.cookies.set("manager_auth", JSON.stringify(authData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60, // 24 hours in seconds
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "Invalid access secret" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}

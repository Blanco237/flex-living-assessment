import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if accessing manager routes (except login)
  if (pathname.startsWith("/manager") && pathname !== "/manager/login") {
    const authCookie = request.cookies.get("manager_auth")

    if (!authCookie) {
      // Redirect to login if no auth cookie
      return NextResponse.redirect(new URL("/manager/login", request.url))
    }

    try {
      const authData = JSON.parse(authCookie.value)
      const now = Date.now()
      const elapsed = now - authData.timestamp
      const AUTH_DURATION = 24 * 60 * 60 * 1000 // 24 hours

      // Check if token is expired
      if (elapsed > AUTH_DURATION || !authData.authenticated) {
        const response = NextResponse.redirect(new URL("/manager/login", request.url))
        response.cookies.delete("manager_auth")
        return response
      }
    } catch {
      // Invalid cookie format
      const response = NextResponse.redirect(new URL("/manager/login", request.url))
      response.cookies.delete("manager_auth")
      return response
    }
  }

  // If accessing login page while authenticated, redirect to dashboard
  if (pathname === "/manager/login") {
    const authCookie = request.cookies.get("manager_auth")
    if (authCookie) {
      try {
        const authData = JSON.parse(authCookie.value)
        const now = Date.now()
        const elapsed = now - authData.timestamp
        const AUTH_DURATION = 24 * 60 * 60 * 1000

        if (elapsed <= AUTH_DURATION && authData.authenticated) {
          return NextResponse.redirect(new URL("/manager", request.url))
        }
      } catch {
        // Invalid cookie, let them access login page
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/manager/:path*",
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import APP_CONSTANTS from "./lib/constants";

const AUTH_DURATION = APP_CONSTANTS.AUTH_DURATION

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/manager") && pathname !== "/manager/login") {
    const authCookie = request.cookies.get("manager_auth");

    if (!authCookie) {
      return NextResponse.redirect(new URL("/manager/login", request.url));
    }

    try {
      const authData = JSON.parse(authCookie.value);
      const now = Date.now();
      const elapsed = now - authData.timestamp;

      if (elapsed > AUTH_DURATION || !authData.authenticated) {
        const response = NextResponse.redirect(
          new URL("/manager/login", request.url)
        );
        response.cookies.delete("manager_auth");
        return response;
      }
    } catch {
      const response = NextResponse.redirect(
        new URL("/manager/login", request.url)
      );
      response.cookies.delete("manager_auth");
      return response;
    }
  }

  // If accessing login page while authenticated, redirect to dashboard
  if (pathname === "/manager/login") {
    const authCookie = request.cookies.get("manager_auth");
    if (authCookie) {
      try {
        const authData = JSON.parse(authCookie.value);
        const now = Date.now();
        const elapsed = now - authData.timestamp;

        if (elapsed <= AUTH_DURATION && authData.authenticated) {
          return NextResponse.redirect(new URL("/manager", request.url));
        }
      } catch {}
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/manager/:path*",
};

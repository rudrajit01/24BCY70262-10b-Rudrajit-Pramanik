import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // For now, we just pass through. The getSession function in lib/api-utils.ts
  // handles cookie extraction and verification on the server side.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

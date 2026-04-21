import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { serialize } from "cookie";
import { signToken, verifyToken } from "./jwt";
import { StatusCodes } from "http-status-codes";

interface UserSession {
  userId: string;
  email: string;
  name: string;
}

/**
 * Create an HTTP-only cookie with the JWT token and attach it to the response
 */
export async function createAuthCookie(
  response: NextResponse,
  user: { id: string; email: string; name: string }
): Promise<NextResponse> {
  const token = await signToken({
    userId: user.id,
    email: user.email,
    name: user.name,
  });

  const cookieHeader = serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  response.headers.set("Set-Cookie", cookieHeader);
  return response;
}

/**
 * Extract and verify the JWT token from cookies or Authorization header
 */
export async function getSession(
  request?: NextRequest | Request
): Promise<UserSession | null> {
  try {
    let token: string | null = null;

    // Try to get token from cookie header
    if (request) {
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const cookies = cookieHeader.split(";");
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split("=");
          if (name === "token") {
            token = decodeURIComponent(value);
            break;
          }
        }
      }

      // Fallback: try Authorization header
      if (!token) {
        const authHeader = request.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
          token = authHeader.slice(7);
        }
      }
    } else {
      // Server-side: use Next.js cookies function
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value || null;
    }

    if (!token) {
      return null;
    }

    const payload = await verifyToken(token);
    return payload ? (payload as UserSession) : null;
  } catch (error) {
    return null;
  }
}

/**
 * Helper to return unauthorized response
 */
export function unauthorized() {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: StatusCodes.UNAUTHORIZED }
  );
}

/**
 * Helper to return error response
 */
export function errorResponse(message: string, status: number = StatusCodes.BAD_REQUEST) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Helper to return success response
 */
export function successResponse(data: unknown, status: number = StatusCodes.OK) {
  return NextResponse.json(data, { status });
}

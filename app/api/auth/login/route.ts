import { NextRequest, NextResponse } from "next/server";
import { verify } from "argon2";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { createAuthCookie, errorResponse } from "@/lib/api-utils";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return errorResponse(firstError.message);
    }

    const { email, password } = validation.data;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return errorResponse("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    // Verify password
    const passwordMatch = await verify(user.password, password);
    if (!passwordMatch) {
      return errorResponse("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    // Create response with auth cookie
    const response = NextResponse.json(
      {
        message: "Logged in successfully",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      { status: StatusCodes.OK }
    );

    return createAuthCookie(response, {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Internal server error", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

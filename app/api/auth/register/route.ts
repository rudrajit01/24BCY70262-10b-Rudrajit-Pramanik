import { NextRequest, NextResponse } from "next/server";
import { hash } from "argon2";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { createAuthCookie, errorResponse } from "@/lib/api-utils";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return errorResponse(firstError.message);
    }

    const { name, email, password } = validation.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse("Email already in use", StatusCodes.CONFLICT);
    }

    // Hash password
    const hashedPassword = await hash(password);

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await user.save();

    // Create response with auth cookie
    const response = NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      { status: StatusCodes.CREATED }
    );

    return createAuthCookie(response, {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Register error:", error);
    return errorResponse("Internal server error", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

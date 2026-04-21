import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

export async function POST() {
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: StatusCodes.OK }
  );

  // Clear the authentication cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  return response;
}

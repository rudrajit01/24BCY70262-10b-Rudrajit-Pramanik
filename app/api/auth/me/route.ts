import { NextRequest } from "next/server";
import { getSession, successResponse, unauthorized } from "@/lib/api-utils";
import { StatusCodes } from "http-status-codes";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  
  if (!session) {
    return unauthorized();
  }

  return successResponse({
    user: {
      id: session.userId,
      email: session.email,
      name: session.name,
    }
  });
}


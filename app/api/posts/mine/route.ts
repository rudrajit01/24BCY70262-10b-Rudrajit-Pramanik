import { NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import { getSession, unauthorized, errorResponse, successResponse } from "@/lib/api-utils";
import { getUserPosts } from "@/services/posts";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return unauthorized();
    }

    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");

    const { posts, total, pages } = await getUserPosts(session.userId, page, limit);

    return successResponse({
      posts,
      pagination: { page, limit, total, pages },
    });
  } catch (error) {
    console.error("Get user posts error:", error);
    return errorResponse("Internal server error", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

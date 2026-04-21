import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { getSession, unauthorized, errorResponse, successResponse } from "@/lib/api-utils";
import { paginatePosts, createPost } from "@/services/posts";

const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");

    const { posts, total, pages } = await paginatePosts(page, limit);

    return successResponse({
      posts,
      pagination: { page, limit, total, pages },
    });
  } catch (error) {
    console.error("Get posts error:", error);
    return errorResponse("Internal server error", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return unauthorized();
    }

    const body = await request.json();

    // Validate input
    const validation = createPostSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return errorResponse(firstError.message);
    }

    const { title, description } = validation.data;

    const post = await createPost(session.userId, title, description);

    return successResponse(post, StatusCodes.CREATED);
  } catch (error) {
    console.error("Create post error:", error);
    return errorResponse("Internal server error", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

import { NextRequest } from "next/server";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { getSession, unauthorized, errorResponse, successResponse } from "@/lib/api-utils";
import { getCommentsByPost, createComment } from "@/services/comments";

const createCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
});

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const { id } = params;

    const comments = await getCommentsByPost(id);

    return successResponse({ comments });
  } catch (error) {
    console.error("Get comments error:", error);
    return errorResponse("Internal server error", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await getSession(request);
    if (!session) {
      return unauthorized();
    }

    const { id: postId } = params;

    const body = await request.json();

    // Validate input
    const validation = createCommentSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return errorResponse(firstError.message);
    }

    const { content } = validation.data;

    const comment = await createComment(postId, session.userId, content);

    return successResponse(comment, StatusCodes.CREATED);
  } catch (error) {
    console.error("Create comment error:", error);
    return errorResponse("Internal server error", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

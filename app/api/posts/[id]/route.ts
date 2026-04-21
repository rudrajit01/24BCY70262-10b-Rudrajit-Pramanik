import { NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import { errorResponse, successResponse } from "@/lib/api-utils";
import { getPostById, deletePost, updatePost } from "@/services/posts";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const { id } = params;

    const post = await getPostById(id);
    if (!post) {
      return errorResponse("Post not found", StatusCodes.NOT_FOUND);
    }

    return successResponse(post);
  } catch (error) {
    console.error("Get post error:", error);
    return errorResponse("Internal server error", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const { id } = params;

    const deleted = await deletePost(id);
    if (!deleted) {
      return errorResponse("Post not found", StatusCodes.NOT_FOUND);
    }

    return successResponse({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    return errorResponse("Internal server error", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

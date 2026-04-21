import { connectDB } from "@/lib/db";
import Comment from "@/models/Comment";
import User from "@/models/User";

export interface CommentWithAuthor {
  _id: string;
  postId: string;
  userId: string;
  content: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get all comments for a post
 */
export async function getCommentsByPost(postId: string): Promise<CommentWithAuthor[]> {
  await connectDB();

  const comments = await Comment.find({ postId }).sort({ createdAt: -1 });

  // Fetch user details for each comment
  const commentsWithAuthors = await Promise.all(
    comments.map(async (comment: any) => {
      const user = await User.findById(comment.userId);
      return {
        _id: comment._id.toString(),
        postId: comment.postId,
        userId: comment.userId,
        content: comment.content,
        authorName: user?.name || "Unknown",
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      };
    })
  );

  return commentsWithAuthors;
}

/**
 * Create a new comment
 */
export async function createComment(
  postId: string,
  userId: string,
  content: string
): Promise<CommentWithAuthor> {
  await connectDB();

  const comment = new Comment({
    postId,
    userId,
    content,
  });

  await comment.save();

  const user = await User.findById(userId);

  return {
    _id: comment._id.toString(),
    postId: comment.postId,
    userId: comment.userId,
    content: comment.content,
    authorName: user?.name || "Unknown",
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}

/**
 * Update a comment
 */
export async function updateComment(
  commentId: string,
  content: string
): Promise<CommentWithAuthor | null> {
  await connectDB();

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    { content },
    { new: true }
  );

  if (!comment) return null;

  const user = await User.findById(comment.userId);

  return {
    _id: comment._id.toString(),
    postId: comment.postId,
    userId: comment.userId,
    content: comment.content,
    authorName: user?.name || "Unknown",
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: string): Promise<boolean> {
  await connectDB();

  const result = await Comment.findByIdAndDelete(commentId);
  return result !== null;
}

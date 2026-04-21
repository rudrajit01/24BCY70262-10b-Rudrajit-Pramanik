"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Comment {
  _id: string;
  postId: string;
  userId: string;
  content: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

interface CommentsSectionProps {
  postId: string;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const { user, isHydrated } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/posts/${postId}/comments`);
      setComments(response.data.comments);
    } catch (error: any) {
      toast.error("Failed to fetch comments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/posts/${postId}/comments`, {
        content: newComment,
      });

      setComments([response.data, ...comments]);
      setNewComment("");
      toast.success("Comment added successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading comments...</div>;
  }

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>

      {isHydrated && user && (
        <form onSubmit={handleAddComment} className="space-y-2 mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded"
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      )}

      {comments.length === 0 ? (
        <p className="text-gray-600">No comments yet</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <Card key={comment._id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{comment.authorName}</p>
                  <Badge variant="secondary">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{comment.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import PostsList from "@/components/PostsList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";

export default function Home() {
  const { user, status, isHydrated } = useAuthStore();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (status === 'checking') {
    return <div className="text-center py-12">Loading...</div>;
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("/api/posts", { title, description });
      toast.success("Post created successfully");
      setTitle("");
      setDescription("");
      setShowCreatePost(false);
      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">All Posts</h1>

        {user && (
          <div className="mb-6">
            {showCreatePost ? (
              <Card>
                <CardHeader>
                  <CardTitle>Create a New Post</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreatePost} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Title
                      </label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Post title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Post description"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Post"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreatePost(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Button onClick={() => setShowCreatePost(true)}>
                Create Post
              </Button>
            )}
          </div>
        )}
      </div>

      {user ? (
        <PostsList key={refreshKey} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Sign in to view posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              You need to be logged in to interact with posts.
            </p>
            <div className="flex gap-2">
              <Link href="/login">
                <Button>Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">Register</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

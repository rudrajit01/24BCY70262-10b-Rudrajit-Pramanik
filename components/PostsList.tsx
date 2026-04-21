"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Post {
  _id: string;
  userId: string;
  title: string;
  description: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

interface PostsListProps {
  showMyPosts?: boolean;
}

export default function PostsList({ showMyPosts = false }: PostsListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const endpoint = showMyPosts ? "/api/posts/mine" : "/api/posts";
      const response = await axios.get(endpoint, {
        params: { page, limit: 10 },
      });

      setPosts(response.data.posts);
      setTotal(response.data.pagination.total);
      setPages(response.data.pagination.pages);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to fetch posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, showMyPosts]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Link key={post._id} href={`/posts/${post._id}`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{post.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">By {post.authorName}</p>
                </div>
                <Badge variant="secondary">
                  {new Date(post.createdAt).toLocaleDateString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 line-clamp-3">{post.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No posts found</p>
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <Button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            variant="outline"
          >
            Previous
          </Button>

          <span className="text-sm text-gray-600">
            Page {page} of {pages} (Total: {total})
          </span>

          <Button
            onClick={() => setPage(Math.min(pages, page + 1))}
            disabled={page === pages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

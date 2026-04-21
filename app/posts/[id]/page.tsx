"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CommentsSection from "@/components/CommentsSection";
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

export default function PostPage(props: { params: Promise<{ id: string }> }) {
  const [params, setParams] = useState<{ id: string } | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    props.params.then((resolvedParams) => {
      setParams(resolvedParams);
    });
  }, [props.params]);

  useEffect(() => {
    if (!params) return;

    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/posts/${params.id}`);
        setPost(response.data);
      } catch (error) {
        console.error("Failed to fetch post");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params, router]);

  if (isLoading || !params) {
    return (
      <div className="max-w-3xl mx-auto">
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!post) {
    return <div className="text-center py-12">Post not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl">{post.title}</CardTitle>
              <p className="text-sm text-gray-600 mt-2">By {post.authorName}</p>
            </div>
            <Badge variant="secondary">
              {new Date(post.createdAt).toLocaleDateString()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-wrap">{post.description}</p>
        </CardContent>
      </Card>

      <CommentsSection postId={post._id} />
    </div>
  );
}

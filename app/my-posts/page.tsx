"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import PostsList from "@/components/PostsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MyPostsPage() {
  const { user, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/login");
    }
  }, [isHydrated, user, router]);

  if (!isHydrated) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">My Posts</h1>
      <PostsList showMyPosts={true} />
    </div>
  );
}

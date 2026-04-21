"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import NavUser from "./NavUser";

export default function AppHeader() {
  const { user, status, isHydrated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Posts App
        </Link>

        <div className="flex items-center gap-4">
          {status === 'authenticated' ? (
            <>
              <Link href="/my-posts">
                <Button variant="ghost">My Posts</Button>
              </Link>
              <NavUser user={user} />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

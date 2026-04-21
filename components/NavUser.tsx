"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function NavUser() {
  const router = useRouter();
  const { user, status, logout } = useAuthStore();

  if (status === 'checking') {
    return <Spinner size="sm" />;
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm">
        <p className="font-semibold">{user.name}</p>
        <p className="text-gray-600">{user.email}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
}

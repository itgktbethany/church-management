"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();

    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      className="w-full justify-start gap-3"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}
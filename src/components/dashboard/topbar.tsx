import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";

import { MobileSidebar } from "./mobile-sidebar";

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center gap-3">
        <MobileSidebar />

        <div>
          <h2 className="text-lg font-semibold">
            Dashboard
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
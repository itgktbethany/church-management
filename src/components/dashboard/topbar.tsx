"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";

import { MobileSidebar } from "./mobile-sidebar";

type TopbarProps = {
  role: string;
};

export function Topbar({ role }: TopbarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const mainElement = document.getElementById("main-scroll-area");
    if (!mainElement) return;

    const handleScroll = () => {
      // Show on scroll
      setIsVisible(true);

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Hide after 1.5s of inactivity
      scrollTimeout.current = setTimeout(() => {
        setIsVisible(false);
      }, 1500);
    };

    mainElement.addEventListener("scroll", handleScroll);

    // Initial timeout to hide if not scrolled
    scrollTimeout.current = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => {
      mainElement.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return (
    <header
      className={`absolute left-0 right-0 top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 transition-transform duration-300 md:static md:translate-y-0 md:px-6 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3">
        <MobileSidebar role={role} />

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
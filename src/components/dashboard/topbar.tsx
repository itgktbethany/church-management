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

    const checkIsScrollable = () => {
      return mainElement.scrollHeight > mainElement.clientHeight;
    };

    const handleInteraction = () => {
      setIsVisible(true);

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      if (checkIsScrollable()) {
        scrollTimeout.current = setTimeout(() => {
          setIsVisible(false);
        }, 1500);
      }
    };

    mainElement.addEventListener("scroll", handleInteraction);
    // Reveal on tap/click for better UX
    mainElement.addEventListener("click", handleInteraction);
    mainElement.addEventListener("touchstart", handleInteraction, { passive: true });

    // Initial check
    if (checkIsScrollable()) {
      scrollTimeout.current = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    } else {
      setIsVisible(true);
    }

    // Monitor for DOM/content size changes
    const resizeObserver = new ResizeObserver(() => {
      if (!checkIsScrollable()) {
        setIsVisible(true);
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }
      }
    });

    resizeObserver.observe(mainElement);
    if (mainElement.firstElementChild) {
      resizeObserver.observe(mainElement.firstElementChild);
    }

    return () => {
      mainElement.removeEventListener("scroll", handleInteraction);
      mainElement.removeEventListener("click", handleInteraction);
      mainElement.removeEventListener("touchstart", handleInteraction);
      resizeObserver.disconnect();
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return (
    <header
      className={`absolute left-0 right-0 top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 transition-transform duration-300 md:static md:translate-y-0 md:px-6 ${isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
    >
      <div className="flex items-center gap-3">
        {/* Hamburger hidden on mobile — replaced by bottom tab bar */}
        <div className="hidden">
          <MobileSidebar role={role} />
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            My MSK
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
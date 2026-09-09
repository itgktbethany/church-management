"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  BookOpen,
  LayoutDashboard,
  Settings,
  UserCircle2,
  Users,
  MoreHorizontal,
  AlarmClock,
  Shield,
  Coins,
  Ticket,
  Cross,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { cn } from "@/lib/utils";
import { LogoutButton } from "./logout-button";

const mainTabs = [
  { title: "Home", href: "/dashboard", icon: LayoutDashboard },
  { title: "Devotionals", href: "/dashboard/devotionals", icon: BookOpen },
  { title: "Groups", href: "/dashboard/group", icon: Users },
  { title: "My Points", href: "/dashboard/points", icon: Coins },
];

const moreItems = [
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

const adminItems = [
  { title: "Devotional Mgmt", href: "/dashboard/admin/devotionals", icon: Shield },
  { title: "Alert Mgmt", href: "/dashboard/admin/alerts", icon: AlarmClock },
  { title: "Group Mgmt", href: "/dashboard/admin/groups", icon: Users },
  { title: "Ministries", href: "/dashboard/admin/ministries", icon: BookOpen },
  { title: "Events", href: "/dashboard/admin/events", icon: Ticket },
  { title: "Points Mgmt", href: "/dashboard/admin/points", icon: Coins },
];

type BottomTabBarProps = { role: string };

export function BottomTabBar({ role }: BottomTabBarProps) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isMoreActive =
    pathname.startsWith("/dashboard/settings") ||
    pathname.startsWith("/dashboard/points") ||
    pathname.startsWith("/dashboard/admin");

  return (
    // The nav itself sits flush at the bottom; padding-bottom handles the iPhone
    // home indicator area (safe area inset). The tab row is always 64px tall.
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex h-16 items-stretch">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-14 items-center justify-center rounded-full transition-all duration-200",
                  isActive ? "bg-primary/15" : "bg-transparent"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span>{tab.title}</span>
            </Link>
          );
        })}

        {/* More sheet */}
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors",
                isMoreActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-14 items-center justify-center rounded-full transition-all duration-200",
                  isMoreActive ? "bg-primary/15" : "bg-transparent"
                )}
              >
                <MoreHorizontal className="h-5 w-5" />
              </div>
              <span>More</span>
            </button>
          </SheetTrigger>

          <SheetContent side="bottom" className="rounded-t-2xl">
            <SheetHeader className="mb-4">
              <SheetTitle className="flex items-center gap-2 text-left">
                <Cross className="h-4 w-4 text-primary" />
                More
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-1 pb-6">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                      isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}

              {role === "admin" && (
                <>
                  <p className="mt-4 px-4 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Admin
                  </p>
                  {adminItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                          isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </>
              )}

              <div className="pt-2">
                <LogoutButton />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

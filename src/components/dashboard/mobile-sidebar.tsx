"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BookOpen,
  LayoutDashboard,
  Menu,
  Settings,
  UserCircle2,
  Cross,
  Shield,
  AlarmClock,
  Users,
  Coins,
  Ticket
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { LogoutButton } from "./logout-button";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Devotionals",
    href: "/dashboard/devotionals",
    icon: BookOpen,
  },
  {
    title: "Groups",
    href: "/dashboard/group",
    icon: Users,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: UserCircle2,
  },
  {
    title: "My Points",
    href: "/dashboard/points",
    icon: Coins,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const adminMenuItems = [
  {
    title: "Devotional Management",
    href: "/dashboard/admin/devotionals",
    icon: Shield,
  },
  {
    title: "Alert Management",
    href: "/dashboard/admin/alerts",
    icon: AlarmClock,
  },
  {
    title: "Group Management",
    href: "/dashboard/admin/groups",
    icon: Users,
  },
  {
    title: "Ministries Management",
    href: "/dashboard/admin/ministries",
    icon: BookOpen,
  },
  {
    title: "Event Management",
    href: "/dashboard/admin/events",
    icon: Ticket,
  },
  {
    title: "Points Management",
    href: "/dashboard/admin/points",
    icon: Coins,
  },
];

type MobileSidebarProps = {
  role: string;
};

export function MobileSidebar({ role }: MobileSidebarProps) {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[280px] border-r bg-background p-0"
      >
        <div className="flex h-full flex-col">
          
          <SheetHeader className="border-b px-6 py-5">
            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <Cross className="h-5 w-5" />
              </div>

              <div className="flex flex-col text-left">
                <SheetTitle className="text-lg font-semibold">
                  FaithFlow
                </SheetTitle>

                <p className="text-sm text-muted-foreground">
                  Church Management
                </p>
              </div>
            </div>
          </SheetHeader>

          <nav className="flex-1 space-y-2 px-4 py-6">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              );
            })}

            {role === "admin" && (
              <>
                <div className="mt-4 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Admin
                </div>

                {adminMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </>
            )}
          </nav>

          <div className="border-t p-4 space-y-4">

            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                N
              </div>

              <div className="flex flex-col">
                <p className="text-sm font-medium">
                  Nicholas
                </p>

                <p className="text-xs text-muted-foreground">
                  member@faithflow.com
                </p>
              </div>

            </div>

            <LogoutButton />

          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
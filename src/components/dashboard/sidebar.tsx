"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  User,
  Settings,
  Shield,
  AlarmClock
} from "lucide-react";

import { cn } from "@/lib/utils";
import { LogoutButton } from "./logout-button";

type SidebarProps = {
  role: string;
};

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
    icon: User,
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
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 border-r bg-background md:flex md:flex-col">
      <div className="border-b p-6">
        <h1 className="text-xl font-bold">FaithFlow</h1>

        <p className="text-sm text-muted-foreground">
          Church Management
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted",
                pathname === item.href &&
                  "bg-muted font-medium"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}

        {role === "admin" && (
          <>
            <div className="mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Admin
            </div>

            {adminMenuItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted",
                    pathname === item.href &&
                      "bg-muted font-medium"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </>
        )}

        <div className="mt-auto border-t pt-4">
          <LogoutButton />
        </div>
      </nav>
    </aside>
  );
}
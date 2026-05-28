"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  User,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { LogoutButton } from "./logout-button";

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
    href: "/dashboard/groups",
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

export function Sidebar() {
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

        <div className="mt-auto pt-4 border-t">
          <LogoutButton />
        </div>
      </nav>
    </aside>
  );
}
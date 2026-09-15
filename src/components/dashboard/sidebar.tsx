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
  AlarmClock,
  Coins,
  Ticket
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";
import { LogoutButton } from "./logout-button";

type SidebarProps = {
  role: string;
};

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const menuItems = [
    {
      title: t("common.dashboard"),
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t("common.devotionals"),
      href: "/dashboard/devotionals",
      icon: BookOpen,
    },
    {
      title: t("common.groups"),
      href: "/dashboard/group",
      icon: Users,
    },
    {
      title: t("common.profile"),
      href: "/dashboard/profile",
      icon: User,
    },
    {
      title: t("common.myPoints"),
      href: "/dashboard/points",
      icon: Coins,
    },
    {
      title: t("common.settings"),
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const adminMenuItems = [
    {
      title: t("common.devotionalMgmt"),
      href: "/dashboard/admin/devotionals",
      icon: Shield,
    },
    {
      title: t("common.alertMgmt"),
      href: "/dashboard/admin/alerts",
      icon: AlarmClock,
    },
    {
      title: t("common.groupMgmt"),
      href: "/dashboard/admin/groups",
      icon: Users,
    },
    {
      title: t("common.ministriesMgmt"),
      href: "/dashboard/admin/ministries",
      icon: BookOpen,
    },
    {
      title: t("common.eventMgmt"),
      href: "/dashboard/admin/events",
      icon: Ticket,
    },
    {
      title: t("common.pointsMgmt"),
      href: "/dashboard/admin/points",
      icon: Coins,
    },
  ];

  return (
    <aside className="hidden h-screen w-64 border-r bg-background md:flex md:flex-col">
      <div className="border-b p-6">
        <h1 className="text-xl font-bold">FaithFlow</h1>

        <p className="text-sm text-muted-foreground">
          {t("common.churchManagement")}
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
              {t("common.admin")}
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
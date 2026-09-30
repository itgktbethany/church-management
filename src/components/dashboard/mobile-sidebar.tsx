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
import { useLanguage } from "@/components/language-provider";
import { LogoutButton } from "./logout-button";
import { cn } from "@/lib/utils";

type MobileSidebarProps = {
  role: string;
};

export function MobileSidebar({ role }: MobileSidebarProps) {
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
      icon: UserCircle2,
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
                  myMSK
                </SheetTitle>

                <p className="text-sm text-muted-foreground">
                  {t("common.churchManagement")}
                </p>
              </div>
            </div>
          </SheetHeader>

          <nav className="flex-1 space-y-2 px-4 py-6">
            {menuItems.map((item) => {
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

            {role === "admin" && (
              <>
                <div className="mt-4 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("common.admin")}
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
            <LogoutButton />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  BookOpen,
  LayoutDashboard,
  Settings,
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
import { useLanguage } from "@/components/language-provider";
import { LogoutButton } from "./logout-button";

type BottomTabBarProps = { role: string };

export function BottomTabBar({ role }: BottomTabBarProps) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const { t } = useLanguage();

  const mainTabs = [
    { title: t("common.home"), href: "/dashboard", icon: LayoutDashboard },
    { title: t("common.devotionals"), href: "/dashboard/devotionals", icon: BookOpen },
    { title: t("common.groups"), href: "/dashboard/group", icon: Users },
    { title: t("common.myPoints"), href: "/dashboard/points", icon: Coins },
  ];

  const moreItems = [
    { title: t("common.settings"), href: "/dashboard/settings", icon: Settings },
  ];

  const adminItems = [
    { title: t("common.devotionalMgmtShort"), href: "/dashboard/admin/devotionals", icon: Shield },
    { title: t("common.alertMgmtShort"), href: "/dashboard/admin/alerts", icon: AlarmClock },
    { title: t("common.groupMgmtShort"), href: "/dashboard/admin/groups", icon: Users },
    { title: t("common.ministries"), href: "/dashboard/admin/ministries", icon: BookOpen },
    { title: t("common.events"), href: "/dashboard/admin/events", icon: Ticket },
    { title: t("common.pointsMgmtShort"), href: "/dashboard/admin/points", icon: Coins },
  ];

  const isMoreActive =
    pathname.startsWith("/dashboard/settings") ||
    pathname.startsWith("/dashboard/admin");

  return (
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
              <span>{t("common.more")}</span>
            </button>
          </SheetTrigger>

          <SheetContent side="bottom" className="rounded-t-2xl">
            <SheetHeader className="mb-4">
              <SheetTitle className="flex items-center gap-2 text-left">
                <Cross className="h-4 w-4 text-primary" />
                {t("common.more")}
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
                    {t("common.admin")}
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

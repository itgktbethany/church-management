"use client";

import Link from "next/link";
import {
  BookOpen,
  Flame,
  Star,
  Users,
  PenSquare,
  Target,
  User,
  Bell,
  ChevronRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

const smartButtons = [
  {
    title: "Read Devotional",
    icon: BookOpen,
    href: "/dashboard/devotionals",
  },
  {
    title: "Write Reflection",
    icon: PenSquare,
    href: "/dashboard/reflections",
  },
  {
    title: "My Group",
    icon: Users,
    href: "/dashboard/groups",
  },
  {
    title: "My Progress",
    icon: Target,
    href: "/dashboard/progress",
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/dashboard/notifications",
  },
  {
    title: "Profile",
    icon: User,
    href: "/dashboard/profile",
  },
];

const recentActivities = [
  {
    id: 1,
    title: "You completed today's devotional",
    points: "+20 Points",
  },
  {
    id: 2,
    title: "You submitted a reflection",
    points: "+10 Points",
  },
  {
    id: 3,
    title: "7 day streak maintained",
    points: "+50 Points",
  },
];

// import { createClient } from "@/lib/supabase/client";

type Devotional = {
  id: string;
  title: string;
  verse: string;
  content: string;
  publish_date: string;
};

export default function DashboardPage() {
  //  const supabase = createClient();

  const [devotional, setDevotional] =
    useState<Devotional | null>(null);

  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchDevotional = async () => {
  //     const today = new Date()
  //       .toISOString()
  //       .split("T")[0];

  //     const { data, error } = await supabase
  //       .from("devotionals")
  //       .select("*")
  //       .lte("publish_date", today)
  //       .order("publish_date", {
  //         ascending: false,
  //       })
  //       .limit(1)
  //       .single();

  //     if (!error && data) {
  //       setDevotional(data);
  //     }

  //     setLoading(false);
  //   };

  //   fetchDevotional();
  // }, []);

  const devotionalHref = devotional
    ? `/dashboard/devotionals/${devotional.id}`
    : "/dashboard/devotionals";

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2">
        <Badge className="w-fit rounded-full px-4 py-1">
          FaithFlow Dashboard
        </Badge>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Shalom, Nicholas 👋
          </h1>

          <p className="text-muted-foreground mt-2">
            Let’s continue your spiritual journey today.
          </p>
        </div>
      </section>

      <section>
        <Card className="overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl space-y-4">
                <Badge className="bg-white/20 text-white hover:bg-white/20">
                  Daily Devotional
                </Badge>

                <div>
                  <h2 className="text-2xl font-bold md:text-4xl">
                    Faith Over Fear
                  </h2>

                  <p className="mt-2 text-zinc-300">
                    Isaiah 41:10
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-zinc-300 md:text-base">
                  Learn how to trust God even during uncertainty and difficult
                  situations.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-2xl bg-white text-black hover:bg-zinc-200"
                  >
                    <Link href="/dashboard/devotionals/today">
                      Start Reading
                    </Link>
                  </Button>

                  <div className="text-sm text-zinc-300">
                    Estimated reading time: 5 minutes
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:w-[280px]">
                <Card className="rounded-2xl border-white/10 bg-white/10 text-white backdrop-blur">
                  <CardContent className="flex flex-col gap-2 p-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-300">
                      <Flame className="h-4 w-4" />
                      Current Streak
                    </div>

                    <p className="text-3xl font-bold">7</p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-white/10 bg-white/10 text-white backdrop-blur">
                  <CardContent className="flex flex-col gap-2 p-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-300">
                      <Star className="h-4 w-4" />
                      Total Points
                    </div>

                    <p className="text-3xl font-bold">1,240</p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-white/10 bg-white/10 text-white backdrop-blur">
                  <CardContent className="flex flex-col gap-2 p-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-300">
                      <BookOpen className="h-4 w-4" />
                      Devotionals
                    </div>

                    <p className="text-3xl font-bold">32</p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-white/10 bg-white/10 text-white backdrop-blur">
                  <CardContent className="flex flex-col gap-2 p-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-300">
                      <PenSquare className="h-4 w-4" />
                      Reflections
                    </div>

                    <p className="text-3xl font-bold">18</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Smart Actions</h2>
            <p className="text-sm text-muted-foreground">
              Quick access to your daily spiritual activities.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {smartButtons.map((button) => {
            const Icon = button.icon;

            return (
              <Link key={button.title} href={button.href}>
                <Card className="group rounded-3xl transition-all hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="flex flex-col items-start gap-4 p-5">
                    <div className="rounded-2xl bg-zinc-100 p-3 dark:bg-zinc-800">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex w-full items-center justify-between gap-2">
                      <p className="text-sm font-medium leading-snug">
                        {button.title}
                      </p>

                      <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl">
          <CardContent className="space-y-6 p-6">
            <div>
              <h2 className="text-xl font-semibold">Today's Progress</h2>

              <p className="text-sm text-muted-foreground mt-1">
                Stay consistent with your spiritual habits.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl border p-4">
                <div>
                  <p className="font-medium">Read devotional</p>
                  <p className="text-sm text-muted-foreground">
                    Daily devotional completed
                  </p>
                </div>

                <Badge className="rounded-full bg-green-600 hover:bg-green-600">
                  Completed
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-2xl border p-4">
                <div>
                  <p className="font-medium">Write reflection</p>
                  <p className="text-sm text-muted-foreground">
                    Share your thoughts today
                  </p>
                </div>

                <Badge variant="secondary" className="rounded-full">
                  Pending
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-2xl border p-4">
                <div>
                  <p className="font-medium">Prayer time</p>
                  <p className="text-sm text-muted-foreground">
                    Spend time with God today
                  </p>
                </div>

                <Badge variant="secondary" className="rounded-full">
                  Pending
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardContent className="space-y-6 p-6">
            <div>
              <h2 className="text-xl font-semibold">Recent Activity</h2>

              <p className="text-sm text-muted-foreground mt-1">
                Your latest engagement activities.
              </p>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between rounded-2xl border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{activity.title}</p>

                    <p className="text-sm text-muted-foreground">
                      Activity reward earned
                    </p>
                  </div>

                  <Badge className="rounded-full">
                    {activity.points}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
        <Button
          asChild
          size="lg"
          className="h-14 w-full rounded-2xl text-base font-semibold shadow-xl"
        >
          <Link href={devotionalHref}>
            Continue Today's Devotional
          </Link>
        </Button>
      </div>
    </div>
  );
}

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
import { getDashboardData } from "@/actions/dashboard";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    redirect("/login");
  }

  const { user, todayDevotional, stats, recentActivities, progress } = data;

  const devotionalHref = todayDevotional
    ? `/dashboard/devotionals/${todayDevotional.id}`
    : "/dashboard/devotionals";

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2">
        <Badge className="w-fit rounded-full px-4 py-1">
          myMSK Dashboard
        </Badge>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Shalom, {user.name} 👋
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

                {todayDevotional ? (
                  <>
                    <div>
                      <h2 className="text-2xl font-bold md:text-4xl">
                        {todayDevotional.title}
                      </h2>

                      <p className="mt-2 text-zinc-300">
                        {todayDevotional.verse}
                      </p>
                    </div>

                    <p className="text-sm leading-relaxed text-zinc-300 md:text-base line-clamp-2">
                      {todayDevotional.content}
                    </p>
                  </>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold md:text-4xl">
                      No Devotions Today
                    </h2>
                    <p className="mt-2 text-zinc-300">
                      Check back later for today's reading.
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-2xl bg-white text-black hover:bg-zinc-200"
                  >
                    <Link href={devotionalHref}>
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

                    <p className="text-3xl font-bold">{stats.streak}</p>
                  </CardContent>
                </Card>

                <Link href="/dashboard/points" className="block transition-transform hover:scale-105 active:scale-95">
                  <Card className="rounded-2xl border-white/10 bg-white/10 text-white backdrop-blur hover:bg-white/20 transition-colors h-full">
                    <CardContent className="flex flex-col gap-2 p-4">
                      <div className="flex items-center gap-2 text-sm text-zinc-300">
                        <Star className="h-4 w-4" />
                        Total Points
                      </div>

                      <p className="text-3xl font-bold">{stats.totalPoints}</p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/devotionals" className="block transition-transform hover:scale-105 active:scale-95">
                  <Card className="rounded-2xl border-white/10 bg-white/10 text-white backdrop-blur hover:bg-white/20 transition-colors h-full">
                    <CardContent className="flex flex-col gap-2 p-4">
                      <div className="flex items-center gap-2 text-sm text-zinc-300">
                        <BookOpen className="h-4 w-4" />
                        Devotions
                      </div>

                      <p className="text-3xl font-bold">{stats.devotionals}</p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/devotionals?tab=notes" className="block transition-transform hover:scale-105 active:scale-95">
                  <Card className="rounded-2xl border-white/10 bg-white/10 text-white backdrop-blur hover:bg-white/20 transition-colors h-full">
                    <CardContent className="flex flex-col gap-2 p-4">
                      <div className="flex items-center gap-2 text-sm text-zinc-300">
                        <PenSquare className="h-4 w-4" />
                        Reflections
                      </div>

                      <p className="text-3xl font-bold">{stats.reflections}</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
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
                  <p className="font-medium">Read devotion</p>
                  <p className="text-sm text-muted-foreground">
                    {todayDevotional ? "Daily devotional available" : "No devotional today"}
                  </p>
                </div>

                {progress.devotional ? (
                  <Badge className="rounded-full bg-green-600 hover:bg-green-600">
                    Completed
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="rounded-full">
                    Pending
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between rounded-2xl border p-4">
                <div>
                  <p className="font-medium">Write reflection</p>
                  <p className="text-sm text-muted-foreground">
                    Share your thoughts today
                  </p>
                </div>

                {progress.reflection ? (
                  <Badge className="rounded-full bg-green-600 hover:bg-green-600">
                    Completed
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="rounded-full">
                    Pending
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-dashed p-4 opacity-60">
                <div>
                  <p className="font-medium">Prayer time</p>
                  <p className="text-sm text-muted-foreground">
                    Spend time with God today
                  </p>
                </div>

                <Badge variant="outline" className="rounded-full text-xs">
                  Not tracked
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
              {recentActivities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activities
                </p>
              ) : (
                recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between rounded-2xl border p-4"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{activity.title}</p>

                      <p className="text-sm text-muted-foreground">
                        {activity.type === "add" ? "Points earned" : "Points redeemed"}
                      </p>
                    </div>

                    <Badge className="rounded-full">
                      {activity.points}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </section>


    </div>
  );
}

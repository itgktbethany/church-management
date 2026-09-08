import { DailyDevotionalCard } from "@/components/devotional/daily-devotional-card";
import { DevotionalTabs } from "@/components/devotional/devotional-tabs";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { devotionalComments, devotionals } from "@/lib/db/schema";
import { user } from "@/lib/db/auth-schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, Gift } from "lucide-react";

export default async function DevotionalPage(props: { searchParams: Promise<{ tab?: string }> }) {
  const searchParams = await props.searchParams;
  const tab = searchParams?.tab || "history";

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user_data = session?.user;

  // Fetch point balance for the header shortcut
  const currentUser = user_data
    ? await db.query.user.findFirst({ where: eq(user.id, user_data.id) })
    : null;
  const totalPoints = currentUser?.points ?? 0;

const devotionalData = await db.select()
.from(devotionals)
.orderBy(desc(devotionals.publishDate))

const reflectionsData =
  user_data
    ? await db
        .select({
          id: devotionalComments.id,
          comment: devotionalComments.comment,
          createdAt: devotionalComments.createdAt,
          devotionalTitle: devotionals.title,
          devotionalId: devotionals.id,
        })
        .from(devotionalComments)
        .leftJoin(
          devotionals,
          eq(
            devotionalComments.devotionalId,
            devotionals.id
          )
        )
        .where(
          eq(
            devotionalComments.userId,
            user_data.id
          )
        )
        .orderBy(
          desc(devotionalComments.createdAt)
        )
    : [];

const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Jakarta",
}).format(new Date());

const devotionalToday = await db
  .select()
  .from(devotionals)
  .where(eq(devotionals.publishDate, today));


const latestDevotional = devotionalToday[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Devotional
          </h1>

          <p className="text-muted-foreground mt-1">
            Continue your daily walk and reflections.
          </p>
        </div>

        {/* Points shortcuts */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/dashboard/points">
            <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
              <Star className="w-3.5 h-3.5 text-yellow-500" />
              <span className="font-semibold">{totalPoints}</span>
              <span className="text-muted-foreground">pts</span>
            </Button>
          </Link>
          <Link href="/dashboard/points/redeem">
            <Button size="sm" className="gap-1.5 rounded-full">
              <Gift className="w-3.5 h-3.5" />
              Redeem
            </Button>
          </Link>
        </div>
      </div>

      {latestDevotional && (
        <DailyDevotionalCard
          devotional={latestDevotional}
        />
      )}

      <DevotionalTabs
        devotionals={devotionalData}
        reflections={reflectionsData}
        defaultTab={tab}
      />
    </div>
  );
}
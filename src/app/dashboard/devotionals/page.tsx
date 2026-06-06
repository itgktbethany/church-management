import { DailyDevotionalCard } from "@/components/devotional/daily-devotional-card";
import { DevotionalTabs } from "@/components/devotional/devotional-tabs";

// import { createClient } from "@/lib/supabase/server";
import {auth} from "@/lib/auth"
import { headers } from "next/headers";
import { db} from "@/lib/db";
import { devotionalComments, devotionals } from "@/lib/db/schema";

import { desc,eq } from "drizzle-orm";

export default async function DevotionalPage() {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

const devotionalData = await db.select()
.from(devotionals)
.orderBy(desc(devotionals.publishDate))

const reflectionsData =
  user
    ? await db
        .select({
          id: devotionalComments.id,
          comment: devotionalComments.comment,
          createdAt: devotionalComments.createdAt,
          devotionalTitle: devotionals.title,
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
            user.id
          )
        )
        .orderBy(
          desc(devotionalComments.createdAt)
        )
    : [];

const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Jakarta",
}).format(new Date());

console.log(today);

const devotionalToday = await db
  .select()
  .from(devotionals)
  .where(eq(devotionals.publishDate, today));

  console.log(devotionalToday);

const latestDevotional = devotionalToday[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Devotional
        </h1>

        <p className="text-muted-foreground mt-1">
          Continue your daily walk and reflections.
        </p>
      </div>

      {latestDevotional && (
        <DailyDevotionalCard
          devotional={latestDevotional}
        />
      )}

      <DevotionalTabs
        devotionals={devotionalData}
        reflections={reflectionsData}
      />
    </div>
  );
}
import { DailyDevotionalCard } from "@/components/devotional/daily-devotional-card";
import { DevotionalTabs } from "@/components/devotional/devotional-tabs";
import { DevotionalsHeader } from "@/components/devotional/devotionals-header";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { devotionalComments, devotionals } from "@/lib/db/schema";
import { user } from "@/lib/db/auth-schema";
import { desc, eq } from "drizzle-orm";

export default async function DevotionalPage(props: { searchParams: Promise<{ tab?: string }> }) {
  const searchParams = await props.searchParams;
  const tab = searchParams?.tab || "history";

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user_data = session?.user;

  const currentUser = user_data
    ? await db.query.user.findFirst({ where: eq(user.id, user_data.id) })
    : null;
  const totalPoints = currentUser?.points ?? 0;

  const devotionalData = await db.select()
    .from(devotionals)
    .orderBy(desc(devotionals.publishDate));

  const reflectionsData = user_data
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
      <DevotionalsHeader totalPoints={totalPoints} />

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
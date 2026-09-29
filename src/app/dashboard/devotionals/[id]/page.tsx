import { notFound } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { devotionals, devotionalComments } from "@/lib/db/schema";
import { getSession } from "@/lib/session";
import { DevotionalDetailContent } from "@/components/devotional/devotional-detail-content";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DevotionalDetailPage({
  params,
}: PageProps) {
  const { id } = await params;
  const session = await getSession();

  const devotional = await db
    .select()
    .from(devotionals)
    .where(eq(devotionals.id, id));

  const devotionalData = devotional[0];

  let existingReflection = null;
  if (session?.user && devotionalData) {
    const [reflection] = await db
      .select()
      .from(devotionalComments)
      .where(
        and(
          eq(devotionalComments.devotionalId, devotionalData.id),
          eq(devotionalComments.userId, session.user.id)
        )
      );
    existingReflection = reflection || null;
  }
  
  if (!devotionalData) {
    return notFound();
  }

  return (
    <DevotionalDetailContent
      id={id}
      devotionalData={devotionalData}
      existingReflection={existingReflection}
    />
  );
}
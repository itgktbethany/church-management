import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { pointTransactions } from "@/lib/db/points-schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { VoucherDetailsContent } from "@/components/points/voucher-details-content";

interface VoucherPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function VoucherPage({ params }: VoucherPageProps) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) return null;

  const transaction = await db.query.pointTransactions.findFirst({
    where: eq(pointTransactions.id, id),
    with: {
      event: true,
    }
  });

  if (!transaction || transaction.userId !== session.user.id || transaction.type !== "deduct") {
    return notFound();
  }

  return <VoucherDetailsContent transaction={transaction} />;
}

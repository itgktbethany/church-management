import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Ticket } from "lucide-react";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { pointTransactions } from "@/lib/db/points-schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClaimVoucherButton } from "@/components/points/claim-voucher-button";

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

  return (
    <div className="space-y-8 max-w-xl mx-auto pt-8">
      <div>
        <Link href="/dashboard/points/redeem" className="inline-block mb-4">
          <Button variant="ghost" className="gap-2 px-0 hover:bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Back to Redeem
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Voucher Details</h1>
        <p className="text-muted-foreground">Show this page to an admin to claim your reward.</p>
      </div>

      <Card className="border-primary bg-primary/5 shadow-lg overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
        <CardHeader className="text-center pt-8 pb-4">
          <div className="mx-auto bg-primary/20 p-4 rounded-full mb-4 w-fit">
            <Ticket className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">{transaction.event?.name}</CardTitle>
          <CardDescription className="text-lg">
            Redeemed on {new Date(transaction.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
          <div className="border-2 border-dashed border-primary/50 rounded-lg p-6 w-full bg-background">
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-2">Voucher Code</p>
            <p className="text-2xl font-mono font-bold tracking-wider">{transaction.id.split('-')[0].toUpperCase()}</p>
          </div>

          <div className="w-full space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Status</span>
              <span className={`font-semibold uppercase ${transaction.redemptionStatus === 'used' ? 'text-muted-foreground' : 'text-green-600'}`}>
                {transaction.redemptionStatus || 'UNUSED'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Points Cost</span>
              <span className="font-semibold">{transaction.amount} pts</span>
            </div>
          </div>

          {transaction.redemptionStatus === "unused" ? (
            <ClaimVoucherButton transactionId={transaction.id} />
          ) : (
            <Button size="lg" disabled className="w-full mt-4">
              Reward Claimed
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { getEvents } from "@/actions/events";
import { getPointHistory } from "@/actions/points";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/auth-schema";
import { eq } from "drizzle-orm";
import { RedeemEventList } from "@/components/points/redeem-event-list";
import { UnusedRedemptionsList } from "@/components/points/unused-redemptions-list";

import { headers } from "next/headers";

export default async function RedeemPointsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return null;

  const events = await getEvents();
  const deductEvents = events.filter((e) => e.type === "deduct" && e.isActive);
  
  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });
  
  const totalPoints = currentUser?.points || 0;

  const history = await getPointHistory(session.user.id);
  const unusedRedemptions = history.filter((tx) => tx.type === "deduct" && tx.redemptionStatus === "unused");

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Redeem Points</h1>
        <p className="text-muted-foreground">Exchange your points for rewards.</p>
        <p className="font-semibold mt-2 text-lg">Your Balance: {totalPoints} pts</p>
      </div>

      {unusedRedemptions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Your Unused Rewards</h2>
          <p className="text-muted-foreground">Show these to an admin to claim your reward.</p>
          <UnusedRedemptionsList redemptions={unusedRedemptions} />
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Available Rewards</h2>
        <RedeemEventList events={deductEvents} userPoints={totalPoints} />
      </div>
    </div>
  );
}

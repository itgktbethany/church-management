import { getEvents } from "@/actions/events";
import { getPointHistory } from "@/actions/points";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/auth-schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { RedeemPointsContent } from "@/components/points/redeem-points-content";

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
    <RedeemPointsContent
      deductEvents={deductEvents}
      totalPoints={totalPoints}
      unusedRedemptions={unusedRedemptions}
    />
  );
}

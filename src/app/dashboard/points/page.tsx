import { getPointHistory } from "@/actions/points";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/auth-schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { PointsContent } from "@/components/points/points-content";

export default async function UserPointsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return null;

  const history = await getPointHistory(session.user.id);
  
  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });
  
  const totalPoints = currentUser?.points || 0;

  return (
    <PointsContent
      totalPoints={totalPoints}
      history={history}
    />
  );
}

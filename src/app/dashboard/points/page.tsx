import { getPointHistory } from "@/actions/points";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { user } from "@/lib/db/auth-schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { headers } from "next/headers";

export default async function UserPointsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return null;

  const history = await getPointHistory(session.user.id);
  
  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });
  
  const totalPoints = currentUser?.points || 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Points</h1>
          <p className="text-muted-foreground">View your point balance and transaction history.</p>
        </div>
        <div>
          <Link href="/dashboard/points/redeem">
            <Button>Redeem Points</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPoints} pts</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No transactions found.</p>
          ) : (
            <div className="space-y-4">
              {history.map((tx) => {
                const isUnused = tx.type === "deduct" && tx.redemptionStatus === "unused";
                const content = (
                  <div className={`flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 ${isUnused ? "hover:bg-muted/50 p-2 -mx-2 rounded-md transition-colors" : ""}`}>
                    <div>
                      <p className="font-medium">{tx.event?.name || "Manual Adjustment"}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleString()}
                      </p>
                      {tx.type === "deduct" && tx.redemptionStatus && (
                        <div className="mt-1">
                          <Badge variant={tx.redemptionStatus === "used" ? "secondary" : "default"}>
                            {tx.redemptionStatus === "used" ? "Redeemed & Used" : "Unused Reward (Click to Claim)"}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className={`font-bold ${tx.type === "add" ? "text-green-600" : "text-red-600"}`}>
                      {tx.type === "add" ? "+" : "-"}{tx.amount}
                    </div>
                  </div>
                );

                if (isUnused) {
                  return (
                    <Link key={tx.id} href={`/dashboard/points/redeem/${tx.id}`} className="block">
                      {content}
                    </Link>
                  );
                }

                return <div key={tx.id}>{content}</div>;
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { BottomTabBar } from "@/components/dashboard/bottom-tab-bar";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { user } from "@/lib/db/auth-schema";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const dbUser = await db.query.user.findFirst({
  where: eq(user.id, session.user.id),
  
});
  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <Sidebar  role={dbUser?.role ?? "member"}/>

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Topbar role={dbUser?.role ?? "member"} />

        <main id="main-scroll-area" className="flex-1 overflow-y-auto p-4 pt-20 pb-24 md:p-6 md:pb-6" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 5rem)" }}>
          {children}
        </main>
      </div>

      {/* Mobile bottom tab bar — hidden on desktop */}
      <BottomTabBar role={dbUser?.role ?? "member"} />
    </div>
  );
}
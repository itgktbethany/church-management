import { getDashboardData } from "@/actions/dashboard";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    redirect("/login");
  }

  const { user, todayDevotional, stats, recentActivities, progress } = data;

  return (
    <DashboardContent
      user={{
        id: user.id,
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
      }}
      todayDevotional={todayDevotional}
      stats={stats}
      recentActivities={recentActivities}
      progress={progress}
    />
  );
}

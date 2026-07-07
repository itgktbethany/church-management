import { getMinistries, getAllUsers } from "@/actions/ministry";
import { MinistriesAdminClient } from "./client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const metadata = {
  title: "Ministries Administration - Church Management System",
};

export default async function MinistriesAdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    redirect("/login");
  }

  const [dbUser] = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id));
  if (dbUser?.role !== "admin") {
    redirect("/dashboard");
  }

  const [ministriesRes, usersRes] = await Promise.all([
    getMinistries(),
    getAllUsers(),
  ]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Ministries Management</h1>
        <p className="text-muted-foreground">Create ministries and assign members to them.</p>
      </div>

      <MinistriesAdminClient 
        initialMinistries={ministriesRes.data || []}
        users={usersRes.data || []}
      />
    </div>
  );
}

import { getMinistries, getAllUsers } from "@/actions/ministry";
import { MinistriesAdminClient } from "./client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { DownloadTemplateButton } from "@/components/admin/download-template-button";
import { BulkUploadMinistryDialog } from "@/components/admin/ministries/bulk-upload-dialog";

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Ministries Management</h1>
          <p className="text-muted-foreground">Create ministries and assign members to them.</p>
        </div>

        <div className="flex gap-2">
          <DownloadTemplateButton type="ministries" />

          <BulkUploadMinistryDialog />
        </div>
      </div>

      <MinistriesAdminClient 
        initialMinistries={ministriesRes.data || []}
        users={usersRes.data || []}
      />
    </div>
  );
}

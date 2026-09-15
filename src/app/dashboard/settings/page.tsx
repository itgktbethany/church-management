import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SettingsContent } from "@/components/settings/settings-content";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  return <SettingsContent />;
}

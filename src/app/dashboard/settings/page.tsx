import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { ThemeToggle } from "@/components/settings/theme-toggle";
import { PwaUpdatePrompt } from "@/components/pwa-update-prompt";
import { User, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-1">
            Account
          </h2>
          <Card className="rounded-3xl border-0 bg-muted/50 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <Button 
                asChild
                variant="ghost" 
                className="w-full justify-between rounded-none h-auto p-4 hover:bg-muted/80"
              >
                <Link href="/dashboard/profile">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Personal Information</p>
                      <p className="text-sm text-muted-foreground font-normal">Update your name and profile details</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-1">
            Preferences
          </h2>
          <Card className="rounded-3xl border-0 shadow-sm overflow-hidden">
            <CardContent className="p-4 sm:p-6 border-b">
              <NotificationSettings />
            </CardContent>
            <CardContent className="p-4 sm:p-6 border-b bg-muted/30">
              <ThemeToggle />
            </CardContent>
            <CardContent className="p-4 sm:p-6 bg-muted/30">
              <PwaUpdatePrompt />
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}

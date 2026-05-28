import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-6">
      <div className="mx-auto max-w-2xl space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">
            Church Management System
          </h1>

          <p className="text-lg text-muted-foreground">
            Build devotional habits, community engagement,
            and pastoral care in one modern platform.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/login">
              Login
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
          >
            <Link href="/signup">
              Create Account
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
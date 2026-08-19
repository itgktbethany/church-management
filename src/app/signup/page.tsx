"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

// import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";


export default function SignupPage() {

  const [error, setError] = useState("");

  // const supabase = createClient();
  const router = useRouter();


  const [loading, setLoading] =
    useState(false);

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // const handleSignup = async () => {
  //   try {
  //     setLoading(true);

  //     const { error } =
  //       await supabase.auth.signUp({
  //         email,
  //         password,
  //         options: {
  //           data: {
  //             full_name: fullName,
  //           },
  //         },
  //       });

  //     if (error) {
  //       toast.error(error.message);

  //       return;
  //     }

  //     toast.success(
  //       "Your account has been created"
  //     );

  //     router.push("/dashboard");
  //   } catch (error) {
  //     toast.error(
  //       "Something went wrong"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleGoogleSignup = async () => {
  //   try {
  //     setLoading(true);

  //     const origin = window.location.origin;

  //     await supabase.auth.signInWithOAuth({
  //       provider: "google",
  //       options:{
  //           redirectTo: `${origin}/auth/callback`
  //       }
  //     });
  //   } catch (error) {
  //     toast.error(
  //       "Google signup failed"
  //     );

  //     setLoading(false);
  //   }
  // };

  async function handleSignup() {
    try {
      setLoading(true);
      setError("");

      const { error: authError } = await authClient.signUp.email({
        name: fullName,
        email,
        password,
      });

      if (authError) {
        setError(authError.message ?? "Signup Failed");
        return;
      }

      toast.success("Account created successfully");
      router.push("/dashboard");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-sm">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Create Account
            </h1>

            <p className="text-sm text-muted-foreground">
              Church Management System
            </p>
          </div>

          <div className="space-y-2">
            <Label>Full Name</Label>

            <Input
              placeholder="John Doe"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>

            <Input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              disabled={loading}
            />

          </div>

          <div className="space-y-2">
            <Label>Password</Label>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          <Button
            className="w-full"
            disabled={loading}
            onClick={handleSignup}
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </Button>

          <div className="relative">
            <Separator />

            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
              OR
            </span>
          </div>

          <Button
            variant="outline"
            className="w-full"
            disabled={loading}
          >
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground hover:underline"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
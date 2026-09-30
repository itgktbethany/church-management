"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { resetPasswordDirect } from "@/actions/reset-password";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = async () => {
    if (!email) {
      toast.error("Email wajib diisi");
      return;
    }
    if (!password) {
      toast.error("New Password wajib diisi");
      return;
    }
    if (!confirmPassword) {
      toast.error("Confirm Password wajib diisi");
      return;
    }
    if (password.length < 8) {
      toast.error("Password minimal 8 karakter");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password dan Confirm Password tidak cocok");
      return;
    }

    try {
      setLoading(true);

      const result = await resetPasswordDirect(email, password);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Password berhasil diubah.");
      router.push("/login");

    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
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
              Reset Password
            </h1>

            <p className="text-sm text-muted-foreground">
              Masukkan email dan password baru Anda
            </p>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>

            <Input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>New Password</Label>

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
          </div>

          <div className="space-y-2">
            <Label>Confirm Password</Label>

            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleReset}
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Reset Password"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="font-medium text-foreground hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

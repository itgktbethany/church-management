"use server"

import { db } from "@/lib/db";
import { user, account } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";

export async function resetPasswordDirect(email: string, newPassword: string) {
  try {
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email)
    });

    if (!existingUser) {
      return { success: false, message: "Akun dengan email tersebut tidak ditemukan." };
    }

    const hashedPassword = await hashPassword(newPassword);

    // Only update the credential (email/password) account row.
    // A user can have multiple account rows (e.g. credential + google).
    // better-auth reads the password from the row where providerId = "credential",
    // so scoping the update here ensures signIn.email picks up the new hash.
    const updated = await db.update(account)
      .set({ password: hashedPassword })
      .where(
        and(
          eq(account.userId, existingUser.id),
          eq(account.providerId, "credential"),
        )
      )
      .returning({ id: account.id });

    if (updated.length === 0) {
      return { success: false, message: "Akun email/password tidak ditemukan. Mungkin akun ini hanya menggunakan Google." };
    }

    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    return { success: false, message: "Terjadi kesalahan. Silakan coba lagi." };
  }
}

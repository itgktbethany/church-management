"use server"

import { db } from "@/lib/db";
import { user, account } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
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

    await db.update(account)
      .set({ password: hashedPassword })
      .where(eq(account.userId, existingUser.id));

    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    return { success: false, message: "Terjadi kesalahan. Silakan coba lagi." };
  }
}

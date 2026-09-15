"use server";

import db from "@/db";
import { users } from "@/db/schema";
import { revalidatePath } from "next/cache";
import type { UserRole } from "@/lib/rbac";

export async function createUserAction(formData: FormData) {
  try {
    const displayName = String(formData.get("displayName") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const role = String(formData.get("role") ?? "KINDERGARTEN_MANAGER") as UserRole;
    const educationDirectorateId = String(formData.get("educationDirectorateId") ?? "");
    const kindergartenId = String(formData.get("kindergartenId") ?? "");

    // پشکنینی سەرەتایی بۆ دڵنیابوون لە بوونی داتای پێویست
    if (!displayName) {
      return { success: false, error: "missing_name" };
    }
    if (!password || password.length < 12) {
      return { success: false, error: "password_too_short" };
    }

    if (role === "DISTRICT_EDUCATION" && !educationDirectorateId) {
      return { success: false, error: "missing_directorate" };
    }

    if (role !== "DISTRICT_EDUCATION" && !kindergartenId) {
      return { success: false, error: "missing_site" };
    }

    // لێرەدا دەتوانین پاسوۆردەکە هێش (Hash) بکەین یان بە شێوازی پارێزراو خەنی بکەین
    // بۆ نموونە: const hashedPassword = await hashPassword(password);

    // زیادکردنی بەکارهێنەر بۆ داتابەیسەکە (PostgreSQL / Supabase)
    await db.insert(users).values({
      displayName,
      passwordHash: password, // تێبینی: لە پڕۆژەی راستەقینەدا باشترە hashed password بەکاربهێنیت
      role,
      educationDirectorateId: educationDirectorateId || null,
      kindergartenId: kindergartenId || null,
    });

    // نوێکردنەوەی خێرای پەڕەکە بۆ ئەوەی گۆڕانکارییەکان لای هەمووان دەستبەجێ دەربکەون
    revalidatePath("/admin");

    return { success: true };
  } catch (err) {
    console.error("Error creating user:", err);
    return { success: false, error: "server_error" };
  }
}
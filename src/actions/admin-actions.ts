"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { revalidatePath } from "next/cache";
import type { UserRole } from "@/lib/rbac";
import { hash } from "bcryptjs";

interface CreateUserParams {
  role: UserRole;
  kindergartenId?: string;
  educationDirectorateId?: string;
  displayName: string;
  password: string;
  email?: string;
}

export async function createUserAction(params: CreateUserParams) {
  if (!params.displayName) {
    return { success: false, error: "missing_name" };
  }

  if (params.role === "DISTRICT_EDUCATION" && !params.educationDirectorateId) {
    return { success: false, error: "missing_directorate" };
  }

  if (params.role === "KINDERGARTEN_MANAGER" && !params.kindergartenId) {
    return { success: false, error: "missing_site" };
  }

  const hashedPassword = await hash(params.password, 10);
  const dummyEmail = `${Date.now()}_user@sharbazher.edu.iq`;

  try {
    await db.insert(users).values({
      name: params.displayName,
      email: params.email || dummyEmail,
      passwordHash: hashedPassword,
      role: params.role,
      kindergartenId: params.kindergartenId || null,
      educationDirectorateId: params.educationDirectorateId || null,
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    console.error("Failed to create user:", err);
    return { success: false, error: "server_error" };
  }
}
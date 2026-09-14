import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { users } from "../../src/db/schema";
import { hashPassword } from "./auth/session";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!connectionString) throw new Error("DATABASE_URL is required");
  if (!password || password.length < 12) {
    throw new Error("SEED_ADMIN_PASSWORD must be at least 12 characters");
  }

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@unicef.local";
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    await db
      .update(users)
      .set({
        passwordHash: hashPassword(password),
        isActive: 1,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existing.id));
  } else {
    await db.insert(users).values({
      email,
      passwordHash: hashPassword(password),
      displayName: "UNICEF Country Office",
      role: "SUPER_ADMIN",
      preferredLocale: "en",
      isActive: 1,
    });
  }

  await client.end();
  console.log(`Seeded administrator ${email}`);
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

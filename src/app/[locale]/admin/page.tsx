import { db } from "@/db";
import { users, kindergartens } from "@/db/schema";
import { AdminConsole } from "@/components/admin/admin-console";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const allUsers = await db.select().from(users);
  const allKindergartens = await db.select().from(kindergartens);

  const formattedUsers = allUsers.map((u) => ({
    id: u.id,
    displayName: u.displayName ?? "Unknown",
    role: u.role as any,
    kindergartenId: u.kindergartenId,
    educationDirectorateId: u.educationDirectorateId,
  }));

  const formattedKindergartens = allKindergartens.map((k: any) => ({
    id: k.id,
    name: k.nameEn || k.nameCkb || k.nameAr || "Kindergarten",
    code: k.code ?? undefined,
  }));

  const educationDirectorates = [
    { id: "sharbazher", name: "Sharbazher Directorate of Education" },
  ];

  return (
    <div className="container mx-auto py-8">
      <AdminConsole
        initialUsers={formattedUsers}
        kindergartens={formattedKindergartens}
        educationDirectorates={educationDirectorates}
      />
    </div>
  );
}
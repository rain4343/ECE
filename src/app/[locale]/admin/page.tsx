import { getTranslations, setRequestLocale } from "next-intl/server";
import { isAppLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { AdminConsole } from "@/components/admin/admin-console";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  return (
    <div className="admin-route dark -mx-4 -my-8 min-h-[calc(100vh-5rem)] px-4 py-8 lg:-mx-10 lg:-my-10 lg:px-10 lg:py-10">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-unicef">
          UNICEF
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-heading">
          {t("title")}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{t("intro")}</p>
      </header>
      <AdminConsole />
    </div>
  );
}

"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ShieldPlus, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createUserAction } from "@/actions/admin-actions";

type UserRole = "SUPER_ADMIN" | "DISTRICT_EDUCATION" | "KINDERGARTEN_MANAGER";

interface PlatformUser {
  id: string;
  displayName: string;
  role: UserRole;
  kindergartenId?: string | null;
  educationDirectorateId?: string | null;
}

interface Kindergarten {
  id: string;
  name: string;
  code?: string;
}

interface AdminConsoleProps {
  initialUsers: PlatformUser[];
  kindergartens: Kindergarten[];
  educationDirectorates: { id: string; name: string }[];
}

const EXTRA_ROLES: UserRole[] = [
  "KINDERGARTEN_MANAGER",
  "DISTRICT_EDUCATION",
  "SUPER_ADMIN",
];

const EDUCATION_DIRECTORATES = [
  { id: "sharbazher", name: "Sharbazher" },
];

export function AdminConsole({
  initialUsers,
  kindergartens,
  educationDirectorates,
}: AdminConsoleProps) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const [role, setRole] = useState<UserRole>("KINDERGARTEN_MANAGER");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const districtRole = role === "DISTRICT_EDUCATION";

  async function onAddUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setOk(null);
    const data = new FormData(event.currentTarget);
    const selectedRole = String(
      data.get("role") ?? "KINDERGARTEN_MANAGER",
    ) as UserRole;

    const result = await createUserAction({
      role: selectedRole,
      kindergartenId: String(data.get("kindergartenId") ?? ""),
      educationDirectorateId: String(data.get("educationDirectorateId") ?? ""),
      displayName: String(data.get("displayName") ?? ""),
      password: String(data.get("password") ?? ""),
    });

    if (!result.success) {
      if (result.error === "missing_name") return setError(t("missingName"));
      if (result.error === "missing_site") return setError(t("missingSite"));
      if (result.error === "missing_directorate") return setError(t("missingDirectorate"));
      return setError(t("adminsOnly"));
    }

    event.currentTarget.reset();
    setRole("KINDERGARTEN_MANAGER");
    setOk(
      selectedRole === "DISTRICT_EDUCATION"
        ? t("userAddedDistrict")
        : t("userAdded"),
    );
  }

  return (
    <div className="admin-console flex flex-col gap-6">
      <div className="admin-summary-grid">
        <div className="admin-summary-card">
          <span className="admin-summary-icon"><ShieldPlus className="h-5 w-5" /></span>
          <div>
            <p className="admin-summary-label">{t("role")}</p>
            <p className="admin-summary-value">{t("global")}</p>
          </div>
        </div>
        <div className="admin-summary-card">
          <span className="admin-summary-icon"><UsersRound className="h-5 w-5" /></span>
          <div>
            <p className="admin-summary-label">{t("directory")}</p>
            <p className="admin-summary-value">{initialUsers.length}</p>
          </div>
        </div>
      </div>

      {error ? <p className="admin-alert admin-alert-error">{error}</p> : null}
      {ok ? <p className="admin-alert admin-alert-success">{ok}</p> : null}

      <Card className="admin-panel admin-create-panel">
        <CardHeader className="admin-panel-header">
          <div>
            <p className="admin-eyebrow">UNICEF · ECE</p>
            <CardTitle>{t("addUserTitle")}</CardTitle>
          </div>
          <span className="admin-panel-mark"><ShieldPlus className="h-6 w-6" /></span>
        </CardHeader>
        <CardContent>
          <form className="admin-user-form" onSubmit={onAddUser}>
            <label className="admin-field">
              <span>{t("role")}</span>
              <select
                name="role"
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
                className="admin-control"
              >
                {EXTRA_ROLES.map((item) => (
                  <option key={item} value={item}>{t(`roles.${item}`)}</option>
                ))}
              </select>
            </label>
            {districtRole ? (
              <label className="admin-field">
                <span>{t("district")}</span>
                <select name="educationDirectorateId" required className="admin-control">
                  <option value="">{t("selectDistrict")}</option>
                  {EDUCATION_DIRECTORATES.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </label>
            ) : (
              <label className="admin-field">
                <span>{t("kindergarten")}</span>
                <select name="kindergartenId" required className="admin-control">
                  <option value="">{t("selectSite")}</option>
                  {kindergartens.map((site) => (
                    <option key={site.id} value={site.id}>{site.name}</option>
                  ))}
                </select>
              </label>
            )}
            <Field name="displayName" label={t("userName")} required />
            <Field name="password" label={t("userPassword")} type="password" required />
            <div className="admin-form-actions">
              <Button type="submit" disabled={isPending} className="admin-primary-button">{t("addUser")}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="admin-panel">
        <CardHeader className="admin-panel-header">
          <div>
            <p className="admin-eyebrow">UNICEF · DIRECTORY</p>
            <CardTitle>{t("directory")}</CardTitle>
          </div>
          <span className="admin-count-badge">{initialUsers.length}</span>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="admin-table w-full min-w-[680px] text-start text-sm">
            <thead>
              <tr>
                <th>{t("userName")}</th>
                <th>{t("role")}</th>
                <th>{t("scope")}</th>
              </tr>
            </thead>
            <tbody>
              {initialUsers.map((user) => {
                const site = kindergartens.find((row) => row.id === user.kindergartenId);
                const scope = user.role === "SUPER_ADMIN"
                  ? t("global")
                  : user.role === "DISTRICT_EDUCATION" && user.educationDirectorateId
                    ? "Sharbazher"
                    : site ? site.name : "—";
                return (
                  <tr key={user.id}>
                    <td className="font-semibold text-heading">{user.displayName}</td>
                    <td><span className="admin-role-badge">{t(`roles.${user.role}`)}</span></td>
                    <td>{scope}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <input name={name} type={type} required={required} className="admin-control" />
    </label>
  );
}
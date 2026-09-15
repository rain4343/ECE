"use client";

import { FormEvent, useState } from "react";
import { ShieldPlus, UsersRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePlatform } from "@/components/platform/platform-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  EDUCATION_DIRECTORATES,
  educationDirectorateLabel,
} from "@/content/education-directorates";
import { kindergartenLabel } from "@/lib/platform-store";
import type { AppLocale } from "@/i18n/config";
import type { UserRole } from "@/lib/rbac";

const EXTRA_ROLES: UserRole[] = [
  "KINDERGARTEN_MANAGER",
  "FIELD_MONITOR",
  "COUNCIL_MEMBER",
  "DISTRICT_EDUCATION",
];

export function AdminConsole() {
  const t = useTranslations("admin");
  const locale = useLocale() as AppLocale;
  const { currentUser, state } = usePlatform();
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>("KINDERGARTEN_MANAGER");
  const districtRole = role === "DISTRICT_EDUCATION";

  if (currentUser?.role !== "SUPER_ADMIN") {
    return (
      <Card className="admin-panel">
        <CardContent className="p-8 text-sm text-muted-foreground">
          {t("adminsOnly")}
        </CardContent>
      </Card>
    );
  }

  function onAddUser(event: FormEvent<HTMLFormElement>) {
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
      role: selectedRole,
    });
    if (result === "missing_name") return setError(t("missingName"));
    if (result === "duplicate_name") return setError(t("duplicateName"));
    if (result === "missing_site") return setError(t("missingSite"));
    if (result === "missing_directorate") return setError(t("missingDirectorate"));
    if (result) return setError(t("adminsOnly"));
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
            <p className="admin-summary-value">{state.users.length}</p>
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
                    <option key={item.id} value={item.id}>{educationDirectorateLabel(item.id, locale)}</option>
                  ))}
                </select>
              </label>
            ) : (
              <label className="admin-field">
                <span>{t("kindergarten")}</span>
                <select name="kindergartenId" required className="admin-control">
                  <option value="">{t("selectSite")}</option>
                  {state.kindergartens.map((site) => (
                    <option key={site.id} value={site.id}>{kindergartenLabel(site, locale)}</option>
                  ))}
                </select>
              </label>
            )}
            <Field name="displayName" label={t("userName")} required />
            <Field name="password" label={t("userPassword")} type="password" required minLength={12} />
            <div className="admin-form-actions">
              <Button type="submit" className="admin-primary-button">{t("addUser")}</Button>
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
          <span className="admin-count-badge">{state.users.length}</span>
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
              {state.users.map((user) => {
                const site = state.kindergartens.find((row) => row.id === user.kindergartenId);
                const scope = user.role === "SUPER_ADMIN"
                  ? t("global")
                  : user.role === "DISTRICT_EDUCATION" && user.educationDirectorateId
                    ? educationDirectorateLabel(user.educationDirectorateId, locale)
                    : site ? kindergartenLabel(site, locale) : "—";
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
  required,
  minLength,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        autoComplete={type === "password" ? "new-password" : "off"}
        className="admin-control"
      />
    </label>
  );
}

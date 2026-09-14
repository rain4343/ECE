"use client";

import { useEffect, useState } from "react";
import { FORM_2_FIELDS } from "@/content/frameworks/form-2";
import { FORM_SECTIONS, type FormSectionId } from "@/content/frameworks/types";
import type { AppLocale } from "@/i18n/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { usePlatform } from "@/components/platform/platform-provider";
import { kindergartenLabel, latestSubmission } from "@/lib/platform-store";
import { canSubmitForm } from "@/lib/rbac";

const CRITERIA: Record<FormSectionId, { en: string; ar: string; ckb: string }> = {
  BUILDING: { en: "School building:", ar: "مبنى المدرسة:", ckb: "باڵەخانەى قوتابخانە :" },
  WASH: { en: "Water and sanitation", ar: "المياه والصرف الصحي", ckb: "ئاو و ئاودەست" },
  CANTEEN: { en: "Canteen (store)", ar: "المقصف (المتجر)", ckb: "فرۆشگا(حانووت)" },
  LEARNING: { en: "Educational and learning environment", ar: "بيئة التربية والتعليم", ckb: "ژینگەى پەروەردە و فێرکردن" },
  TEACHERS: { en: "Teachers", ar: "المعلمون", ckb: "مامۆستایان" },
  ADMINISTRATION: { en: "School administration", ar: "إدارة المدرسة", ckb: "بەڕێوەبەرایەتى قوتابخانە" },
  CURRICULA: { en: "Programs", ar: "البرامج", ckb: "پرۆگرامەکان" },
  COUNCIL: { en: "Parents and teachers council", ar: "مجلس الآباء والمعلمين", ckb: "ئەنجومەنى دایباب و مامۆستایان" },
};

type Plan = Record<string, string>;

export function Form2Sections({ locale }: { locale: AppLocale }) {
  const t = useTranslations("forms");
  const { currentUser, myKindergartens, saveSubmission, state } = usePlatform();
  const readOnly = !currentUser || !canSubmitForm(currentUser.role, "FORM_2");
  const [kindergartenId, setKindergartenId] = useState(myKindergartens[0]?.id ?? "");
  const [step, setStep] = useState(0);
  const [plans, setPlans] = useState<Record<string, Plan>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!kindergartenId && myKindergartens[0]) setKindergartenId(myKindergartens[0].id);
  }, [kindergartenId, myKindergartens]);

  useEffect(() => {
    if (!kindergartenId) return;
    const submission = latestSubmission(state.submissions, kindergartenId, "FORM_2");
    setPlans(submission?.form2Plans ?? {});
    setSaved(false);
  }, [kindergartenId, state.submissions]);

  const section = FORM_SECTIONS[step] as FormSectionId;
  const values = plans[section] ?? {};
  const criterion = CRITERIA[section][locale];

  function patch(field: string, value: string) {
    if (readOnly) return;
    setSaved(false);
    setPlans((current) => ({ ...current, [section]: { ...current[section], [field]: value } }));
  }

  function submit() {
    if (!kindergartenId || readOnly) return;
    saveSubmission({ kindergartenId, formCode: "FORM_2", form2Plans: plans });
    setSaved(true);
  }

  return (
    <div className="form2-workbook flex flex-col gap-6">
      <Card className="form2-header-card">
        <CardHeader>
          <p className="form-eyebrow">UNICEF · ECE QUALITY FRAMEWORK</p>
          <CardTitle>{t("form2Title")}</CardTitle>
          <p className="text-sm text-muted-foreground">{t("form2Subtitle")}</p>
        </CardHeader>
        <CardContent>
          <label className="form2-field max-w-xl">
            <span>{t("kindergarten")}</span>
            <select value={kindergartenId} onChange={(event) => setKindergartenId(event.target.value)} disabled={readOnly}>
              {myKindergartens.map((site) => <option key={site.id} value={site.id}>{kindergartenLabel(site, locale)}</option>)}
            </select>
          </label>
        </CardContent>
      </Card>

      {readOnly ? <p className="text-base font-bold text-heading">{t("readOnly")}</p> : null}
      <ol className="form2-section-tabs" aria-label={t("steps")}>
        {FORM_SECTIONS.map((id, index) => (
          <li key={id}>
            <button type="button" className={index === step ? "active" : ""} aria-current={index === step ? "step" : undefined} onClick={() => setStep(index)}>
              <span>{index + 1}</span>{CRITERIA[id][locale]}
            </button>
          </li>
        ))}
      </ol>

      <Card className="form2-plan-card">
        <CardHeader>
          <p className="form-eyebrow">{t("section", { number: step + 1 })}</p>
          <CardTitle>{criterion}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="form2-table" role="table" aria-label={criterion}>
            <div className="form2-criterion" role="row">
              <div className="form2-criterion-number">{step + 1}</div>
              <div><span>{t("form2Criterion")}</span><strong>{criterion}</strong></div>
            </div>
            <div className="form2-fields" role="row">
              {FORM_2_FIELDS.map((field) => (
                <label key={field.id} className={`form2-field form2-field-${field.id}`}>
                  <span>{field.prompt[locale]}</span>
                  <textarea name={`${section}.${field.id}`} rows={field.id === "activityExplanation" ? 5 : 3} value={values[field.id] ?? ""} readOnly={readOnly} disabled={readOnly} onChange={(event) => patch(field.id, event.target.value)} />
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {saved ? <p className="form2-saved">{t("planSaved")}</p> : null}
      <div className="flex flex-wrap justify-between gap-2">
        <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}>{t("back")}</Button>
        {step < FORM_SECTIONS.length - 1 ? <Button type="button" onClick={() => setStep((current) => current + 1)}>{readOnly ? t("continue") : t("next")}</Button> : readOnly ? null : <Button type="button" onClick={submit}>{t("submit")}</Button>}
      </div>
      <p className="form2-signature">{t("form2Signature")}</p>
    </div>
  );
}

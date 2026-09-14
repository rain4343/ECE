"use client";

import { useEffect, useMemo, useState } from "react";
import { FORM_1_ITEMS, SECTION_TITLES } from "@/content/frameworks/form-1";
import { FORM_SECTIONS, type FormSectionId, type ScoreValue } from "@/content/frameworks/types";
import type { AppLocale } from "@/i18n/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { usePlatform } from "@/components/platform/platform-provider";
import { kindergartenLabel, latestSubmission } from "@/lib/platform-store";
import { canSubmitForm } from "@/lib/rbac";
import { scoreForm1 } from "@/lib/scoring";

const WORKBOOK_SCORES: ScoreValue[] = ["4", "2", "1"];
const NOTE_KEY = (itemId: string, field: "explanation" | "action") => `${itemId}::${field}`;

type Answers = Record<string, ScoreValue>;
type Notes = Record<string, string>;

function asScore(value: string | undefined): ScoreValue | undefined {
  return value === "1" || value === "2" || value === "3" || value === "4" || value === "NA" ? value : undefined;
}

export function Form1Sections({ locale }: { locale: AppLocale }) {
  const t = useTranslations("forms");
  const { currentUser, myKindergartens, saveSubmission, state } = usePlatform();
  const readOnly = !currentUser || !canSubmitForm(currentUser.role, "FORM_1");
  const [kindergartenId, setKindergartenId] = useState(myKindergartens[0]?.id ?? "");
  const [step, setStep] = useState(0);
  const [evaluationDate, setEvaluationDate] = useState("");
  const [evaluator, setEvaluator] = useState("");
  const [answers, setAnswers] = useState<Answers>({});
  const [notes, setNotes] = useState<Notes>({});
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (!kindergartenId && myKindergartens[0]) setKindergartenId(myKindergartens[0].id);
  }, [kindergartenId, myKindergartens]);

  useEffect(() => {
    if (!kindergartenId) return;
    const saved = latestSubmission(state.submissions, kindergartenId, "FORM_1");
    const loadedAnswers: Answers = {};
    const loadedNotes: Notes = {};
    if (saved) {
      for (const [key, value] of Object.entries(saved.form1Answers)) {
        const score = asScore(value);
        if (score) loadedAnswers[key] = score;
        if (key.endsWith("::explanation") || key.endsWith("::action")) loadedNotes[key] = value;
      }
    }
    setAnswers(loadedAnswers);
    setNotes(loadedNotes);
    const scored = scoreForm1(Object.entries(loadedAnswers).map(([itemId, score]) => ({ itemId, score })));
    setResult(scored.overallAverage != null ? String(scored.overallAverage) : null);
  }, [kindergartenId, state.submissions]);

  const section = FORM_SECTIONS[step];
  const items = useMemo(() => FORM_1_ITEMS.filter((item) => item.section === section), [section]);
  const site = myKindergartens.find((row) => row.id === kindergartenId);

  function updateNote(itemId: string, field: "explanation" | "action", value: string) {
    setNotes((current) => ({ ...current, [NOTE_KEY(itemId, field)]: value }));
  }

  function onSubmit() {
    if (readOnly || !kindergartenId) return;
    const responses = Object.entries(answers).map(([itemId, score]) => ({ itemId, score }));
    const scored = scoreForm1(responses);
    setResult(scored.overallAverage != null ? String(scored.overallAverage) : "—");
    saveSubmission({
      kindergartenId,
      formCode: "FORM_1",
      form1Answers: {
        ...answers,
        ...notes,
        "__evaluationDate": evaluationDate,
        "__evaluator": evaluator,
      },
    });
  }

  return (
    <div className="form1-workbook flex flex-col gap-6">
      <Card className="form1-header-card">
        <CardHeader>
          <p className="form-eyebrow">UNICEF · ECE QUALITY FRAMEWORK</p>
          <CardTitle>{t("form1Title")}</CardTitle>
          <p className="text-sm text-muted-foreground">{t("form1Subtitle")}</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <label className="form1-field">
            <span>{t("kindergarten")}</span>
            <select value={kindergartenId} onChange={(event) => setKindergartenId(event.target.value)} disabled={readOnly}>
              {myKindergartens.map((row) => <option key={row.id} value={row.id}>{kindergartenLabel(row, locale)}</option>)}
            </select>
          </label>
          <label className="form1-field">
            <span>{t("evaluationDate")}</span>
            <input type="date" value={evaluationDate} onChange={(event) => setEvaluationDate(event.target.value)} disabled={readOnly} />
          </label>
          <label className="form1-field md:col-span-2">
            <span>{t("evaluator")}</span>
            <input value={evaluator} onChange={(event) => setEvaluator(event.target.value)} placeholder={t("evaluatorPlaceholder")} disabled={readOnly} />
          </label>
        </CardContent>
      </Card>

      {readOnly ? <p className="text-base font-bold text-heading">{t("readOnly")}</p> : null}
      <ol className="form1-section-tabs" aria-label={t("steps")}>
        {FORM_SECTIONS.map((id, index) => (
          <li key={id}>
            <button type="button" className={index === step ? "active" : ""} aria-current={index === step ? "step" : undefined} onClick={() => setStep(index)}>
              <span>{index + 1}</span>{SECTION_TITLES[id as FormSectionId][locale]}
            </button>
          </li>
        ))}
      </ol>

      <Card className="form1-section-card">
        <CardHeader className="form1-section-header">
          <div>
            <p className="form-eyebrow">{t("section", { number: step + 1 })}</p>
            <CardTitle>{SECTION_TITLES[section][locale]}</CardTitle>
          </div>
          <span className="form1-question-count">{items.length} {t("questions")}</span>
        </CardHeader>
        <CardContent className="form1-question-list">
          {items.map((item, index) => (
            <article key={item.id} className="form1-question">
              <div className="form1-question-number">{index + 1}</div>
              <div className="form1-question-body">
                <h3>{item.prompt[locale]}</h3>
                <div className="form1-score-grid" role="radiogroup" aria-label={item.prompt[locale]}>
                  {WORKBOOK_SCORES.map((score) => (
                    <label key={score} className={answers[item.id] === score ? "selected" : ""}>
                      <input type="radio" name={item.id} value={score} checked={answers[item.id] === score} disabled={readOnly} onChange={() => setAnswers((current) => ({ ...current, [item.id]: score }))} />
                      <span>{t(`scores.${score}`)}</span>
                    </label>
                  ))}
                </div>
                <div className="form1-notes-grid">
                  <label className="form1-field"><span>{t("explanation")}</span><textarea rows={2} value={notes[NOTE_KEY(item.id, "explanation")] ?? ""} onChange={(event) => updateNote(item.id, "explanation", event.target.value)} disabled={readOnly} /></label>
                  <label className="form1-field"><span>{t("requiredAction")}</span><textarea rows={2} value={notes[NOTE_KEY(item.id, "action")] ?? ""} onChange={(event) => updateNote(item.id, "action", event.target.value)} disabled={readOnly} /></label>
                </div>
              </div>
            </article>
          ))}
        </CardContent>
      </Card>

      {result ? <p className="form1-result">{t("overall", { score: result })}</p> : null}
      <div className="flex flex-wrap justify-between gap-2">
        <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}>{t("back")}</Button>
        {step < FORM_SECTIONS.length - 1 ? <Button type="button" onClick={() => setStep((current) => Math.min(current + 1, FORM_SECTIONS.length - 1))}>{readOnly ? t("continue") : t("next")}</Button> : readOnly ? null : <Button type="button" onClick={onSubmit}>{t("submit")}</Button>}
      </div>
      {site ? <p className="text-xs text-muted-foreground">{site.code} · {t("workbookSource")}</p> : null}
    </div>
  );
}

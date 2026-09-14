import type { DevelopmentField } from "./types";

/** Form 2 columns transcribed from Form2.xlsx, in workbook order. */
export const FORM_2_FIELDS: DevelopmentField[] = [
  {
    id: "topic",
    prompt: {
      en: "Topic",
      ar: "الموضوع",
      ckb: "بابەت",
    },
  },
  {
    id: "activityExplanation",
    prompt: {
      en: "Activity explanation",
      ar: "شرح النشاط",
      ckb: "ڕوونکردنەوەى چالاکى",
    },
  },
  {
    id: "responsible",
    prompt: {
      en: "Who will do it",
      ar: "من ينفذه؟",
      ckb: "کێ دەیکات",
    },
  },
  {
    id: "resources",
    prompt: {
      en: "Resources",
      ar: "المصادر",
      ckb: "سەرچاوەکان",
    },
  },
  {
    id: "when",
    prompt: {
      en: "When will it be done?",
      ar: "متى يتم؟",
      ckb: "کەى دەکرێت ؟",
    },
  },
  {
    id: "monitor",
    prompt: {
      en: "Who will monitor it?",
      ar: "من يراقبه؟",
      ckb: "کێ چاودێرى دەکات ؟",
    },
  },
  {
    id: "budget",
    prompt: {
      en: "Required amount / USD",
      ar: "المبلغ المطلوب / دولار",
      ckb: "بڕى پارەى پێویست/دۆلار",
    },
  },
];

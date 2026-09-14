import { FORM_1_ITEMS, SECTION_TITLES } from "./form-1";
import { FORM_2_FIELDS } from "./form-2";
import { FORM_CODES, FORM_SECTIONS } from "./types";
import type { FormCode, FormSectionId, LocaleText } from "./types";

export const FORM_TITLES: Record<FormCode, LocaleText> = {
  FORM_1: {
    en: "Form No. 1 — School Evaluation by the Parents and Teachers Council",
    ar: "الاستمارة رقم (1) — تقييم المدرسة من قبل مجلس الآباء والمعلمين",
    ckb: "فۆرمى ژمارە ( ١ ) هەڵسەنگاندنى قوتابخانە لەلایەن ئەنجومەنى دایباب و مامۆستایان",
  },
  FORM_2: {
    en: "Form No. 2 — School Improvement Plan for the Academic Year",
    ar: "الاستمارة رقم (2) — خطة تطوير المدرسة للسنة الدراسية",
    ckb: "فۆرمى ژمارە ( ٢ ) پلانى پێشخستنى قوتابخانە بۆ ساڵى خوێندن",
  },
};

export function itemsBySection() {
  return FORM_SECTIONS.map((section) => ({
    section,
    title: SECTION_TITLES[section],
    items: FORM_1_ITEMS.filter((item) => item.section === section),
  }));
}

export {
  FORM_1_ITEMS,
  FORM_2_FIELDS,
  FORM_CODES,
  FORM_SECTIONS,
  SECTION_TITLES,
};

export type { FormCode, FormSectionId, LocaleText };

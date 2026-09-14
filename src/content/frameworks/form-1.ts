import type { FormItem, LocaleText } from "./types";
import type { FormSectionId } from "./types";

export const SECTION_TITLES: Record<FormSectionId, LocaleText> = {
  BUILDING: { en: "Building", ar: "المبنى", ckb: "باڵەخانە" },
  WASH: { en: "Water & Sanitation", ar: "المياه والصرف الصحي", ckb: "ئاو و ئاودەست" },
  CANTEEN: { en: "Canteen / Store", ar: "المقصف / المتجر", ckb: "فرۆشگا(حانووت)" },
  LEARNING: { en: "Educational & Learning Environment", ar: "بيئة التربية والتعليم", ckb: "ژینگەى پەروەردە و فێرکردن" },
  TEACHERS: { en: "Teachers", ar: "المعلمات والمعلمون", ckb: "مامۆستایان" },
  ADMINISTRATION: { en: "School Administration", ar: "إدارة المدرسة", ckb: "بەڕێوەبەرایەتى قوتابخانە" },
  CURRICULA: { en: "Programs", ar: "البرامج", ckb: "پرۆگرامەکان" },
  COUNCIL: { en: "Parents and Teachers Council", ar: "مجلس الآباء والمعلمين", ckb: "ئەنجومەنى دایباب و مامۆستایان" },
};

function item(id: string, section: FormSectionId, en: string, ar: string, ckb: string): FormItem {
  return { id, section, prompt: { en, ar, ckb } };
}

/**
 * Form 1 is transcribed from Form1.xlsx. The Kurdish wording intentionally
 * remains byte-for-byte aligned with the workbook, including punctuation,
 * spacing, and mixed-script terms.
 */
export const FORM_1_ITEMS: FormItem[] = [
  item("bldg.cleanliness", "BUILDING", "Are the building areas clean?", "هل أجزاء المبنى نظيفة؟", "بەشەکانى باڵەخانەکە پاکە ؟"),
  item("bldg.access", "BUILDING", "Are there barriers to accessing the school?", "هل توجد عوائق أمام الوصول إلى المدرسة؟", "بەربەست هەیە لەگەیشتن بە قوتابخانە ؟"),
  item("bldg.disability_access", "BUILDING", "Are there barriers to access for children with disabilities?", "هل توجد عوائق أمام وصول الأطفال ذوي الإعاقة إلى المدرسة؟", "بەربەست هەیە لەگەیشتنى منداڵى کەمئەندام بە قوتابخانە ؟"),
  item("bldg.safety", "BUILDING", "Is it safe?", "هل هو آمن؟", "سەلامەتە ؟"),
  item("bldg.noise", "BUILDING", "Is it away from noise and disturbing sounds?", "هل هو بعيد عن الضوضاء والأصوات المزعجة؟", "دوورە لە ژاوەژاو و دەنگى بێزارکەر ؟"),
  item("bldg.gardens", "BUILDING", "Are there gardens and greenery?", "هل توجد حدائق ومساحات خضراء؟", "باخچە و سەوزایی هەیە ؟"),
  item("bldg.playgrounds", "BUILDING", "Is there a playground?", "هل توجد ساحة للعب؟", "گۆڕەپانی یاریکردنى هەیە ؟"),
  item("bldg.roofs_gutters", "BUILDING", "Are the roofs and gutters clean?", "هل الأسطح والمزاريب نظيفة؟", "سەربان و سولاوگەکانى پاکن ؟"),
  item("bldg.natural_light", "BUILDING", "Is the classroom lighting natural?", "هل إضاءة الصفوف طبيعية؟", "ڕووناکی پۆلەکان سروشتین ؟"),
  item("bldg.class_ratio", "BUILDING", "Are the number of students in each class normal?", "هل عدد الطلاب في الصف طبيعي؟", "ژمارەى قوتابیان لە پۆلدا ئاسایین ؟"),

  item("wash.toilets_clean", "WASH", "Are the toilets clean?", "هل المراحيض نظيفة؟", "ئاودەستەکان پاکن ؟"),
  item("wash.handwashing", "WASH", "Are the handwashing stations working?", "هل مغاسل اليدين تعمل؟", "دەستشۆرەکان لە کاردان ؟"),
  item("wash.toilet_ratio", "WASH", "Is the number of toilets adequate?", "هل عدد المراحيض كافٍ؟", "ژمارەى ئاودەستەکان وەک پێویستن ؟"),
  item("wash.separated", "WASH", "Are girls' and boys' toilets separate?", "هل مراحيض البنات والبنين منفصلة؟", "ئاودەستى کچان و کوڕان لەیەک جیان ؟"),
  item("wash.safe_water", "WASH", "Is there a source of clean water at the school?", "هل يوجد مصدر للمياه النظيفة في المدرسة؟", "سەرچاوەى ئاوى پاک لە قوتابخانە هەیە ؟"),
  item("wash.tank_hygiene", "WASH", "Are the water tanks and networks safe?", "هل خزانات وشبكات المياه سليمة؟", "تانکى و تۆڕەکانی ئاو تەندروستن ؟"),
  item("wash.drinking_water", "WASH", "Is clean drinking water available?", "هل مياه الشرب النظيفة متوفرة؟", "ئاوى پاکى خواردنەوە هەیە ؟"),

  item("canteen.cleanliness", "CANTEEN", "Is it clean?", "هل هو نظيف؟", "پاکە؟"),
  item("canteen.health", "CANTEEN", "Is it healthy?", "هل هو صحي؟", "تەندروستە؟"),
  item("canteen.child_friendly", "CANTEEN", "Is it suitable for children?", "هل هو مناسب للأطفال؟", "گونجاوە بۆ منداڵ؟"),
  item("canteen.pricing", "CANTEEN", "Are the prices affordable?", "هل الأسعار رخيصة؟", "نرخەکان هەرزانە؟"),
  item("canteen.equal_access", "CANTEEN", "Do all children have the opportunity to buy food, especially the first circle?", "هل تتاح لجميع الأطفال فرصة شراء الطعام، وخاصة الحلقة الأولى؟", "ئایا گشت منداڵان دەرفەتی کڕینی خۆراکیان هەیە؟ بەتایبەتی بازنەی یەکەم ?"),

  item("learn.no_violence", "LEARNING", "Are there cases of violence against children?", "هل توجد حالات عنف ضد الأطفال؟", "حاڵەتی توندوتیژی بەرامبەر منداڵ هەیە؟"),
  item("learn.discrimination", "LEARNING", "Is there discrimination between children?", "هل يوجد تمييز بين الأطفال؟", "جیاکاری لە نێوان منداڵان کراوە؟"),
  item("learn.psych_comfort", "LEARNING", "Does the child feel comfortable?", "هل يشعر الطفل بالراحة؟", "منداڵ هەست بە ئارامی دەکات؟"),
  item("learn.dropout", "LEARNING", "Is there dropout from school?", "هل يوجد تسرب من المدرسة؟", "دابڕان لە قوتابخانە هەیە؟"),
  item("learn.sports", "LEARNING", "Are there sports activities?", "هل توجد أنشطة رياضية؟", "چالاکی وەرزشی هەیە؟"),
  item("learn.art", "LEARNING", "Are there art activities?", "هل توجد أنشطة فنية؟", "چالاکی هونەری هەیە؟"),
  item("learn.competitions", "LEARNING", "Are there competitions between students?", "هل توجد مسابقات بين الطلاب؟", "پێشبڕکێ لە نێوان قوتابیان هەیە؟"),
  item("learn.class_activities", "LEARNING", "Are activities carried out in the classroom?", "هل تُنفذ أنشطة داخل الصف؟", "چالاکی لەناو پۆل ئەنجام دەدرێت؟"),
  item("learn.library", "LEARNING", "Is there a library?", "هل توجد مكتبة؟", "کتێبخانە هەیە؟"),
  item("learn.science_labs", "LEARNING", "Is there a science laboratory?", "هل يوجد مختبر علوم؟", "تاقیگەی زانستی هەیە؟"),
  item("learn.field_trips", "LEARNING", "Are there scientific visits at the school?", "هل توجد زيارات علمية في المدرسة؟", "سەردانی زانستی هەیە لە قوتابخانە"),

  item("tch.staffing", "TEACHERS", "Is the number of teachers adequate?", "هل عدد المعلمين كافٍ؟", "میلاکی مامۆستا وەک پێویستە"),
  item("tch.participation", "TEACHERS", "Do teachers give students opportunities to participate?", "هل يمنح المعلمون الطلاب فرصاً للمشاركة؟", "مامۆستا دەرفەتی بەشداریبوون بە قوتابییان دەدەن؟"),
  item("tch.class_mgmt", "TEACHERS", "Do they control the class without problems?", "هل يسيطرون على الصف دون مشاكل؟", "بێ کێشە پۆل کۆنترۆڵ دەکەن؟"),
  item("tch.open_questions", "TEACHERS", "Do they ask students open questions so students answer themselves to broaden participation?", "هل يطرحون أسئلة مفتوحة على الطلاب لتوسيع المشاركة؟", "پرسیاری کراوە لە قوتابییان دەکەن تا قوتابییان خۆیان وەڵامبدەنەوە بۆ فراوانکردنی بازنەی بەشداربووان ؟"),
  item("tch.certification", "TEACHERS", "Have the teachers been trained?", "هل تلقى المعلمون التدريب؟", " مامۆستا ڕاهێنانی پێکراوە؟"),
  item("tch.friendly_school", "TEACHERS", "Do teachers follow child-friendly school principles?", "هل يلتزم المعلمون بمبادئ المدرسة الصديقة للطفل؟", "مامۆستا پابەندی بنەماکانی قوتابخانەی هاوڕێن؟"),

  item("adm.teacher_support", "ADMINISTRATION", "Is it supportive of teachers?", "هل تدعم المعلمين؟", "هاریکارە لەگەڵ مامۆستایان؟"),
  item("adm.student_support", "ADMINISTRATION", "Is it supportive of students?", "هل تدعم الطلاب؟", "هاریکارە لەگەڵ قوتابیان؟"),
  item("adm.parent_support", "ADMINISTRATION", "Is it supportive of students' families?", "هل تدعم أسر الطلاب؟", "هاریکارە لەگەڵ کەسوکاری قوتابیان؟"),
  item("adm.friendly", "ADMINISTRATION", "Is the school administration liked by students?", "هل تحظى إدارة المدرسة بمحبة الطلاب؟", "یەکەی کارگێڕی قوتابخانە خۆشەویستن لای قوتابی؟"),
  item("adm.student_voice", "ADMINISTRATION", "Do you listen to students' requests?", "هل تستمع إلى طلبات الطلاب؟", "گوێ لە داواکاری قوتابیان دەگریت؟"),
  item("adm.teacher_voice", "ADMINISTRATION", "Do you listen to teachers' requests?", "هل تستمع إلى طلبات المعلمين؟", "گوێ لە داواکاری مامۆستایان دەگریت؟"),
  item("adm.advancement", "ADMINISTRATION", "Have they made efforts to advance the school?", "هل بذلوا جهوداً لتطوير المدرسة؟", "هەوڵیان داوە بۆ پێشخستنی قوتابخانە؟"),
  item("adm.meetings", "ADMINISTRATION", "Are full opportunities given to participants in meetings?", "هل تُمنح فرص كاملة للمشاركين في الاجتماعات؟", "لە کۆبوونەوەکان دەرفەتی تەواو بە بەشداربووان دراوە؟"),
  item("adm.records", "ADMINISTRATION", "Are all records available?", "هل جميع السجلات متوفرة؟", "گشت تۆمارەکان لەبەردەستدان؟"),
  item("adm.cfs_network", "ADMINISTRATION", "Have you participated in the friendly schools course?", "هل شاركت في دورة المدارس الصديقة؟", "ئایا بەشداری خولی قوتابخانەکانی هاوڕێی کردووە؟"),
  item("adm.regional", "ADMINISTRATION", "Does the school administration coordinate with the administrations of schools in the area?", "هل تنسق إدارة المدرسة مع إدارات مدارس المنطقة؟", "بەڕێوەبەرایەتى قوتابخانە هەماهەنگى هەیە لەگەڵ بەڕێوەبەرەکانى قوتابخانەى ناوچەکە ؟"),

  item("cur.textbooks", "CURRICULA", "Are books available to students as needed?", "هل الكتب متوفرة للطلاب حسب الحاجة؟", "کتێبەکان وەک پێویست لەبەردەستى قوتابیدان ؟"),
  item("cur.tools", "CURRICULA", "Are teaching aids available?", "هل وسائل التعليم متوفرة؟", "هۆیەکانى فێرکردن هەیە ؟"),
  item("cur.lab_library_use", "CURRICULA", "Do students benefit from the library?", "هل يستفيد الطلاب من المكتبة؟", "قوتابيان سوود له کتیبخانه وەردەگرن؟"),
  item("cur.science_lab_use", "CURRICULA", "Do students benefit from the science laboratory?", "هل يستفيد الطلاب من مختبر العلوم؟", "قوتابيان سوود له تاقیگەی زانستی وەردەگرن؟"),
  item("cur.daily_life", "CURRICULA", "Have the programs had an impact on children's lives?", "هل كان للبرامج أثر على حياة الأطفال؟", "پرۆگرامەکان کاردانەوەیان هەبووە له سەر ژیانی مندالآن؟"),

  item("cou.home_visits", "COUNCIL", "Have students' homes been visited?", "هل تمت زيارة منازل الطلاب؟", "سەردانی مالی قوتابیان كراوه؟"),
  item("cou.support", "COUNCIL", "Has support been provided to the school?", "هل قُدم الدعم للمدرسة؟", "هاوکاری پیشکەشی قوتابخانه کراوه ؟"),
  item("cou.documentation", "COUNCIL", "Have the activities been recorded?", "هل تم تسجيل الأنشطة؟", "چالاکیەکان تۆماركراون؟"),
  item("cou.problem_solving", "COUNCIL", "Have you participated in solving school/children's problems?", "هل شاركت في حل مشاكل المدرسة/الأطفال؟", "بەشداریکراوه له چارەسەرکردنی کیشەکانی قوتابخانە/مندالآن ؟"),
  item("cou.meetings", "COUNCIL", "Was there a work plan before or during the meetings?", "هل كانت هناك خطة عمل قبل أو أثناء عقد الاجتماعات؟", "خشتەی کار هەبووه بەر یان له کاتی نەنجامدانی كۆبوونەوەكان ؟"),
];

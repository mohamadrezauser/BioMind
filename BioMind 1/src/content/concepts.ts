import type { ConceptDefinition } from "@/types";

// Each concept is modular so a teacher can edit wording without touching app logic.
export const CONCEPTS: ConceptDefinition[] = [
  {
    id: "mech_vs_chem",
    title: "گوارش مکانیکی در مقابل گوارش شیمیایی",
    shortTitle: "مکانیکی / شیمیایی",
    explanation:
      "گوارش مکانیکی یعنی خرد شدن و مخلوط شدن فیزیکی غذا بدون تغییر ساختار شیمیایی مولکول‌ها (مثل جویدن توسط دندان یا ورز دادن معده). گوارش شیمیایی یعنی شکستن پیوندهای شیمیایی مولکول‌های بزرگ به مولکول‌های کوچک‌تر به کمک آنزیم‌ها (مثل تجزیه نشاسته به قند توسط آمیلاز). این دو فرآیند معمولاً همزمان و مکمل هم انجام می‌شوند.",
    analogy:
      "گوارش مکانیکی مثل خرد کردن یک سیب با چاقو به تکه‌های کوچک‌تر است؛ شکل تکه‌ها عوض می‌شود ولی هنوز «سیب» است. گوارش شیمیایی مثل این است که قند موجود در سیب را با واکنش شیمیایی به مولکول‌های دیگر تبدیل کنیم؛ ماده از نظر شیمیایی عوض می‌شود.",
    prerequisites: [],
    relatedOrgans: ["mouth", "teeth_tongue", "stomach", "small_intestine"],
    relatedProcesses: ["mechanical", "chemical"],
    commonMisconceptionIds: ["mis_enzyme_everything"],
    sourceNote: "مطابق مفاهیم عمومی کتاب زیست‌شناسی دهم؛ برای عبارت دقیق کتاب به متن رسمی مراجعه شود.",
  },
  {
    id: "organ_functions",
    title: "عملکرد اندام‌های دستگاه گوارش",
    shortTitle: "عملکرد اندام‌ها",
    explanation:
      "هر اندام دستگاه گوارش نقش ویژه‌ای دارد: دهان (خرد کردن و شروع هضم نشاسته)، معده (هضم پروتئین در محیط اسیدی)، روده باریک (تکمیل هضم و جذب اصلی مواد مغذی)، روده بزرگ (جذب آب و تشکیل مدفوع). این اندام‌ها به‌صورت یک مسیر به‌هم‌پیوسته کار می‌کنند، نه به‌صورت جدا از هم.",
    analogy:
      "دستگاه گوارش مثل یک خط تولید کارخانه است؛ هر ایستگاه (اندام) یک وظیفه مشخص دارد و محصول نیمه‌کاره را به ایستگاه بعدی تحویل می‌دهد.",
    prerequisites: [],
    relatedOrgans: ["mouth", "stomach", "small_intestine", "large_intestine", "liver", "pancreas"],
    relatedProcesses: ["mechanical", "chemical", "absorption", "elimination"],
    commonMisconceptionIds: ["mis_small_large_confusion"],
    sourceNote: "مطابق مفاهیم عمومی کتاب زیست‌شناسی دهم.",
  },
  {
    id: "enzymes_substrates",
    title: "آنزیم‌ها و اختصاصی بودن آن‌ها نسبت به بستر (سوبسترا)",
    shortTitle: "آنزیم و بستر",
    explanation:
      "هر آنزیم گوارشی معمولاً فقط روی یک نوع مولکول خاص (بستر) اثر می‌کند؛ مثلاً آمیلاز فقط روی نشاسته، پپسین و تریپسین روی پروتئین‌ها، و لیپاز روی چربی‌ها اثر می‌کنند. یک آنزیم نمی‌تواند هر نوع ماده غذایی را تجزیه کند.",
    analogy: "آنزیم مثل یک کلید است که فقط در یک قفل خاص (بستر خودش) جا می‌شود، نه هر قفلی.",
    prerequisites: ["mech_vs_chem"],
    relatedOrgans: ["mouth", "stomach", "pancreas", "small_intestine"],
    relatedProcesses: ["chemical"],
    commonMisconceptionIds: ["mis_enzyme_everything"],
    sourceNote: "مطابق مفاهیم عمومی زیست‌شناسی سلولی و کتاب دهم.",
  },
  {
    id: "bile_role",
    title: "نقش صفرا در گوارش چربی",
    shortTitle: "نقش صفرا",
    explanation:
      "صفرا توسط کبد ساخته و در کیسه صفرا ذخیره می‌شود. صفرا یک آنزیم نیست و هیچ پیوند شیمیایی را نمی‌شکند؛ وظیفهٔ آن امولسیون‌سازی (خرد کردن قطرات بزرگ چربی به قطرات ریزتر) است تا سطح تماس چربی با آنزیم لیپاز افزایش یابد و هضم آنزیمی چربی سریع‌تر انجام شود.",
    analogy:
      "صفرا مثل مایع ظرف‌شویی است که چربی روی ظرف را به قطرات ریز تبدیل می‌کند تا آب راحت‌تر آن را بشوید؛ خود مایع ظرف‌شویی چربی را «هضم» نمی‌کند، فقط سطح آن را برای شست‌وشو آماده می‌کند.",
    prerequisites: ["enzymes_substrates"],
    relatedOrgans: ["liver", "gallbladder", "small_intestine"],
    relatedProcesses: ["chemical"],
    commonMisconceptionIds: ["mis_bile_is_enzyme"],
    sourceNote: "مطابق مفاهیم عمومی زیست‌شناسی دهم و منابع زیست‌شناسی عمومی.",
  },
  {
    id: "sequence",
    title: "توالی فرآیندهای گوارشی",
    shortTitle: "توالی گوارش",
    explanation:
      "مسیر اصلی غذا به ترتیب: دهان ← حلق ← مری ← معده ← روده باریک ← روده بزرگ ← راست‌روده ← مقعد است. کبد، کیسه صفرا و پانکراس اندام‌های کمکی هستند که ترشحات خود را به روده باریک می‌فرستند اما غذا مستقیماً از آن‌ها عبور نمی‌کند.",
    analogy: "این توالی مثل ایستگاه‌های یک قطار است که به ترتیب خاصی طی می‌شوند و نمی‌توان یک ایستگاه را حذف کرد.",
    prerequisites: ["organ_functions"],
    relatedOrgans: ["mouth", "pharynx", "esophagus", "stomach", "small_intestine", "large_intestine", "rectum", "anus"],
    relatedProcesses: ["mechanical", "chemical", "absorption", "elimination"],
    commonMisconceptionIds: [],
    sourceNote: "مطابق فصل گوارش کتاب زیست‌شناسی دهم.",
  },
  {
    id: "digestion_vs_absorption",
    title: "تفاوت گوارش و جذب",
    shortTitle: "گوارش و جذب",
    explanation:
      "گوارش یعنی شکستن مولکول‌های بزرگ غذا به واحدهای کوچک‌تر (مکانیکی یا شیمیایی). جذب یعنی عبور این واحدهای کوچک از دیواره لوله گوارش (عمدتاً روده باریک) به درون خون یا لنف. غذا ابتدا باید هضم شود تا قابل جذب باشد؛ هضم و جذب دو فرآیند جدا اما پیاپی هستند.",
    analogy:
      "گوارش مثل خرد کردن سنگ‌های بزرگ به شن‌های ریز است؛ جذب مثل عبور دادن آن شن‌های ریز از یک غربال به سطل دیگر (خون) است. تا وقتی سنگ‌ها خرد نشوند از غربال رد نمی‌شوند.",
    prerequisites: ["mech_vs_chem"],
    relatedOrgans: ["small_intestine", "large_intestine", "stomach"],
    relatedProcesses: ["chemical", "absorption"],
    commonMisconceptionIds: ["mis_digestion_is_absorption", "mis_all_absorption_in_stomach"],
    sourceNote: "مطابق مفاهیم عمومی کتاب زیست‌شناسی دهم.",
  },
  {
    id: "villi_role",
    title: "نقش پرز‌ها و ریزپرزهای روده",
    shortTitle: "پرز روده",
    explanation:
      "دیواره داخلی روده باریک چین‌خوردگی‌های فراوان و برآمدگی‌های ریز انگشتی‌شکل به نام پُرز (villus) دارد و سطح سلول‌های پرز نیز با ریزپرزها (microvilli) پوشیده شده است. این ساختارها سطح تماس روده با مواد غذایی را بسیار افزایش می‌دهند و جذب مواد مغذی را کارآمدتر می‌کنند. هر پرز شبکه‌ای از مویرگ‌های خونی و یک مویرگ لنفی مرکزی (لاکتیل) دارد.",
    analogy: "افزایش سطح با پرزها مثل استفاده از یک حوله کرکی به‌جای یک پارچه صاف برای جذب سریع‌تر آب است؛ سطح بیشتر یعنی جذب بیشتر در زمان کمتر.",
    prerequisites: ["digestion_vs_absorption"],
    relatedOrgans: ["small_intestine"],
    relatedProcesses: ["absorption"],
    commonMisconceptionIds: ["mis_all_absorption_in_stomach"],
    sourceNote: "مطابق فصل گوارش کتاب زیست‌شناسی دهم.",
  },
  {
    id: "nutrient_transport",
    title: "مسیر انتقال مواد مغذی جذب‌شده",
    shortTitle: "مسیر انتقال مواد",
    explanation:
      "گلوکز و اسیدهای آمینه (محلول در آب) پس از جذب توسط سلول‌های پرز، وارد مویرگ‌های خونی پرز می‌شوند و از طریق سیاهرگ باب به کبد و سپس به کل بدن می‌رسند. بیشتر محصولات جذب‌شده هضم چربی (مثل مونوگلیسیرید و اسید چرب) ابتدا به شکل ذرات کوچک در سلول‌های پرز بازسازی شده و وارد مویرگ‌های لنفی (لاکتیل) می‌شوند، سپس از طریق سامانه لنفی در نهایت به جریان خون می‌پیوندند. یعنی مسیر اولیه مواد مغذی متفاوت است، نه یکسان.",
    analogy: "می‌توان آن را مثل دو مسیر حمل‌ونقل متفاوت در یک شهر دانست؛ برخی کالاها (گلوکز و اسید آمینه) مستقیم با مسیر اصلی (خون) جابه‌جا می‌شوند، برخی دیگر (چربی‌ها) ابتدا از مسیر فرعی (لنف) عبور می‌کنند و بعد به مسیر اصلی می‌پیوندند.",
    prerequisites: ["villi_role"],
    relatedOrgans: ["small_intestine"],
    relatedProcesses: ["absorption", "transport"],
    commonMisconceptionIds: ["mis_same_transport_route"],
    sourceNote: "مطابق مفاهیم عمومی زیست‌شناسی دهم و منابع زیست‌شناسی عمومی.",
  },
  {
    id: "secretions_ph",
    title: "ترشحات گوارشی و نقش pH",
    shortTitle: "ترشحات و pH",
    explanation:
      "اسید کلریدریک (HCl) در معده محیط را اسیدی می‌کند تا پپسینوژن به پپسین فعال تبدیل شود و پپسین در آن محیط اسیدی بهترین عملکرد را داشته باشد. وقتی کیموس اسیدی وارد روده باریک می‌شود، بی‌کربنات ترشح‌شده از پانکراس آن را خنثی می‌کند تا آنزیم‌های روده‌ای و پانکراسی -که در محیط کمی قلیایی بهتر کار می‌کنند- فعال شوند. HCl و بی‌کربنات خودشان آنزیم نیستند.",
    analogy: "تغییر pH مثل تنظیم دمای یک استخر شنا برای هر گروه شناگر است؛ هر آنزیم فقط در دمای (pH) مناسب خودش بهترین عملکرد را دارد.",
    prerequisites: ["enzymes_substrates"],
    relatedOrgans: ["stomach", "pancreas", "small_intestine"],
    relatedProcesses: ["chemical"],
    commonMisconceptionIds: ["mis_bile_is_enzyme"],
    sourceNote: "مطابق مفاهیم عمومی کتاب زیست‌شناسی دهم.",
  },
  {
    id: "large_intestine_role",
    title: "نقش روده بزرگ",
    shortTitle: "نقش روده بزرگ",
    explanation:
      "روده بزرگ محل اصلی جذب مواد مغذی مثل گلوکز و اسیدهای آمینه نیست؛ این جذب عمدتاً پیش‌تر در روده باریک انجام شده است. وظیفه اصلی روده بزرگ، جذب آب و برخی یون‌ها از مواد باقی‌مانده و شکل‌دهی و ذخیره موقت مدفوع است.",
    analogy: "روده بزرگ مثل بخش نهایی خشک‌کن در یک کارخانه است که رطوبت باقی‌مانده را می‌گیرد، نه بخش اصلی جمع‌آوری محصول.",
    prerequisites: ["digestion_vs_absorption"],
    relatedOrgans: ["large_intestine", "small_intestine"],
    relatedProcesses: ["absorption", "elimination"],
    commonMisconceptionIds: ["mis_small_large_confusion"],
    sourceNote: "مطابق فصل گوارش کتاب زیست‌شناسی دهم.",
  },
];

export const CONCEPT_MAP: Record<string, ConceptDefinition> = Object.fromEntries(
  CONCEPTS.map((c) => [c.id, c])
);

export const CONCEPT_ORDER = CONCEPTS.map((c) => c.id);

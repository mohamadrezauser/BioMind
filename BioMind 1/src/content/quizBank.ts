import type { QuizQuestion } from "@/types";
import { QUIZ_BANK_EXTRA } from "./quizBankExtra";

// A curated question bank covering all required formats, difficulties and concepts.
// Every question has been checked for scientific accuracy at Grade-10 curricular depth.
const QUIZ_BANK_CORE: QuizQuestion[] = [
  // ---------- digestion_vs_absorption ----------
  {
    id: "q_da_1",
    type: "mcq",
    conceptId: "digestion_vs_absorption",
    difficulty: "beginner",
    skillType: "conceptual",
    prompt: "کدام گزینه تفاوت «گوارش» و «جذب» را درست بیان می‌کند؟",
    options: [
      "گوارش و جذب هر دو دقیقاً یک فرآیند هستند.",
      "گوارش یعنی خرد و تجزیه‌شدن غذا؛ جذب یعنی عبور مواد کوچک از دیواره روده به خون یا لنف.",
      "جذب همیشه قبل از گوارش اتفاق می‌افتد.",
      "گوارش فقط در دهان و جذب فقط در معده رخ می‌دهد.",
    ],
    correctIndex: 1,
    hint: "به ترتیب رخ‌دادن این دو فرآیند فکر کن: چه چیزی باید اول اتفاق بیفتد؟",
    explanationCorrect:
      "درست است. غذا باید ابتدا به مولکول‌های کوچک تجزیه (گوارش) شود تا بتواند از دیواره روده عبور کند (جذب).",
    explanationIncorrect:
      "گوارش (تجزیه مولکول‌های بزرگ) همیشه پیش‌نیاز جذب (عبور مولکول‌های کوچک به خون/لنف) است؛ این دو فرآیند جدا اما پیاپی‌اند.",
    misconceptionByOption: { 0: "mis_digestion_is_absorption" },
  },
  {
    id: "q_da_2",
    type: "true_false",
    conceptId: "digestion_vs_absorption",
    difficulty: "beginner",
    skillType: "conceptual",
    prompt: "درست یا نادرست: یک ماده غذایی می‌تواند بدون هضم‌شدن، مستقیماً جذب بدن شود.",
    options: ["درست", "نادرست"],
    correctIndex: 1,
    hint: "آیا مولکول‌های بزرگ می‌توانند از دیواره روده عبور کنند؟",
    explanationCorrect: "درست می‌گویی؛ فقط موادی که به‌اندازه کافی کوچک شده باشند (مثل آب، یون‌ها، یا محصولات نهایی گوارش) می‌توانند جذب شوند.",
    explanationIncorrect:
      "نادرست است. مولکول‌های بزرگ (نشاسته، پروتئین، چربی) باید ابتدا هضم و به واحدهای کوچک تبدیل شوند تا قابل جذب باشند. برخی مواد ساده مثل آب یا یون‌ها نیاز به هضم ندارند و مستقیماً جذب می‌شوند.",
  },
  {
    id: "q_da_3",
    type: "scenario",
    conceptId: "digestion_vs_absorption",
    difficulty: "intermediate",
    skillType: "conceptual",
    prompt:
      "یک دانش‌آموز می‌گوید: «وقتی نان می‌جویم، گوارش و جذب آن هم‌زمان در دهان تمام می‌شود.» کدام بخش این جمله نادرست است؟",
    options: [
      "جویدن نان اصلاً گوارش محسوب نمی‌شود.",
      "گوارش نشاسته در دهان شروع می‌شود ولی جذب گلوکز حاصل در دهان اتفاق نمی‌افتد؛ جذب در روده باریک رخ می‌دهد.",
      "دهان اصلاً هیچ نقشی در گوارش نشاسته ندارد.",
      "جمله کاملاً درست است.",
    ],
    correctIndex: 1,
    hint: "دهان کجای مسیر گوارش قرار دارد؟ آیا دیواره دهان برای جذب گلوکز طراحی شده است؟",
    explanationCorrect:
      "درست است؛ جویدن و آمیلاز بزاقی گوارش نشاسته را در دهان آغاز می‌کنند، اما جذب واقعی گلوکز در روده باریک (که برای جذب تخصص یافته) انجام می‌شود.",
    explanationIncorrect: "دهان محل شروع گوارش مکانیکی و شیمیایی نشاسته است، اما جذب مواد مغذی در روده باریک رخ می‌دهد نه در دهان.",
  },

  // ---------- bile_role ----------
  {
    id: "q_bile_1",
    type: "mcq",
    conceptId: "bile_role",
    difficulty: "beginner",
    skillType: "conceptual",
    prompt: "صفرا چه نقشی در گوارش چربی دارد؟",
    options: [
      "صفرا یک آنزیم است که پیوندهای چربی را می‌شکند.",
      "صفرا قطرات بزرگ چربی را به قطرات ریزتر تبدیل می‌کند (امولسیون‌سازی) تا لیپاز بهتر عمل کند.",
      "صفرا چربی را مستقیماً به گلوکز تبدیل می‌کند.",
      "صفرا هیچ نقشی در گوارش ندارد و فقط دفع می‌شود.",
    ],
    correctIndex: 1,
    hint: "به تفاوت «شکستن پیوند شیمیایی» و «افزایش سطح تماس» فکر کن.",
    explanationCorrect: "درست است. صفرا با امولسیون‌سازی سطح تماس چربی با آنزیم لیپاز را افزایش می‌دهد، اما خودش آنزیم نیست.",
    explanationIncorrect: "صفرا آنزیم نیست و پیوند شیمیایی نمی‌شکند؛ فقط چربی را به قطرات ریزتر تبدیل می‌کند تا لیپاز راحت‌تر کار کند.",
    misconceptionByOption: { 0: "mis_bile_is_enzyme" },
  },
  {
    id: "q_bile_2",
    type: "true_false",
    conceptId: "bile_role",
    difficulty: "intermediate",
    skillType: "conceptual",
    prompt: "درست یا نادرست: بدون صفرا، لیپاز اصلاً نمی‌تواند روی چربی اثر بگذارد.",
    options: ["درست", "نادرست"],
    correctIndex: 1,
    hint: "صفرا سرعت واکنش را زیاد می‌کند یا اصلاً اجازه واکنش را می‌دهد؟",
    explanationCorrect:
      "درست گفتی؛ لیپاز می‌تواند بدون صفرا هم تا حدی روی چربی اثر بگذارد، اما بدون امولسیون‌سازی صفرا این فرآیند بسیار کندتر و ناکارآمدتر خواهد بود.",
    explanationIncorrect:
      "نادرست است. صفرا کارایی لیپاز را با افزایش سطح تماس بسیار بالا می‌برد، اما نبودِ کامل صفرا به‌معنای صفر شدن کامل فعالیت لیپاز نیست؛ فقط فرآیند بسیار کند و ناکارآمد می‌شود.",
  },
  {
    id: "q_bile_3",
    type: "matching",
    conceptId: "bile_role",
    difficulty: "intermediate",
    skillType: "conceptual",
    prompt: "هر ماده را به توضیح درست آن وصل کن.",
    pairs: [
      { left: "صفرا", right: "امولسیون‌سازی چربی (غیر آنزیمی)" },
      { left: "لیپاز", right: "تجزیه شیمیایی چربی به اسید چرب و مونوگلیسیرید" },
      { left: "پپسین", right: "تجزیه شیمیایی پروتئین در معده" },
      { left: "آمیلاز", right: "تجزیه شیمیایی نشاسته به قندهای کوچک‌تر" },
    ],
    hint: "فقط یکی از این چهار ماده، آنزیم نیست؛ آن را مشخص کن.",
    explanationCorrect: "عالی! صفرا تنها ماده غیرآنزیمی در این فهرست است و نقش کمکی (امولسیون‌سازی) دارد.",
    explanationIncorrect: "به یاد داشته باش: صفرا آنزیم نیست. لیپاز، پپسین و آمیلاز آنزیم هستند و هرکدام روی یک بستر خاص اثر می‌کنند.",
  },

  // ---------- villi_role / absorption ----------
  {
    id: "q_abs_1",
    type: "mcq",
    conceptId: "villi_role",
    difficulty: "beginner",
    skillType: "recall",
    prompt: "جذب اصلی مواد مغذی مانند گلوکز و اسیدهای آمینه عمدتاً در کدام اندام انجام می‌شود؟",
    options: ["معده", "روده باریک", "روده بزرگ", "مری"],
    correctIndex: 1,
    hint: "کدام اندام پر از پرز و ریزپرز است؟",
    explanationCorrect: "درست است؛ روده باریک با داشتن پرز و ریزپرز، سطح جذب بسیار بزرگی دارد.",
    explanationIncorrect:
      "پاسخ درست «روده باریک» است. معده عمدتاً محل هضم پروتئین است نه جذب گسترده، و روده بزرگ عمدتاً آب را جذب می‌کند.",
    misconceptionByOption: { 0: "mis_all_absorption_in_stomach", 2: "mis_small_large_confusion" },
  },
  {
    id: "q_abs_2",
    type: "short_answer",
    conceptId: "villi_role",
    difficulty: "intermediate",
    skillType: "conceptual",
    prompt: "چرا وجود پرز و ریزپرز در روده باریک باعث جذب بهتر مواد مغذی می‌شود؟ (با یک جمله کوتاه توضیح بده)",
    acceptableAnswers: [
      "چون سطح تماس روده را زیاد می کند",
      "افزایش سطح تماس",
      "سطح جذب را افزایش می دهد",
      "باعث افزایش سطح داخلی روده می شود",
    ],
    hint: "کلمه کلیدی: «سطح تماس»",
    explanationCorrect: "دقیقاً؛ پرز و ریزپرز سطح تماس دیواره روده با مواد غذایی را چند برابر می‌کنند و جذب را سریع‌تر و مؤثرتر می‌سازند.",
    explanationIncorrect:
      "پاسخ کلیدی این است: پرز و ریزپرز سطح تماس داخلی روده را بسیار افزایش می‌دهند، بنابراین در زمان کوتاه‌تر، مواد مغذی بیشتری جذب می‌شود.",
  },
  {
    id: "q_abs_3",
    type: "ordering",
    conceptId: "villi_role",
    difficulty: "advanced",
    skillType: "conceptual",
    prompt: "اندام‌های زیر را بر اساس «میزان نقش آن‌ها در جذب مواد مغذی اصلی»، از بیشترین به کمترین مرتب کن.",
    items: ["روده باریک", "روده بزرگ", "معده"],
    correctOrder: [0, 1, 2],
    labelTargets: ["small_intestine", "large_intestine", "stomach"],
    hint: "کدام اندام پرز دارد؟ کدام فقط آب جذب می‌کند؟ کدام اصلاً برای جذب تخصصی نیست؟",
    explanationCorrect: "درست؛ روده باریک > روده بزرگ (فقط آب و یون) > معده (جذب بسیار محدود).",
    explanationIncorrect: "ترتیب درست: روده باریک (جذب اصلی مواد مغذی) > روده بزرگ (جذب آب) > معده (جذب بسیار ناچیز).",
  },

  // ---------- large_intestine_role ----------
  {
    id: "q_intestine_1",
    type: "mcq",
    conceptId: "large_intestine_role",
    difficulty: "beginner",
    skillType: "conceptual",
    prompt: "وظیفه اصلی روده بزرگ در مقایسه با روده باریک چیست؟",
    options: [
      "روده بزرگ محل اصلی جذب گلوکز و اسید آمینه است.",
      "روده بزرگ عمدتاً آب و برخی یون‌ها را جذب و مدفوع را شکل می‌دهد.",
      "روده بزرگ محل ترشح پپسین است.",
      "روده بزرگ محل هضم اولیه نشاسته است.",
    ],
    correctIndex: 1,
    hint: "فکر کن چرا مدفوع نسبت به کیموس ورودی، خشک‌تر است.",
    explanationCorrect: "درست؛ روده بزرگ بیشتر آب را جذب می‌کند و باقیمانده را به مدفوع تبدیل می‌کند.",
    explanationIncorrect:
      "جذب گلوکز و اسید آمینه در روده باریک انجام می‌شود. روده بزرگ عمدتاً آب و یون جذب می‌کند، نه مواد مغذی اصلی.",
    misconceptionByOption: { 0: "mis_small_large_confusion" },
  },
  {
    id: "q_intestine_2",
    type: "ordering",
    conceptId: "sequence",
    difficulty: "intermediate",
    skillType: "recall",
    prompt: "اندام‌های زیر را به ترتیب درست مسیر اصلی عبور غذا مرتب کن.",
    items: ["روده بزرگ", "دهان", "روده باریک", "معده", "مری"],
    correctOrder: [1, 4, 3, 2, 0],
    hint: "اول کجا غذا وارد بدن می‌شود؟",
    explanationCorrect: "آفرین! ترتیب درست: دهان ← مری ← معده ← روده باریک ← روده بزرگ.",
    explanationIncorrect: "ترتیب درست: دهان ← مری ← معده ← روده باریک ← روده بزرگ.",
  },

  // ---------- nutrient_transport ----------
  {
    id: "q_transport_1",
    type: "mcq",
    conceptId: "nutrient_transport",
    difficulty: "intermediate",
    skillType: "conceptual",
    prompt: "مقصد اولیهٔ بیشتر محصولات جذب‌شده هضم چربی (مثل مونوگلیسیرید و اسید چرب) پس از ورود به سلول‌های پرز روده کدام است؟",
    options: [
      "مستقیماً مویرگ خونی، درست مثل گلوکز",
      "ابتدا مویرگ لنفی (لاکتیل)، سپس پیوستن به جریان خون از طریق سامانه لنفی",
      "مستقیماً کبد بدون عبور از روده",
      "این مواد اصلاً جذب نمی‌شوند",
    ],
    correctIndex: 1,
    hint: "آیا همه مواد جذب‌شده از یک مسیر وارد خون می‌شوند؟",
    explanationCorrect: "درست است! برخلاف گلوکز و اسید آمینه، بیشتر محصولات چربی ابتدا وارد مویرگ لنفی می‌شوند.",
    explanationIncorrect:
      "گلوکز و اسید آمینه مستقیماً وارد خون می‌شوند، اما بیشتر محصولات چربی ابتدا وارد مویرگ‌های لنفی (لاکتیل) شده و سپس از طریق سامانه لنفی به خون می‌پیوندند.",
    misconceptionByOption: { 0: "mis_same_transport_route" },
  },
  {
    id: "q_transport_2",
    type: "matching",
    conceptId: "nutrient_transport",
    difficulty: "advanced",
    skillType: "conceptual",
    prompt: "هر ماده مغذی را به مسیر انتقال اولیه‌اش وصل کن.",
    pairs: [
      { left: "گلوکز", right: "مویرگ خونی" },
      { left: "اسید آمینه", right: "مویرگ خونی" },
      { left: "اسید چرب و مونوگلیسیرید", right: "مویرگ لنفی (لاکتیل)" },
    ],
    hint: "کدام مولکول‌ها در آب محلول‌اند؟",
    explanationCorrect: "دقیقاً درست! مواد محلول در آب از مسیر خون و محصولات چربی عمدتاً از مسیر لنف می‌روند.",
    explanationIncorrect: "گلوکز و اسید آمینه محلول در آب هستند و مستقیم وارد خون می‌شوند؛ محصولات چربی ابتدا وارد مسیر لنفی می‌شوند.",
  },

  // ---------- enzymes_substrates ----------
  {
    id: "q_enzyme_1",
    type: "mcq",
    conceptId: "enzymes_substrates",
    difficulty: "beginner",
    skillType: "conceptual",
    prompt: "اگر آنزیم آمیلاز را روی یک قطعه پروتئین خالص بریزیم، چه اتفاقی می‌افتد؟",
    options: [
      "پروتئین به‌سرعت تجزیه می‌شود، چون آمیلاز روی هر مولکولی اثر دارد.",
      "تقریباً هیچ تجزیه‌ای رخ نمی‌دهد، چون آمیلاز فقط روی نشاسته اثر می‌کند.",
      "پروتئین به چربی تبدیل می‌شود.",
      "آمیلاز به اسید معده تبدیل می‌شود.",
    ],
    correctIndex: 1,
    hint: "بستر اختصاصی آمیلاز چیست؟",
    explanationCorrect: "درست؛ آمیلاز فقط نشاسته را می‌شناسد و روی آن اثر می‌گذارد، نه پروتئین را.",
    explanationIncorrect: "آمیلاز فقط روی نشاسته اثر می‌کند (اختصاصی بودن آنزیم)؛ برای تجزیه پروتئین به آنزیم‌هایی مثل پپسین یا تریپسین نیاز است.",
    misconceptionByOption: { 0: "mis_enzyme_everything" },
  },
  {
    id: "q_enzyme_2",
    type: "matching",
    conceptId: "enzymes_substrates",
    difficulty: "intermediate",
    skillType: "recall",
    prompt: "هر آنزیم را به بستر (ماده‌ای که روی آن اثر می‌کند) وصل کن.",
    pairs: [
      { left: "آمیلاز بزاقی", right: "نشاسته" },
      { left: "پپسین", right: "پروتئین" },
      { left: "لیپاز پانکراسی", right: "چربی" },
      { left: "تریپسین", right: "پروتئین" },
    ],
    hint: "به نام آنزیم‌ها دقت کن؛ اغلب از نام بستر مشتق شده‌اند.",
    explanationCorrect: "عالی! هر آنزیم فقط با بستر اختصاصی خودش واکنش می‌دهد.",
    explanationIncorrect: "یادآوری: آمیلاز روی نشاسته، پپسین و تریپسین روی پروتئین، و لیپاز روی چربی اثر می‌کنند.",
  },
  {
    id: "q_enzyme_3",
    type: "scenario",
    conceptId: "secretions_ph",
    difficulty: "advanced",
    skillType: "conceptual",
    prompt:
      "در یک آزمایش، پپسین در محیط کاملاً قلیایی (بازی) قرار می‌گیرد. بر اساس دانش گوارش، بهترین پیش‌بینی کدام است؟",
    options: [
      "پپسین بهتر از همیشه کار می‌کند.",
      "فعالیت پپسین به‌شدت کاهش می‌یابد، چون پپسین برای فعالیت مطلوب به محیط اسیدی نیاز دارد.",
      "پپسین به لیپاز تبدیل می‌شود.",
      "تغییر pH هیچ‌تأثیری ندارد.",
    ],
    correctIndex: 1,
    hint: "پپسین طبیعتاً در کدام اندام و با کدام شرایط pH فعالیت می‌کند؟",
    explanationCorrect: "درست! پپسین در محیط اسیدی معده بهترین کارایی را دارد و در محیط قلیایی فعالیتش به‌شدت افت می‌کند.",
    explanationIncorrect: "پپسین برای فعالیت مطلوب نیاز به محیط اسیدی (مثل معده) دارد؛ در محیط قلیایی فعالیت آن کاهش می‌یابد.",
  },

  // ---------- mech_vs_chem ----------
  {
    id: "q_mc_1",
    type: "true_false",
    conceptId: "mech_vs_chem",
    difficulty: "beginner",
    skillType: "conceptual",
    prompt: "درست یا نادرست: جویدن غذا توسط دندان‌ها نمونه‌ای از گوارش شیمیایی است.",
    options: ["درست", "نادرست"],
    correctIndex: 1,
    hint: "آیا جویدن، ساختار شیمیایی مولکول‌های غذا را تغییر می‌دهد؟",
    explanationCorrect: "درست گفتی؛ جویدن فقط اندازه فیزیکی غذا را کم می‌کند، نوعی گوارش مکانیکی است.",
    explanationIncorrect: "جویدن گوارش مکانیکی است چون فقط اندازه ذرات غذا را کم می‌کند و ساختار شیمیایی مولکول‌ها را تغییر نمی‌دهد.",
  },
  {
    id: "q_mc_2",
    type: "mcq",
    conceptId: "mech_vs_chem",
    difficulty: "intermediate",
    skillType: "conceptual",
    prompt: "کدام مثال، گوارش شیمیایی است؟",
    options: [
      "ورز دادن غذا توسط دیواره معده",
      "تجزیه نشاسته به مالتوز توسط آمیلاز",
      "جویدن غذا توسط دندان‌ها",
      "حرکت لقمه در مری با پریستالسیس",
    ],
    correctIndex: 1,
    hint: "کدام گزینه شامل یک آنزیم است؟",
    explanationCorrect: "درست؛ تجزیه نشاسته توسط آنزیم آمیلاز یک تغییر شیمیایی (شکستن پیوند) است.",
    explanationIncorrect: "گزینه درست «تجزیه نشاسته توسط آمیلاز» است؛ بقیه موارد تغییر فیزیکی (مکانیکی) هستند، نه شیمیایی.",
  },
  {
    id: "q_mc_3",
    type: "scenario",
    conceptId: "mech_vs_chem",
    difficulty: "advanced",
    skillType: "conceptual",
    prompt: "در معده، هم انقباض دیواره و هم ترشح پپسین اتفاق می‌افتد. این نشان‌دهنده چیست؟",
    options: [
      "گوارش مکانیکی و شیمیایی می‌توانند هم‌زمان و مکمل هم رخ دهند.",
      "گوارش مکانیکی همیشه قبل از شیمیایی تمام می‌شود.",
      "در معده فقط گوارش مکانیکی رخ می‌دهد.",
      "پپسین یک نوع گوارش مکانیکی است.",
    ],
    correctIndex: 0,
    hint: "هر دو فرآیند در یک اندام، در یک زمان، در حال وقوع هستند؛ این یعنی چه؟",
    explanationCorrect: "دقیقاً! در معده، ورز دادن (مکانیکی) و تجزیه آنزیمی پروتئین توسط پپسین (شیمیایی) هم‌زمان انجام می‌شوند و به هم کمک می‌کنند.",
    explanationIncorrect: "در معده، گوارش مکانیکی (ورز دادن) و شیمیایی (اثر پپسین) هم‌زمان رخ می‌دهند و مکمل هم هستند؛ یکی جایگزین دیگری نیست.",
  },

  // ---------- organ_functions ----------
  {
    id: "q_of_1",
    type: "mcq",
    conceptId: "organ_functions",
    difficulty: "beginner",
    skillType: "recall",
    prompt: "کدام اندام، اسید کلریدریک (HCl) ترشح می‌کند؟",
    options: ["دهان", "معده", "پانکراس", "روده بزرگ"],
    correctIndex: 1,
    hint: "کدام اندام محیط بسیار اسیدی دارد؟",
    explanationCorrect: "درست؛ سلول‌های دیواره معده HCl ترشح می‌کنند.",
    explanationIncorrect: "پاسخ درست «معده» است؛ سلول‌های دیواره معده اسید کلریدریک ترشح می‌کنند.",
  },
  {
    id: "q_of_2",
    type: "matching",
    conceptId: "organ_functions",
    difficulty: "intermediate",
    skillType: "recall",
    prompt: "هر اندام را به ترشح یا نقش اصلی آن وصل کن.",
    pairs: [
      { left: "کبد", right: "ساخت صفرا" },
      { left: "پانکراس", right: "ترشح آنزیم‌ها و بی‌کربنات" },
      { left: "کیسه صفرا", right: "ذخیره صفرا" },
      { left: "معده", right: "ترشح پپسین و HCl" },
    ],
    hint: "کدام اندام فقط «ذخیره» می‌کند و خودش چیزی نمی‌سازد؟",
    explanationCorrect: "آفرین! هر اندام کمکی نقش مشخصی در کمک به گوارش روده باریک دارد.",
    explanationIncorrect: "یادآوری: کبد صفرا می‌سازد، کیسه صفرا آن را ذخیره می‌کند، و پانکراس آنزیم و بی‌کربنات می‌فرستد.",
  },
  {
    id: "q_of_3",
    type: "labeling",
    conceptId: "organ_functions",
    difficulty: "beginner",
    skillType: "recall",
    prompt: "اندام‌های کمکی (غیر از لوله اصلی گوارش) را که ترشحات خود را به روده باریک می‌فرستند شناسایی کن.",
    items: ["کبد", "ریه", "پانکراس", "کلیه"],
    correctOrder: [0, 2],
    labelTargets: ["liver", "pancreas"],
    hint: "کدام دو اندام مستقیماً در گوارش شیمیایی روده باریک کمک می‌کنند؟",
    explanationCorrect: "درست؛ کبد (صفرا) و پانکراس (آنزیم و بی‌کربنات) اندام‌های کمکی گوارش هستند.",
    explanationIncorrect: "کبد و پانکراس اندام‌های کمکی گوارش‌اند. ریه و کلیه نقشی در گوارش غذا ندارند.",
  },

  // ---------- sequence ----------
  {
    id: "q_seq_1",
    type: "ordering",
    conceptId: "sequence",
    difficulty: "beginner",
    skillType: "recall",
    prompt: "مراحل زیر را به ترتیب درست مسیر غذا مرتب کن.",
    items: ["حلق", "مقعد", "روده باریک", "دهان", "راست روده", "معده", "روده بزرگ", "مری"],
    correctOrder: [3, 0, 7, 5, 2, 6, 4, 1],
    hint: "به یاد بیاور: دهان اولین و مقعد آخرین ایستگاه است.",
    explanationCorrect: "عالی! ترتیب درست: دهان، حلق، مری، معده، روده باریک، روده بزرگ، راست‌روده، مقعد.",
    explanationIncorrect: "ترتیب درست: دهان ← حلق ← مری ← معده ← روده باریک ← روده بزرگ ← راست‌روده ← مقعد.",
  },
  {
    id: "q_seq_2",
    type: "true_false",
    conceptId: "sequence",
    difficulty: "intermediate",
    skillType: "conceptual",
    prompt: "درست یا نادرست: غذا به‌طور مستقیم از کبد یا پانکراس عبور می‌کند.",
    options: ["درست", "نادرست"],
    correctIndex: 1,
    hint: "کبد و پانکراس در مسیر اصلی لوله گوارش قرار دارند یا کنار آن؟",
    explanationCorrect: "درست گفتی؛ کبد و پانکراس اندام‌های کمکی‌اند و غذا از داخل آن‌ها عبور نمی‌کند، فقط ترشحات آن‌ها به روده باریک می‌رسد.",
    explanationIncorrect: "نادرست است. کبد و پانکراس کنار لوله گوارش قرار دارند و فقط ترشحات خود (صفرا، آنزیم، بی‌کربنات) را به روده باریک می‌فرستند؛ غذا از داخل آن‌ها رد نمی‌شود.",
  },

  // ---------- secretions_ph ----------
  {
    id: "q_ph_1",
    type: "mcq",
    conceptId: "secretions_ph",
    difficulty: "intermediate",
    skillType: "conceptual",
    prompt: "وقتی کیموس اسیدی از معده وارد روده باریک می‌شود، چه ماده‌ای آن را خنثی می‌کند؟",
    options: ["پپسین", "صفرا", "بی‌کربنات ترشح‌شده از پانکراس", "آمیلاز بزاقی"],
    correctIndex: 2,
    hint: "کدام ماده می‌تواند اسید را خنثی کند، نه تجزیه؟",
    explanationCorrect: "درست؛ بی‌کربنات پانکراس اسید کیموس را خنثی می‌کند تا آنزیم‌های روده‌ای در محیط مناسب فعالیت کنند.",
    explanationIncorrect: "پاسخ درست «بی‌کربنات» است که از پانکراس ترشح می‌شود و اسید کیموس را خنثی می‌کند.",
  },
  {
    id: "q_ph_2",
    type: "scenario",
    conceptId: "secretions_ph",
    difficulty: "advanced",
    skillType: "conceptual",
    prompt: "اگر ترشح بی‌کربنات پانکراس به‌شدت کاهش یابد، چه مشکلی در روده باریک ممکن است رخ دهد؟",
    options: [
      "هیچ مشکلی ایجاد نمی‌شود.",
      "محیط روده باریک بیش از حد اسیدی می‌ماند و آنزیم‌های روده‌ای/پانکراسی نمی‌توانند به‌خوبی فعالیت کنند.",
      "روده باریک شروع به ترشح پپسین می‌کند.",
      "جذب آب در روده بزرگ متوقف می‌شود.",
    ],
    correctIndex: 1,
    hint: "بی‌کربنات چه اثری روی pH محیط دارد؟",
    explanationCorrect: "درست؛ بدون خنثی‌سازی، محیط اسیدی می‌ماند و فعالیت آنزیم‌های روده‌ای که به pH کمی قلیایی نیاز دارند مختل می‌شود.",
    explanationIncorrect: "بی‌کربنات اسید کیموس را خنثی می‌کند؛ بدون آن، محیط روده بیش از حد اسیدی می‌ماند و آنزیم‌های روده‌ای/پانکراسی به‌خوبی کار نمی‌کنند.",
  },

  // ---------- extra variety ----------
  {
    id: "q_extra_1",
    type: "short_answer",
    conceptId: "bile_role",
    difficulty: "beginner",
    skillType: "recall",
    prompt: "صفرا در کدام اندام ساخته می‌شود؟",
    acceptableAnswers: ["کبد"],
    hint: "همان اندامی که قند خون را نیز تنظیم می‌کند.",
    explanationCorrect: "درست؛ صفرا در کبد ساخته می‌شود.",
    explanationIncorrect: "پاسخ درست «کبد» است. کیسه صفرا فقط آن را ذخیره می‌کند، نمی‌سازد.",
  },
  {
    id: "q_extra_2",
    type: "mcq",
    conceptId: "organ_functions",
    difficulty: "advanced",
    skillType: "conceptual",
    prompt: "چرا دستگاه گوارش را یک «سامانه به‌هم‌پیوسته» می‌دانیم نه مجموعه‌ای از اندام‌های مستقل؟",
    options: [
      "چون همه اندام‌ها شکل یکسانی دارند.",
      "چون خروجی هر اندام، ورودی و پیش‌نیاز اندام بعدی است و ترشحات کمکی هم در نقاط مشخصی اضافه می‌شوند.",
      "چون هر اندام مستقل از بقیه کار می‌کند و تغییر یکی بر دیگری اثر ندارد.",
      "چون فقط یک اندام مسئول کل گوارش است.",
    ],
    correctIndex: 1,
    hint: "کیموس، آنزیم‌ها، و صفرا در کجا به هم می‌رسند؟",
    explanationCorrect: "دقیقاً؛ هر مرحله به مرحله قبل و بعد خود وابسته است و ترشحات کبد و پانکراس در زمان و مکان مشخصی وارد مسیر می‌شوند.",
    explanationIncorrect: "دستگاه گوارش زنجیره‌ای به‌هم‌پیوسته است: خروجی هر اندام ورودی اندام بعدی است و ترشحات کمکی (صفرا، آنزیم پانکراس) در لحظه مناسب اضافه می‌شوند.",
  },
  {
    id: "q_extra_3",
    type: "true_false",
    conceptId: "nutrient_transport",
    difficulty: "beginner",
    skillType: "recall",
    prompt: "درست یا نادرست: خون جذب‌شده از روده باریک، قبل از رسیدن به سایر اندام‌های بدن، ابتدا از کبد عبور می‌کند.",
    options: ["درست", "نادرست"],
    correctIndex: 0,
    hint: "نام رگی که خون غنی از مواد مغذی را از روده به کبد می‌برد چیست؟",
    explanationCorrect: "درست است؛ این خون از طریق سیاهرگ باب به کبد می‌رود تا پیش از پخش در بدن، پردازش شود.",
    explanationIncorrect: "در واقع درست است؛ خون جذب‌شده از روده باریک از طریق سیاهرگ باب ابتدا به کبد می‌رود.",
  },
];

// Merge the core hand-curated bank with the expanded second wave of
// questions. De-duplicated by id defensively in case of overlap.
export const QUIZ_BANK: QuizQuestion[] = (() => {
  const seen = new Set<string>();
  const all: QuizQuestion[] = [];
  for (const q of [...QUIZ_BANK_CORE, ...QUIZ_BANK_EXTRA]) {
    if (seen.has(q.id)) continue;
    seen.add(q.id);
    all.push(q);
  }
  return all;
})();

export const QUESTION_MAP: Record<string, QuizQuestion> = Object.fromEntries(
  QUIZ_BANK.map((q) => [q.id, q])
);

export function getQuestionsByConcept(conceptId: string): QuizQuestion[] {
  return QUIZ_BANK.filter((q) => q.conceptId === conceptId);
}

export function getQuestionsByDifficulty(difficulty: QuizQuestion["difficulty"]): QuizQuestion[] {
  return QUIZ_BANK.filter((q) => q.difficulty === difficulty);
}

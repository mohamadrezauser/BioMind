import { ORGAN_EDUCATION, ACCESSORY_NOTE } from "../data/organEducation";
import { ALL_ORGAN_IDS, type OrganId } from "../three/organLayout";

const SYNONYMS: Partial<Record<OrganId, string[]>> = {
  smallIntestine: ["روده کوچک", "روده نازک", "دوازدهه", "ژژنوم", "ایلئوم"],
  largeIntestine: ["روده قطور", "کولون", "روده کلفت"],
  liver: ["جگر", "کبد"],
  gallbladder: ["کیسه صفرا", "صفرا کیسه"],
  pancreas: ["لوزالمعده", "پانکراس"],
  esophagus: ["مری"],
  stomach: ["شکم", "معده"],
  anus: ["مقعد", "کانال مقعدی"],
};

function normalize(text: string) {
  return text.replace(/[‌\u200c]/g, " ").trim();
}

export function findOrganInText(raw: string): OrganId | null {
  const text = normalize(raw);
  const candidates: { id: OrganId; keyword: string }[] = [];

  for (const id of ALL_ORGAN_IDS) {
    const edu = ORGAN_EDUCATION[id];
    const names = [edu.nameFa.split("(")[0].trim(), ...(SYNONYMS[id] ?? [])];
    for (const name of names) {
      if (name && text.includes(name)) candidates.push({ id, keyword: name });
    }
  }
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.keyword.length - a.keyword.length);
  return candidates[0].id;
}

export interface TutorReply {
  text: string;
  organId?: OrganId;
  action?: "tour" | "journey" | "focus";
}

export function generateTutorReply(query: string): TutorReply {
  const text = normalize(query);
  const organId = findOrganInText(text);

  if (organId) {
    const edu = ORGAN_EDUCATION[organId];
    return {
      organId,
      action: "focus",
      text: `${edu.nameFa} (${edu.nameScientific})\n\nموقعیت: ${edu.location}\n\nعملکرد: ${edu.function}\n\nنقش در گوارش: ${edu.digestionRole}${
        edu.misconceptions.length ? `\n\nنکته مهم: ${edu.misconceptions[0]}` : ""
      }`,
    };
  }

  if (/تور|راهنما|شروع کن/.test(text)) {
    return { action: "tour", text: "بسیار خوب، تور آموزشی هدایت‌شده را برایت شروع می‌کنم تا مرحله‌به‌مرحله با اندام‌ها آشنا شوی." };
  }

  if (/مسیر غذا|مسیر حرکت غذا|غذا کجا می‌رود|هضم چطور/.test(text)) {
    return {
      action: "journey",
      text: "مسیر حرکت غذا را روی مدل برایت پخش می‌کنم: دهان → حلق → مری → معده → روده باریک → روده بزرگ → راست‌روده → مقعد.",
    };
  }

  if (/کبد.*چرا.*مسیر|چرا غذا از کبد|پانکراس.*مسیر|صفرا.*مسیر/.test(text)) {
    return { text: `سؤال خوبی است! ${ACCESSORY_NOTE}` };
  }

  if (/سلام|درود|خسته نباشید/.test(text)) {
    return { text: "سلام! خوشحالم که اینجایی. می‌توانی نام هر اندام دستگاه گوارش (مثلاً «معده» یا «پانکراس») را بپرسی تا توضیح بدهم و در مدل سه‌بعدی نشانت بدهم." };
  }

  return {
    text:
      "متوجه نشدم دقیقاً درباره کدام اندام می‌پرسی. می‌توانی نام یکی از اندام‌های دستگاه گوارش مثل «مری»، «معده»، «روده باریک»، «روده بزرگ»، «کبد»، «کیسه صفرا» یا «پانکراس» را بنویسی، یا بگویی «تور آموزشی» یا «مسیر غذا» را شروع کن.",
  };
}

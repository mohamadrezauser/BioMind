export interface EnzymePair {
  id: string;
  enzyme: string;
  substrate: string;
  product: string;
  location: string;
}

export const ENZYME_PAIRS: EnzymePair[] = [
  {
    id: "amylase_salivary",
    enzyme: "آمیلاز بزاقی",
    substrate: "نشاسته",
    product: "قندهای کوچک‌تر (مثل مالتوز)",
    location: "دهان",
  },
  {
    id: "pepsin",
    enzyme: "پپسین",
    substrate: "پروتئین",
    product: "پپتیدهای کوچک‌تر",
    location: "معده",
  },
  {
    id: "pancreatic_amylase",
    enzyme: "آمیلاز پانکراسی",
    substrate: "نشاسته باقیمانده",
    product: "قندهای کوچک‌تر",
    location: "روده باریک",
  },
  {
    id: "trypsin",
    enzyme: "تریپسین",
    substrate: "پپتیدها",
    product: "اسیدهای آمینه / پپتیدهای کوچک‌تر",
    location: "روده باریک",
  },
  {
    id: "lipase",
    enzyme: "لیپاز پانکراسی",
    substrate: "چربی (امولسیون‌شده با صفرا)",
    product: "اسید چرب و مونوگلیسیرید",
    location: "روده باریک",
  },
];

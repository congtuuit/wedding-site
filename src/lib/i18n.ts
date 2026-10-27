import weddingViData from "@/data/wedding.json";
import weddingJpData from "@/data/wedding-jp.json";
import { viLocale } from "@/data/locales/vi";
import { jpLocale } from "@/data/locales/jp";
import { WeddingData } from "@/types/wedding";
import { WeddingLocaleDictionary } from "@/types/locale";

export type SupportedLocale = "vi" | "jp";

export function normalizeLocale(lang?: string | null): SupportedLocale {
  if (!lang) return "vi";
  const normalized = lang.toLowerCase().trim();
  if (normalized === "jp" || normalized === "ja" || normalized === "ja_jp" || normalized === "japanese") {
    return "jp";
  }
  return "vi";
}

export function getWeddingData(lang?: string | null): WeddingData {
  const locale = normalizeLocale(lang);
  return locale === "jp" ? (weddingJpData as unknown as WeddingData) : (weddingViData as unknown as WeddingData);
}

export function getLocaleDictionary(lang?: string | null): WeddingLocaleDictionary {
  const locale = normalizeLocale(lang);
  return locale === "jp" ? jpLocale : viLocale;
}

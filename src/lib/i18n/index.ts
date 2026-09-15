import { en } from "./dictionaries/en";
import { id } from "./dictionaries/id";

export type Language = "en" | "id";

export const dictionaries = {
  en,
  id,
};

/**
 * Retrieves a translated string given a dot-separated key path (e.g. "settings.title").
 */
export function getTranslation(
  lang: Language,
  path: string,
  params?: Record<string, string | number>
): string {
  const dict = dictionaries[lang] || dictionaries.en;
  const keys = path.split(".");

  let result: unknown = dict;
  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      // Fallback to English dictionary if missing in target lang
      let fallback: unknown = dictionaries.en;
      for (const fk of keys) {
        if (fallback && typeof fallback === "object" && fk in fallback) {
          fallback = (fallback as Record<string, unknown>)[fk];
        } else {
          return path;
        }
      }
      result = fallback;
      break;
    }
  }

  if (typeof result !== "string") {
    return path;
  }

  if (params) {
    return Object.entries(params).reduce(
      (acc, [pKey, pVal]) => acc.replace(new RegExp(`{{\\s*${pKey}\\s*}}`, "g"), String(pVal)),
      result
    );
  }

  return result;
}

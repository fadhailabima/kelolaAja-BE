import { Locale } from "@prisma/client";

/**
 * Type for translation object
 */
export interface Translation {
  locale: Locale;
  [key: string]: any;
}

/**
 * Extract single translation from array of translations
 * Falls back to Indonesian if requested locale not found
 */
export function extractTranslation<T extends Translation>(
  translations: T[],
  locale: Locale = Locale.id
): Omit<T, "locale"> | null {
  if (!translations || translations.length === 0) {
    return null;
  }

  // Try to find requested locale
  let translation = translations.find(t => t.locale === locale);

  // Fallback to Indonesian
  if (!translation) {
    translation = translations.find(t => t.locale === Locale.id);
  }

  // Fallback to first available
  if (!translation) {
    translation = translations[0];
  }

  // Remove locale field from result
  const { locale: _, ...rest } = translation;
  return rest as Omit<T, "locale">;
}

/**
 * Transform array of items with translations to locale-specific array
 */
export function transformWithTranslation<T extends { translations?: Translation[] }>(
  items: T[],
  locale: Locale = Locale.id
): Array<Omit<T, "translations"> & Record<string, any>> {
  return items.map(item => {
    const { translations, ...rest } = item;
    const translation = extractTranslation(translations || [], locale);

    return {
      ...rest,
      ...(translation || {})
    };
  });
}

/**
 * Merge all translations into a translations object
 * Useful for admin/CMS endpoints
 */
export function mergeAllTranslations<T extends Translation>(translations: T[]): Record<Locale, Omit<T, "locale">> {
  const result = {} as Record<Locale, Omit<T, "locale">>;

  translations.forEach(translation => {
    const { locale, ...rest } = translation;
    result[locale] = rest as Omit<T, "locale">;
  });

  return result;
}

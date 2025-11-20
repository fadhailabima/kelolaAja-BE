"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTranslation = extractTranslation;
exports.transformWithTranslation = transformWithTranslation;
exports.mergeAllTranslations = mergeAllTranslations;
const client_1 = require("@prisma/client");
function extractTranslation(translations, locale = client_1.Locale.id) {
    if (!translations || translations.length === 0) {
        return null;
    }
    let translation = translations.find(t => t.locale === locale);
    if (!translation) {
        translation = translations.find(t => t.locale === client_1.Locale.id);
    }
    if (!translation) {
        translation = translations[0];
    }
    const { locale: _, ...rest } = translation;
    return rest;
}
function transformWithTranslation(items, locale = client_1.Locale.id) {
    return items.map(item => {
        const { translations, ...rest } = item;
        const translation = extractTranslation(translations || [], locale);
        return {
            ...rest,
            ...(translation || {})
        };
    });
}
function mergeAllTranslations(translations) {
    const result = {};
    translations.forEach(translation => {
        const { locale, ...rest } = translation;
        result[locale] = rest;
    });
    return result;
}
//# sourceMappingURL=translation.js.map
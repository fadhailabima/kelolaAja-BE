import { Locale } from "@prisma/client";
export interface Translation {
    locale: Locale;
    [key: string]: any;
}
export declare function extractTranslation<T extends Translation>(translations: T[], locale?: Locale): Omit<T, "locale"> | null;
export declare function transformWithTranslation<T extends {
    translations?: Translation[];
}>(items: T[], locale?: Locale): Array<Omit<T, "translations"> & Record<string, any>>;
export declare function mergeAllTranslations<T extends Translation>(translations: T[]): Record<Locale, Omit<T, "locale">>;
//# sourceMappingURL=translation.d.ts.map
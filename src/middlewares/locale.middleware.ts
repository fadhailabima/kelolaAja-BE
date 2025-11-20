import { Request, Response, NextFunction } from "express";
import { Locale } from "@prisma/client";

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      locale?: Locale;
    }
  }
}

/**
 * Middleware to detect and set locale from query params or headers
 * Priority: query > header > default (id)
 */
export const detectLocale = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    let locale: string | undefined;

    // 1. Check query parameter (?locale=en)
    if (req.query.locale && typeof req.query.locale === "string") {
      locale = req.query.locale.toLowerCase();
    }

    // 2. Check Accept-Language header
    if (!locale && req.headers["accept-language"]) {
      const acceptLanguage = req.headers["accept-language"];
      // Extract first language code (e.g., 'id-ID' -> 'id', 'en-US' -> 'en')
      locale = acceptLanguage
        .split(",")[0]
        .split("-")[0]
        .toLowerCase();
    }

    // 3. Validate locale and set default
    const validLocales = Object.values(Locale);
    req.locale = validLocales.includes(locale as Locale) ? (locale as Locale) : Locale.id;

    next();
  } catch (error) {
    // Fallback to Indonesian on any error
    req.locale = Locale.id;
    next();
  }
};

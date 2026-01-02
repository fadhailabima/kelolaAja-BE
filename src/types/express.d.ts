import { Locale } from "@prisma/client";

/**
 * Extend Express Request interface to include custom properties
 */
declare global {
  namespace Express {
    interface Request {
      /**
       * Authenticated user information (set by authenticate middleware)
       */
      user?: {
        userId: number;
        username: string;
        email: string;
        role: "Admin" | "Editor" | "Viewer";
      };

      /**
       * Current locale for multi-language support (set by detectLocale middleware)
       */
      locale?: Locale;
    }
  }
}

export {};

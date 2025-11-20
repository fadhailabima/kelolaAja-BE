"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectLocale = void 0;
const client_1 = require("@prisma/client");
const detectLocale = (req, _res, next) => {
    try {
        let locale;
        if (req.query.locale && typeof req.query.locale === "string") {
            locale = req.query.locale.toLowerCase();
        }
        if (!locale && req.headers["accept-language"]) {
            const acceptLanguage = req.headers["accept-language"];
            locale = acceptLanguage
                .split(",")[0]
                .split("-")[0]
                .toLowerCase();
        }
        const validLocales = Object.values(client_1.Locale);
        req.locale = validLocales.includes(locale) ? locale : client_1.Locale.id;
        next();
    }
    catch (error) {
        req.locale = client_1.Locale.id;
        next();
    }
};
exports.detectLocale = detectLocale;
//# sourceMappingURL=locale.middleware.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const response_1 = require("../utils/response");
const errorHandler = (err, req, res, _next) => {
    console.error("Error:", {
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        url: req.url,
        method: req.method
    });
    if (err instanceof errors_1.AppError && err.isOperational) {
        response_1.ResponseUtil.error(res, err.message, null, err.statusCode);
        return;
    }
    if (err.name === "PrismaClientKnownRequestError") {
        const prismaError = err;
        if (prismaError.code === "P2002") {
            response_1.ResponseUtil.error(res, "A record with this value already exists", null, 409);
            return;
        }
        if (prismaError.code === "P2025") {
            response_1.ResponseUtil.notFound(res, "Record not found");
            return;
        }
    }
    if (err.name === "ValidationError") {
        response_1.ResponseUtil.error(res, err.message, null, 400);
        return;
    }
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        response_1.ResponseUtil.unauthorized(res, "Invalid or expired token");
        return;
    }
    response_1.ResponseUtil.serverError(res, process.env.NODE_ENV === "development" ? err.message : "Something went wrong", process.env.NODE_ENV === "development" ? err.stack : undefined);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map
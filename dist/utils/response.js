"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUtil = void 0;
class ResponseUtil {
    static success(res, message, data, statusCode = 200, meta) {
        const response = {
            success: true,
            message,
            data
        };
        if (meta) {
            response.meta = meta;
        }
        res.status(statusCode).json(response);
    }
    static error(res, message, errors, statusCode = 400) {
        const response = {
            success: false,
            message,
            errors
        };
        res.status(statusCode).json(response);
    }
    static created(res, message, data) {
        this.success(res, message, data, 201);
    }
    static unauthorized(res, message = "Unauthorized") {
        this.error(res, message, null, 401);
    }
    static forbidden(res, message = "Forbidden") {
        this.error(res, message, null, 403);
    }
    static notFound(res, message = "Resource not found") {
        this.error(res, message, null, 404);
    }
    static serverError(res, message = "Internal server error", errors) {
        this.error(res, message, errors, 500);
    }
    static badRequest(res, message = "Bad request", errors) {
        this.error(res, message, errors, 400);
    }
}
exports.ResponseUtil = ResponseUtil;
//# sourceMappingURL=response.js.map
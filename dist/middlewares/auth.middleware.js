"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const response_1 = require("../utils/response");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            response_1.ResponseUtil.unauthorized(res, "No token provided");
            return;
        }
        const token = authHeader.substring(7);
        const decoded = jwt_1.JwtUtil.verifyAccessToken(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Invalid token";
        response_1.ResponseUtil.unauthorized(res, message);
    }
};
exports.authenticate = authenticate;
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            response_1.ResponseUtil.unauthorized(res, "User not authenticated");
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            response_1.ResponseUtil.forbidden(res, "You do not have permission to access this resource");
            return;
        }
        next();
    };
};
exports.authorize = authorize;
const optionalAuth = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.substring(7);
            const decoded = jwt_1.JwtUtil.verifyAccessToken(token);
            req.user = decoded;
        }
        next();
    }
    catch {
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.middleware.js.map
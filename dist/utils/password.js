"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordUtil = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class PasswordUtil {
    static async hash(password) {
        return bcrypt_1.default.hash(password, this.SALT_ROUNDS);
    }
    static async compare(password, hash) {
        return bcrypt_1.default.compare(password, hash);
    }
    static validateStrength(password) {
        const errors = [];
        if (password.length < 8) {
            errors.push("Password must be at least 8 characters long");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Password must contain at least one uppercase letter");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Password must contain at least one lowercase letter");
        }
        if (!/[0-9]/.test(password)) {
            errors.push("Password must contain at least one number");
        }
        return {
            valid: errors.length === 0,
            errors
        };
    }
}
exports.PasswordUtil = PasswordUtil;
PasswordUtil.SALT_ROUNDS = 10;
//# sourceMappingURL=password.js.map
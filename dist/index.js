"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.get('/', (_req, res) => {
    res.json({ message: 'Welcome to KelolaAja API' });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map
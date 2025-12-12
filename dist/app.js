"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const connect_livereload_1 = __importDefault(require("connect-livereload"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
const corsOptions = {
    origin: process.env.WEB_URL
        ? process.env.WEB_URL.split(",").map(url => url.trim())
        : ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept-Language"]
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SECRET_KEY || "defaultSecretKeyForDevelopment",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000
    }
}));
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] Incoming Request: ${req.method} ${req.originalUrl}`);
    console.log("Headers:", req.headers);
    next();
});
if (process.env.NODE_ENV === "development") {
    app.use((0, connect_livereload_1.default)());
}
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "..", "uploads")));
app.get("/", (_req, res) => {
    res.json({
        message: "KelolaAja API Server",
        version: "1.0.0",
        status: "running",
        environment: process.env.NODE_ENV || "development"
    });
});
app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development"
    });
});
app.get("/api/v1", (_req, res) => {
    res.json({
        message: "KelolaAja API v1",
        version: "1.0.0",
        status: "running",
        baseUrl: "/api/v1",
        endpoints: {
            auth: "/api/v1/auth",
            users: "/api/v1/users",
            pricing: "/api/v1/pricing-plans",
            features: "/api/v1/features",
            jobs: "/api/v1/jobs"
        }
    });
});
app.get("/api", (_req, res) => {
    res.json({
        message: "KelolaAja API",
        version: "1.0.0",
        status: "running",
        baseUrl: "/api",
        endpoints: {
            auth: "/api/auth",
            users: "/api/users",
            pricing: "/api/pricing-plans",
            features: "/api/features",
            jobs: "/api/jobs"
        }
    });
});
app.use("/api/v1", routes_1.default);
app.use("/api", routes_1.default);
app.use((req, res) => {
    res.status(404).json({
        error: "Not Found",
        message: `Route ${req.method} ${req.originalUrl} not found`
    });
});
app.use(error_middleware_1.errorHandler);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Access at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map
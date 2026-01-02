import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import livereload from "connect-livereload";
import path from "path";
import routes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";

dotenv.config();

const app: Application = express();

const port = process.env.PORT || 8080;

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = process.env.WEB_URL
      ? process.env.WEB_URL.split(",").map(url => url.trim())
      : ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", "http://localhost:5174"];

    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);

    // Check if origin is allowed
    // Allow vercel.app domains for deployments
    const isVercel = origin.endsWith(".vercel.app");

    if (allowedOrigins.includes(origin) || isVercel) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept-Language"]
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRET_KEY || "defaultSecretKeyForDevelopment",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

// Logger Middleware (before routes)
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] Incoming Request: ${req.method} ${req.originalUrl}`);
  console.log("Headers:", req.headers);
  next();
});

if (process.env.NODE_ENV === "development") {
  app.use(livereload());
}

// Static files - serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "KelolaAja API Server",
    version: "1.0.0",
    status: "running",
    environment: process.env.NODE_ENV || "development"
  });
});

// Health check endpoint for Railway
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development"
  });
});

// API info endpoints - Define /api/v1 first (more specific) before /api (more general)
app.get("/api/v1", (_req: Request, res: Response) => {
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

app.get("/api", (_req: Request, res: Response) => {
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

// API Routes - Support both /api and /api/v1 for compatibility
// Define /api/v1 first (more specific) before /api (more general)
app.use("/api/v1", routes);
app.use("/api", routes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Error Handler (must be last)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Access at http://localhost:${port}`);
});

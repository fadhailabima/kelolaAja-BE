import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import livereload from "connect-livereload";
import routes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";

dotenv.config();

const app: Application = express();

const port = process.env.PORT || 8080;

const corsOptions = {
  origin: process.env.WEB_URL || "http://localhost:3001",
  credentials: true
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

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "KelolaAja API Server",
    version: "1.0.0",
    status: "running"
  });
});

// API Routes
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

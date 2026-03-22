import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { register } from "./lib/metrics.js";
import logger, { logHttpRequest } from "./lib/logger.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

// Middleware to track request metrics
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const route = req.route ? req.route.path : req.path;
    
    logHttpRequest(req.method, route, res.statusCode, duration);
  });
  
  next();
});

const corsOrigin =
  process.env.NODE_ENV === "production"
    ? true // reflect request Origin (works with nginx reverse proxy / same-origin)
    : (process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()).filter(Boolean) ??
      "http://localhost:5173");

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

// Test route
app.get("/test", (req, res) => {
  res.status(200).send("test route works");
});

// Add metrics endpoint
app.get("/metrics", async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    logger.error('Error generating metrics', { error: error.message });
    res.status(500).end();
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

export { app };


import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app } from "./lib/socket.js";

dotenv.config();

app.use(express.json());
app.use(cookieParser());

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

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

export { app };


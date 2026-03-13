import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./lib/db.js";
import { app } from "./app.js";
import { server } from "./lib/socket.js";

dotenv.config();

if (process.env.NODE_ENV !== "test" && !process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not defined. Add it to your .env file.");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
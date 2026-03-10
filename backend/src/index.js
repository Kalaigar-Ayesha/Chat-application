import dotenv from "dotenv";

import path from "path";

import { connectDB } from "./lib/db.js";

import { app } from "./app.js";
import { server } from "./lib/socket.js";

dotenv.config();

// validate required environment variables (fail early)
if (process.env.NODE_ENV !== "test" && !process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not defined. Add it to your .env file.");
  process.exit(1);
}

// fall back to 5000 when PORT isn’t defined in the environment
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});

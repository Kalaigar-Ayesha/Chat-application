import { Server } from "socket.io";
import http from "http";

// Global variables for socket management
let app, server;
let userSocketMap = {};
let io;

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export function getIO() {
  return io;
}

// Export io directly for backward compatibility
export { io };

export function initializeSocket(expressApp) {
  app = expressApp;
  server = http.createServer(app);

  const socketOrigins =
    process.env.NODE_ENV === "production"
      ? "*"
      : (process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()).filter(Boolean) ?? [
          "http://localhost:5173",
        ]);

  io = new Server(server, {
    cors: {
      origin: socketOrigins,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return { io, server };
}

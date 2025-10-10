import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import authRoutes from "./src/routes/authRoutes.js";
import contactRoutes from "./src/routes/contactRoutes.js";


dotenv.config();
const app = express();

// Middleware must come before routes
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => res.send("API Running..."));
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);

// Robust server startup with port fallback and graceful shutdown
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const MAX_PORT = DEFAULT_PORT + 20; // try a small range of ports

let currentServer = null;

const tryListen = (port, maxPort) => {
  const server = http.createServer(app);
  currentServer = server;

  server.once("listening", () => {
    console.log(`Server running on port ${port}`);
  });

  server.once("error", (err) => {
    if (err && err.code === "EADDRINUSE") {
      if (port < maxPort) {
        const next = port + 1;
        console.warn(`⚠️  Port ${port} in use. Trying ${next}...`);
        // Try next port
        tryListen(next, maxPort);
      } else {
        console.error(
          `❌ All ports in range ${DEFAULT_PORT}-${maxPort} are in use. Exiting.`
        );
        process.exit(1);
      }
    } else {
      console.error("Server error:", err);
      process.exit(1);
    }
  });

  server.listen(port);
};

const shutdown = async (signal) => {
  try {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    if (currentServer) {
      await new Promise((resolve) => currentServer.close(resolve));
    }
    await mongoose.disconnect().catch(() => {});
  } finally {
    process.exit(0);
  }
};

["SIGINT", "SIGTERM"].forEach((sig) => {
  process.on(sig, () => shutdown(sig));
});

tryListen(DEFAULT_PORT, MAX_PORT);
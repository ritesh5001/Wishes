import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import env from "./src/config/env.js";
import { connectDatabase, disconnectDatabase } from "./src/config/database.js";
import { errorHandler, notFound } from "./src/middlewares/errorHandler.js";
import authRoutes from "./src/routes/authRoutes.js";
import contactRoutes from "./src/routes/contactRoutes.js";
import reminderRoutes from "./src/routes/reminderRoutes.js";

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

const allowedOrigins = env.clientOrigins;
const corsOptions = {
  origin(origin, callback) {
    const cleanedOrigin = origin ? origin.replace(/\/$/, "") : origin;
    if (!cleanedOrigin || allowedOrigins.length === 0 || allowedOrigins.includes(cleanedOrigin)) {
      return callback(null, true);
    }
    const error = new Error("Not allowed by CORS");
    error.statusCode = 403;
    return callback(error);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.isProduction ? "combined" : "dev"));

app.get("/", (req, res) => res.json({ status: "ok" }));
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    environment: env.nodeEnv,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/reminders", reminderRoutes);

app.use(notFound);
app.use(errorHandler);

let httpServer;
let isShuttingDown = false;

const start = async () => {
  try {
    const connection = await connectDatabase(env.mongoUri);
    console.log("MongoDB connected");

    connection.on("error", (error) => {
      console.error("MongoDB connection error", error);
    });

    connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

    httpServer = app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (err) {
    console.error("Server startup failed", err);
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`${signal} received. Shutting down gracefully.`);
  try {
    if (httpServer) {
      await new Promise((resolve, reject) => {
        httpServer.close((error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown", error);
    process.exit(1);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection", reason);
  shutdown("unhandledRejection");
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception", error);
  shutdown("uncaughtException");
});

start();
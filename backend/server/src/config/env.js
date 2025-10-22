import dotenv from "dotenv";

dotenv.config();

const requiredKeys = ["MONGO_URI", "JWT_SECRET"];
const missingKeys = requiredKeys.filter((key) => !process.env[key]);

if (missingKeys.length > 0) {
  console.error(`Missing required environment variables: ${missingKeys.join(", ")}`);
  process.exit(1);
}

const parsePort = (value, fallback) => {
  const parsed = Number.parseInt(value ?? "", 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
};

const normalizeOrigins = (value) => {
  if (!value) return [];
  return value
    .split(",")
    .map((origin) => origin.trim())
    .map((origin) => origin.replace(/\/$/, ""))
    .filter(Boolean);
};

const nodeEnv = (process.env.NODE_ENV ?? "development").toLowerCase();

const env = {
  nodeEnv,
  isProduction: nodeEnv === "production",
  port: parsePort(process.env.PORT, 3000),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  clientOrigins: normalizeOrigins(process.env.CLIENT_URL ?? process.env.ALLOWED_ORIGINS),
  reminderWindowDays: process.env.REMINDER_WINDOW_DAYS,
};

if (env.isProduction && env.clientOrigins.length === 0) {
  console.error("CLIENT_URL environment variable must be set in production");
  process.exit(1);
}

export default env;

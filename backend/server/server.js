import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./src/routes/authRoutes.js";
import contactRoutes from "./src/routes/contactRoutes.js";
import reminderRoutes from "./src/routes/reminderRoutes.js";

dotenv.config();

const app = express();
const PORT = Number.parseInt(process.env.PORT, 10) || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API Running..."));
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/reminders", reminderRoutes);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Server startup failed", err);
    process.exit(1);
  }
};

start();
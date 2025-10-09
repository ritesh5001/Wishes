import express from "express";
import { register, login } from "../controllers/authController.js";
import authRoutes from "./src/routes/authRoutes.js";
const router = express.Router();


app.use("/api/auth", authRoutes);


router.post("/register", register);
router.post("/login", login);


export default router;
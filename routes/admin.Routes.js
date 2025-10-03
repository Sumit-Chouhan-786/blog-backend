import express from "express";
const adminRoutes = express.Router();
import {
  registerAdmin,
  loginAdmin,
  updatePassword,
  verifyPassword,
} from "../controllers/admin.controller.js";
import authmiddleware from "../middlewares/auth.js";

adminRoutes.post("/signup", registerAdmin);
adminRoutes.post("/login", loginAdmin);
adminRoutes.put("/update-password", authmiddleware, updatePassword);
adminRoutes.post("/verify-password", authmiddleware, verifyPassword);

export default adminRoutes;
import express from "express";
const adminRoutes = express.Router();
import {
  registerAdmin,
  loginAdmin,
} from "../controllers/admin.js";

adminRoutes.post("/signup", registerAdmin);
adminRoutes.post("/login", loginAdmin);

export default adminRoutes;

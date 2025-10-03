import express from "express";
import authRoutes from "./admin.Routes.js";
import blogsRoutes from "./blogs.Routes.js";
const routes = express.Router();

routes.use("/admin",adminRoutes)
routes.use("/blogs", blogsRoutes);

export default routes;

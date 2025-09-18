import express from "express";
import { getAllBlogs, createBlog } from "../controllers/blog.js";
import multer from "multer";

const blogsRoutes = express.Router();
const upload = multer({ dest: "uploads/" }); 

blogsRoutes.post(
  "/createblog", 
  upload.single("image"),
  createBlog
);

blogsRoutes.get(
  "/allblogs",      
  getAllBlogs
);

export default blogsRoutes; 
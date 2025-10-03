import express from "express";
import multer from "multer";
import { 
  getAllBlogs, 
  createBlog, 
  updateBlog, 
  deleteBlog 
} from "../controllers/blog.js";

const blogsRoutes = express.Router();

// ✅ Multer config
const upload = multer({ dest: "uploads/" });

// ✅ Create Blog
blogsRoutes.post(
  "/",
  upload.single("image"),  
  createBlog
);

// ✅ Get All Blogs
blogsRoutes.get(
  "/",
  getAllBlogs
);

// ✅ Update Blog
blogsRoutes.put(
  "/:id",                 
  upload.single("image"),  
  updateBlog
);

// ✅ Delete Blog
blogsRoutes.delete(
  "/:id",                 // /blogs/66f2ab1234...
  deleteBlog
);

export default blogsRoutes;

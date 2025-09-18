import Blog from "../models/Blog.js";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";

const createBlog = async (req, res) => {
  try {
    const { title, shortDescription, description, category } = req.body;

    // Validate required fields
    if (!title || !shortDescription || !description || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "blogs",
    });

    // Clean up temporary file
    fs.unlinkSync(req.file.path);

    const blog = new Blog({
      title,
      shortDescription,
      description,
      category,
      image: {
        url: result.secure_url,
        public_id: result.public_id
      }
    });

    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createBlog, getAllBlogs };
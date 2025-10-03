import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import slugify from "slugify";
import Blog from "../models/Blog.js";

// CREATE BLOG
const createBlog = async (req, res) => {
  try {
    const {
      title,
      summary,
      content,
      category,
      subCategory,
      author,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      language,
      isPublished,
      scheduledAt,
      featured,
      breakingNews,
      source,
      readingTime,
      videoUrl,
      isSponsored,
      isArchived,
    } = req.body;

    if (!title || !content || !category || !author) {
      return res.status(400).json({ error: "Title, content, category, and author are required" });
    }

    let image = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "blogs" });
      fs.unlinkSync(req.file.path);
      image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const slug = slugify(title, { lower: true, strict: true });

    const blog = new Blog({
      title,
      slug,
      summary,
      content,
      category,
      subCategory,
      author,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
      metaTitle,
      metaDescription,
      metaKeywords: metaKeywords ? metaKeywords.split(",").map(k => k.trim()) : [],
      canonicalUrl,
      language: language || "en",
      isPublished: isPublished === "true" || isPublished === true,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      featured: featured === "true" || featured === true,
      breakingNews: breakingNews === "true" || breakingNews === true,
      source,
      readingTime,
      videoUrl,
      isSponsored: isSponsored === "true" || isSponsored === true,
      isArchived: isArchived === "true" || isArchived === true,
      image,
    });

    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error("Create Blog Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET ALL BLOGS
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Get Blogs Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET SINGLE BLOG BY SLUG
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    console.error("Get Blog Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// UPDATE BLOG
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const fields = [
      "title", "summary", "content", "category", "subCategory", "author",
      "tags", "metaTitle", "metaDescription", "metaKeywords", "canonicalUrl",
      "language", "isPublished", "scheduledAt", "featured", "breakingNews",
      "source", "readingTime", "videoUrl", "isSponsored", "isArchived"
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === "tags" || field === "metaKeywords") {
          blog[field] = req.body[field].split(",").map(k => k.trim());
        } else if (["isPublished","featured","breakingNews","isSponsored","isArchived"].includes(field)) {
          blog[field] = req.body[field] === "true" || req.body[field] === true;
        } else if (field === "scheduledAt") {
          blog[field] = new Date(req.body[field]);
        } else {
          blog[field] = req.body[field];
        }
      }
    });

    // Update image if uploaded
    if (req.file) {
      if (blog.image && blog.image.public_id) {
        await cloudinary.uploader.destroy(blog.image.public_id);
      }
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "blogs" });
      fs.unlinkSync(req.file.path);
      blog.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    // Update slug if title changed
    if (req.body.title) {
      blog.slug = slugify(req.body.title, { lower: true, strict: true });
    }

    const updatedBlog = await blog.save();
    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error("Update Blog Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE BLOG
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // Delete image from Cloudinary
    if (blog.image && blog.image.public_id) {
      await cloudinary.uploader.destroy(blog.image.public_id);
    }

    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete Blog Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export { createBlog, getAllBlogs, getBlogBySlug, updateBlog, deleteBlog };

import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    // Basic Info
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    author: { type: String, required: true },
    content: { type: String, required: true },
    summary: { type: String },

    // Image (Cloudinary)
    image: {
      url: { type: String },
      public_id: { type: String },
    },

    // SEO Fields
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: [String],
    canonicalUrl: { type: String },

    // Tags and language
    tags: [String],
    language: { type: String, default: "en" },

    // Publish Info
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    scheduledAt: { type: Date },
    featured: { type: Boolean, default: false },
    breakingNews: { type: Boolean, default: false },

    // Engagement
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    comments: [
      {
        user: String,
        comment: String,
        createdAt: { type: Date, default: Date.now },
        likes: { type: Number, default: 0 },
      },
    ],

    // Extra Fields
    source: { type: String },
    readingTime: { type: String },
    videoUrl: { type: String },
    isSponsored: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);

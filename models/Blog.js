import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
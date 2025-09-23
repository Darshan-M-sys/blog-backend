const mongoose = require("mongoose");

const ImgSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, 
 

    username: { type: String, required: true },
    bio: { type: String },
    title: { type: String },
    image_url: { type: String }, 
    description: { type: String },
    product_url: { type: String },
    category: { type: String }
  },
  { timestamps: true } 
);

const Images = mongoose.model("images", ImgSchema);

module.exports = Images;

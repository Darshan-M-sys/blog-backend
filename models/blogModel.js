const mongoose = require("mongoose");

const blogSchema= new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, 
 

    username: { type: String, required: true },
    bio: { type: String },
    title: { type: String },
    image_url: { type: String }, 
    description: { type: String },
  },
  { timestamps: true } 
);

const blog = mongoose.model("blog", blogSchema);

module.exports = blog;

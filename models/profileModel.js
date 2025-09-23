const mongoose=require("mongoose");
const profileSchema= new mongoose.Schema({
userId:{type:mongoose.Schema.ObjectId,ref:"User"},
image_url:{type:String,default:"https://image2url.com/images/1758181207814-49d01d1a-cd84-43e5-b30a-e51ac4b723a3.webp"},
username:{type:String},
bio:{type:String}
})

const profile=mongoose.model("profile",profileSchema);
module.exports=profile;
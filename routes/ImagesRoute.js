const express=require("express")
const imageRoute=express.Router();
const cloudinary=require("cloudinary").v2;
const multer = require("multer");
const images=require("../models/imageModel")
const {CloudinaryStorage}=require("multer-storage-cloudinary")

const profile = require("../models/profileModel");
cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.SECRET_KEY
})
const storage=new CloudinaryStorage({
  cloudinary:cloudinary,
  params:{
  folder:"data",
  allowed_formats:["png","jpg",'jpeg',"pdf","mp3"]}
});
const upload=multer({storage});
imageRoute.post("/image",upload.single("image"),async(req,res)=>{
  try{
  const formData=req.file?req.file.path:null;
  const UserId=req.session.userId
const profiles= await profile.findOne({userId:UserId});
const username= profiles.username;
const bio=profiles.bio;
const image_url=profiles.image_url;
const description=req.body.description;
const category=req.body.category;
const title=req.body.title;
const newImage=new images({username:username,bio:bio,userId:UserId,image_url:image_url,description:description,category:category,
  title:title,product_url:formData})
 await newImage.save()
res.json({data:newImage,msg:"image Uploaded successfully!"})
  }
  catch(err){
    res.json({msg:" internal server error"})
  }
});



imageRoute.get("/image",async(req,res)=>{
try {
  const newData= await images.find();
  res.json({data:newData})
} catch (error) {
  res.json({msg:"internal Server error"})
}
})
module.exports=imageRoute;








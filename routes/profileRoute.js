const express=require("express")
const profileRoute=express.Router();
const cloudinary=require("cloudinary").v2
const {CloudinaryStorage}=require("multer-storage-cloudinary")
const profile =require("../models/profileModel");
const multer = require("multer");


cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.SECRET_KEY
})
const storage=new CloudinaryStorage({
  cloudinary:cloudinary,
  folder:"data",
  allowed_formats:["png","jpg",'jpeg',"pdf"]
});

const upload=multer({storage})

profileRoute.post("/profile", upload.single("file")  ,async(req,res)=>{
  try {
    const {bio}=req.body;
    const Username=req.body.username|| req.session.username;
    const UserId=req.session.userId;
    const profileExist= await profile.findOne({userId:UserId});
    if(profileExist){
      return res.json({msg:"Profile Already Exist"})
    }
    const formData=req.file?req.file.path:null;
    const newProfile= new profile({userId:UserId,username:Username,bio:bio,image_url:formData})
    await newProfile.save()
    res.json({data:newProfile})
    
  } catch (error) {
    res.json({msg:"Internal Server Error"})
  
  }
})

profileRoute.put("/profile/:id", upload.single("file"), async (req, res) => {
  try {
    const { bio } = req.body;
    const Username = req.body.username || req.session.username;
    const UserId = req.session.userId;
    const { id } = req.params; // fix: 

    if (!UserId) {
      return res.status(401).json({ msg: "Login required" });
    }


    const profileExist = await profile.findOne({ _id: id, userId: UserId });
    if (!profileExist) {
      return res.status(404).json({ msg: "Profile not found or unauthorized" });
    }

 
    const formData = req.file ? req.file.path : profileExist.image_url;

    const updatedProfile = await profile.findByIdAndUpdate(
      id,
      { image_url: formData, username: Username, bio: bio },
      { new: true }
    );

    res.json({ success: true, data: updatedProfile ,msg:"profile Updated!"});
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});


profileRoute.get("/profile",async(req,res)=>{
try {
  const UserId=req.session.userId;
  if(!UserId){
    return res.json({msg:"Login Required"})
  }
  const profileExist=await profile.findOne({userId:UserId})
  res.json({data:profileExist})

} catch (error) {
  res.json({msg:"Internal server Error"})
}
})

module.exports=profileRoute;
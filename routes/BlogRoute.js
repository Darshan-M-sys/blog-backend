const express=require("express");
const blogRoute=express.Router()
const profile=require("../models/profileModel")
const blog =require("../models/blogModel");


blogRoute.post('/blog',async(req,res)=>{
  try{
  const UserId=req.session.userId
const profiles= await profile.findOne({userId:UserId});
const username= profiles.username;
const bio=profiles.bio;
const image_url=profiles.image_url;
const description=req.body.description;
const title=req.body.title;
const newBlog=new blog({username:username,bio:bio,userId:UserId,image_url:image_url,description:description,
  title:title})
 await newBlog.save()
res.json({data:newBlog,msg:"Blog Uploaded successfully!"})
  }
  catch(err){
    res.json({msg:" internal server error"})
  }
});

module.exports=blogRoute;
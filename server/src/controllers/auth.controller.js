import bcryptjs from "bcryptjs"
import User from "../models/user.model.js";
import { generatetoken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signUp=async(req,res)=>{
  const {email,password,fullName} =req.body;

  try{
      if(!email || !fullName || !password){
        return res.json({message:"All fields are required"})
      }
       if(password.length <6){
        return res.status(400).json({message:"Password must be atleast 6 characters"})
       }
       const user=await User.findOne({email})

       if(user){
        return res.status(400).json({message:"Email already exists"})
       }
       const salt=await bcryptjs.genSalt(10);
       const hashedPassword=await bcryptjs.hash(password,salt)

       const newUser=new User({email,password:hashedPassword,fullName})

       if(newUser){
          generatetoken(newUser._id,res)
          await newUser.save()
           res.status(201).json({
            _id:newUser._id,
            email:newUser.email,
            fullName:newUser.fullName,
            password:newUser.password,
            profilePic:newUser.profilePic
           })
       }
       else{
        res.status(400).json({message:"Invalid User Data"})
       }
  }
  catch(err){
    console.log("Error in Signup Controller")
    console.log(err)
    res.status(500).json({message:err})
  }
}

export const logIn=async (req,res)=>{
    const {email,password}=req.body
    try{
      if(!email || !password){
        return res.json({message:"All fields are required"})
      }
      const user=await User.findOne({email})
      if(!user){
         return res.status(400).json({message:"Invalid Credentials"}) 
      }
     const isPasswordCorrect= await bcryptjs.compare(password,user.password)

     if(!isPasswordCorrect){
        return res.status(400).json({message:"Invalid Passsword"})
     }
     generatetoken(user._id,res)
     res.status(200).json({
      userId:user._id,
      email:user.email
     })
    }
    catch(err){
      console.log(err)
      res.status(500).json({message:err})
    }
}
export const logout=(req,res)=>{
    try{
      res.cookie("jwt","",{maxAge:0})
      res.status(200).json({message:"Logged Out Successfully"})
    }
    catch(err){
      console.log(err)
      res.status(500).json({message:err})
    }
}

export const updateProfile=async(req,res)=>{
  try{
    const {profilePic}=req.body
    const userId=req.user._id
    if(!profilePic){
      return res.status(400).json({message:"Profile pic is required"})
    }
    const uploadResponse=await cloudinary.uploader.upload(profilePic) 
    const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
     res.status(200).json({updatedUser})  
  }
  catch(err){
    res.status(500).json({message:"Internal Server in authController"})
  }
}
export const checkAuth=(req,res)=>{
  try{
      res.status(200).json(req.user)
  }
  catch(err){
      console.log("Error in check Authcontroller",err)
  }

} 
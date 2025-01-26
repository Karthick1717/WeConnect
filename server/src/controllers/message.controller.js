import User from "../models/user.model.js"
import Message from "../models/message.model.js"
export const getUsersForSideBar=async(req,res)=>{
    try{
        const loggedInUserId=req.user._id
        const filteredUsers=await User.find({_id:{$ne:loggedInUserId}}).select("-password")
        res.status(200).json(filteredUsers)
    }
    catch(err){
        console.log(err+"Error in message controller")
        res.status(500).json({message:"Internal Error"})
    }
}

export const getMessages=async(req,res)=>{
    try{
        const{ id:userToChatId } = req.params
        const myId=req.user._id
        const messages=await Message.find({
            $or:[
                {senderId:myId,recieverId:userToChatId},
                {senderId:userToChatId,recieverId:myId}
            ]
        })
        console.log(messages)
        res.status(200).json(messages)
    } 
    catch(err){
        console.log("Error in Message Controller"+err)
        res.status(500).json({err})
    }
}

export const sendMessage=async(req,res)=>{
  try{
    const {text,image}=req.body
    const {id:reciverId}=req.params
    const senderId=req.user._id

    let imageUrl 
    if(image){
        const updateResponse=await cloudinary.uploader.upload(image)
        imageUrl=updateResponse.secure_url
    }
    const newMessage=new Message({
        senderId,
        reciverId,
        text,
        image:imageUrl 
    })
    await newMessage.save()
    res.status(201).json(newMessage)
  }
  catch(err){
    console.log("Error in message controller"+err)
    res.status(500).json(err)
  }
}
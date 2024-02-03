const { CustomError } = require("../middlewares/error.middleware")
const User=require("../models/user.model")
const dotenv = require("dotenv")
dotenv.config()

const getUserController = async(req,res,next)=>{
   const {userId}=req.params
   try{
   const user=await User.findOne(userId)
   if(!user){
    throw new CustomError("No user Found",404);
   }
   const {password,...data}=user
   res.status(200).json(data._doc)
   }
   catch(error){

   }
}

const updateUserController =async(req,res,next)=>{
    const {userId}=req.params
    const updateData=req.body
    try{
     const userToUpdate = await User.findById(userId)
     if(!userToUpdate){
        throw new CustomError("User not Found!",404)
     }
     Object.assign(userToUpdate,updateData)
     await userToUpdate.save()
     res.status(200).json({
        msg:"user Updated Successfully",
        user:userToUpdate
     })
    }
    catch(error){
       next(error)
    }
}

const searchUserController=async (req,res,next)=>{
    const {query}=req.params
    try{

        const users=await User.find({
            $or:[
                {username:{$regex:new RegExp(query,'i')}},
                {fullName:{$regex:new RegExp(query,'i')}}
            ]
        })

        res.status(200).json({users})
    }
    catch(error){
        next(error)
    }

}
const generateFileUrl=(filename)=>{
    return process.env.URL+`/uploads/${filename}`
}

const uploadProfilePictureController = async(req,res,next)=>{
  const {userId}=req.params
  const {filename}=req.file
  try {
    const user=await User.findByIdAndUpdate(userId,{profilePicture:generateFileUrl(filename)},{new:true})
    if(!user){
        throw new CustomError("user not found !!",404)
    }
    res.status(200).json({msg:"ProfilePic Update Successfully",user})
  } catch (error) {
    next(error)
  }
}

module.exports={getUserController,updateUserController,searchUserController,uploadProfilePictureController}
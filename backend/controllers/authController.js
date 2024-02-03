const bycrpt = require("bcrypt");
const JWT = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config()
const User = require("../models/user.model");
const { CustomError } = require("../middlewares/error.middleware");


const registerController = async (req,res,next)=>{
    try{
     const {username,password,email}= req.body;
     const existingUser =await User.findOne({ $or:[{username},{email}] })
     if(existingUser){
        throw new CustomError("User already exists !",400)
     }

     const salt = await bycrpt.genSalt(10);
     const hashedPassword = await bycrpt.hashSync(password,salt);
     const newUser = new User({...req.body,password:hashedPassword})
     const savedUser = await newUser.save();
     res.status(201).json(savedUser)
    }
    catch(error){
     next(error)
    }
}

const loginController = async(req,res,next)=>{
    try{
      let user;
      console.log(req.body)
      if(req.body.email){
        user = await User.findOne({email:req.body.email})
      }
      else{
        user = await User.findOne({username:req.body.username})
      }

      if(!user){
        throw new CustomError("User doesn't exists !",404)
      }
      const match= await bycrpt.compare(req.body.password,user.password)
      if(!match){
        throw new CustomError("Wrong Credentials!",401)
      }
      const {password,...data}=user._doc
      const token=JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
      res.cookie("token",token).status(200).json(data)

    }
    catch(error){
     next(error)
    }
}


const logoutController = async(req,res,next)=>{
    try{
      res.clearCookie("token",{sameSite:"none",secure:true}).status(200).json({
        msg:"User Logged out successfully!!"
      })
    }
    catch(error){
      next(error)
    }
  }


const refetchController = async (req,res,next)=>{
    const token = req.cookies.token
    JWT.verify(token,process.env.JWT_SECRET,{},async(err,data)=>{
     console.log(data);
     if(err){
       throw new CustomError(err,404)
     }
     try{
       const id = data._id
       const user = await User.findOne({_id:id})
       res.status(200).json(user)
     }
     catch(error){
       next(error)
     }
    })
  }


  module.exports={registerController,loginController,logoutController,refetchController}
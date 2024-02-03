const { CustomError } = require('../middlewares/error.middleware')
const Post = require('../models/post.model')
const dotenv = require("dotenv")
const User = require('../models/user.model')
dotenv.config()


const createPostController = async(req,res,next)=>{
   const{userId,caption}=req.body
   try {
    const user = await Post.findById(userId)
    if(!user){
        throw new CustomError("user Not Found!",404)
    }
    const newPost = new Post.create({
        user:userId,
        caption
    })
    await newPost.save()
    user.posts.push(newPost._id)
    await user.save()
    res.status(201).json({msg:"New Post Created Successfully!!",post:newPost})
   } catch (error) {
    next(error)
   }
}

const generateFileUrl=(filename)=>{
    return process.env.URL+`/uploads/${filename}`
}

const createPostWithImageController=async(req,res,next)=>{
    const {userId}=req.params
    const {caption}=req.body
    const files = req.files

    try {
        const imageUrls=files.map(file=>generateFileUrl(file.filename))
        const newPost = new Post.create({
            user:userId,
            caption,
            image:imageUrls
        })

        await newPost.save()
        user.posts.push(newPost._id)
        await user.save()
        res.status(201).json({message:"post Created Successfully!!",post:newPost})
    } catch (error) {
        next(error)
    }
}

const getAllPostsController=async(req,res,next)=>{
   const {userId} = req.params
   try {
    const user = await Post.findById(userId)
    if(!user){
        throw new CustomError("User Not Found!",404)
    }
    const allPost = await Post.find({user:userId}).populate("user","username fullName profilePicture")
    res.status(200).json({posts:allPost})
   } catch (error) {
    next(error)
   }
}

const getUserPostsController =async(req,res,next)=>{
    const {userId} = req.params
    try {
     const user = await Post.findById(userId)
     if(!user){
         throw new CustomError("User Not Found!",404)
     }
     const userPosts = await Post.find({user:userId})
     res.status(200).json({posts:userPosts})
    } catch (error) {
     next(error)
    }
}

const deletePostController=async(req,res,next)=>{
    const {postId}=req.params
    try {
        const postToDelete = await Post.findById(postId)
        if(!postToDelete){
            throw new CustomError("Post Not Found!!",404)
        }
        const user =await User.findById(postToDelete.user)
        if(!user){
            throw new CustomError("user Not Found!!",404)
        }
        user.posts=user.posts.filter(postId=>postId.toString()!==postToDelete._id.toString())
        await user.save()
        await postToDelete.deleteOne()
        res.status(200).json({msg:"Post Deleted Sucessfully"})
    } catch (error) {
        next(error)
    }
}

const likePostController=async(req,res,next)=>{
    const {postId}=req.params
    const {userId}=req.body
    try {
        const post =await Post.findById(postId)
        if(!post){
            throw new CustomError("Post Not Found",404)
        }
        const user = await User.findById(userId)
        if(!user){
            throw new CustomError("User Not Found",404)
        }
        if(post.likes.includes(userId)){
            throw new CustomError("You already liked This Post",400)
        }
        post.likes.push(userId)
        await post.save()
        res.status(200).json({msg:"you liked post",post})
    } catch (error) {
     next(error)
    }
}
const dislikePostController=async(req,res,next)=>{
    const {postId}=req.params
    const {userId}=req.body
    try {
        const post =await Post.findById(postId)
        if(!post){
            throw new CustomError("Post Not Found",404)
        }
        const user = await User.findById(userId)
        if(!user){
            throw new CustomError("User Not Found",404)
        }
        if(post.likes.includes(userId)){
            throw new CustomError("You already disliked This Post",400)
        }
        post.likes=post.likes.filter(id=>id.toString()!== userId)
        await post.save()
        res.status(200).json({msg:"you disliked post",post})
    } catch (error) {
     next(error)
    }
}
module.exports={createPostController,createPostWithImageController,getAllPostsController,getUserPostsController,deletePostController,likePostController,dislikePostController}
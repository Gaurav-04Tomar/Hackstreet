const express = require("express")
const router = express.Router()
const upload =require("../middlewares/upload.middleware")
const { createPostController,createPostWithImageController,getAllPostsController,getUserPostsController, deletePostController,likePostController, dislikePostController } = require("../controllers/postController")


//Create Post 
router.post("/create",createPostController)
// Create Post with images
router.post("/create/:userId",upload.array("images",5),createPostWithImageController)
//get all post
router.get("/all/:userId",getAllPostsController)
//get user Post
router.get("/user/:userId",getUserPostsController)
//delete post
router.delete("/delete/:postId",deletePostController)
// Like post
router.post("/like/:postId",likePostController)
//dislike Post
router.post("/dislike/:postId",dislikePostController)

module.exports=router
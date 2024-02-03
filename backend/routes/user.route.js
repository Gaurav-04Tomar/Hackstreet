const express = require("express")
const { getUserController,updateUserController, searchUserController,uploadProfilePictureController } = require("../controllers/userController")
const upload = require("../middlewares/upload.middleware")
const router = express.Router()

router.get("/:userId",getUserController)
//update user
router.put("/update/:userId",updateUserController)
router.get("/search/:query",searchUserController)
router.put("/update-profile-picture/:userId",upload.single("profilePicture"),uploadProfilePictureController)
module.exports=router
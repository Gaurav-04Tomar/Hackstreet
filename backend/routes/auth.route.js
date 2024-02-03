const express = require("express");
const { registerController, loginController, logoutController, refetchController } = require("../controllers/authController");
const router = express.Router();

router.post("/Register",registerController)
router.post("/login",loginController)
router.get("/logout",logoutController)
router.get("/refetch",refetchController)

module.exports=router;
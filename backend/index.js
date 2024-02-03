const express = require("express");
const connectDB = require("./database/index")
const app = express();
const dotenv = require("dotenv")
const cors = require("cors")

dotenv.config()
const cookieparser = require("cookie-parser")
const authRoute = require("./routes/auth.route")
const userRoute = require("./routes/user.route")
const postRoute = require("./routes/post.route")
const commentRoute =require("./routes/comment.route")
const conversationRoute =require("./routes/conversation.route")
const messageRoute=require("./routes/message.route")
const path = require("path")
const {errorHandler} = require("./middlewares/error.middleware")
const verifyToken = require("./middlewares/verifyToken.middleware")

app.use(express.json());
app.use(cookieparser())
app.use("/uploads",express.static(path.join(__dirname,"uploads")))
app.use(cors({
    origin:"http://localhost:3001"
}))

app.use("/api/auth",authRoute);
app.use("/api/user",verifyToken,userRoute)
app.use("/api/post",verifyToken,postRoute)
app.use("/api/comment",verifyToken,commentRoute)
app.use("/api/conversation",verifyToken,conversationRoute)
app.use("/api/message",verifyToken,messageRoute)


app.use(errorHandler)

app.listen(process.env.PORT,async()=>{
   await connectDB();
    console.log("App is Running",process.env.PORT )
})
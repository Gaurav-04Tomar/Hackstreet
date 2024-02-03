const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config()

const connectDB =async()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log(` \n MONGODB Connnected Successfully!! DB HOST ${connectionInstance.connection.host}`)
     
     }
     catch(error){
        console.log("Connection Failed !!",error);
        process.exit(1);
     }
}

module.exports=connectDB
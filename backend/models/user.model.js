const mongoose  = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    fullname:{
        type:String,
        required:true,
        trim:true
    },
    bio:{
        type:String,
        trim:true
    },
    profilePicture:{
        type:String,
        defalut:""
    },
    coverPicture:{
        type:String,
        default:""
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    skills:[{
        type:String
    }]

},{
    timestamps:true
})

const User = mongoose.model("User",userSchema);
module.exports=User;
import mongoose from "mongoose";

const userSchema=mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        token:{
            type:String
        },
        role:{
            type:String,
            default:"user",
            enum:["user","admin"]
        }

    },
  

)
const User=mongoose.model("User",userSchema)
export default User;
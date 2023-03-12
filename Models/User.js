const mongoose=require('mongoose')


const UserSchema=new mongoose.Schema({
    userid:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    }
})

const UserModel=mongoose.model("user",UserSchema)
module.exports=UserModel;
const mongoose = require("mongoose");

const AdminRegisterSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    phone:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    }
});

const AdminRegisterModel = mongoose.model("AdminRegister",AdminRegisterSchema)
module.exports = AdminRegisterModel
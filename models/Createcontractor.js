const mongoose = require("mongoose");

const createcontractorschema= new mongoose.Schema({
    name:{
        type:String,
        
    },
    mobile:{
        type:String,
        
    },
    email:{
        type:String,
        

    },
    password:{
        type:String,
        

    },
    city:{
        type:String,
        
    },
    area:{
        type:String,
        
    },
    department:{
        type:String,
        
    },
    landmark:{
        type:String,
        
    },
    message:{
        type:String,
        
    },
    status:{
        type:String,
        default:"pending"
    }
});

const CreateContractorModel = mongoose.model("createcontractor",createcontractorschema);

module.exports = CreateContractorModel;
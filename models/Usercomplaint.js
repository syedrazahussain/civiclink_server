const mongoose = require('mongoose');

const { Schema } = mongoose;

const UsercomplaintSchema = new Schema({
    name: String,
    mobile: Number,
    city: String,
    area: String,
    landmark: String,
    image: String,
    message: String,
   
    status:{
        type:String,
        default:"pending"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'register', // The model to which the userId references
        required:true
        
    }
});

const UsercomplaintModel = mongoose.model("usercomplaint", UsercomplaintSchema);

module.exports = UsercomplaintModel;

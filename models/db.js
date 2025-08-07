const mongoose = require('mongoose');

const connectdb = async() =>{
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("mongodb is connected");
  } catch (error) {
    console.log("error in mongodb is not connected")
    
  }
};

module.exports = connectdb;
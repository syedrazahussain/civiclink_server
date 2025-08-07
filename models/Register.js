const mongoose = require("mongoose");

const RegisterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Store emails in lowercase for consistency
    },
    phone: {
        type: String, // Store phone as a string (allow formatting characters, leading zeros, etc.)
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    // confirmpassword should not be stored in the DB, handled separately during validation
    confirmpassword: {
        type: String,
        required: true,
    },
});

const RegisterModel = mongoose.model("register",RegisterSchema)
module.exports = RegisterModel
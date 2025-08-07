const express = require("express")
const { logincontroller, registercontroller, authController,getprofilecontroller ,updateProfileController} = require("../Controllers/userController")
const authmiddleware = require("../Middlewares/authmiddleware")
const RegisterModel = require("../models/Register")
const mongoose = require("mongoose")

const router = express.Router()

router.post('/login',logincontroller)

router.post('/register',registercontroller)

router.post('/getUserData',authmiddleware,authController)




router.get('/getmyprofiledetails/:userId',getprofilecontroller)
router.put('/updateprofile/:userId', updateProfileController);

  

module.exports = router;

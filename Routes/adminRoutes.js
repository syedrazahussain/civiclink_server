const express = require("express");
const { adminregistercontroller, adminlogincontroller, 
    CreateContractorcontroller, fetchcontractorcontroller, 
    getcontractorbyidcontroller, updatecontractorcontroller,
     getreportworkcontroller } 
     = require("../Controllers/AdminController");


const router = express.Router()

router.post('/adminregister',adminregistercontroller)

router.post('/adminlogin',adminlogincontroller)

router.post('/createcontractor',CreateContractorcontroller)

router.get('/fetchcontractor',fetchcontractorcontroller)

router.get('/getcontractorbyid/:id',getcontractorbyidcontroller)

router.put('/updatecontractor/:id',updatecontractorcontroller)

router.get('/getreportwork',getreportworkcontroller)

module.exports = router;
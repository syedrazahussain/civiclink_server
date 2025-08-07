const express = require("express");
const { logincontractorcontroller, getmyworkcontroller, updatestatuscontroller } = require("../Controllers/ContractController");


const router = express.Router()

router.post('/logincontractor',logincontractorcontroller)

router.get('/getmywork',getmyworkcontroller)

router.put('/updateStatus/:id',updatestatuscontroller)



module.exports = router;
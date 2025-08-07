const AdminRegisterModel = require('../models/AdminRegister')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const CreateContractorModel = require('../models/Createcontractor');


const adminregistercontroller = async (req, res) => {
    try {

        const existingadmin = await AdminRegisterModel.findOne({ email: req.body.email })
        if (existingadmin) {
            return res.status(200).send({ message: `Admin User Already Exist`, success: false })
        }

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(password, salt)
        req.body.password = hashpassword

        const newadmin = new AdminRegisterModel(req.body)
        await newadmin.save()
        res.status(201).send({ message: `Admin Registration successfully`, success: true });


    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, messaage: `Admin Register Controller ${error.message}` })

    }
}

const adminlogincontroller = async (req, res) => {

    try {
        const user = await AdminRegisterModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(200).send({ message: `user not found`, success: false })
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res.status(200).send({ message: `Invalid email or password`, success: false })
        }

        const admintoken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).send({ message: 'Login sucess', success: true, admintoken })
    } catch (error) {
        console.log(error);
        res.staus(500).send({ message: `Error in admin login ctrl ${error.message}` })

    }

}

const CreateContractorcontroller = async (req, res) => {
    try {
        const { name, mobile, email, password, city, area, department, landmark, message } = req.body;

        CreateContractorModel.create({
            name,
            mobile,
            email,
            password,
            city,
            area,
            department,
            landmark,
            message
        })
            .then(createcontractor => res.json(createcontractor))



    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error in createcontractorcontroller");

    }
}

const fetchcontractorcontroller = async (req, res) => {
    try {

        CreateContractorModel.find()
            .then(fetchcontractor =>
                res.json(fetchcontractor)
            )

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error in fetchcontractorcontroller");


    }
}

const getcontractorbyidcontroller = async (req, res) => {
    try {

        const { id } = req.params;

        CreateContractorModel.findById(id)
            .then((contractor) => {
                if (!contractor) {
                    return res.status(404).json({ message: 'Contractor not found' });
                }
                res.json(contractor);
            })



    } catch (err) {

        console.error(err.message);
        res.status(500).send("Server error in getcontractorbyidcontroller");

    }
}

const updatecontractorcontroller = async (req, res) => {
    try {

        const { id } = req.params;
        const { name, mobile, email, password, city, area, department, landmark, message } = req.body;

        CreateContractorModel.findByIdAndUpdate(
            id,
            { name, mobile, email, password, city, area, department, landmark, message },
            { new: true }

        )
            .then((updatedContractor) => {
                if (!updatedContractor) {
                    return res.status(404).json({ message: 'Contractor not found' });
                }
                res.json(updatedContractor);
            })

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error in updatecontractorcontroller");

    }
}

const getreportworkcontroller = async(req,res) =>{
    try {

        CreateContractorModel.find()
        .then((report) => res.json(report))
        
        
    } catch (err) {

        console.error(err.message);
        res.status(500).send("Server error in getreportworkcontroller");

        
    }
}

module.exports = {
    adminregistercontroller, adminlogincontroller,
    CreateContractorcontroller, fetchcontractorcontroller,
    getcontractorbyidcontroller,updatecontractorcontroller,
    getreportworkcontroller

}
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const CreateContractorModel = require("../models/Createcontractor");
const bcrypt = require("bcrypt");

const logincontractorcontroller = async (req, res) => {
    try {


        const existingcontract = CreateContractorModel.findOne({ email: req.body.email });
        if (!existingcontract) {
            res.status(404).send("contractor not found")
        }
        // const isMatch = await bcrypt.compare(req.body.password, existingcontract.password)
        // if (!isMatch) {
        //     return res.status(200).send({ message: `Invalid email or password`, success: false })
        // }

        const contracttoken = jwt.sign({ id: existingcontract._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).send({ message: 'Login sucess', success: true, contracttoken })


    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error in logincontractorcontroller")

    }
}


const getmyworkcontroller = async(req,res) =>{
    const email = req.query.email;  // Get the email from query params

    // Find work items by email
    CreateContractorModel.find({ email: email })
        .then(works => {
            res.json(works);  // Return filtered works
        })
        .catch(err => {
            res.status(500).json({ message: "Error fetching works", error: err });
        });
}

const updatestatuscontroller = async(req,res) =>{

    const { id } = req.params; // Get the ID from the URL parameter
    const { status } = req.body; // Get the status from the request body

    if (!status) {
        return res.status(400).json({ message: "Status is required" });
    }

    try {
        // Find the work by ID and update the status
        const updatedWork = await CreateContractorModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }  // Return the updated document
        );

        if (!updatedWork) {
            return res.status(404).json({ message: "Work not found" });
        }

        // Return the updated work in the response
        res.status(200).json(updatedWork);
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ message: "Internal server error" });
    }

}

module.exports = { logincontractorcontroller,getmyworkcontroller,updatestatuscontroller }
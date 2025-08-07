const RegisterModel = require('../models/Register')
const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')


const registercontroller = async (req, res) => {
    try {
        const existinguser = await RegisterModel.findOne({ email: req.body.email })
        if (existinguser) {
            return res.status(200).send({ message: `user already exist `, success: false })
        }

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(password, salt)
        req.body.password = hashpassword

        const newuser = new RegisterModel(req.body)
        await newuser.save()
        res.status(201).send({ message: `Register Successfully`, success: true });
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: `Register Controller ${error.message}` })

    }
}


const logincontroller = async (req, res) => {
    try {
        const user = await RegisterModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(200).send({ message: 'user are not found', success: false })

        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res.status(200).send({ message: `Invalid email or password`, success: false })

        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });



        res.status(200).send({ message: 'Login Success', success: true, token, _id: user._id ,email:user.email});


    } catch (error) {
        console.log(error)
        res.status(500).send({ message: `Error in login ctrl ${error.message}` })

    }
}

const authController = async (req, res) => {

    try {
        const user = await RegisterModel.findOne({ _id: req.userId })
        if (!user) {
            return res.status(404).send({ message: 'user not found', success: false })
        }
        else {
            res.status(200).send({
                success: true,
                data: {
                    name: user.name,
                    email: user.email
                }
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: 'auth error',
            success: false,
            error
        })

    }

}

const getprofilecontroller = async (req, res) => {
    const userId = req.params.userId;
    try {
      const userProfile = await RegisterModel.findById(userId); // Assuming you're using mongoose
      if (userProfile) {
        res.json([userProfile]); // Respond with the user profile wrapped in an array
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      res.status(500).json({ error: 'Server error' });
    }
}

const updateProfileController = async (req, res) => {
    const userId = req.params.userId;
    const { name, email, phone } = req.body;
  
    try {
      // Find the user and update their data
      const updatedUser = await RegisterModel.findByIdAndUpdate(userId, { name, email, phone }, { new: true });
  
      if (updatedUser) {
        // Return the updated user profile
        res.json({ success: true, message: 'Profile updated successfully', data: updatedUser });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  




module.exports = { logincontroller, registercontroller, authController,getprofilecontroller,updateProfileController }









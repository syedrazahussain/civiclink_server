const express = require('express')
const cors = require("cors")
const multer = require("multer")
const path = require("path")
const mongoose = require("mongoose")
const RegisterModel = require("./models/Register")
const UsercomplaintModel = require('./models/Usercomplaint')
const bodyparser = require('body-parser');
const { sendMail } = require('./helpers/sendMail')
const nodemailer = require('nodemailer');



const connectdb = require('./models/db');
const router = require('./Routes/userRoutes')
const adminrouter = require('./Routes/adminRoutes')
const contractrouter = require('./Routes/contractRoutes')

const app = express();
require('dotenv').config();
connectdb();
const PORT = process.env.PORT || 5013;

app.use(express.json());
app.use(cors());
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'public'))); 

// User complaint submission
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/Images');  // Store images in public/Images folder
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// app.post('/usercomplaint', upload.single('file'), (req, res) => {
//     const { name, mobile, city, area, landmark, message, email } = req.body;
//     const image = req.file ? req.file.filename : null;  // Handle file upload if available

//     if (!email) {
//         return res.status(400).json({ message: 'Email is required to associate the complaint with a user.' });
//     }

//     RegisterModel.findOne({ email: email })
//         .then(user => {
//             if (!user) {
//                 return res.status(404).json({ message: 'User not found with the given email.' });
//             }

//             UsercomplaintModel.create({
//                 name,
//                 mobile,
//                 city,
//                 area,
//                 landmark,
//                 message,
//                 image,
//                 userId: user._id  // Reference to the user who made the complaint
//             })
//                 .then(usercomplaint => res.json(usercomplaint))

//                 sendMail(email,"hello testing subject","testingtext")
//                 .catch(err => {
//                     console.error('Error creating user complaint:', err);
//                     res.status(500).json({ message: 'Error creating complaint', error: err.message });
//                 });
//         })
//         .catch(err => {
//             console.error('Error finding user:', err);
//             res.status(500).json({ message: 'Error finding user', error: err.message });
//         });
// });




app.post('/usercomplaint', upload.single('file'), (req, res) => {
    const { name, mobile, city, area, landmark, message, email } = req.body;
    const image = req.file ? req.file.filename : null;  // Handle file upload if available

    if (!email) {
        return res.status(400).json({ message: 'Email is required to associate the complaint with a user.' });
    }

    RegisterModel.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found with the given email.' });
            }

            UsercomplaintModel.create({
                name,
                mobile,
                city,
                area,
                landmark,
                message,
                image,
                userId: user._id  // Reference to the user who made the complaint
            })
                .then(usercomplaint => {
                    // Sending email to the user upon successful complaint registration
                    sendConfirmationEmail(user.email, usercomplaint)
                        .then(() => {
                            res.json(usercomplaint); // Respond with the created complaint
                        })
                        .catch(err => {
                            console.error('Error sending confirmation email:', err);
                            res.status(500).json({ message: 'Complaint created, but email failed to send.' });
                        });
                })
                .catch(err => {
                    console.error('Error creating user complaint:', err);
                    res.status(500).json({ message: 'Error creating complaint', error: err.message });
                });
        })
        .catch(err => {
            console.error('Error finding user:', err);
            res.status(500).json({ message: 'Error finding user', error: err.message });
        });
});


// Function to send confirmation email
const sendConfirmationEmail = (userEmail, complaint) => {
    return new Promise((resolve, reject) => {
        // Set up the transporter with your email service configuration (e.g., Gmail, SendGrid)
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can change this to another service like SendGrid, etc.
            auth: {
                user: process.env.myemail,
                pass: process.env.pass // Use environment variables for sensitive data
            }
        });

        const mailOptions = {
            from: process.env.myemail,
            to: userEmail,
            subject: 'Complaint Registered Successfully',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #5d8aa8; text-align: center;">Complaint Registered Successfully</h2>
                    <p>Hello <strong>${complaint.name}</strong>,</p>
                    <p>Your complaint has been successfully registered with the following details:</p>
                    <p><strong>Complaint ID:</strong> ${complaint._id}</p>
                    <p><strong>Message:</strong> ${complaint.message}</p>
                    <p><strong>Location:</strong> ${complaint.city}, ${complaint.area}, ${complaint.landmark}</p>
                    <p><strong>Status:</strong> ${complaint.status}</p>
                    <p style="text-align: center;">We will get back to you shortly regarding the status of your complaint.</p>
                    <p style="text-align: center;">Thank you for reaching out!</p>
                    <p style="text-align: center; font-size: 12px; color: #777;">Best regards,<br>Support Team</p>
                </div>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
};

app.use(express.static(path.join(__dirname, 'public'))); 
// Get complaints by userId
app.get('/getcomplaints', (req, res) => {


    UsercomplaintModel.find()
        .then(complaints => res.json(complaints))
        .catch(err => {
            console.error('Error fetching complaints:', err);
            res.status(500).json({ message: 'Error fetching complaints', error: err.message });
        });
});

app.get('/allusersdata', (req, res) => {
    RegisterModel.find()
        .then(usersdata => res.json(usersdata))
        .catch(err => {
            console.error('Error fetching users:', err);
            res.status(500).json({ message: 'Error fetching users', error: err.message });
        });

})

app.get('/viewcomplaints', (req, res) => {
    UsercomplaintModel.find()
        .then(complaints1 => res.json(complaints1))
        .catch(err => {
            console.error('Error fetching complaints:', err);
            res.status(500).json({ message: 'Error fetching complaints', error: err.message });
        });
});

app.put('/updatestatus/:id', (req, res) => {
    const id = req.params.id;  // Get the complaint ID from the URL parameter
    const { status, message: updatedMessage } = req.body;  // Get status and message from the request body

    // Update the complaint in the database using the complaint ID
    UsercomplaintModel.findByIdAndUpdate(id, { status, message: updatedMessage }, { new: true })
        .populate('userId', 'email name')  // Populate the userId field with the user's email and name
        .then(updatedComplaint => {
            if (!updatedComplaint) {
                return res.status(404).json({ success: false, message: 'Complaint not found' });
            }

            // Check if the email is present before sending
            if (!updatedComplaint.userId || !updatedComplaint.userId.email) {
                return res.status(400).json({ success: false, message: 'User email not found' });
            }

            // Send status update email
            sendStatusUpdateEmail(updatedComplaint)
                .then(() => {
                    res.json({ success: true, message: 'Complaint updated successfully', data: updatedComplaint });
                })
                .catch(err => {
                    console.error('Error sending status update email:', err);
                    res.status(500).json({ success: false, message: 'Complaint updated, but email failed to send.' });
                });
        })
        .catch(err => {
            console.error('Error updating complaint:', err);
            res.status(500).json({ success: false, message: 'Error updating complaint', error: err.message });
        });
});

// Function to send status update email to the user
const sendStatusUpdateEmail = (updatedComplaint) => {
    return new Promise((resolve, reject) => {
        // Set up the transporter with your email service configuration (e.g., Gmail, SendGrid)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.myemail,
                pass: process.env.pass // Use environment variables for sensitive data
            }
        });

        // Choose the template based on the status
        let subject = '';
        let htmlContent = '';

        if (updatedComplaint.status === 'In Progress') {
            subject = 'Your Complaint is In Progress';
            htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #f39c12; text-align: center;">Complaint Status: In Progress</h2>
        <p>Hello <strong>${updatedComplaint.name}</strong>,</p>
        <p>We would like to inform you that we have assigned a dedicated team to address your complaint. The team is actively working on the issue in your area, and we will ensure that it is resolved promptly. We appreciate your patience while we work on resolving this matter.</p>
        <p><strong>Status:</strong> In Progress</p>
        <p><strong>Message:</strong> ${updatedComplaint.message}</p>
    </div>
    
    <div style="text-align: center; margin-top: 20px; font-family: Arial, sans-serif; color: #333;">
        <p>Thank you for your continued patience as we work towards a resolution. Should you have any further questions, feel free to reach out to us.</p>
        <p>Best regards,<br>Support Team</p>
    </div>
`;

        } else if (updatedComplaint.status === 'Resolved') {
            subject = 'Your Complaint Has Been Resolved';
            htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #28a745; text-align: center;">Complaint Status: Resolved</h2>
        <p>Hello <strong>${updatedComplaint.name}</strong>,</p>
        <p>We are pleased to inform you that your complaint with ID <strong>${updatedComplaint._id}</strong> has been resolved.</p>
        <p><strong>Status:</strong> Resolved</p>
        <p><strong>Message:</strong> ${updatedComplaint.message}</p>
    </div>
    
    <div style="text-align: center; margin-top: 20px; font-family: Arial, sans-serif; color: #333;">
        <p>Thank you for your patience and for allowing us to resolve the issue. If you have any further questions, feel free to reach out!</p>
        <p>Best regards,<br>Support Team</p>
    </div>
`;

        }

        const mailOptions = {
            from: process.env.myemail,
            to: updatedComplaint.userId.email,  // Ensure email exists
            subject: subject,
            html: htmlContent
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
};

app.use('/api/v1/user', router);
app.use('/api/v1/admin', adminrouter);
app.use('/api/v1/contract', contractrouter)

app.listen(process.env.PORT || 5013, () => {
    console.log(`server is running on port ${PORT}`);
});

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  
  secure: true, // true for port 465, false for other ports
  auth: {
    user: "srazahussain1514@gmail.com",
    pass: "izmgngqcnmoczjzd",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(email,to,subject,text,html) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'srazahussain1514@gmail.com', // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html // html body
  });

}

module.exports = {sendMail}
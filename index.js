const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main(msg, to) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.email, // generated ethereal user
      pass: process.env.password, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"stopstalk"', // sender address
    to: to, // list of receivers
    subject: "Notification from stopstalk", // Subject line
    // text: "Hello world?", // plain text body
    html: msg, // html body
  });

  //   console.log("Message sent: %s", info.messageId);
  //   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
app.post("/admin/sendmail", function (req, res) {
  main(req.body.msg, req.body.to);
  //   console.log("called");
});

app.listen(5000);

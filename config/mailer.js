var nodemailer = require("nodemailer");

const sendMail = (to, subject, html) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    // auth: {
    //   user: process.env.MAIL_ADDRESS,
    //   pass: process.env.MAIL_PASSWORD,
    // },
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_ADDRESS,
      serviceClient: "106330625670514145905",
      privateKey: "92fd15bc5861336fb6281468ba803a9e78e12f95",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  var mailOptions = {
    from: process.env.MAIL_ADDRESS,
    to: to,
    subject,
    // text: `Hi Smartherd, thank you for your nice Node.js tutorials.
    //         I will donate 50$ for this course. Please send me payment options.`,
    html: html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = {
  sendMail,
};

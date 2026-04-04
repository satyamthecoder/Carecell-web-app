const nodemailer = require("nodemailer");

const sendEmail = async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"CareCell" <${process.env.SMTP_USER}>`,
      to,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
    });

  } catch (error) {
    console.error("Email Error:", error.message);
  }
};

module.exports = sendEmail;
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "anastahirhussain7@gmail.com",
      pass: "dret qzar kmrq mbsn",
    },
  });

export default transporter
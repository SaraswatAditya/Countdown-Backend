const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/send-email', upload.single('file'), async (req, res) => {
  const { message, emoji } = req.body;
  const file = req.file;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.RECIPIENT_EMAIL,
    subject: 'New Message from Countdown Timer',
    text: `Message: ${message}\nEmoji: ${emoji}`,
    attachments: file ? [{ filename: file.originalname, content: file.buffer }] : [],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

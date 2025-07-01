import express from 'express';
import cors from 'cors';
import multer from 'multer';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("./uploads",express.static(path.join(__dirname,"uploads")));

//Storage for upload resume
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() +'_'+file.originalname),
});
const upload = multer({ storage });

//HR email list
const hrEmails = ["adsvce6@gmail.com",
  
];
// const hrEmailsList = 'hrEmails.txt';
// const hrEmailsFile = path.join(__dirname, hrEmailsList);
// const hrEmailsData = fs.readFileSync(hrEmailsFile, 'utf8');

// Send mail route 



app.post("/send-mails",
  upload.single("resume"),
  async (req, res) => {
    const { subject, body } = req.body;
    if(!req.file){
      return res.status(400).json({ message: "Resume file is required" });
    }
    const resumePath = req.file.path;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });
    try {
      
      for(let email of hrEmails){
        await transporter.sendMail({
        from: `"Abhishek Dubey" 
          <${process.env.EMAIL}>`,
          to: email,
          subject,
          text: body,
          attachments: [
            {
              filename: req.file.originalname,
              path: resumePath,
            },
          ],
      });
    }
    res.json({ message: "Emails sent successfully!" });
  } 
  catch (error) {
    console.error("Error sending email:",error);
    res.status(500).json({message: "Failed to send emails."});
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT,() => 
console.log(`Server is started on http://localhost:${PORT}`));











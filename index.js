const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db")
const cloudinary = require('cloudinary').v2;
const upload = require('./config/multerConfig');
const blogRoutes = require('./routes/blogRoutes');
const imageRoutes = require('./routes/imageRoutes');
const cors = require("cors");
const app = express();
const port = process.env.PORT
app.use(express.json())

connectDB();

app.use(cors({
  origin: 'http://localhost:5173',  // Frontend running on localhost
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
  credentials: true  // Allow credentials (cookies, authorization headers, etc.)
}));

// app.options('*', cors()); 

// app.options('*', (req, res) => {
//     console.log('Preflight request received:', req.headers);
//     res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
//     res.sendStatus(200);
//   });
  

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use('/api/blog-posts', blogRoutes);
app.use('/api/images', imageRoutes);

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path , {
       folder:'folder_name'
    });

    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading image to Cloudinary' });
  }
});
app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})
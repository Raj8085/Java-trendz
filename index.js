const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db")
connectDB();
const cloudinary = require('cloudinary').v2;
const upload = require('./config/multerConfig');
const blogRoutes = require('./routes/blogRoutes');
const imageRoutes = require('./routes/imageRoutes')
const app = express();
const port = process.env.PORT
app.use(express.json())

app.use('/api/blog-posts', blogRoutes);
app.use('/api/images', imageRoutes);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
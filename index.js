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

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Express route for image upload
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path , {
       folder:'folder_name'
    });

    // Send the Cloudinary URL in the response
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading image to Cloudinary' });
  }
});



app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})
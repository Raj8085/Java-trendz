// const express = require('express');
// const cloudinary = require('../config/cloudinaryConfig');
// const upload = require('../config/multerConfig');
// // const Image = require('../models/image')

// const router = express.Router();

// // Upload image to Cloudinary
// router.post('/upload', upload.single('image'), async (req, res) => {
//   try {
//     if (!req.file) {
//         console.log(req.file)
//     //   return res.status(400).json({ message: 'No file uploaded' });
//     }

//     // Upload image to Cloudinary
//     const result = cloudinary.uploader.upload_stream({ folder: 'uploads' }, (error, result) => {
//         if (error) throw error;
//         return result;
//     }).end(req.file.buffer);

//     console.log('Cloudinary Upload Result:', result);

//     // const image = new Image({
//     //     imageUrl: result.secure_url,
//     //     publicId: result.public_id,
//     //   });

//     //   await image.save();


//     res.status(201).json({
//       message: 'Image uploaded successfully',
//       imageUrl: result.secure_url,
//       publicId: result.public_id,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Image upload failed', error: error.message });
//   }
// });

// module.exports = router;


const express = require('express');
const cloudinary = require('../config/cloudinaryConfig');
const upload = require('../config/multerConfig');
const Image = require('../models/image')

const router = express.Router();

// Upload image to Cloudinary
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload image to Cloudinary
    cloudinary.uploader.upload_stream({ folder: 'uploads' }, async (error, result) => {
      if (error) {
        return res.status(500).json({ message: 'Error uploading to Cloudinary', error: error.message });
      }

      // Log the result for debugging
      console.log('Cloudinary Upload Result:', result.secure_url, result.public_id);

      // Example: Save image metadata in MongoDB if you have a model for it
      const image = new Image({
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });
      await image.save();

      // Send back the result
      res.status(201).json({
        message: 'Image uploaded successfully',
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });
    }).end(req.file.buffer);  // Send the image buffer to Cloudinary

  } catch (error) {
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
});

module.exports = router;

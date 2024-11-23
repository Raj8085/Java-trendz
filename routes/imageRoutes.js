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
const Image = require('../models/image');
const BlogPost = require('../models/blogPost');

const router = express.Router();


router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Step 1: Create a new MongoDB document to get the `_id`
    const newImage = new Image(); // Create a document without saving yet to get the `_id`
    const generatedId = newImage._id.toString(); // Extract the `_id` as a string

    // Step 2: Upload the image to Cloudinary using the `_id` as the `public_id`
    cloudinary.uploader.upload_stream(
      { folder: 'uploads', public_id: generatedId }, // Set `public_id` to the MongoDB `_id`
      async (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ message: 'Error uploading to Cloudinary', error: error.message });
        }

        console.log('Cloudinary Upload Result:', result.secure_url, result.public_id);

        // Step 3: Save the image details to MongoDB
        newImage.imageUrl = result.secure_url; // Save the Cloudinary URL
        newImage.publicId = result.public_id; // Save the `_id` as publicId
        await newImage.save(); // Save the document to MongoDB

        // Respond with success
        res.status(201).json({
          message: 'Image uploaded successfully',
          imageUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    ).end(req.file.buffer); // Send the image buffer to Cloudinary
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
});










// router.post('/upload', upload.single('image'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     cloudinary.uploader.upload_stream({ folder: 'uploads' }, async (error, result) => {
//       if (error) {
//         return res.status(500).json({ message: 'Error uploading to Cloudinary', error: error.message });
//       }

//       console.log('Cloudinary Upload Result:', result.secure_url, result.public_id);

//       const image = new Image({
//         imageUrl: result.secure_url,
//         publicId: result.public_id,
//       });
//       await image.save();

//       res.status(201).json({
//         message: 'Image uploaded successfully',
//         imageUrl: result.secure_url,
//         publicId: result.public_id,
//       });
//     }).end(req.file.buffer);  

//   } catch (error) {
//     res.status(500).json({ message: 'Image upload failed', error: error.message });
//   }
// });


router.delete('/:id', async (req, res) => {
  try {
    const imageId = req.params.id;

    // Find the image in MongoDB
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete the image from Cloudinary
    cloudinary.uploader.destroy(image.publicId, async (error, result) => {
      if (error) {
        console.error('Cloudinary Deletion Error:', error.message);
        return res.status(500).json({ message: 'Failed to delete image from Cloudinary', error: error.message });
      }

      console.log('Cloudinary Deletion Result:', result);

      await Image.findByIdAndDelete(imageId);

      res.status(200).json({ message: 'Image deleted successfully' });
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Image deletion failed', error: error.message });
  }
});


module.exports = router;
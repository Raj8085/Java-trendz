const BlogPost = require('../models/blogPost');
const Image = require('../models/image');

// exports.createBlogPost = async (req, res) => {
//   try {
//     const blogPost = new BlogPost(req.body);
//     const savedBlogPost = await blogPost.save();

//     const createdAt = new Date(savedBlogPost.createdAt);
//     const formattedDate = {
//       date: createdAt.getDate(),
//       month: createdAt.getMonth() + 1, 
//       year: createdAt.getFullYear(),
//       time: createdAt.toLocaleTimeString(), 
//     };
//     res.status(201).json({
//         message: "Blog post created successfully",
//         data: {
//           ...savedBlogPost.toObject(),
//           formattedDate,
//         },
//       });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };



exports.createBlogPost = async (req, res) => {
  try {
    const { imageId, ...blogData } = req.body; // Destructure imageId and other blog data

    // Validate the provided image ID
    if (imageId) {
      const image = await Image.findById(imageId);
      if (!image) {
        return res.status(400).json({ message: 'Invalid image ID' });
      }
      blogData.image = imageId; // Add the valid image ID to the blog data
    }

    // Create and save the blog post
    const blogPost = new BlogPost(blogData);
    const savedBlogPost = await blogPost.save();

    // Format the creation date
    const createdAt = new Date(savedBlogPost.createdAt);
    const formattedDate = {
      date: createdAt.getDate(),
      month: createdAt.getMonth() + 1,
      year: createdAt.getFullYear(),
      time: createdAt.toLocaleTimeString(),
    };

    res.status(201).json({
      message: 'Blog post created successfully',
      data: {
        ...savedBlogPost.toObject(),
        formattedDate,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// exports.getAllBlogPosts = async (req, res) => {
//   try {
//     const blogPosts = await BlogPost.find();
//     res.status(200).json(blogPosts);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find().populate('image'); // Populate image field
    res.status(200).json(blogPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.getBlogPostBySlug = async (req, res) => {
  try {
    const blogPost = await BlogPost.findOne({ slug: req.params.slug });
    if (!blogPost) return res.status(404).json({ message: 'Blog post not found' });
    res.status(200).json(blogPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );
    if (!blogPost) return res.status(404).json({ message: 'Blog post not found' });
    res.status(200).json(blogPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findOneAndDelete({ slug: req.params.slug });
    if (!blogPost) return res.status(404).json({ message: 'Blog post not found' });
    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
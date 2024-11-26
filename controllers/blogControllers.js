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
    const { imageId, ...blogData } = req.body; 

    if (imageId) {
      const image = await Image.findById(imageId);
      if (!image) {
        return res.status(400).json({ message: 'Invalid image ID' });
      }
      blogData.image = imageId; 
    }

    const blogPost = new BlogPost(blogData);
    const savedBlogPost = await blogPost.save();

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

// exports.getAllBlogPosts = async (req, res) => {
//   try {
//     const blogPosts = await BlogPost.find().populate('image'); // Populate image field
//     res.status(200).json(blogPosts);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find()
      .select('title image slug description')
      .populate('image', 'imageUrl'); 

    res.status(200).json(blogPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: error.message });
  }
};




// exports.getBlogPostBySlug = async (req, res) => {
//   try {
//     const blogPost = await BlogPost.findOne({ slug: req.params.slug });
//     if (!blogPost) return res.status(404).json({ message: 'Blog post not found' });
//     res.status(200).json(blogPost);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


exports.getBlogPostById = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id)
      .populate('image', 'imageUrl');

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.status(200).json(blogPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: error.message });
  }
};


// exports.updateBlogPost = async (req, res) => {
//   try {
//     const blogPost = await BlogPost.findOneAndUpdate(
//       { slug: req.params.slug },
//       req.body,
//       { new: true }
//     );
//     if (!blogPost) return res.status(404).json({ message: 'Blog post not found' });
//     res.status(200).json(blogPost);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// exports.deleteBlogPost = async (req, res) => {
//   try {
//     const blogPost = await BlogPost.findOneAndDelete({ slug: req.params.slug });
//     if (!blogPost) return res.status(404).json({ message: 'Blog post not found' });
//     res.status(200).json({ message: 'Blog post deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.updateBlogPostById = async (req, res) => {
  try {
    const blogPost = await BlogPost.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } 
    );

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.status(200).json({
      message: 'Blog post updated successfully',
      data: blogPost,
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(400).json({ error: error.message });
  }
};




exports.deleteBlogPostById = async (req, res) => {
  try {
    const blogPost = await BlogPost.findByIdAndDelete(req.params.id);

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    if (blogPost.image) {
      const cloudinary = require('../config/cloudinaryConfig');
      await cloudinary.uploader.destroy(blogPost.image.toString());
    }

    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.getPaginatedBlogPosts = async(req,res)=>{
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const blogPosts = await BlogPost.find().skip(skip).limit(limit);
      const totalPosts = await BlogPost.countDocuments();
      const totalPages = Math.ceil(totalPosts / limit);
      res.json({
          page,
          limit,
          totalPosts,
          totalPages,
          blogPosts
      });        
  } catch (error) {
      console.log(err);
      res.status(500).json({error : "Failed to fetch blog posts"})
  }
}

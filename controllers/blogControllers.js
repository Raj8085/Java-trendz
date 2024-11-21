const BlogPost = require('../models/blogPost');

exports.createBlogPost = async (req, res) => {
  try {
    const blogPost = new BlogPost(req.body);
    const savedBlogPost = await blogPost.save();

    const createdAt = new Date(savedBlogPost.createdAt);
    const formattedDate = {
      date: createdAt.getDate(),
      month: createdAt.getMonth() + 1, // Months are 0-indexed
      year: createdAt.getFullYear(),
      time: createdAt.toLocaleTimeString(), // Human-readable time
    };
    res.status(201).json({
        message: "Blog post created successfully",
        data: {
          ...savedBlogPost.toObject(),
          formattedDate,
        },
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find();
    res.status(200).json(blogPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a blog  by slug
exports.getBlogPostBySlug = async (req, res) => {
  try {
    const blogPost = await BlogPost.findOne({ slug: req.params.slug });
    if (!blogPost) return res.status(404).json({ message: 'Blog post not found' });
    res.status(200).json(blogPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a blog post by slug
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

// Delete a blog post by slug
exports.deleteBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findOneAndDelete({ slug: req.params.slug });
    if (!blogPost) return res.status(404).json({ message: 'Blog post not found' });
    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

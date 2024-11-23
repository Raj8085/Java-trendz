// routes/blogRoutes.js
const express = require('express');
const blogController = require('../controllers/blogControllers')
const router = express.Router();

router.post('/', blogController.createBlogPost);      
router.get('/', blogController.getAllBlogPosts);      
router.get('/blogs/:id', blogController.getBlogPostBySlug); 
router.put('/blogs/:id', blogController.updateBlogPost);  
router.delete('/blogs/:id', blogController.deleteBlogPost); 

module.exports = router;

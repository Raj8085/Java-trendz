// routes/blogRoutes.js
const express = require('express');
const blogController = require('../controllers/blogControllers')
const router = express.Router();

router.post('/', blogController.createBlogPost);      
router.get('/', blogController.getAllBlogPosts);      
router.get('/:slug', blogController.getBlogPostBySlug); 
router.put('/:slug', blogController.updateBlogPost);  
router.delete('/:slug', blogController.deleteBlogPost); 

module.exports = router;

// routes/blogRoutes.js
const express = require('express');
const blogController = require('../controllers/blogControllers')
const router = express.Router();

router.post('/', blogController.createBlogPost);      
router.get('/', blogController.getAllBlogPosts);      
router.get('/blogs/:id', blogController.getBlogPostById); 
router.put('/blogs/:id', blogController.updateBlogPostById);  
router.delete('/blogs/:id', blogController.deleteBlogPostById); 

module.exports = router;

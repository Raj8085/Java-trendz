// routes/blogRoutes.js
const express = require('express');
const {createBlogPost,getPaginatedBlogPosts,getAllBlogPosts,getBlogPostById,updateBlogPostById,deleteBlogPostById} = require('../controllers/blogControllers')
const router = express.Router();

// router.post('/', blogController.createBlogPost);      
// router.get('/', blogController.getAllBlogPosts);      
// router.get('/blogs/:id', blogController.getBlogPostById); 
// router.put('/blogs/:id', blogController.updateBlogPostById);  
// router.delete('/blogs/:id', blogController.deleteBlogPostById); 

// router.get('/paginated',blogController.getPaginatedBlogPosts)


router.post('/', createBlogPost);      
router.get('/',getAllBlogPosts);      
router.get('/blogs/:id',getAllBlogById); 
router.put('/blogs/:id', updateBlogPostById);  
router.delete('/blogs/:id', deleteBlogPostById); 

router.get('/paginated',getPaginatedBlogPosts)

module.exports = router;

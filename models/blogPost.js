const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  duration: { type: String, required: true },
  author: {
    name: { type: String, required: true },
    position: { type: String, required: true }
  },
  lastUpdate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  content: { type: String, required: true },
  description : { type : String,required : true},
  image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' }
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
module.exports = BlogPost;
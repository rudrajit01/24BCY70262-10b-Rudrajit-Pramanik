const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // কে কমেন্ট করল
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }  // কোন পোস্টে কমেন্ট করল
});

module.exports = mongoose.model('Comment', CommentSchema);
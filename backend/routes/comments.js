const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post'); // ১. Post মডেলটি অবশ্যই ইম্পোর্ট করতে হবে
const jwt = require('jsonwebtoken');

// টোকেন ভেরিফাই করার মিডলওয়্যার (নিরাপত্তার জন্য)
const verifyToken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied!');
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

// ১. কমেন্ট করা (Create Comment) - আপডেট করা হয়েছে
router.post('/add', verifyToken, async (req, res) => {
    const { text, postId } = req.body;

    const newComment = new Comment({
        text: text,
        author: req.user.id, // টোকেন থেকে ইউজারের আইডি নেওয়া হচ্ছে
        post: postId
    });

    try {
        // ক) প্রথমে কমেন্টটি সেভ করুন
        const savedComment = await newComment.save();

        // খ) এবার এই কমেন্টের আইডিটি পোস্টের 'comments' অ্যারেতে পুশ করুন (খুবই গুরুত্বপূর্ণ)
        await Post.findByIdAndUpdate(postId, {
            $push: { comments: savedComment._id }
        });

        res.json(savedComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// ২. কমেন্ট দেখা (Get Comments)
router.get('/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId }).populate('author', 'name');
        res.json(comments);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');

// Middleware
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

// ১. নতুন পোস্ট তৈরি (Create)
router.post('/create', verifyToken, async (req, res) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        author: req.user.id,
        comments: [] 
    });
    try {
        const savedPost = await post.save();
        // সেভ করার পর পপুলেট করে ডাটা পাঠানো যাতে ফ্রন্টএন্ডে সাথে সাথে নাম দেখায়
        const populatedPost = await Post.findById(savedPost._id).populate('author', 'name');
        res.json(populatedPost);
    } catch (err) {
        res.status(500).send(err);
    }
});

// ২. সব পোস্ট দেখা (Read) - নতুন পোস্ট সবার আগে দেখাবে
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ date: -1 }) // এটি নতুন পোস্টগুলোকে উপরে (ফেসবুকের মতো) নিয়ে আসবে
            .populate('author', 'name')
            .populate({
                path: 'comments', 
                options: { strictPopulate: false }, 
                populate: { 
                    path: 'author', 
                    select: 'name',
                    options: { strictPopulate: false } 
                }
            });
        res.json(posts);
    } catch (err) {
        console.error("Fetch error:", err);
        res.status(500).send(err);
    }
});

module.exports = router;
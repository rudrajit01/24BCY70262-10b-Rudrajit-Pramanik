import React, { useState } from 'react';
import axios from 'axios';

function SinglePost({ post }) { // পোস্টটি প্রপস হিসেবে আসছে
  const [commentText, setCommentText] = useState('');

  // এই ফাংশনটি এখানে থাকবে
  const handleComment = async (postId) => {
    try {
      await axios.post('http://localhost:5000/api/comments/add', {
        text: commentText,
        postId: postId,
        userId: 'USER_ID_HERE' // লগইন করা ইউজারের আইডি (Auth থেকে নিতে হবে)
      });
      alert("Comment added!");
      setCommentText(''); // ইনপুট বক্স খালি করে দেওয়া
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>

      {/* কমেন্ট বক্স */}
      <div className="comment-section">
        <input 
          type="text" 
          value={commentText} 
          onChange={(e) => setCommentText(e.target.value)} 
          placeholder="Write a comment..." 
        />
        <button onClick={() => handleComment(post._id)}>Post Comment</button>
      </div>
    </div>
  );
}
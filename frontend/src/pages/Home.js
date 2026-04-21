import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({}); 

  // পোস্ট ডাটা ফেচ করা
  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // কমেন্ট হ্যান্ডলার
  const handleComment = async (postId) => {
    const token = localStorage.getItem('token');
    if (!commentText[postId]) return alert("Comment cannot be empty!");

    try {
      await axios.post('http://localhost:5000/api/comments/add', 
        { text: commentText[postId], postId: postId },
        { headers: { 'auth-token': token } }
      );
      setCommentText({ ...commentText, [postId]: '' }); 
      fetchPosts(); // কমেন্ট করার পর নতুন ডাটা রিফ্রেশ করা (যাতে কমেন্টটি সাথে সাথে দেখা যায়)
    } catch (err) {
      alert("Failed to send comment.");
    }
  };

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', margin: '30px 0' }}>Explore Stories</h1>
      <div className="posts-grid">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="post-card" style={{ marginBottom: '30px' }}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <div style={{ marginTop: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <small>By <b>{post.author?.name || "Anonymous"}</b></small>
              </div>

              {/* --- কমেন্টগুলো দেখানোর সেকশন --- */}
              <div className="comments-list" style={{ marginTop: '15px', paddingLeft: '10px' }}>
                <h4 style={{ fontSize: '14px', color: '#555' }}>Comments:</h4>
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment, index) => (
                    <div key={index} style={{ background: '#f0f2f5', padding: '8px', borderRadius: '8px', margin: '5px 0' }}>
                      <p style={{ margin: 0, fontSize: '13px' }}>
                        <strong>{comment.author?.name || 'User'}: </strong> {comment.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '12px', color: '#999' }}>No comments yet.</p>
                )}
              </div>

              {/* --- কমেন্ট ইনপুট সেকশন --- */}
              {localStorage.getItem('token') && (
                <div style={{ marginTop: '15px', display: 'flex', gap: '5px' }}>
                  <input 
                    type="text" 
                    placeholder="Write a comment..." 
                    style={{ flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
                    value={commentText[post._id] || ''}
                    onChange={(e) => setCommentText({...commentText, [post._id]: e.target.value})}
                  />
                  <button 
                    onClick={() => handleComment(post._id)}
                    style={{ padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>No posts available yet.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
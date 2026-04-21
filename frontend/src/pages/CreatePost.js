import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  // পেজ লোড হওয়ার সময় চেক করবে ইউজার লগইন করা কি না
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login first!");
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post('http://localhost:5000/api/posts/create', 
        { title, content }, 
        { headers: { 'auth-token': token } } 
      );
      alert("Post Published Successfully!");
      navigate('/'); 
    } catch (err) {
      console.error(err);
      alert("Failed to create post. Please try again.");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} style={{ marginTop: '50px' }}>
        <h2 style={{ textAlign: 'center', color: '#007bff' }}>Write a New Story</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label>Blog Title</label>
          <input 
            type="text" 
            placeholder="Enter a catchy title..." 
            value={title} // স্টেট থেকে ভ্যালু আসছে
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
          
          <label>Content</label>
          <textarea 
            placeholder="Share your thoughts here..." 
            rows="10" 
            value={content} // স্টেট থেকে ভ্যালু আসছে
            onChange={(e) => setContent(e.target.value)} 
            required 
            style={{ resize: 'vertical' }}
          />
          
          <button type="submit" style={{ fontSize: '16px', padding: '15px' }}>
            Publish Now
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
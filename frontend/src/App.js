import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import './App.css';

function App() {
  // ১. টোকেন আছে কি না তা চেক করার জন্য একটি ফাংশন
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container" style={{ padding: '20px' }}>
          <Routes>
            {/* ২. প্রোটেক্টেড রুট: লগইন না থাকলে হোম পেজ দেখা যাবে না */}
            <Route 
              path="/" 
              element={isAuthenticated() ? <Home /> : <Navigate to="/login" />} 
            />
            
            {/* ৩. প্রোটেক্টেড রুট: লগইন না থাকলে পোস্ট ক্রিয়েট পেজে যাওয়া যাবে না */}
            <Route 
              path="/create" 
              element={isAuthenticated() ? <CreatePost /> : <Navigate to="/login" />} 
            />

            {/* ৪. পাবলিক রুট: এগুলো যে কেউ দেখতে পারবে */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* ভুল কোনো ইউআরএল দিলে হোমে পাঠিয়ে দিবে */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
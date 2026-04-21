import React from 'react'; // React ইম্পোর্ট করা ভালো প্র্যাকটিস
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); 

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login');
    window.location.reload(); // টোকেন মুছার পর স্টেট আপডেট করতে পেজ রিফ্রেশ
  };

  return (
    <nav>
      <div className="logo">
        <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff', textDecoration: 'none' }}>
          Expo.rudro
        </Link>
      </div>
      <div className="links">
        <Link to="/">Home</Link>
        {token ? (
          <>
            <Link to="/create">Write Blog</Link>
            <button 
              onClick={handleLogout} 
              style={{ marginLeft: '15px', cursor: 'pointer', background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
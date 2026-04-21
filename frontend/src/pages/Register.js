import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // আপনার ব্যাকএন্ডের ইউআরএল এখানে দিন
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert("Registration Successful! Now Login.");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input type="text" placeholder="Name" onChange={(e) => setFormData({...formData, name: e.target.value})} />
      <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
      <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
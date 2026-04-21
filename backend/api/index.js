const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'ব্যাকএন্ড থেকে হ্যালো' });
});

app.post('/api/auth/login', (req, res) => {
  // লগইন লজিক
});

module.exports = app;   // ভেরসেলের জন্য export করুন (app.listen নয়)
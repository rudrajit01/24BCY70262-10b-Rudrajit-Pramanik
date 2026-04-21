const express = require('express');
const app = express();

// your routes
app.get('/api/hello', (req, res) => res.json({ message: 'Hello' }));

// export for Vercel
module.exports = app;

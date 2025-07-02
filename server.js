require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Virtual Try-On running on http://localhost:${PORT}`);
});
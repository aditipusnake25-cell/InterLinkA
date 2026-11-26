require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDatabase = require('./config/db');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/community', require('./routes/communityRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

app.use((req, res) => res.status(404).json({ message: 'API route not found.' }));
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ message: 'Request body contains invalid JSON.' });
  }
  if (error.name === 'MulterError') {
    return res.status(400).json({ message: error.code === 'LIMIT_FILE_SIZE' ? 'Files must be 20 MB or smaller.' : error.message });
  }
  if (error.message && (error.message.startsWith('Choose a JPG') || error.message.startsWith('Profile photos'))) {
    return res.status(400).json({ message: error.message });
  }
  if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
  if (error.name === 'CastError') return res.status(400).json({ message: 'A provided ID is not valid.' });
  if (error.code === 11000) return res.status(409).json({ message: 'That username or email is already in use.' });
  console.error(error);
  return res.status(500).json({ message: 'Something went wrong on the server.' });
});

const port = Number(process.env.PORT) || 5000;
connectDatabase()
  .then(() => app.listen(port, () => console.log(`Interlinka API listening on http://localhost:${port}`)))
  .catch(error => {
    console.error(`Could not connect to MongoDB: ${error.message}`);
    process.exit(1);
  });

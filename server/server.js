const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet'); 
const path = require('path');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const authRoutes = require('./routes/auth'); 

const app = express();
const PORT = process.env.PORT || 5000;

/* app.use(helmet());
app.use(cors());

app.use(bodyParser.json()); */

// Middleware for the Express server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(helmet());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// API routes
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes); 

// Serve the React app in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
  }

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

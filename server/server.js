const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import middleware CORS
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();

// Sử dụng CORS middleware
app.use(cors());

app.use(bodyParser.json());
app.use('/api', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

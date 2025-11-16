const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './.env.backend' });
const authRoutes = require('./routes/authRoutes.js');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/hello', authRoutes);

const PORT = process.env.BACKEND_PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

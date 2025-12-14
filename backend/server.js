const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './.env.backend' });
const authRoutes = require('./routes/authRoutes.js');
const todoRoutes = require('./routes/todoRoutes.js');
const stateRoutes = require('./routes/stateRoutes.js');
const errorHandler = require('./middleware/errorHandler.js');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/states', stateRoutes);

const PORT = process.env.BACKEND_PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use(errorHandler);

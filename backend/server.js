const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './.env.backend' });
const authRoutes = require('./routes/authRoutes.js');
const todoRoutes = require('./routes/todoRoutes.js');
const stateRoutes = require('./routes/stateRoutes.js');
const errorHandler = require('./middleware/errorHandler.js');

const app = express();
app.set('trust proxy',true);
app.use(cors());
app.use(express.json());

//Rotte verso i routers
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/states', stateRoutes);

//Porta di ascolto
const PORT = process.env.BACKEND_PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//Utilizzo middleware gestione errori
app.use(errorHandler);

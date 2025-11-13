//Server config page

import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/hello', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

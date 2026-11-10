import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

import plantRoutes from './routes/plantRoutes.js';
import userRoutes from './routes/userRoutes.js';
import genRoutes from './routes/genRoutes.js';
import markerRoutes from './routes/markerRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Servir imagens enviadas localmente
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/plants', plantRoutes);
app.use('/users', userRoutes);
app.use('/gen', genRoutes);
app.use('/markers', markerRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`rodando no ${PORT} :D`);
});

import express from 'express'
import cors from 'cors'

import dotenv from 'dotenv';
dotenv.config();

import plantRoutes from './routes/plantRoutes.js';
import userRoutes from './routes/userRoutes.js';
import genRoutes from './routes/genRoutes.js';
import markerRoutes from './routes/markerRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());


app.use('/plants', plantRoutes);
app.use('/users', userRoutes);
app.use('/gen', genRoutes);
app.use('/markers', markerRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`rodando no ${PORT} :D`);
})





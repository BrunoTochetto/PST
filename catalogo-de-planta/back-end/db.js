import pkg from 'pg';
import 'dotenv/config';

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DATABASE || 'catalogo_plantas',
  password: process.env.DB_PASSWORD || '1234',
  port: Number(process.env.DB_PORT) || 5432,
});

console.log("Banco conectado usando host:", process.env.DB_HOST || "localhost");

export default {
  query: (text, params) => pool.query(text, params),
};
require('dotenv').config();
const { Pool } = require('pg');

// Na nuvem (Render) o banco exige SSL; localmente não
const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

module.exports = { pool };

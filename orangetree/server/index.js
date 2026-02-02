// server/index.js
import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const app = express();

app.use(cors());           
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  max: 20,   // connection pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection on startup
pool.connect((err) => {
  if (err) {
    console.error('Failed to connect to PostgreSQL', err);
    process.exit(1);
  } else {
    console.log('Connected to PostgreSQL!');
  }
});

// Get all customers API endpoint
app.get('/api/customers', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, first_name, last_name, email, phone FROM customer ORDER BY id ASC');

        res.json(result.rows); 
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({
            error:  'Internal Server Error',
            message: error.message
        });
    }
});

// Add-customer API endpoint
app.post('/api/customers', async (req, res) => {
  const { firstName, lastName, email, phone } = req.body;

  if (!firstName || !lastName || !email) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'First name, last name, and email are required.'
    });
  }

  try {
    const result = await pool.query(`
        INSERT INTO customer (first_name, last_name, email, phone)
        VALUES ($1, $2, $3, $4)
        RETURNING id, first_name, last_name, email, phone
      `, [firstName.trim(), lastName.trim(), email.trim(), phone?.trim() || null]);

      res.status(201).json({
        success: true,
        message: 'Customer added.'
      });

  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

/*

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = '${process.env.DATABASE_URL}';

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// Get all customers API endpoint
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { id: 'asc' }
    });
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      error: 'Failed to fetch customers',
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

*/
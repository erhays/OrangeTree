// server/index.js
import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import bcrypt from 'bcrypt';

dotenv.config();

const { Pool } = pkg;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());           
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT || 5432,
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

// Session store + middleware
const PgSession = connectPgSimple(session);
app.use(session({
    store: new PgSession({ pool, createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET || 'change-me-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
}));

const requireAuth = (req, res, next) => {
    if (req.session?.userId) return next();
    res.status(401).json({ error: 'Unauthorized' });
};

// Auth routes
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    try {
        const result = await pool.query('SELECT id, email, password_hash FROM users WHERE email = $1', [email.trim()]);
        if (result.rowCount === 0) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        req.session.userId = user.id;
        req.session.email = user.email;
        res.json({ success: true, email: user.email });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/me', (req, res) => {
    if (!req.session?.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json({ id: req.session.userId, email: req.session.email });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
});

// Get all customers API endpoint
app.get('/api/customers', requireAuth, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, first_name, last_name, email, phone, created_at FROM customer ORDER BY id ASC');

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
app.post('/api/customers', requireAuth, async (req, res) => {
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

// Get single customer API endpoint
app.get('/api/customers/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT id, first_name, last_name, email, phone FROM customer WHERE id = $1',
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Not Found', message: 'Customer not found.' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

// Update customer API endpoint
app.put('/api/customers/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, phone } = req.body;
    if (!firstName || !lastName || !email) {
        return res.status(400).json({ error: 'Bad Request', message: 'First name, last name, and email are required.' });
    }
    try {
        const result = await pool.query(
            `UPDATE customer SET first_name = $1, last_name = $2, email = $3, phone = $4
             WHERE id = $5 RETURNING id, first_name, last_name, email, phone`,
            [firstName.trim(), lastName.trim(), email.trim(), phone?.trim() || null, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Not Found', message: 'Customer not found.' });
        }
        res.json({ success: true, customer: result.rows[0] });
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

// Delete customer API endpoint
app.delete('/api/customers/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM customer WHERE id = $1 RETURNING id', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Not Found', message: 'Customer not found.' });
        }
        res.json({ success: true, message: 'Customer deleted.' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

// Get appointments for a specific customer
app.get('/api/customers/:id/appointments', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT id, date_time, service_type, status, notes
             FROM appointment
             WHERE customer_id = $1
             ORDER BY date_time DESC`,
            [id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching customer appointments:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

// Get all appointments API endpoint
app.get('/api/appointments', requireAuth, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT a.id, a.date_time, a.service_type, a.status, a.notes, a.created_at,
                   c.id AS customer_id, c.first_name, c.last_name
            FROM appointment a
            JOIN customer c ON c.id = a.customer_id
            ORDER BY a.date_time DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

// Get single appointment API endpoint
app.get('/api/appointments/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT a.id, a.date_time, a.service_type, a.status, a.notes, a.created_at,
                    c.id AS customer_id, c.first_name, c.last_name, c.email, c.phone
             FROM appointment a
             JOIN customer c ON c.id = a.customer_id
             WHERE a.id = $1`,
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Not Found', message: 'Appointment not found.' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

// Create appointment API endpoint
app.post('/api/appointments', requireAuth, async (req, res) => {
    const { customerId, dateTime, serviceType, status, notes } = req.body;
    if (!customerId || !dateTime || !serviceType || !status) {
        return res.status(400).json({ error: 'Bad Request', message: 'Customer, date/time, service type, and status are required.' });
    }
    try {
        const result = await pool.query(
            `INSERT INTO appointment (customer_id, date_time, service_type, status, notes)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id`,
            [customerId, dateTime, serviceType, status, notes?.trim() || null]
        );
        res.status(201).json({ success: true, id: result.rows[0].id });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

// Update appointment API endpoint
app.put('/api/appointments/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const { customerId, dateTime, serviceType, status, notes } = req.body;
    if (!customerId || !dateTime || !serviceType || !status) {
        return res.status(400).json({ error: 'Bad Request', message: 'Customer, date/time, service type, and status are required.' });
    }
    try {
        const result = await pool.query(
            `UPDATE appointment SET customer_id=$1, date_time=$2, service_type=$3, status=$4, notes=$5 WHERE id=$6 RETURNING id`,
            [customerId, dateTime, serviceType, status, notes?.trim() || null, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Not Found', message: 'Appointment not found.' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

// Delete appointment API endpoint
app.delete('/api/appointments/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM appointment WHERE id = $1 RETURNING id', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Not Found', message: 'Appointment not found.' });
        }
        res.json({ success: true, message: 'Appointment deleted.' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

// Submit contact inquiry (public)
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Bad Request', message: 'Name, email, and message are required.' });
    }
    try {
        await pool.query(
            'INSERT INTO contact_inquiry (name, email, message) VALUES ($1, $2, $3)',
            [name.trim(), email.trim(), message.trim()]
        );
        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Error saving contact inquiry:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

// Public booking endpoint — creates customer if needed, then creates appointment
app.post('/api/bookings', async (req, res) => {
    const { firstName, lastName, email, phone, serviceType, dateTime, notes } = req.body;
    if (!firstName || !lastName || !email || !serviceType || !dateTime) {
        return res.status(400).json({ error: 'Bad Request', message: 'First name, last name, email, service type, and date/time are required.' });
    }
    try {
        // Find or create customer by email
        let customerResult = await pool.query('SELECT id FROM customer WHERE email = $1', [email.trim()]);
        let customerId;
        if (customerResult.rowCount > 0) {
            customerId = customerResult.rows[0].id;
        } else {
            const insertResult = await pool.query(
                'INSERT INTO customer (first_name, last_name, email, phone) VALUES ($1, $2, $3, $4) RETURNING id',
                [firstName.trim(), lastName.trim(), email.trim(), phone?.trim() || null]
            );
            customerId = insertResult.rows[0].id;
        }
        // Create appointment
        const apptResult = await pool.query(
            'INSERT INTO appointment (customer_id, date_time, service_type, status, notes) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [customerId, dateTime, serviceType, 'Scheduled', notes?.trim() || null]
        );
        res.status(201).json({ success: true, id: apptResult.rows[0].id });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

// Serve built React app in production (Docker)
const publicPath = join(__dirname, 'public');
if (existsSync(publicPath)) {
    app.use(express.static(publicPath));
    app.get(/^(?!\/api).*/, (req, res) => {
        res.sendFile(join(publicPath, 'index.html'));
    });
}

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
# OrangeTree Detailing

A customer and appointment management system for a car detailing business. Features a public-facing home page and an admin dashboard for managing customers and appointments.

## Tech Stack

**Frontend:** React 19, React Router 7, Vite 7, Tailwind CSS 4, Bootstrap 5
**Backend:** Node.js, Express 5, PostgreSQL, Prisma

## Project Structure

```
orangetree/
├── client/              # React frontend
│   ├── components/      # React components (Dashboard, CustomerList, etc.)
│   ├── App.jsx          # Main routing
│   └── main.jsx         # Entry point
├── server/              # Express backend
│   ├── index.js         # API server & routes
│   └── prisma/          # Database schema & migrations
├── vite.config.js       # Vite config with API proxy
└── package.json         # Root scripts
```

## Prerequisites

- Node.js and npm
- PostgreSQL running locally on port 5432
- A database named `orangetree`

## Setup

```bash
# Install client dependencies
cd orangetree
npm install

# Install server dependencies
cd server
npm install
```

Configure the database connection in `orangetree/server/.env`.

## Running

```bash
# Full stack (client + server)
npm run dev

# Frontend only (http://localhost:5173)
npm run dev:client

# Backend only (http://localhost:5000)
npm run dev:server
```

## Building

```bash
npm run build
```

## API Endpoints

| Method | Endpoint          | Description             |
| ------ | ----------------- | ----------------------- |
| GET    | /api/customers    | Fetch all customers     |
| POST   | /api/customers    | Create a new customer   |

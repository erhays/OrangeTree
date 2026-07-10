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

| Method | Endpoint              | Description                    |
| ------ | ---------------------- | --------------------------------- |
| POST   | /api/login               | Log in                          |
| GET    | /api/customers            | Fetch all customers             |
| POST   | /api/customers            | Create a new customer           |
| PUT    | /api/customers/:id         | Update a customer                |
| DELETE | /api/customers/:id         | Delete a customer                |
| GET    | /api/appointments          | Fetch all appointments          |
| POST   | /api/appointments          | Create a new appointment        |
| PUT    | /api/appointments/:id       | Update an appointment           |
| DELETE | /api/appointments/:id       | Delete an appointment           |
| POST   | /api/bookings              | Submit a new booking (public)   |
| POST   | /api/contact               | Submit the contact form (public) |

*The full API includes additional routes for user management, dashboard insights, site content, and settings — see `server/index.js` for the complete list.*

## Screenshots

A few key views of the app — the public booking site and the admin dashboard.

### Home Page

The public-facing landing page customers see when they visit the site to book a detailing appointment.

![Home Page](./screenshots/Desktop%20-%20Home%20Page.png)

### Dashboard — Customers

Admin view for browsing, searching, and managing the customer database.

![Dashboard Customers](./screenshots/Desktop%20-%20Dashboard%20-%20Customers.png)

### Dashboard — Appointments

Scheduling view for tracking upcoming, in-progress, and completed appointments.

![Dashboard Appointments](./screenshots/Desktop%20-%20Dashboard%20-%20Appointments.png)

### Dashboard — Edit Appointment

Edit view for updating an appointment's service, date, time, and status.

![Dashboard Edit Appointment](./screenshots/Desktop%20-%20Dashboard%20-%20Edit%20Appointment.png)

### Dashboard — Insights

Analytics view summarizing business performance and appointment metrics.

![Dashboard Insights](./screenshots/Desktop%20-%20Dashboard%20-%20Insights.png)

### Dashboard — Settings

Admin settings panel for configuring site content and business details.

![Dashboard Settings](./screenshots/Desktop%20-%20Dashboard%20-%20Settings.png)

## Mobile Responsive

The app is fully responsive — the same public site and admin dashboard adapt cleanly to mobile screens.

<table>
  <tr>
    <td align="center"><img src="./screenshots/Mobile%20-%20Home%20Page.PNG" width="160"><br><sub>Home Page</sub></td>
    <td align="center"><img src="./screenshots/Mobile%20-%20Dashboard%20-%20Customers.PNG" width="160"><br><sub>Customers</sub></td>
    <td align="center"><img src="./screenshots/Mobile%20-%20Dashboard%20-%20Appointments.PNG" width="160"><br><sub>Appointments</sub></td>
    <td align="center"><img src="./screenshots/Mobile%20-%20Dashboard%20-%20Insights.PNG" width="160"><br><sub>Insights</sub></td>
    <td align="center"><img src="./screenshots/Mobile%20-%20Dashboard%20-%20Settings.PNG" width="160"><br><sub>Settings</sub></td>
  </tr>
</table>

# Finance Tracker

A full stack personal finance management app for tracking income and expenses in real time.

## Features

- JWT-based authentication (register, login, protected routes)
- Add, edit, and delete transactions
- Real-time summary cards for total income, expenses, and net balance
- Transactions organized by category and date
- Responsive UI that works on desktop and mobile

## Tech Stack

**Frontend:** React, TypeScript, CSS, Axios, React Router

**Backend:** Node.js, Express, TypeScript

**Database:** MongoDB, Mongoose

**Auth:** JWT, bcrypt

## Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account (or local MongoDB)

### Backend

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend

```bash
cd client
npm install
npm run dev
```

App runs on `http://localhost:5173`

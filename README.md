# MERN Blog App

A full-stack blog app with React, Tailwind CSS, Express, MongoDB, JWT auth, image uploads, comments, likes, and admin controls.

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Copy the environment files:

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

3. Put your MongoDB Atlas connection string in `server/.env`:

```env
MONGO_URI=mongodb+srv://...
```

4. Run the app:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Demo Data

After MongoDB is connected, seed demo users and posts:

```bash
npm run seed
```

Demo accounts:

- Admin: `admin@inkspire.dev` / `Password123!`
- Author: `author@inkspire.dev` / `Password123!`
- User: `reader@inkspire.dev` / `Password123!`

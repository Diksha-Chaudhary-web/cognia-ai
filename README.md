# Perplexity Clone

A full-stack AI chat app with a React frontend and an Express backend.

## Project Structure

```txt
perplexity/
├── Frontend/   # React + Vite + Redux
└── Backend/    # Express + MongoDB + LangChain
```

## Features

- User registration and login
- Cookie-based authentication
- Chat history stored in MongoDB
- AI-generated replies
- Optional internet-backed responses using Tavily
- Optional email verification using Gmail OAuth

## Tech Stack

### Frontend

- React
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios
- Socket.IO client

### Backend

- Express
- MongoDB + Mongoose
- JWT
- LangChain
- Gemini or Mistral
- Tavily
- Nodemailer
- Socket.IO

## Local Setup

### 1. Install dependencies

Backend:

```bash
cd Backend
npm install
```

Frontend:

```bash
cd Frontend
npm install
```

### 2. Create environment files

Create `Backend/.env`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000

GEMINI_API_KEY=
MISTRAL_API_KEY=
TAVILY_API_KEY=

GOOGLE_USER=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
```

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

## Run Locally

Start the backend in one terminal:

```bash
cd Backend
npm run dev
```

Start the frontend in a second terminal:

```bash
cd Frontend
npm run dev
```

Open:

```txt
http://localhost:5173
```

## How To Test

1. Register a new user
2. Log in
3. Send a chat message
4. Refresh the page and confirm chats still exist
5. Check backend health at `http://localhost:3000/api/health`


## Deployment

The simplest deployment setup for the current codebase is:

- Deploy `Frontend` as one Vercel project
- Deploy `Backend` as a separate Vercel project

Frontend env on Vercel:

```env
VITE_API_URL=https://your-backend-domain.vercel.app
VITE_SOCKET_URL=https://your-backend-domain.vercel.app
```

Backend env on Vercel:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret
FRONTEND_URL=https://your-frontend-domain.vercel.app
BACKEND_URL=https://your-backend-domain.vercel.app
GEMINI_API_KEY=
MISTRAL_API_KEY=
TAVILY_API_KEY=
GOOGLE_USER=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
```



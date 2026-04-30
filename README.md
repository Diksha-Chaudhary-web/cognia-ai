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

## Notes

- If the Google mail env vars are missing, local signup still works and users are auto-verified.
- If both `GEMINI_API_KEY` and `MISTRAL_API_KEY` are missing, the app runs but AI replies will not work.
- `TAVILY_API_KEY` is needed for internet-backed or latest-information answers.
- The frontend runs on `http://localhost:5173` and the backend runs on `http://localhost:3000`.

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

## Important Vercel Caveat

This project includes `socket.io`, but Vercel Functions do not support acting as a WebSocket server. The app can still work for normal REST-based flows, but real-time socket behavior may not work properly on Vercel.

If you need full socket support in production, consider:

- Render
- Railway
- A VPS

## Security

Do not commit real secrets, API keys, database URIs, or OAuth credentials into the repository. Keep them only in local `.env` files or your deployment provider's environment variable settings.

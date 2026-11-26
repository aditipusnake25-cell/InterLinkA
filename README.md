# Interlinka

Interlinka is a beginner-friendly social community sharing app. The frontend is React and Vite; the REST API is Express, Mongoose, and MongoDB.

## What is included

- Account registration, login, logout, protected pages, and editable profiles.
- Community feed with text, photo, and video posts, likes, comments, and post-owner deletion.
- Photo and video stories that expire after 24 hours.
- User discovery, follow/unfollow, daily experiences, motivational thoughts, and like/comment/follow notifications.
- Responsive landing page and member dashboard.

## Requirements

- Node.js 18 or later and npm.
- MongoDB running locally, or a MongoDB connection string you are authorized to use.

## Configure MongoDB and the API

The backend reads configuration from `backend/.env`. A local development file is included with a local MongoDB URL. If you use MongoDB Atlas or another MongoDB server, replace `MONGODB_URI` with your own connection string. Never share or commit that connection string.

`JWT_SECRET` is a local development signing key. Replace it with a long, random value before using the app beyond local development. `backend/.env` is ignored by Git.

The example configuration is in `backend/.env.example`. The frontend API URL defaults to `http://localhost:5000/api`; to change it, copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL`.

Uploaded images and videos are saved in `backend/uploads` and served by the API. Uploads are limited to 20 MB and JPG, PNG, WebP, MP4, or WebM formats.

## Run locally

Open two terminals in the project folder.

Terminal 1 — backend:

```powershell
cd backend
npm install
npm run dev
```

Terminal 2 — frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open the frontend URL printed by Vite (normally `http://localhost:5173`). The backend health endpoint is `http://localhost:5000/api/health`.

## Beginner-friendly API map

- `/api/auth` — register, log in, and retrieve the signed-in user.
- `/api/users` — discover users, view profiles, edit your profile, and follow/unfollow.
- `/api/posts` — feed, create/delete posts, likes, and comments.
- `/api/community` — stories, daily experiences, and motivational thoughts.
- `/api/notifications` — view notifications and mark them as read.

All community content and accounts are stored in MongoDB. Authentication uses a JWT in the browser's local storage; logging out removes it. This is a practical learning project, not a production-hardened social network.

# Frontend

This is the separated frontend package for the Plivo scheduler follow-up app.

## What It Does

This frontend is now a real API-driven React app.

It handles:

- scheduler login
- forgot password
- reset password
- dashboard metrics
- manual follow-up creation
- bulk upload
- call-now / complete / delete actions

The backend remains responsible for:

- auth cookies
- scheduler APIs
- Plivo calling and streaming
- STT/TTS integrations
- WhatsApp automation

## Configure

Create a `.env` file:

```bash
VITE_BACKEND_ORIGIN=https://your-backend-domain.example
```

If omitted, the frontend uses the current origin.

## Backend Requirements

If frontend and backend are deployed on different origins, the backend must be
configured with:

```bash
FRONTEND_ORIGIN=https://your-frontend-domain.example
AUTH_COOKIE_SAMESITE=None
AUTH_COOKIE_SECURE=true
```

Without those settings, browser login cookies will not work reliably across the
two services.

## Run

```bash
npm install
npm run dev
```

## Routes

- `/`
- `/login`
- `/dashboard`
- `/forgot-password`
- `/reset-password`

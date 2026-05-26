# HopIn — Carpooling Platform (MERN)

A scalable MERN-based carpooling app with JWT auth, Google Maps polyline-based ride matching, bookings, and Socket.IO for real-time chat/status updates.

## Project Structure

```
hopin/
├── backend/    # Node + Express + MongoDB API
└── frontend/   # React + Vite + Tailwind UI
```

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env       # then fill in MONGO_URI, JWT_SECRET, GOOGLE_MAPS_API_KEY
npm install
npm run dev                # starts on :3000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env       # set VITE_GOOGLE_MAPS_API_KEY
npm install
npm run dev                # starts on :5173
```

Open http://localhost:5173 — register, create a ride as a driver, search and book as a rider.

## Backend API Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/users/register` | – | Sign up |
| POST | `/api/users/login` | – | Sign in |
| GET  | `/api/users/:id` | ✓ | Get profile |
| PUT  | `/api/users/:id` | ✓ | Update profile |
| GET  | `/api/rides` | – | List active rides |
| POST | `/api/rides` | ✓ | Create ride |
| POST | `/api/rides/match` | ✓ | Match rides by route proximity |
| GET  | `/api/rides/user/:userId` | ✓ | Rides by a driver |
| GET  | `/api/rides/:id` | – | Ride details |
| DELETE | `/api/rides/:rideId` | ✓ | Delete own ride |
| POST | `/api/bookings` | ✓ | Request a booking |
| GET  | `/api/bookings/mine` | ✓ | My bookings (as rider) |
| GET  | `/api/bookings/driver` | ✓ | Bookings on my rides (as driver) |
| PUT  | `/api/bookings/:id/status` | ✓ | Driver: accept/reject/complete |
| PUT  | `/api/bookings/:id/cancel` | ✓ | Rider: cancel |

## Ride Matching

The `/rides/match` endpoint uses the algorithm from your report:

1. Geocode rider's origin + destination place IDs.
2. For every active ride, call Directions API to get its polyline.
3. Decode polyline and check if any point lies within 3 km (Haversine) of both rider's origin and destination.
4. Return matched rides.

You can tune `PROXIMITY_KM` in `backend/controllers/ride.controller.js`.

## Real-time (Socket.IO)

The backend exposes Socket.IO on the same port with events:

- `join-ride` — `socket.emit('join-ride', rideId)` to join a ride room
- `chat-message` — `{ rideId, from, text }`
- `ride-status` — `{ rideId, status }`

Hook these up in a `Chat` component on the frontend when you're ready.

## Deployment Notes

- Backend → Render / Railway (set env vars, expose port 3000).
- Frontend → Vercel / Netlify (set `VITE_*` env vars in dashboard).
- Database → MongoDB Atlas (whitelist Render's egress IPs or `0.0.0.0/0` for dev).

## Future Work (per your report)

- Payment gateway (Razorpay / Stripe)
- Reviews + ratings system (Review model is already scaffolded)
- Admin dashboard with analytics
- Mobile app (React Native / Flutter)
- ML-driven recurring-ride suggestions

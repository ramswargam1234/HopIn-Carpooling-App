# HopIn

### A Scalable MERN-Based Carpooling Platform for Smart Urban Mobility

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-success?style=flat-square)](https://www.mongodb.com/mern-stack)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-real--time-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

## Overview

HopIn is a full-stack carpooling web application designed to address urban transportation challenges including traffic congestion, single-occupancy vehicle inefficiency, and environmental pollution. By connecting drivers and riders along similar routes, the platform promotes shared mobility, reduces commute costs, and lowers carbon emissions.

Developed as a major project for the Bachelor of Engineering in Computer Science and Engineering at University College of Engineering, Osmania University.

## Features

- **Secure Authentication** — JWT-based login with bcrypt password hashing
- **Smart Ride Matching** — Polyline-based proximity matching using the Google Maps Directions API
- **Place Autocomplete** — Google Places integration for accurate origin and destination input
- **Ride Booking Workflow** — Request, driver approval, and atomic seat updates
- **Role-Based Dashboards** — Separate interfaces for riders and drivers
- **Real-Time Communication** — Socket.IO for chat and live ride status updates
- **Responsive Interface** — Mobile-first design built with Tailwind CSS
- **Sustainability Focus** — Reduces vehicle count and per-commute carbon emissions

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Authentication | JSON Web Tokens (JWT), bcrypt |
| Real-time | Socket.IO |
| Maps and Geolocation | Google Maps Platform (Places, Directions, Geocoding) |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

## Architecture

```
+--------------+       HTTP / REST       +--------------+
|              | ----------------------> |              |
|   React UI   |                         |  Express API |
|  (Frontend)  | <---------------------- |  (Node.js)   |
|              |         JSON            |              |
+------+-------+                         +------+-------+
       |                                        |
       | WebSocket                              | Mongoose ODM
       |                                        |
       +-----> Socket.IO <----------+           v
                                    |    +--------------+
                                    +----|   MongoDB    |
                                         |   (Atlas)    |
                                         +--------------+
                  ^
                  | Geocoding / Directions / Places
                  |
            +-----+------+
            | Google Maps|
            |  Platform  |
            +------------+
```

## Project Structure

```
hopin/
├── backend/
│   ├── config/           Database connection
│   ├── controllers/      Route handler logic
│   ├── middleware/       JWT authentication and role guards
│   ├── models/           Mongoose schemas
│   ├── routes/           Express routes
│   └── server.js         Application entry point (Express + Socket.IO)
├── frontend/
│   ├── src/
│   │   ├── components/   Navbar, ProtectedRoute, PlaceAutocomplete
│   │   ├── context/      Authentication context
│   │   ├── pages/        Home, Login, Register, CreateRide, FindRide, Profile
│   │   ├── services/     Axios API client
│   │   └── App.jsx       Routing configuration
│   └── index.html
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- MongoDB (local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account)
- Google Maps API key with the Places, Directions, and Geocoding APIs enabled

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/<your-username>/hopin.git
cd hopin
```

**2. Configure and run the backend**

```bash
cd backend
cp .env.example .env
# Edit .env with MONGO_URI, JWT_SECRET, and GOOGLE_MAPS_API_KEY
npm install
npm run dev
```

The backend runs at `http://localhost:3000`.

**3. Configure and run the frontend** (in a new terminal)

```bash
cd frontend
cp .env.example .env
# Edit .env with VITE_GOOGLE_MAPS_API_KEY
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

### Usage

1. Register two accounts, one with the `driver` role and one with the `rider` role
2. Sign in as the driver and create a ride
3. Sign in as the rider, search for rides along the same route, and request a booking
4. Return to the driver account to accept or reject the booking request

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| POST | `/api/users/register` | No | Create a new user account |
| POST | `/api/users/login` | No | Authenticate and receive a JWT |
| GET | `/api/users/:id` | Yes | Retrieve a user profile |
| PUT | `/api/users/:id` | Yes | Update a user profile |
| GET | `/api/rides` | No | List all active rides |
| POST | `/api/rides` | Yes | Create a new ride |
| POST | `/api/rides/match` | Yes | Find rides matching an origin and destination |
| GET | `/api/rides/user/:userId` | Yes | Retrieve rides by a specific driver |
| GET | `/api/rides/:id` | No | Retrieve ride details |
| DELETE | `/api/rides/:rideId` | Yes | Delete a ride owned by the current user |
| POST | `/api/bookings` | Yes | Request a booking |
| GET | `/api/bookings/mine` | Yes | List the current user's bookings (as rider) |
| GET | `/api/bookings/driver` | Yes | List bookings on the current user's rides (as driver) |
| PUT | `/api/bookings/:id/status` | Yes | Driver action: accept, reject, or complete a booking |
| PUT | `/api/bookings/:id/cancel` | Yes | Rider action: cancel a booking |

## Ride Matching Algorithm

The matching service identifies rides whose routes pass near both the rider's origin and destination:

1. Geocode the rider's origin and destination `place_id` values into latitude and longitude coordinates
2. For each active ride, call the Google Directions API to retrieve the route polyline
3. Decode the polyline into a sequence of coordinates using the `@mapbox/polyline` library
4. Apply the Haversine formula to check whether any polyline point lies within `3 km` of both the rider's origin and destination
5. Return the matched rides

The proximity threshold (`PROXIMITY_KM`) is configurable in `backend/controllers/ride.controller.js`.

## Real-Time Events

The backend exposes a Socket.IO server on the same port as the REST API.

| Event | Direction | Payload | Purpose |
|-------|-----------|---------|---------|
| `join-ride` | Client to server | `rideId` | Join a ride-specific room |
| `chat-message` | Bidirectional | `{ rideId, from, text }` | In-ride chat messaging |
| `ride-status` | Bidirectional | `{ rideId, status }` | Live ride status updates |

## Deployment

| Component | Platform | Notes |
|-----------|----------|-------|
| Frontend | Vercel or Netlify | Configure `VITE_*` environment variables in the dashboard |
| Backend | Render or Railway | Configure all backend environment variables; expose port 3000 |
| Database | MongoDB Atlas | Whitelist the backend's egress IP addresses |

## Roadmap

- [ ] Payment gateway integration (Razorpay, Stripe)
- [ ] Driver and rider rating and review system
- [ ] Administrative dashboard with analytics
- [ ] Mobile application (React Native)
- [ ] Machine learning-based recurring ride suggestions
- [ ] Push notifications
- [ ] Corporate and group ride plans

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature-name`)
5. Open a pull request

Please ensure your code follows the existing style and includes any necessary documentation updates.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Team

Developed at the Department of Computer Science and Engineering, University College of Engineering, Osmania University.

- Devulapally Keshav Sai Rao (100521733012)
- Kamlekar Sai Siddharth (100521733024)
- Ramchandar Rao Swargam (100521733064)

**Project Guide:** Prof. B. Sujatha, Department of CSE, UCEOU

## Acknowledgments

- Built using the MERN stack and the Google Maps Platform
- Informed by existing ride-sharing platforms including BlaBlaCar, UberPool, and QuickRide
- Sincere thanks to Prof. B. Sujatha and the CSE department at UCEOU for their guidance and support
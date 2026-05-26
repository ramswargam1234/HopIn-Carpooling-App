<div align="center">

# 🚗 HopIn

### A Scalable MERN-Based Carpooling Platform for Smart Urban Mobility

*Share the ride. Save fuel. Build community.*

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-success?style=flat-square)](https://www.mongodb.com/mern-stack)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-real--time-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](#contributing)

</div>

---

## 📖 About

**HopIn** is a full-stack carpooling web application built to address modern urban transportation challenges — traffic congestion, single-occupancy vehicle inefficiency, and environmental pollution. By connecting drivers and riders along similar routes, HopIn promotes shared mobility, reduces commute costs, and lowers carbon emissions.

Built as a major project for the **B.E. in Computer Science and Engineering** at *University College of Engineering, Osmania University*.

## ✨ Features

- 🔐 **Secure Authentication** — JWT-based login with bcrypt password hashing
- 🗺️ **Smart Ride Matching** — Polyline-based proximity matching using Google Maps Directions API
- 📍 **Place Autocomplete** — Google Places integration for accurate origin/destination input
- 🎟️ **Ride Booking Flow** — Request → driver accept/reject → atomic seat updates
- 👤 **Role-Based Dashboards** — Separate views for riders and drivers
- 💬 **Real-Time Communication** — Socket.IO for chat and live ride status
- 📱 **Responsive UI** — Mobile-first design with Tailwind CSS
- 🌱 **Eco-Friendly Mission** — Reduces vehicle count and CO₂ emissions per commute

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), bcrypt |
| **Real-time** | Socket.IO |
| **Maps & Geo** | Google Maps Platform (Places, Directions, Geocoding) |
| **Deployment** | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

## 🏗️ Architecture

```
┌──────────────┐       HTTP/REST        ┌──────────────┐
│              │ ───────────────────►   │              │
│   React UI   │                        │  Express API │
│  (Frontend)  │ ◄─────────────────── │  (Node.js)   │
│              │        JSON            │              │
└──────┬───────┘                        └──────┬───────┘
       │                                       │
       │ WebSocket                             │ Mongoose ODM
       │                                       │
       └──────► Socket.IO ◄────────┐          ▼
                                    │   ┌──────────────┐
                                    └───│   MongoDB    │
                                        │   (Atlas)    │
                                        └──────────────┘
                  ▲
                  │ Geocoding / Directions / Places
                  │
            ┌─────┴──────┐
            │ Google Maps│
            │  Platform  │
            └────────────┘
```

## 📁 Project Structure

```
hopin/
├── backend/
│   ├── config/           # Database connection
│   ├── controllers/      # Route handler logic
│   ├── middleware/       # JWT auth, role guards
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routes
│   └── server.js         # Entry point (Express + Socket.IO)
├── frontend/
│   ├── src/
│   │   ├── components/   # Navbar, ProtectedRoute, PlaceAutocomplete
│   │   ├── context/      # AuthContext
│   │   ├── pages/        # Home, Login, Register, CreateRide, FindRide, Profile
│   │   ├── services/     # Axios API client
│   │   └── App.jsx       # Routing
│   └── index.html
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- MongoDB (local install or [Atlas account](https://www.mongodb.com/cloud/atlas))
- Google Maps API key with **Places**, **Directions**, and **Geocoding** APIs enabled

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/<your-username>/hopin.git
cd hopin
```

**2. Set up the backend**

```bash
cd backend
cp .env.example .env
# Edit .env with your MONGO_URI, JWT_SECRET, and GOOGLE_MAPS_API_KEY
npm install
npm run dev
```

Backend runs at `http://localhost:3000`.

**3. Set up the frontend** (in a new terminal)

```bash
cd frontend
cp .env.example .env
# Edit .env with your VITE_GOOGLE_MAPS_API_KEY
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

**4. Try it out**

1. Register two accounts — one as a `driver`, one as a `rider`
2. Log in as the driver and create a ride
3. Log in as the rider, search for rides along the same route, and book a seat
4. Switch back to the driver to accept the booking

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/api/users/register` | – | Create new user account |
| `POST` | `/api/users/login` | – | Authenticate and receive JWT |
| `GET`  | `/api/users/:id` | ✓ | Get user profile |
| `PUT`  | `/api/users/:id` | ✓ | Update user profile |
| `GET`  | `/api/rides` | – | List all active rides |
| `POST` | `/api/rides` | ✓ | Create a new ride |
| `POST` | `/api/rides/match` | ✓ | Find rides matching origin/destination |
| `GET`  | `/api/rides/user/:userId` | ✓ | Get rides by a specific driver |
| `GET`  | `/api/rides/:id` | – | Get ride details |
| `DELETE` | `/api/rides/:rideId` | ✓ | Delete own ride |
| `POST` | `/api/bookings` | ✓ | Request a booking |
| `GET`  | `/api/bookings/mine` | ✓ | Current rider's bookings |
| `GET`  | `/api/bookings/driver` | ✓ | Bookings on current driver's rides |
| `PUT`  | `/api/bookings/:id/status` | ✓ | Driver: accept / reject / complete |
| `PUT`  | `/api/bookings/:id/cancel` | ✓ | Rider: cancel a booking |

## 🧮 How Ride Matching Works

The matching algorithm finds rides whose route passes near both the rider's origin **and** destination:

1. **Geocode** the rider's `place_id`s into latitude/longitude
2. For each active ride, call the **Directions API** to get its full route polyline
3. **Decode** the polyline into coordinates using `@mapbox/polyline`
4. Use the **Haversine formula** to check if any polyline point lies within `3 km` of both the rider's origin and destination
5. Return matched rides

The proximity threshold (`PROXIMITY_KM`) is configurable in `backend/controllers/ride.controller.js`.

## 📡 Real-Time Events (Socket.IO)

The backend exposes Socket.IO on the same port as the REST API:

| Event | Direction | Payload | Purpose |
|-------|-----------|---------|---------|
| `join-ride` | client → server | `rideId` | Join a ride-specific room |
| `chat-message` | both directions | `{ rideId, from, text }` | In-ride chat |
| `ride-status` | both directions | `{ rideId, status }` | Live ride status updates |

## ☁️ Deployment

| Component | Platform | Notes |
|-----------|----------|-------|
| Frontend  | Vercel / Netlify | Set `VITE_*` env vars in dashboard |
| Backend   | Render / Railway | Set all backend env vars; expose port 3000 |
| Database  | MongoDB Atlas | Whitelist your backend's egress IPs |

## 🛣️ Roadmap

- [ ] Payment gateway integration (Razorpay / Stripe)
- [ ] Driver/rider rating and review system
- [ ] Admin dashboard with analytics
- [ ] Mobile app (React Native)
- [ ] ML-based recurring ride suggestions
- [ ] Push notifications
- [ ] Corporate / group ride plans

## 🤝 Contributing

Contributions are welcome! Here's how to get involved:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure your code follows the existing style and includes relevant updates to the README if you're changing behavior.

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 👥 Team

Developed as a major project at the **Department of Computer Science and Engineering, University College of Engineering, Osmania University**.

- **Devulapally Keshav Sai Rao** (100521733012)
- **Kamlekar Sai Siddharth** (100521733024)
- **Ramchandar Rao Swargam** (100521733064)

**Project Guide:** Prof. B. Sujatha, Dept. of CSE, UCEOU

## 🙏 Acknowledgments

- Built with the MERN stack and Google Maps Platform
- Inspired by ride-sharing platforms like BlaBlaCar, UberPool, and QuickRide
- Special thanks to Prof. B. Sujatha and the CSE department at UCEOU

---

<div align="center">

Made with ❤️ for greener cities

</div>

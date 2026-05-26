const Ride = require('../models/ride.model');
const { Client } = require('@googlemaps/google-maps-services-js');
const polyline = require('@mapbox/polyline');

const client = new Client({});
const PROXIMITY_KM = 3;

// Haversine distance in km
function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

exports.createRide = async (req, res) => {
  try {
    const {
      origin,
      originPlaceId,
      destination,
      destinationPlaceId,
      departureTime,
      availableSeats,
      pricePerSeat,
      vehicle,
    } = req.body;

    if (
      !origin ||
      !originPlaceId ||
      !destination ||
      !destinationPlaceId ||
      !departureTime ||
      !availableSeats ||
      pricePerSeat == null ||
      !vehicle
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const ride = await Ride.create({
      driver: req.user.id,
      origin,
      originPlaceId,
      destination,
      destinationPlaceId,
      departureTime,
      availableSeats,
      pricePerSeat,
      vehicle,
    });
    res.status(201).json(ride);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'active' })
      .populate('driver', 'name email rating vehicle')
      .sort({ departureTime: 1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate(
      'driver',
      'name email rating vehicle phone'
    );
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRidesForUser = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.params.userId }).sort({
      departureTime: -1,
    });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    if (ride.driver.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not your ride' });
    }
    await ride.deleteOne();
    res.json({ message: 'Ride deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Match rides whose route passes near the user's origin AND destination.
 * Body: { origin: { place_id }, destination: { place_id } }
 */
exports.matchRides = async (req, res) => {
  const { origin, destination } = req.body;
  if (!origin?.place_id || !destination?.place_id) {
    return res
      .status(400)
      .json({ error: 'origin.place_id and destination.place_id required' });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Google Maps API key not set' });

  try {
    // Resolve user's lat/lng
    const [originGeo, destGeo] = await Promise.all([
      client.geocode({ params: { place_id: origin.place_id, key: apiKey } }),
      client.geocode({ params: { place_id: destination.place_id, key: apiKey } }),
    ]);
    if (!originGeo.data.results.length || !destGeo.data.results.length) {
      return res.status(400).json({ error: 'Invalid origin or destination' });
    }
    const userO = originGeo.data.results[0].geometry.location;
    const userD = destGeo.data.results[0].geometry.location;

    const rides = await Ride.find({ status: 'active' }).populate(
      'driver',
      'name rating vehicle'
    );

    const matches = [];
    for (const ride of rides) {
      try {
        const dir = await client.directions({
          params: {
            origin: `place_id:${ride.originPlaceId}`,
            destination: `place_id:${ride.destinationPlaceId}`,
            key: apiKey,
          },
        });
        const route = dir.data.routes[0];
        if (!route?.overview_polyline) continue;

        const points = polyline.decode(route.overview_polyline.points);
        const originNear = points.some(
          ([lat, lng]) => distanceKm(lat, lng, userO.lat, userO.lng) < PROXIMITY_KM
        );
        const destNear = points.some(
          ([lat, lng]) => distanceKm(lat, lng, userD.lat, userD.lng) < PROXIMITY_KM
        );

        if (originNear && destNear) matches.push(ride);
      } catch (innerErr) {
        console.error('Skipping ride due to directions error:', innerErr.message);
      }
    }

    res.json(matches);
  } catch (err) {
    console.error('matchRides error:', err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data?.error_message || err.message,
    });
  }
};

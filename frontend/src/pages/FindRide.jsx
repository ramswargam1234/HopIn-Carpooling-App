import { useState } from 'react';
import api from '../services/api.js';
import PlaceAutocomplete from '../components/PlaceAutocomplete.jsx';

export default function FindRide() {
  const [origin, setOrigin] = useState({ description: '', place_id: '' });
  const [destination, setDestination] = useState({ description: '', place_id: '' });
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingFor, setBookingFor] = useState(null);
  const [seats, setSeats] = useState(1);

  const search = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/rides/match', {
        origin: { place_id: origin.place_id },
        destination: { place_id: destination.place_id },
      });
      setRides(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const book = async (rideId) => {
    try {
      await api.post('/bookings', { rideId, seatsBooked: seats });
      alert('Booking requested!');
      setBookingFor(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Booking failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Find a Ride</h2>
      <form onSubmit={search} className="bg-white p-6 rounded shadow space-y-3">
        <PlaceAutocomplete
          value={origin.description}
          onChange={(v) => setOrigin({ ...origin, description: v })}
          onSelect={(p) => setOrigin(p)}
          placeholder="Origin"
        />
        <PlaceAutocomplete
          value={destination.description}
          onChange={(v) => setDestination({ ...destination, description: v })}
          onSelect={(p) => setDestination(p)}
          placeholder="Destination"
        />
        <button
          type="submit"
          disabled={loading || !origin.place_id || !destination.place_id}
          className="w-full bg-hopin text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search Rides'}
        </button>
      </form>

      {error && <div className="bg-red-100 text-red-700 p-2 mt-4 rounded">{error}</div>}

      <div className="mt-6 space-y-3">
        {rides.length === 0 && !loading && (
          <p className="text-gray-500 text-center">No matching rides yet.</p>
        )}
        {rides.map((r) => (
          <div key={r._id} className="bg-white p-4 rounded shadow">
            <p className="font-semibold">
              {r.origin} → {r.destination}
            </p>
            <p className="text-sm text-gray-600">
              {new Date(r.departureTime).toLocaleString()} · {r.availableSeats} seats ·
              ₹{r.pricePerSeat}/seat
            </p>
            <p className="text-sm text-gray-500">
              Driver: {r.driver?.name} · {r.vehicle}
            </p>
            {bookingFor === r._id ? (
              <div className="mt-2 flex gap-2 items-center">
                <input
                  type="number"
                  min="1"
                  max={r.availableSeats}
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  className="border p-1 rounded w-20"
                />
                <button
                  onClick={() => book(r._id)}
                  className="bg-hopin text-white px-3 py-1 rounded"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setBookingFor(null)}
                  className="bg-gray-200 px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setBookingFor(r._id)}
                className="mt-2 bg-hopin text-white px-4 py-1 rounded hover:bg-hopin-dark"
              >
                Book
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

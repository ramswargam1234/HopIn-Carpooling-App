import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import PlaceAutocomplete from '../components/PlaceAutocomplete.jsx';

export default function CreateRide() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    origin: '',
    originPlaceId: '',
    destination: '',
    destinationPlaceId: '',
    departureTime: '',
    availableSeats: 1,
    pricePerSeat: 0,
    vehicle: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/rides', form);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create ride');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Offer a Ride</h2>
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-sm font-medium">Origin</label>
        <PlaceAutocomplete
          value={form.origin}
          onChange={(v) => setForm({ ...form, origin: v })}
          onSelect={({ place_id, description }) =>
            setForm({ ...form, origin: description, originPlaceId: place_id })
          }
          placeholder="Pickup location"
        />

        <label className="block text-sm font-medium">Destination</label>
        <PlaceAutocomplete
          value={form.destination}
          onChange={(v) => setForm({ ...form, destination: v })}
          onSelect={({ place_id, description }) =>
            setForm({ ...form, destination: description, destinationPlaceId: place_id })
          }
          placeholder="Drop location"
        />

        <label className="block text-sm font-medium">Departure</label>
        <input
          type="datetime-local"
          className="w-full border p-2 rounded"
          value={form.departureTime}
          onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">Seats</label>
            <input
              type="number"
              min="1"
              className="w-full border p-2 rounded"
              value={form.availableSeats}
              onChange={(e) =>
                setForm({ ...form, availableSeats: Number(e.target.value) })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Price/seat (₹)</label>
            <input
              type="number"
              min="0"
              className="w-full border p-2 rounded"
              value={form.pricePerSeat}
              onChange={(e) =>
                setForm({ ...form, pricePerSeat: Number(e.target.value) })
              }
              required
            />
          </div>
        </div>

        <label className="block text-sm font-medium">Vehicle</label>
        <input
          className="w-full border p-2 rounded"
          placeholder="e.g. Honda City, TS-09-XX-1234"
          value={form.vehicle}
          onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
          required
        />

        <button
          type="submit"
          className="w-full bg-hopin text-white py-2 rounded hover:bg-hopin-dark"
        >
          Publish Ride
        </button>
      </form>
    </div>
  );
}

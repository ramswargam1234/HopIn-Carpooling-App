import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user } = useAuth();
  const [myRides, setMyRides] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [driverBookings, setDriverBookings] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    if (!user) return;
    try {
      const [rides, bookings, dBookings] = await Promise.all([
        api.get(`/rides/user/${user.id}`),
        api.get('/bookings/mine'),
        api.get('/bookings/driver'),
      ]);
      setMyRides(rides.data);
      setMyBookings(bookings.data);
      setDriverBookings(dBookings.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load profile');
    }
  };

  useEffect(() => {
    load();
  }, [user]);

  const deleteRide = async (id) => {
    if (!confirm('Delete this ride?')) return;
    await api.delete(`/rides/${id}`);
    load();
  };

  const updateBooking = async (id, status) => {
    await api.put(`/bookings/${id}/status`, { status });
    load();
  };

  const cancelBooking = async (id) => {
    await api.put(`/bookings/${id}/cancel`);
    load();
  };

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4 space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.role}</p>
        <p className="text-sm">{user.email}</p>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>}

      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">My Rides (as driver)</h3>
        {myRides.length === 0 && <p className="text-gray-500">No rides created yet.</p>}
        {myRides.map((r) => (
          <div key={r._id} className="border-b py-2">
            <p className="font-medium">
              {r.origin} → {r.destination}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(r.departureTime).toLocaleString()} · {r.availableSeats} seats left
              · ₹{r.pricePerSeat}
            </p>
            <button
              onClick={() => deleteRide(r._id)}
              className="text-red-600 text-sm hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </section>

      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">My Bookings (as rider)</h3>
        {myBookings.length === 0 && <p className="text-gray-500">No bookings yet.</p>}
        {myBookings.map((b) => (
          <div key={b._id} className="border-b py-2">
            <p className="font-medium">
              {b.ride?.origin} → {b.ride?.destination}
            </p>
            <p className="text-sm text-gray-500">
              {b.seatsBooked} seat(s) · ₹{b.totalCost} · status:{' '}
              <span className="font-semibold">{b.status}</span>
            </p>
            {b.status === 'pending' && (
              <button
                onClick={() => cancelBooking(b._id)}
                className="text-red-600 text-sm hover:underline"
              >
                Cancel
              </button>
            )}
          </div>
        ))}
      </section>

      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">Booking Requests on My Rides</h3>
        {driverBookings.length === 0 && (
          <p className="text-gray-500">No booking requests.</p>
        )}
        {driverBookings.map((b) => (
          <div key={b._id} className="border-b py-2">
            <p className="font-medium">
              {b.ride?.origin} → {b.ride?.destination}
            </p>
            <p className="text-sm text-gray-500">
              From {b.rider?.name} · {b.seatsBooked} seat(s) · ₹{b.totalCost} ·{' '}
              <span className="font-semibold">{b.status}</span>
            </p>
            {b.status === 'pending' && (
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => updateBooking(b._id, 'accepted')}
                  className="bg-hopin text-white px-3 py-1 rounded text-sm"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateBooking(b._id, 'rejected')}
                  className="bg-gray-200 px-3 py-1 rounded text-sm"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

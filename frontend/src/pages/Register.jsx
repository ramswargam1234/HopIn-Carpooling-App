import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'rider',
    vehicle: '',
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/users/register', form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          placeholder="Full name"
          value={form.name}
          onChange={update('name')}
          required
        />
        <input
          className="w-full border p-2 rounded"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={update('email')}
          required
        />
        <input
          className="w-full border p-2 rounded"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={update('password')}
          required
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Phone"
          value={form.phone}
          onChange={update('phone')}
          required
        />
        <select
          className="w-full border p-2 rounded"
          value={form.role}
          onChange={update('role')}
        >
          <option value="rider">Rider</option>
          <option value="driver">Driver</option>
        </select>
        {form.role === 'driver' && (
          <input
            className="w-full border p-2 rounded"
            placeholder="Vehicle (e.g. Honda City, TS-09-XX-1234)"
            value={form.vehicle}
            onChange={update('vehicle')}
          />
        )}
        <button
          type="submit"
          className="w-full bg-hopin text-white py-2 rounded hover:bg-hopin-dark"
        >
          Sign Up
        </button>
      </form>
      <p className="text-center mt-4 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-hopin">
          Sign in
        </Link>
      </p>
    </div>
  );
}

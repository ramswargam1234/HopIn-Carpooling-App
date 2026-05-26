import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-hopin">
        HopIn
      </Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-sm text-gray-600">Hi, {user.name}</span>
            <Link to="/profile" className="hover:text-hopin">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-hopin">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-hopin text-white px-3 py-1 rounded hover:bg-hopin-dark"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

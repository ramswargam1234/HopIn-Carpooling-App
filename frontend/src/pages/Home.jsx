import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6 text-center">
      <h1 className="text-5xl font-bold text-hopin mb-4">HopIn</h1>
      <p className="text-lg text-gray-600 mb-8">
        Share the ride. Save fuel. Build community.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          to="/create-ride"
          className="bg-hopin text-white px-6 py-3 rounded font-medium hover:bg-hopin-dark"
        >
          Offer a Ride
        </Link>
        <Link
          to="/find-ride"
          className="bg-white border-2 border-hopin text-hopin px-6 py-3 rounded font-medium hover:bg-gray-50"
        >
          Find a Ride
        </Link>
      </div>
    </div>
  );
}

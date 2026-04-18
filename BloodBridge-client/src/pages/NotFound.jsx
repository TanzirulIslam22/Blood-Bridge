import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
        <p className="text-2xl text-gray-700 mb-8">Oops! Page not found</p>
        <p className="text-gray-500 mb-8">The page you are looking for does not exist.</p>
        <Link 
          to="/" 
          className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

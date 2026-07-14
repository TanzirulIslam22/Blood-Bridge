import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: 'radial-gradient(ellipse 70% 60% at 70% 50%, rgba(139, 0, 0, 0.2) 0%, transparent 60%), linear-gradient(135deg, #0A0505 0%, #150A0A 40%, #1a0808 100%)' }}>
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#D62828] mb-4">404</h1>
        <p className="text-2xl text-[#F5E6E0] mb-8">Oops! Page not found</p>
        <p className="text-[#B09090] mb-8">The page you are looking for does not exist.</p>
        <Link 
          to="/" 
          className="inline-block bg-[#D62828] text-white px-8 py-3 rounded-lg hover:bg-[#FF2D2D] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

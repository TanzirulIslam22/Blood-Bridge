import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, dbUser, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 flex items-center justify-between" style={{ background: 'linear-gradient(to bottom, rgba(10, 5, 5, 0.98) 0%, rgba(10, 5, 5, 0.9) 100%)', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#D62828] flex items-center justify-center text-white text-lg font-bold" style={{ clipPath: 'polygon(50% 0%, 85% 35%, 100% 55%, 85% 75%, 50% 100%, 15% 75%, 0% 55%, 15% 35%)', boxShadow: '0 0 20px rgba(214, 40, 40, 0.35)' }}>
          B
        </div>
        <span className="text-2xl font-bold tracking-[3px] text-[#F5E6E0]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          Blood<span className="text-[#D62828]">Bridge</span>
        </span>
      </Link>

      <ul className="hidden md:flex items-center gap-9">
        <li><Link to="/" className="text-sm font-medium tracking-[1.5px] uppercase text-[#B09090] hover:text-[#F5E6E0] transition-colors">Home</Link></li>
        <li><Link to="/blood-donation-requests" className="text-sm font-medium tracking-[1.5px] uppercase text-[#B09090] hover:text-[#F5E6E0] transition-colors">Blood Requests</Link></li>
        <li><Link to="/search-donors" className="text-sm font-medium tracking-[1.5px] uppercase text-[#B09090] hover:text-[#F5E6E0] transition-colors">Find Donors</Link></li>
        <li><Link to="/blog" className="text-sm font-medium tracking-[1.5px] uppercase text-[#B09090] hover:text-[#F5E6E0] transition-colors">Blog</Link></li>
      </ul>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2"
            >
              <img 
                src={dbUser?.avatar || 'https://via.placeholder.com/40'} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover border-2 border-[#D62828]"
              />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-44 py-2 z-50" style={{ background: '#1E0E0E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px' }}>
                <Link 
                  to="/dashboard" 
                  className="block px-4 py-3 text-sm text-[#B09090] hover:bg-[rgba(214,40,40,0.1)] hover:text-[#F5E6E0] transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/dashboard/profile" 
                  className="block px-4 py-3 text-sm text-[#B09090] hover:bg-[rgba(214,40,40,0.1)] hover:text-[#F5E6E0] transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 text-sm text-[#B09090] hover:bg-[rgba(214,40,40,0.1)] hover:text-[#F5E6E0] transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link 
            to="/login" 
            className="bg-[#D62828] text-white px-6 py-2.5 text-sm font-semibold tracking-[1.5px] uppercase hover:bg-[#FF2D2D] transition-colors"
            style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
          >
            Login
          </Link>
        )}

        <button 
          className="md:hidden text-[#F5E6E0]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 right-0 p-4 md:hidden" style={{ background: 'rgba(10, 5, 5, 0.98)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <ul className="flex flex-col gap-4">
            <li><Link to="/" className="block text-sm font-medium tracking-[1.5px] uppercase text-[#B09090] hover:text-[#F5E6E0]" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/blood-donation-requests" className="block text-sm font-medium tracking-[1.5px] uppercase text-[#B09090] hover:text-[#F5E6E0]" onClick={() => setMenuOpen(false)}>Blood Requests</Link></li>
            <li><Link to="/search-donors" className="block text-sm font-medium tracking-[1.5px] uppercase text-[#B09090] hover:text-[#F5E6E0]" onClick={() => setMenuOpen(false)}>Find Donors</Link></li>
            <li><Link to="/blog" className="block text-sm font-medium tracking-[1.5px] uppercase text-[#B09090] hover:text-[#F5E6E0]" onClick={() => setMenuOpen(false)}>Blog</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
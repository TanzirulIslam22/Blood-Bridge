import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ 
      background: 'radial-gradient(ellipse 70% 60% at 70% 50%, rgba(139, 0, 0, 0.2) 0%, transparent 60%), linear-gradient(135deg, #0A0505 0%, #150A0A 40%, #1a0808 100%)' 
    }}>
      <div className="w-full max-w-md bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] p-8 md:p-12">
        <Link to="/" className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#D62828] flex items-center justify-center text-white text-lg font-bold" style={{ clipPath: 'polygon(50% 0%, 85% 35%, 100% 55%, 85% 75%, 50% 100%, 15% 75%, 0% 55%, 15% 35%)', boxShadow: '0 0 20px rgba(214, 40, 40, 0.35)' }}>
            🩸
          </div>
          <span className="text-2xl font-bold tracking-[3px] text-[#F5E6E0]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Blood<span className="text-[#D62828]">Bridge</span>
          </span>
        </Link>
        
        <h2 className="text-center text-[#F5E6E0] mt-8 mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '40px', letterSpacing: '2px' }}>
          Welcome Back
        </h2>
        <p className="text-center text-sm text-[#B09090] mb-10">Sign in to continue to your dashboard</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] placeholder-[rgba(176,144,144,0.4)] focus:outline-none focus:border-[#D62828] transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] placeholder-[rgba(176,144,144,0.4)] focus:outline-none focus:border-[#D62828] transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D62828] text-white py-3.5 text-sm font-semibold tracking-[2px] uppercase hover:bg-[#FF2D2D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center gap-4 my-8 text-[#B09090]">
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.08)]"></div>
          <span className="text-xs">or</span>
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.08)]"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3.5 border border-[rgba(255,255,255,0.15)] text-[#F5E6E0] hover:border-[#D62828] hover:bg-[rgba(214,40,40,0.08)] transition-colors disabled:opacity-50"
        >
          <FcGoogle className="text-xl" />
          <span className="text-sm font-medium">Continue with Google</span>
        </button>

        <p className="mt-10 text-center text-sm text-[#B09090]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#D62828] hover:underline">
            Register as Donor
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
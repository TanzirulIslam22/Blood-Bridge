import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { districts, bloodGroups } from '../data/bangladesh';
import { imgbbUpload } from '../utils/imgbbUpload';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bloodGroup: '',
    district: '',
    upazila: '',
    photoURL: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const selectedDistrict = districts.find(d => d.name === formData.district);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'district') {
      setFormData(prev => ({ ...prev, upazila: '' }));
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const url = await imgbbUpload(file);
        setFormData(prev => ({ ...prev, photoURL: url }));
        toast.success('Photo uploaded successfully');
      } catch (error) {
        toast.error('Photo upload failed');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (!/[A-Z]/.test(formData.password)) {
      toast.error('Password must contain at least one uppercase letter');
      return;
    }
    if (!/[a-z]/.test(formData.password)) {
      toast.error('Password must contain at least one lowercase letter');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, {
        avatar: formData.photoURL,
        bloodGroup: formData.bloodGroup,
        district: formData.district,
        upazila: formData.upazila
      });
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4" style={{ 
      background: 'radial-gradient(ellipse 70% 60% at 70% 50%, rgba(139, 0, 0, 0.2) 0%, transparent 60%), linear-gradient(135deg, #0A0505 0%, #150A0A 40%, #1a0808 100%)' 
    }}>
      <div className="w-full max-w-md bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] p-10">
        <Link to="/" className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#D62828] flex items-center justify-center text-white text-lg font-bold" style={{ clipPath: 'polygon(50% 0%, 85% 35%, 100% 55%, 85% 75%, 50% 100%, 15% 75%, 0% 55%, 15% 35%)', boxShadow: '0 0 20px rgba(214, 40, 40, 0.35)' }}>
            🩸
          </div>
          <span className="text-2xl font-bold tracking-[3px] text-[#F5E6E0]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Blood<span className="text-[#D62828]">Bridge</span>
          </span>
        </Link>
        
        <h2 className="text-center text-[#F5E6E0] mt-8 mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '40px', letterSpacing: '2px' }}>
          Join the Cause
        </h2>
        <p className="text-center text-sm text-[#B09090] mb-8">Register to become a blood donor</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] placeholder-[rgba(176,144,144,0.4)] focus:outline-none focus:border-[#D62828] transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] placeholder-[rgba(176,144,144,0.4)] focus:outline-none focus:border-[#D62828] transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] focus:outline-none focus:border-[#D62828] transition-colors"
                required
              >
                <option value="" className="bg-[#150A0A]">Select</option>
                {bloodGroups.map(bg => (
                  <option key={bg} value={bg} className="bg-[#150A0A]">{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">District</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] focus:outline-none focus:border-[#D62828] transition-colors"
                required
              >
                <option value="" className="bg-[#150A0A]">Select</option>
                {districts.map(d => (
                  <option key={d.name} value={d.name} className="bg-[#150A0A]">{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">Upazila</label>
            <select
              name="upazila"
              value={formData.upazila}
              onChange={handleChange}
              className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] focus:outline-none focus:border-[#D62828] transition-colors"
              required
              disabled={!formData.district}
            >
              <option value="" className="bg-[#150A0A]">Select</option>
              {selectedDistrict?.upazilas.map(u => (
                <option key={u} value={u} className="bg-[#150A0A]">{u}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#B09090] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#D62828] file:text-white"
            />
            {formData.photoURL && (
              <img src={formData.photoURL} alt="Preview" className="mt-3 w-20 h-20 object-cover rounded-full border-2 border-[#D62828]" />
            )}
          </div>

          <div>
            <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] placeholder-[rgba(176,144,144,0.4)] focus:outline-none focus:border-[#D62828] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
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
            {loading ? 'Registering...' : 'Register as Donor'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#B09090]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#D62828] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
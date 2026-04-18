import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { districts, bloodGroups } from '../../data/bangladesh';
import { imgbbUpload } from '../../utils/imgbbUpload';

const Profile = () => {
  const { dbUser, user } = useAuth();
  const [formData, setFormData] = useState({
    name: dbUser?.name || '',
    avatar: dbUser?.avatar || '',
    bloodGroup: dbUser?.bloodGroup || '',
    district: dbUser?.district || '',
    upazila: dbUser?.upazila || ''
  });
  const [loading, setLoading] = useState(false);

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
        setFormData(prev => ({ ...prev, avatar: url }));
        toast.success('Photo uploaded successfully');
      } catch (error) {
        toast.error('Photo upload failed');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/${dbUser.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] p-8">
        <h1 className="text-[#F5E6E0] text-2xl font-bold mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>
          Edit Profile
        </h1>
        <p className="text-sm text-[#B09090] mb-8">Update your donor information</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={formData.avatar || 'https://via.placeholder.com/100'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-[#D62828]"
            />
            <div>
              <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2">Change Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="text-sm text-[#B09090] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#D62828] file:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] placeholder-[rgba(176,144,144,0.4)] focus:outline-none focus:border-[#D62828]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">Email (read-only)</label>
            <input
              type="email"
              value={dbUser?.email || ''}
              disabled
              className="w-full px-4 py-3.5 bg-[#0A0505] border border-[rgba(255,255,255,0.04)] text-[#B09090]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] focus:outline-none focus:border-[#D62828]"
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
                className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] focus:outline-none focus:border-[#D62828]"
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
              className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] focus:outline-none focus:border-[#D62828]"
              disabled={!formData.district}
            >
              <option value="" className="bg-[#150A0A]">Select</option>
              {selectedDistrict?.upazilas.map(u => (
                <option key={u} value={u} className="bg-[#150A0A]">{u}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D62828] text-white py-3.5 text-sm font-semibold tracking-[2px] uppercase hover:bg-[#FF2D2D] transition-colors disabled:opacity-50"
            style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
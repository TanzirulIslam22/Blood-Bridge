import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../hooks/useAxios';
import { toast } from 'react-hot-toast';
import { districts, bloodGroups } from '../../data/bangladesh';

const CreateRequest = () => {
  const { dbUser, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    recipientName: '',
    bloodGroup: '',
    hospitalName: '',
    fullAddress: '',
    district: '',
    upazila: '',
    donationDate: '',
    donationTime: '',
    requestMessage: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/donationRequests', {
        ...formData,
        requesterName: dbUser?.name || user?.displayName,
        requesterEmail: dbUser?.email || user?.email
      });
      toast.success('Blood request created successfully!');
      navigate('/dashboard/my-donation-requests');
    } catch (error) {
      toast.error('Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] p-8">
        <h1 className="text-[#F5E6E0] text-2xl font-bold mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>
          Create Blood Request
        </h1>
        <p className="text-sm text-[#B09090] mb-8">Fill in the details to request blood donation</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">Recipient Name</label>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              placeholder="Patient name"
              className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] placeholder-[rgba(176,144,144,0.4)] focus:outline-none focus:border-[#D62828] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">Blood Group Required</label>
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
            <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">Hospital Name</label>
            <input
              type="text"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              placeholder="Hospital name"
              className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] placeholder-[rgba(176,144,144,0.4)] focus:outline-none focus:border-[#D62828] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">Full Address</label>
            <textarea
              name="fullAddress"
              value={formData.fullAddress}
              onChange={handleChange}
              placeholder="Complete address"
              className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] placeholder-[rgba(176,144,144,0.4)] focus:outline-none focus:border-[#D62828] transition-colors"
              rows="2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">Donation Date</label>
              <input
                type="date"
                name="donationDate"
                value={formData.donationDate}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] focus:outline-none focus:border-[#D62828] transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">Donation Time</label>
              <input
                type="time"
                name="donationTime"
                value={formData.donationTime}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] focus:outline-none focus:border-[#D62828] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">Message (Optional)</label>
            <textarea
              name="requestMessage"
              value={formData.requestMessage}
              onChange={handleChange}
              placeholder="Additional details..."
              className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] placeholder-[rgba(176,144,144,0.4)] focus:outline-none focus:border-[#D62828] transition-colors"
              rows="3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D62828] text-white py-3.5 text-sm font-semibold tracking-[2px] uppercase hover:bg-[#FF2D2D] transition-colors disabled:opacity-50"
            style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
          >
            {loading ? 'Creating...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRequest;
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../hooks/useAxios';
import { toast } from 'react-hot-toast';
import { districts, bloodGroups } from '../../data/bangladesh';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditRequest = () => {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const selectedDistrict = districts.find(d => d.name === formData.district);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(`/api/donationRequests/${id}`);
        const data = response.data;
        setFormData({
          recipientName: data.recipientName,
          bloodGroup: data.bloodGroup,
          hospitalName: data.hospitalName,
          fullAddress: data.fullAddress,
          district: data.district,
          upazila: data.upazila,
          donationDate: data.donationDate.split('T')[0],
          donationTime: data.donationTime,
          requestMessage: data.requestMessage || ''
        });
      } catch (error) {
        toast.error('Failed to load request');
        navigate('/dashboard/my-donation-requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'district') {
      setFormData(prev => ({ ...prev, upazila: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`/api/donationRequests/${id}`, formData);
      toast.success('Request updated successfully!');
      navigate('/dashboard/my-donation-requests');
    } catch (error) {
      toast.error('Failed to update request');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
<div className="max-w-2xl mx-auto">
      <div className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-[#F5E6E0]">Edit Blood Donation Request</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#B09090] mb-2">Recipient Name</label>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] rounded-lg focus:outline-none focus:border-[#D62828] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[#B09090] mb-2">Blood Group Required</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] rounded-lg focus:outline-none focus:border-[#D62828] transition-colors"
              required
            >
              <option value="">Select</option>
              {bloodGroups.map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#B09090] mb-2">Hospital Name</label>
            <input
              type="text"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] rounded-lg focus:outline-none focus:border-[#D62828] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[#B09090] mb-2">Full Address</label>
            <textarea
              name="fullAddress"
              value={formData.fullAddress}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] rounded-lg focus:outline-none focus:border-[#D62828] transition-colors"
              rows="2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#B09090] mb-2">District</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] rounded-lg focus:outline-none focus:border-[#D62828] transition-colors"
                required
              >
                <option value="">Select</option>
                {districts.map(d => (
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#B09090] mb-2">Upazila</label>
              <select
                name="upazila"
                value={formData.upazila}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] rounded-lg focus:outline-none focus:border-[#D62828] transition-colors"
                required
                disabled={!formData.district}
              >
                <option value="">Select</option>
                {selectedDistrict?.upazilas.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#B09090] mb-2">Donation Date</label>
              <input
                type="date"
                name="donationDate"
                value={formData.donationDate}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] rounded-lg focus:outline-none focus:border-[#D62828] transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[#B09090] mb-2">Donation Time</label>
              <input
                type="time"
                name="donationTime"
                value={formData.donationTime}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] rounded-lg focus:outline-none focus:border-[#D62828] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#B09090] mb-2">Message (Optional)</label>
            <textarea
              name="requestMessage"
              value={formData.requestMessage}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] rounded-lg focus:outline-none focus:border-[#D62828] transition-colors"
              rows="3"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#D62828] text-white py-3 rounded-lg hover:bg-[#FF2D2D] disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditRequest;

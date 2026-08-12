import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import axios from '../../hooks/useAxios';
import { toast } from 'react-hot-toast';
import { districts, bloodGroups } from '../../data/bangladesh';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditRequest = () => {
  const { id } = useParams();
  const { t } = useLanguage();
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
    requestMessage: '',
    urgent: false
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
          requestMessage: data.requestMessage || '',
          urgent: data.urgent || false
        });
      } catch (error) {
        toast.error(t('dashboard.loadFailed'));
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
      toast.success(t('dashboard.requestUpdated'));
      navigate('/dashboard/my-donation-requests');
    } catch (error) {
      toast.error(t('dashboard.updateFailed'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
<div className="max-w-2xl mx-auto">
      <div className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-[#F5E6E0]">{t('dashboard.editRequestTitle')}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#B09090] mb-2">{t('dashboard.recipientName')}</label>
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
            <label className="block text-[#B09090] mb-2">{t('dashboard.bloodGroupRequired')}</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] rounded-lg focus:outline-none focus:border-[#D62828] transition-colors"
              required
            >
              <option value="">{t('dashboard.select')}</option>
              {bloodGroups.map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#B09090] mb-2">{t('dashboard.hospitalName')}</label>
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
            <label className="block text-[#B09090] mb-2">{t('requestDetail.fullAddress')}</label>
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
              <label className="block text-[#B09090] mb-2">{t('requestDetail.district')}</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] rounded-lg focus:outline-none focus:border-[#D62828] transition-colors"
                required
              >
                <option value="">{t('dashboard.select')}</option>
                {districts.map(d => (
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#B09090] mb-2">{t('requestDetail.upazila')}</label>
              <select
                name="upazila"
                value={formData.upazila}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] rounded-lg focus:outline-none focus:border-[#D62828] transition-colors"
                required
                disabled={!formData.district}
              >
                <option value="">{t('dashboard.select')}</option>
                {selectedDistrict?.upazilas.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#B09090] mb-2">{t('requestDetail.donationDate')}</label>
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
              <label className="block text-[#B09090] mb-2">{t('requestDetail.donationTime')}</label>
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
            <label className="block text-[#B09090] mb-2">{t('dashboard.messageOptional')}</label>
            <textarea
              name="requestMessage"
              value={formData.requestMessage}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] rounded-lg focus:outline-none focus:border-[#D62828] transition-colors"
              rows="3"
            />
          </div>

          <label
            className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors rounded-lg ${formData.urgent ? 'border-[#D62828] bg-[rgba(214,40,40,0.1)]' : 'border-[rgba(255,255,255,0.08)] bg-[#150A0A] hover:border-[rgba(214,40,40,0.4)]'}`}
          >
            <input
              type="checkbox"
              name="urgent"
              checked={formData.urgent}
              onChange={(e) => setFormData(prev => ({ ...prev, urgent: e.target.checked }))}
              className="w-4 h-4 accent-[#D62828]"
            />
            <div>
              <p className="text-sm font-semibold text-[#F5E6E0]">{t('dashboard.emergencyUrgent')}</p>
              <p className="text-xs text-[#B09090] mt-0.5">{t('dashboard.urgentHintEdit')}</p>
            </div>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#D62828] text-white py-3 rounded-lg hover:bg-[#FF2D2D] disabled:opacity-50 transition-colors"
          >
            {saving ? t('dashboard.saving') : t('profile.saveChanges')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditRequest;

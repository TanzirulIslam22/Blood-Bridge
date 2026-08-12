import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import axios from '../../hooks/useAxios';
import { toast } from 'react-hot-toast';
import { districts, bloodGroups } from '../../data/bangladesh';

const CreateRequest = () => {
  const { dbUser, user } = useAuth();
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
      });      toast.success(t('dashboard.requestCreated'));
      navigate('/dashboard/my-donation-requests');
    } catch (error) {
      toast.error(t('dashboard.createFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] p-8">
        <h1 className="text-[#F5E6E0] text-2xl font-bold mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>
          {t('dashboard.createRequestTitle')}
        </h1>
        <p className="text-sm text-[#B09090] mb-8">{t('dashboard.createRequestSubtitle')}</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">{t('dashboard.recipientName')}</label>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              placeholder={t('dashboard.recipientNamePh')}
              className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] placeholder-[rgba(176,144,144,0.4)] focus:outline-none focus:border-[#D62828] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">{t('dashboard.bloodGroupRequired')}</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] focus:outline-none focus:border-[#D62828] transition-colors"
              required
            >
              <option value="" className="bg-[#150A0A]">{t('dashboard.select')}</option>
              {bloodGroups.map(bg => (
                <option key={bg} value={bg} className="bg-[#150A0A]">{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">{t('dashboard.hospitalName')}</label>
            <input
              type="text"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              placeholder={t('dashboard.hospitalNamePh')}
              className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] placeholder-[rgba(176,144,144,0.4)] focus:outline-none focus:border-[#D62828] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">{t('requestDetail.fullAddress')}</label>
            <textarea
              name="fullAddress"
              value={formData.fullAddress}
              onChange={handleChange}
              placeholder={t('dashboard.fullAddressPh')}
              className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] placeholder-[rgba(176,144,144,0.4)] focus:outline-none focus:border-[#D62828] transition-colors"
              rows="2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">{t('requestDetail.district')}</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] focus:outline-none focus:border-[#D62828] transition-colors"
                required
              >
                <option value="" className="bg-[#150A0A]">{t('dashboard.select')}</option>
                {districts.map(d => (
                  <option key={d.name} value={d.name} className="bg-[#150A0A]">{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">{t('requestDetail.upazila')}</label>
              <select
                name="upazila"
                value={formData.upazila}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] focus:outline-none focus:border-[#D62828] transition-colors"
                required
                disabled={!formData.district}
              >
                <option value="" className="bg-[#150A0A]">{t('dashboard.select')}</option>
                {selectedDistrict?.upazilas.map(u => (
                  <option key={u} value={u} className="bg-[#150A0A]">{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">{t('requestDetail.donationDate')}</label>
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
              <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">{t('requestDetail.donationTime')}</label>
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
            <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">{t('dashboard.messageOptional')}</label>
            <textarea
              name="requestMessage"
              value={formData.requestMessage}
              onChange={handleChange}
              placeholder={t('dashboard.additionalDetailsPh')}
              className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] placeholder-[rgba(176,144,144,0.4)] focus:outline-none focus:border-[#D62828] transition-colors"
              rows="3"
            />
          </div>

          <label
            className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${formData.urgent ? 'border-[#D62828] bg-[rgba(214,40,40,0.1)]' : 'border-[rgba(255,255,255,0.08)] bg-[#150A0A] hover:border-[rgba(214,40,40,0.4)]'}`}
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
              <p className="text-xs text-[#B09090] mt-0.5">{t('dashboard.urgentHint')}</p>
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D62828] text-white py-3.5 text-sm font-semibold tracking-[2px] uppercase hover:bg-[#FF2D2D] transition-colors disabled:opacity-50"
            style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
          >
            {loading ? t('dashboard.creating') : t('dashboard.submitRequest')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRequest;
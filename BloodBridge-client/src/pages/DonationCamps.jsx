import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLanguage } from '../context/LanguageContext';

const STATUS_STYLES = {
  upcoming: 'bg-[rgba(234,179,8,0.15)] text-yellow-400 border-yellow-400/30',
  ongoing: 'bg-[rgba(34,197,94,0.15)] text-green-400 border-green-400/30',
  completed: 'bg-[rgba(100,116,139,0.15)] text-gray-400 border-gray-400/30',
  canceled: 'bg-[rgba(239,68,68,0.15)] text-red-400 border-red-400/30'
};

const DonationCamps = () => {
  const { t, lang } = useLanguage();
  const bnFont = lang === 'bn' ? { fontFamily: "'Noto Sans Bengali', 'DM Sans', sans-serif" } : {};
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCamps = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/donationCamps`);
        setCamps(response.data);
      } catch (error) {
        console.error('Error fetching camps:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCamps();
  }, []);

  return (
    <div className="py-20 px-6 md:px-12" style={{ background: 'linear-gradient(135deg, #0A0505 0%, #150A0A 40%, #1a0808 100%)' }}>
      <div className="max-w-5xl mx-auto" style={bnFont}>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-6 h-px bg-[#D62828]"></div>
          <span className="text-xs font-semibold tracking-[3px] uppercase text-[#D62828]">{t('camps.label')}</span>
        </div>
        <h1 className="text-[#F5E6E0] mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 5vw, 64px)', letterSpacing: '2px' }}>
          {t('camps.title1')} <em className="not-italic text-[#B09090]" style={{ fontFamily: lang === 'bn' ? "'Noto Sans Bengali', sans-serif" : "'DM Serif Display', serif" }}>{t('camps.title2')}</em>
        </h1>
        <p className="text-[#B09090] max-w-2xl mb-10">{t('camps.subtitle')}</p>

        {loading ? (
          <LoadingSpinner />
        ) : camps.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-5">
            {camps.map((camp) => (
              <Link key={camp._id} to={`/donation-camps/${camp._id}`} className="block">
                <div className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(214,40,40,0.4)] hover:translate-y-[-3px] transition-all h-full">
                  {camp.thumbnail && (
                    <img src={camp.thumbnail} alt={camp.title} className="w-full h-44 object-cover" />
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-[#F5E6E0]">{camp.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-[1.5px] uppercase border shrink-0 ${STATUS_STYLES[camp.status] || STATUS_STYLES.upcoming}`}>
                        {t(`camps.${camp.status}`)}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-sm text-[#B09090] mb-4">
                      <p>📍 {camp.district}{camp.upazila ? `, ${camp.upazila}` : ''}</p>
                      <p>📅 {new Date(camp.campDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <p>🕐 {camp.startTime} — {camp.endTime}</p>
                    </div>
                    <div className="pt-4 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#B09090]">{t('camps.registrations')}</p>
                        <p className="text-lg font-bold text-[#D62828]">{camp.registrationCount || 0} <span className="text-xs text-[#B09090] font-normal">/ {camp.bloodTarget}</span></p>
                      </div>
                      <span className="text-[#D62828] text-xs font-semibold tracking-[1.5px] uppercase">{t('camps.details')} →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-[#B09090]">{t('camps.noCamps')}</p>
            <p className="text-sm text-[#B09090]/60 mt-2">{t('camps.checkBack')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationCamps;

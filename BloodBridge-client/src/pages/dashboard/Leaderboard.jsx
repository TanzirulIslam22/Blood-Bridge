import { useEffect, useState } from 'react';
import axios from '../../hooks/useAxios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useLanguage } from '../../context/LanguageContext';

const BADGE_MAP = {
  'first-blood': { name: 'First Blood', icon: '🩸' },
  'bronze': { name: 'Bronze Donor', icon: '🥉' },
  'silver': { name: 'Silver Donor', icon: '🥈' },
  'gold': { name: 'Gold Donor', icon: '🥇' },
  'platinum': { name: 'Platinum Donor', icon: '💎' }
};

const RANK_COLORS = ['text-yellow-400', 'text-gray-300', 'text-amber-600'];

const Leaderboard = () => {
  const { t, lang } = useLanguage();
  const bnFont = lang === 'bn' ? { fontFamily: "'Noto Sans Bengali', 'DM Sans', sans-serif" } : {};
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/users/leaderboard?limit=10')
      .then(res => setDonors(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto" style={bnFont}>
      <div className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] p-6 mb-6">
        <h1 className="text-[#F5E6E0] text-2xl font-bold mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>
          {t('leaderboard.title')}
        </h1>
        <p className="text-sm text-[#B09090]">{t('leaderboard.subtitle')}</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-3">
          {donors.map((donor, index) => (
            <div key={donor._id} className="flex items-center gap-4 p-4 bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(214,40,40,0.4)] transition-colors">
              <div className={`w-10 h-10 flex items-center justify-center text-xl font-bold ${index < 3 ? RANK_COLORS[index] : 'text-[#B09090]'}`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                #{index + 1}
              </div>
              <img
                src={donor.avatar || 'https://via.placeholder.com/50'}
                alt={donor.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#D62828]"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[#F5E6E0] truncate">{donor.name}</h3>
                  <span className="bg-[rgba(214,40,40,0.15)] text-[#D62828] px-2 py-0.5 rounded text-xs font-semibold shrink-0">
                    {donor.bloodGroup || 'N/A'}
                  </span>
                </div>
                <p className="text-xs text-[#B09090] mt-0.5">{donor.district || 'Unknown location'} · {donor.donationCount || 0} {(donor.donationCount || 0) === 1 ? t('leaderboard.donations') : t('leaderboard.donationsPlural')}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xl font-bold text-[#D62828]">{donor.points || 0}</p>
                <p className="text-xs text-[#B09090] uppercase tracking-[1px]">{t('leaderboard.pts')}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                {(donor.badges || []).slice(0, 4).map(badgeId => {
                  const badge = BADGE_MAP[badgeId];
                  return badge ? (
                    <span key={badgeId} title={badge.name} className="text-xl">{badge.icon}</span>
                  ) : null;
                })}
              </div>
            </div>
          ))}
          {donors.length === 0 && (
            <p className="text-center text-[#B09090] py-10">{t('leaderboard.noDonors')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;

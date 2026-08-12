import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import axios from '../../hooks/useAxios';
import { toast } from 'react-hot-toast';
import { districts, bloodGroups } from '../../data/bangladesh';
import { imgbbUpload } from '../../utils/imgbbUpload';
import { QRCodeCanvas } from 'qrcode.react';
import LoadingSpinner from '../../components/LoadingSpinner';

const DONATION_COOLDOWN_DAYS = 90;

const BADGE_MAP = {
  'first-blood': { name: 'First Blood', icon: '🩸', description: 'Made your first donation' },
  'bronze': { name: 'Bronze Donor', icon: '🥉', description: 'Completed 1 donation' },
  'silver': { name: 'Silver Donor', icon: '🥈', description: 'Completed 3 donations' },
  'gold': { name: 'Gold Donor', icon: '🥇', description: 'Completed 5 donations' },
  'platinum': { name: 'Platinum Donor', icon: '💎', description: 'Completed 10 donations' }
};

const BADGE_ORDER = ['first-blood', 'bronze', 'silver', 'gold', 'platinum'];

const Profile = () => {
  const { dbUser } = useAuth();
  const { t, lang } = useLanguage();
  const bnFont = lang === 'bn' ? { fontFamily: "'Noto Sans Bengali', 'DM Sans', sans-serif" } : {};
  const [formData, setFormData] = useState({
    name: dbUser?.name || '',
    avatar: dbUser?.avatar || '',
    bloodGroup: dbUser?.bloodGroup || '',
    district: dbUser?.district || '',
    upazila: dbUser?.upazila || '',
    height: dbUser?.height || '',
    weight: dbUser?.weight || '',
    age: dbUser?.age || '',
    institution: dbUser?.institution || ''
  });
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [certificate, setCertificate] = useState(null);

  const selectedDistrict = districts.find(d => d.name === formData.district);

  useEffect(() => {
    if (dbUser?.id) {
      axios.get(`/api/users/${dbUser.id}`)
        .then(res => {
          const u = res.data;
          setUserData(u);
          setFormData(prev => ({
            ...prev,
            name: u.name,
            avatar: u.avatar || '',
            bloodGroup: u.bloodGroup || '',
            district: u.district || '',
            upazila: u.upazila || '',
            height: u.height || '',
            weight: u.weight || '',
            age: u.age || '',
            institution: u.institution || ''
          }));
        })
        .catch(err => console.error(err));

      axios.get(`/api/users/${dbUser.id}/donationRecords`)
        .then(res => setRecords(res.data))
        .catch(err => console.error(err))
        .finally(() => setRecordsLoading(false));
    }
  }, [dbUser?.id]);

  const lastDonation = userData?.lastDonationDate;
  const nextEligible = lastDonation ? new Date(new Date(lastDonation).getTime() + DONATION_COOLDOWN_DAYS * 24 * 60 * 60 * 1000) : null;
  const daysLeft = nextEligible ? Math.ceil((nextEligible - new Date()) / (24 * 60 * 60 * 1000)) : 0;
  const isEligible = !lastDonation || daysLeft <= 0;
  const cooldownProgress = nextEligible ? Math.min(100, Math.max(0, 100 - (daysLeft / DONATION_COOLDOWN_DAYS) * 100)) : 100;

  const points = userData?.points || 0;
  const donationCount = userData?.donationCount || 0;
  const badges = userData?.badges || [];

  const nextBadge = BADGE_ORDER
    .map(id => BADGE_MAP[id])
    .find((b, i) => donationCount < [1, 1, 3, 5, 10][i]);

  const nextBadgeThreshold = (() => {
    const thresholds = [1, 1, 3, 5, 10];
    for (let i = 0; i < thresholds.length; i++) {
      if (donationCount < thresholds[i]) return thresholds[i];
    }
    return null;
  })();

  const badgeProgress = nextBadgeThreshold ? Math.min(100, (donationCount / nextBadgeThreshold) * 100) : 100;

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
        toast.success(t('profile.photoUploaded'));
      } catch (error) {
        toast.error(t('profile.photoFailed'));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(`/api/users/${dbUser.id}`, formData);
      toast.success(t('profile.profileUpdated'));
      window.location.reload();
    } catch (error) {
      toast.error(t('profile.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" style={bnFont}>
      <div className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[#F5E6E0] text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>
            {t('profile.donorProfile')}
          </h1>
          <span className="text-sm text-[#B09090]">{donationCount} {donationCount === 1 ? t('profile.donations') : t('profile.donationsPlural')}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="p-5 bg-[#150A0A] border border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#B09090]">{t('profile.points')}</p>
              <span className="text-xs px-2 py-0.5 rounded bg-[rgba(214,40,40,0.15)] text-[#D62828] font-semibold">{t('profile.rank')}: {points >= 300 ? 'Gold' : points >= 150 ? 'Silver' : 'Bronze'}</span>
            </div>
            <p className="text-3xl font-bold text-[#D62828] mt-1">{points}</p>
            <p className="text-xs text-[#B09090] mt-1">{t('profile.earnPoints')}</p>
          </div>

          <div className="p-5 bg-[#150A0A] border border-[rgba(255,255,255,0.06)]">
            <p className="text-sm text-[#B09090] mb-2">{t('profile.nextDonation')}</p>
            {isEligible ? (
              <p className="text-lg font-semibold text-green-400">✓ {t('profile.availableNow')}</p>
            ) : (
              <p className="text-lg font-semibold text-yellow-400">{t('profile.eligibleIn')} {daysLeft} {daysLeft === 1 ? t('profile.days') : t('profile.days')}</p>
            )}
            <div className="h-2 bg-[#0A0505] rounded overflow-hidden mt-3">
              <div className={`h-full ${isEligible ? 'bg-green-400' : 'bg-yellow-400'}`} style={{ width: `${cooldownProgress}%` }}></div>
            </div>
            <p className="text-xs text-[#B09090] mt-2">
              {nextEligible ? `${t('profile.nextEligible')} ${nextEligible.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : t('profile.noPreviousDonation')}
            </p>
          </div>
        </div>

        <div className="p-5 bg-[#150A0A] border border-[rgba(255,255,255,0.06)]">
          <p className="text-sm text-[#B09090] mb-3">{t('profile.badges')}</p>
          <div className="flex flex-wrap gap-3">
            {BADGE_ORDER.map(id => {
              const badge = BADGE_MAP[id];
              const earned = badges.includes(id);
              return (
                <div key={id} className={`flex flex-col items-center p-3 border ${earned ? 'border-[rgba(214,40,40,0.5)] bg-[rgba(214,40,40,0.08)]' : 'border-[rgba(255,255,255,0.06)] opacity-40'}`}>
                  <span className="text-3xl">{badge.icon}</span>
                  <span className="text-xs font-semibold text-[#F5E6E0] mt-1">{badge.name}</span>
                  <span className="text-[10px] text-[#B09090] text-center">{badge.description}</span>
                </div>
              );
            })}
          </div>
          {nextBadge && nextBadgeThreshold && (
            <div className="mt-4">
              <p className="text-xs text-[#B09090] mb-1">{t('profile.nextBadge')} <span className="text-[#F5E6E0] font-semibold">{nextBadge.name}</span> ({donationCount}/{nextBadgeThreshold} {t('profile.donations')})</p>
              <div className="h-1.5 bg-[#0A0505] rounded overflow-hidden">
                <div className="h-full bg-[#D62828]" style={{ width: `${badgeProgress}%` }}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] p-8">
          <h2 className="text-[#F5E6E0] text-xl font-bold mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>
            {t('profile.editProfile')}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={formData.avatar || 'https://via.placeholder.com/100'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-[#D62828]"
              />
              <div>
                <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2">{t('profile.changePhoto')}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="text-sm text-[#B09090] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#D62828] file:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">{t('profile.name')}</label>
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
              <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">{t('profile.emailReadOnly')}</label>
              <input
                type="email"
                value={dbUser?.email || ''}
                disabled
                className="w-full px-4 py-3.5 bg-[#0A0505] border border-[rgba(255,255,255,0.04)] text-[#B09090]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">{t('profile.bloodGroup')}</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] focus:outline-none focus:border-[#D62828]"
                >
                  <option value="" className="bg-[#150A0A]">{t('auth.select')}</option>
                  {bloodGroups.map(bg => (
                    <option key={bg} value={bg} className="bg-[#150A0A]">{bg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">{t('profile.district')}</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] focus:outline-none focus:border-[#D62828]"
                >
                  <option value="" className="bg-[#150A0A]">{t('auth.select')}</option>
                  {districts.map(d => (
                    <option key={d.name} value={d.name} className="bg-[#150A0A]">{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">{t('profile.upazila')}</label>
              <select
                name="upazila"
                value={formData.upazila}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] focus:outline-none focus:border-[#D62828]"
                disabled={!formData.district}
              >
                <option value="" className="bg-[#150A0A]">{t('auth.select')}</option>
                {selectedDistrict?.upazilas.map(u => (
                  <option key={u} value={u} className="bg-[#150A0A]">{u}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">{t('profile.age')}</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g. 24"
                  className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] placeholder-[rgba(176,144,144,0.4)] focus:outline-none focus:border-[#D62828]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">{t('profile.institution')}</label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  placeholder={t('profile.institutionPh')}
                  className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] placeholder-[rgba(176,144,144,0.4)] focus:outline-none focus:border-[#D62828]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">{t('profile.height')}</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="e.g. 170"
                  className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] placeholder-[rgba(176,144,144,0.4)] focus:outline-none focus:border-[#D62828]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium tracking-[1.5px] uppercase text-[#B09090] mb-2.5">{t('profile.weight')}</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g. 65"
                  className="w-full px-4 py-3.5 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] placeholder-[rgba(176,144,144,0.4)] focus:outline-none focus:border-[#D62828]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D62828] text-white py-3.5 text-sm font-semibold tracking-[2px] uppercase hover:bg-[#FF2D2D] transition-colors disabled:opacity-50"
              style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
            >
              {loading ? t('profile.saving') : t('profile.saveChanges')}
            </button>
          </form>
        </div>

        <div className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] p-8">
          <h2 className="text-[#F5E6E0] text-xl font-bold mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>
            {t('profile.donationHistory')}
          </h2>

          {recordsLoading ? (
            <LoadingSpinner />
          ) : records.length > 0 ? (
            <div className="space-y-3">
              {records.map(record => (
                <div key={record._id} className="p-4 bg-[#150A0A] border border-[rgba(255,255,255,0.06)]">
                  <div className="flex items-center justify-between">
                    <span className="bg-[rgba(214,40,40,0.15)] text-[#D62828] px-2 py-0.5 rounded text-xs font-semibold">{record.bloodGroup}</span>
                    <span className="text-xs text-[#B09090]">{new Date(record.donationDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <p className="text-sm text-[#F5E6E0] mt-2">{t('profile.for')} {record.recipientName}</p>
                  <p className="text-xs text-[#B09090]">{record.hospitalName}</p>
                  <div className="flex items-center justify-between mt-3">
                    <button
                      onClick={() => setCertificate(record)}
                      className="text-xs font-semibold tracking-[1.5px] uppercase text-[#D62828] hover:text-[#FF2D2D]"
                    >
                      {t('profile.viewCertificate')} →
                    </button>
                    <span className="text-[10px] font-mono text-[#B09090]">{record.certificateId.slice(0, 10)}...</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#B09090]">{t('profile.noDonations')}</p>
          )}
        </div>
      </div>

      {certificate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="bg-[#1E0E0E] border-2 border-[#D62828] p-8 max-w-md w-full text-center relative">
            <button
              onClick={() => setCertificate(null)}
              className="absolute top-3 right-4 text-2xl text-[#B09090] hover:text-[#F5E6E0]"
            >
              ×
            </button>
            <p className="text-xs uppercase tracking-[3px] text-[#B09090] mb-2">{t('profile.donationCertificate')}</p>
            <h3 className="text-2xl font-bold text-[#F5E6E0] mb-1" style={{ fontFamily: lang === 'bn' ? "'Noto Sans Bengali', sans-serif" : "'DM Serif Display', serif" }}>{certificate.donorName}</h3>
            <p className="text-sm text-[#B09090] mb-5">{t('profile.for')} {certificate.recipientName}</p>
            <QRCodeCanvas
              value={`${window.location.origin}/certificate/${certificate.certificateId}`}
              size={180}
              bgColor="#1E0E0E"
              fgColor="#F5E6E0"
              className="mx-auto"
            />
            <p className="text-[10px] font-mono text-[#D62828] mt-4">{certificate.certificateId}</p>
            <a
              href={`/certificate/${certificate.certificateId}`}
              className="inline-block mt-4 bg-[#D62828] text-white px-6 py-2.5 text-sm font-semibold tracking-[2px] uppercase hover:bg-[#FF2D2D]"
              style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
            >
              {t('profile.openCertificate')}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

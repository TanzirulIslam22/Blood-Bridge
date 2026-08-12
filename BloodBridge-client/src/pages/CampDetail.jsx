import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import Swal from 'sweetalert2';

const STATUS_STYLES = {
  upcoming: 'bg-[rgba(234,179,8,0.15)] text-yellow-400 border-yellow-400/30',
  ongoing: 'bg-[rgba(34,197,94,0.15)] text-green-400 border-green-400/30',
  completed: 'bg-[rgba(100,116,139,0.15)] text-gray-400 border-gray-400/30',
  canceled: 'bg-[rgba(239,68,68,0.15)] text-red-400 border-red-400/30'
};

const CampDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, dbUser } = useAuth();
  const { t, lang } = useLanguage();
  const bnFont = lang === 'bn' ? { fontFamily: "'Noto Sans Bengali', 'DM Sans', sans-serif" } : {};
  const [camp, setCamp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCamp = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/donationCamps/${id}`);
        setCamp(response.data);
      } catch (error) {
        console.error('Error fetching camp:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCamp();
  }, [id]);

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/donationCamps/${id}/register`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(t('camps.registeredSuccess'));
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 403) {
        toast.error(t('camps.loginRequired'));
      } else {
        toast.error(t('camps.loginRequired'));
      }
    }
  };

  const handleLoginPrompt = () => {
    Swal.fire({
      title: t('camps.loginRequired'),
      text: t('camps.pleaseLogin'),
      icon: 'warning',
      confirmButtonText: t('auth.login')
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/login', { state: { from: { pathname: `/donation-camps/${id}` } } });
      }
    });
  };

  if (loading) return <LoadingSpinner />;
  if (!camp) return <div className="py-32 text-center text-[#B09090]">{t('camps.noCamps')}</div>;

  return (
    <div className="py-20 px-6 md:px-12" style={{ background: 'linear-gradient(135deg, #0A0505 0%, #150A0A 40%, #1a0808 100%)', minHeight: '100vh' }}>
      <div className="max-w-3xl mx-auto" style={bnFont}>
        <Link to="/donation-camps" className="text-sm text-[#B09090] hover:text-[#F5E6E0] mb-6 inline-block">← {t('camps.backToCamps')}</Link>

        <div className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] overflow-hidden">
          {camp.thumbnail && <img src={camp.thumbnail} alt={camp.title} className="w-full h-60 object-cover" />}
          <div className="p-8">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h1 className="text-2xl font-bold text-[#F5E6E0]" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>
                {camp.title}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-[1.5px] uppercase border shrink-0 ${STATUS_STYLES[camp.status] || STATUS_STYLES.upcoming}`}>
                {t(`camps.${camp.status}`)}
              </span>
            </div>

            {camp.description && <p className="text-[#B09090] leading-relaxed mb-6">{camp.description}</p>}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-[#150A0A] border border-[rgba(255,255,255,0.06)]">
                <p className="text-xs uppercase tracking-[2px] text-[#B09090] mb-1">{t('camps.location')}</p>
                <p className="text-sm font-semibold text-[#F5E6E0]">{camp.district}{camp.upazila ? `, ${camp.upazila}` : ''}</p>
                <p className="text-xs text-[#B09090] mt-1">{camp.fullAddress}</p>
              </div>
              <div className="p-4 bg-[#150A0A] border border-[rgba(255,255,255,0.06)]">
                <p className="text-xs uppercase tracking-[2px] text-[#B09090] mb-1">{t('camps.date')}</p>
                <p className="text-sm font-semibold text-[#F5E6E0]">{new Date(camp.campDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="text-xs text-[#B09090] mt-1">{camp.startTime} — {camp.endTime}</p>
              </div>
              <div className="p-4 bg-[#150A0A] border border-[rgba(255,255,255,0.06)]">
                <p className="text-xs uppercase tracking-[2px] text-[#B09090] mb-1">{t('camps.registrations')}</p>
                <p className="text-sm font-semibold text-[#F5E6E0]">{camp.registrationCount || 0} / {camp.bloodTarget}</p>
                <p className="text-xs text-[#B09090] mt-1">{t('camps.attendees')}</p>
              </div>
              <div className="p-4 bg-[#150A0A] border border-[rgba(255,255,255,0.06)]">
                <p className="text-xs uppercase tracking-[2px] text-[#B09090] mb-1">{t('camps.organizer')}</p>
                <p className="text-sm font-semibold text-[#F5E6E0]">{camp.organizerName}</p>
              </div>
            </div>

            {camp.status === 'upcoming' || camp.status === 'ongoing' ? (
              user ? (
                <button
                  onClick={handleRegister}
                  className="w-full bg-[#D62828] text-white py-3.5 text-sm font-semibold tracking-[2px] uppercase hover:bg-[#FF2D2D] transition-colors"
                  style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
                >
                  {t('camps.registerPoints')}
                </button>
              ) : (
                <button
                  onClick={handleLoginPrompt}
                  className="w-full bg-[#D62828] text-white py-3.5 text-sm font-semibold tracking-[2px] uppercase hover:bg-[#FF2D2D] transition-colors"
                  style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
                >
                  {t('camps.loginToRegister')}
                </button>
              )
            ) : (
              <div className="py-3.5 text-center text-sm text-[#B09090] uppercase tracking-[2px] border border-[rgba(255,255,255,0.08)]">
                {t('camps.thisCampIs')} {t(`camps.${camp.status}`)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampDetail;

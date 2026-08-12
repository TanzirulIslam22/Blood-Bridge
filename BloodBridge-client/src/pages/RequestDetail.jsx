import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import Swal from 'sweetalert2';
import { compatibleDonorGroups, isUniversalRecipient } from '../utils/bloodCompatibility';
import { useLanguage } from '../context/LanguageContext';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, dbUser } = useAuth();
  const { t } = useLanguage();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/donationRequests/${id}`);
        setRequest(response.data);
      } catch (error) {
        console.error('Error fetching request:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  const handleDonate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/donationRequests/${id}/donate`,
        { name: dbUser?.name, email: dbUser?.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(t('requestDetail.confirmDonation'));
      setShowModal(false);
      navigate('/dashboard/my-donation-requests');
    } catch (error) {
      toast.error(t('requestDetail.donateBlood'));
    }
  };

  const handleLoginPrompt = () => {
    Swal.fire({
      title: t('requestDetail.loginRequired'),
      text: t('requestDetail.pleaseLogin'),
      icon: 'warning',
      confirmButtonText: t('auth.login')
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/login', { state: { from: { pathname: `/blood-donation-requests/${id}` } } });
      }
    });
  };

  if (loading) return <LoadingSpinner />;
  if (!request) return <div className="text-center py-12 text-[#B09090]">{t('requestDetail.bloodRequestFor')}</div>;

  return (
    <div className="py-20 px-15">
      <div className="max-w-2xl mx-auto">
        <div className={`bg-[#1E0E0E] border p-8 ${request.urgent ? 'border-[#D62828]' : 'border-[rgba(255,255,255,0.05)]'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-[#D62828]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '44px', lineHeight: 1 }}>
                {request.bloodGroup}
              </div>
              {request.urgent && (
                <span className="px-2.5 py-1 text-[10px] font-bold tracking-[2px] uppercase bg-[#D62828] text-white rounded-full animate-pulse">🚨 {t('requests.urgent')}</span>
              )}
            </div>
            <span className="px-3 py-1 text-xs font-semibold tracking-[2px] uppercase bg-[rgba(214,40,40,0.15)] text-[#D62828] border border-[rgba(214,40,40,0.3)] rounded-full">
              {request.status}
            </span>
          </div>

          <h1 className="text-2xl font-semibold text-[#F5E6E0] mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>
            {t('requestDetail.bloodRequestFor')} {request.recipientName}
          </h1>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs tracking-[1.5px] uppercase text-[#B09090] mb-1">{t('requestDetail.hospital')}</p>
                <p className="text-[#F5E6E0] font-medium">{request.hospitalName}</p>
              </div>
              <div>
                <p className="text-xs tracking-[1.5px] uppercase text-[#B09090] mb-1">{t('requestDetail.fullAddress')}</p>
                <p className="text-[#F5E6E0] font-medium">{request.fullAddress}</p>
              </div>
              <div>
                <p className="text-xs tracking-[1.5px] uppercase text-[#B09090] mb-1">{t('requestDetail.district')}</p>
                <p className="text-[#F5E6E0] font-medium">{request.district}</p>
              </div>
              <div>
                <p className="text-xs tracking-[1.5px] uppercase text-[#B09090] mb-1">{t('requestDetail.upazila')}</p>
                <p className="text-[#F5E6E0] font-medium">{request.upazila}</p>
              </div>
              <div>
                <p className="text-xs tracking-[1.5px] uppercase text-[#B09090] mb-1">{t('requestDetail.donationDate')}</p>
                <p className="text-[#F5E6E0] font-medium">{new Date(request.donationDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs tracking-[1.5px] uppercase text-[#B09090] mb-1">{t('requestDetail.donationTime')}</p>
                <p className="text-[#F5E6E0] font-medium">{request.donationTime}</p>
              </div>
              <div>
                <p className="text-xs tracking-[1.5px] uppercase text-[#B09090] mb-1">{t('requestDetail.requestedBy')}</p>
                <p className="text-[#F5E6E0] font-medium">{request.requesterName}</p>
              </div>
              <div>
                <p className="text-xs tracking-[1.5px] uppercase text-[#B09090] mb-1">{t('requestDetail.requesterEmail')}</p>
                <p className="text-[#F5E6E0] font-medium">{request.requesterEmail}</p>
              </div>
            </div>

            {request.requestMessage && (
              <div className="mt-4">
                <p className="text-xs tracking-[1.5px] uppercase text-[#B09090] mb-2">{t('requestDetail.message')}</p>
                <p className="p-3 bg-[#150A0A] rounded text-[#F5E6E0]">{request.requestMessage}</p>
              </div>
            )}

            {request.donorInfo && request.donorInfo.name && (
              <div className="mt-4 p-4 bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] rounded">
                <p className="text-green-400 font-semibold text-sm tracking-[2px] uppercase mb-2">{t('requestDetail.donorAssigned')}</p>
                <p className="text-[#F5E6E0]">{t('requestDetail.name')}: {request.donorInfo.name}</p>
                <p className="text-[#B09090]">{t('requestDetail.email')}: {request.donorInfo.email}</p>
              </div>
            )}

            <div className="mt-4 p-4 bg-[#150A0A] border border-[rgba(255,255,255,0.06)] rounded">
              <p className="text-xs tracking-[1.5px] uppercase text-[#B09090] mb-3">
                {t('requestDetail.whoCanDonate')} <span className="text-[#D62828] font-semibold">{request.bloodGroup}</span>
                {isUniversalRecipient(request.bloodGroup) && <span className="text-purple-400 ml-2">★ {t('search.universal')} Recipient</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {compatibleDonorGroups(request.bloodGroup).map(group => (
                  <span
                    key={group}
                    className={`px-3 py-1.5 rounded text-sm font-semibold ${
                      group === request.bloodGroup
                        ? 'bg-[rgba(214,40,40,0.25)] text-[#D62828] border border-[#D62828]'
                        : group === 'O-'
                          ? 'bg-[rgba(139,92,246,0.15)] text-purple-400 border border-purple-400/30'
                          : 'bg-[#1E0E0E] border border-[rgba(255,255,255,0.1)] text-[#B09090]'
                    }`}
                  >
                    {group}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[#B09090] mt-3">
                {t('requestDetail.exactPref')}
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            {request.status === 'pending' && (
              user ? (
                <button
                  onClick={() => setShowModal(true)}
                  className="flex-1 bg-[#D62828] text-white py-3 text-sm font-semibold tracking-[2px] uppercase hover:bg-[#FF2D2D] transition-colors"
                  style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
                >
                  {t('requestDetail.donateBlood')}
                </button>
              ) : (
                <button
                  onClick={handleLoginPrompt}
                  className="flex-1 bg-[#D62828] text-white py-3 text-sm font-semibold tracking-[2px] uppercase hover:bg-[#FF2D2D] transition-colors"
                  style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
                >
                  {t('requestDetail.loginToDonate')}
                </button>
              )
            )}
            <Link
              to="/blood-donation-requests"
              className="flex-1 py-3 text-center text-sm tracking-[2px] uppercase text-[#B09090] border border-[rgba(255,255,255,0.15)] hover:border-[#D62828] hover:text-[#D62828] transition-colors"
            >
              {t('requestDetail.backToRequests')}
            </Link>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.08)] p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-[#F5E6E0] mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>{t('requestDetail.confirmDonation')}</h3>
            <div className="mb-4 space-y-2">
              <p className="text-[#B09090]"><strong className="text-[#F5E6E0]">{t('requestDetail.name')}:</strong> {dbUser?.name}</p>
              <p className="text-[#B09090]"><strong className="text-[#F5E6E0]">{t('requestDetail.email')}:</strong> {dbUser?.email}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleDonate}
                className="flex-1 bg-[#D62828] text-white py-2.5 text-sm font-semibold tracking-[2px] uppercase hover:bg-[#FF2D2D] transition-colors"
              >
                {t('requestDetail.confirm')}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 text-sm tracking-[2px] uppercase text-[#B09090] border border-[rgba(255,255,255,0.15)] hover:border-[#D62828] hover:text-[#D62828] transition-colors"
              >
                {t('requestDetail.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetail;
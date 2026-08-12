import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLanguage } from '../context/LanguageContext';

const AllRequests = () => {
  const { t, lang } = useLanguage();
  const bnFont = lang === 'bn' ? { fontFamily: "'Noto Sans Bengali', 'DM Sans', sans-serif" } : {};
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/donationRequests?status=pending`);
        setRequests(response.data.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen pt-28 pb-16 px-[60px]" style={{ background: 'linear-gradient(135deg, #0A0505 0%, #150A0A 40%, #1a0808 100%)' }}>
      <div className="container mx-auto" style={bnFont}>
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-6 h-px bg-[#D62828]"></div>
          <span className="text-xs font-semibold tracking-[3px] uppercase text-[#D62828]">{t('requests.liveFeed')}</span>
        </div>
        <h1 className="text-[#F5E6E0] mb-12" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 5vw, 64px)', letterSpacing: '2px' }}>
          {t('requests.title1')} <em className="not-italic text-[#B09090]" style={{ fontFamily: lang === 'bn' ? "'Noto Sans Bengali', sans-serif" : "'DM Serif Display', serif" }}>{t('requests.title2')}</em>
        </h1>
        
        {requests.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {requests.map((request) => (
              <Link key={request._id} to={`/blood-donation-requests/${request._id}`} className="block">
                <div className={`bg-[#1E0E0E] border p-7 hover:translate-y-[-3px] transition-all h-full ${request.urgent ? 'border-[#D62828]' : 'border-[rgba(255,255,255,0.05)] hover:border-[rgba(214,40,40,0.4)]'}`}>
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-3">
                      <div className="text-[#D62828]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '44px', lineHeight: 1 }}>{request.bloodGroup}</div>
                      {request.urgent && (
                        <span className="px-2.5 py-1 text-[10px] font-bold tracking-[2px] uppercase bg-[#D62828] text-white rounded-full animate-pulse">🚨 {t('requests.urgent')}</span>
                      )}
                    </div>
                    <span className="px-3 py-1 text-[10px] font-semibold tracking-[2px] uppercase bg-[rgba(214,40,40,0.15)] text-[#D62828] border border-[rgba(214,40,40,0.3)] rounded-full">{request.status}</span>
                  </div>
                  <div className="text-base font-semibold text-[#F5E6E0] mb-1">{t('requests.for')} {request.recipientName}</div>
                  <div className="text-sm text-[#B09090] mb-2"><strong>{t('requests.hospital')}</strong> {request.hospitalName}</div>
                  <div className="text-sm text-[#B09090] mb-2"><strong>{t('requests.location')}</strong> {request.district}, {request.upazila}</div>
                  <div className="text-xs text-[#B09090] mb-4">
                    <strong>{t('requests.date')}</strong> {new Date(request.donationDate).toLocaleDateString()} {request.donationTime}
                  </div>
                  <div className="text-xs text-[#B09090] mb-5">
                    <strong>{t('requests.requestedBy')}</strong> {request.requesterName}
                  </div>
                  <div className="bg-[#D62828] text-white py-2.5 text-center text-sm font-semibold tracking-[2px] uppercase hover:bg-[#FF2D2D] transition-colors">
                    {t('requests.viewDetails')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-[#B09090]">{t('requests.noPending')}</p>
            <p className="text-sm text-[#B09090]/60 mt-2">{t('requests.checkBack')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRequests;
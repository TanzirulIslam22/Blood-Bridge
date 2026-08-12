import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLanguage } from '../context/LanguageContext';

const Certificate = () => {
  const { certificateId } = useParams();
  const { t, lang } = useLanguage();
  const bnFont = lang === 'bn' ? { fontFamily: "'Noto Sans Bengali', 'DM Sans', sans-serif" } : {};
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/donationRecords/${certificateId}`);
        setRecord(response.data);
      } catch (err) {
        setError(err.response?.data?.message || t('certificate.notFound'));
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [certificateId]);

  const verifyUrl = `${window.location.origin}/certificate/${certificateId}`;

  if (loading) {
    return (
      <div className="py-20 px-6" style={{ background: '#0A0505', minHeight: '100vh' }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="py-32 px-6 text-center" style={{ background: 'linear-gradient(135deg, #0A0505 0%, #150A0A 40%, #1a0808 100%)', minHeight: '100vh' }}>
        <h1 className="text-4xl font-bold text-[#D62828]" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}>{t('certificate.notFound')}</h1>
        <p className="text-[#B09090] mt-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="py-20 px-6 md:px-12" style={{ background: 'linear-gradient(135deg, #0A0505 0%, #150A0A 40%, #1a0808 100%)', minHeight: '100vh' }}>
      <div className="max-w-3xl mx-auto" style={bnFont}>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="w-10 h-10 bg-[#D62828] flex items-center justify-center text-white text-lg font-bold" style={{ clipPath: 'polygon(50% 0%, 85% 35%, 100% 55%, 85% 75%, 50% 100%, 15% 75%, 0% 55%, 15% 35%)' }}>
              B
            </div>
            <span className="text-3xl font-bold tracking-[3px] text-[#F5E6E0]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Blood<span className="text-[#D62828]">Bridge</span>
            </span>
          </div>
          <h1 className="text-4xl font-bold text-[#F5E6E0]" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}>
            {t('certificate.title1')} <span className="text-[#D62828]">{t('certificate.title2')}</span>
          </h1>
        </div>

        <div className="bg-[#1E0E0E] border-2 border-[#D62828] p-8 md:p-10 relative" style={{ boxShadow: '0 0 40px rgba(214, 40, 40, 0.15)' }}>
          <div className="absolute inset-2 border border-[rgba(214,40,40,0.3)] pointer-events-none"></div>

          <p className="text-center text-sm text-[#B09090] uppercase tracking-[3px] mb-8">{t('certificate.certifiesThat')}</p>
          <p className="text-center text-3xl font-semibold text-[#F5E6E0] mb-6" style={{ fontFamily: lang === 'bn' ? "'Noto Sans Bengali', sans-serif" : "'DM Serif Display', serif" }}>
            {record.donorName}
          </p>
          <p className="text-center text-[#B09090] text-sm mb-8">
            {t('certificate.generouslyDonated')} <span className="text-[#F5E6E0] font-semibold">{record.recipientName}</span>
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8 text-center">
            <div className="p-3 bg-[#150A0A] border border-[rgba(255,255,255,0.06)]">
              <p className="text-xs uppercase tracking-[2px] text-[#B09090] mb-1">{t('certificate.bloodGroup')}</p>
              <p className="text-2xl font-bold text-[#D62828]">{record.bloodGroup}</p>
            </div>
            <div className="p-3 bg-[#150A0A] border border-[rgba(255,255,255,0.06)]">
              <p className="text-xs uppercase tracking-[2px] text-[#B09090] mb-1">{t('certificate.hospital')}</p>
              <p className="text-sm font-semibold text-[#F5E6E0]">{record.hospitalName}</p>
            </div>
            <div className="p-3 bg-[#150A0A] border border-[rgba(255,255,255,0.06)]">
              <p className="text-xs uppercase tracking-[2px] text-[#B09090] mb-1">{t('certificate.date')}</p>
              <p className="text-sm font-semibold text-[#F5E6E0]">{new Date(record.donationDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="p-3 bg-[#150A0A] border border-[rgba(255,255,255,0.06)]">
              <p className="text-xs uppercase tracking-[2px] text-[#B09090] mb-1">{t('certificate.type')}</p>
              <p className="text-sm font-semibold text-[#F5E6E0]">{record.wasUrgent ? `${t('certificate.emergency')} 🚨` : t('certificate.regular')}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 mt-8">
            <QRCodeCanvas value={verifyUrl} size={140} bgColor="#1E0E0E" fgColor="#F5E6E0" />
            <div className="text-center">
              <p className="text-xs uppercase tracking-[2px] text-[#B09090]">{t('certificate.certificateId')}</p>
              <p className="text-sm font-mono text-[#D62828] mt-1">{record.certificateId}</p>
              <p className="text-xs text-[#B09090] mt-2">{t('certificate.scanToVerify')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;

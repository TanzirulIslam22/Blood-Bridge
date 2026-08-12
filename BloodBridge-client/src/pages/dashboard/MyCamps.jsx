import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import axios from '../../hooks/useAxios';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import Swal from 'sweetalert2';

const STATUS_STYLES = {
  upcoming: 'bg-[rgba(234,179,8,0.15)] text-yellow-400',
  ongoing: 'bg-[rgba(34,197,94,0.15)] text-green-400',
  completed: 'bg-[rgba(100,116,139,0.15)] text-gray-400',
  canceled: 'bg-[rgba(239,68,68,0.15)] text-red-400'
};

const MyCamps = () => {
  const { dbUser } = useAuth();
  const { t, lang } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('organized');
  const [registrations, setRegistrations] = useState({});

  useEffect(() => {
    axios.get('/api/donationCamps/mine')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const loadRegistrations = async (campId) => {
    try {
      const res = await axios.get(`/api/donationCamps/${campId}/registrations`);
      setRegistrations(prev => ({ ...prev, [campId]: res.data }));
    } catch (error) {
      toast.error(t('camps.failedToLoadRegistrations'));
    }
  };

  const handleDeleteCamp = (campId) => {
    Swal.fire({
      title: t('camps.deleteCampTitle'),
      text: t('camps.deleteCampText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('camps.delete'),
      cancelButtonText: t('camps.cancel')
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/donationCamps/${campId}`);
          setData(prev => ({ ...prev, camps: prev.camps.filter(c => c._id !== campId) }));
          toast.success(t('camps.campDeleted'));
        } catch (error) {
          toast.error(t('camps.failedToDelete'));
        }
      }
    });
  };

  const handleAttend = async (campId, registrationId) => {
    try {
      await axios.put(`/api/donationCamps/${campId}/registrations/${registrationId}/attend`, {});
      loadRegistrations(campId);
      toast.success(t('camps.attendanceUpdated'));
    } catch (error) {
      toast.error(t('camps.failedToUpdate'));
    }
  };

  const handleCancelRegistration = async (campId, registrationId) => {
    try {
      await axios.put(`/api/donationCamps/${campId}/registrations/${registrationId}/cancel`, {});
      loadRegistrations(campId);
      toast.success(t('camps.registrationCanceled'));
    } catch (error) {
      toast.error(t('camps.failedToCancel'));
    }
  };

  const handleUnregister = async (registrationId) => {
    try {
      await axios.delete(`/api/donationCamps/${registrationId}`);
      setData(prev => ({ ...prev, registrations: prev.registrations.filter(r => r._id !== registrationId) }));
      toast.success(t('camps.registrationRemoved'));
    } catch (error) {
      toast.error(t('camps.failedToRemove'));
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[#F5E6E0] text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>
          {t('camps.myCamps')}
        </h1>
        {(dbUser?.role === 'admin' || dbUser?.role === 'volunteer') && (
          <Link
            to="/dashboard/create-camp"
            className="bg-[#D62828] text-white px-6 py-2.5 text-sm font-semibold tracking-[1.5px] uppercase hover:bg-[#FF2D2D] transition-colors"
            style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
          >
            {t('camps.createNewCamp')}
          </Link>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('organized')}
          className={`px-5 py-2.5 text-sm font-semibold tracking-[1px] uppercase transition-colors ${activeTab === 'organized' ? 'bg-[#D62828] text-white' : 'text-[#B09090] hover:text-[#F5E6E0] border border-[rgba(255,255,255,0.08)]'}`}
        >
          {t('camps.organizedTab')} ({data?.camps?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('registered')}
          className={`px-5 py-2.5 text-sm font-semibold tracking-[1px] uppercase transition-colors ${activeTab === 'registered' ? 'bg-[#D62828] text-white' : 'text-[#B09090] hover:text-[#F5E6E0] border border-[rgba(255,255,255,0.08)]'}`}
        >
          {t('camps.myRegistrationsTab')} ({data?.registrations?.length || 0})
        </button>
      </div>

      {activeTab === 'organized' && (
        <div className="space-y-4">
          {(data?.camps || []).length === 0 && (
            <div className="p-10 text-center bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)]">
              <p className="text-[#B09090]">{t('camps.noCampsOrganized')}</p>
            </div>
          )}
          {data?.camps?.map(camp => (
            <div key={camp._id} className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)]">
              <div className="p-5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[#F5E6E0]">{camp.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${STATUS_STYLES[camp.status] || ''}`}>{t(`camps.${camp.status}`)}</span>
                  </div>
                  <p className="text-sm text-[#B09090] mt-1">{new Date(camp.campDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {camp.district}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => loadRegistrations(camp._id)}
                    className="text-xs text-[#D62828] hover:underline"
                  >
                    {t('camps.viewRegistrations')}
                  </button>
                  <button
                    onClick={() => handleDeleteCamp(camp._id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                  {t('camps.delete')}
                </button>
              </div>
            </div>

              {registrations[camp._id] && (
                <div className="border-t border-[rgba(255,255,255,0.05)]">
                  {registrations[camp._id].length === 0 ? (
                    <p className="p-4 text-sm text-[#B09090]">{t('camps.noRegistrations')}</p>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-[#150A0A]">
                        <tr>
                          <th className="px-5 py-3 text-left text-xs font-medium text-[#B09090] uppercase">{t('camps.donor')}</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-[#B09090] uppercase">{t('camps.blood')}</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-[#B09090] uppercase">{t('camps.status')}</th>
                          <th className="px-5 py-3 text-right text-xs font-medium text-[#B09090] uppercase">{t('camps.actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                        {registrations[camp._id].map(reg => (
                          <tr key={reg._id}>
                            <td className="px-5 py-3 text-sm text-[#F5E6E0]">{reg.donorName}</td>
                            <td className="px-5 py-3 text-sm text-[#D62828] font-semibold">{reg.bloodGroup || '—'}</td>
                            <td className="px-5 py-3 text-sm">
                              <span className={`px-2 py-0.5 rounded text-xs ${reg.attended ? 'bg-[rgba(34,197,94,0.15)] text-green-400' : reg.status === 'canceled' ? 'bg-[rgba(239,68,68,0.15)] text-red-400' : 'bg-[rgba(234,179,8,0.15)] text-yellow-400'}`}>
                                {reg.attended ? t('camps.attended') : reg.status === 'canceled' ? t('camps.canceled') : t('camps.registered')}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-right">
                              {reg.status === 'confirmed' && (
                                <div className="flex gap-3 justify-end">
                                  <button onClick={() => handleAttend(camp._id, reg._id)} className="text-xs text-green-500 hover:underline">
                                    {reg.attended ? t('camps.undoAttend') : t('camps.markAttend')}
                                  </button>
                                  <button onClick={() => handleCancelRegistration(camp._id, reg._id)} className="text-xs text-red-500 hover:underline">
                                    {t('camps.cancel')}
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'registered' && (
        <div className="space-y-3">
          {(data?.registrations || []).length === 0 && (
            <div className="p-10 text-center bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)]">
              <p className="text-[#B09090]">{t('camps.noCampRegistrations')}</p>
            </div>
          )}
          {data?.registrations?.map(reg => (
            <div key={reg._id} className="flex items-center justify-between p-5 bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)]">
              <div>
                <h3 className="font-semibold text-[#F5E6E0]">{reg.campId?.title || t('camps.camp')}</h3>
                <p className="text-sm text-[#B09090] mt-1">
                  {reg.campId ? new Date(reg.campId.campDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                  {reg.campId?.district ? ` · ${reg.campId.district}` : ''}
                </p>
                <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-semibold ${reg.status === 'confirmed' ? 'bg-[rgba(34,197,94,0.15)] text-green-400' : 'bg-[rgba(239,68,68,0.15)] text-red-400'}`}>
                  {reg.status === 'confirmed' ? (reg.attended ? `${t('camps.attended')} ✓` : t('camps.registered')) : t('camps.canceled')}
                </span>
              </div>
              {reg.status === 'confirmed' && (
                <button
                  onClick={() => handleUnregister(reg._id)}
                  className="text-xs text-red-500 hover:underline shrink-0"
                >
                  {t('camps.unregister')}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCamps;

import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import axios from '../../hooks/useAxios';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import Swal from 'sweetalert2';

const AllRequestsAdmin = () => {
  const { t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, [page, statusFilter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/donationRequests?page=${page}&limit=10&status=${statusFilter}`
      );
      setRequests(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: t('dashboard.deleteTitle'),
      text: t('dashboard.deleteText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('dashboard.delete'),
      cancelButtonText: t('dashboard.cancel')
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/donationRequests/${id}`);
          setRequests(requests.filter(r => r._id !== id));
          toast.success(t('dashboard.requestDeleted'));
        } catch (error) {
          toast.error(t('dashboard.deleteRequestFailed'));
        }
      }
    });
  };

  return (
<div>
      <h1 className="text-2xl font-bold mb-6 text-[#F5E6E0]">{t('dashboard.allRequestsTitle')}</h1>

      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] rounded-lg focus:outline-none focus:border-[#D62828]"
        >
          <option value="all">{t('dashboard.allStatus')}</option>
          <option value="pending">{t('dashboard.pending')}</option>
          <option value="inprogress">{t('dashboard.inProgress')}</option>
          <option value="done">{t('dashboard.done')}</option>
          <option value="canceled">{t('dashboard.canceled')}</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#150A0A]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">{t('dashboard.recipient')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">{t('dashboard.bloodGroup')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">{t('dashboard.location')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">{t('dashboard.date')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">{t('dashboard.status')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">{t('dashboard.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td className="px-6 py-4 text-[#F5E6E0]">{request.recipientName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="bg-[rgba(214,40,40,0.15)] text-[#D62828] px-2 py-1 rounded text-sm">{request.bloodGroup}</span>
                        {request.urgent && (
                          <span className="text-[10px] font-bold uppercase bg-[#D62828] text-white px-1.5 py-0.5 rounded animate-pulse">{t('requests.urgent')}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#F5E6E0]">{request.district}, {request.upazila}</td>
                    <td className="px-6 py-4 text-[#F5E6E0]">{new Date(request.donationDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        request.status === 'pending' ? 'bg-[rgba(234,179,8,0.15)] text-yellow-400' :
                        request.status === 'inprogress' ? 'bg-[rgba(59,130,246,0.15)] text-blue-400' :
                        request.status === 'done' ? 'bg-[rgba(34,197,94,0.15)] text-green-400' :
                        'bg-[rgba(239,68,68,0.15)] text-red-400'
                      }`}>
                        {request.status === 'pending' ? t('dashboard.pending') : request.status === 'inprogress' ? t('dashboard.inProgress') : request.status === 'done' ? t('dashboard.done') : t('dashboard.canceled')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(request._id)}
                        className="text-red-400 hover:underline"
                      >
                        {t('dashboard.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] rounded disabled:opacity-50 hover:border-[#D62828]"
            >
              {t('dashboard.previous')}
            </button>
            <span className="px-4 py-2 text-[#B09090]">{t('dashboard.pageOf', { page, total: totalPages })}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] rounded disabled:opacity-50 hover:border-[#D62828]"
            >
              {t('dashboard.next')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllRequestsAdmin;

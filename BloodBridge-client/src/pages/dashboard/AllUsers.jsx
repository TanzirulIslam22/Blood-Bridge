import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import axios from '../../hooks/useAxios';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import Swal from 'sweetalert2';

const AllUsers = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [page, statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/users?page=${page}&limit=10&status=${statusFilter}`
      );
      setUsers(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async (userId, currentStatus) => {
    try {
      await axios.put(`/api/users/${userId}/block`);
      setUsers(users.map(u => u._id === userId ? { ...u, status: currentStatus === 'active' ? 'blocked' : 'active' } : u));
      toast.success(currentStatus === 'active' ? t('dashboard.userBlocked') : t('dashboard.userUnblocked'));
    } catch (error) {
      toast.error(t('dashboard.updateStatusFailed'));
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/api/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success(t('dashboard.roleUpdated'));
    } catch (error) {
      toast.error(t('dashboard.roleUpdateFailed'));
    }
  };

  const handleDelete = async (userId) => {
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
          await axios.delete(`/api/users/${userId}`);
          setUsers(users.filter(u => u._id !== userId));
          toast.success(t('dashboard.userDeleted'));
        } catch (error) {
          toast.error(t('dashboard.deleteUserFailed'));
        }
      }
    });
  };

  return (
<div>
      <h1 className="text-2xl font-bold mb-6 text-[#F5E6E0]">{t('dashboard.allUsersTitle')}</h1>

      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] rounded-lg focus:outline-none focus:border-[#D62828]"
        >
          <option value="all">{t('dashboard.allStatus')}</option>
          <option value="active">{t('dashboard.active')}</option>
          <option value="blocked">{t('dashboard.blocked')}</option>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">{t('dashboard.user')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">{t('dashboard.email')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">{t('dashboard.roleHeader')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">{t('dashboard.status')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">{t('dashboard.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || 'https://via.placeholder.com/40'}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="font-medium text-[#F5E6E0]">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#F5E6E0]">{user.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="px-2 py-1 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] rounded text-sm focus:outline-none focus:border-[#D62828]"
                      >
                        <option value="donor">{t('dashboard.roleDonor')}</option>
                        <option value="volunteer">{t('dashboard.roleVolunteer')}</option>
                        <option value="admin">{t('dashboard.roleAdmin')}</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-sm ${user.status === 'active' ? 'bg-[rgba(34,197,94,0.15)] text-green-400' : 'bg-[rgba(239,68,68,0.15)] text-red-400'}`}>
                        {user.status === 'active' ? t('dashboard.active') : t('dashboard.blocked')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleBlockToggle(user._id, user.status)}
                          className="text-blue-400 hover:underline"
                        >
                          {user.status === 'active' ? t('dashboard.block') : t('dashboard.unblock')}
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-400 hover:underline"
                        >
                          {t('dashboard.delete')}
                        </button>
                      </div>
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

export default AllUsers;

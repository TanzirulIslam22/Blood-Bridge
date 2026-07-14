import { useEffect, useState } from 'react';
import axios from '../../hooks/useAxios';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import Swal from 'sweetalert2';

const AllUsers = () => {
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
      toast.success(`User ${currentStatus === 'active' ? 'blocked' : 'unblocked'} successfully`);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/api/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success('Role updated successfully');
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleDelete = async (userId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/users/${userId}`);
          setUsers(users.filter(u => u._id !== userId));
          toast.success('User deleted successfully');
        } catch (error) {
          toast.error('Failed to delete user');
        }
      }
    });
  };

  return (
<div>
      <h1 className="text-2xl font-bold mb-6 text-[#F5E6E0]">All Users</h1>

      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] rounded-lg focus:outline-none focus:border-[#D62828]"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">Actions</th>
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
                        <option value="donor">Donor</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-sm ${user.status === 'active' ? 'bg-[rgba(34,197,94,0.15)] text-green-400' : 'bg-[rgba(239,68,68,0.15)] text-red-400'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleBlockToggle(user._id, user.status)}
                          className="text-blue-400 hover:underline"
                        >
                          {user.status === 'active' ? 'Block' : 'Unblock'}
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-400 hover:underline"
                        >
                          Delete
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
              Previous
            </button>
            <span className="px-4 py-2 text-[#B09090]">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] rounded disabled:opacity-50 hover:border-[#D62828]"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllUsers;

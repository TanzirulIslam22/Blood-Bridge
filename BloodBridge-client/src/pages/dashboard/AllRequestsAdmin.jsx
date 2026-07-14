import { useEffect, useState } from 'react';
import axios from '../../hooks/useAxios';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import Swal from 'sweetalert2';

const AllRequestsAdmin = () => {
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
      title: 'Are you sure?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/donationRequests/${id}`);
          setRequests(requests.filter(r => r._id !== id));
          toast.success('Request deleted successfully');
        } catch (error) {
          toast.error('Failed to delete request');
        }
      }
    });
  };

  return (
<div>
      <h1 className="text-2xl font-bold mb-6 text-[#F5E6E0]">All Blood Donation Requests</h1>

      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] rounded-lg focus:outline-none focus:border-[#D62828]"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">Recipient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">Blood Group</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#B09090] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td className="px-6 py-4 text-[#F5E6E0]">{request.recipientName}</td>
                    <td className="px-6 py-4">
                      <span className="bg-[rgba(214,40,40,0.15)] text-[#D62828] px-2 py-1 rounded text-sm">{request.bloodGroup}</span>
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
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(request._id)}
                        className="text-red-400 hover:underline"
                      >
                        Delete
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

export default AllRequestsAdmin;

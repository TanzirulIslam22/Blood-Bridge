import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import Swal from 'sweetalert2';

const MyRequests = () => {
  const { dbUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/donationRequests?email=${dbUser?.email}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(response.data.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };
    if (dbUser?.email) {
      fetchRequests();
    }
  }, [dbUser?.email]);

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
          const token = localStorage.getItem('token');
          await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/donationRequests/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setRequests(requests.filter(r => r._id !== id));
          toast.success('Request deleted successfully');
        } catch (error) {
          toast.error('Failed to delete request');
        }
      }
    });
  };

  const handleComplete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/donationRequests/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(requests.map(r => r._id === id ? { ...r, status: 'done' } : r));
      toast.success('Request marked as completed');
    } catch (error) {
      toast.error('Failed to complete request');
    }
  };

  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/donationRequests/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(requests.map(r => r._id === id ? { ...r, status: 'canceled' } : r));
      toast.success('Request canceled');
    } catch (error) {
      toast.error('Failed to cancel request');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[#F5E6E0] text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>
          My Requests
        </h1>
        <Link 
          to="/dashboard/create-donation-request"
          className="bg-[#D62828] text-white px-6 py-2.5 text-sm font-semibold tracking-[1.5px] uppercase hover:bg-[#FF2D2D] transition-colors"
          style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
        >
          Create New Request
        </Link>
      </div>

      <div className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] overflow-hidden">
        {requests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: '#150A0A', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium tracking-[1.5px] uppercase text-[#B09090]">Recipient</th>
                  <th className="px-6 py-4 text-left text-xs font-medium tracking-[1.5px] uppercase text-[#B09090]">Blood Group</th>
                  <th className="px-6 py-4 text-left text-xs font-medium tracking-[1.5px] uppercase text-[#B09090]">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-medium tracking-[1.5px] uppercase text-[#B09090]">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium tracking-[1.5px] uppercase text-[#B09090]">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium tracking-[1.5px] uppercase text-[#B09090]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td className="px-6 py-4 text-[#F5E6E0]">{request.recipientName}</td>
                    <td className="px-6 py-4">
                      <span className="bg-[rgba(214,40,40,0.15)] text-[#D62828] px-2 py-1 rounded text-sm font-semibold">{request.bloodGroup}</span>
                    </td>
                    <td className="px-6 py-4 text-[#B09090]">{request.district}, {request.upazila}</td>
                    <td className="px-6 py-4 text-[#B09090]">{new Date(request.donationDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold tracking-[1px] uppercase ${
                        request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                        request.status === 'inprogress' ? 'bg-blue-500/20 text-blue-500' :
                        request.status === 'done' ? 'bg-green-500/20 text-green-500' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        {request.status === 'pending' && (
                          <>
                            <Link 
                              to={`/dashboard/edit-donation-request/${request._id}`}
                              className="text-[#D62828] hover:underline text-sm"
                            >
                              Edit
                            </Link>
                            <button 
                              onClick={() => handleDelete(request._id)}
                              className="text-red-500 hover:underline text-sm"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {request.status === 'inprogress' && (
                          <>
                            <button 
                              onClick={() => handleComplete(request._id)}
                              className="text-green-500 hover:underline text-sm"
                            >
                              Done
                            </button>
                            <button 
                              onClick={() => handleCancel(request._id)}
                              className="text-red-500 hover:underline text-sm"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#B09090]">No requests yet</p>
            <Link 
              to="/dashboard/create-donation-request"
              className="text-[#D62828] hover:underline mt-2 inline-block text-sm"
            >
              Create your first request
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
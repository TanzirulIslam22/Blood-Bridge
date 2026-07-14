import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import Swal from 'sweetalert2';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, dbUser } = useAuth();
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
      toast.success('You have accepted this donation request!');
      setShowModal(false);
      navigate('/dashboard/my-donation-requests');
    } catch (error) {
      toast.error('Failed to accept donation');
    }
  };

  const handleLoginPrompt = () => {
    Swal.fire({
      title: 'Login Required',
      text: 'Please login to donate blood',
      icon: 'warning',
      confirmButtonText: 'Login'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/login', { state: { from: { pathname: `/blood-donation-requests/${id}` } } });
      }
    });
  };

  if (loading) return <LoadingSpinner />;
  if (!request) return <div className="text-center py-12 text-\[\#B09090\]">Request not found</div>;

  return (
    <div className="py-20 px-15">
      <div className="max-w-2xl mx-auto">
        <div className="bg-\[\#1E0E0E\] border border-[rgba(255,255,255,0.05)] p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="text-\[\#D62828\]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '44px', lineHeight: 1 }}>
              {request.bloodGroup}
            </div>
            <span className="px-3 py-1 text-xs font-semibold tracking-[2px] uppercase bg-[rgba(214,40,40,0.15)] text-[#D62828] border border-[rgba(214,40,40,0.3)] rounded-full">
              {request.status}
            </span>
          </div>

          <h1 className="text-2xl font-semibold text-\[\#F5E6E0\] mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>
            Blood Request for {request.recipientName}
          </h1>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs tracking-[1.5px] uppercase text-[#B09090] mb-1">Hospital</p>
                <p className="text-[#F5E6E0] font-medium">{request.hospitalName}</p>
              </div>
              <div>
                <p className="text-xs tracking-[1.5px] uppercase text-[#B09090] mb-1">Full Address</p>
                <p className="text-[#F5E6E0] font-medium">{request.fullAddress}</p>
              </div>
              <div>
                <p className="text-xs tracking-[1.5px] uppercase text-[#B09090] mb-1">District</p>
                <p className="text-[#F5E6E0] font-medium">{request.district}</p>
              </div>
              <div>
                <p className="text-xs tracking-[1.5px] uppercase text-[#B09090] mb-1">Upazila</p>
                <p className="text-[#F5E6E0] font-medium">{request.upazila}</p>
              </div>
              <div>
                <p className="text-xs tracking-[1.5px] uppercase text-[#B09090] mb-1">Donation Date</p>
                <p className="text-[#F5E6E0] font-medium">{new Date(request.donationDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs tracking-[1.5px] uppercase text-[#B09090] mb-1">Donation Time</p>
                <p className="text-[#F5E6E0] font-medium">{request.donationTime}</p>
              </div>
              <div>
                <p className="text-xs tracking-[1.5px] uppercase text-[#B09090] mb-1">Requested By</p>
                <p className="text-[#F5E6E0] font-medium">{request.requesterName}</p>
              </div>
              <div>
                <p className="text-xs tracking-[1.5px] uppercase text-[#B09090] mb-1">Requester Email</p>
                <p className="text-[#F5E6E0] font-medium">{request.requesterEmail}</p>
              </div>
            </div>

            {request.requestMessage && (
              <div className="mt-4">
                <p className="text-xs tracking-[1.5px] uppercase text-[#B09090] mb-2">Message</p>
                <p className="p-3 bg-[#150A0A] rounded text-[#F5E6E0]">{request.requestMessage}</p>
              </div>
            )}

            {request.donorInfo && request.donorInfo.name && (
              <div className="mt-4 p-4 bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] rounded">
                <p className="text-green-400 font-semibold text-sm tracking-[2px] uppercase mb-2">Donor Assigned</p>
                <p className="text-[#F5E6E0]">Name: {request.donorInfo.name}</p>
                <p className="text-[#B09090]">Email: {request.donorInfo.email}</p>
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-8">
            {request.status === 'pending' && (
              user ? (
                <button
                  onClick={() => setShowModal(true)}
                  className="flex-1 bg-[#D62828] text-white py-3 text-sm font-semibold tracking-[2px] uppercase hover:bg-[#FF2D2D] transition-colors"
                  style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
                >
                  Donate Blood
                </button>
              ) : (
                <button
                  onClick={handleLoginPrompt}
                  className="flex-1 bg-[#D62828] text-white py-3 text-sm font-semibold tracking-[2px] uppercase hover:bg-[#FF2D2D] transition-colors"
                  style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
                >
                  Login to Donate
                </button>
              )
            )}
            <Link
              to="/blood-donation-requests"
              className="flex-1 py-3 text-center text-sm tracking-[2px] uppercase text-[#B09090] border border-[rgba(255,255,255,0.15)] hover:border-[#D62828] hover:text-[#D62828] transition-colors"
            >
              Back to Requests
            </Link>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.08)] p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-[#F5E6E0] mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>Confirm Donation</h3>
            <div className="mb-4 space-y-2">
              <p className="text-[#B09090]"><strong className="text-[#F5E6E0]">Name:</strong> {dbUser?.name}</p>
              <p className="text-[#B09090]"><strong className="text-[#F5E6E0]">Email:</strong> {dbUser?.email}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleDonate}
                className="flex-1 bg-[#D62828] text-white py-2.5 text-sm font-semibold tracking-[2px] uppercase hover:bg-[#FF2D2D] transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 text-sm tracking-[2px] uppercase text-[#B09090] border border-[rgba(255,255,255,0.15)] hover:border-[#D62828] hover:text-[#D62828] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetail;
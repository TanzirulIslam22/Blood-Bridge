import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../hooks/useAxios';

const DashboardHome = () => {
  const { dbUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    if (dbUser?.role === 'admin') {
      axios.get('/api/stats')
        .then(res => setStats(res.data))
        .catch(err => console.error(err));
    }

    if (dbUser?.role === 'donor') {
      axios.get(`/api/donationRequests?email=${dbUser.email}`)
        .then(res => setMyRequests(res.data.data))
        .catch(err => console.error(err));
    }
  }, [dbUser]);

  return (
    <div>
      <div className="p-6 mb-6 rounded-lg bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)]">
        <h1 className="mb-2 text-2xl font-bold text-[#F5E6E0]">Welcome, {dbUser?.name}!</h1>
        <p className="text-[#B09090]">Role: <span className="font-semibold capitalize">{dbUser?.role}</span></p>
      </div>

      {dbUser?.role === 'admin' && stats && (
        <div className="grid gap-4 mb-6 md:grid-cols-4">
          <div className="p-6 bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] rounded-lg">
            <p className="text-[#B09090]">Total Donors</p>
            <p className="text-3xl font-bold text-[#D62828]">{stats.totalDonors}</p>
          </div>
          <div className="p-6 bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] rounded-lg">
            <p className="text-[#B09090]">Total Volunteers</p>
            <p className="text-3xl font-bold text-blue-400">{stats.totalVolunteers}</p>
          </div>
          <div className="p-6 bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] rounded-lg">
            <p className="text-[#B09090]">Total Requests</p>
            <p className="text-3xl font-bold text-green-400">{stats.totalRequests}</p>
          </div>
          <div className="p-6 bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] rounded-lg">
            <p className="text-[#B09090]">Completed</p>
            <p className="text-3xl font-bold text-purple-400">{stats.completedRequests}</p>
          </div>
        </div>
      )}

      {dbUser?.role === 'donor' && (
        <div className="p-6 rounded-lg bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)]">
          <h2 className="mb-4 text-xl font-bold text-[#F5E6E0]">My Recent Requests</h2>
          {myRequests.length > 0 ? (
            <div className="space-y-3">
              {myRequests.slice(0, 5).map(req => (
                <div key={req._id} className="flex items-center justify-between p-3 bg-[#150A0A] rounded">
                  <div>
                    <p className="font-semibold text-[#F5E6E0]">For: {req.recipientName}</p>
                    <p className="text-sm text-[#B09090]">{req.bloodGroup} | {req.district}</p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm ${req.status === 'pending' ? 'bg-[rgba(234,179,8,0.15)] text-yellow-400' : req.status === 'inprogress' ? 'bg-[rgba(59,130,246,0.15)] text-blue-400' : req.status === 'done' ? 'bg-[rgba(34,197,94,0.15)] text-green-400' : 'bg-[rgba(239,68,68,0.15)] text-red-400'}`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#B09090]">No requests yet</p>
          )}
        </div>
      )}

      {dbUser?.role === 'volunteer' && (
        <div className="p-6 rounded-lg bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)]">
          <h2 className="mb-4 text-xl font-bold text-[#F5E6E0]">Volunteer Dashboard</h2>
          <p className="text-[#B09090]">Thank you for being a volunteer! You can help manage content and review donation requests.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;

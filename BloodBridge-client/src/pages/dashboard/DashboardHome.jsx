import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const DashboardHome = () => {
  const { dbUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    if (dbUser?.role === 'admin') {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stats`)
        .then(res => setStats(res.data))
        .catch(err => console.error(err));
    }

    if (dbUser?.role === 'donor') {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/donationRequests?email=${dbUser.email}`)
        .then(res => setMyRequests(res.data.data))
        .catch(err => console.error(err));
    }
  }, [dbUser]);

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">Welcome, {dbUser?.name}!</h1>
        <p className="text-gray-600">Role: <span className="capitalize font-semibold">{dbUser?.role}</span></p>
      </div>

      {dbUser?.role === 'admin' && stats && (
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500">Total Donors</p>
            <p className="text-3xl font-bold text-red-600">{stats.totalDonors}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500">Total Volunteers</p>
            <p className="text-3xl font-bold text-blue-600">{stats.totalVolunteers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500">Total Requests</p>
            <p className="text-3xl font-bold text-green-600">{stats.totalRequests}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500">Completed</p>
            <p className="text-3xl font-bold text-purple-600">{stats.completedRequests}</p>
          </div>
        </div>
      )}

      {dbUser?.role === 'donor' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">My Recent Requests</h2>
          {myRequests.length > 0 ? (
            <div className="space-y-3">
              {myRequests.slice(0, 5).map(req => (
                <div key={req._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-semibold">For: {req.recipientName}</p>
                    <p className="text-sm text-gray-500">{req.bloodGroup} | {req.district}</p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : req.status === 'inprogress' ? 'bg-blue-100 text-blue-700' : req.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No requests yet</p>
          )}
        </div>
      )}

      {dbUser?.role === 'volunteer' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Volunteer Dashboard</h2>
          <p className="text-gray-600">Thank you for being a volunteer! You can help manage content and review donation requests.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;

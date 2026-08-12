import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import axios from '../../hooks/useAxios';

const DashboardHome = () => {
  const { dbUser } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [topDonors, setTopDonors] = useState([]);
  const myLeaderData = topDonors.find(d => d.email === dbUser?.email) || {};

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

      axios.get('/api/users/leaderboard?limit=50')
        .then(res => {
          setTopDonors(res.data);
          const rank = res.data.findIndex(d => d.email === dbUser.email);
          setMyRank(rank >= 0 ? rank + 1 : null);
        })
        .catch(err => console.error(err));
    }
  }, [dbUser]);

  return (
    <div>
      <div className="p-6 mb-6 rounded-lg bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)]">
        <h1 className="mb-2 text-2xl font-bold text-[#F5E6E0]">{t('dashboard.welcome')} {dbUser?.name}!</h1>
        <p className="text-[#B09090]">{t('dashboard.role')} <span className="font-semibold capitalize">{dbUser?.role}</span></p>
      </div>

      {dbUser?.role === 'admin' && stats && (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <div className="p-6 bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] rounded-lg">
            <p className="text-[#B09090]">{t('dashboard.totalDonors')}</p>
            <p className="text-3xl font-bold text-[#D62828]">{stats.totalDonors}</p>
          </div>
          <div className="p-6 bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] rounded-lg">
            <p className="text-[#B09090]">{t('dashboard.totalVolunteers')}</p>
            <p className="text-3xl font-bold text-blue-400">{stats.totalVolunteers}</p>
          </div>
          <div className="p-6 bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] rounded-lg">
            <p className="text-[#B09090]">{t('dashboard.totalRequests')}</p>
            <p className="text-3xl font-bold text-green-400">{stats.totalRequests}</p>
          </div>
          <div className="p-6 bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] rounded-lg">
            <p className="text-[#B09090]">{t('dashboard.completed')}</p>
            <p className="text-3xl font-bold text-purple-400">{stats.completedRequests}</p>
          </div>
          <div className="p-6 bg-[#1E0E0E] border border-[#D62828] rounded-lg">
            <p className="text-[#B09090]">{t('dashboard.urgentPending')}</p>
            <p className="text-3xl font-bold text-[#D62828]">{stats.urgentRequests}</p>
          </div>
          <div className="p-6 bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] rounded-lg">
            <p className="text-[#B09090]">{t('dashboard.totalDonations')}</p>
            <p className="text-3xl font-bold text-cyan-400">{stats.totalDonations}</p>
          </div>
        </div>
      )}

      {dbUser?.role === 'donor' && (
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="p-6 bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] rounded-lg">
            <p className="text-[#B09090]">{t('dashboard.yourRank')}</p>
            {myRank ? (
              <p className="text-3xl font-bold text-[#D62828] mt-1">#{myRank}</p>
            ) : (
              <p className="text-3xl font-bold text-[#D62828] mt-1">—</p>
            )}
            <p className="text-xs text-[#B09090] mt-1">{t('dashboard.earnMoreToClimb')}</p>
          </div>
          <div className="p-6 bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] rounded-lg">
            <p className="text-[#B09090]">{t('dashboard.yourPoints')}</p>
            <p className="text-3xl font-bold text-green-400 mt-1">{myLeaderData.points || 0}</p>
            <p className="text-xs text-[#B09090] mt-1">{t('dashboard.pointsHint')}</p>
          </div>
          <div className="p-6 bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] rounded-lg">
            <p className="text-[#B09090]">{t('dashboard.donations')}</p>
            <p className="text-3xl font-bold text-blue-400 mt-1">{myLeaderData.donationCount || 0}</p>
            <p className="text-xs text-[#B09090] mt-1">{t('dashboard.badgeHint')}</p>
          </div>
        </div>
      )}

      {dbUser?.role === 'donor' && (
        <div className="p-6 rounded-lg bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#F5E6E0]">{t('dashboard.topDonors')}</h2>
            <Link to="/dashboard/leaderboard" className="text-sm text-[#D62828] hover:text-[#FF2D2D]">{t('dashboard.viewFullLeaderboard')} →</Link>
          </div>
          <div className="space-y-2">
            {topDonors.slice(0, 5).map((donor, i) => (
              <div key={donor._id} className={`flex items-center gap-3 p-2.5 rounded ${donor.email === dbUser.email ? 'bg-[rgba(214,40,40,0.1)] border border-[rgba(214,40,40,0.3)]' : 'bg-[#150A0A]'}`}>
                <span className="w-7 text-center font-bold text-[#B09090]">#{i + 1}</span>
                <img src={donor.avatar || 'https://via.placeholder.com/35'} alt="" className="w-8 h-8 rounded-full object-cover" />
                <span className="flex-1 text-sm text-[#F5E6E0] truncate">{donor.name}{donor.email === dbUser.email && ` ${t('dashboard.you')}`}</span>
                <span className="text-xs font-semibold text-[#B09090]">{donor.bloodGroup || '—'}</span>
                <span className="text-sm font-bold text-[#D62828]">{donor.points || 0}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {dbUser?.role === 'donor' && (
        <div className="p-6 rounded-lg bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)]">
          <h2 className="mb-4 text-xl font-bold text-[#F5E6E0]">{t('dashboard.myRecentRequests')}</h2>
          {myRequests.length > 0 ? (
            <div className="space-y-3">
              {myRequests.slice(0, 5).map(req => (
                <div key={req._id} className="flex items-center justify-between p-3 bg-[#150A0A] rounded">
                  <div>
                    <p className="font-semibold text-[#F5E6E0]">{t('dashboard.for')} {req.recipientName}</p>
                    <p className="text-sm text-[#B09090]">{req.bloodGroup} | {req.district}</p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm ${req.status === 'pending' ? 'bg-[rgba(234,179,8,0.15)] text-yellow-400' : req.status === 'inprogress' ? 'bg-[rgba(59,130,246,0.15)] text-blue-400' : req.status === 'done' ? 'bg-[rgba(34,197,94,0.15)] text-green-400' : 'bg-[rgba(239,68,68,0.15)] text-red-400'}`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#B09090]">{t('dashboard.noRequestsYet')}</p>
          )}
        </div>
      )}

      {dbUser?.role === 'volunteer' && (
        <div className="p-6 rounded-lg bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)]">
          <h2 className="mb-4 text-xl font-bold text-[#F5E6E0]">{t('dashboard.volunteerDashboard')}</h2>
          <p className="text-[#B09090]">{t('dashboard.volunteerMsg')}</p>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;

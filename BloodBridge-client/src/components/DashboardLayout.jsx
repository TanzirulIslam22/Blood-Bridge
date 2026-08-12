import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const DashboardLayout = () => {
  const { dbUser, logout } = useAuth();
  const { t, lang } = useLanguage();
  const bnFont = lang === 'bn' ? { fontFamily: "'Noto Sans Bengali', 'DM Sans', sans-serif" } : {};
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/dashboard', label: t('dashboard.menu.dashboard'), roles: ['admin', 'volunteer', 'donor'] },
    { path: '/dashboard/profile', label: t('dashboard.menu.profile'), roles: ['admin', 'volunteer', 'donor'] },
    { path: '/dashboard/leaderboard', label: t('dashboard.menu.leaderboard'), roles: ['admin', 'volunteer', 'donor'] },
    { path: '/dashboard/my-camps', label: t('dashboard.menu.myCamps'), roles: ['admin', 'volunteer', 'donor'] },
    { path: '/dashboard/create-camp', label: t('dashboard.menu.createCamp'), roles: ['admin', 'volunteer'] },
    { path: '/dashboard/create-donation-request', label: t('dashboard.menu.createRequest'), roles: ['donor'] },
    { path: '/dashboard/my-donation-requests', label: t('dashboard.menu.myRequests'), roles: ['donor'] },
    { path: '/dashboard/all-users', label: t('dashboard.menu.allUsers'), roles: ['admin'] },
    { path: '/dashboard/all-blood-donation-request', label: t('dashboard.menu.allRequests'), roles: ['admin'] },
    { path: '/dashboard/content-management', label: t('dashboard.menu.content'), roles: ['admin', 'volunteer'] },
    { path: '/dashboard/add-blog', label: t('dashboard.menu.addBlog'), roles: ['admin', 'volunteer'] }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    dbUser?.role && item.roles.includes(dbUser.role)
  );

  return (
    <div className="min-h-screen" style={{ background: '#0A0505' }}>
      <div className="md:flex">
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform`} style={{ background: '#150A0A', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="p-6">
            <Link to="/" className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 bg-[#D62828] flex items-center justify-center text-white" style={{ clipPath: 'polygon(50% 0%, 85% 35%, 100% 55%, 85% 75%, 50% 100%, 15% 75%, 0% 55%, 15% 35%)' }}>
                B
              </div>
              <span className="text-lg font-bold tracking-[3px] text-[#F5E6E0]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Blood<span className="text-[#D62828]">Bridge</span>
              </span>
            </Link>
            <nav className="space-y-1" style={bnFont}>
              {filteredMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-3 text-sm tracking-[1px] ${location.pathname === item.path ? 'bg-[rgba(214,40,40,0.15)] text-[#D62828]' : 'text-[#B09090] hover:text-[#F5E6E0] hover:bg-[rgba(255,255,255,0.04)]'}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-3 text-sm tracking-[1px] text-[#B09090] hover:text-[#F5E6E0] hover:bg-[rgba(255,255,255,0.04)]"
              >
                {t('dashboard.menu.logout')}
              </button>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-6">
          <button
            className="md:hidden mb-4 p-2 text-[#F5E6E0] text-2xl"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
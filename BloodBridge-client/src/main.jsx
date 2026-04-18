import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './components/DashboardLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AllRequests from './pages/AllRequests';
import RequestDetail from './pages/RequestDetail';
import SearchDonors from './pages/SearchDonors';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import NotFound from './pages/NotFound';

import DashboardHome from './pages/dashboard/DashboardHome';
import Profile from './pages/dashboard/Profile';
import CreateRequest from './pages/dashboard/CreateRequest';
import MyRequests from './pages/dashboard/MyRequests';
import EditRequest from './pages/dashboard/EditRequest';
import AllUsers from './pages/dashboard/AllUsers';
import AllRequestsAdmin from './pages/dashboard/AllRequestsAdmin';
import ContentManagement from './pages/dashboard/ContentManagement';
import AddBlog from './pages/dashboard/AddBlog';

import './style.css';

const noNavbarRoutes = ['/login', '/register'];

function AppContent() {
  const location = useLocation();
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <main style={{ paddingTop: showNavbar ? '72px' : '0', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blood-donation-requests" element={<AllRequests />} />
          <Route path="/blood-donation-requests/:id" element={<RequestDetail />} />
          <Route path="/search-donors" element={<SearchDonors />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="*" element={<NotFound />} />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="create-donation-request" element={<CreateRequest />} />
            <Route path="my-donation-requests" element={<MyRequests />} />
            <Route path="edit-donation-request/:id" element={<EditRequest />} />
            <Route path="all-users" element={<AllUsers />} />
            <Route path="all-blood-donation-request" element={<AllRequestsAdmin />} />
            <Route path="content-management" element={<ContentManagement />} />
            <Route path="add-blog" element={<AddBlog />} />
          </Route>
        </Routes>
      </main>
      {showNavbar && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
        <Toaster position="top-center" />
      </AuthProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
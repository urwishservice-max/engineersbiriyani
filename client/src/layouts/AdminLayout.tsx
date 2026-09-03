import React from 'react';
import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const token = localStorage.getItem('adminToken');
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200 text-center">
          <h2 className="font-serif font-bold text-xl">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 bg-gray-100 text-black rounded-md font-medium text-sm">
            <LayoutDashboard size={18} /> Orders
          </Link>
          <Link to="/admin/feedbacks" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-gray-700 hover:text-black rounded-md font-medium text-sm transition">
            <LayoutDashboard size={18} /> Feedbacks
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-md font-medium text-sm transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

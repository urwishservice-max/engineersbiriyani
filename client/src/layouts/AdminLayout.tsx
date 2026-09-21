import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Radio } from 'lucide-react';

const AdminLayout = () => {
  const token = localStorage.getItem('adminToken');
  const navigate = useNavigate();
  const [isOrdersClosed, setIsOrdersClosed] = useState<boolean>(() => localStorage.getItem('store_orders_closed') !== 'false');

  useEffect(() => {
    const handleStatusUpdate = () => {
      setIsOrdersClosed(localStorage.getItem('store_orders_closed') !== 'false');
    };
    window.addEventListener('store_status_changed', handleStatusUpdate);
    window.addEventListener('storage', handleStatusUpdate);
    return () => {
      window.removeEventListener('store_status_changed', handleStatusUpdate);
      window.removeEventListener('storage', handleStatusUpdate);
    };
  }, []);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200 text-center">
          <h2 className="font-serif font-bold text-xl text-gray-900">Admin Panel</h2>
          <div className="mt-2 flex items-center justify-center">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
              isOrdersClosed 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isOrdersClosed ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}></span>
              {isOrdersClosed ? 'Orders Closed' : 'Orders Open'}
            </span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 bg-gray-100 text-black rounded-md font-bold text-sm">
            <LayoutDashboard size={18} /> Orders
          </Link>
          <Link to="/admin/feedbacks" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-gray-800 hover:text-black rounded-md font-medium text-sm transition">
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
      <div className="flex-1 flex flex-col overflow-hidden text-gray-900">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 text-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

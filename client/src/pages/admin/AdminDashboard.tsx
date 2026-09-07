import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Eye, Filter, Trash2, HardDrive } from 'lucide-react';

const AdminDashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [storageUsage, setStorageUsage] = useState<any>(null);
  
  const token = localStorage.getItem('adminToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com'}/api/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setOrders(response.data.data);
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchStorage = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com'}/api/admin/storage`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success && response.data.data) {
          setStorageUsage(response.data.data);
        } else {
          setStorageUsage('error');
        }
      } catch (err) {
        console.error('Failed to fetch storage', err);
        setStorageUsage('error');
      }
    };

    fetchOrders();
    fetchStorage();
  }, [token, navigate]);

  const handleDelete = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order? This will also remove the payment screenshot to free up space.')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com'}/api/admin/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(orders.filter(o => o.orderId !== orderId));
    } catch (err) {
      alert('Failed to delete order');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.phone.includes(search);
      
    const matchesFilter = filterStatus === 'ALL' || 
      (filterStatus === 'SCREENSHOT_UPLOADED' && order.payment.status === 'SCREENSHOT_UPLOADED') ||
      (filterStatus !== 'SCREENSHOT_UPLOADED' && order.orderStatus === filterStatus);
      
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'SCREENSHOT_UPLOADED') return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Verify Payment</span>;
    if (status === 'CONFIRMED') return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Confirmed</span>;
    if (status === 'DELIVERED') return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Delivered</span>;
    if (status === 'CANCELLED') return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Cancelled</span>;
    if (status === 'PAYMENT_PENDING') return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Payment Pending</span>;
    return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Orders Dashboard</h1>
      </div>

      {/* Storage Widget */}
      {storageUsage === null ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-brand-orange/30 mb-6 flex justify-center items-center h-32">
          <p className="text-gray-500">Loading Cloudinary storage details...</p>
        </div>
      ) : storageUsage === 'error' ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-red-300 mb-6 flex justify-center items-center h-32 text-red-500">
          <p>Failed to load Cloudinary Storage details. Please check your API keys or refresh.</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-brand-orange/30 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-50 rounded-full text-brand-orange">
              <HardDrive size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 leading-none">Storage & API Usage Details</h2>
              <p className="text-sm text-gray-500 mt-1">Monitor your Cloudinary space to prevent limits. Delete old orders to free up space.</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-sm font-medium text-gray-600">Plan Usage (Credits)</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-gray-800">{storageUsage?.credits?.usage || 0}</span>
                <span className="text-sm text-gray-500"> / {storageUsage?.credits?.limit || 25} credits</span>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1 overflow-hidden">
              <div 
                className={`h-2.5 rounded-full ${
                  (storageUsage?.credits?.used_percent || 0) > 80 ? 'bg-red-500' : 'bg-brand-orange'
                }`}
                style={{ width: `${Math.min(storageUsage?.credits?.used_percent || 0, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 text-right mt-1">{storageUsage?.credits?.used_percent || 0}% Used</p>
            
            {/* Detail numbers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500">Storage Used</p>
                <p className="text-sm font-semibold text-gray-800">
                  {storageUsage?.storage?.usage ? (storageUsage.storage.usage / (1024 * 1024)).toFixed(2) + ' MB' : '0 MB'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Bandwidth Used</p>
                <p className="text-sm font-semibold text-gray-800">
                  {storageUsage?.bandwidth?.usage ? (storageUsage.bandwidth.usage / (1024 * 1024)).toFixed(2) + ' MB' : '0 MB'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Transformations</p>
                <p className="text-sm font-semibold text-gray-800">
                  {storageUsage?.transformations?.usage || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Current Plan</p>
                <p className="text-sm font-semibold text-gray-800 capitalize">
                  {storageUsage?.plan || 'Free'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Order ID or Phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-black"
          >
            <option value="ALL">All Orders</option>
            <option value="SCREENSHOT_UPLOADED">Needs Verification</option>
            <option value="PAYMENT_PENDING">Payment Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PREPARING">Preparing</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Order ID</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Items</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Amount</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">Loading orders...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">No orders found</td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-mono font-medium">{order.orderId}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{order.customer.name}</div>
                      <div className="text-xs text-gray-500">{order.customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>{order.product.name} ({order.product.weight || '1200g'}) × {order.product.quantity}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">₹{order.payment.amount}</td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.orderStatus, order.payment.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/admin/orders/${order.orderId}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition"
                        >
                          <Eye size={16} /> View
                        </Link>
                        <button 
                          onClick={() => handleDelete(order.orderId)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded text-sm hover:bg-red-100 transition"
                          title="Delete Order & Free Space"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Eye, Filter } from 'lucide-react';

const AdminDashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  
  const token = localStorage.getItem('adminToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/orders', {
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
    fetchOrders();
  }, [token, navigate]);

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
                      <Link 
                        to={`/admin/orders/${order.orderId}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition"
                      >
                        <Eye size={16} /> View
                      </Link>
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

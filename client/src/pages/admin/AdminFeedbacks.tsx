import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Check, X, Star } from 'lucide-react';

const AdminFeedbacks = () => {
  const [ordersWithFeedback, setOrdersWithFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem('adminToken');
  const navigate = useNavigate();

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com'}/api/admin/feedbacks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setOrdersWithFeedback(response.data.data);
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

  useEffect(() => {
    fetchFeedbacks();
  }, [token, navigate]);

  const toggleApproval = async (orderId: string, currentStatus: boolean) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com'}/api/admin/orders/${orderId}/feedback/approve`, {
        isApproved: !currentStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFeedbacks();
    } catch (err) {
      alert('Failed to update approval status');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Customer Feedbacks</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 w-1/5">Customer</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 w-1/5">Rating</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 w-2/5">Comment</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 w-1/5 text-right">Approve for Website</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading feedbacks...</td></tr>
              ) : ordersWithFeedback.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No feedbacks found</td></tr>
              ) : (
                ordersWithFeedback.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{order.customer.name}</div>
                      <div className="text-xs text-gray-500">{order.customer.city}</div>
                      <div className="text-xs text-gray-400 mt-1">{new Date(order.feedback.submittedAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill={i < order.feedback.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 italic">
                      "{order.feedback.comment || 'No comment provided'}"
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => toggleApproval(order.orderId, order.feedback.isApproved)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition ${
                          order.feedback.isApproved 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {order.feedback.isApproved ? (
                          <><Check size={16} /> Approved</>
                        ) : (
                          <><X size={16} /> Hidden</>
                        )}
                      </button>
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

export default AdminFeedbacks;

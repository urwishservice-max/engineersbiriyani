import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  
  const token = localStorage.getItem('adminToken');

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setOrder(response.data.data);
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
    fetchOrder();
  }, [orderId, token, navigate]);

  const handleVerify = async () => {
    if (!window.confirm('Are you sure you want to verify this payment?')) return;
    
    setIsVerifying(true);
    try {
      await axios.patch(`http://localhost:5000/api/admin/orders/${orderId}/payment/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchOrder();
    } catch (err) {
      alert('Failed to verify payment');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setIsVerifying(true);
    try {
      await axios.patch(`http://localhost:5000/api/admin/orders/${orderId}/payment/reject`, { reason: rejectReason }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowRejectInput(false);
      await fetchOrder();
    } catch (err) {
      alert('Failed to reject payment');
    } finally {
      setIsVerifying(false);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchOrder();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!order) return <div className="p-6">Order not found</div>;

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link to="/admin/orders" className="p-2 hover:bg-gray-200 rounded-full transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-semibold">Order Details: {order.orderId}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Order & Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 pb-2">Customer Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{order.customer.phone}</p>
                  <a 
                    href={`https://wa.me/91${order.customer.phone}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{order.customer.address}, {order.customer.landmark && `${order.customer.landmark}, `}{order.customer.city} - {order.customer.pincode}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 pb-2">Order Items</h2>
            <div className="flex flex-col mb-2">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-medium text-lg">{order.product.name} ({order.product.weight || '1200g'})</span>
                  <div className="text-sm text-gray-500 mt-1">
                    <p>• {order.product.pieces || '3 to 4 pieces'} of Chicken</p>
                    <p>• {order.product.breadHalwa !== false ? 'Includes Bread Halwa' : 'No Bread Halwa'}</p>
                  </div>
                </div>
                <span className="font-medium">{order.product.quantity} × ₹{order.product.unitPrice}</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-bold text-lg">₹{order.product.totalAmount}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 pb-2">Update Order Status</h2>
            <div className="flex flex-wrap gap-2">
              {['PAYMENT_PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(status)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    order.orderStatus === status 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column: Payment Verification */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 pb-2">Payment Details</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <span className="px-2 py-1 bg-gray-100 rounded-md text-sm font-medium">{order.payment.status}</span>
            </div>
            
            {order.payment.screenshotUrl ? (
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Screenshot</p>
                <a href={order.payment.screenshotUrl} target="_blank" rel="noreferrer" className="block border border-gray-200 rounded-md overflow-hidden hover:opacity-90 transition">
                  <img src={order.payment.screenshotUrl} alt="Payment Screenshot" className="w-full h-auto object-cover" />
                </a>
                <p className="text-xs text-gray-400 mt-2 text-center">Click image to open full size</p>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 text-center text-sm text-gray-500 rounded-md mb-6 border border-gray-200">
                No screenshot uploaded
              </div>
            )}
            
            {order.payment.status === 'SCREENSHOT_UPLOADED' && (
              <div className="space-y-3">
                <button 
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className="w-full flex justify-center items-center gap-2 bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition"
                >
                  <CheckCircle size={18} /> Verify Payment
                </button>
                
                {!showRejectInput ? (
                  <button 
                    onClick={() => setShowRejectInput(true)}
                    className="w-full flex justify-center items-center gap-2 bg-red-50 text-red-600 py-3 rounded-md font-semibold hover:bg-red-100 transition"
                  >
                    <XCircle size={18} /> Reject Payment
                  </button>
                ) : (
                  <div className="space-y-2 mt-4 p-4 border border-red-200 rounded-md bg-red-50">
                    <label className="text-sm text-red-800 font-medium">Rejection Reason</label>
                    <input 
                      type="text" 
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="e.g. Invalid screenshot"
                      className="w-full p-2 border border-red-300 rounded text-sm focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button onClick={handleReject} className="flex-1 bg-red-600 text-white py-2 rounded text-sm font-medium">Confirm Reject</button>
                      <button onClick={() => setShowRejectInput(false)} className="flex-1 bg-white border border-red-300 text-red-600 py-2 rounded text-sm font-medium">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {order.payment.status === 'PAYMENT_VERIFIED' && (
              <div className="p-4 bg-green-50 text-green-800 rounded-md flex items-center gap-2 text-sm font-medium">
                <CheckCircle size={18} /> Payment Verified
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AdminOrderDetails;

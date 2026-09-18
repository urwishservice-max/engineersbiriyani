import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Clock, Package, Truck, Home, Star, Phone, Search, ArrowRight, UserCheck, RefreshCw } from 'lucide-react';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  // Phone login & list state
  const [phone, setPhone] = useState(localStorage.getItem('customerPhone') || '');
  const [inputPhone, setInputPhone] = useState('');
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [searchingPhone, setSearchingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  
  // Single order state
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Feedback state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Fetch single order if orderId is present
  const fetchSingleOrder = async (id: string) => {
    setLoading(true);
    const apiBase = import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com';
    try {
      const response = await axios.get(`${apiBase}/api/orders/${id}`);
      if (response.data?.success) {
        setOrder(response.data.data);
        if (response.data.data.feedback) {
          setFeedbackSubmitted(true);
        }
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('API fetch order failed in OrderTracking:', err);
    }

    const saved = localStorage.getItem(`order_${id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setOrder(parsed);
        if (parsed.feedback) setFeedbackSubmitted(true);
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  };

  // Fetch orders by phone
  const fetchOrdersByPhone = async (phoneNumber: string) => {
    if (!phoneNumber || phoneNumber.length < 10) return;
    setSearchingPhone(true);
    setPhoneError('');
    const cleanPhone = phoneNumber.trim();
    const apiBase = import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com';

    try {
      const response = await axios.get(`${apiBase}/api/orders/phone/${cleanPhone}`);
      if (response.data?.success && response.data.data?.length > 0) {
        setUserOrders(response.data.data);
        localStorage.setItem('customerPhone', cleanPhone);
        setPhone(cleanPhone);
        setSearchingPhone(false);
        return;
      }
    } catch (err) {
      console.warn('API fetch orders by phone failed, fallback to local_orders:', err);
    }

    // Check local storage orders
    const localOrdersStr = localStorage.getItem('local_orders');
    if (localOrdersStr) {
      try {
        const allLocalOrders = JSON.parse(localOrdersStr);
        const filtered = allLocalOrders.filter((o: any) => o.customer?.phone === cleanPhone);
        if (filtered.length > 0) {
          setUserOrders(filtered);
          localStorage.setItem('customerPhone', cleanPhone);
          setPhone(cleanPhone);
          setSearchingPhone(false);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    localStorage.setItem('customerPhone', cleanPhone);
    setPhone(cleanPhone);
    setUserOrders([]);
    setPhoneError('No orders found for this mobile number.');
    setSearchingPhone(false);
  };

  useEffect(() => {
    if (orderId) {
      fetchSingleOrder(orderId);
      const intervalId = setInterval(() => fetchSingleOrder(orderId), 10000);
      return () => clearInterval(intervalId);
    } else if (phone) {
      fetchOrdersByPhone(phone);
    }
  }, [orderId, phone]);

  const handlePhoneSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPhone.trim().length >= 10) {
      fetchOrdersByPhone(inputPhone.trim());
    } else {
      setPhoneError('Please enter a valid 10-digit phone number');
    }
  };

  const handleLogoutPhone = () => {
    localStorage.removeItem('customerPhone');
    setPhone('');
    setUserOrders([]);
    setInputPhone('');
    setPhoneError('');
  };

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !orderId) return;
    
    setSubmittingFeedback(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com'}/api/orders/${orderId}/feedback`, {
        rating,
        comment
      });
      if (response.data.success) {
        setFeedbackSubmitted(true);
      }
    } catch (err) {
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAYMENT_PENDING':
        return <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 text-xs px-3 py-1 rounded-full font-bold">Payment Pending</span>;
      case 'PAYMENT_VERIFICATION':
        return <span className="bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40 text-xs px-3 py-1 rounded-full font-bold">Payment Verification</span>;
      case 'CONFIRMED':
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/40 text-xs px-3 py-1 rounded-full font-bold">Confirmed</span>;
      case 'PREPARING':
        return <span className="bg-purple-500/20 text-purple-400 border border-purple-500/40 text-xs px-3 py-1 rounded-full font-bold">Preparing</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs px-3 py-1 rounded-full font-bold">Out for Delivery</span>;
      case 'DELIVERED':
        return <span className="bg-green-500/20 text-green-400 border border-green-500/40 text-xs px-3 py-1 rounded-full font-bold">Delivered</span>;
      default:
        return <span className="bg-gray-800 text-gray-400 border border-gray-700 text-xs px-3 py-1 rounded-full font-bold">{status}</span>;
    }
  };

  const statuses = [
    { key: 'PAYMENT_VERIFICATION', label: 'Payment Verification', icon: Clock },
    { key: 'CONFIRMED', label: 'Order Confirmed', icon: CheckCircle },
    { key: 'PREPARING', label: 'Preparing', icon: Package },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: Home },
  ];

  // SCENARIO 1: Viewing Specific Order ID Tracking
  if (orderId) {
    if (loading && !order) return <div className="flex-1 flex justify-center items-center pt-28 bg-black text-[#FFB800] font-bold">Loading order...</div>;
    if (!order) return (
      <div className="flex-1 flex flex-col justify-center items-center pt-28 pb-16 bg-black text-white px-4">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Order Not Found</h2>
        <p className="text-gray-400 mb-6">We couldn't find an order with ID: {orderId}</p>
        <Link to="/track" className="btn-primary">View All Orders by Phone</Link>
      </div>
    );

    const currentStatusIndex = statuses.findIndex(s => s.key === order.orderStatus);
    const isPaymentPending = order.orderStatus === 'PAYMENT_PENDING' || order.payment.status === 'PAYMENT_REJECTED';

    return (
      <div className="flex-1 flex flex-col items-center pt-28 pb-16 px-4 bg-black text-white min-h-screen">
        <div className="w-full max-w-2xl">
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => navigate('/track')} 
              className="text-xs uppercase tracking-widest font-bold text-[#FFB800] hover:underline flex items-center gap-1"
            >
              ← Back to My Orders
            </button>
            <span className="text-xs text-gray-400 font-mono">{phone ? `Logged in as: ${phone}` : ''}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-[#FFB800]">Order Tracking</h1>
          
          <div className="brand-card p-6 md:p-8 border border-[#FFB800]/40 shadow-[0_0_30px_rgba(255,107,0,0.1)] bg-[#121212] mb-8">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-[#27272A]">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Order ID</p>
                <p className="font-mono font-bold text-lg text-white">{order.orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total</p>
                <p className="font-bold text-xl text-[#FFB800]">₹{order.payment.amount}</p>
              </div>
            </div>
            
            {isPaymentPending ? (
              <div className="bg-[#FFB800]/10 border border-[#FFB800]/40 text-[#FFB800] p-6 rounded-2xl text-center">
                <h3 className="font-bold text-lg mb-2">Payment Pending</h3>
                <p className="text-sm text-white mb-4">Your order is created but payment screenshot is pending verification.</p>
                <Link to={`/payment/${order.orderId}`} className="btn-primary inline-block py-2.5 px-6 text-sm">
                  Complete Payment
                </Link>
              </div>
            ) : order.orderStatus === 'CANCELLED' ? (
              <div className="bg-red-950/80 border border-red-500 text-red-200 p-6 rounded-2xl text-center">
                <h3 className="font-bold text-lg mb-2">Order Cancelled</h3>
                <p className="text-sm">This order has been cancelled.</p>
              </div>
            ) : (
              <div className="py-4">
                <div className="relative">
                  {/* Status Timeline */}
                  {statuses.map((status, index) => {
                    const isActive = index <= currentStatusIndex;
                    const Icon = status.icon;
                    
                    return (
                      <div key={status.key} className="flex items-start mb-8 relative z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                          ${isActive ? 'border-[#FFB800] bg-[#FFB800] text-black font-bold' : 'border-[#27272A] bg-[#18181B] text-gray-500'}`}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="ml-4 pt-2">
                          <h4 className={`font-bold ${isActive ? 'text-[#FFB800]' : 'text-gray-500'}`}>
                            {status.label}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Connecting Line */}
                  <div className="absolute left-5 top-5 bottom-12 w-0.5 bg-[#27272A] z-0">
                    <div 
                      className="w-full bg-[#FFB800] transition-all duration-500"
                      style={{ height: currentStatusIndex > 0 ? `${(currentStatusIndex / (statuses.length - 1)) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {order.orderStatus === 'DELIVERED' && (
            <div className="brand-card p-6 md:p-8 border border-green-500/40 bg-[#121212] mb-8">
              {feedbackSubmitted ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-950 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-[#FFB800] mb-2">Thank you!</h3>
                  <p className="text-white">We appreciate your feedback and hope you enjoyed your biryani meal.</p>
                </div>
              ) : (
                <form onSubmit={submitFeedback} className="text-center">
                  <h3 className="text-xl font-bold text-[#FFB800] mb-2">How was your meal?</h3>
                  <p className="text-sm text-white mb-6">Let us know how you liked your biryani!</p>
                  
                  <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        type="button" 
                        key={star} 
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star 
                          size={32} 
                          fill={star <= rating ? "#FFB800" : "none"} 
                          className={star <= rating ? "text-[#FFB800]" : "text-gray-600"} 
                        />
                      </button>
                    ))}
                  </div>
                  
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you loved... (optional)"
                    className="w-full p-3.5 border border-[#27272A] rounded-xl focus:outline-none focus:border-[#FFB800] mb-4 bg-[#18181B] text-white placeholder:text-gray-500 text-sm"
                    rows={3}
                  ></textarea>
                  
                  <button 
                    type="submit" 
                    disabled={submittingFeedback}
                    className="btn-primary w-full md:w-auto"
                  >
                    {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="brand-card p-6 border border-[#27272A] bg-[#121212]">
            <h3 className="font-bold text-[#FFB800] mb-4 border-b border-[#27272A] pb-2 uppercase tracking-wider text-sm">Order Details</h3>
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-400">Items:</span>
              <span className="font-bold text-white">{order.product.name} × {order.product.quantity}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-400">Delivery To:</span>
              <span className="text-right max-w-[220px] truncate text-white">{order.customer.address}, {order.customer.city}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Date:</span>
              <span className="text-white">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SCENARIO 2: Phone Login & Orders Lookup Page (`/track` or `/my-orders`)
  return (
    <div className="flex-1 flex flex-col items-center pt-28 pb-16 px-4 bg-black text-white min-h-screen">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <span className="eyebrow">ORDER RECOVERY & TRACKING</span>
          <h1 className="text-4xl font-bold text-[#FFB800] mb-3">Track Orders by Phone</h1>
          <p className="text-white text-base">Enter your mobile number to view and track all your biriyani orders.</p>
        </div>

        {/* PHONE LOGIN / SEARCH BAR */}
        <div className="brand-card p-8 border border-[#FFB800]/40 shadow-[0_0_35px_rgba(255,184,0,0.15)] bg-[#121212] mb-10">
          {phone ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#18181B] p-4 rounded-xl border border-[#27272A]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFB800] text-black font-bold flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Logged in with Mobile</p>
                  <p className="font-bold text-lg text-[#FFB800]">{phone}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => fetchOrdersByPhone(phone)}
                  disabled={searchingPhone}
                  className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${searchingPhone ? 'animate-spin' : ''}`} /> Refresh
                </button>
                <button 
                  onClick={handleLogoutPhone}
                  className="text-xs font-bold text-gray-400 hover:text-red-400 transition-colors px-3 py-2"
                >
                  Change Number
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePhoneSearchSubmit} className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#FFB800]">
                Mobile Number
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Phone className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    type="tel" 
                    placeholder="Enter 10-digit mobile number" 
                    value={inputPhone}
                    onChange={(e) => setInputPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-[#18181B] border border-[#27272A] rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFB800] text-sm"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={searchingPhone}
                  className="btn-primary py-3.5 px-8 whitespace-nowrap"
                >
                  {searchingPhone ? 'Searching...' : 'Find My Orders'}
                </button>
              </div>
              {phoneError && <p className="text-red-400 text-xs font-medium mt-2">{phoneError}</p>}
            </form>
          )}
        </div>

        {/* ORDERS LIST */}
        {phone && (
          <div>
            <h2 className="text-xl font-bold text-[#FFB800] mb-6 flex items-center justify-between">
              <span>Your Orders ({userOrders.length})</span>
              <span className="text-xs font-normal text-gray-400">Sorted by recent</span>
            </h2>

            {userOrders.length > 0 ? (
              <div className="space-y-6">
                {userOrders.map((ord) => (
                  <div key={ord._id} className="brand-card p-6 border border-[#27272A] bg-[#121212] hover:border-[#FFB800]/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono font-bold text-white text-base">{ord.orderId}</span>
                        {getStatusBadge(ord.orderStatus)}
                      </div>
                      <p className="font-bold text-[#FFB800] text-lg">{ord.product.name} × {ord.product.quantity}</p>
                      <p className="text-xs text-gray-400">
                        Placed on {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-gray-300">Deliver to: <span className="font-medium text-white">{ord.customer.address}, {ord.customer.city}</span></p>
                    </div>

                    <div className="flex flex-col sm:flex-row md:flex-col items-end justify-between gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-[#27272A]">
                      <span className="font-bold text-2xl text-[#FFB800]">₹{ord.payment.amount}</span>
                      {ord.orderStatus === 'PAYMENT_PENDING' ? (
                        <Link 
                          to={`/payment/${ord.orderId}`}
                          className="btn-primary py-2.5 px-5 text-xs w-full sm:w-auto text-center"
                        >
                          Upload Payment Screenshot
                        </Link>
                      ) : (
                        <Link 
                          to={`/order/${ord.orderId}`}
                          className="btn-secondary py-2.5 px-5 text-xs flex items-center justify-center gap-1.5 w-full sm:w-auto"
                        >
                          Track Status <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : !searchingPhone ? (
              <div className="brand-card p-12 text-center border border-[#27272A] bg-[#121212]">
                <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#FFB800] mb-2">No Orders Found</h3>
                <p className="text-gray-400 text-sm mb-6">No order was found associated with mobile number {phone}.</p>
                <Link to="/checkout" className="btn-primary">Place a New Order</Link>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;



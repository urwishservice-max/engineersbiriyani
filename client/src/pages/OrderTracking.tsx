import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Clock, Package, Truck, Home, Star } from 'lucide-react';

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Feedback state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com'}/api/orders/${orderId}`);
      if (response.data.success) {
        setOrder(response.data.data);
        if (response.data.data.feedback) {
          setFeedbackSubmitted(true);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
      const intervalId = setInterval(fetchOrder, 10000); // Auto-refresh every 10 seconds
      return () => clearInterval(intervalId);
    }
  }, [orderId]);

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;
    
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

  if (loading && !order) return <div className="flex-1 flex justify-center items-center pt-28">Loading order...</div>;
  if (!order) return <div className="flex-1 flex justify-center items-center pt-28 text-red-500">Order not found</div>;

  const statuses = [
    { key: 'PAYMENT_VERIFICATION', label: 'Payment Verification', icon: Clock },
    { key: 'CONFIRMED', label: 'Order Confirmed', icon: CheckCircle },
    { key: 'PREPARING', label: 'Preparing', icon: Package },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: Home },
  ];

  const currentStatusIndex = statuses.findIndex(s => s.key === order.orderStatus);
  const isPaymentPending = order.orderStatus === 'PAYMENT_PENDING' || order.payment.status === 'PAYMENT_REJECTED';

  return (
    <div className="flex-1 flex flex-col items-center pt-28 pb-16 px-4">
      <div className="w-full max-w-2xl">
        <h1 className="font-serif text-3xl mb-8 text-center">Track Your Order</h1>
        
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
            <div>
              <p className="text-gray-500 text-sm mb-1">Order ID</p>
              <p className="font-mono font-medium text-lg">{order.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm mb-1">Total</p>
              <p className="font-bold text-lg">₹{order.payment.amount}</p>
            </div>
          </div>
          
          {isPaymentPending ? (
            <div className="bg-yellow-50 text-yellow-800 p-6 rounded-md text-center">
              <h3 className="font-semibold text-lg mb-2">Payment Pending</h3>
              <p className="text-sm mb-4">Your order is created but payment has not been completed.</p>
              <Link to={`/payment/${order.orderId}`} className="inline-block bg-black text-white px-6 py-2 rounded font-medium text-sm">
                Complete Payment
              </Link>
            </div>
          ) : order.orderStatus === 'CANCELLED' ? (
            <div className="bg-red-50 text-red-800 p-6 rounded-md text-center">
              <h3 className="font-semibold text-lg mb-2">Order Cancelled</h3>
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
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white
                        ${isActive ? 'border-black text-black' : 'border-gray-200 text-gray-300'}`}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="ml-4 pt-2">
                        <h4 className={`font-medium ${isActive ? 'text-black' : 'text-gray-400'}`}>
                          {status.label}
                        </h4>
                      </div>
                    </div>
                  );
                })}
                
                {/* Connecting Line */}
                <div className="absolute left-5 top-5 bottom-12 w-0.5 bg-gray-200 z-0">
                  <div 
                    className="w-full bg-black transition-all duration-500"
                    style={{ height: currentStatusIndex > 0 ? `${(currentStatusIndex / (statuses.length - 1)) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {order.orderStatus === 'DELIVERED' && (
          <div className="bg-green-50 p-6 md:p-8 rounded-lg border border-green-200 mb-8">
            {feedbackSubmitted ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-serif text-green-800 mb-2">Thank you!</h3>
                <p className="text-green-700">We appreciate your feedback and hope you enjoyed your meal.</p>
              </div>
            ) : (
              <form onSubmit={submitFeedback} className="text-center">
                <h3 className="text-xl font-serif text-green-800 mb-2">How was your meal?</h3>
                <p className="text-sm text-green-700 mb-6">Let us know how you liked your biryani!</p>
                
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
                        fill={star <= rating ? "#eab308" : "none"} 
                        className={star <= rating ? "text-yellow-500" : "text-gray-300"} 
                      />
                    </button>
                  ))}
                </div>
                
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you loved... (optional)"
                  className="w-full p-3 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4 bg-white"
                  rows={3}
                ></textarea>
                
                <button 
                  type="submit" 
                  disabled={submittingFeedback}
                  className="bg-green-700 text-white px-8 py-3 rounded-md font-medium hover:bg-green-800 transition disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto"
                >
                  {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            )}
          </div>
        )}

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-4 border-b border-gray-200 pb-2">Order Details</h3>
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-gray-600">Items:</span>
            <span>{order.product.name} × {order.product.quantity}</span>
          </div>
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-gray-600">Delivery To:</span>
            <span className="text-right max-w-[200px] truncate">{order.customer.address}, {order.customer.city}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Date:</span>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;

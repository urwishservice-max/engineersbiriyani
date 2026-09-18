import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const apiBase = import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com';
      try {
        const response = await axios.get(`${apiBase}/api/orders/${orderId}`);
        if (response.data?.success) {
          setOrder(response.data.data);
          return;
        }
      } catch (err) {
        console.warn('API fetch order failed in OrderSuccess, fallback to localStorage:', err);
      }

      const saved = localStorage.getItem(`order_${orderId}`);
      if (saved) {
        try {
          setOrder(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    };
    
    if (orderId) fetchOrder();
  }, [orderId]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center pt-28 pb-16 px-4 bg-black text-white min-h-screen">
      <div className="brand-card w-full max-w-lg p-10 text-center border border-[#FFB800]/40 shadow-[0_0_40px_rgba(255,107,0,0.15)] bg-[#121212]">
        <div className="flex justify-center mb-6">
          <CheckCircle className="text-[#FFB800] w-20 h-20 animate-bounce" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-[#FFB800]">Payment Screenshot Submitted</h1>
        
        <p className="text-white mb-8 text-sm leading-relaxed">
          Your order has been received and is waiting for payment verification.
        </p>
        
        {order && (
          <div className="bg-[#18181B] p-6 rounded-2xl mb-8 text-left border border-[#27272A] space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Order ID:</span>
              <span className="font-mono font-bold text-white">{order.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Customer:</span>
              <span className="font-bold text-white">{order.customer.name}</span>
            </div>
            {order.customer?.location && (
              <div className="flex justify-between">
                <span className="text-gray-400">Location:</span>
                <span className="font-bold text-[#FFB800]">{order.customer.location}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Product:</span>
              <span className="font-bold text-white">{order.product.name} × {order.product.quantity}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-[#27272A] mt-3">
              <span className="text-gray-300 font-bold">Total Amount:</span>
              <span className="font-bold text-xl text-[#FFB800]">₹{order.payment.amount}</span>
            </div>
          </div>
        )}
        
        <div className="bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800] p-4 rounded-xl text-sm mb-8 font-medium">
          We will confirm your order after verifying your payment. You will receive an update shortly.
        </div>
        
        <div className="space-y-4">
          <Link 
            to={`/order/${orderId}`}
            className="btn-primary w-full py-4 text-center block text-sm"
          >
            Track Order Status
          </Link>
          
          {order && (
            <a
              href={`https://wa.me/919360867908?text=${encodeURIComponent(`Hello Engineer's Biriyani, I have placed an order (ID: ${order.orderId}) for ${order.product.name} (Qty: ${order.product.quantity}). Total: ₹${order.payment.amount}. I have uploaded my payment screenshot on the website. Please verify my payment.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full py-4 text-center block text-sm border-green-500 text-green-400 hover:bg-green-500 hover:text-black"
            >
              Notify via WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;


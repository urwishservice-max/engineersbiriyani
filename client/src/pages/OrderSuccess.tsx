import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, MessageCircle } from 'lucide-react';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const apiBase = import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com';
      let loadedOrder: any = null;
      try {
        const response = await axios.get(`${apiBase}/api/orders/${orderId}`);
        if (response.data?.success) {
          loadedOrder = response.data.data;
        }
      } catch (err) {
        console.warn('API fetch order failed in OrderSuccess, fallback to localStorage:', err);
      }

      if (!loadedOrder) {
        const saved = localStorage.getItem(`order_${orderId}`);
        if (saved) {
          try {
            loadedOrder = JSON.parse(saved);
          } catch (e) {
            console.error(e);
          }
        }
      }

      if (loadedOrder) {
        setOrder(loadedOrder);

        // Auto-redirect to WhatsApp if auto flag is present
        if (searchParams.get('wa') === '1') {
          const ownerPhone = '919360867908';
          const cName = loadedOrder.customer?.name || 'Customer';
          const cPhone = loadedOrder.customer?.phone || '';
          const pName = loadedOrder.product?.name || 'Biriyani';
          const qty = loadedOrder.product?.quantity || 1;
          const amount = loadedOrder.payment?.amount || 0;

          const text = `Hello Engineer's Biriyani, I have uploaded my payment screenshot for Order ID: ${orderId}.\n\nCustomer: ${cName} (${cPhone})\nItems: ${pName} x ${qty}\nTotal Amount: ₹${amount}\n\nPlease verify my payment!`;
          const waUrl = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(text)}`;

          try {
            window.location.href = waUrl;
          } catch (e) {
            console.warn('Auto redirect to WhatsApp failed:', e);
          }
        }
      }
    };
    
    if (orderId) fetchOrder();
  }, [orderId, searchParams]);

  const getWhatsAppUrl = () => {
    if (!order) return '#';
    const ownerPhone = '919360867908';
    const cName = order.customer?.name || 'Customer';
    const cPhone = order.customer?.phone || '';
    const pName = order.product?.name || 'Biriyani';
    const qty = order.product?.quantity || 1;
    const amount = order.payment?.amount || 0;

    const text = `Hello Engineer's Biriyani, I have uploaded my payment screenshot for Order ID: ${orderId}.\n\nCustomer: ${cName} (${cPhone})\nItems: ${pName} x ${qty}\nTotal Amount: ₹${amount}\n\nPlease verify my payment!`;
    return `https://wa.me/${ownerPhone}?text=${encodeURIComponent(text)}`;
  };

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
              <span className="font-bold text-white">{order.customer?.name}</span>
            </div>
            {order.customer?.location && (
              <div className="flex justify-between">
                <span className="text-gray-400">Location:</span>
                <span className="font-bold text-[#FFB800]">{order.customer.location}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Product:</span>
              <span className="font-bold text-white">{order.product?.name} × {order.product?.quantity}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-[#27272A] mt-3">
              <span className="text-gray-300 font-bold">Total Amount:</span>
              <span className="font-bold text-xl text-[#FFB800]">₹{order.payment?.amount}</span>
            </div>
          </div>
        )}
        
        <div className="bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800] p-4 rounded-xl text-sm mb-8 font-medium">
          We will confirm your order after verifying your payment screenshot on WhatsApp.
        </div>
        
        <div className="space-y-4">
          {order && (
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 text-center text-sm bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg"
            >
              <MessageCircle size={20} />
              <span>Send Confirmation on WhatsApp</span>
            </a>
          )}

          <Link 
            to={`/order/${orderId}`}
            className="btn-primary w-full py-4 text-center block text-sm"
          >
            Track Order Status
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;


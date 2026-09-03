import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com'}/api/orders/${orderId}`);
        if (response.data.success) {
          setOrder(response.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    
    if (orderId) fetchOrder();
  }, [orderId]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center pt-28 pb-16 px-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-full max-w-lg p-10 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="text-green-500 w-20 h-20" />
        </div>
        
        <h1 className="font-serif text-3xl mb-4">Payment Screenshot Submitted</h1>
        
        <p className="text-gray-600 mb-8">
          Your order has been received and is waiting for payment verification.
        </p>
        
        {order && (
          <div className="bg-gray-50 p-6 rounded-md mb-8 text-left border border-gray-100">
            <div className="flex justify-between mb-3">
              <span className="text-gray-500">Order ID:</span>
              <span className="font-mono font-medium">{order.orderId}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-500">Customer:</span>
              <span className="font-medium">{order.customer.name}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-500">Product:</span>
              <span className="font-medium">{order.product.name} × {order.product.quantity}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200 mt-3">
              <span className="text-gray-700 font-semibold">Total Amount:</span>
              <span className="font-bold">₹{order.payment.amount}</span>
            </div>
          </div>
        )}
        
        <div className="bg-blue-50 text-blue-800 p-4 rounded-md text-sm mb-8">
          We will confirm your order after verifying the payment. You will receive an update once it is verified.
        </div>
        
        <Link 
          to={`/order/${orderId}`}
          className="inline-block w-full bg-black text-white py-4 rounded-md font-semibold tracking-wider hover:bg-gray-800 transition uppercase text-sm mb-4"
        >
          Track Order Status
        </Link>
        
        {order && (
          <a
            href={`https://wa.me/918870877407?text=${encodeURIComponent(`Hello Engineer's Biriyani, I have placed an order (ID: ${order.orderId}) for ${order.product.name} (Qty: ${order.product.quantity}). Total: ₹${order.payment.amount}. I have uploaded my payment screenshot on the website. Please verify my payment.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full bg-green-500 text-white py-4 flex items-center justify-center rounded-md font-semibold tracking-wider hover:bg-green-600 transition uppercase text-sm"
          >
            Notify via WhatsApp
          </a>
        )}
      </div>
    </div>
  );
};

export default OrderSuccess;

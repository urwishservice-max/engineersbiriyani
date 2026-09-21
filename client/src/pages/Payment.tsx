import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UploadCloud, CheckCircle, XCircle, AlertTriangle, Store, Clock } from 'lucide-react';
import { uploadScreenshotDirectly } from '../services/cloudinaryDirect.service';
import { sendOrderToGoogleSheet } from '../services/googleSheet.service';

interface OrderDetails {
  orderId: string;
  customer?: {
    name?: string;
    phone?: string;
    location?: string;
  };
  product?: {
    name?: string;
    quantity?: number;
    weight?: string;
  };
  payment: {
    amount: number;
    status: string;
    screenshotUrl?: string;
  };
}

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [isOrdersClosed, setIsOrdersClosed] = useState<boolean>(() => localStorage.getItem('store_orders_closed') !== 'false');
  
  const upiId = import.meta.env.VITE_UPI_ID || 'amjathali003-1@okicici';

  useEffect(() => {
    const fetchStoreStatus = async () => {
      const apiBase = import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com';
      try {
        const res = await axios.get(`${apiBase}/api/orders/store-status`);
        if (res.data?.success && typeof res.data?.data?.isOrdersClosed === 'boolean') {
          setIsOrdersClosed(res.data.data.isOrdersClosed);
          localStorage.setItem('store_orders_closed', String(res.data.data.isOrdersClosed));
        }
      } catch (e) {
        // use cached state
      }
    };
    fetchStoreStatus();

    const fetchOrder = async () => {
      const apiBase = import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com';
      try {
        const response = await axios.get(`${apiBase}/api/orders/${orderId}`);
        if (response.data?.success) {
          setOrder(response.data.data);
          
          if (response.data.data.payment.status !== 'PAYMENT_PENDING') {
            navigate(`/order-success/${orderId}`);
          }
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('API fetch order failed, looking in local storage:', err);
      }

      // Check local storage fallback
      const saved = localStorage.getItem(`order_${orderId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setOrder(parsed);
          if (parsed.payment?.status !== 'PAYMENT_PENDING') {
            navigate(`/order-success/${orderId}`);
          }
        } catch (e) {
          setError('Failed to fetch order details. Invalid Order ID.');
        }
      } else {
        setError('Failed to fetch order details. Invalid Order ID.');
      }
      setLoading(false);
    };
    
    if (orderId) fetchOrder();
  }, [orderId, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError('');
    
    if (selectedFile) {
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(selectedFile.type)) {
        setError('Please upload a valid image file (JPG, PNG, WebP)');
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a screenshot first');
      return;
    }
    
    setIsUploading(true);
    setError('');

    let screenshotUrl = '';
    let cloudinaryPublicId = '';

    // 1. Direct Cloudinary Upload (Ultra-fast, direct from browser, no cold-start)
    try {
      const cRes = await uploadScreenshotDirectly(file);
      if (cRes?.url) {
        screenshotUrl = cRes.url;
        cloudinaryPublicId = cRes.publicId;
      }
    } catch (cErr) {
      console.warn('Direct Cloudinary upload error:', cErr);
    }

    // 2. Failsafe: convert to base64 if Cloudinary had an issue
    if (!screenshotUrl) {
      try {
        screenshotUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      } catch (e) {
        console.error('Base64 conversion failed:', e);
      }
    }

    const currentOrderData = order || {
      orderId,
      customer: { name: 'Customer', phone: '', location: '' },
      product: { name: 'Chicken Biriyani', quantity: 1 },
      payment: { amount: 0, status: 'SCREENSHOT_UPLOADED' }
    };

    const updatedPayment = {
      method: 'UPI',
      amount: currentOrderData.payment?.amount || 0,
      status: 'SCREENSHOT_UPLOADED',
      screenshotUrl: screenshotUrl,
      screenshotPublicId: cloudinaryPublicId,
      uploadedAt: new Date().toISOString()
    };

    const finalOrderPayload = {
      ...currentOrderData,
      orderId,
      payment: updatedPayment,
      orderStatus: 'PAYMENT_VERIFICATION'
    };

    // 3. Send Order with clickable Cloudinary Screenshot link to Google Sheet Webhook
    try {
      await sendOrderToGoogleSheet({
        orderId: orderId || '',
        customerName: currentOrderData.customer?.name || 'Customer',
        customerPhone: currentOrderData.customer?.phone || '',
        location: currentOrderData.customer?.location || '',
        productName: currentOrderData.product?.name || 'Chicken Biriyani',
        quantity: currentOrderData.product?.quantity || 1,
        totalAmount: currentOrderData.payment?.amount || 0,
        paymentStatus: 'PAID & SCREENSHOT_UPLOADED',
        screenshotUrl: screenshotUrl.startsWith('http') ? screenshotUrl : 'Uploaded via Base64',
        deliveryDate: '27-Sep-26 (Sunday)'
      });
    } catch (gsErr) {
      console.warn('Google Sheet dispatch error:', gsErr);
    }

    // 4. Update local storage for instant customer & admin visibility
    const updateLocalStorageOrder = (updatedFields: any) => {
      const saved = localStorage.getItem(`order_${orderId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const merged = { ...parsed, ...updatedFields };
          localStorage.setItem(`order_${orderId}`, JSON.stringify(merged));
        } catch (e) {
          console.error(e);
        }
      }

      const localOrdersStr = localStorage.getItem('local_orders');
      if (localOrdersStr) {
        try {
          const localOrders = JSON.parse(localOrdersStr);
          const idx = localOrders.findIndex((o: any) => o.orderId === orderId);
          if (idx !== -1) {
            localOrders[idx] = { ...localOrders[idx], ...updatedFields };
            localStorage.setItem('local_orders', JSON.stringify(localOrders));
          } else {
            localOrders.unshift({ ...currentOrderData, ...updatedFields });
            localStorage.setItem('local_orders', JSON.stringify(localOrders));
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    updateLocalStorageOrder(finalOrderPayload);

    // 5. Dual-sync to MongoDB in background if server is awake
    const apiBase = import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com';
    const formData = new FormData();
    formData.append('screenshot', file);
    axios.post(`${apiBase}/api/orders/${orderId}/payment-screenshot`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 10000
    }).catch(bErr => console.warn('Background MongoDB sync note:', bErr));

    // 6. WhatsApp trigger: Open WhatsApp IMMEDIATELY directly
    const ownerPhone = '919360867908';
    const cName = finalOrderPayload.customer?.name || order?.customer?.name || 'Customer';
    const cPhone = finalOrderPayload.customer?.phone || order?.customer?.phone || '';
    const pName = finalOrderPayload.product?.name || order?.product?.name || 'Biriyani';
    const qty = finalOrderPayload.product?.quantity || order?.product?.quantity || 1;
    const amount = finalOrderPayload.payment?.amount || order?.payment?.amount || 0;
    const oId = finalOrderPayload.orderId || orderId;

    const message = `Hello Engineer's Biriyani, I have uploaded my payment screenshot for Order ID: ${oId}.\n\nCustomer: ${cName} (${cPhone})\nItems: ${pName} x ${qty}\nTotal Amount: ₹${amount}\nDelivery Date: 27-Sep-26 (Sunday)\n\nPlease verify my payment!`;
    const waUrl = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(message)}`;

    setIsUploading(false);
    // Instant WhatsApp redirect
    window.location.href = waUrl;
  };

  if (loading) {
    return <div className="flex-1 flex justify-center items-center pt-28 bg-black text-[#FFB800] font-bold">Loading payment details...</div>;
  }

  if (!order) {
    if (isOrdersClosed) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center pt-28 pb-16 px-4 w-full bg-black text-white min-h-screen text-center">
          <div className="bg-[#121212] border border-red-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-5 text-red-400">
              <Store size={30} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Orders Are Closed</h2>
            <p className="text-gray-400 text-sm mb-6">
              Our kitchen is currently not accepting new orders or payments. Please check back later!
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/track" className="btn-primary py-3 text-xs uppercase tracking-wider">
                Track Existing Order
              </Link>
              <Link to="/" className="text-gray-400 hover:text-white text-xs underline py-2">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return <div className="flex-1 flex justify-center items-center pt-28 text-red-500 font-bold bg-black">{error}</div>;
  }

  return (
    <div className="flex-1 flex flex-col items-center pt-28 pb-16 px-4 w-full bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-[#FFB800]">Payment Required</h1>

      {isOrdersClosed && (
        <div className="w-full max-w-xl mb-6 bg-amber-950/70 border border-amber-500/50 rounded-2xl p-4 flex items-start gap-3 shadow-lg">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold text-amber-300 block mb-0.5">Store Notice: New orders are currently closed</span>
            <span className="text-gray-300">
              New bookings are currently paused. Since you already initiated this booking, please complete your payment screenshot upload below to secure your biriyani!
            </span>
          </div>
        </div>
      )}
      
      <div className="brand-card w-full max-w-xl p-8 mt-2 border border-[#FFB800]/40 shadow-[0_0_35px_rgba(255,107,0,0.15)] bg-[#121212]">
        <div className="text-center mb-8 pb-6 border-b border-[#27272A]">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Order ID</p>
          <p className="font-mono text-xl font-bold text-white mb-2">{order.orderId}</p>
          <div className="inline-flex items-center gap-1.5 text-xs text-[#FFB800] bg-[#FFB800]/10 border border-[#FFB800]/30 px-3 py-1 rounded-full font-bold">
            <Clock size={12} />
            <span>Delivery: Sunday, 27-Sep-26</span>
          </div>
        </div>
        
        <div className="bg-[#18181B] p-6 rounded-2xl mb-8 text-center border border-[#27272A]">
          <p className="text-gray-300 text-sm mb-1">Total Amount to Pay</p>
          <p className="text-4xl font-bold text-[#FFB800]">₹{order.payment.amount}</p>
        </div>
        
        <div className="flex flex-col items-center mb-10">
          <h2 className="font-bold text-lg mb-4 uppercase tracking-wider text-[#FFB800]">Scan & Pay via UPI</h2>
          
          <div className="w-52 h-52 border-2 border-[#FFB800] rounded-2xl p-3 mb-4 bg-white flex items-center justify-center shadow-lg">
            <img src="/qr.jpeg" alt="UPI QR Code" className="w-full h-full object-contain" />
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 text-xs uppercase tracking-wider">UPI ID:</p>
            <p className="font-bold text-lg bg-[#18181B] border border-[#27272A] text-[#FFB800] px-5 py-2 rounded-xl mt-1 select-all">{upiId}</p>
          </div>
        </div>
        
        <div className="border-t border-[#27272A] pt-8">
          <h3 className="font-bold mb-4 text-center text-[#FFB800] uppercase tracking-wider">Payment Instructions</h3>
          <ol className="list-decimal list-inside text-white text-sm space-y-2.5 mb-8 bg-[#18181B] p-5 rounded-xl border border-[#27272A]">
            <li>Open Google Pay / PhonePe / Paytm / BHIM or any UPI app.</li>
            <li>Scan the QR code or use the UPI ID above.</li>
            <li>Pay exactly <strong className="text-[#FFB800]">₹{order.payment.amount}</strong>.</li>
            <li>Complete the transaction & take a screenshot.</li>
            <li>Upload the payment screenshot below.</li>
          </ol>
          
          <div className="bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/30 p-4 rounded-xl text-sm text-center mb-8 flex items-center justify-center gap-2 font-medium">
            <span>Note: Your order will be confirmed immediately after payment screenshot verification.</span>
          </div>
          
          {/* Upload Section */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#FFB800] mb-2">Upload Payment Screenshot</label>
            
            {!preview ? (
              <label className="border-2 border-dashed border-[#FFB800]/60 hover:border-[#FFB800] bg-[#18181B] rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition">
                <UploadCloud className="text-[#FFB800] mb-3" size={36} />
                <span className="text-sm text-white font-medium">Click to upload screenshot (JPG, PNG, WebP)</span>
                <span className="text-xs text-gray-400 mt-1">Maximum file size: 5MB</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="border border-[#27272A] rounded-2xl p-4 bg-[#18181B]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
                    <CheckCircle size={18} /> Screenshot selected
                  </div>
                  <button 
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="text-gray-400 hover:text-red-400 transition text-xs font-bold flex items-center gap-1"
                  >
                    <XCircle size={16} /> Remove
                  </button>
                </div>
                <div className="bg-black flex justify-center p-3 rounded-xl border border-[#27272A]">
                  <img src={preview} alt="Screenshot Preview" className="max-h-48 object-contain" />
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">{file?.name} ({(file!.size / 1024 / 1024).toFixed(2)} MB)</p>
              </div>
            )}
            
            {error && <p className="text-red-400 text-sm mt-2 font-medium">{error}</p>}
          </div>
          
          <button 
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full btn-primary py-4 text-base tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isUploading ? 'Uploading Screenshot...' : 'Submit Payment Screenshot'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;


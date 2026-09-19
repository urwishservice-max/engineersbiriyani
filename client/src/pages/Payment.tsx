import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UploadCloud, CheckCircle, XCircle } from 'lucide-react';

interface OrderDetails {
  orderId: string;
  payment: {
    amount: number;
    status: string;
  };
  product: {
    quantity: number;
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
  
  const upiId = import.meta.env.VITE_UPI_ID || 'amjathali003-1@okicici';

  useEffect(() => {
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
    
    const formData = new FormData();
    formData.append('screenshot', file);
    
    const apiBase = import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com';
    let uploadedSuccessfully = false;
    let serverUpdatedOrder: any = null;

    // Retry up to 3 times to ensure upload to backend MongoDB
    let attempts = 3;
    while (attempts > 0 && !uploadedSuccessfully) {
      try {
        const response = await axios.post(`${apiBase}/api/orders/${orderId}/payment-screenshot`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 20000
        });
        
        if (response.data?.success) {
          uploadedSuccessfully = true;
          serverUpdatedOrder = response.data.data;
          break;
        }
      } catch (err: any) {
        console.warn(`Backend upload screenshot attempt ${4 - attempts} failed:`, err);
        attempts--;
        if (attempts > 0) {
          await new Promise(res => setTimeout(res, 1500));
        }
      }
    }

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
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    if (uploadedSuccessfully && serverUpdatedOrder) {
      updateLocalStorageOrder({
        payment: serverUpdatedOrder.payment,
        orderStatus: serverUpdatedOrder.orderStatus
      });
      setIsUploading(false);
      navigate(`/order-success/${orderId}`);
      return;
    }

    // Failsafe Fallback: Convert screenshot image file to Base64 Data URL for local persistence
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Url = reader.result as string;
      updateLocalStorageOrder({
        payment: {
          method: 'UPI',
          amount: order?.payment?.amount || 0,
          status: 'SCREENSHOT_UPLOADED',
          screenshotUrl: base64Url,
          uploadedAt: new Date().toISOString()
        },
        orderStatus: 'PAYMENT_VERIFICATION'
      });
      setIsUploading(false);
      navigate(`/order-success/${orderId}`);
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return <div className="flex-1 flex justify-center items-center pt-28 bg-black text-[#FFB800] font-bold">Loading payment details...</div>;
  }

  if (!order) {
    return <div className="flex-1 flex justify-center items-center pt-28 text-red-500 font-bold bg-black">{error}</div>;
  }

  return (
    <div className="flex-1 flex flex-col items-center pt-28 pb-16 px-4 w-full bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-[#FFB800]">Payment Required</h1>
      
      <div className="brand-card w-full max-w-xl p-8 mt-4 border border-[#FFB800]/40 shadow-[0_0_35px_rgba(255,107,0,0.15)] bg-[#121212]">
        <div className="text-center mb-8 pb-6 border-b border-[#27272A]">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Order ID</p>
          <p className="font-mono text-xl font-bold text-white">{order.orderId}</p>
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


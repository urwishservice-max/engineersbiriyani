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
  
  // Realistically this would be from backend config
  const upiId = 'business@upi';

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
        if (response.data.success) {
          setOrder(response.data.data);
          
          if (response.data.data.payment.status !== 'PAYMENT_PENDING') {
            navigate(`/order-success/${orderId}`);
          }
        }
      } catch (err) {
        setError('Failed to fetch order details. Invalid Order ID.');
      } finally {
        setLoading(false);
      }
    };
    
    if (orderId) fetchOrder();
  }, [orderId, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError('');
    
    if (selectedFile) {
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(selectedFile.type)) {
        setError('Please upload a valid image file (JPG, PNG, WebP)');
        return;
      }
      
      // Validate file size (max 5MB)
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
    
    try {
      const response = await axios.post(`http://localhost:5000/api/orders/${orderId}/payment-screenshot`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        navigate(`/order-success/${orderId}`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to upload screenshot. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return <div className="flex-1 flex justify-center items-center pt-28">Loading payment details...</div>;
  }

  if (!order) {
    return <div className="flex-1 flex justify-center items-center pt-28 text-red-500">{error}</div>;
  }

  return (
    <div className="flex-1 flex flex-col items-center pt-28 pb-16 px-4 w-full">
      <h1 className="font-serif text-4xl mb-4">Payment Required</h1>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-full max-w-xl p-8 mt-6">
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm mb-1">Order ID</p>
          <p className="font-mono text-lg font-semibold">{order.orderId}</p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-md mb-8 text-center border border-gray-100">
          <p className="text-gray-500 mb-2">Amount to Pay</p>
          <p className="text-4xl font-bold text-black">₹{order.payment.amount}</p>
        </div>
        
        <div className="flex flex-col items-center mb-10">
          <h2 className="font-semibold text-lg mb-4 uppercase tracking-wider">Scan & Pay</h2>
          
          {/* We are using the uploaded qr.jpeg from frontend/public */}
          <div className="w-48 h-48 border-2 border-gray-200 rounded-lg p-2 mb-4 bg-white flex items-center justify-center overflow-hidden">
            <img src="/qr.jpeg" alt="UPI QR Code" className="w-full h-full object-contain" />
          </div>
          
          <div className="text-center">
            <p className="text-gray-500 text-sm">UPI ID:</p>
            <p className="font-medium text-lg bg-gray-100 px-4 py-2 rounded-md mt-1 select-all">{upiId}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8">
          <h3 className="font-semibold mb-4 text-center">Payment Instructions</h3>
          <ol className="list-decimal list-inside text-gray-600 text-sm space-y-2 mb-8">
            <li>Open Google Pay / PhonePe / Paytm / BHIM or another UPI app.</li>
            <li>Scan the QR code or use the UPI ID above.</li>
            <li>Pay exactly <strong>₹{order.payment.amount}</strong>.</li>
            <li>Complete the payment and take a screenshot.</li>
            <li>Upload the screenshot below.</li>
          </ol>
          
          <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md text-sm text-center mb-8 flex items-center justify-center gap-2">
            <span className="font-semibold">Note:</span> Your order will be confirmed only after payment is manually verified.
          </div>
          
          {/* Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Payment Screenshot</label>
            
            {!preview ? (
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
                <UploadCloud className="text-gray-400 mb-3" size={32} />
                <span className="text-sm text-gray-600">Click to upload JPG, PNG, or WebP</span>
                <span className="text-xs text-gray-400 mt-1">Max size: 5MB</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle size={16} /> Screenshot selected
                  </div>
                  <button 
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="text-gray-500 hover:text-red-500 transition text-sm flex items-center gap-1"
                  >
                    <XCircle size={16} /> Remove
                  </button>
                </div>
                <div className="bg-gray-50 flex justify-center p-2 rounded-md">
                  <img src={preview} alt="Screenshot Preview" className="max-h-48 object-contain" />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">{file?.name} ({(file!.size / 1024 / 1024).toFixed(2)} MB)</p>
              </div>
            )}
            
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          
          <button 
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full bg-black text-white py-4 rounded-md font-semibold tracking-wider hover:bg-gray-800 transition uppercase text-sm disabled:bg-gray-400 flex justify-center items-center gap-2"
          >
            {isUploading ? (
              <>Uploading...</>
            ) : (
              <>Submit Payment Screenshot</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;

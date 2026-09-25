import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { ShieldCheck, CheckCircle2, Store, Clock, PhoneCall, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

const LOCATIONS = [
  'CIT - Coimbatore Institute of Technology, Peelamedu',
  'PSG - PSG Institute of Technology, Peelamedu',
  'Krishnamaal clg of Arts and Science, Peelamedu',
];

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  location: z.string().min(1, 'Delivery location is required'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const OPTIONS = {
  '600g': { name: 'Chicken Biriyani (600g)', price: 129, desc: '2 pieces' },
  '1200g': { name: 'Chicken Biriyani (1200g)', price: 249, desc: '3 to 4 pieces' }
};

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(parseInt(searchParams.get('qty') || '1', 10));
  const paramType = searchParams.get('type');
  const initialOption: '600g' | '1200g' = (paramType === '600g' || paramType === '1200g') ? paramType : '1200g';
  const [optionType, setOptionType] = useState<'600g' | '1200g'>(initialOption);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // Store ordering status - default to true (CLOSED) until admin opens orders
  const [isOrdersClosed, setIsOrdersClosed] = useState<boolean>(() => localStorage.getItem('store_orders_closed') !== 'false');
  const [closedMessage, setClosedMessage] = useState<string>('Orders are currently closed. Please check back later!');
  const [checkingStatus, setCheckingStatus] = useState<boolean>(false);

  const fetchStoreStatus = async () => {
    setCheckingStatus(true);
    const apiBase = import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com';
    try {
      const res = await axios.get(`${apiBase}/api/orders/store-status`, { timeout: 6000 });
      if (res.data?.success && typeof res.data?.data?.isOrdersClosed === 'boolean') {
        setIsOrdersClosed(res.data.data.isOrdersClosed);
        if (res.data.data.closedMessage) {
          setClosedMessage(res.data.data.closedMessage);
        }
        localStorage.setItem('store_orders_closed', String(res.data.data.isOrdersClosed));
      }
    } catch (err) {
      console.warn('Could not fetch store status, falling back to cached value:', err);
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    fetchStoreStatus();
    const handleStorageChange = () => {
      setIsOrdersClosed(localStorage.getItem('store_orders_closed') !== 'false');
    };
    window.addEventListener('store_status_changed', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('store_status_changed', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const currentOption = OPTIONS[optionType];
  const totalAmount = currentOption.price * quantity;

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      location: 'CIT - Coimbatore Institute of Technology, Peelamedu',
    }
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    if (isOrdersClosed) {
      setApiError('Orders are currently closed. We are not accepting new orders at this moment.');
      return;
    }
    setIsSubmitting(true);
    setApiError('');
    try {
      localStorage.setItem('customerPhone', data.phone);
      const apiBase = import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com';
      
      const customerPayload = {
        ...data,
        city: 'Coimbatore',
        pincode: '641014',
        address: data.location,
      };

      let createdOrderId = '';
      let createdOrderData: any = null;

      // Retry up to 3 times to ensure connection to database (handles server cold-starts)
      let attempts = 3;
      while (attempts > 0 && !createdOrderId) {
        try {
          const response = await axios.post(`${apiBase}/api/orders`, {
            customer: customerPayload,
            quantity,
            optionType,
          }, { timeout: 12000 });
          
          if (response.data?.success && response.data?.data?.orderId) {
            createdOrderId = response.data.data.orderId;
            createdOrderData = response.data.data;
            break;
          }
        } catch (err) {
          console.warn(`Backend API order creation attempt ${4 - attempts} failed:`, err);
          attempts--;
          if (attempts > 0) {
            await new Promise(res => setTimeout(res, 1500));
          }
        }
      }

      if (createdOrderData) {
        // Cache created server order locally so admin and user views are instant
        localStorage.setItem(`order_${createdOrderId}`, JSON.stringify(createdOrderData));
        const existingOrdersStr = localStorage.getItem('local_orders');
        const existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
        const exists = existingOrders.some((o: any) => o.orderId === createdOrderId);
        if (!exists) {
          existingOrders.unshift(createdOrderData);
          localStorage.setItem('local_orders', JSON.stringify(existingOrders));
        }
      } else {
        // Failsafe Fallback: Create client order locally if server was completely unreachable
        const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        createdOrderId = `BRY-${dateStr}-${randomStr}`;

        const fallbackOrder = {
          orderId: createdOrderId,
          customer: customerPayload,
          product: {
            name: currentOption.name,
            quantity,
            unitPrice: currentOption.price,
            totalAmount,
            weight: optionType,
            pieces: optionType === '600g' ? '2 pieces' : '3 to 4 pieces',
            breadHalwa: false,
          },
          payment: {
            method: 'UPI',
            amount: totalAmount,
            status: 'PAYMENT_PENDING',
          },
          orderStatus: 'PAYMENT_PENDING',
          createdAt: new Date().toISOString(),
        };

        localStorage.setItem(`order_${createdOrderId}`, JSON.stringify(fallbackOrder));

        const existingOrdersStr = localStorage.getItem('local_orders');
        const existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
        existingOrders.unshift(fallbackOrder);
        localStorage.setItem('local_orders', JSON.stringify(existingOrders));
      }

      navigate(`/payment/${createdOrderId}`);
    } catch (error: any) {
      console.error('Checkout Submit Error:', error);
      setApiError(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isOrdersClosed) {
    return (
      <div className="w-full bg-black min-h-screen text-white font-sans">
        {/* PAGE HEADER */}
        <section className="bg-gradient-to-b from-black via-[#080808] to-[#0A0A0A] min-h-[25vh] flex flex-col justify-center pt-24 relative overflow-hidden text-center px-6 border-b border-[#27272A]">
          <div className="relative z-10 max-w-3xl mx-auto py-8">
            <span className="eyebrow mx-auto justify-center flex mb-3 text-red-400 font-extrabold tracking-widest uppercase text-xs">
              — NOTICE —
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-red-500 mb-3 leading-tight font-serif">
              Orders Are Closed
            </h1>
            <p className="text-gray-400 text-base flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-red-400" />
              We are currently not taking new bookings.
            </p>
          </div>
        </section>

        {/* CLOSED CONTENT */}
        <section className="py-20 px-6 md:px-12 bg-[#0A0A0A] flex items-center justify-center">
          <div className="max-w-2xl w-full mx-auto text-center">
            <div className="bg-[#121212] border border-red-500/30 rounded-3xl p-8 md:p-12 shadow-[0_10px_40px_rgba(239,68,68,0.15)] relative overflow-hidden">
              <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6 text-red-400 shadow-inner">
                <Store size={38} className="text-red-400" />
              </div>

              <div className="inline-block px-4 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest mb-4 border border-red-500/30">
                Kitchen Currently Offline
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                We're Not Accepting Orders Right Now
              </h2>

              <div className="inline-block px-4 py-1.5 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800] text-xs font-bold mb-4">
                Next Delivery Batch: Sunday, 27-Sep-26
              </div>

              <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-lg mx-auto">
                {closedMessage}
              </p>

              <div className="bg-[#18181B] p-5 rounded-2xl border border-white/10 mb-8 text-left flex items-start gap-4">
                <div className="p-2 rounded-xl bg-[#FFB800]/10 text-[#FFB800] mt-0.5">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Already placed an order?</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Don't worry! Your confirmed order is being freshly prepared. You can track your existing order anytime with your mobile number.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/track"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#FFB800] hover:bg-[#ffc633] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  Track Existing Order <ArrowRight size={16} />
                </Link>
                <Link
                  to="/menu"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#27272A] hover:bg-[#333338] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 transition"
                >
                  Explore Menu
                </Link>
                <button
                  onClick={fetchStoreStatus}
                  disabled={checkingStatus}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-xs flex items-center justify-center gap-2 border border-white/5 transition"
                  title="Check if admin opened orders"
                >
                  <RefreshCw size={14} className={checkingStatus ? 'animate-spin text-[#FFB800]' : ''} />
                  {checkingStatus ? 'Checking...' : 'Check Status'}
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-gray-400">
                <PhoneCall size={14} className="text-[#FFB800]" />
                <span>Need assistance? <Link to="/contact" className="text-[#FFB800] underline font-bold">Contact Support</Link></span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full bg-black min-h-screen text-white font-sans">
      
      {/* PAGE HEADER */}
      <section className="bg-gradient-to-b from-black via-[#080808] to-[#0A0A0A] min-h-[25vh] flex flex-col justify-center pt-24 relative overflow-hidden text-center px-6 border-b border-[#27272A]">
        <div className="relative z-10 max-w-3xl mx-auto py-8">
          <span className="eyebrow mx-auto justify-center flex mb-2">— ALMOST THERE —</span>
          <div className="inline-flex items-center gap-2 bg-[#FFB800]/20 border border-[#FFB800]/50 text-[#FFB800] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 mx-auto">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>Delivery Date: Sunday, 27-Sep-26 (Lunch)</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#FFB800] mb-3 leading-tight">
            Secure Checkout
          </h1>
          <p className="text-white text-base flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#FFB800]" />
            Fast, secure, and encrypted.
          </p>
        </div>
      </section>

      {/* CHECKOUT CONTENT */}
      <section className="py-16 px-6 md:px-12 bg-[#0A0A0A] relative z-10">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* Checkout Form */}
          <div className="w-full lg:w-7/12">
            <div className="brand-card p-6 md:p-10 shadow-2xl border border-[#27272A] bg-[#121212]">
              <h2 className="text-2xl font-bold text-[#FFB800] mb-6 pb-4 border-b border-[#27272A]">Delivery Details</h2>
              
              {/* Delivery Date Notice */}
              <div className="flex items-center justify-between bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-xl px-4 py-3 mb-6">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-[#FFB800]" />
                  <div>
                    <span className="text-xs text-gray-400 block">Scheduled Delivery</span>
                    <span className="text-sm font-bold text-white">Sunday, 27-Sep-26 (Lunch)</span>
                  </div>
                </div>
                <span className="bg-[#FFB800] text-black font-extrabold text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider">Confirmed Slot</span>
              </div>
              
              {apiError && (
                <div className="bg-red-950/80 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-8 text-sm flex items-start gap-3">
                  <div className="mt-0.5"><ShieldCheck className="w-4 h-4 text-red-400"/></div>
                  <span>{apiError}</span>
                </div>
              )}

              <div className="mb-10">
                <label className="block text-sm font-bold text-[#FFB800] mb-4 uppercase tracking-wider">Select Portion</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setOptionType('600g')}
                    className={`border-2 p-5 rounded-xl cursor-pointer transition-all relative overflow-hidden ${optionType === '600g' ? 'border-[#FFB800] bg-[#FFB800]/10 shadow-[0_0_15px_rgba(255,107,0,0.2)]' : 'border-[#27272A] bg-[#18181B] hover:border-[#FFB800]/50'}`}
                  >
                    {optionType === '600g' && <div className="absolute top-0 right-0 bg-[#FFB800] text-black font-extrabold rounded-bl-lg p-1.5"><CheckCircle2 className="w-4 h-4"/></div>}
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-white">600g Box</span>
                      <span className="font-bold text-xl text-[#FFB800]">₹129</span>
                    </div>
                    <p className="text-xs text-gray-300">2 pieces chicken</p>
                  </div>
                  
                  <div 
                    onClick={() => setOptionType('1200g')}
                    className={`border-2 p-5 rounded-xl cursor-pointer transition-all relative overflow-hidden ${optionType === '1200g' ? 'border-[#FFB800] bg-[#FFB800]/10 shadow-[0_0_15px_rgba(255,107,0,0.2)]' : 'border-[#27272A] bg-[#18181B] hover:border-[#FFB800]/50'}`}
                  >
                    {optionType === '1200g' && <div className="absolute top-0 right-0 bg-[#FFB800] text-black font-extrabold rounded-bl-lg p-1.5"><CheckCircle2 className="w-4 h-4"/></div>}
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-white">1200g Bucket</span>
                      <span className="font-bold text-xl text-[#FFB800]">₹249</span>
                    </div>
                    <p className="text-xs text-gray-300">3-4 pieces</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#FFB800] mb-2">Full Name</label>
                    <input 
                      {...register('name')}
                      type="text" 
                      className="w-full p-3.5 rounded-lg border border-[#27272A] bg-[#18181B] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFB800] transition-colors text-sm"
                      placeholder="Arun Kumar"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1 font-medium">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#FFB800] mb-2">Phone Number</label>
                    <input 
                      {...register('phone')}
                      type="tel" 
                      className="w-full p-3.5 rounded-lg border border-[#27272A] bg-[#18181B] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFB800] transition-colors text-sm"
                      placeholder="9876543210"
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1 font-medium">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#FFB800] mb-2">Select Delivery Location</label>
                  <select
                    {...register('location')}
                    className="w-full p-3.5 rounded-lg border border-[#27272A] bg-[#18181B] text-white focus:outline-none focus:border-[#FFB800] transition-colors text-sm"
                  >
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc} className="bg-[#18181B] text-white">
                        {loc}
                      </option>
                    ))}
                  </select>
                  {errors.location && <p className="text-red-400 text-xs mt-1 font-medium">{errors.location.message}</p>}
                </div>

                <div className="pt-6 border-t border-[#27272A]">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full btn-primary flex justify-center items-center h-14 text-base"
                  >
                    {isSubmitting ? 'Processing Order...' : 'Proceed to Payment'}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#FFB800]" /> 100% Secure & Encrypted Payment
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-5/12">
            <div className="brand-card p-6 md:p-8 sticky top-28 bg-[#121212] border border-[#FFB800]/40 shadow-[0_0_25px_rgba(255,107,0,0.1)]">
              <h3 className="text-2xl font-bold text-[#FFB800] mb-6 pb-4 border-b border-[#27272A]">Order Summary</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <span className="font-bold text-white block mb-1">{currentOption.name}</span>
                    <span className="text-xs text-gray-400">{currentOption.desc}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#FFB800] block">₹{currentOption.price}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center bg-[#18181B] p-3 rounded-xl border border-[#27272A]">
                  <span className="text-sm font-bold text-[#FFB800] pl-2">Quantity</span>
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full bg-[#27272A] flex items-center justify-center text-white hover:bg-[#FFB800] hover:text-black font-bold transition-colors"
                    >-</button>
                    <span className="w-8 text-center font-bold text-white text-lg">{quantity}</span>
                    <button 
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full bg-[#27272A] flex items-center justify-center text-white hover:bg-[#FFB800] hover:text-black font-bold transition-colors"
                    >+</button>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#27272A] space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300 font-medium">Subtotal</span>
                    <span className="font-bold text-white">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300 font-medium">Delivery</span>
                    <span className="font-bold text-[#FFB800]">Free / Standard</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300 font-medium">Delivery Date</span>
                    <span className="font-bold text-[#FFB800]">27-Sep-26 (Sunday)</span>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-[#27272A] flex justify-between items-end">
                  <div>
                    <span className="block font-bold text-[#FFB800] text-sm mb-1">Total Payable</span>
                    <span className="block text-xs text-gray-400">Inclusive of all taxes</span>
                  </div>
                  <span className="font-bold text-4xl text-[#FFB800]">₹{totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Checkout;


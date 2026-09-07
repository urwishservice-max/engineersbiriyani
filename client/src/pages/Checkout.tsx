import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { ShieldCheck, ChevronDown, CheckCircle2 } from 'lucide-react';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  address: z.string().min(5, 'Delivery address is required'),
  landmark: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Please enter a valid 6-digit pincode'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const OPTIONS = {
  '600g': { name: 'Chicken Biriyani (600g)', price: 130, desc: '2 pieces' },
  '1200g': { name: 'Chicken Biriyani (1200g)', price: 250, desc: '3 to 4 pieces + Bread Halwa' }
};

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(parseInt(searchParams.get('qty') || '1', 10));
  const [optionType, setOptionType] = useState<'600g' | '1200g'>('1200g');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const currentOption = OPTIONS[optionType];
  const totalAmount = currentOption.price * quantity;

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    setApiError('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com'}/api/orders`, {
        customer: data,
        quantity,
        optionType,
      });
      
      if (response.data.success) {
        navigate(`/payment/${response.data.data.orderId}`);
      }
    } catch (error: any) {
      console.error(error);
      setApiError(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-brand-cream min-h-screen">
      
      {/* PAGE HEADER */}
      <section className="bg-brand-dark min-h-[30vh] flex flex-col justify-center pt-20 relative overflow-hidden text-center px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent z-0"></div>
        <div className="relative z-10 max-w-3xl mx-auto py-12">
          <span className="eyebrow mx-auto justify-center flex mb-4">— Almost There —</span>
          <h1 className="text-4xl md:text-[52px] font-serif font-bold text-white mb-4 leading-tight">
            Secure Checkout
          </h1>
          <p className="text-brand-text-muted-light text-lg flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-orange" />
            Fast, secure, and easy.
          </p>
        </div>
      </section>

      {/* CHECKOUT CONTENT */}
      <section className="py-16 px-6 md:px-12 bg-brand-cream relative z-10">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* Checkout Form */}
          <div className="w-full lg:w-7/12">
            <div className="brand-card p-6 md:p-10 shadow-xl">
              <h2 className="text-2xl font-serif font-bold text-brand-text-dark mb-8 pb-4 border-b border-brand-border-soft">Delivery Details</h2>
              
              {apiError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-8 text-sm flex items-start gap-3">
                  <div className="mt-0.5"><ShieldCheck className="w-4 h-4"/></div>
                  <span>{apiError}</span>
                </div>
              )}

              <div className="mb-10">
                <label className="block text-sm font-bold text-brand-text-dark mb-4">Select Option</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setOptionType('600g')}
                    className={`border-2 p-5 rounded-xl cursor-pointer transition-all relative overflow-hidden ${optionType === '600g' ? 'border-brand-orange bg-brand-orange/5' : 'border-brand-border-soft bg-white hover:border-brand-orange/50'}`}
                  >
                    {optionType === '600g' && <div className="absolute top-0 right-0 bg-brand-orange text-white rounded-bl-lg p-1.5"><CheckCircle2 className="w-4 h-4"/></div>}
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-brand-text-dark">600g Box</span>
                      <span className="font-serif font-bold text-xl text-brand-dark">₹130</span>
                    </div>
                    <p className="text-sm text-brand-text-muted-dark">2 pieces chicken</p>
                  </div>
                  
                  <div 
                    onClick={() => setOptionType('1200g')}
                    className={`border-2 p-5 rounded-xl cursor-pointer transition-all relative overflow-hidden ${optionType === '1200g' ? 'border-brand-orange bg-brand-orange/5' : 'border-brand-border-soft bg-white hover:border-brand-orange/50'}`}
                  >
                    {optionType === '1200g' && <div className="absolute top-0 right-0 bg-brand-orange text-white rounded-bl-lg p-1.5"><CheckCircle2 className="w-4 h-4"/></div>}
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-brand-text-dark">1200g Bucket</span>
                      <span className="font-serif font-bold text-xl text-brand-dark">₹250</span>
                    </div>
                    <p className="text-sm text-brand-text-muted-dark">3-4 pieces + Bread Halwa</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-brand-text-dark mb-2">Full Name</label>
                    <input 
                      {...register('name')}
                      type="text" 
                      className="w-full p-4 rounded-lg border border-brand-border-soft bg-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-shadow"
                      placeholder="Arun Kumar"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-brand-text-dark mb-2">Phone Number</label>
                    <input 
                      {...register('phone')}
                      type="tel" 
                      className="w-full p-4 rounded-lg border border-brand-border-soft bg-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-shadow"
                      placeholder="9876543210"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-brand-text-dark mb-2">Delivery Address</label>
                  <textarea 
                    {...register('address')}
                    className="w-full p-4 rounded-lg border border-brand-border-soft bg-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-shadow min-h-[100px] resize-y"
                    placeholder="Flat No, Building, Street"
                  ></textarea>
                  {errors.address && <p className="text-red-500 text-xs mt-1 font-medium">{errors.address.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-brand-text-dark mb-2">Landmark <span className="text-brand-text-muted-dark font-normal">(Optional)</span></label>
                  <input 
                    {...register('landmark')}
                    type="text" 
                    className="w-full p-4 rounded-lg border border-brand-border-soft bg-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-shadow"
                    placeholder="Near Apollo Hospital"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-brand-text-dark mb-2">City</label>
                    <input 
                      {...register('city')}
                      type="text" 
                      className="w-full p-4 rounded-lg border border-brand-border-soft bg-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-shadow"
                      placeholder="Coimbatore"
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1 font-medium">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-brand-text-dark mb-2">Pincode</label>
                    <input 
                      {...register('pincode')}
                      type="text" 
                      className="w-full p-4 rounded-lg border border-brand-border-soft bg-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-shadow"
                      placeholder="641001"
                    />
                    {errors.pincode && <p className="text-red-500 text-xs mt-1 font-medium">{errors.pincode.message}</p>}
                  </div>
                </div>

                <div className="pt-6 border-t border-brand-border-soft">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full btn-primary flex justify-center items-center h-14 text-base"
                  >
                    {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                  </button>
                  <p className="text-center text-xs text-brand-text-muted-dark mt-4 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-brand-orange" /> Secure encrypted checkout
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-5/12">
            <div className="brand-card p-6 md:p-8 sticky top-28 bg-[#EFE6D8] border border-brand-border-soft/50 shadow-lg">
              <h3 className="text-2xl font-serif font-bold text-brand-text-dark mb-6 pb-4 border-b border-brand-border-soft/60">Order Summary</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <span className="font-bold text-brand-text-dark block mb-1">{currentOption.name}</span>
                    <span className="text-sm text-brand-text-muted-dark">{currentOption.desc}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-brand-text-dark block">₹{currentOption.price}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-brand-border-soft">
                  <span className="text-sm font-bold text-brand-text-dark pl-3">Quantity</span>
                  <div className="flex items-center">
                    <button 
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-brand-text-dark hover:bg-brand-cream transition-colors"
                    >-</button>
                    <span className="w-8 text-center font-bold text-brand-text-dark">{quantity}</span>
                    <button 
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-brand-text-dark hover:bg-brand-cream transition-colors"
                    >+</button>
                  </div>
                </div>

                <div className="pt-6 border-t border-brand-border-soft/60 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-brand-text-muted-dark font-medium">Subtotal</span>
                    <span className="font-bold text-brand-text-dark">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-brand-text-muted-dark font-medium">Delivery</span>
                    <span className="font-bold text-brand-orange">Calculated at next step</span>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-brand-border-soft/60 flex justify-between items-end">
                  <div>
                    <span className="block font-bold text-brand-text-dark text-sm mb-1">Total Payable</span>
                    <span className="block text-xs text-brand-text-muted-dark">Incl. of all taxes</span>
                  </div>
                  <span className="font-serif font-bold text-4xl text-brand-dark">₹{totalAmount}</span>
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

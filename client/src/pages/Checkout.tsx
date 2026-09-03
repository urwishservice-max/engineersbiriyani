import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';

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
      const response = await axios.post('http://localhost:5000/api/orders', {
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
    <div className="flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full pt-28 pb-16 px-4 gap-8 relative z-10">
      
      {/* Checkout Form */}
      <div className="flex-1 bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100">
        <h2 className="font-serif text-3xl mb-6">Delivery Details</h2>
        
        {apiError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 text-sm">
            {apiError}
          </div>
        )}

        <div className="mb-8">
          <label className="block text-sm text-gray-600 mb-3">Select Option *</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => setOptionType('600g')}
              className={`border p-4 rounded-lg cursor-pointer transition ${optionType === '600g' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">600g Box</span>
                <span className="font-bold">₹130</span>
              </div>
              <p className="text-sm text-gray-500">2 pieces chicken</p>
            </div>
            
            <div 
              onClick={() => setOptionType('1200g')}
              className={`border p-4 rounded-lg cursor-pointer transition ${optionType === '1200g' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">1200g Bucket</span>
                <span className="font-bold">₹250</span>
              </div>
              <p className="text-sm text-gray-500">3-4 pieces + Bread Halwa</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Full Name *</label>
            <input 
              {...register('name')}
              type="text" 
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:border-black transition"
              placeholder="Arun Kumar"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone Number *</label>
            <input 
              {...register('phone')}
              type="tel" 
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:border-black transition"
              placeholder="9876543210"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Delivery Address *</label>
            <textarea 
              {...register('address')}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:border-black transition min-h-[80px]"
              placeholder="Flat No, Building, Street"
            ></textarea>
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Landmark (Optional)</label>
            <input 
              {...register('landmark')}
              type="text" 
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:border-black transition"
              placeholder="Near Apollo Hospital"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">City *</label>
              <input 
                {...register('city')}
                type="text" 
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:border-black transition"
                placeholder="Coimbatore"
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Pincode *</label>
              <input 
                {...register('pincode')}
                type="text" 
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:border-black transition"
                placeholder="641001"
              />
              {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-black text-white py-4 mt-6 rounded-md font-semibold tracking-wider hover:bg-gray-800 transition uppercase text-sm disabled:bg-gray-400"
          >
            {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="md:w-[350px] w-full">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-28">
          <h3 className="font-serif text-2xl mb-6">Order Summary</h3>
          
          <div className="flex justify-between items-start mb-4 text-sm">
            <span className="text-gray-600 mt-1">Product:</span>
            <div className="text-right">
              <span className="font-medium block">{currentOption.name}</span>
              <span className="text-xs text-gray-500 block">{currentOption.desc}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4 text-sm">
            <span className="text-gray-600">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-md bg-white">
              <button 
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
              >-</button>
              <span className="px-3 py-1 font-medium border-x border-gray-300">{quantity}</span>
              <button 
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
              >+</button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6 text-sm">
            <span className="text-gray-600">Price:</span>
            <span className="font-medium">₹{currentOption.price} × {quantity}</span>
          </div>
          
          <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
            <span className="font-semibold text-lg">Total:</span>
            <span className="font-bold text-xl">₹{totalAmount}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Checkout;

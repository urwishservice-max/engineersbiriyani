import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', phone: '', item: 'chicken' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/checkout');
  };

  return (
    <div className="w-full bg-black min-h-screen font-sans flex flex-col items-center justify-center pt-[80px] text-white">
      
      {/* FORM SECTION */}
      <section className="w-full py-20 px-6 md:px-12 flex flex-col items-center">
        <div className="max-w-[550px] w-full brand-card p-8 md:p-12 text-center flex flex-col items-center border border-[#FFB800]/40 shadow-[0_0_35px_rgba(255,107,0,0.15)]">
            <span className="eyebrow mb-3">PLACE YOUR ORDER</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#FFB800] mb-10">Quick Order Form</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 w-full text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#FFB800] mb-2">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Arun Kumar" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFB800] text-sm transition-colors" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#FFB800] mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="9876543210" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFB800] text-sm transition-colors" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#FFB800] mb-2">Select Item</label>
                <select 
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] text-sm transition-colors" 
                  required 
                >
                  <option value="chicken" className="bg-black text-white">Special Chicken Biryani (1200g - ₹249)</option>
                  <option value="600g" className="bg-black text-white">Chicken Biryani Box (600g - ₹130)</option>
                </select>
              </div>
              <div className="pt-6 text-center flex justify-center">
                <button type="submit" className="w-full btn-primary">
                  CONTINUE TO PAYMENT
                </button>
              </div>
            </form>
        </div>
      </section>

    </div>
  );
};

export default Contact;


import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Leaf, Award, Smile, Heart, ShoppingBag } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Home = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 500], [0, 150]);
  const imageY = useTransform(scrollY, [0, 500], [0, -100]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com'}/api/orders/feedbacks`);
        if (response.data.success && response.data.data.length > 0) {
          setFeedbacks(response.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch feedbacks:', err);
      }
    };
    fetchFeedbacks();
  }, []);

  const handleInlineOrder = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/checkout');
  };

  return (
    <div className="w-full bg-black text-white font-sans overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="min-h-[100vh] flex flex-col items-center justify-center relative overflow-hidden pt-[80px] bg-gradient-to-b from-black via-[#080808] to-black">
        <div className="w-full flex flex-col items-center justify-center relative z-10 h-full max-w-[1400px] mx-auto px-4">
          
          <motion.div style={{ y: textY }} className="text-center z-0 relative flex flex-col items-center justify-center w-full">
            <span className="eyebrow mb-6">Signature Dish</span>
            <h1 className="text-[12vw] md:text-[10vw] font-bold tracking-tight text-[#FFB800] whitespace-nowrap drop-shadow-[0_0_35px_rgba(255,107,0,0.3)]">
              Authentic <span className="text-gradient-orange">Biriyani</span>
            </h1>
            <p className="text-white text-lg md:text-xl font-medium mt-4 max-w-xl text-center">
              Engineering the perfect blend of spice, aroma, and mouth-watering tradition.
            </p>
            <div className="mt-8 flex gap-4">
              <Link to="/checkout" className="btn-primary">
                Order Now <ShoppingBag className="w-4 h-4 ml-1" />
              </Link>
              <Link to="/menu" className="btn-secondary">
                View Menu
              </Link>
            </div>
          </motion.div>
          
          <motion.div style={{ y: imageY }} className="absolute z-10 flex items-center justify-center pointer-events-none w-full max-w-[280px] md:max-w-[380px] aspect-square mt-20">
             <img 
                src="/Chicken-Biryani-Recipe-removebg-preview.png" 
                alt="Signature Biryani" 
                className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(255,107,0,0.25)]"
              />
          </motion.div>
        </div>
      </section>

      {/* MENU PREVIEW SECTION */}
      <section className="py-32 px-6 md:px-12 bg-[#0A0A0A] border-t border-[#27272A]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20">
            <span className="eyebrow">OUR MENU</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#FFB800]">Signature Choices</h2>
          </div>

          {/* Pill Filters */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {['All', 'Biryani', 'Sides'].map((tab, idx) => (
              <button 
                key={tab} 
                className={`text-sm tracking-widest uppercase transition-all font-semibold ${
                  idx === 0 
                    ? 'text-[#FFB800] border-b-2 border-[#FFB800] pb-2' 
                    : 'text-white hover:text-[#FFB800] pb-2'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-[1000px] mx-auto">
            {[
              { name: 'Special Chicken Biryani', price: '₹250', desc: 'Aromatic basmati rice cooked with tender chicken pieces, authentic spices & signature masala.', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=400&auto=format&fit=crop' },
              { name: 'Onion Raita', price: 'Included', desc: 'Cool yogurt mixed with crunchy onions and mild spices. Freshly made daily.', img: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c4?w=400&q=80' },
              { name: 'Kathirikai', price: 'Included', desc: 'Authentic South Indian tangy brinjal gravy. The ultimate side dish.', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80' },
            ].map((item, i) => (
              <div key={i} className="brand-card p-6 flex flex-col items-center text-center group cursor-pointer hover:border-[#FFB800] transition-all duration-300">
                <div className="w-48 h-48 rounded-full overflow-hidden mb-6 relative border-2 border-[#FFB800]/30 group-hover:border-[#FFB800] transition-colors">
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <h3 className="font-bold text-xl text-[#FFB800] mb-3 tracking-wide">{item.name}</h3>
                <p className="text-sm text-white leading-relaxed mb-6 max-w-[250px]">{item.desc}</p>
                <span className="font-bold text-lg text-[#FFB800] mt-auto tracking-wide">{item.price}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link to="/menu" className="btn-secondary">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-32 px-6 md:px-12 bg-black border-t border-[#27272A]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20">
            <span className="eyebrow">WHY CHOOSE US</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#FFB800]">Experience The Best</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1100px] mx-auto">
            {[
              { icon: Heart, title: 'Happy Customers', desc: 'We prioritize your absolute satisfaction with every single meal.' },
              { icon: Leaf, title: 'Healthy & Fresh', desc: 'Cooked with maximum hygiene and premium ingredients for your health.' },
              { icon: Smile, title: 'Customer Friendly', desc: 'Always ready to serve you with promptness and warmth.' },
              { icon: Award, title: 'Authentic Taste', desc: 'Traditional recipes perfected over time for maximum flavor.' },
            ].map((feature, i) => (
              <div key={i} className="brand-card p-8 flex flex-col items-center text-center hover:border-[#FFB800] transition-all">
                <feature.icon className="w-10 h-10 text-[#FFB800] mb-6" strokeWidth={1.5} />
                <h3 className="font-bold text-lg text-[#FFB800] mb-3 tracking-wide">{feature.title}</h3>
                <p className="text-white text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-32 px-6 md:px-12 bg-[#0A0A0A] border-t border-[#27272A]">
        <div className="max-w-[800px] mx-auto text-center">
          <span className="eyebrow">TESTIMONIALS</span>
          <h2 className="text-4xl font-bold text-[#FFB800] mb-12">What Food Lovers Say</h2>
          
          <div className="brand-card p-10 relative border border-[#FFB800]/40 shadow-[0_0_30px_rgba(255,107,0,0.1)]">
            <p className="text-xl md:text-2xl font-normal text-white leading-relaxed italic mb-8">
              "{feedbacks.length > 0 && feedbacks[0]?.feedback?.comment ? feedbacks[0].feedback.comment : "The best biryani I've ever had! Highly recommended for any gathering. The flavor is incredibly authentic and generous."}"
            </p>
            <div className="flex flex-col items-center">
               <h4 className="font-bold text-sm text-[#FFB800] tracking-[0.2em] uppercase">
                 {feedbacks.length > 0 && feedbacks[0]?.customer?.name ? feedbacks[0].customer.name : "Priya Sharma"}
               </h4>
               <span className="text-xs text-gray-400 mt-1">Verified Customer</span>
            </div>
          </div>
        </div>
      </section>

      {/* INLINE ORDER SECTION */}
      <section className="bg-black py-32 px-6 md:px-12 border-t border-[#27272A]">
        <div className="max-w-[800px] mx-auto text-center flex flex-col items-center">
            <span className="eyebrow">PLACE YOUR ORDER</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#FFB800] mb-16">Quick & Easy Order</h2>
            
            <form onSubmit={handleInlineOrder} className="space-y-6 w-full max-w-[450px] brand-card p-8 text-left border border-[#FFB800]/40">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#FFB800] mb-2">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Arun Kumar" 
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFB800] text-sm transition-colors" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#FF6B00] mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="9876543210" 
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF6B00] text-sm transition-colors" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#FF6B00] mb-2">Select Item</label>
                <select className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF6B00] text-sm transition-colors" required>
                  <option value="chicken" className="bg-black text-white">Special Chicken Biryani (₹250)</option>
                  <option value="600g" className="bg-black text-white">Chicken Biryani 600g Box (₹130)</option>
                </select>
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full btn-primary text-center">
                  Continue to Checkout
                </button>
              </div>
            </form>
        </div>
      </section>

    </div>
  );
};

export default Home;


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Star, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Home = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders/feedbacks');
        if (response.data.success && response.data.data.length > 0) {
          setFeedbacks(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch feedbacks:', err);
      }
    };
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    if (feedbacks.length > 1) {
      const interval = setInterval(() => {
        setCurrentFeedbackIndex((prev) => (prev + 1) % feedbacks.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [feedbacks]);

  // Setup Parallax Scroll Tracking
  const { scrollY } = useScroll();
  
  // Parallax transform values
  // We use scrollY to create simple pixel-based parallax relative to scroll position
  const slowScroll = useTransform(scrollY, [0, 1000], [0, -100]);
  const mediumScroll = useTransform(scrollY, [0, 1000], [0, -150]);
  const fastScroll = useTransform(scrollY, [0, 1000], [0, -250]);
  const reverseScroll = useTransform(scrollY, [0, 1000], [0, 50]);

  return (
    <div className="bg-[#f5f0e6] min-h-screen text-[#221e1a] font-sans overflow-hidden">
      
      {/* Hero Bento Section */}
      <div className="max-w-7xl mx-auto px-5 pt-12 md:pt-20 pb-10 flex flex-col lg:flex-row gap-6">
        
        {/* Left Hero Text Box */}
        <motion.div style={{ y: slowScroll }} className="flex-1 flex flex-col justify-center py-10 lg:py-0 z-10">
          <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-bold tracking-tight leading-[1.05] mb-10 text-[#221e1a]">
            FRESH &<br/>DELICIOUS<br/>FOOD FOR<br/>EVERY TASTE
          </h1>
          <div className="flex flex-wrap gap-4">
            <Link to="/checkout" className="bg-[#2a2624] text-white px-8 py-4 rounded-full font-medium hover:bg-black transition-colors shadow-lg">
              Order Now
            </Link>
            <Link to="/menu" className="bg-[#e7dfd3] text-[#2a2624] px-8 py-4 rounded-full font-medium hover:bg-[#d8c8b4] transition-colors flex items-center gap-2 shadow-sm border border-[#e0d6c8]">
              Your Biryani <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>

        {/* Right Hero Image Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ y: reverseScroll }} 
          className="flex-[1.2] rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#d95333] to-[#c13e20] h-[400px] lg:h-[600px] relative p-8 flex items-center justify-center shadow-xl z-0"
        >
          {/* Subtle background decoration */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
          
          <img 
            src="/Chicken-Biryani-Recipe-removebg-preview.png" 
            alt="Exquisite Biryani" 
            className="w-[110%] max-w-none md:w-auto h-auto object-contain drop-shadow-2xl z-10 hover:scale-105 transition-transform duration-700" 
          />
          
          <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
             <Star size={16} fill="#eab308" className="text-yellow-500" />
             <span className="font-semibold text-sm">4.9/5 Rating</span>
          </div>
        </motion.div>
      </div>

      {/* Bento Grid */}
      <div className="max-w-7xl mx-auto px-5 pb-32 grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
        
        {/* Horizontal Banner */}
        <motion.div 
          style={{ y: mediumScroll }} 
          className="col-span-1 md:col-span-12 rounded-full bg-gradient-to-r from-[#2a2624] via-[#5c3022] to-[#de8e34] p-3 flex items-center justify-between overflow-hidden shadow-xl"
        >
          <div className="text-white font-medium pl-6 text-sm md:text-base tracking-wide">Taste the Authenticity</div>
          <div className="flex -space-x-3 pr-2 hidden sm:flex">
            <img src="https://images.unsplash.com/photo-1546833998-877b37c2e5c4?w=100&q=80" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="Dish 1"/>
            <img src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=100&q=80" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="Dish 2"/>
            <img src="https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=100&q=80" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="Dish 3"/>
          </div>
        </motion.div>

        {/* Big Square 1 */}
        <motion.div 
          style={{ y: slowScroll }} 
          className="col-span-1 md:col-span-5 h-[400px] md:h-[500px] rounded-[2.5rem] bg-white overflow-hidden shadow-md relative group"
        >
          <img 
            src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            alt="Spices and Food"
          />
        </motion.div>

        {/* Middle Stack */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
          <motion.div 
            style={{ y: fastScroll }} 
            className="h-[190px] md:h-[240px] rounded-[2.5rem] bg-black p-8 shadow-md flex flex-col justify-end overflow-hidden relative group"
          >
            <img 
              src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&q=80" 
              className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay group-hover:scale-105 transition-transform duration-500" 
              alt="Ingredients"
            />
            <h3 className="font-bold text-3xl relative z-10 text-white tracking-tight">Traditional<br/>Spices</h3>
          </motion.div>
          <motion.div 
            style={{ y: mediumScroll }} 
            className="h-[236px] rounded-[2.5rem] bg-gradient-to-br from-[#e66248] to-[#c9412b] p-8 shadow-md text-white flex flex-col justify-between"
          >
            <h3 className="font-bold text-3xl tracking-tight">Delicious<br/>Flavors</h3>
            <p className="text-white/90 text-sm mt-2 leading-relaxed">Crafted with the perfect blend of ingredients for a memorable feast.</p>
            <Link to="/checkout" className="bg-[#2a2624] text-white px-6 py-2 rounded-full text-sm font-medium w-max mt-4 hover:bg-black transition-colors shadow-lg">Order Now</Link>
          </motion.div>
        </div>

        {/* Right Stack */}
        <div className="col-span-1 md:col-span-3 flex flex-col gap-6">
          <motion.div 
            style={{ y: slowScroll }} 
            className="h-[200px] md:h-[240px] rounded-[2.5rem] bg-[#e4a352] p-8 shadow-md flex flex-col"
          >
            <h3 className="font-bold text-2xl mb-2 text-[#2a2624] tracking-tight">Customer<br/>Favorites</h3>
            <p className="text-sm text-[#5d4f40] mt-auto font-medium">Top rated by our loyal food lovers across the city.</p>
          </motion.div>
          <motion.div 
            style={{ y: fastScroll }} 
            className="h-[236px] rounded-[2.5rem] bg-[#2a2624] p-8 shadow-md text-white relative overflow-hidden"
          >
            <h3 className="font-bold text-2xl relative z-10 tracking-tight">Fast<br/>Delivery</h3>
            <img 
              src="https://images.unsplash.com/photo-1627662236973-4fd8358fa206?w=400&q=80" 
              className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full object-cover opacity-40 mix-blend-luminosity" 
              alt="Fast Delivery"
            />
          </motion.div>
        </div>

        {/* Bottom Row - Reviews (Dynamic) */}
        <motion.div 
          style={{ y: reverseScroll }} 
          className="col-span-1 md:col-span-5 h-[300px] md:h-[350px] rounded-[2.5rem] bg-[#2a2624] p-8 md:p-10 shadow-xl flex flex-col text-white justify-between z-20"
        >
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={24} fill="#eeb367" className="text-[#eeb367]"/>)}
          </div>
          
          {feedbacks.length > 0 ? (
            <div key={feedbacks[currentFeedbackIndex]._id} className="animate-fade-in transition-opacity duration-500 h-full flex flex-col justify-between">
              <p className="text-xl md:text-2xl font-serif italic leading-relaxed line-clamp-4 text-[#f5f0e6]">
                "{feedbacks[currentFeedbackIndex].feedback.comment || 'Amazing taste and excellent service!'}"
              </p>
              <div className="mt-6 border-t border-white/20 pt-4">
                <strong className="block text-base tracking-wide">{feedbacks[currentFeedbackIndex].customer.name}</strong>
                <span className="text-sm text-white/60">{feedbacks[currentFeedbackIndex].customer.city}</span>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-between">
              <p className="text-xl md:text-2xl font-serif italic leading-relaxed line-clamp-4 text-[#f5f0e6]">
                "We ordered Engineer's Biriyani for our family get-together, and they absolutely nailed the authentic taste."
              </p>
              <div className="mt-6 border-t border-white/20 pt-4">
                <strong className="block text-base tracking-wide">Priya Sharma</strong>
                <span className="text-sm text-white/60">Food Blogger, Chennai</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Bottom Row - Text area */}
        <motion.div 
          style={{ y: mediumScroll }} 
          className="col-span-1 md:col-span-7 h-[300px] md:h-[350px] rounded-[2.5rem] bg-white p-8 md:p-12 shadow-md flex flex-col justify-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-[#221e1a]">Fresh delicious food<br/>every taste</h2>
          <p className="text-[#5d4f40] text-lg leading-relaxed max-w-2xl font-medium">
            We prepare and deliver authentic culinary experiences that not only delight your taste buds but also bring people together for memorable feasts. From traditional biryani to delicious sides, experience perfection in every bite.
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default Home;

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Zap, Leaf, Award, Smile, Heart } from 'lucide-react';
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
          setFeedbacks(response.data.data.slice(0, 3)); // Only take up to 3 for the row
        }
      } catch (err) {
        console.error('Failed to fetch feedbacks:', err);
      }
    };
    fetchFeedbacks();
  }, []);

  const handleInlineOrder = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/checkout'); // Direct to real checkout
  };

  return (
    <div className="w-full bg-brand-cream font-sans">
      {/* HERO SECTION */}
      <section className="min-h-[100vh] flex flex-col items-center justify-center relative overflow-hidden pt-[80px]">
        
        <div className="w-full flex flex-col items-center justify-center relative z-10 h-full max-w-[1400px] mx-auto">
          
          <motion.div style={{ y: textY }} className="text-center z-0 relative flex flex-col items-center justify-center w-full">
            <span className="eyebrow mb-8">Signature Dish</span>
            <h1 className="text-[12vw] md:text-[10vw] font-[200] tracking-tight text-brand-text-dark whitespace-nowrap">
              Authentic <span className="text-gradient-orange">Biriyani</span>
            </h1>
          </motion.div>
          
          <motion.div style={{ y: imageY }} className="absolute z-10 flex items-center justify-center pointer-events-none w-full max-w-[280px] md:max-w-[350px] aspect-square">
             <img 
                src="/Chicken-Biryani-Recipe-removebg-preview.png" 
                alt="Signature Biryani" 
                className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.05)]"
              />
          </motion.div>
        </div>
      </section>

      {/* MENU PREVIEW SECTION */}
      <section className="py-32 px-6 md:px-12 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-24">
            <span className="eyebrow">OUR MENU</span>
            <h2 className="text-4xl md:text-5xl font-[300] tracking-tight text-brand-text-dark">Signature Choices</h2>
          </div>

          {/* Pill Filters */}
          <div className="flex flex-wrap justify-center gap-8 mb-20">
            {['All', 'Biryani', 'Sides'].map((tab, idx) => (
              <button 
                key={tab} 
                className={`text-sm tracking-widest uppercase transition-all ${
                  idx === 0 
                    ? 'text-brand-text-dark font-medium border-b border-brand-text-dark pb-2' 
                    : 'text-[#888888] hover:text-brand-text-dark pb-2'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 max-w-[1000px] mx-auto">
            {[
              { name: 'Special Chicken Biryani', price: '₹250', desc: 'Aromatic basmati rice with tender chicken pieces.', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=400&auto=format&fit=crop' },
              { name: 'Onion Raita', price: 'Included', desc: 'Cool yogurt mixed with crunchy onions and mild spices.', img: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c4?w=400&q=80' },
              { name: 'Kathirikai', price: 'Included', desc: 'Authentic South Indian tangy brinjal gravy.', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center group cursor-pointer">
                <div className="w-56 h-56 rounded-full overflow-hidden mb-8 relative bg-gray-100">
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h3 className="font-[400] text-xl text-brand-text-dark mb-3 tracking-wide">{item.name}</h3>
                <p className="text-sm text-[#888888] leading-relaxed mb-6 max-w-[250px]">{item.desc}</p>
                <span className="font-light text-lg text-brand-text-dark mt-auto tracking-wide">{item.price}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-20">
            <Link to="/menu" className="text-sm tracking-widest uppercase border-b border-brand-text-dark text-brand-text-dark pb-1 hover:text-[#888888] hover:border-[#888888] transition-colors duration-300">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-32 px-6 md:px-12 bg-brand-cream">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-24">
            <span className="eyebrow">WHY CHOOSE US</span>
            <h2 className="text-4xl md:text-5xl font-[300] tracking-tight text-brand-text-dark">Experience The Best</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 max-w-[1000px] mx-auto">
            {[
              { icon: Heart, title: 'Happy Customers', desc: 'We prioritize your satisfaction with every single meal.' },
              { icon: Leaf, title: 'Healthy & Fresh', desc: 'Cooked with hygiene and quality ingredients for your well-being.' },
              { icon: Smile, title: 'Customer Friendly', desc: 'Always ready to serve you with a warm smile.' },
              { icon: Award, title: 'Authentic Taste', desc: 'Traditional recipes passed down through generations.' },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <feature.icon className="w-8 h-8 text-[#888888] mb-8" strokeWidth={1} />
                <h3 className="font-[400] text-lg text-brand-text-dark mb-4 tracking-wide">{feature.title}</h3>
                <p className="text-[#888888] text-sm leading-relaxed max-w-[200px]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-32 px-6 md:px-12 bg-white">
        <div className="max-w-[800px] mx-auto text-center">
          <span className="eyebrow">TESTIMONIALS</span>
          
          <div className="mt-16 relative">
            <p className="text-2xl md:text-3xl font-[300] text-brand-text-dark leading-relaxed italic mb-12 px-4 md:px-12">
              "{feedbacks.length > 0 && feedbacks[0]?.feedback?.comment ? feedbacks[0].feedback.comment : "The best biryani I've ever had. Highly recommended for any gathering! The flavor is incredibly authentic."}"
            </p>
            <div className="flex flex-col items-center">
               <h4 className="font-medium text-[0.75rem] text-[#888888] tracking-[0.2em] uppercase">
                 {feedbacks.length > 0 && feedbacks[0]?.customer?.name ? feedbacks[0].customer.name : "Priya Sharma"}
               </h4>
            </div>
          </div>
        </div>
      </section>

      {/* INLINE ORDER SECTION */}
      <section className="bg-brand-cream py-32 px-6 md:px-12 border-t border-[#EFEFEF]">
        <div className="max-w-[800px] mx-auto text-center flex flex-col items-center">
            <span className="eyebrow">PLACE YOUR ORDER</span>
            <h2 className="text-4xl md:text-5xl font-[300] tracking-tight text-brand-text-dark mb-16">Quick & Easy Checkout</h2>
            
            <form onSubmit={handleInlineOrder} className="space-y-8 w-full max-w-[400px]">
              <div>
                <input type="text" placeholder="Full Name" className="w-full border-b border-[#DDDDDD] px-0 py-3 bg-transparent focus:outline-none focus:border-brand-text-dark text-sm transition-colors" required />
              </div>
              <div>
                <input type="tel" placeholder="Phone Number" className="w-full border-b border-[#DDDDDD] px-0 py-3 bg-transparent focus:outline-none focus:border-brand-text-dark text-sm transition-colors" required />
              </div>
              <div>
                <select className="w-full border-b border-[#DDDDDD] px-0 py-3 bg-transparent focus:outline-none focus:border-brand-text-dark text-sm text-[#888888] transition-colors" required>
                  <option value="">Select Item...</option>
                  <option value="chicken">Chicken Biryani</option>
                  <option value="mutton">Mutton Dum Biryani</option>
                  <option value="veg">Veg Biryani</option>
                </select>
              </div>
              <div className="pt-8">
                <button type="submit" className="text-xs tracking-[0.2em] font-medium uppercase border border-brand-text-dark text-brand-text-dark py-4 px-12 hover:bg-brand-text-dark hover:text-white transition-colors duration-300">
                  Continue to Payment
                </button>
              </div>
            </form>
        </div>
      </section>

    </div>
  );
};

export default Home;

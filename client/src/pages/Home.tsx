import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="w-full bg-black text-white font-sans overflow-x-hidden min-h-screen">
      {/* HERO SECTION (Reference Screenshot 1) */}
      <section className="min-h-screen flex items-center justify-center pt-28 pb-16 px-6 sm:px-12 bg-black relative">
        <div className="max-w-[1250px] w-full grid grid-cols-1 md:grid-cols-2 items-center gap-12 mx-auto">
          {/* Left Text Area */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-[#f5a623] text-sm font-extrabold tracking-[3px] uppercase mb-6">
              ENGINEERED FLAVORS
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-white uppercase leading-none tracking-wide">
              THE TASTE OF
            </h1>
            <h1 className="font-sans text-5xl sm:text-7xl lg:text-8xl font-black text-[#f5a623] uppercase leading-none tracking-wide mb-6">
              TRADITION
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-md mb-8 leading-relaxed">
              Every spice precisely measured for the ultimate taste profile.
            </p>
            <Link 
              to="/checkout" 
              className="bg-[#f5a623] hover:bg-[#fbbd45] text-black font-extrabold text-xs sm:text-sm tracking-[1.5px] uppercase px-9 py-4 rounded-full shadow-[0_4px_20px_rgba(245,166,35,0.25)] transition-all hover:-translate-y-0.5 inline-block"
            >
              EXPLORE MENU
            </Link>
          </div>

          {/* Right Image Area with Ambient Warm Glow and Rotating Animation */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-4/5 h-4/5 rounded-full bg-[radial-gradient(circle,_rgba(245,166,35,0.35)_0%,_rgba(245,166,35,0.08)_45%,_rgba(0,0,0,0)_70%)] blur-2xl z-0 pointer-events-none"></div>
            <img 
              src="/Chicken-Biryani-Recipe-removebg-preview.png" 
              alt="Engineered Biriyani Plate" 
              className="w-full max-w-[500px] h-auto object-contain relative z-10 drop-shadow-[0_15px_35px_rgba(0,0,0,0.5)] animate-[spin_35s_linear_infinite]"
            />
          </div>
        </div>
      </section>

      {/* POPULAR SPECIALS SECTION (Rates: Rs 130 & Rs 250) */}
      <section className="py-24 px-6 sm:px-12 bg-black text-center border-t border-white/5">
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-[2px] uppercase mb-14">
          POPULAR SPECIALS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[900px] mx-auto">
          {/* Card 1: 600g Box @ Rs 130 */}
          <div className="bg-[#111315] rounded-[24px] p-6 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.7)] flex flex-col items-center hover:-translate-y-1 transition-transform">
            <div className="w-full h-[220px] rounded-[16px] overflow-hidden mb-6">
              <img 
                src="/Chicken-Biryani-Recipe.jpg" 
                alt="Chicken Biriyani 600g" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-extrabold text-white tracking-wide uppercase mb-1">
              CHICKEN BIRIYANI (600g)
            </h3>
            <p className="text-xs text-gray-400 mb-4">2 Pieces Chicken + Onion Raita & Pachadi</p>
            <div className="flex items-baseline justify-center gap-3 mb-6">
              <span className="text-gray-500 line-through text-base font-semibold">Rs 160</span>
              <span className="text-[#f5a623] text-3xl font-extrabold">Rs 130</span>
            </div>

            <Link 
              to="/checkout?type=600g"
              className="w-full bg-[#f5a623] hover:bg-[#fbbd45] text-black font-extrabold text-sm tracking-[1.5px] uppercase py-3.5 rounded-full text-center shadow-[0_4px_15px_rgba(245,166,35,0.2)] transition-all hover:-translate-y-0.5 inline-block"
            >
              ORDER NOW
            </Link>
          </div>

          {/* Card 2: 1200g Family Box @ Rs 250 */}
          <div className="bg-[#111315] rounded-[24px] p-6 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.7)] flex flex-col items-center hover:-translate-y-1 transition-transform">
            <div className="w-full h-[220px] rounded-[16px] overflow-hidden mb-6">
              <img 
                src="/Chicken-Biryani-Recipe.jpg" 
                alt="Chicken Biriyani 1200g Family Pack" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-extrabold text-white tracking-wide uppercase mb-1">
              CHICKEN BIRIYANI (1200g)
            </h3>
            <p className="text-xs text-gray-400 mb-4">3 to 4 Pieces Chicken + Bread Halwa & Raita</p>
            <div className="flex items-baseline justify-center gap-3 mb-6">
              <span className="text-gray-500 line-through text-base font-semibold">Rs 300</span>
              <span className="text-[#f5a623] text-3xl font-extrabold">Rs 250</span>
            </div>

            <Link 
              to="/checkout?type=1200g"
              className="w-full bg-[#f5a623] hover:bg-[#fbbd45] text-black font-extrabold text-sm tracking-[1.5px] uppercase py-3.5 rounded-full text-center shadow-[0_4px_15px_rgba(245,166,35,0.2)] transition-all hover:-translate-y-0.5 inline-block"
            >
              ORDER NOW
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

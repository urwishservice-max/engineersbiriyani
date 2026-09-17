import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';

const menuItems = [
  { id: 1, category: 'Biryani', name: 'Special Chicken Biryani (1200g)', price: '₹239', desc: 'Aromatic basmati rice cooked with 3 to 4 tender chicken pieces, authentic spices, and served with Onion Raita & Kathrika.', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=400&auto=format&fit=crop', badge: 'Bestseller' },
  { id: 2, category: 'Biryani', name: 'Chicken Biryani (600g Box)', price: '₹129', desc: 'Aromatic basmati rice cooked with 2 tender chicken pieces, accompanied with fresh Onion Raita & Kathrika.', img: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=400&auto=format&fit=crop', badge: 'Popular' },
  { id: 3, category: 'Sides', name: 'Onion Raita', price: 'Included', desc: 'Cool yogurt mixed with crunchy onions and mild spices. Served fresh with every biryani.', img: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c4?w=400&q=80' },
  { id: 4, category: 'Sides', name: 'Kathrika', price: 'Included', desc: 'Traditional authentic South Indian tangy brinjal gravy (Kathrika). The perfect accompaniment.', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80' },
];

const categories = ['All', 'Biryani', 'Sides'];

const Menu = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeTab === 'All' || item.category === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-black min-h-screen text-white font-sans">
      
      {/* PAGE HEADER */}
      <section 
        className="min-h-[50vh] flex flex-col items-center justify-center pt-24 relative overflow-hidden text-center px-6 border-b border-[#27272A] bg-gradient-to-b from-black via-[#080808] to-[#0A0A0A]"
      >
        <div className="relative z-10 max-w-4xl mx-auto py-16 flex flex-col items-center">
          
          <div className="bg-[#121212] rounded-full px-5 py-2 flex items-center gap-2 mb-8 border border-[#FFB800]/40">
             <div className="w-2.5 h-2.5 rounded-full bg-[#FFB800] animate-pulse"></div>
             <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#FFB800]">OUR MENU</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#FFB800] mb-6">
            Explore Our Menu
          </h1>
          
          <p className="text-white font-normal text-lg max-w-2xl mx-auto leading-relaxed mb-12">
            Crafting culinary experiences that elevate your tastebuds with traditional, authentic recipes.
          </p>

          <div className="flex items-center justify-center text-center">
             <div className="flex flex-col items-center px-8 md:px-12">
               <span className="text-3xl md:text-4xl font-bold text-[#FFB800] mb-1">4+</span>
               <span className="text-[10px] uppercase tracking-[0.2em] text-white font-semibold">Offerings</span>
             </div>
             <div className="flex flex-col items-center px-8 md:px-12 border-l border-[#27272A]">
               <span className="text-3xl md:text-4xl font-bold text-[#FFB800] mb-1">2</span>
               <span className="text-[10px] uppercase tracking-[0.2em] text-white font-semibold">Sides</span>
             </div>
             <div className="flex flex-col items-center px-8 md:px-12 border-l border-[#27272A]">
               <span className="text-3xl md:text-4xl font-bold text-[#FFB800] mb-1">100%</span>
               <span className="text-[10px] uppercase tracking-[0.2em] text-white font-semibold">Authentic</span>
             </div>
          </div>

        </div>
      </section>

      {/* FILTER BAR */}
      <div className="sticky top-[80px] z-40 bg-black/90 backdrop-blur-md border-b border-[#27272A] py-4 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap gap-8">
            {categories.map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs uppercase tracking-[0.2em] font-bold transition-all ${
                  activeTab === tab 
                    ? 'text-[#FFB800] border-b-2 border-[#FFB800] pb-1' 
                    : 'text-white hover:text-[#FFB800] pb-1'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search dishes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 bg-[#121212] border border-[#27272A] rounded-full focus:outline-none focus:border-[#FFB800] text-sm transition-colors text-white placeholder:text-gray-400"
            />
            <Search className="w-4 h-4 text-[#FFB800] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* MENU GRID */}
      <section className="py-20 px-6 md:px-12 bg-[#0A0A0A]">
        <div className="max-w-[1200px] mx-auto">
          
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-[1100px] mx-auto">
              {filteredItems.map((item) => (
                <div key={item.id} className="brand-card p-6 flex flex-col items-center text-center group cursor-pointer relative hover:border-[#FFB800] transition-all duration-300">
                  {item.badge && (
                    <div className="absolute top-4 right-4 z-10 bg-[#FFB800] text-black text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full shadow-md">
                      {item.badge}
                    </div>
                  )}
                  <div className="w-48 h-48 rounded-full overflow-hidden mb-6 relative border-2 border-[#FFB800]/30 group-hover:border-[#FFB800] transition-colors">
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="font-bold text-xl text-[#FFB800] mb-3 tracking-wide">{item.name}</h3>
                  <p className="text-sm text-white leading-relaxed mb-6 max-w-[260px] flex-1">{item.desc}</p>
                  <div className="flex items-center justify-between w-full max-w-[240px] mt-auto pt-4 border-t border-[#27272A]">
                    <span className="font-bold text-xl text-[#FFB800] tracking-wide">{item.price}</span>
                    <Link to="/checkout" className="btn-primary py-2 px-4 text-xs">
                      Order <ShoppingCart className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6 bg-[#121212] rounded-full border border-[#27272A]">
                <Search className="w-8 h-8 text-[#FFB800]" />
              </div>
              <h3 className="text-2xl font-bold text-[#FFB800] mb-2">No items found</h3>
              <p className="text-white">Try adjusting your category or search term.</p>
              <button 
                onClick={() => { setActiveTab('All'); setSearchQuery(''); }}
                className="mt-6 text-xs uppercase tracking-widest text-[#FFB800] font-bold underline hover:text-[#E05D00]"
              >
                Clear filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* CTA BAND */}
      <section className="bg-black py-24 px-6 md:px-12 text-center flex flex-col items-center border-t border-[#27272A]">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#FFB800] mb-8">Ready to Enjoy Authentic Biriyani?</h2>
        <Link to="/checkout" className="btn-primary">
          Order Online Now
        </Link>
      </section>

    </div>
  );
};

export default Menu;


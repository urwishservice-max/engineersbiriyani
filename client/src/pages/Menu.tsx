import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';

const menuItems = [
  { id: 1, category: 'Biryani', name: 'Special Chicken Biryani', price: '₹250', desc: 'Aromatic basmati rice cooked with tender chicken pieces, authentic spices, and our signature masala.', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=400&auto=format&fit=crop', badge: 'Bestseller' },
  { id: 2, category: 'Sides', name: 'Onion Raita', price: 'Included', desc: 'Cool yogurt mixed with crunchy onions and mild spices. Served fresh with every biryani.', img: '/raita.jpg' },
  { id: 3, category: 'Sides', name: 'Kathirikai (Brinjal Curry)', price: 'Included', desc: 'Traditional authentic South Indian tangy brinjal gravy. The perfect accompaniment.', img: '/kathirikai.jpg' },
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
    <div className="w-full bg-[#f4f4f4] min-h-screen font-sans">
      
      {/* PAGE HEADER */}
      <section 
        className="min-h-[80vh] flex flex-col items-center justify-center pt-20 relative overflow-hidden text-center px-6 border-b border-[#DDDDDD]"
        style={{ 
          backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)', 
          backgroundSize: '80px 80px' 
        }}
      >
        <div className="relative z-10 max-w-4xl mx-auto py-24 flex flex-col items-center">
          
          <div className="bg-white rounded-full px-5 py-2 flex items-center gap-2 mb-12 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-[#DDDDDD]/50">
             <div className="w-2 h-2 rounded-full bg-[#E8622C]"></div>
             <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#888888] pt-0.5">OUR MENU</span>
          </div>
          
          <h1 className="text-6xl md:text-[80px] font-[200] tracking-tight text-brand-text-dark mb-8">
            Our Menu
          </h1>
          
          <p className="text-[#888888] font-light text-xl max-w-2xl mx-auto leading-relaxed mb-24">
            Crafting culinary experiences that elevate your tastebuds and drive immense satisfaction.
          </p>

          <div className="flex items-center justify-center text-center">
             <div className="flex flex-col items-center px-8 md:px-12">
               <span className="text-3xl md:text-4xl font-[300] text-brand-text-dark mb-2">3+</span>
               <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888] font-medium">Dishes</span>
             </div>
             <div className="flex flex-col items-center px-8 md:px-12 border-l border-[#DDDDDD]">
               <span className="text-3xl md:text-4xl font-[300] text-brand-text-dark mb-2">2</span>
               <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888] font-medium">Sides</span>
             </div>
             <div className="flex flex-col items-center px-8 md:px-12 border-l border-[#DDDDDD]">
               <span className="text-3xl md:text-4xl font-[300] text-brand-text-dark mb-2">100%</span>
               <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888] font-medium">Authentic</span>
             </div>
          </div>

        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
           <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888] font-medium">Scroll</span>
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="sticky top-[80px] z-40 bg-white/80 backdrop-blur-md border-b border-[#EFEFEF] py-4 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap gap-8">
            {categories.map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs uppercase tracking-[0.2em] font-medium transition-all ${
                  activeTab === tab 
                    ? 'text-brand-text-dark border-b border-brand-text-dark pb-1' 
                    : 'text-[#888888] hover:text-brand-text-dark pb-1'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 border-b border-[#DDDDDD] focus:outline-none focus:border-brand-text-dark text-sm bg-transparent transition-colors text-brand-text-dark placeholder:text-[#888888]"
            />
            <Search className="w-4 h-4 text-[#888888] absolute left-2 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* MENU GRID */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-[1200px] mx-auto">
          
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 max-w-[1000px] mx-auto">
              {filteredItems.map((item) => (
                <div key={item.id} className="flex flex-col items-center text-center group cursor-pointer relative">
                  {item.badge && (
                    <div className="absolute top-0 right-0 z-10 bg-brand-text-dark text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 shadow-sm">
                      {item.badge}
                    </div>
                  )}
                  <div className="w-56 h-56 rounded-full overflow-hidden mb-8 relative bg-gray-100">
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="font-[400] text-xl text-brand-text-dark mb-3 tracking-wide">{item.name}</h3>
                  <p className="text-sm text-[#888888] leading-relaxed mb-6 max-w-[250px] flex-1">{item.desc}</p>
                  <div className="flex items-center justify-between w-full max-w-[200px] mt-auto pt-4 border-t border-[#EFEFEF]">
                    <span className="font-light text-lg text-brand-text-dark tracking-wide">{item.price}</span>
                    <Link to="/checkout" className="text-brand-text-dark hover:text-brand-orange transition-colors">
                      <ShoppingCart className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-[#888888]" />
              </div>
              <h3 className="text-2xl font-[300] text-brand-text-dark mb-2">No items found</h3>
              <p className="text-[#888888] font-light">Try adjusting your category or search term.</p>
              <button 
                onClick={() => { setActiveTab('All'); setSearchQuery(''); }}
                className="mt-6 text-xs uppercase tracking-widest text-brand-text-dark font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* CTA BAND */}
      <section className="bg-brand-cream py-32 px-6 md:px-12 text-center flex flex-col items-center border-t border-[#EFEFEF]">
        <h2 className="text-3xl md:text-4xl font-[300] tracking-tight text-brand-text-dark mb-12">Hungry Yet?</h2>
        <Link to="/checkout" className="text-xs tracking-[0.2em] font-medium uppercase border border-brand-text-dark text-brand-text-dark py-4 px-12 hover:bg-brand-text-dark hover:text-white transition-colors duration-300">
          Checkout Now
        </Link>
      </section>

    </div>
  );
};

export default Menu;

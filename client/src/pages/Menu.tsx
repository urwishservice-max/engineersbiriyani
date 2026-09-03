import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <div className="flex-1 pt-24 pb-16 relative z-10 w-full max-w-7xl mx-auto px-5">
      
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="font-serif text-5xl font-normal mb-6 tracking-wide text-gray-900">Our Menu</h1>
        <span className="font-serif italic text-xl text-gray-500 block mb-12">
          Explore our delicious selection of freshly prepared dishes.
        </span>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Category: Biryani */}
        <div className="mb-16">
          <h2 className="font-serif text-3xl mb-8 pb-3 border-b border-gray-200 text-gray-900 text-left">Biryani</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Chicken Biryani Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col">
              <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                <img 
                  src="/Chicken-Biryani-Recipe-removebg-preview.png" 
                  alt="Chicken Biryani" 
                  className="h-full object-contain drop-shadow-xl"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-serif text-2xl">Chicken Biryani</h3>
                  <span className="font-sans font-semibold text-lg bg-black text-white px-3 py-1 rounded">₹199</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  Aromatic basmati rice cooked with tender chicken, authentic spices, and our signature biryani masala.
                </p>
                <div className="mt-auto">
                  <Link to="/checkout" className="block text-center w-full bg-gray-100 hover:bg-gray-200 text-black py-2 rounded font-medium transition text-sm">
                    Order Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category: Sides */}
        <div className="mb-16">
          <h2 className="font-serif text-3xl mb-8 pb-3 border-b border-gray-200 text-gray-900 text-left">Sides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Onion Raita Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col">
              <div className="h-40 bg-gray-50 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1546833998-877b37c2e5c4?w=400&q=80" 
                  alt="Onion Raita" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-serif text-xl">Onion Raita</h3>
                  <span className="font-sans font-semibold">₹199</span>
                </div>
              </div>
            </div>

            {/* Boiled Egg Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col">
              <div className="h-40 bg-gray-50 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&q=80" 
                  alt="Boiled Egg" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-serif text-xl">Boiled Egg</h3>
                  <span className="font-sans font-semibold">₹199</span>
                </div>
              </div>
            </div>

            {/* Gravy Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col">
              <div className="h-40 bg-gray-50 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80" 
                  alt="Gravy" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-serif text-xl">Gravy</h3>
                  <span className="font-sans font-semibold">₹199</span>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        {/* Important Info */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-12 text-left mb-12">
          <h3 className="font-serif text-2xl mb-3 text-gray-900">Important</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Prices and menu availability may change from time to time. Some items may not be available depending on stock and daily availability.
          </p>
        </div>

        <div className="text-center">
          <Link 
            to="/checkout" 
            className="inline-block bg-black text-white px-10 py-4 rounded-md font-semibold tracking-wider hover:bg-gray-800 transition uppercase text-sm"
          >
            Order Now
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Menu;

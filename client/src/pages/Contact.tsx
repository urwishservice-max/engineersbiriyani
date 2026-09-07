import React from 'react';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="w-full bg-[#f4f4f4] min-h-screen font-sans flex flex-col items-center justify-center pt-[80px]">
      
      {/* FORM SECTION */}
      <section className="w-full py-24 px-6 md:px-12 flex flex-col items-center">
        <div className="max-w-[600px] w-full text-center flex flex-col items-center">
            <span className="eyebrow mb-6">PLACE YOUR ORDER</span>
            <h2 className="text-4xl md:text-5xl font-[300] tracking-tight text-brand-text-dark mb-24">Quick & Easy Checkout</h2>
            
            <form onSubmit={handleSubmit} className="space-y-12 w-full text-left">
              <div>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full border-b border-[#DDDDDD] px-0 py-3 bg-transparent focus:outline-none focus:border-brand-text-dark text-sm transition-colors text-brand-text-dark placeholder:text-[#888888]" 
                  required 
                />
              </div>
              <div>
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  className="w-full border-b border-[#DDDDDD] px-0 py-3 bg-transparent focus:outline-none focus:border-brand-text-dark text-sm transition-colors text-brand-text-dark placeholder:text-[#888888]" 
                  required 
                />
              </div>
              <div>
                <select 
                  className="w-full border-b border-[#DDDDDD] px-0 py-3 bg-transparent focus:outline-none focus:border-brand-text-dark text-sm transition-colors text-[#888888]" 
                  required 
                >
                  <option value="" disabled selected>Select Item...</option>
                  <option value="chicken">Chicken Biryani</option>
                  <option value="mutton">Mutton Biryani</option>
                </select>
              </div>
              <div className="pt-12 text-center flex justify-center">
                <button type="submit" className="text-xs tracking-[0.2em] font-medium uppercase border border-[#DDDDDD] text-brand-text-dark py-4 px-12 hover:bg-brand-text-dark hover:text-white transition-colors duration-300">
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

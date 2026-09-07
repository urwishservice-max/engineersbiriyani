import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="w-full bg-[#f4f4f4] min-h-screen font-sans pt-[80px]">
      
      {/* INTRO HERO */}
      <section className="min-h-[40vh] flex flex-col justify-center relative overflow-hidden text-center px-6">
        <div className="relative z-10 max-w-3xl mx-auto py-16">
          <span className="eyebrow mx-auto justify-center flex mb-6">ABOUT US</span>
          <h1 className="text-4xl md:text-5xl font-[300] tracking-tight text-brand-text-dark mb-6">
            Our Story
          </h1>
          <p className="text-[#888888] text-lg font-light tracking-wide">
            Crafted with Passion. Delivered with Purpose.
          </p>
        </div>
      </section>

      {/* OUR STORY SECTION */}
      <section className="bg-white py-32 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-16 mb-32">
          <div className="w-full md:w-1/2">
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src="/0faac298-d842-43ca-9176-497a2435f707.jpg" 
                alt="Our Kitchen" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800&auto=format&fit=crop';
                }}
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-8">
            <span className="eyebrow">OUR JOURNEY</span>
            <h2 className="text-4xl font-[300] tracking-tight text-brand-text-dark">A Simple Idea</h2>
            <div className="space-y-6 text-[#888888] font-light leading-relaxed">
              <p>
                At Engineer Biryani, we believe that a hearty meal shouldn't come at the cost of your wallet—or the planet.
                Born out of a simple idea to deliver authentic, flavorful biryani with zero waste and full satisfaction, we serve one goal: to make your Sunday lunch unforgettable.
              </p>
              <p>
                We operate on a <strong className="font-medium text-brand-text-dark">pre-order only model</strong>, allowing you to book your biryani from Monday to Saturday for a fresh, piping hot delivery every Sunday.
                This approach helps us control food waste, maintain quality, and deliver generous portions at affordable prices.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="w-full md:w-1/2">
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src="/Chicken-Biryani-Recipe.jpg" 
                alt="Signature Dish" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=800&auto=format&fit=crop';
                }}
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-8">
            <span className="eyebrow">WHAT WE SERVE</span>
            <h2 className="text-4xl font-[300] tracking-tight text-brand-text-dark">More Than Just Food</h2>
            <ul className="space-y-4 mb-6 text-[#888888] font-light">
              {[
                'Aromatic rice cooked with rich spices',
                'Two juicy pieces of chicken',
                'Accompanied by onion raita and pachadi',
                'Free doorstep delivery'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="text-brand-text-dark mt-1 text-[10px] uppercase tracking-widest font-bold border border-brand-text-dark px-1 rounded-sm">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-[#888888] font-light leading-relaxed">
              We’re not just serving food—we’re building a community of biryani lovers who appreciate taste, quantity, and value.
              Why "Engineer Biryani"? Because like every great engineering solution, our model is smart, efficient, and built to serve.
            </p>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="bg-brand-cream py-32 px-6 md:px-12 text-center flex flex-col items-center border-t border-[#EFEFEF]">
        <h2 className="text-3xl md:text-4xl font-[300] tracking-tight text-brand-text-dark mb-12">Hungry Yet?</h2>
        <Link to="/checkout" className="text-xs tracking-[0.2em] font-medium uppercase border border-brand-text-dark text-brand-text-dark py-4 px-12 hover:bg-brand-text-dark hover:text-white transition-colors duration-300">
          Order Now
        </Link>
      </section>

    </div>
  );
};

export default About;

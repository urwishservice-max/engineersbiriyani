import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="w-full bg-black text-white min-h-screen font-sans pt-[80px]">
      
      {/* INTRO HERO */}
      <section className="min-h-[35vh] flex flex-col justify-center relative overflow-hidden text-center px-6 bg-gradient-to-b from-black to-[#0A0A0A] border-b border-[#27272A]">
        <div className="relative z-10 max-w-3xl mx-auto py-16">
          <span className="eyebrow mx-auto justify-center flex mb-4">ABOUT US</span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#FFB800] mb-4">
            Our Story & Passion
          </h1>
          <p className="text-white text-lg font-normal tracking-wide">
            Crafted with Passion. Engineered for Taste. Delivered with Purpose.
          </p>
        </div>
      </section>

      {/* OUR STORY SECTION */}
      <section className="bg-[#0A0A0A] py-24 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-16 mb-24">
          <div className="w-full md:w-1/2">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-[#27272A] shadow-xl">
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
          <div className="w-full md:w-1/2 space-y-6">
            <span className="eyebrow">OUR JOURNEY</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#FFB800]">A Simple Idea, Perfected</h2>
            <div className="space-y-4 text-white font-normal leading-relaxed">
              <p>
                At Engineer's Biriyani, we believe that a hearty, delicious meal shouldn't come at the cost of your wallet—or quality.
                Born out of a vision to deliver authentic, mouth-watering biryani with zero waste and maximum satisfaction, we serve one goal: to make every meal unforgettable.
              </p>
              <p>
                We operate on a <strong className="font-bold text-[#FFB800]">pre-order model</strong>, ensuring every batch is prepared fresh, hot, and full of rich authentic spices.
                This approach guarantees peak quality and delivers generous portions at unbeatable value.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="w-full md:w-1/2">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-[#27272A] shadow-xl">
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
          <div className="w-full md:w-1/2 space-y-6">
            <span className="eyebrow">WHAT WE SERVE</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#FFB800]">More Than Just Food</h2>
            <ul className="space-y-4 mb-6 text-white font-normal">
              {[
                'Aromatic basmati rice cooked with hand-picked spices',
                'Tender, succulent chicken pieces cooked to perfection',
                'Accompanied by fresh onion raita & authentic brinjal pachadi',
                'Fast and reliable doorstep delivery'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4">
                  <span className="bg-[#FFB800] text-black font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-white font-normal leading-relaxed">
              Why "Engineer's Biriyani"? Because like every great engineering creation, our recipe is smart, precise, and built to deliver excellence.
            </p>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="bg-black py-24 px-6 md:px-12 text-center flex flex-col items-center border-t border-[#27272A]">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#FFB800] mb-8">Hungry For Excellence?</h2>
        <Link to="/checkout" className="btn-primary">
          Order Online Now
        </Link>
      </section>

    </div>
  );
};

export default About;


import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Facebook, Twitter, Instagram, Send, CreditCard, Menu as MenuIcon, Search } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isScrolledStyle = scrolled ? 'bg-brand-cream text-brand-text-dark shadow-sm border-b border-brand-border-soft/50' : 'bg-transparent text-brand-text-dark';

  return (
    <div className="flex flex-col min-h-screen font-sans bg-brand-cream text-brand-text-dark">
      {/* Navbar */}
      <header className={`fixed top-0 w-full z-50 h-[80px] transition-all duration-300 flex items-center justify-between px-6 md:px-12 ${isScrolledStyle}`}>
        {/* Left Side: Logo & Hamburger */}
        <div className="flex items-center gap-6 flex-1">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Engineer's Biriyani" className="h-12 w-auto object-contain" />
          </Link>
          <button className="text-brand-text-dark hover:text-brand-orange transition-colors">
            <MenuIcon className="w-6 h-6 stroke-[1.5]" />
          </button>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center justify-center gap-10 flex-1">
          {[
            { name: 'HOME', path: '/' },
            { name: 'ABOUT', path: '/about' },
            { name: 'MENU', path: '/menu' },
            { name: 'CONTACT', path: '/contact' },
          ].map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`text-[10px] font-semibold tracking-[0.2em] transition-colors ${
                isActive(link.path) 
                  ? 'text-brand-text-dark border-b border-brand-text-dark pb-1' 
                  : 'text-[#888888] hover:text-brand-text-dark pb-1'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Side: Icons */}
        <div className="flex items-center justify-end gap-6 flex-1">
          <a href="https://www.instagram.com/engineersbiriyani/" target="_blank" rel="noopener noreferrer" className="text-brand-text-dark hover:text-brand-orange transition-colors hidden sm:block">
            <Instagram className="w-5 h-5 stroke-[1.5]" />
          </a>
          <button className="text-brand-text-dark hover:text-brand-orange transition-colors hidden sm:block">
            <Search className="w-5 h-5 stroke-[1.5]" />
          </button>
          <Link to="/checkout" className="text-brand-text-dark hover:text-brand-orange transition-colors">
            <ShoppingCart className="w-5 h-5 stroke-[1.5]" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer 
        className="relative pt-32 pb-8 px-6 md:px-12 flex flex-col items-center justify-end min-h-[600px] text-white overflow-hidden mt-auto"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.95)), url('https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=2000&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="w-full max-w-[1200px] mx-auto z-10 flex flex-col h-full flex-1 justify-between">
          
          {/* Top Section: Text & Input */}
          <div className="flex flex-col items-center text-center mt-12 mb-24">
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-10 max-w-2xl leading-tight text-white/90">
              Engineer's Biriyani helps you experience tradition that can evolve – not be forgotten
            </h2>
            
            {/* Glassmorphism Input */}
            <div className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-1.5 w-full max-w-md transition-all hover:bg-white/15">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent text-white placeholder:text-white/60 focus:outline-none px-4 py-2 w-full text-sm font-medium"
              />
              <button className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors whitespace-nowrap flex items-center gap-2 border border-white/10">
                Request access <span className="text-lg leading-none font-light">+</span>
              </button>
            </div>
          </div>

          {/* Bottom Section: Links & Logo */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-4 items-end mb-8 pl-0 md:pl-8">
            <div className="col-span-2 md:col-span-1 flex items-end h-full">
              <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain filter brightness-0 invert opacity-90" />
            </div>
            <div className="col-span-1">
              <h4 className="text-white/90 font-medium mb-4 text-[15px]">Platform</h4>
              <ul className="flex flex-col gap-3 text-white/60 text-[13px]">
                <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link to="/menu" className="hover:text-white transition">Menu</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div className="col-span-1">
              <h4 className="text-white/90 font-medium mb-4 text-[15px]">Resources</h4>
              <ul className="flex flex-col gap-3 text-white/60 text-[13px]">
                <li><Link to="/policy/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link to="/policy/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
                <li><Link to="/policy/refund" className="hover:text-white transition">Refunds</Link></li>
                <li><Link to="/admin/login" className="hover:text-white transition">Admin Portal</Link></li>
              </ul>
            </div>
            <div className="col-span-1">
              <h4 className="text-white/90 font-medium mb-4 text-[15px]">Contact</h4>
              <ul className="flex flex-col gap-3 text-white/60 text-[13px]">
                <li><Link to="/checkout" className="hover:text-white transition">Order Now</Link></li>
                <li><a href="https://wa.me/918870877407" className="hover:text-white transition">WhatsApp Us</a></li>
              </ul>
            </div>
          </div>

          {/* Very Bottom Bar */}
          <div className="w-full border-t border-white/20 pt-6 flex justify-between items-center text-[11px] text-white/50">
            <p>&copy; 2026 Engineer's Biriyani. All rights reserved.</p>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Layout;

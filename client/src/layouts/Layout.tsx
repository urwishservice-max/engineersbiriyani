import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Instagram, Search, Menu as MenuIcon, X, ShieldCheck } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isScrolledStyle = (scrolled || isMobileMenuOpen) ? 'bg-[#000000]/95 backdrop-blur-md text-white shadow-lg border-b border-[#27272A]' : 'bg-[#000000]/80 backdrop-blur-sm text-white border-b border-[#27272A]/50';

  return (
    <div className="flex flex-col min-h-screen font-sans bg-black text-white selection:bg-[#FFB800] selection:text-black">
      {/* Navbar */}
      <header className={`fixed top-0 w-full z-50 h-[80px] transition-all duration-300 flex items-center justify-between px-6 md:px-12 ${isScrolledStyle}`}>
        {/* Left Side: Logo & Hamburger */}
        <div className="flex items-center gap-6 flex-1">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="Engineer's Biriyani" className="h-12 w-auto object-contain filter brightness-110" />
            <span className="font-bold text-xl tracking-tight text-[#FFB800] hidden sm:inline-block">Engineer's Biriyani</span>
          </Link>
          <button 
            className="text-white hover:text-[#FFB800] transition-colors md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 stroke-[1.5]" /> : <MenuIcon className="w-6 h-6 stroke-[1.5]" />}
          </button>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center justify-center gap-10 flex-1">
          {[
            { name: 'HOME', path: '/' },
            { name: 'ABOUT', path: '/about' },
            { name: 'TRACK ORDER', path: '/track' },
          ].map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`text-[11px] font-bold tracking-[0.2em] transition-colors ${
                isActive(link.path) 
                  ? 'text-[#FFB800] border-b-2 border-[#FFB800] pb-1' 
                  : 'text-white hover:text-[#FFB800] pb-1'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Side: Icons */}
        <div className="flex items-center justify-end gap-5 flex-1">
          <a href="https://www.instagram.com/engineersbiriyani/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#FFB800] transition-colors hidden sm:block">
            <Instagram className="w-5 h-5 stroke-[1.5]" />
          </a>
          <Link to="/checkout" className="text-white hover:text-[#FFB800] transition-colors relative mr-2">
            <ShoppingCart className="w-5 h-5 stroke-[1.5]" />
            <span className="absolute -top-2 -right-2 bg-[#FFB800] text-black text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center">1</span>
          </Link>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black flex flex-col items-center justify-center transition-all duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col gap-8 text-center items-center">
          {[
            { name: 'HOME', path: '/' },
            { name: 'ABOUT', path: '/about' },
            { name: 'TRACK ORDER', path: '/track' },
          ].map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-2xl font-bold tracking-[0.2em] transition-colors ${
                isActive(link.path) 
                  ? 'text-[#FFB800] border-b-2 border-[#FFB800] pb-1 inline-block' 
                  : 'text-white hover:text-[#FFB800]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-black">
        <Outlet />
      </main>

      {/* Footer */}
      <footer 
        className="relative pt-32 pb-8 px-6 md:px-12 flex flex-col items-center justify-end min-h-[550px] text-white overflow-hidden mt-auto bg-black border-t border-[#FFB800]/30"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.98)), url('https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=2000&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="w-full max-w-[1200px] mx-auto z-10 flex flex-col h-full flex-1 justify-between">
          
          {/* Top Section: Text & Input */}
          <div className="flex flex-col items-center text-center mt-6 mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 max-w-2xl leading-tight text-[#FFB800]">
              Engineer's Biriyani helps you experience tradition that can evolve – not be forgotten
            </h2>
            
            {/* Input */}
            <div className="relative flex items-center bg-[#121212] border border-[#FFB800]/40 rounded-full p-1.5 w-full max-w-md shadow-[0_0_15px_rgba(255,107,0,0.15)] transition-all hover:border-[#FFB800]">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent text-white placeholder:text-gray-400 focus:outline-none px-4 py-2 w-full text-sm font-medium"
              />
              <button className="bg-[#FFB800] hover:bg-[#E05D00] text-black font-bold text-sm py-2.5 px-6 rounded-full transition-colors whitespace-nowrap flex items-center gap-2">
                Subscribe <span className="text-lg leading-none">+</span>
              </button>
            </div>
          </div>

          {/* Bottom Section: Links & Logo */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-4 items-end mb-8 pl-0 md:pl-8">
            <div className="col-span-2 md:col-span-1 flex items-end h-full">
              <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain filter brightness-110" />
            </div>
            <div className="col-span-1">
              <h4 className="text-[#FFB800] font-bold mb-4 text-[15px]">Platform</h4>
              <ul className="flex flex-col gap-3 text-white/90 text-[13px]">
                <li><Link to="/" className="hover:text-[#FFB800] transition">Home</Link></li>
                <li><Link to="/about" className="hover:text-[#FFB800] transition">About Us</Link></li>
                <li><Link to="/track" className="hover:text-[#FFB800] transition text-[#FFB800] font-semibold">Track Order</Link></li>
              </ul>
            </div>
            <div className="col-span-1">
              <h4 className="text-[#FFB800] font-bold mb-4 text-[15px]">Resources</h4>
              <ul className="flex flex-col gap-3 text-white/90 text-[13px]">
                <li><Link to="/policy/privacy" className="hover:text-[#FFB800] transition">Privacy Policy</Link></li>
                <li><Link to="/policy/terms" className="hover:text-[#FFB800] transition">Terms & Conditions</Link></li>
                <li><Link to="/policy/refund" className="hover:text-[#FFB800] transition">Refunds</Link></li>
                <li><Link to="/admin/login" className="hover:text-[#FFB800] transition">Admin Portal</Link></li>
              </ul>
            </div>
            <div className="col-span-1">
              <h4 className="text-[#FFB800] font-bold mb-4 text-[15px]">Contact</h4>
              <ul className="flex flex-col gap-3 text-white/90 text-[13px]">
                <li><Link to="/checkout" className="hover:text-[#FFB800] transition font-bold text-[#FFB800]">Order Now</Link></li>
                <li><a href="https://wa.me/919360867908" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFB800] transition">WhatsApp Us</a></li>
              </ul>
            </div>
          </div>

          {/* Very Bottom Bar */}
          <div className="w-full border-t border-[#27272A] pt-6 flex justify-between items-center text-[11px] text-white/70">
            <p>&copy; 2026 Engineer's Biriyani. All rights reserved.</p>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Layout;


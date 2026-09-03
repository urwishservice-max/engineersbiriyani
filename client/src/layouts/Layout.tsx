import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <header className="flex flex-col md:flex-row justify-between items-center py-6 px-4 md:px-12 bg-transparent absolute w-full top-0 z-50 gap-4 md:gap-0">
        
        <div className="flex gap-4 md:gap-8 items-center flex-wrap justify-center">
          <Link to="/" className={`text-[11px] font-semibold uppercase tracking-[1.5px] transition hover:text-amber-500 ${isActive('/') ? 'text-amber-500' : 'text-gray-900'}`}>Welcome</Link>
          <Link to="/about" className={`text-[11px] font-semibold uppercase tracking-[1.5px] transition hover:text-amber-500 ${isActive('/about') ? 'text-amber-500' : 'text-gray-900'}`}>About Us</Link>
          <Link to="/menu" className={`text-[11px] font-semibold uppercase tracking-[1.5px] transition hover:text-amber-500 ${isActive('/menu') ? 'text-amber-500' : 'text-gray-900'}`}>Menu</Link>
        </div>

        <Link to="/" className="text-2xl md:text-3xl font-serif font-bold text-black text-center flex flex-col items-center leading-none">
          Engineer's Biriyani
          <span className="font-sans text-[0.6rem] md:text-xs font-normal tracking-[2px] uppercase mt-1 text-gray-600">The Taste of Tradition</span>
        </Link>
        
        <div className="flex gap-4 md:gap-8 items-center flex-wrap justify-center">
          <Link to="/pricing" className={`text-[11px] font-semibold uppercase tracking-[1.5px] transition hover:text-amber-500 ${isActive('/pricing') ? 'text-amber-500' : 'text-gray-900'}`}>Pricing</Link>
          <Link to="/contact" className={`text-[11px] font-semibold uppercase tracking-[1.5px] transition hover:text-amber-500 ${isActive('/contact') ? 'text-amber-500' : 'text-gray-900'}`}>Contact</Link>
          <Link to="/checkout" className={`text-[11px] font-extrabold uppercase tracking-[1.5px] transition hover:text-amber-500 ${isActive('/checkout') ? 'text-amber-500' : 'text-gray-900'}`}>Order Now</Link>
        </div>

      </header>
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <footer className="py-10 text-center text-sm text-gray-500 border-t border-border mt-auto">
        <p>&copy; 2026 Engineer's Biriyani. All rights reserved.</p>
        <div className="mt-4 flex gap-4 justify-center">
          <Link to="/policy/privacy" className="hover:text-black transition">Privacy Policy</Link>
          <span>|</span>
          <Link to="/policy/terms" className="hover:text-black transition">Terms & Conditions</Link>
          <span>|</span>
          <Link to="/policy/refund" className="hover:text-black transition">Cancellation & Refund Policy</Link>
          <span>|</span>
          <Link to="/admin/login" className="hover:text-black transition font-semibold text-gray-700">Admin Login</Link>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

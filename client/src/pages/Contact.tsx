import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <div className="flex-1 pt-24 pb-16 relative z-10 w-full max-w-4xl mx-auto px-5">
      
      <div className="text-center mb-16">
        <h1 className="font-serif text-5xl font-normal mb-6 tracking-wide text-gray-900">Contact Us</h1>
        <p className="text-gray-500 text-lg">
          We're happy to hear from you. If you have questions about our menu, orders, delivery, payments, or anything else, please contact us.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-20 text-center">
        <div className="flex flex-col items-center">
          <Phone className="w-8 h-8 text-gray-900 mb-4" />
          <h3 className="font-serif text-xl mb-2">Call Us</h3>
          <a href="tel:+919876543210" className="text-gray-500 hover:text-gray-900 transition text-sm">+91 98765 43210</a>
        </div>
        
        <div className="flex flex-col items-center">
          <Mail className="w-8 h-8 text-gray-900 mb-4" />
          <h3 className="font-serif text-xl mb-2">Email</h3>
          <a href="mailto:support@engineersbiriyani.com" className="text-gray-500 hover:text-gray-900 transition text-sm">support@engineersbiriyani.com</a>
        </div>
        
        <div className="flex flex-col items-center">
          <MapPin className="w-8 h-8 text-gray-900 mb-4" />
          <h3 className="font-serif text-xl mb-2">Location</h3>
          <p className="text-gray-500 text-sm">123 Food Street<br />Tech City, 560001</p>
        </div>
        
        <div className="flex flex-col items-center">
          <Clock className="w-8 h-8 text-gray-900 mb-4" />
          <h3 className="font-serif text-xl mb-2">Business Hours</h3>
          <p className="text-gray-500 text-sm">11:00 AM – 11:00 PM</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-16">
        <h2 className="font-serif text-3xl mb-4 text-gray-900">Customer Support</h2>
        <p className="text-gray-500 leading-loose mb-2">
          For questions regarding an existing order, please provide your order number when contacting us so that we can assist you quickly.
        </p>
        <p className="text-gray-500 leading-loose mb-12">
          <strong className="text-gray-900 font-semibold">Delivery Areas:</strong> Tech City and surrounding areas.
        </p>
        
        <h3 className="font-serif text-2xl mb-6 text-gray-900">Send Us a Message</h3>
        <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="text" 
            placeholder="Name" 
            className="p-4 border border-gray-200 rounded-md w-full focus:outline-none focus:border-black transition"
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            className="p-4 border border-gray-200 rounded-md w-full focus:outline-none focus:border-black transition"
            required 
          />
          <input 
            type="tel" 
            placeholder="Phone" 
            className="p-4 border border-gray-200 rounded-md w-full focus:outline-none focus:border-black transition"
          />
          <input 
            type="text" 
            placeholder="Order Number (if applicable)" 
            className="p-4 border border-gray-200 rounded-md w-full focus:outline-none focus:border-black transition"
          />
          <textarea 
            placeholder="Message" 
            rows={5} 
            className="p-4 border border-gray-200 rounded-md w-full resize-y focus:outline-none focus:border-black transition"
            required
          ></textarea>
          
          <button 
            type="submit" 
            className="mt-2 bg-black text-white px-8 py-4 rounded-md font-semibold tracking-wider hover:bg-gray-800 transition uppercase text-sm w-full sm:w-auto self-start"
          >
            Send Message
          </button>
        </form>
      </div>
      
    </div>
  );
};

export default Contact;

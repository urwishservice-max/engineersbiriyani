import React from 'react';
import { useParams } from 'react-router-dom';

const LegalPage = () => {
  const { policyType } = useParams();

  const getContent = () => {
    switch (policyType) {
      case 'privacy':
        return (
          <>
            <h1 className="text-4xl font-bold text-[#FFB800] mb-8">Privacy Policy</h1>
            <div className="space-y-6 text-white leading-relaxed">
              <p>At Engineer's Biriyani, we respect your privacy and are committed to protecting the personal information you provide when using our website.</p>
              <h2 className="text-2xl font-bold text-[#FFB800] mt-8">1. Information We Collect</h2>
              <p>When you place an order, we collect information such as Name, Phone number, Delivery Address, and Order details.</p>
              <h2 className="text-2xl font-bold text-[#FFB800] mt-8">2. How We Use Your Information</h2>
              <p>We use your information strictly to process and deliver your orders, communicate updates, and enhance your dining experience.</p>
              <h2 className="text-2xl font-bold text-[#FFB800] mt-8">3. Contact Us</h2>
              <p>If you have questions regarding this Privacy Policy, please contact: support@engineersbiriyani.com</p>
            </div>
          </>
        );
      case 'terms':
        return (
          <>
            <h1 className="text-4xl font-bold text-[#FFB800] mb-8">Terms & Conditions</h1>
            <div className="space-y-6 text-white leading-relaxed">
              <p>Welcome to Engineer's Biriyani. By accessing our website, you agree to be bound by these Terms and Conditions.</p>
              <h2 className="text-2xl font-bold text-[#FFB800] mt-8">1. Orders and Delivery</h2>
              <p>All orders are subject to availability and confirmation of order payment. Delivery times may vary depending on location.</p>
              <h2 className="text-2xl font-bold text-[#FFB800] mt-8">2. Pricing</h2>
              <p>Prices are subject to change. The final amount payable will be displayed at checkout.</p>
            </div>
          </>
        );
      case 'refund':
        return (
          <>
            <h1 className="text-4xl font-bold text-[#FFB800] mb-8">Cancellation & Refund Policy</h1>
            <div className="space-y-6 text-white leading-relaxed">
              <p>We want you to be completely satisfied with your order from Engineer's Biriyani.</p>
              <h2 className="text-2xl font-bold text-[#FFB800] mt-8">1. Cancellations</h2>
              <p>Orders can only be cancelled before they are marked as 'Preparing'. Once preparation has started, cancellations are not permitted.</p>
              <h2 className="text-2xl font-bold text-[#FFB800] mt-8">2. Refunds</h2>
              <p>Refunds will be processed for eligible cancellations within 3-5 business days to your original payment method.</p>
            </div>
          </>
        );
      default:
        return <h1 className="text-4xl font-bold text-[#FFB800]">Page Not Found</h1>;
    }
  };

  return (
    <div className="flex-1 pt-28 pb-16 relative z-10 w-full max-w-4xl mx-auto px-5 bg-black text-white min-h-screen">
      <div className="brand-card p-8 md:p-12 border border-[#FFB800]/30 bg-[#121212]">
        {getContent()}
      </div>
    </div>
  );
};

export default LegalPage;


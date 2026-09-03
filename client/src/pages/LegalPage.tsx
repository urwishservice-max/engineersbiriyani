import React from 'react';
import { useParams } from 'react-router-dom';

const LegalPage = () => {
  const { policyType } = useParams();

  const getContent = () => {
    switch (policyType) {
      case 'privacy':
        return (
          <>
            <h1 className="font-serif text-4xl mb-8">Privacy Policy</h1>
            <div className="space-y-6 text-gray-600">
              <p>At Engineer's Biriyani, we respect your privacy and are committed to protecting the personal information you provide when using our website.</p>
              <h2 className="font-serif text-2xl text-black mt-8">1. Information We Collect</h2>
              <p>When you use our website or place an order, we may collect information such as Name, Phone number, Address, and Order details.</p>
              <h2 className="font-serif text-2xl text-black mt-8">2. How We Use Your Information</h2>
              <p>We use your information to process and deliver your orders, contact you regarding your order, and improve our services.</p>
              <h2 className="font-serif text-2xl text-black mt-8">3. Contact Us</h2>
              <p>If you have questions regarding this Privacy Policy, please contact: support@engineersbiriyani.com</p>
            </div>
          </>
        );
      case 'terms':
        return (
          <>
            <h1 className="font-serif text-4xl mb-8">Terms & Conditions</h1>
            <div className="space-y-6 text-gray-600">
              <p>Welcome to Engineer's Biriyani. By accessing our website, you agree to be bound by these Terms and Conditions.</p>
              <h2 className="font-serif text-2xl text-black mt-8">1. Orders and Delivery</h2>
              <p>All orders are subject to availability and confirmation of the order price. Delivery times may vary depending on your location.</p>
              <h2 className="font-serif text-2xl text-black mt-8">2. Pricing</h2>
              <p>Prices are subject to change without notice. The final amount payable will be displayed at checkout.</p>
            </div>
          </>
        );
      case 'refund':
        return (
          <>
            <h1 className="font-serif text-4xl mb-8">Cancellation & Refund Policy</h1>
            <div className="space-y-6 text-gray-600">
              <p>We want you to be completely satisfied with your order from Engineer's Biriyani.</p>
              <h2 className="font-serif text-2xl text-black mt-8">1. Cancellations</h2>
              <p>Orders can only be cancelled before they are marked as 'Preparing'. Once preparation has started, cancellations are not permitted.</p>
              <h2 className="font-serif text-2xl text-black mt-8">2. Refunds</h2>
              <p>Refunds will be processed for eligible cancellations within 3-5 business days to the original payment method.</p>
            </div>
          </>
        );
      default:
        return <h1>Page Not Found</h1>;
    }
  };

  return (
    <div className="flex-1 pt-24 pb-16 relative z-10 w-full max-w-4xl mx-auto px-5">
      <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-gray-100">
        {getContent()}
      </div>
    </div>
  );
};

export default LegalPage;

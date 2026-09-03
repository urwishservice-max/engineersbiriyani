import React from 'react';

const Pricing = () => {
  return (
    <div className="flex-1 pt-24 pb-16 relative z-10 w-full max-w-4xl mx-auto px-5">
      
      <div className="text-center mb-16">
        <h1 className="font-serif text-5xl font-normal mb-6 tracking-wide text-gray-900">Pricing & Delivery Charges</h1>
        <p className="text-gray-500 text-lg">
          At <strong className="text-gray-900 font-semibold">Engineer's Biriyani</strong>, we aim to keep our pricing simple and transparent.
        </p>
      </div>
      
      <div className="border-t border-gray-200 pt-12">
        <h2 className="font-serif text-2xl mb-4 text-gray-900">Food Prices</h2>
        <p className="text-gray-500 leading-loose mb-3">
          All food items are displayed with their applicable prices on our Menu page.
        </p>
        <p className="text-gray-500 leading-loose mb-10">
          The final amount payable will be shown before you confirm your order.
        </p>

        <h2 className="font-serif text-2xl mb-4 text-gray-900">Delivery Charges</h2>
        <p className="text-gray-500 leading-loose mb-3">
          Delivery charges may vary depending on:
        </p>
        <ul className="text-gray-500 ml-5 mb-4 space-y-2 list-disc list-inside">
          <li>Delivery location</li>
          <li>Distance from our restaurant</li>
          <li>Order value</li>
          <li>Applicable delivery offers</li>
        </ul>
        <p className="text-gray-500 leading-loose mb-10">
          Any applicable delivery charges will be displayed during checkout before payment.
        </p>

        <h2 className="font-serif text-2xl mb-4 text-gray-900">Taxes</h2>
        <p className="text-gray-500 leading-loose mb-10">
          Applicable taxes and charges, if any, will be displayed separately during checkout where required.
        </p>

        <h2 className="font-serif text-2xl mb-4 text-gray-900">Offers & Discounts</h2>
        <p className="text-gray-500 leading-loose mb-3">
          From time to time, we may provide promotional offers, coupons, or discounts.
        </p>
        <p className="text-gray-500 leading-loose mb-3">
          Each offer may have its own terms, including:
        </p>
        <ul className="text-gray-500 ml-5 mb-4 space-y-2 list-disc list-inside">
          <li>Minimum order value</li>
          <li>Validity period</li>
          <li>Eligible locations</li>
          <li>Maximum discount</li>
          <li>One-time or limited usage</li>
        </ul>
        <p className="text-gray-500 leading-loose mb-10">
          Only one promotional offer may be applicable per order unless specifically stated otherwise.
        </p>

        <h2 className="font-serif text-2xl mb-4 text-gray-900">Final Order Amount</h2>
        <p className="text-gray-500 leading-loose mb-4">
          Before making payment, customers can review:
        </p>
        <div className="bg-gray-50 p-5 border border-gray-200 rounded-md text-center text-gray-900 font-semibold mb-6 shadow-sm">
          Food Amount + Applicable Taxes/Charges + Delivery Charges − Applicable Discount = Final Payable Amount
        </div>
        <p className="text-gray-500 leading-loose">
          The final amount displayed at checkout is the amount that will be charged to the customer.
        </p>
      </div>
      
    </div>
  );
};

export default Pricing;

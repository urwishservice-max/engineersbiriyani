import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import Layout from './layouts/Layout';
import AdminLayout from './layouts/AdminLayout';

// Customer Pages
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import OrderSuccess from './pages/OrderSuccess';
import OrderTracking from './pages/OrderTracking';
import About from './pages/About';
import Menu from './pages/Menu';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import LegalPage from './pages/LegalPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrderDetails from './pages/admin/AdminOrderDetails';
import AdminFeedbacks from './pages/admin/AdminFeedbacks';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="menu" element={<Menu />} />
          <Route path="contact" element={<Contact />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="policy/:policyType" element={<LegalPage />} />
          
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment/:orderId" element={<Payment />} />
          <Route path="order-success/:orderId" element={<OrderSuccess />} />
          <Route path="order/:orderId" element={<OrderTracking />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/orders" replace />} />
          <Route path="orders" element={<AdminDashboard />} />
          <Route path="orders/:orderId" element={<AdminOrderDetails />} />
          <Route path="feedbacks" element={<AdminFeedbacks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

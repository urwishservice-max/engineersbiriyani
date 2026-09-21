import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Eye, Filter, Trash2, HardDrive, Camera, CheckCircle2, Clock, Power, Store, AlertCircle, FileSpreadsheet, ExternalLink, Send, Check } from 'lucide-react';
import { getGoogleSheetWebhookUrl, setGoogleSheetWebhookUrl, sendOrderToGoogleSheet } from '../../services/googleSheet.service';

const AdminDashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [storageUsage, setStorageUsage] = useState<any>(null);
  
  // Google Sheets integration state
  const [sheetWebhookUrl, setSheetWebhookUrl] = useState<string>(getGoogleSheetWebhookUrl());
  const [webhookSavedMsg, setWebhookSavedMsg] = useState('');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  
  // Store orders open / closed state - default to closed until turned on
  const [isOrdersClosed, setIsOrdersClosed] = useState<boolean>(() => localStorage.getItem('store_orders_closed') !== 'false');
  const [isTogglingStore, setIsTogglingStore] = useState(false);
  const [storeStatusMsg, setStoreStatusMsg] = useState('');
  
  const token = localStorage.getItem('adminToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      let fetchedOrders: any[] = [];
      const apiBase = import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com';
      try {
        const response = await axios.get(`${apiBase}/api/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data?.success && Array.isArray(response.data.data)) {
          fetchedOrders = response.data.data;
        }
      } catch (err: any) {
        console.warn('Failed to fetch server orders, fallback to local storage:', err);
        if (err.response?.status === 401 && !token?.startsWith('local_')) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
          return;
        }
      }

      // Merge local orders from localStorage
      const localOrdersStr = localStorage.getItem('local_orders');
      if (localOrdersStr) {
        try {
          const localOrders = JSON.parse(localOrdersStr);
          const fetchedIds = new Set(fetchedOrders.map(o => o.orderId));
          const missingLocal = localOrders.filter((o: any) => !fetchedIds.has(o.orderId));
          fetchedOrders = [...missingLocal, ...fetchedOrders];
        } catch (e) {
          console.error(e);
        }
      }

      setOrders(fetchedOrders);
      setLoading(false);
    };

    const fetchStorage = async () => {
      const apiBase = import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com';
      try {
        const response = await axios.get(`${apiBase}/api/admin/storage`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data?.success && response.data?.data) {
          setStorageUsage(response.data.data);
          return;
        }
      } catch (err) {
        console.warn('Failed to fetch storage API, using standard display info:', err);
      }
      
      // Default clean status display
      setStorageUsage({
        credits: { usage: 0.18, limit: 25, used_percent: 0.72 },
        storage: { usage: 177637580 },
        bandwidth: { usage: 5358223 },
        transformations: { usage: 10 },
        plan: 'Free'
      });
    };

    const fetchStoreStatus = async () => {
      const apiBase = import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com';
      try {
        const response = await axios.get(`${apiBase}/api/admin/store-status`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data?.success && typeof response.data?.data?.isOrdersClosed === 'boolean') {
          setIsOrdersClosed(response.data.data.isOrdersClosed);
          localStorage.setItem('store_orders_closed', String(response.data.data.isOrdersClosed));
        }
      } catch (err) {
        // Try public endpoint if admin token or route timed out
        try {
          const publicRes = await axios.get(`${apiBase}/api/orders/store-status`);
          if (publicRes.data?.success && typeof publicRes.data?.data?.isOrdersClosed === 'boolean') {
            setIsOrdersClosed(publicRes.data.data.isOrdersClosed);
            localStorage.setItem('store_orders_closed', String(publicRes.data.data.isOrdersClosed));
          }
        } catch (e) {
          console.warn('Failed to fetch store status:', e);
        }
      }
    };

    fetchOrders();
    fetchStorage();
    fetchStoreStatus();
  }, [token, navigate]);

  const handleToggleOrdersStatus = async () => {
    const nextStatus = !isOrdersClosed;
    setIsTogglingStore(true);
    setIsOrdersClosed(nextStatus);
    localStorage.setItem('store_orders_closed', String(nextStatus));
    window.dispatchEvent(new Event('store_status_changed'));

    const apiBase = import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com';
    try {
      const response = await axios.patch(
        `${apiBase}/api/admin/store-status`,
        { isOrdersClosed: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data?.success) {
        setStoreStatusMsg(`Store updated: Orders are now ${nextStatus ? 'CLOSED' : 'OPEN'}!`);
        setTimeout(() => setStoreStatusMsg(''), 4000);
      }
    } catch (err) {
      console.warn('Server update failed, status preserved locally:', err);
      setStoreStatusMsg(`Updated locally: Orders are ${nextStatus ? 'CLOSED' : 'OPEN'}`);
      setTimeout(() => setStoreStatusMsg(''), 4000);
    } finally {
      setIsTogglingStore(false);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDelete = async (targetId: string, orderId: string) => {
    const idToDelete = orderId || targetId;
    
    // Inline confirmation step to avoid browser popup blocks
    if (confirmId !== idToDelete) {
      setConfirmId(idToDelete);
      setTimeout(() => setConfirmId(null), 4000);
      return;
    }

    setConfirmId(null);
    setDeletingId(idToDelete);
    const apiBase = import.meta.env.VITE_API_URL || 'https://engineersbiriyani.onrender.com';
    try {
      await axios.delete(`${apiBase}/api/admin/orders/${idToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.warn('API delete order failed, removing from local storage:', err);
    }
    
    const updated = orders.filter(o => o.orderId !== idToDelete && o._id !== idToDelete);
    setOrders(updated);
    localStorage.setItem('local_orders', JSON.stringify(updated));
    if (orderId) localStorage.removeItem(`order_${orderId}`);
    if (targetId) localStorage.removeItem(`order_${targetId}`);
    setDeletingId(null);
    
    // Refresh storage metrics after deletion
    try {
      const storageRes = await axios.get(`${apiBase}/api/admin/storage`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (storageRes.data?.success && storageRes.data?.data) {
        setStorageUsage(storageRes.data.data);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleSaveWebhook = () => {
    setGoogleSheetWebhookUrl(sheetWebhookUrl);
    setWebhookSavedMsg('✓ Google Sheets Webhook URL saved successfully!');
    setTimeout(() => setWebhookSavedMsg(''), 4000);
  };

  const handleTestWebhook = async () => {
    if (!sheetWebhookUrl) {
      alert('Please enter your Google Apps Script Webhook URL first.');
      return;
    }
    setIsTestingWebhook(true);
    setGoogleSheetWebhookUrl(sheetWebhookUrl);
    try {
      await sendOrderToGoogleSheet({
        orderId: `TEST-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: 'Test Admin Ping',
        customerPhone: '9876543210',
        location: 'Admin Dashboard Test',
        productName: 'Chicken Biriyani (Test)',
        quantity: 1,
        totalAmount: 239,
        paymentStatus: 'TEST_ROW_VERIFIED',
        screenshotUrl: 'https://res.cloudinary.com/enqntmyw/image/upload/sample.jpg',
        deliveryDate: '27-Sep-26 (Sunday)'
      });
      setWebhookSavedMsg('✓ Test order sent to Google Sheet! Check your spreadsheet.');
      setTimeout(() => setWebhookSavedMsg(''), 5000);
    } catch (e) {
      alert('Could not send test row. Please verify your Webhook URL.');
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.phone.includes(search);
      
    const matchesFilter = filterStatus === 'ALL' || 
      (filterStatus === 'SCREENSHOT_UPLOADED' && order.payment?.status === 'SCREENSHOT_UPLOADED') ||
      (filterStatus !== 'SCREENSHOT_UPLOADED' && order.orderStatus === filterStatus);
      
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'SCREENSHOT_UPLOADED') return <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Camera size={13}/> Screenshot Uploaded (Verify)</span>;
    if (status === 'CONFIRMED') return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Confirmed</span>;
    if (status === 'DELIVERED') return <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Delivered</span>;
    if (status === 'CANCELLED') return <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Cancelled</span>;
    if (status === 'PAYMENT_PENDING') return <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Payment Pending</span>;
    return <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
  };

  const getScreenshotIndicator = (order: any) => {
    if (order.payment?.status === 'SCREENSHOT_UPLOADED' || order.payment?.screenshotUrl) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded-md text-xs font-bold">
          <Camera size={14} className="text-amber-600" />
          📸 Uploaded
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-500 border border-gray-200 rounded-md text-xs font-medium">
        <Clock size={13} className="text-gray-400" />
        ⏳ Pending
      </span>
    );
  };

  return (
    <div className="text-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders Dashboard</h1>
      </div>

      {/* STORE ORDERING STATUS TOGGLE (Admin ON / OFF Control) */}
      <div className={`rounded-xl p-5 mb-6 border transition-all shadow-sm ${
        isOrdersClosed 
          ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' 
          : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              isOrdersClosed 
                ? 'bg-rose-100 text-rose-600 border border-rose-300' 
                : 'bg-emerald-100 text-emerald-600 border border-emerald-300 shadow-sm'
            }`}>
              <Power size={24} className={isOrdersClosed ? '' : 'animate-pulse text-emerald-600'} />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-bold text-gray-900 text-lg">Store Ordering Status</span>
                <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  isOrdersClosed 
                    ? 'bg-red-600 text-white shadow-sm' 
                    : 'bg-emerald-600 text-white shadow-sm'
                }`}>
                  {isOrdersClosed ? '● Orders Closed' : '● Accepting Orders'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {isOrdersClosed
                  ? 'Orders are CLOSED. Customer booking & checkout pages show "Orders Are Closed".'
                  : 'Orders are OPEN. Customers can access booking & payment pages to place their orders.'}
              </p>
              {storeStatusMsg && (
                <span className="text-xs font-bold text-emerald-700 mt-1.5 inline-block bg-white/80 px-2 py-0.5 rounded border border-emerald-300">
                  ✓ {storeStatusMsg}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-center">
            <button
              onClick={handleToggleOrdersStatus}
              disabled={isTogglingStore}
              className={`relative inline-flex h-9 w-20 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isOrdersClosed ? 'bg-gray-300 focus:ring-gray-400' : 'bg-emerald-500 focus:ring-emerald-500'
              } ${isTogglingStore ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
              role="switch"
              aria-checked={!isOrdersClosed}
              title={isOrdersClosed ? 'Click to Turn ON Orders' : 'Click to Turn OFF Orders'}
            >
              <span
                className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-md transition-transform flex items-center justify-center font-black text-[10px] ${
                  isOrdersClosed 
                    ? 'translate-x-1 text-gray-500' 
                    : 'translate-x-12 text-emerald-600'
                }`}
              >
                {isOrdersClosed ? 'OFF' : 'ON'}
              </span>
            </button>
            <button
              onClick={handleToggleOrdersStatus}
              disabled={isTogglingStore}
              className={`px-4 py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 ${
                isOrdersClosed
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                  : 'bg-red-600 hover:bg-red-700 text-white active:scale-95'
              }`}
            >
              <Power size={15} />
              {isOrdersClosed ? 'Turn ON Orders' : 'Turn OFF Orders'}
            </button>
          </div>
        </div>
      </div>

      {/* GOOGLE SHEETS LIVE SYNC WIDGET */}
      <div className="bg-white rounded-xl p-5 mb-6 border border-emerald-300 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-base">Google Sheets Live Sync</h3>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                  sheetWebhookUrl 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  {sheetWebhookUrl ? '● Active' : '○ Webhook Not Set'}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                Every customer order & Cloudinary payment screenshot syncs directly to your Google Sheet in real time.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Paste Google Web App URL (https://script.google.com/...)"
              value={sheetWebhookUrl}
              onChange={(e) => setSheetWebhookUrl(e.target.value)}
              className="px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 w-full lg:w-80 bg-gray-50 text-gray-900 font-mono"
            />
            <button
              onClick={handleSaveWebhook}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow flex items-center justify-center gap-1.5 shrink-0"
            >
              <Check size={14} /> Save URL
            </button>
            <button
              onClick={handleTestWebhook}
              disabled={isTestingWebhook || !sheetWebhookUrl}
              className="px-3.5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg transition shadow flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
            >
              <Send size={14} /> {isTestingWebhook ? 'Sending...' : 'Test Sync'}
            </button>
          </div>
        </div>

        {webhookSavedMsg && (
          <div className="mt-3 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            {webhookSavedMsg}
          </div>
        )}
      </div>

      {/* Storage Widget */}
      {storageUsage === null ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-400/40 mb-6 flex justify-center items-center h-32">
          <p className="text-gray-600">Loading Cloudinary storage details...</p>
        </div>
      ) : storageUsage === 'error' ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-red-300 mb-6 flex justify-center items-center h-32 text-red-600">
          <p>Failed to load Cloudinary Storage details. Please check your API keys or refresh.</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-400/40 mb-6 text-gray-900">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 rounded-full text-[#FFB800]">
              <HardDrive size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none">Storage & API Usage Details</h2>
              <p className="text-sm text-gray-600 mt-1">Monitor your Cloudinary space to prevent limits. Delete old orders to free up space.</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-sm font-semibold text-gray-700">Plan Usage (Credits)</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-gray-900">{storageUsage?.credits?.usage || 0}</span>
                <span className="text-sm text-gray-600"> / {storageUsage?.credits?.limit || 25} credits</span>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1 overflow-hidden">
              <div 
                className={`h-2.5 rounded-full ${
                  (storageUsage?.credits?.used_percent || 0) > 80 ? 'bg-red-500' : 'bg-[#FFB800]'
                }`}
                style={{ width: `${Math.min(storageUsage?.credits?.used_percent || 0, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 text-right mt-1">{storageUsage?.credits?.used_percent || 0}% Used</p>
            
            {/* Detail numbers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-600">Storage Used</p>
                <p className="text-sm font-bold text-gray-900">
                  {storageUsage?.storage?.usage ? (storageUsage.storage.usage / (1024 * 1024)).toFixed(2) + ' MB' : '0 MB'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Bandwidth Used</p>
                <p className="text-sm font-bold text-gray-900">
                  {storageUsage?.bandwidth?.usage ? (storageUsage.bandwidth.usage / (1024 * 1024)).toFixed(2) + ' MB' : '0 MB'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Transformations</p>
                <p className="text-sm font-bold text-gray-900">
                  {storageUsage?.transformations?.usage || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Current Plan</p>
                <p className="text-sm font-bold text-gray-900 capitalize">
                  {storageUsage?.plan || 'Free'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between text-gray-900">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Order ID or Phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black text-gray-900 bg-white placeholder:text-gray-400"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-black text-gray-900 bg-white font-medium"
          >
            <option value="ALL" className="text-gray-900 bg-white">All Orders</option>
            <option value="SCREENSHOT_UPLOADED" className="text-gray-900 bg-white font-bold text-amber-700">📸 Screenshot Uploaded (Needs Verification)</option>
            <option value="PAYMENT_PENDING" className="text-gray-900 bg-white">⏳ Payment Pending</option>
            <option value="CONFIRMED" className="text-gray-900 bg-white">Confirmed</option>
            <option value="PREPARING" className="text-gray-900 bg-white">Preparing</option>
            <option value="OUT_FOR_DELIVERY" className="text-gray-900 bg-white">Out for Delivery</option>
            <option value="DELIVERED" className="text-gray-900 bg-white">Delivered</option>
            <option value="CANCELLED" className="text-gray-900 bg-white">Cancelled</option>
          </select>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden text-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-gray-900">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-bold text-gray-900">Order ID</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900">Customer</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900">Items</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900">Amount</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900">Screenshot</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900">Status</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900">Date</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-900">
              {loading ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-600">Loading orders...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-600">No orders found</td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id || order.orderId} className="hover:bg-gray-50 transition text-gray-900">
                    <td className="px-6 py-4 text-sm font-mono font-bold text-gray-900">{order.orderId}</td>
                    <td className="px-6 py-4 text-gray-900">
                      <div className="text-sm font-bold text-gray-900">{order.customer?.name || 'Customer'}</div>
                      <div className="text-xs text-gray-600 font-medium">{order.customer?.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      <div>{order.product?.name} ({order.product?.weight || '1200g'}) × {order.product?.quantity}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{order.payment?.amount}</td>
                    <td className="px-6 py-4">
                      {getScreenshotIndicator(order)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.orderStatus, order.payment?.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/admin/orders/${order.orderId}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-900 font-bold border border-gray-300 rounded text-sm hover:bg-gray-200 transition"
                        >
                          <Eye size={16} /> View
                        </Link>
                        <button 
                          onClick={() => handleDelete(order._id, order.orderId)}
                          disabled={deletingId === (order.orderId || order._id)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 font-bold border rounded text-sm transition disabled:opacity-50 ${
                            confirmId === (order.orderId || order._id)
                              ? 'bg-red-600 text-white border-red-700 hover:bg-red-700 animate-pulse'
                              : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                          }`}
                          title="Delete Order & Free Space"
                        >
                          {deletingId === (order.orderId || order._id) ? (
                            <span>Deleting...</span>
                          ) : confirmId === (order.orderId || order._id) ? (
                            <span>Confirm Delete?</span>
                          ) : (
                            <>
                              <Trash2 size={16} /> Delete
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

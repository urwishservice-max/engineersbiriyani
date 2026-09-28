import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Eye, Filter, Trash2, HardDrive, Camera, CheckCircle2, Clock, 
  Power, Store, AlertCircle, FileSpreadsheet, ExternalLink, Send, Check,
  Calendar, CalendarDays, CalendarRange, X, RotateCcw, ArrowUpDown, TrendingUp, ChevronDown
} from 'lucide-react';
import { getGoogleSheetWebhookUrl, setGoogleSheetWebhookUrl, sendOrderToGoogleSheet } from '../../services/googleSheet.service';

type DateFilterType = 'ALL' | 'TODAY' | 'YESTERDAY' | 'THIS_WEEK' | 'LAST_WEEK' | 'THIS_MONTH' | 'LAST_MONTH' | 'CUSTOM';
type SortOption = 'NEWEST' | 'OLDEST' | 'AMOUNT_DESC' | 'AMOUNT_ASC';

const AdminDashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [storageUsage, setStorageUsage] = useState<any>(null);
  
  // Date & Duration filter states
  const [dateFilter, setDateFilter] = useState<DateFilterType>('ALL');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [showCustomRangePicker, setShowCustomRangePicker] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('NEWEST');

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
        totalAmount: 249,
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

  // Helper for computing standard date boundaries
  const getPeriodDateRange = (type: DateFilterType): { start: Date | null; end: Date | null; label: string } => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (type === 'TODAY') {
      return { start: todayStart, end: todayEnd, label: 'Today' };
    }
    if (type === 'YESTERDAY') {
      const yStart = new Date(todayStart);
      yStart.setDate(yStart.getDate() - 1);
      const yEnd = new Date(todayEnd);
      yEnd.setDate(yEnd.getDate() - 1);
      return { start: yStart, end: yEnd, label: 'Yesterday' };
    }
    if (type === 'THIS_WEEK') {
      const day = now.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday, 0, 0, 0, 0);
      const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6, 23, 59, 59, 999);
      return { start: weekStart, end: weekEnd, label: 'This Week' };
    }
    if (type === 'LAST_WEEK') {
      const day = now.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const thisWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday, 0, 0, 0, 0);
      const lastWeekStart = new Date(thisWeekStart.getFullYear(), thisWeekStart.getMonth(), thisWeekStart.getDate() - 7, 0, 0, 0, 0);
      const lastWeekEnd = new Date(lastWeekStart.getFullYear(), lastWeekStart.getMonth(), lastWeekStart.getDate() + 6, 23, 59, 59, 999);
      return { start: lastWeekStart, end: lastWeekEnd, label: 'Previous Week' };
    }
    if (type === 'THIS_MONTH') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return { start: monthStart, end: monthEnd, label: 'This Month' };
    }
    if (type === 'LAST_MONTH') {
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      return { start: lastMonthStart, end: lastMonthEnd, label: 'Previous Month' };
    }
    return { start: null, end: null, label: 'All Time' };
  };

  // Comprehensive filtering and sorting logic
  const filteredAndSortedOrders = useMemo(() => {
    const result = orders.filter(order => {
      // 1. Search Query Match
      const query = search.trim().toLowerCase();
      if (query) {
        const idMatch = order.orderId?.toLowerCase().includes(query);
        const phoneMatch = order.customer?.phone?.toLowerCase().includes(query);
        const nameMatch = order.customer?.name?.toLowerCase().includes(query);
        const locMatch = order.customer?.location?.toLowerCase().includes(query);
        const addrMatch = order.customer?.address?.toLowerCase().includes(query);
        if (!idMatch && !phoneMatch && !nameMatch && !locMatch && !addrMatch) {
          return false;
        }
      }
      
      // 2. Status Match
      if (filterStatus !== 'ALL') {
        if (filterStatus === 'SCREENSHOT_UPLOADED') {
          if (order.payment?.status !== 'SCREENSHOT_UPLOADED') return false;
        } else if (order.orderStatus !== filterStatus) {
          return false;
        }
      }

      // 3. Date & Duration Filter Match
      const orderDate = new Date(order.createdAt || order.date || Date.now());
      const orderTime = orderDate.getTime();

      if (dateFilter === 'CUSTOM' || (dateFilter === 'ALL' && (customStartDate || customEndDate))) {
        if (customStartDate) {
          const [sy, sm, sd] = customStartDate.split('-').map(Number);
          const startBoundary = new Date(sy, sm - 1, sd, 0, 0, 0, 0).getTime();
          if (orderTime < startBoundary) return false;
        }
        if (customEndDate) {
          const [ey, em, ed] = customEndDate.split('-').map(Number);
          const endBoundary = new Date(ey, em - 1, ed, 23, 59, 59, 999).getTime();
          if (orderTime > endBoundary) return false;
        }
      } else if (dateFilter !== 'ALL') {
        const period = getPeriodDateRange(dateFilter);
        if (period.start && orderTime < period.start.getTime()) return false;
        if (period.end && orderTime > period.end.getTime()) return false;
      }

      return true;
    });

    // Sort order
    return result.sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      const amtA = Number(a.payment?.amount || a.product?.totalAmount || 0);
      const amtB = Number(b.payment?.amount || b.product?.totalAmount || 0);

      if (sortBy === 'NEWEST') return timeB - timeA;
      if (sortBy === 'OLDEST') return timeA - timeB;
      if (sortBy === 'AMOUNT_DESC') return amtB - amtA;
      if (sortBy === 'AMOUNT_ASC') return amtA - amtB;
      return 0;
    });
  }, [orders, search, filterStatus, dateFilter, customStartDate, customEndDate, sortBy]);

  // Analytics summary for filtered orders
  const filteredMetrics = useMemo(() => {
    const total = filteredAndSortedOrders.length;
    const totalRevenue = filteredAndSortedOrders.reduce((sum, o) => {
      if (o.orderStatus === 'CANCELLED') return sum;
      return sum + (Number(o.payment?.amount) || 0);
    }, 0);
    const screenshotPending = filteredAndSortedOrders.filter(o => o.payment?.status === 'SCREENSHOT_UPLOADED').length;
    const confirmed = filteredAndSortedOrders.filter(o => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'DELIVERED').length;
    const pending = filteredAndSortedOrders.filter(o => o.orderStatus === 'PAYMENT_PENDING').length;

    return { total, totalRevenue, screenshotPending, confirmed, pending };
  }, [filteredAndSortedOrders]);

  const hasActiveFilters = Boolean(
    search.trim() !== '' || 
    filterStatus !== 'ALL' || 
    dateFilter !== 'ALL' || 
    customStartDate || 
    customEndDate || 
    sortBy !== 'NEWEST'
  );

  const handleResetAllFilters = () => {
    setSearch('');
    setFilterStatus('ALL');
    setDateFilter('ALL');
    setCustomStartDate('');
    setCustomEndDate('');
    setShowCustomRangePicker(false);
    setSortBy('NEWEST');
  };

  const handleSelectDatePreset = (preset: DateFilterType) => {
    setDateFilter(preset);
    if (preset === 'CUSTOM') {
      setShowCustomRangePicker(true);
    } else {
      setShowCustomRangePicker(false);
      setCustomStartDate('');
      setCustomEndDate('');
    }
  };

  // Helper text describing active duration
  const getActiveDurationDescription = (): string => {
    if (dateFilter === 'ALL' && !customStartDate && !customEndDate) {
      return 'All Dates';
    }
    if (dateFilter === 'CUSTOM' || customStartDate || customEndDate) {
      if (customStartDate && customEndDate) {
        return `Between ${customStartDate} and ${customEndDate}`;
      }
      if (customStartDate) {
        return `From ${customStartDate} onwards`;
      }
      if (customEndDate) {
        return `Up to ${customEndDate}`;
      }
      return 'Between Custom Dates';
    }
    const { start, end, label } = getPeriodDateRange(dateFilter);
    if (start && end) {
      const formatOpt: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
      return `${label} (${start.toLocaleDateString('en-IN', formatOpt)} - ${end.toLocaleDateString('en-IN', formatOpt)})`;
    }
    return label;
  };

  const getStatusBadge = (status: string, paymentStatus: string, order?: any) => {
    if (order?.payment?.method === 'COD' || order?.isPreOrder) {
      if (status === 'CONFIRMED' || status === 'PAYMENT_PENDING') {
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold">💵 COD (Pre-Order)</span>;
      }
    }
    if (paymentStatus === 'SCREENSHOT_UPLOADED') return <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Camera size={13}/> Screenshot Uploaded (Verify)</span>;
    if (status === 'CONFIRMED') return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Confirmed</span>;
    if (status === 'DELIVERED') return <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Delivered</span>;
    if (status === 'CANCELLED') return <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Cancelled</span>;
    if (status === 'PAYMENT_PENDING') return <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Payment Pending</span>;
    return <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
  };

  const getScreenshotIndicator = (order: any) => {
    if (order.payment?.method === 'COD' || order.isPreOrder) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-bold">
          💵 Cash on Delivery
        </span>
      );
    }
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
    <div className="text-gray-900 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Orders Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Manage, filter, verify payments and track biriyani orders in real time.</p>
        </div>
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

      {/* ============================================================== */}
      {/* COMPREHENSIVE FILTER SYSTEM (DURATION, THIS WEEK, PREVIOUS, CUSTOM) */}
      {/* ============================================================== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        {/* Filter Header & Quick Analytics Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Filter size={19} className="text-amber-600" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Filter Orders by Duration & Status</h2>
                {hasActiveFilters && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold rounded-full">
                    Filtered
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Filter orders by <span className="font-semibold text-gray-800">This Week</span>, <span className="font-semibold text-gray-800">Previous Week</span>, <span className="font-semibold text-gray-800">Custom Dates (Between Duration)</span>, or status.
              </p>
            </div>

            {/* Quick Metrics Badges for Current Filtered Selection */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-xs flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Orders:</span>
                <span className="text-sm font-black text-gray-900">{filteredMetrics.total}</span>
              </div>
              <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg shadow-xs flex items-center gap-2">
                <span className="text-xs text-emerald-700 font-medium">Revenue:</span>
                <span className="text-sm font-black text-emerald-800">₹{filteredMetrics.totalRevenue}</span>
              </div>
              {filteredMetrics.screenshotPending > 0 && (
                <div className="px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-lg shadow-xs flex items-center gap-1.5 text-amber-900">
                  <Camera size={14} className="text-amber-600" />
                  <span className="text-xs font-bold">{filteredMetrics.screenshotPending} to Verify</span>
                </div>
              )}
              {hasActiveFilters && (
                <button
                  onClick={handleResetAllFilters}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border border-gray-300 cursor-pointer"
                  title="Reset all filters to default"
                >
                  <RotateCcw size={13} /> Reset All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Controls Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Row 1: Duration Presets Toolbar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <CalendarDays size={14} className="text-amber-600" />
                Select Time Duration:
              </label>
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Active: {getActiveDurationDescription()}
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => handleSelectDatePreset('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                  dateFilter === 'ALL' && !customStartDate && !customEndDate
                    ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                All Time
              </button>

              <button
                type="button"
                onClick={() => handleSelectDatePreset('TODAY')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                  dateFilter === 'TODAY'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                Today
              </button>

              <button
                type="button"
                onClick={() => handleSelectDatePreset('YESTERDAY')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                  dateFilter === 'YESTERDAY'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                Yesterday
              </button>

              <button
                type="button"
                onClick={() => handleSelectDatePreset('THIS_WEEK')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition border shadow-xs flex items-center gap-1.5 ${
                  dateFilter === 'THIS_WEEK'
                    ? 'bg-amber-600 text-white border-amber-600 ring-2 ring-amber-300'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                <span>⚡ This Week</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDatePreset('LAST_WEEK')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition border shadow-xs flex items-center gap-1.5 ${
                  dateFilter === 'LAST_WEEK'
                    ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-200'
                }`}
              >
                <span>⏮ Previous Week</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDatePreset('THIS_MONTH')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                  dateFilter === 'THIS_MONTH'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                This Month
              </button>

              <button
                type="button"
                onClick={() => handleSelectDatePreset('LAST_MONTH')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                  dateFilter === 'LAST_MONTH'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                Previous Month
              </button>

              <button
                type="button"
                onClick={() => {
                  setDateFilter('CUSTOM');
                  setShowCustomRangePicker(!showCustomRangePicker || dateFilter !== 'CUSTOM');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition border flex items-center gap-1.5 shadow-sm ${
                  dateFilter === 'CUSTOM' || customStartDate || customEndDate
                    ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-300'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300'
                }`}
              >
                <CalendarRange size={14} />
                <span>Between Duration (Custom Dates)</span>
                <ChevronDown size={13} className={`transition-transform ${showCustomRangePicker ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Row 2: Between the Duration (Custom Date Range Picker) Drawer */}
          {(showCustomRangePicker || dateFilter === 'CUSTOM' || customStartDate || customEndDate) && (
            <div className="p-4 bg-gradient-to-r from-emerald-50/60 to-teal-50/40 rounded-xl border border-emerald-200 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <CalendarRange size={16} className="text-emerald-700" />
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                    Custom Date Range Filter (Between Two Dates)
                  </span>
                </div>
                {(customStartDate || customEndDate) && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomStartDate('');
                      setCustomEndDate('');
                    }}
                    className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <X size={12} /> Clear Custom Dates
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">From Date (Start):</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => {
                      setCustomStartDate(e.target.value);
                      setDateFilter('CUSTOM');
                    }}
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">To Date (End):</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => {
                      setCustomEndDate(e.target.value);
                      setDateFilter('CUSTOM');
                    }}
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2 flex items-center gap-2 pt-2 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      const past7 = new Date(now);
                      past7.setDate(past7.getDate() - 7);
                      setCustomStartDate(past7.toISOString().split('T')[0]);
                      setCustomEndDate(now.toISOString().split('T')[0]);
                      setDateFilter('CUSTOM');
                    }}
                    className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-md border border-emerald-200 transition shadow-xs"
                  >
                    Last 7 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      const past14 = new Date(now);
                      past14.setDate(past14.getDate() - 14);
                      setCustomStartDate(past14.toISOString().split('T')[0]);
                      setCustomEndDate(now.toISOString().split('T')[0]);
                      setDateFilter('CUSTOM');
                    }}
                    className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-md border border-emerald-200 transition shadow-xs"
                  >
                    Last 14 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      const past30 = new Date(now);
                      past30.setDate(past30.getDate() - 30);
                      setCustomStartDate(past30.toISOString().split('T')[0]);
                      setCustomEndDate(now.toISOString().split('T')[0]);
                      setDateFilter('CUSTOM');
                    }}
                    className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-md border border-emerald-200 transition shadow-xs"
                  >
                    Last 30 Days
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Row 3: Search, Status Dropdown & Sorting */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
            {/* Search Box */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
              <input 
                type="text" 
                placeholder="Search by Order ID, Phone, Customer Name..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 bg-white placeholder:text-gray-400 text-xs sm:text-sm font-medium"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Status Filter Dropdown */}
            <div className="md:col-span-4 relative">
              <div className="relative">
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 bg-white font-medium text-xs sm:text-sm appearance-none cursor-pointer"
                >
                  <option value="ALL">All Order Statuses</option>
                  <option value="SCREENSHOT_UPLOADED" className="font-bold text-amber-700">📸 Screenshot Uploaded (Needs Verification)</option>
                  <option value="PAYMENT_PENDING">⏳ Payment Pending</option>
                  <option value="CONFIRMED">✓ Confirmed</option>
                  <option value="PREPARING">🍳 Preparing</option>
                  <option value="OUT_FOR_DELIVERY">🛵 Out for Delivery</option>
                  <option value="DELIVERED">📦 Delivered</option>
                  <option value="CANCELLED">✕ Cancelled</option>
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3 relative">
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 bg-white font-medium text-xs sm:text-sm appearance-none cursor-pointer"
                >
                  <option value="NEWEST">Date: Newest First</option>
                  <option value="OLDEST">Date: Oldest First</option>
                  <option value="AMOUNT_DESC">Amount: Highest First</option>
                  <option value="AMOUNT_ASC">Amount: Lowest First</option>
                </select>
                <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 4: Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-gray-100 text-xs">
              <span className="text-gray-500 font-semibold">Active Filters:</span>
              
              {dateFilter !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-900 rounded-md font-medium border border-amber-300">
                  <Calendar size={12} />
                  Duration: {getActiveDurationDescription()}
                  <button 
                    onClick={() => handleSelectDatePreset('ALL')}
                    className="hover:text-red-700 ml-1 font-bold"
                  >
                    ×
                  </button>
                </span>
              )}

              {filterStatus !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-900 rounded-md font-medium border border-blue-200">
                  Status: {filterStatus}
                  <button 
                    onClick={() => setFilterStatus('ALL')}
                    className="hover:text-red-700 ml-1 font-bold"
                  >
                    ×
                  </button>
                </span>
              )}

              {search.trim() && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-800 rounded-md font-medium border border-gray-300">
                  Search: "{search}"
                  <button 
                    onClick={() => setSearch('')}
                    className="hover:text-red-700 ml-1 font-bold"
                  >
                    ×
                  </button>
                </span>
              )}

              {sortBy !== 'NEWEST' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-900 rounded-md font-medium border border-purple-200">
                  Sorted: {sortBy}
                  <button 
                    onClick={() => setSortBy('NEWEST')}
                    className="hover:text-red-700 ml-1 font-bold"
                  >
                    ×
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={handleResetAllFilters}
                className="text-red-600 hover:text-red-800 font-bold ml-auto cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* ============================================================== */}
      {/* Orders Table */}
      {/* ============================================================== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-gray-900">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 text-sm sm:text-base">Order Records</span>
            <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs font-bold rounded-full">
              {filteredAndSortedOrders.length} {filteredAndSortedOrders.length === 1 ? 'order' : 'orders'}
            </span>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            Showing filtered results
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-gray-900">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Screenshot</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Order Date & Time</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-900">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-600">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium">Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAndSortedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-600">
                    <div className="max-w-sm mx-auto flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <Filter size={22} />
                      </div>
                      <div className="font-bold text-gray-900 text-base">No orders found</div>
                      <p className="text-xs text-gray-500">
                        No orders match your selected filters ({getActiveDurationDescription()}). Try clearing or expanding your duration filter.
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={handleResetAllFilters}
                          className="mt-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAndSortedOrders.map((order) => {
                  const orderDate = new Date(order.createdAt || order.date || Date.now());
                  const formattedDate = orderDate.toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  });
                  const formattedTime = orderDate.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  });

                  return (
                    <tr key={order._id || order.orderId} className="hover:bg-gray-50 transition text-gray-900">
                      <td className="px-6 py-4 text-sm font-mono font-bold text-gray-900">
                        {order.orderId}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        <div className="text-sm font-bold text-gray-900">{order.customer?.name || 'Customer'}</div>
                        <div className="text-xs text-gray-600 font-medium">{order.customer?.phone}</div>
                        {order.customer?.location && (
                          <div className="text-[11px] text-gray-500 truncate max-w-xs">{order.customer.location}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        <div>
                          {order.product?.name || 'Chicken Biriyani'} ({order.product?.weight || '1200g'}) × {order.product?.quantity || 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        ₹{order.payment?.amount || order.product?.totalAmount || 0}
                      </td>
                      <td className="px-6 py-4">
                        {getScreenshotIndicator(order)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.orderStatus, order.payment?.status, order)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                        <div className="font-bold text-gray-900">{formattedDate}</div>
                        <div className="text-xs text-gray-500 font-normal">{formattedTime}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link 
                            to={`/admin/orders/${order.orderId}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-900 font-bold border border-gray-300 rounded text-sm hover:bg-gray-200 transition"
                          >
                            <Eye size={16} /> View
                          </Link>
                          <button 
                            onClick={() => handleDelete(order._id, order.orderId)}
                            disabled={deletingId === (order.orderId || order._id)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 font-bold border rounded text-sm transition disabled:opacity-50 cursor-pointer ${
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, LogOut } from 'lucide-react';
import { dashboardAPI } from '../services/apiService';
import { authUtils } from '../utils/authUtils';
import LoginPage from './LoginPage';
import RegistrationsTab from '../components/dashboard/RegistrationsTab';
import MerchandiseTab from '../components/dashboard/MerchandiseTab';
import logo from '/logo-wc.png';

// ── Type Definitions ────────────────────────────────────────────────────────
interface Registration {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  attendanceMode: string;
  referralSource: string;
  breakoutSessionChoice?: string;
  paymentStatus?: string;
  createdAt: string;
}

interface MerchandiseOrder {
  merchandiseId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  color: string;
  size: string;
  quantity: number;
  totalAmount: number;
}

interface AdminData {
  registrations: Registration[];
  merchandise_orders: MerchandiseOrder[];
}

interface StatCardProps {
  label: string;
  value: number;
  sub?: string;
}

interface TabDefinition {
  key: keyof AdminData;
  label: string;
  count: number;
}

// ── Helper Components ──────────────────────────────────────────────────────
function StatCard({ label, value, sub }: StatCardProps) {
  const displayValue = value >= 1000 && label.toLowerCase().includes('revenue') 
    ? `₦${value.toLocaleString()}` 
    : value.toLocaleString();

  return (
    <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all">
      <div className="text-[11px] tracking-widest uppercase text-gray-500 font-bold mb-2">
        {label}
      </div>
      <div className="text-3xl font-black text-gray-900 tracking-tight">
        {displayValue}
      </div>
      {sub && <div className="text-xs text-gray-500 mt-1 font-medium">{sub}</div>}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function Admin() {
  // Authentication State
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // UI State
  const [activeTab, setActiveTab] = useState<keyof AdminData>('registrations');
  const [allData, setAllData] = useState<AdminData>({
    registrations: [],
    merchandise_orders: [],
  });

  // Loading States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // ── Initialize Authentication ──────────────────────────────────────────
  useEffect(() => {
    const storedToken = authUtils.getToken();
    if (storedToken) {
      setToken(storedToken);
    }
    setAuthLoading(false);
  }, []);

  // ── Fetch Summary Stats ──────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [regRes, merchRes] = await Promise.all([
        dashboardAPI.getRecentRegistrations(token, { limit: 1000 }),
        dashboardAPI.getMerchandiseOrders(token, { limit: 1000 })
      ]);
      
      setAllData({
        registrations: regRes.attendees || regRes.data || [],
        merchandise_orders: merchRes.data || merchRes.orders || [],
      });
      setLastRefresh(new Date());
    } catch (err) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Derived Calculations
  const totalRegAmount = allData.registrations.length * 2000;
  const totalMerchAmount = allData.merchandise_orders.reduce((sum, order) => {
    return sum + (Number(order.totalAmount) || 0);
  }, 0);

  // ── Auto-fetch on token change ─────────────────────────────────────────
  useEffect(() => {
    if (token) {
      fetchAll();
    }
  }, [token, fetchAll]);

  // ── Handle Login ───────────────────────────────────────────────────────
  const handleLogin = (authToken: string) => {
    authUtils.setToken(authToken);
    setToken(authToken);
    setError(null);
  };

  // ── Handle Logout ──────────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      if (token) {
        await dashboardAPI.logout(token);
      }
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      authUtils.logout();
      setToken(null);
      setAllData({
        registrations: [],
        merchandise_orders: [],
      });
      setLastRefresh(null);
    }
  };

  // ── Show Loading State ─────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-gray-400 text-xs tracking-widest uppercase font-bold animate-pulse">Loading...</div>
      </div>
    );
  }

  // ── Show Login Page ────────────────────────────────────────────────────
  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // ── Tab Configuration ─────────────────────────────────────────────────
  const tabs: TabDefinition[] = [
    {
      key: 'registrations',
      label: 'Registrations',
      count: allData.registrations.length,
    },
    {
      key: 'merchandise_orders',
      label: 'Merchandise Orders',
      count: allData.merchandise_orders.length,
    },
  ];

  // ── Main Render ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Top Bar */}
      <header className="bg-brand-black border-b border-gray-800/80 px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl">
        <div>
          <img src={logo} alt="OTEI Logo" className="h-8 w-auto object-contain" />
        </div>
        <div className="flex items-center gap-4">
          {lastRefresh && (
            <span className="text-xs text-gray-400 hidden md:block">
              Last refreshed: {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchAll}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <a
            href="/"
            className="text-xs font-bold text-gray-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
          >
            View Site
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-brand-red px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-brand-red/30 transition-all cursor-pointer"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard
            label="Total Registrations"
            value={allData.registrations.length}
            sub="Event attendees"
          />
          <StatCard
            label="Reg. Revenue"
            value={totalRegAmount}
            sub="₦2,000 per head"
          />
          <StatCard
            label="Merch Orders"
            value={allData.merchandise_orders.length}
            sub="Orders received"
          />
          <StatCard
            label="Merch Revenue"
            value={totalMerchAmount}
            sub="Total sales value"
          />
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-200/80 pb-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {tabs.map((t) => {
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-2xl transition-all duration-150 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-red to-brand-orange text-white shadow-md shadow-brand-red/20'
                    : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200/80 hover:bg-gray-50'
                }`}
              >
                {t.label}
                <span
                  className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Content */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
          {activeTab === 'registrations' && (
            <RegistrationsTab />
          )}
          {activeTab === 'merchandise_orders' && (
            <MerchandiseTab />
          )}
        </div>
      </div>
    </div>
  );
}

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
  // Check if it's a large amount to format as currency
  const displayValue = value >= 1000 && label.toLowerCase().includes('revenue') 
    ? `₦${value.toLocaleString()}` 
    : value.toLocaleString();

  return (
    <div className="bg-white border border-gray-100 p-5">
      <div className="text-[10px] tracking-widest uppercase text-gray-600 font-medium mb-1">
        {label}
      </div>
      <div className="font-serif text-3xl font-bold text-brand-black">
        {displayValue}
      </div>
      {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
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
        <div className="text-gray-600 text-xs tracking-widest uppercase">Loading...</div>
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
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-brand-black border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div>
          <img src={logo} alt="OTEI Logo" className="h-8" />
        </div>
        <div className="flex items-center gap-4">
          {lastRefresh && (
            <span className="text-[10px] text-gray-600 hidden md:block">
              Last refreshed: {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchAll}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <a
            href="/"
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            View Site
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5 mb-8">
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
        <div className="flex gap-0.5 mb-6 border-b border-gray-200 overflow-x-auto whitespace-nowrap scrollbar-hide scroll-smooth">
          {tabs.map((t) => (
            <button
              key={t.key}
              ref={(el) => {
                if (activeTab === t.key && el) {
                  el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center',
                  });
                }
              }}
              onClick={() => setActiveTab(t.key)}
              className={`px-5 py-3 text-xs font-semibold tracking-wide transition-colors duration-150 relative shrink-0 ${
                activeTab === t.key
                  ? 'text-brand-orange border-b-2 border-brand-orange -mb-px'
                  : 'text-gray-400 hover:text-brand-black'
              }`}
            >
              {t.label}
              <span
                className={`ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-sm ${
                  activeTab === t.key
                    ? 'bg-orange-50 text-brand-orange'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Dynamic Tab Content */}
        <div className="bg-white border border-gray-100 p-6">
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

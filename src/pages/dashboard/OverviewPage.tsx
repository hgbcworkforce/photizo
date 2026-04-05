import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { dashboardAPI, merchandiseAPI } from '../../services/apiService';
import { StatCard, Spinner } from '../../components/dashboard/UI';

interface Registration {
  id?: string;
  paymentStatus: 'complete' | 'paid' | 'pending' | string;
  attendanceMode: 'Physical' | 'Virtual' | string;
  createdAt: string;
  referralSource?: string;
  breakoutSessionChoice?: string;
}

interface MerchandiseOrder {
  id?: string;
  totalAmount: number;
}

interface OverviewPageProps {
  token: string;
}

const OverviewPage: React.FC<OverviewPageProps> = ({ token }) => {
  const [regs,    setRegs]    = useState<Registration[]>([]);
  const [merch,   setMerch]   = useState<MerchandiseOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [r, m] = await Promise.all([
          // dashboardAPI — accepts a filters object, token is first arg
          dashboardAPI.getRecentRegistrations(token, { limit: 200 }),
          merchandiseAPI.getMerchandiseOrders({}, token),
        ]);

        // Backend returns { attendees, pagination } — same shape as RegistrationsPage
        const regResults = r.attendees || r.registrations || r.data || [];
        setRegs(Array.isArray(regResults) ? regResults : []);

        const merchResults = m.orders || m.data || m || [];
        setMerch(Array.isArray(merchResults) ? merchResults : []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  if (loading) return <Spinner text="Loading analytics…" />;

  // ── Derived stats ──────────────────────────────────────────────────────────
  const paid     = regs.filter((r) => r.paymentStatus === 'complete' || r.paymentStatus === 'paid');
  const physical = regs.filter((r) => r.attendanceMode === 'Physical');
  const virtual  = regs.filter((r) => r.attendanceMode === 'Virtual');
  const totalRevenue   = merch.reduce((sum, m) => sum + Number(m.totalAmount || 0), 0);
  const conversionRate = regs.length ? Math.round((paid.length / regs.length) * 100) : 0;

  // ── Daily registration chart ───────────────────────────────────────────────
  const byDay: Record<string, number> = {};
  regs.forEach((r) => {
    const d = new Date(r.createdAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
    byDay[d] = (byDay[d] || 0) + 1;
  });
  const chartData = Object.entries(byDay)
    .slice(-14)
    .map(([date, count]) => ({ date, count }));

  // ── Referral sources ───────────────────────────────────────────────────────
  const bySrc: Record<string, number> = {};
  regs.forEach((r) => {
    if (r.referralSource) bySrc[r.referralSource] = (bySrc[r.referralSource] || 0) + 1;
  });
  const srcData = Object.entries(bySrc).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxSrc  = srcData[0]?.[1] || 1;

  // ── Breakout sessions ──────────────────────────────────────────────────────
  const bySession: Record<string, number> = {};
  regs.forEach((r) => {
    if (r.breakoutSessionChoice)
      bySession[r.breakoutSessionChoice] = (bySession[r.breakoutSessionChoice] || 0) + 1;
  });
  const sessionData = Object.entries(bySession)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Dashboard Overview</div>
        <div className="page-subtitle">Photizo Conference — live registrations &amp; orders</div>
      </div>

      {/* ── Stat cards ── */}
      <div className="stats-grid">
        <StatCard
          label="Total Registrations"
          value={regs.length}
          sub={`${paid.length} paid · ${regs.length - paid.length} pending`}
          accent="#f0a500"
          icon="👥"
        />
        <StatCard
          label="Confirmed Attendees"
          value={paid.length}
          sub={`${conversionRate}% conversion rate`}
          accent="#22c55e"
          icon="✅"
        />
        <StatCard
          label="Merchandise Orders"
          value={merch.length}
          sub={`₦${totalRevenue.toLocaleString()} total`}
          accent="#3b82f6"
          icon="🛍️"
        />
        <StatCard
          label="Physical Attendance"
          value={physical.length}
          sub={`${virtual.length} virtual`}
          accent="#a855f7"
          icon="📍"
        />
      </div>

      {/* ── Daily registrations chart ── */}
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title">Daily Registrations (Last 14 days)</div>
          <div className="chart-badge">{regs.length} total</div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f0a500" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f0a500" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2230" />
            <XAxis dataKey="date" tick={{ fill: '#555e78', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#555e78', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: '#0f1117', border: '1px solid #1e2230', borderRadius: 8, fontSize: 13 }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#f0a500"
              strokeWidth={2}
              fill="url(#goldGrad)"
              name="Registrations"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Two-column breakdown ── */}
      <div className="two-col">

        {/* Referral sources */}
        <div className="chart-card" style={{ marginBottom: 0 }}>
          <div className="chart-header">
            <div className="chart-title">Referral Sources</div>
          </div>
          {srcData.length === 0 ? (
            <p style={{ color: 'var(--text3)', fontSize: 13 }}>No referral data yet.</p>
          ) : (
            srcData.map(([src, count]) => (
              <div key={src} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span className="breakdown-label">{src}</span>
                  <span className="breakdown-value">{count}</span>
                </div>
                <div className="breakdown-bar">
                  <div className="breakdown-bar-fill" style={{ width: `${(count / maxSrc) * 100}%` }} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Breakout sessions */}
        <div className="chart-card" style={{ marginBottom: 0 }}>
          <div className="chart-header">
            <div className="chart-title">Breakout Session Choices</div>
          </div>
          {sessionData.length === 0 ? (
            <p style={{ color: 'var(--text3)', fontSize: 13 }}>No session data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sessionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2230" />
                <XAxis dataKey="name" tick={{ fill: '#555e78', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#555e78', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#0f1117', border: '1px solid #1e2230', borderRadius: 8, fontSize: 13 }}
                />
                <Bar dataKey="value" name="Attendees" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </div>
  );
};

export default OverviewPage;

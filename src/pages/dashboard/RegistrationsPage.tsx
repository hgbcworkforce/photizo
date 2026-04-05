import React, { useState, useEffect, useCallback, useRef, type ChangeEvent } from 'react';
import { dashboardAPI } from "../../services/apiService";
import { exportCSV } from '../../utils/exportCSV';
import { Icon, Spinner, Empty, Pagination } from '../../components/dashboard/UI';

// 1. Define the data structure
interface Registration {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  attendanceMode: 'Physical' | 'Virtual';
  breakoutSessionChoice: string;
  referralSource: string;
  paymentStatus: 'complete' | 'paid' | 'pending' | string;
  createdAt: string;
}

interface RegistrationsPageProps {
  token: string;
}

const LIMIT = 10;

// Typing the sub-component
const PayBadge: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'complete' || status === 'paid')
    return <span className="badge badge-green">Paid</span>;
  if (status === 'pending')
    return <span className="badge badge-yellow">Pending</span>;
  return <span className="badge badge-gray">{status || '—'}</span>;
};

const RegistrationsPage: React.FC<RegistrationsPageProps> = ({ token }) => {
  const [data, setData] = useState<Registration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [filterMode, setFilterMode] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterSession, setFilterSession] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  
  // Typing the Ref for the timeout
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(
    async (q: string = '') => {
      setLoading(true);
      try {
        const res = await dashboardAPI.getRecentRegistrations(token);
        // Assuming API returns { data: [...] } or just the array
        const result = res.data || res.registrations || res;
        setData(Array.isArray(result) ? result : []);
        } catch (err) {
        console.error("Fetch error:", err);
        }finally{
        setLoading(false);
       } 
    },
    [token]
  );

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => load(val), 400);
  };

  // ── Client-side filters ──
  const filtered = data.filter((r) => {
    if (filterMode && r.attendanceMode !== filterMode) return false;
    if (filterStatus && r.paymentStatus !== filterStatus) return false;
    if (filterSession && r.breakoutSessionChoice !== filterSession) return false;
    
    // Simple search logic
    if (search) {
      const s = search.toLowerCase();
      return r.firstName?.toLowerCase().includes(s) || 
             r.lastName?.toLowerCase().includes(s) || 
             r.email?.toLowerCase().includes(s);
    }
    return true;
  });

  const sessions = Array.from(new Set(data.map((r) => r.breakoutSessionChoice).filter(Boolean)));
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);
  const totalPages = Math.ceil(filtered.length / LIMIT);

  const fmtDate = (iso: string) =>
    iso
      ? new Date(iso).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' })
      : '—';

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Registrations</div>
        <div className="page-subtitle">
          {filtered.length} record{filtered.length !== 1 ? 's' : ''}
          {filterMode || filterStatus || filterSession ? ' (filtered)' : ''}
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div className="table-title">All Registrations</div>
          <div className="table-controls">
            <div className="search-box">
              <Icon name="search" size={14} />
              <input
                placeholder="Search name, email…"
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={filterMode}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => { setFilterMode(e.target.value); setPage(1); }}
            >
              <option value="">All Modes</option>
              <option value="Physical">Physical</option>
              <option value="Virtual">Virtual</option>
            </select>

            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => { setFilterStatus(e.target.value); setPage(1); }}
            >
              <option value="">All Status</option>
              <option value="complete">Paid</option>
              <option value="pending">Pending</option>
            </select>

            <select
              className="filter-select"
              value={filterSession}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => { setFilterSession(e.target.value); setPage(1); }}
            >
              <option value="">All Sessions</option>
              {sessions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            <button className="btn-refresh" onClick={() => load(search)}>
              <Icon name="refresh" size={13} />
            </button>

            <button
              className="btn-export"
              onClick={() => exportCSV(filtered, 'photizo-registrations.csv')}
            >
              <Icon name="download" size={14} />
              Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <Spinner text="Loading registrations…" />
        ) : paginated.length === 0 ? (
          <Empty icon="📋" text="No registrations found" />
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Mode</th>
                    <th>Session</th>
                    <th>Referral</th>
                    <th>Payment</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((r, i) => (
                    <tr key={r.id || i}>
                      <td className="mono text-dim">{(page - 1) * LIMIT + i + 1}</td>
                      <td style={{ fontWeight: 500 }}>{r.firstName} {r.lastName}</td>
                      <td className="mono text-dim">{r.email}</td>
                      <td className="mono text-dim">{r.phoneNumber}</td>
                      <td>
                        <span className={`badge ${r.attendanceMode === 'Physical' ? 'badge-blue' : 'badge-purple'}`}>
                          {r.attendanceMode || '—'}
                        </span>
                      </td>
                      <td className="text-dim">{r.breakoutSessionChoice || '—'}</td>
                      <td className="text-dim">{r.referralSource || '—'}</td>
                      <td><PayBadge status={r.paymentStatus} /></td>
                      <td className="mono text-dim">{fmtDate(r.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              total={filtered.length}
              limit={LIMIT}
              onPage={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default RegistrationsPage;

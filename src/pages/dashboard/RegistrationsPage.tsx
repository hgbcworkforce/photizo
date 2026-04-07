import React, { useState, useEffect, useCallback, useRef, type ChangeEvent } from 'react';
import { dashboardAPI } from '../../services/apiService';
import { exportCSV } from '../../utils/exportCSV';
import { Icon, Spinner, Empty, Pagination } from '../../components/dashboard/UI';

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

const PayBadge: React.FC<{ status: string }> = ({ status }) => {
  const s = status?.toLowerCase();
  if (s === 'complete' || s === 'paid') return <span className="badge badge-green">Paid</span>;
  if (s === 'pending') return <span className="badge badge-yellow">Pending</span>;
  return <span className="badge badge-gray">{status || '—'}</span>;
};

const RegistrationsPage: React.FC<RegistrationsPageProps> = ({ token }) => {
  const [data,          setData]          = useState<Registration[]>([]);
  const [loading,       setLoading]       = useState<boolean>(true);
  const [search,        setSearch]        = useState<string>('');
  const [filterMode,    setFilterMode]    = useState<string>('');
  const [filterStatus,  setFilterStatus]  = useState<string>('');
  const [filterSession, setFilterSession] = useState<string>('');
  const [page,          setPage]          = useState<number>(1);
  const [totalPages,    setTotalPages]    = useState<number>(1);
  const [totalItems,    setTotalItems]    = useState<number>(0);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Single source-of-truth loader — reads directly from params so it's
   * never stale. Every filter/search/page change calls this.
   */
  const load = useCallback(
    async (
      currentPage: number,
      query: string,
      mode: string,
      status: string,
      session: string,
    ) => {
      setLoading(true);
      try {
        const res = await dashboardAPI.getRecentRegistrations(token, {
          page:                  currentPage,
          limit:                 LIMIT,
          search:                query   || undefined,
          attendanceMode:        mode    || undefined,
          paymentStatus:         status  || undefined,
          breakoutSessionChoice: session || undefined,
        });

        const results = res.attendees || res.registrations || res.data || [];
        setData(Array.isArray(results) ? results : []);

        const pagination = res.pagination || {};
        setTotalPages(pagination.totalPages ?? res.totalPages ?? 1);
        setTotalItems(pagination.total      ?? res.totalItems ?? results.length);
      } catch (err) {
        console.error('Fetch error:', err);
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Re-fetch whenever page changes (filters are passed as current state values)
  useEffect(() => {
    load(page, search, filterMode, filterStatus, filterSession);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ── Handlers — reset page to 1 then fire load ──────────────────────────────

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      load(1, val, filterMode, filterStatus, filterSession);
    }, 400);
  };

  const handleFilterMode = (val: string) => {
    setFilterMode(val);
    setPage(1);
    load(1, search, val, filterStatus, filterSession);
  };

  const handleFilterStatus = (val: string) => {
    setFilterStatus(val);
    setPage(1);
    load(1, search, filterMode, val, filterSession);
  };

  const handleFilterSession = (val: string) => {
    setFilterSession(val);
    setPage(1);
    load(1, search, filterMode, filterStatus, val);
  };

  const handleRefresh = () => {
    load(page, search, filterMode, filterStatus, filterSession);
  };

  // Page change from pagination component
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // useEffect above will fire load() with the updated page
  };

  const fmtDate = (iso: string) =>
    iso
      ? new Date(iso).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' })
      : '—';

  const activeFilters = [filterMode, filterStatus, filterSession].filter(Boolean).length;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Registrations</div>
        <div className="page-subtitle">
          {totalItems} total record{totalItems !== 1 ? 's' : ''}
          {activeFilters > 0 && ` · ${activeFilters} filter${activeFilters > 1 ? 's' : ''} active`}
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div className="table-title">All Registrations</div>
          <div className="table-controls">

            {/* Search */}
            <div className="search-box">
              <Icon name="search" size={14} />
              <input
                placeholder="Search name, email…"
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
              />
            </div>

            {/* Attendance Mode filter */}
            <select
              className="filter-select"
              value={filterMode}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => handleFilterMode(e.target.value)}
            >
              <option value="">All Modes</option>
              <option value="Physical">Physical</option>
              <option value="Virtual">Virtual</option>
            </select>

            {/* Payment Status filter */}
            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => handleFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="complete">Paid</option>
              <option value="pending">Pending</option>
            </select>

            {/* Breakout Session filter */}
            <select
              className="filter-select"
              value={filterSession}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => handleFilterSession(e.target.value)}
            >
              <option value="">All Sessions</option>
              <option value="Leadership">Leadership</option>
              <option value="Tech">Tech</option>
              <option value="Fashion">Fashion</option>
              <option value="Evangelism">Evangelism</option>
              <option value="Prayer">Prayer</option>
              <option value="Worship">Worship</option>
              <option value="Youth">Youth</option>
            </select>

            {/* Refresh */}
            <button className="btn-refresh" onClick={handleRefresh}>
              <Icon name="refresh" size={13} />
            </button>

            {/* Export — exports current page data */}
            <button
              className="btn-export"
              onClick={() => exportCSV(data, `registrations-page-${page}.csv`)}
            >
              <Icon name="download" size={14} />
              Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <Spinner text="Loading registrations…" />
        ) : data.length === 0 ? (
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
                    <th>Payment</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((r, i) => (
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
              total={totalItems}
              limit={LIMIT}
              onPage={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default RegistrationsPage;

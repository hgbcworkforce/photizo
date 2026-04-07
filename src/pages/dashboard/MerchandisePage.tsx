import React, { useState, useEffect, useCallback, type ChangeEvent } from 'react';
import { merchandiseAPI } from '../../services/apiService';
import { exportCSV } from '../../utils/exportCSV';
import { Icon, StatCard, Spinner, Empty, Pagination } from '../../components/dashboard/UI';

// 1. Define the Data Interface
interface MerchandiseOrder {
  id?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  merchandiseId: string;
  color?: string;
  size?: string;
  quantity: number;
  totalAmount: number;
  createdAt: string;
}

interface MerchandisePageProps {
  token: string;
}

const LIMIT = 10;
const SIZES: string[] = ['S', 'M', 'L', 'XL', 'XXL'];

const MerchandisePage: React.FC<MerchandisePageProps> = ({ token }) => {
  const [data, setData] = useState<MerchandiseOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [filterSize, setFilterSize] = useState<string>('');
  const [filterItem, setFilterItem] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const load = useCallback(async () => {
  setLoading(true);
  try {
    // This will now work with the updated apiService.ts
    const res = await merchandiseAPI.getMerchandiseOrders({}, token);
    setData(res.data || res.orders || res || []);
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    setLoading(false);
  }
}, [token]);


  useEffect(() => {
    load();
  }, [load]);

  // ── Client-side filters ──
  const filtered = data.filter((m) => {
    const q = search.toLowerCase();
    if (q && !m.fullName?.toLowerCase().includes(q) && !m.email?.toLowerCase().includes(q))
      return false;
    if (filterSize && m.size !== filterSize) return false;
    if (filterItem && m.merchandiseId !== filterItem) return false;
    return true;
  });

  const items = Array.from(new Set(data.map((m) => m.merchandiseId).filter(Boolean)));
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);
  const totalPages = Math.ceil(filtered.length / LIMIT);
  const totalRevenue = filtered.reduce((s, m) => s + Number(m.totalAmount || 0), 0);
  const totalQuantity = data.reduce((s, m) => s + (m.quantity || 0), 0);

  const fmtDate = (iso: string) =>
    iso
      ? new Date(iso).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' })
      : '—';

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Merchandise Orders</div>
        <div className="page-subtitle">
          {filtered.length} order{filtered.length !== 1 ? 's' : ''} · ₦{totalRevenue.toLocaleString()} total
        </div>
      </div>

      {/* ── Summary cards ── */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        <StatCard label="Total Orders" value={data.length} sub="All merchandise" accent="#3b82f6" icon="📦" />
        <StatCard label="Total Revenue" value={`₦${totalRevenue.toLocaleString()}`} sub="From merchandise" accent="#22c55e" icon="💰" />
        <StatCard label="Items Ordered" value={totalQuantity} sub="Total quantity" accent="#a855f7" icon="👕" />
      </div>

      <div className="table-card">
        <div className="table-header">
          <div className="table-title">All Orders</div>
          <div className="table-controls">
            <div className="search-box">
              <Icon name="search" size={14} />
              <input
                placeholder="Search name, email…"
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>

            <select
              className="filter-select"
              value={filterItem}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => { setFilterItem(e.target.value); setPage(1); }}
            >
              <option value="">All Items</option>
              {items.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>

            <select
              className="filter-select"
              value={filterSize}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => { setFilterSize(e.target.value); setPage(1); }}
            >
              <option value="">All Sizes</option>
              {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            <button className="btn-refresh" onClick={load}>
              <Icon name="refresh" size={13} />
            </button>

            <button
              className="btn-export"
              onClick={() => exportCSV(filtered, 'photizo-merchandise.csv')}
            >
              <Icon name="download" size={14} />
              Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <Spinner text="Loading orders…" />
        ) : paginated.length === 0 ? (
          <Empty icon="🛍️" text="No orders found" />
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Item</th>
                    <th>Color</th>
                    <th>Size</th>
                    <th>Qty</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((m, i) => (
                    <tr key={m.id || i}>
                      <td className="mono text-dim">{(page - 1) * LIMIT + i + 1}</td>
                      <td style={{ fontWeight: 500 }}>{m.fullName}</td>
                      <td className="mono text-dim">{m.email}</td>
                      <td className="mono text-dim">{m.phoneNumber}</td>
                      <td><span className="badge badge-blue">{m.merchandiseId}</span></td>
                      <td className="text-dim">{m.color || '—'}</td>
                      <td><span className="badge badge-gray">{m.size || '—'}</span></td>
                      <td style={{ fontWeight: 600 }}>{m.quantity}</td>
                      <td style={{ fontWeight: 600, color: '#4ade80' }}>
                        ₦{(m.totalAmount || 0).toLocaleString()}
                      </td>
                      <td className="mono text-dim">{fmtDate(m.createdAt)}</td>
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

export default MerchandisePage;

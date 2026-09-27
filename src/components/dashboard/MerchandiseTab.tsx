import { useState, useEffect, useCallback, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Search, RefreshCw, Trash2 } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { merchandiseAPI } from '../../services/apiService';
import { authUtils } from '../../utils/authUtils';
import { downloadCSV, ORANGE } from '../../utils/adminHelpers';

interface MerchandiseOrder {
  id?: string;
  merchandiseId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  color: string;
  size: string;
  quantity: number;
  totalAmount: number;
}

interface ChartData {
  name: string;
  count: number;
}

const LIMIT = 20;

export default function MerchandiseTab() {
  // Data and loading states
  const [data, setData] = useState<MerchandiseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Debounce for search
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Load merchandise orders with filters - single source of truth
   * Takes all current parameters to avoid stale closures
   * Uses server-side filtering and pagination
   */
  const load = useCallback(
    async (
      currentPage: number,
      query: string,
      category: string,
    ) => {
      setLoading(true);
      setError(null);
      try {
        const token = authUtils.getToken();
        if (!token) {
          throw new Error('Not authenticated');
        }

        const params: Record<string, string | number> = {
          page: currentPage,
          limit: LIMIT,
        };
        if (query) params.search = query;
        if (category) params.category = category;

        const res = await merchandiseAPI.getMerchandiseOrders(params, token);

        // Handle different response formats
        const results = res.data || res.orders || res || [];
        setData(Array.isArray(results) ? results : []);

        // Calculate pagination - merchandiseAPI might not include pagination info
        const totalCount = res.total || res.pagination?.total || results.length;
        setTotalPages(Math.ceil(totalCount / LIMIT));
        setTotalItems(totalCount);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load merchandise orders');
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Re-fetch when page changes
  useEffect(() => {
    load(page, search, filterCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      load(1, val, filterCategory);
    }, 400);
  };

  const handleFilterCategory = (val: string) => {
    setFilterCategory(val);
    setPage(1);
    load(1, search, val);
  };

  const handleRefresh = () => {
    load(page, search, filterCategory);
  };

  const handleDelete = async (orderId?: string) => {
    if (!orderId) return;

    const token = authUtils.getToken();
    if (!token) {
      setError('Not authenticated');
      return;
    }

    if (!window.confirm('Delete this merchandise order? This action cannot be undone.')) {
      return;
    }

    setDeletingId(orderId);
    try {
      await merchandiseAPI.deleteMerchandiseOrder(token, orderId);
      await load(page, search, filterCategory);
    } catch (err) {
      console.error('Delete merchandise order error:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete merchandise order');
    } finally {
      setDeletingId(null);
    }
  };

  // ── Chart Data ──────────────────────────────────────────────────────────
  // Fetch all data for stats (separate request for analytics)
  const [allDataForStats, setAllDataForStats] = useState<MerchandiseOrder[]>([]);

  useEffect(() => {
    // Load all data once for chart stats
    const loadStats = async () => {
      try {
        const token = authUtils.getToken();
        if (!token) return;
        const res = await merchandiseAPI.getMerchandiseOrders({ limit: 1000 }, token);
        const results = res.data || res.orders || res || [];
        setAllDataForStats(Array.isArray(results) ? results : []);
      } catch (err) {
        console.error('Stats fetch error:', err);
      }
    };
    loadStats();
  }, []);

  const catCount: Record<string, number> = {};
  allDataForStats.forEach((r) => {
    if (r.merchandiseId) {
      catCount[r.merchandiseId] = (catCount[r.merchandiseId] || 0) + 1;
    }
  });
  const catData: ChartData[] = Object.entries(catCount).map(([name, count]) => ({
    name: name.split(' ')[0],
    count,
  }));

  const intCount: Record<string, number> = {};
  allDataForStats.forEach((r) => {
    if (r.color) {
      intCount[r.color] = (intCount[r.color] || 0) + 1;
    }
  });
  const intData: ChartData[] = Object.entries(intCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name: name.split('&')[0].trim(),
      count,
    }));

  // Get unique categories for filter dropdown
  const allCategories = [...new Set(allDataForStats.map((r) => r.merchandiseId).filter(Boolean))];
  const activeFilters = [filterCategory, search].filter(Boolean).length;

  return (
    <div>
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-sm text-red-800 font-medium">
          {error}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50/70 border border-gray-100 p-6 rounded-3xl">
          <div className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">
            Type of Merchandise Ordered
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={catData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#71717a' }} />
              <YAxis tick={{ fontSize: 11, fill: '#71717a' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: '1px solid #e4e4e7' }} />
              <Bar dataKey="count" fill={ORANGE} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-50/70 border border-gray-100 p-6 rounded-3xl">
          <div className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">
            Most Popular Colors
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={intData} layout="vertical" margin={{ top: 10, right: 10, left: 60, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 11, fill: '#71717a' }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#71717a' }} width={60} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: '1px solid #e4e4e7' }} />
              <Bar dataKey="count" fill="#ef4023" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 text-xs font-medium border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-gray-800"
            placeholder="Search name, email, city..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Category Filter */}
        <select
          className="text-xs font-medium text-gray-700 py-2.5 px-3 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
          value={filterCategory}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => handleFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {allCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="flex flex-wrap items-center gap-2 ml-auto">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-gray-700 font-bold border border-gray-200 px-4 py-2.5 rounded-2xl hover:border-brand-orange hover:text-brand-orange transition-colors disabled:opacity-50 cursor-pointer bg-white shadow-sm"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            onClick={() => downloadCSV(data, 'merchandise_orders.csv')}
            className="flex items-center gap-1.5 text-xs text-gray-700 font-bold border border-gray-200 px-4 py-2.5 rounded-2xl hover:border-brand-orange hover:text-brand-orange transition-colors cursor-pointer bg-white shadow-sm"
          >
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      <div className="mb-4 text-xs font-medium text-gray-400">
        {totalItems === 0 ? 0 : (page - 1) * LIMIT + 1} - {Math.min(page * LIMIT, totalItems)} of {totalItems} records {activeFilters > 0 && ` · ${activeFilters} filter${activeFilters > 1 ? 's' : ''}`}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full text-xs border-collapse bg-white">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              {['Name', 'Email', 'Phone', 'Product', 'Color', 'Size', 'Qty', 'Total', 'Action'].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3.5 font-bold text-gray-500 uppercase tracking-wider text-[10px] whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-gray-400 text-sm">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-red-600 text-sm">
                  {error}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-gray-400 text-sm">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-gray-900 whitespace-nowrap">
                    {r.fullName}
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 font-medium">{r.email}</td>
                  <td className="px-4 py-3.5 text-gray-500">{r.phoneNumber || '—'}</td>

                  {/* Product */}
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 bg-brand-orange/10 text-brand-orange font-bold text-[10px] uppercase tracking-wider rounded-full">
                      {r.merchandiseId || '—'}
                    </span>
                  </td>

                  {/* Color */}
                  <td className="px-4 py-3.5 text-gray-600 font-medium">{r.color || '—'}</td>

                  {/* Size */}
                  <td className="px-4 py-3.5 text-center text-gray-700 font-bold">{r.size || '—'}</td>

                  {/* Quantity */}
                  <td className="px-4 py-3.5 text-center text-gray-700 font-bold">{r.quantity || 0}</td>

                  {/* Total Amount */}
                  <td className="px-4 py-3.5 text-brand-red font-bold whitespace-nowrap">
                    ₦{r.totalAmount?.toLocaleString() || 0}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(r.id)}
                      disabled={deletingId === r.id}
                      className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-1.5 text-[11px] font-bold text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                      <Trash2 size={13} />
                      {deletingId === r.id ? 'Deleting' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="text-xs text-gray-600 font-bold border border-gray-200 px-4 py-2 rounded-xl hover:border-brand-orange hover:text-brand-orange transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-white shadow-sm"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500 font-bold px-2">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="text-xs text-gray-600 font-bold border border-gray-200 px-4 py-2 rounded-xl hover:border-brand-orange hover:text-brand-orange transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-white shadow-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
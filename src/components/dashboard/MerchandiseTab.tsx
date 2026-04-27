import { useState, useEffect, useCallback, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Search, RefreshCw } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { merchandiseAPI } from '../../services/apiService';
import { authUtils } from '../../utils/authUtils';
import { downloadCSV, ORANGE } from '../../utils/adminHelpers';

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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 mb-6">
        <div className="bg-white border border-gray-100 p-5">
          <div className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wide">
            Type of Merchandise Ordered
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={catData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 0 }} />
              <Bar dataKey="count" fill={ORANGE} radius={0} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-gray-100 p-5">
          <div className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wide">
            Most Popular Colors
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={intData} layout="vertical" margin={{ top: 0, right: 0, left: 60, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={60} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 0 }} />
              <Bar dataKey="count" fill="#111" radius={0} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        {/* Search */}
        <div className="relative grow max-w-xs border border-gray-200  text-black">
          <input
            type="text"
            className="input-field text-sm py-2 pl-9 w-full"
            placeholder="Search name, email, city..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Category Filter */}
        <select
          className="select-field max-w-xs text-sm text-gray-800 py-2 border border-gray-200"
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

        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs  text-gray-800 font-medium border border-gray-200 px-4 py-2 hover:border-brand-orange hover:text-brand-orange transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            onClick={() => downloadCSV(data, 'merchandise_orders.csv')}
            className="flex items-center gap-1.5 text-xs text-gray-800 font-medium border border-gray-200 px-4 py-2 hover:border-brand-orange hover:text-brand-orange transition-colors"
          >
            <Download size={14} /> Export CSV
          </button>
          <span className="text-xs text-gray-400 self-center">
            {totalItems === 0 ? 0 : (page - 1) * LIMIT + 1} - {Math.min(page * LIMIT, totalItems)} of {totalItems} records {activeFilters > 0 && ` · ${activeFilters} filter${activeFilters > 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['Name', 'Email', 'Phone', 'Product', 'Color', 'Size', 'Qty', 'Total'].map((h) => (
                <th
                  key={h}
                  className="text-left px-3 py-2.5 font-semibold text-gray-500 uppercase tracking-wide text-[10px] whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-10 text-gray-400 text-sm">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={9} className="text-center py-10 text-red-600 text-sm">
                  {error}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-10 text-gray-400 text-sm">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((r, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2.5 font-medium text-brand-black whitespace-nowrap">
                    {r.fullName}
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">{r.email}</td>
                  <td className="px-3 py-2.5 text-gray-500">{r.phoneNumber || '—'}</td>
                  
                  {/* Product */}
                  <td className="px-3 py-2.5">
                     <span className="px-1.5 py-0.5 bg-orange-50 text-brand-orange  font-medium rounded-sm">
                       {r.merchandiseId || '—'}
                     </span>
                  </td>
                  
                  {/* Color */}
                  <td className="px-3 py-2.5 text-gray-500">{r.color || '—'}</td>
                  
                  {/* Size */}
                  <td className="px-3 py-2.5 text-center text-gray-600 font-medium">{r.size || '—'}</td>
                  
                  {/* Quantity */}
                  <td className="px-3 py-2.5 text-center text-gray-600">{r.quantity || 0}</td>
                  
                  {/* Total Amount */}
                  <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">
                    ₦{r.totalAmount?.toLocaleString() || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="text-xs font-medium border border-gray-200 px-3 py-1.5 rounded hover:border-brand-orange hover:text-brand-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="text-xs font-medium border border-gray-200 px-3 py-1.5 rounded hover:border-brand-orange hover:text-brand-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
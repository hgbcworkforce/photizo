import { useState, useEffect, useCallback, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Download, Search, RefreshCw, Trash2 } from "lucide-react";
import type { ChangeEvent } from "react";
import { dashboardAPI } from "../../services/apiService";
import { authUtils } from "../../utils/authUtils";
import { downloadCSV, fmt, ORANGE } from "../../utils/adminHelpers";

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

interface ChartData {
  name: string;
  count: number;
}

const LIMIT = 20;

export default function RegistrationsTab() {
  // Data and loading states
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSession, setFilterSession] = useState("");
  const [allFilteredRegistrations, setAllFilteredRegistrations] = useState<Registration[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Debounce for search
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Load registrations with filters - single source of truth
   * Takes all current parameters to avoid stale closures
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
      setError(null);
      try {
        const token = authUtils.getToken();
        if (!token) {
          throw new Error("Not authenticated");
        }

        // 1. Fetch paginated data for the table
        const tableReq = dashboardAPI.getRecentRegistrations(token, {
          page: currentPage,
          limit: LIMIT,
          search: query || undefined,
          attendanceMode: mode || undefined,
          paymentStatus: status || undefined,
          breakoutSessionChoice: session || undefined,
        });

        // 2. Fetch up to 1000 records for the charts and CSV export
        const allReq = dashboardAPI.getRecentRegistrations(token, {
          page: 1,
          limit: 1000,
          search: query || undefined,
          attendanceMode: mode || undefined,
          paymentStatus: status || undefined,
          breakoutSessionChoice: session || undefined,
        });

        // Run both requests at the same time
        const [res, allRes] = await Promise.all([tableReq, allReq]);

        // Set the table data (20 items max)
        const results = res.attendees || res.data || [];
        setRegistrations(Array.isArray(results) ? results : []);

        // Set the chart/export data (all items)
        const allResults = allRes.attendees || allRes.data || [];
        setAllFilteredRegistrations(Array.isArray(allResults) ? allResults : []);

        // Handle pagination info using the table response
        const pagination = (res as any).pagination || {};
        setTotalPages(pagination.totalPages ?? (res as any).totalPages ?? 1);
        setTotalItems(pagination.total ?? (res as any).total ?? results.length);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load registrations",
        );
        setRegistrations([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Re-fetch when page changes
  useEffect(() => {
    load(page, search, filterMode, filterStatus, filterSession);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ── Handlers ────────────────────────────────────────────────────────────

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

  const handleDelete = async (registrationId?: string) => {
    if (!registrationId) return;

    const token = authUtils.getToken();
    if (!token) {
      setError("Not authenticated");
      return;
    }

    if (!window.confirm("Delete this registration? This action cannot be undone.")) {
      return;
    }

    setDeletingId(registrationId);
    try {
      await dashboardAPI.deleteRegistration(token, registrationId);
      await load(page, search, filterMode, filterStatus, filterSession);
    } catch (err) {
      console.error("Delete registration error:", err);
      setError(err instanceof Error ? err.message : "Failed to delete registration");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Chart Data ──────────────────────────────────────────────────────────

  const catCount: Record<string, number> = {};
  allFilteredRegistrations.forEach((r) => {
    if (r.attendanceMode) {
      const normalizedMode = r.attendanceMode.toLowerCase();
      catCount[normalizedMode] = (catCount[normalizedMode] || 0) + 1;
    }
  });
  const catData: ChartData[] = Object.entries(catCount).map(
    ([name, count]) => ({
      name: name.split(" ")[0].charAt(0).toUpperCase() + name.split(" ")[0].slice(1),
      count,
    }),
  );

  const intCount: Record<string, number> = {};
  allFilteredRegistrations.forEach((r) => {
    if (r.breakoutSessionChoice) {
      intCount[r.breakoutSessionChoice] =
        (intCount[r.breakoutSessionChoice] || 0) + 1;
    }
  });
  const intData: ChartData[] = Object.entries(intCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name: name.split("&")[0].trim(),
      count,
    }));

  const allSessions = [
    "Business",
    "Education",
    "Family",
    "Media",
    "Politics",
    "Religion",
  ];
  const activeFilters = [filterMode, filterStatus, filterSession].filter(
    Boolean,
  ).length;

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
            By Attendance Mode
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={catData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#71717a' }} />
              <YAxis tick={{ fontSize: 11, fill: '#71717a' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: '1px solid #e4e4e7' }} />
              <Bar dataKey="count" fill={ORANGE} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-50/70 border border-gray-100 p-6 rounded-3xl">
          <div className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">
            Top Breakout Sessions
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={intData}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 60, bottom: 0 }}
            >
              <XAxis type="number" tick={{ fontSize: 11, fill: '#71717a' }} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 10, fill: '#71717a' }}
                width={60}
              />
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
            placeholder="Search name, email, phone..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleSearch(e.target.value)
            }
          />
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        {/* Attendance Mode Filter */}
        <select
          className="text-xs font-medium text-gray-700 py-2.5 px-3 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
          value={filterMode}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            handleFilterMode(e.target.value)
          }
        >
          <option value="">All Modes</option>
          <option value="physical">Physical</option>
          <option value="virtual">Virtual</option>
        </select>

        {/* Payment Status Filter */}
        <select
          className="text-xs font-medium text-gray-700 py-2.5 px-3 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
          value={filterStatus}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            handleFilterStatus(e.target.value)
          }
        >
          <option value="">All Status</option>
          <option value="complete">Paid</option>
          <option value="pending">Pending</option>
        </select>

        {/* Breakout Session Filter */}
        <select
          className="text-xs font-medium text-gray-700 py-2.5 px-3 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
          value={filterSession}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            handleFilterSession(e.target.value)
          }
        >
          <option value="">All Sessions</option>
          {allSessions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div className="flex flex-wrap items-center gap-2 ml-auto">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-gray-700 font-bold border border-gray-200 px-4 py-2.5 rounded-2xl hover:border-brand-orange hover:text-brand-orange transition-colors disabled:opacity-50 cursor-pointer bg-white shadow-sm"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />{" "}
            Refresh
          </button>
          <button
            onClick={() => downloadCSV(allFilteredRegistrations, "registrations_page.csv")}
            className="flex items-center gap-1.5 text-xs text-gray-700 font-bold border border-gray-200 px-4 py-2.5 rounded-2xl hover:border-brand-orange hover:text-brand-orange transition-colors cursor-pointer bg-white shadow-sm"
          >
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      <div className="mb-4 text-xs font-medium text-gray-400">
        {totalItems === 0 ? 0 : (page - 1) * LIMIT + 1} - {Math.min(page * LIMIT, totalItems)} of {totalItems} records
        {activeFilters > 0 && ` · ${activeFilters} filter${activeFilters > 1 ? 's' : ''}`}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full text-xs border-collapse bg-white">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              {[
                "Name",
                "Email",
                "Phone",
                "Mode",
                "Session",
                "Status",
                "Date",
                "Actions",
              ].map((h) => (
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
                <td
                  colSpan={8}
                  className="text-center py-12 text-gray-400 text-sm"
                >
                  Loading...
                </td>
              </tr>
            ) : registrations.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-12 text-gray-400 text-sm"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              registrations.map((r, i) => (
                <tr
                  key={r.id || i}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  <td className="px-4 py-3.5 font-bold text-gray-900 whitespace-nowrap">
                    {r.firstName} {r.lastName}
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 font-medium">
                    {r.email}
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">
                    {r.phoneNumber || "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                        r.attendanceMode === "physical" || r.attendanceMode === "Physical"
                          ? "bg-brand-red/10 text-brand-red"
                          : "bg-brand-orange/10 text-brand-orange"
                      }`}
                    >
                      {r.attendanceMode || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-700 font-medium">
                    {r.breakoutSessionChoice || "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                        r.paymentStatus === "complete" || r.paymentStatus === "paid"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : r.paymentStatus === "pending"
                          ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {r.paymentStatus === "complete" || r.paymentStatus === "paid"
                        ? "Paid"
                        : r.paymentStatus || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-400 whitespace-nowrap font-medium">
                    {fmt(r.createdAt)}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(r.id)}
                      disabled={deletingId === r.id}
                      className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-1.5 text-[11px] font-bold text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                      <Trash2 size={13} />
                      {deletingId === r.id ? "Deleting" : "Delete"}
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

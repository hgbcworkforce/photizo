import { useState, useEffect, useCallback, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Download, Search, RefreshCw, Trash } from "lucide-react";
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

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Delete modal states
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null; name: string }>({
    isOpen: false,
    id: null,
    name: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

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

        // ✅ Run both requests at the same time
        const [res, allRes] = await Promise.all([tableReq, allReq]);

        // Set the table data (20 items max)
        const results = res.attendees || res.data || [];
        setRegistrations(Array.isArray(results) ? results : []);

        // ✅ Set the chart/export data (all items)
        const allResults = allRes.attendees || allRes.data || [];
        setAllFilteredRegistrations(Array.isArray(allResults) ? allResults : []);

        // Handle pagination info using the table response
        const pagination = res.pagination || {};
        setTotalPages(pagination.totalPages ?? res.totalPages ?? 1);
        setTotalItems(pagination.total ?? res.total ?? results.length);
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

  const handleDeleteRecord = (id: string | undefined, name: string) => {
    if (!id) {
      alert("Error: Record ID not found");
      return;
    }
    setDeleteModal({ isOpen: true, id, name });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;

    setIsDeleting(true);
    try {
      const token = authUtils.getToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      // Call API to delete registration
      await dashboardAPI.deleteRegistration(deleteModal.id, token);

      // Remove from local state
      setRegistrations((prev) =>
        prev.filter((r) => r.id !== deleteModal.id)
      );
      setAllFilteredRegistrations((prev) =>
        prev.filter((r) => r.id !== deleteModal.id)
      );

      // Close modal and refresh
      setDeleteModal({ isOpen: false, id: null, name: "" });
      setTotalItems((prev) => prev - 1);
    } catch (err) {
      console.error("Delete error:", err);
      alert(
        err instanceof Error ? err.message : "Failed to delete registration"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Chart Data ──────────────────────────────────────────────────────────

  const catCount: Record<string, number> = {};
 allFilteredRegistrations.forEach((r) => {
    // ✅ Check if it exists as a string, then tally it directly
    if (r.attendanceMode) {
      catCount[r.attendanceMode] = (catCount[r.attendanceMode] || 0) + 1;
    }
  });
  const catData: ChartData[] = Object.entries(catCount).map(
    ([name, count]) => ({
      name: name.split(" ")[0],
      count,
    }),
  );

  const intCount: Record<string, number> = {};
  allFilteredRegistrations.forEach((r) => {
    // ✅ Same here, tally the string directly instead of looping
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 mb-6">
        <div className="bg-white border border-gray-100 p-5">
          <div className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wide">
            By Attendance Mode
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={catData}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 0 }} />
              <Bar dataKey="count" fill={ORANGE} radius={0} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-gray-100 p-5">
          <div className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wide">
            Top Breakout Sessions
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={intData}
              layout="vertical"
              margin={{ top: 0, right: 0, left: 60, bottom: 0 }}
            >
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 9 }}
                width={60}
              />
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
            placeholder="Search name, email, phone..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleSearch(e.target.value)
            }
          />
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
        </div>

        {/* Attendance Mode Filter */}
        <select
          className="select-field max-w-xs text-sm text-gray-800 py-2 border border-gray-200 "
          value={filterMode}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            handleFilterMode(e.target.value)
          }
        >
          <option value="">All Modes</option>
          <option value="Physical">Physical</option>
          <option value="Virtual">Virtual</option>
        </select>

        {/* Payment Status Filter */}
        <select
          className="select-field max-w-xs text-sm text-gray-800 py-2 border border-gray-200 "
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
          className="select-field max-w-xs text-sm text-gray-800  py-2 border border-gray-200 "
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

        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-gray-800 font-medium border border-gray-200 px-4 py-2 hover:border-brand-orange hover:text-brand-orange transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />{" "}
            Refresh
          </button>
          <button
            onClick={() => downloadCSV(allFilteredRegistrations, "registrations_page.csv")}
            className="flex items-center gap-1.5 text-xs text-gray-800 font-medium border border-gray-200 px-4 py-2 hover:border-brand-orange hover:text-brand-orange transition-colors"
          >
            <Download size={14} /> Export CSV
          </button>
<span className="text-xs text-gray-400 self-center">
  {totalItems === 0 ? 0 : (page - 1) * LIMIT + 1} - {Math.min(page * LIMIT, totalItems)} of {totalItems} records 
  {activeFilters > 0 && ` · ${activeFilters} filter${activeFilters > 1 ? 's' : ''}`}
</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
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
                <td
                  colSpan={8}
                  className="text-center py-10 text-gray-400 text-sm"
                >
                  Loading...
                </td>
              </tr>
            ) : registrations.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-10 text-gray-400 text-sm"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              registrations.map((r, i) => (
                <tr
                  key={r.id || i}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 py-2.5 font-medium text-brand-black whitespace-nowrap">
                    {r.firstName} {r.lastName}
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">
                    {r.email}
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">
                    {r.phoneNumber || "—"}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`px-2 py-1 text-[9px] font-medium rounded-sm ${
                        r.attendanceMode === "Physical"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-purple-50 text-purple-700"
                      }`}
                    >
                      {r.attendanceMode || "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 text-sm">
                    {r.breakoutSessionChoice || "—"}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`px-1.5 py-0.5 text-[9px] font-medium rounded-sm ${
                        r.paymentStatus === "complete" ||
                        r.paymentStatus === "paid"
                          ? "bg-green-50 text-green-700"
                          : r.paymentStatus === "pending"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {r.paymentStatus === "complete" ||
                      r.paymentStatus === "paid"
                        ? "Paid"
                        : r.paymentStatus || "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-gray-400 whitespace-nowrap">
                    {fmt(r.createdAt)}
                  </td>
                  <td className="px-3 py-2.5 text-gray-400 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteRecord(r.id, `${r.firstName} ${r.lastName}`)}
                      className="cursor-pointer text-gray-400 hover:text-red-700 transition-colors"
                      title="Delete registration"
                    >
                      <Trash className="w-4 h-4" />
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
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="text-xs text-gray-500 font-medium border border-gray-200 px-3 py-1.5 rounded hover:border-brand-orange hover:text-brand-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="text-xs text-black font-medium border border-gray-200 px-3 py-1.5 rounded hover:border-brand-orange hover:text-brand-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete Registration?
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete the registration for{" "}
              <span className="font-semibold text-gray-800">{deleteModal.name}</span>?
              This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() =>
                  setDeleteModal({ isOpen: false, id: null, name: "" })
                }
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

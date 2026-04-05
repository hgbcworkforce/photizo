import React, { type ReactNode } from 'react';

// ── Icons ──────────────────────────────────────────────────────
type IconName = 'dashboard' | 'users' | 'shop' | 'download' | 'search' | 'refresh' | 'logout';

interface IconProps {
  name: IconName | string; // string included for flexibility, but IconName gives autocomplete
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, size = 16 }) => {
  const icons: Record<string, React.JSX.Element> = {
    dashboard: (
      <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    users: (
      <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    shop: (
      <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
    download: (
      <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
    search: (
      <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    refresh: (
      <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <polyline points="23 4 23 10 17 10"/>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
      </svg>
    ),
    logout: (
      <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    ),
  };
  return icons[name] || null;
};

// ── StatCard ───────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
  icon: ReactNode; // Allows passing strings (emoji) or JSX
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, sub, accent, icon }) => (
  <div className="stat-card">
    <div className="stat-card-accent" style={{ background: accent }} />
    <div className="stat-label">{label}</div>
    <div className="stat-value" style={{ color: accent }}>{value}</div>
    {sub && <div className="stat-sub">{sub}</div>}
    <div className="stat-icon">{icon}</div>
  </div>
);

// ── Spinner ────────────────────────────────────────────────────
export const Spinner: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => (
  <div className="loading-wrap">
    <div className="spinner" />
    <span className="loading-text">{text}</span>
  </div>
);

// ── Empty ──────────────────────────────────────────────────────
export const Empty: React.FC<{ icon?: string; text?: string }> = ({ icon = '📋', text = 'No data found' }) => (
  <div className="empty-wrap">
    <div className="empty-icon">{icon}</div>
    <div className="empty-text">{text}</div>
  </div>
);

// ── Pagination ─────────────────────────────────────────────────
interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPage: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, total, limit, onPage }) => {
  const from = total === 0 ? 0 : Math.min((page - 1) * limit + 1, total);
  const to = Math.min(page * limit, total);
  
  // Show up to 5 page numbers
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing {from}–{to} of {total}
      </div>
      <div className="pagination-btns">
        <button className="pg-btn" disabled={page === 1} onClick={() => onPage(page - 1)}>
          ← Prev
        </button>
        {pages.map((p) => (
          <button
            key={p}
            className={`pg-btn ${p === page ? 'active' : ''}`}
            onClick={() => onPage(p)}
          >
            {p}
          </button>
        ))}
        <button className="pg-btn" disabled={page >= totalPages || totalPages === 0} onClick={() => onPage(page + 1)}>
          Next →
        </button>
      </div>
    </div>
  );
};

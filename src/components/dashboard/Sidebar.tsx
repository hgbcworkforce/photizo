import React from 'react';
import { Icon } from './UI';
import logo from '../../../public/logo-c.png';

// 1. Match this to your DashboardPage type
type DashboardPage = 'overview' | 'registrations' | 'merchandise';

interface NavItem {
  id: DashboardPage;
  label: string;
  icon: string;
}

interface SidebarProps {
  active: DashboardPage;
  setActive: (page: DashboardPage) => void;
  onLogout: () => void;
}

const NAV: NavItem[] = [
  { id: 'overview',      label: 'Overview',      icon: 'dashboard' },
  { id: 'registrations', label: 'Registrations', icon: 'users'     },
  { id: 'merchandise',   label: 'Merchandise',   icon: 'shop'      },
];

const Sidebar: React.FC<SidebarProps> = ({ active, setActive, onLogout }) => (
  <aside className="sidebar">
    <div className="sidebar-header">
      <img src={logo} alt="Photizo Logo" className="w-36" />
    </div>

    <nav className="nav-list">
      {NAV.map((n) => (
        <div
          key={n.id}
          className={`nav-item ${active === n.id ? 'active' : ''}`}
          onClick={() => setActive(n.id)}
        >
          <Icon name={n.icon} />
          <span>{n.label}</span>
        </div>
      ))}
    </nav>

    <div className="sidebar-footer">
      <button className="logout-btn" onClick={onLogout} type="button">
        <Icon name="logout" />
        Sign Out
      </button>
    </div>
  </aside>
);

export default Sidebar;

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/dashboard/Sidebar';
import LoginPage from './LoginPage';
import OverviewPage from './OverviewPage';
import RegistrationsPage from './RegistrationsPage';
import MerchandisePage from './MerchandisePage';
import '../../dashboard.css';

// Define the allowed page names for type safety
type DashboardPage = 'overview' | 'registrations' | 'merchandise';

const Dashboard: React.FC = () => {
  const { token, login, logout } = useAuth();
  
  // Explicitly type the state to only allow valid pages
  const [page, setPage] = useState<DashboardPage>('overview');

  // If no token, show login. 
  // LoginPage expects (token: string) => void which matches our 'login' hook
  if (!token) return <LoginPage onLogin={login} />;

  return (
    <div className="app">
      {/* 
         Ensure Sidebar props match these types:
         active: string, 
         setActive: (p: DashboardPage) => void, 
         onLogout: () => void 
      */}
      <Sidebar 
        active={page} 
        setActive={(p: DashboardPage) => setPage(p)} 
        onLogout={logout} 
      />
      
      <main className="main">
        {page === 'overview' && <OverviewPage token={token} />}
        {page === 'registrations' && <RegistrationsPage token={token} />}
        {page === 'merchandise' && <MerchandisePage token={token} />}
      </main>
    </div>
  );
};

export default Dashboard;

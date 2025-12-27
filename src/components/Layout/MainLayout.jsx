import React, { useState } from 'react';
import { Sidebar } from '../UI/Sidebar';
import { Toolbar } from '../UI/Toolbar';
import { SelfieView } from '../UI/SelfieView';
import './MainLayout.css';

export const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="main-layout">
      <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar />
      </div>
      {/* Overlay for mobile to close sidebar */}
      {sidebarOpen && <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />}

      <main className="main-stage">
        {children}
        <SelfieView />
      </main>
      <Toolbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
    </div>
  );
};

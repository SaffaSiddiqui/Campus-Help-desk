import React, { useState } from 'react';
import {
  BuildingIcon,
  PlusCircleIcon,
  SearchIcon,
  DashboardIcon,
  ShieldIcon,
  SunIcon,
  MoonIcon,
} from './Icons.tsx';

export type ActiveTab = 'submit' | 'track' | 'admin';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  pendingCount,
  theme,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectTab = (tab: ActiveTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand" onClick={() => handleSelectTab('submit')}>
          <div className="brand-logo-wrapper">
            <BuildingIcon size={24} className="brand-logo" />
          </div>
          <div className="brand-text">
            <span className="brand-title">Campus Helpdesk</span>
            <span className="brand-sub">University Facilities & Support</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="navbar-nav desktop-nav">
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'submit' ? 'active' : ''}`}
            onClick={() => handleSelectTab('submit')}
          >
            <PlusCircleIcon size={18} />
            <span>Submit Issue</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'track' ? 'active' : ''}`}
            onClick={() => handleSelectTab('track')}
          >
            <SearchIcon size={18} />
            <span>Track Status</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn admin-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => handleSelectTab('admin')}
          >
            <DashboardIcon size={18} />
            <span>Admin Dashboard</span>
            {pendingCount > 0 && (
              <span className="nav-badge" title={`${pendingCount} pending issues`}>
                {pendingCount}
              </span>
            )}
          </button>
        </nav>

        {/* Theme toggle, Portal status badge & Mobile menu button */}
        <div className="navbar-right">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
            <span className="theme-toggle-text">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>

          <div className="system-status-indicator" title="Local storage active">
            <span className="status-dot"></span>
            <span className="status-label">Portal Live</span>
          </div>

          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <button
            type="button"
            className={`mobile-nav-btn ${activeTab === 'submit' ? 'active' : ''}`}
            onClick={() => handleSelectTab('submit')}
          >
            <PlusCircleIcon size={20} />
            <span>Submit New Issue</span>
          </button>

          <button
            type="button"
            className={`mobile-nav-btn ${activeTab === 'track' ? 'active' : ''}`}
            onClick={() => handleSelectTab('track')}
          >
            <SearchIcon size={20} />
            <span>Track Existing Issue</span>
          </button>

          <button
            type="button"
            className={`mobile-nav-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => handleSelectTab('admin')}
          >
            <ShieldIcon size={20} />
            <span>Admin Dashboard</span>
            {pendingCount > 0 && (
              <span className="nav-badge">{pendingCount} pending</span>
            )}
          </button>

          <button
            type="button"
            className="mobile-nav-btn mobile-theme-btn"
            onClick={() => {
              onToggleTheme();
              setMobileMenuOpen(false);
            }}
          >
            {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
            <span>{theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}</span>
          </button>
        </div>
      )}
    </header>
  );
};


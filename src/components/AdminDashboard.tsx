import React, { useState, useMemo } from 'react';
import type {
  Ticket,
  TicketStatus,
  TicketPriority,
  TicketCategory,
  TicketStats,
} from '../types/ticket.ts';
import { StatsCards } from './StatsCards.tsx';
import { TicketTable } from './TicketTable.tsx';
import { TicketCard } from './TicketCard.tsx';
import { TicketDetailModal } from './TicketDetailModal.tsx';
import {
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  RefreshIcon,
} from './Icons.tsx';

interface AdminDashboardProps {
  tickets: Ticket[];
  stats: TicketStats;
  onUpdateStatus: (
    ticketId: string,
    status: TicketStatus,
    performedBy: string,
    note?: string,
    assignedTo?: string,
    resolutionNotes?: string
  ) => void;
  onDeleteTicket: (ticketId: string) => void;
  onResetDemoData: () => void;
  onExportCsv: () => void;
}

const PRIORITY_WEIGHT: Record<TicketPriority, number> = {
  Urgent: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

const STATUS_WEIGHT: Record<TicketStatus, number> = {
  Pending: 3,
  'In Progress': 2,
  Resolved: 1,
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  tickets,
  stats,
  onUpdateStatus,
  onDeleteTicket,
  onResetDemoData,
  onExportCsv,
}) => {
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | TicketStatus>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | TicketPriority>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | TicketCategory>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority' | 'status'>('newest');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>(() => {
    return typeof window !== 'undefined' && window.innerWidth <= 768 ? 'cards' : 'table';
  });

  // Modal State
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtered and Sorted Tickets
  const filteredTickets = useMemo(() => {
    return tickets
      .filter((t) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchId = t.id.toLowerCase().includes(q);
          const matchTitle = t.title.toLowerCase().includes(q);
          const matchReporter = t.reporterName.toLowerCase().includes(q);
          const matchLocation = t.location.toLowerCase().includes(q);
          const matchDesc = t.description.toLowerCase().includes(q);
          if (!matchId && !matchTitle && !matchReporter && !matchLocation && !matchDesc) {
            return false;
          }
        }

        // Status Filter
        if (statusFilter !== 'All' && t.status !== statusFilter) {
          return false;
        }

        // Priority Filter
        if (priorityFilter !== 'All' && t.priority !== priorityFilter) {
          return false;
        }

        // Category Filter
        if (categoryFilter !== 'All' && t.category !== categoryFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'priority') {
          return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
        }
        if (sortBy === 'status') {
          return STATUS_WEIGHT[b.status] - STATUS_WEIGHT[a.status];
        }
        return 0;
      });
  }, [tickets, searchQuery, statusFilter, priorityFilter, categoryFilter, sortBy]);

  const handleOpenTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const handleQuickStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    onUpdateStatus(ticketId, newStatus, 'Helpdesk Admin (Quick Action)', `Status set to ${newStatus}`);
  };

  return (
    <div className="admin-dashboard-container animate-fade-in">
      {/* Dashboard Top Header */}
      <div className="dashboard-header-row">
        <div>
          <h1 className="dashboard-title">Campus Helpdesk Operations</h1>
          <p className="dashboard-subtitle">
            Administer campus issues, triage incoming requests, monitor resolution rates, and dispatch support teams.
          </p>
        </div>

        <div className="dashboard-actions-group">
          <button
            type="button"
            className="btn btn-secondary btn-icon"
            onClick={onExportCsv}
            title="Download CSV report of all tickets"
          >
            <DownloadIcon size={16} />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-icon"
            onClick={() => {
              if (window.confirm('Reset all helpdesk tickets to default campus demo data?')) {
                onResetDemoData();
              }
            }}
            title="Repopulate sample demo data"
          >
            <RefreshIcon size={16} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Statistics & KPI Cards */}
      <StatsCards
        stats={stats}
        onFilterStatus={(st) => setStatusFilter(st)}
        activeStatusFilter={statusFilter}
      />

      {/* Main Filter & Search Control Panel */}
      <div className="filter-panel-card">
        {/* Top Controls Row */}
        <div className="filter-controls-grid">
          {/* Search bar */}
          <div className="search-box">
            <SearchIcon size={18} className="search-icon-inside" />
            <input
              type="text"
              className="search-input-field"
              placeholder="Search by ticket ID, keyword, reporter, room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="select-filter-group">
            <label className="select-label">Category:</label>
            <select
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as 'All' | TicketCategory)}
            >
              <option value="All">All Categories</option>
              <option value="IT & Wi-Fi">IT & Wi-Fi</option>
              <option value="Facilities & Maintenance">Facilities & Maintenance</option>
              <option value="Classroom & Lab Equipment">Classroom & Lab Equipment</option>
              <option value="Hostel & Housing">Hostel & Housing</option>
              <option value="Library Services">Library Services</option>
              <option value="Campus Safety & Security">Campus Safety & Security</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Priority Dropdown */}
          <div className="select-filter-group">
            <label className="select-label">Priority:</label>
            <select
              className="filter-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as 'All' | TicketPriority)}
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="select-filter-group">
            <label className="select-label">Sort:</label>
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'newest' | 'oldest' | 'priority' | 'status')
              }
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Highest Priority</option>
              <option value="status">Status (Pending First)</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs & View Mode */}
        <div className="status-tabs-row">
          <div className="status-filter-pills">
            <button
              type="button"
              className={`status-pill-btn ${statusFilter === 'All' ? 'active' : ''}`}
              onClick={() => setStatusFilter('All')}
            >
              <span>All Tickets</span>
              <span className="pill-count">{tickets.length}</span>
            </button>

            <button
              type="button"
              className={`status-pill-btn pill-pending ${statusFilter === 'Pending' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Pending')}
            >
              <span className="pill-dot dot-pending"></span>
              <span>Pending</span>
              <span className="pill-count">{stats.pending}</span>
            </button>

            <button
              type="button"
              className={`status-pill-btn pill-inprogress ${statusFilter === 'In Progress' ? 'active' : ''}`}
              onClick={() => setStatusFilter('In Progress')}
            >
              <span className="pill-dot dot-inprogress"></span>
              <span>In Progress</span>
              <span className="pill-count">{stats.inProgress}</span>
            </button>

            <button
              type="button"
              className={`status-pill-btn pill-resolved ${statusFilter === 'Resolved' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Resolved')}
            >
              <span className="pill-dot dot-resolved"></span>
              <span>Resolved</span>
              <span className="pill-count">{stats.resolved}</span>
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="view-mode-toggle">
            <button
              type="button"
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              Table View
            </button>
            <button
              type="button"
              className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Card View"
            >
              Card View
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="results-count-bar">
        <span className="count-label">
          Showing <strong>{filteredTickets.length}</strong> of {tickets.length} tickets
        </span>
        {(statusFilter !== 'All' || priorityFilter !== 'All' || categoryFilter !== 'All' || searchQuery) && (
          <button
            type="button"
            className="btn-reset-filters"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('All');
              setPriorityFilter('All');
              setCategoryFilter('All');
            }}
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Tickets Display (Table or Cards) */}
      {viewMode === 'table' ? (
        <TicketTable
          tickets={filteredTickets}
          onViewTicket={handleOpenTicket}
          onQuickStatusChange={handleQuickStatusChange}
          onDeleteTicket={onDeleteTicket}
        />
      ) : (
        <div className="ticket-cards-grid">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onViewTicket={handleOpenTicket}
                onQuickStatusChange={handleQuickStatusChange}
                onDeleteTicket={onDeleteTicket}
              />
            ))
          ) : (
            <div className="empty-table-state">
              <FilterIcon size={36} className="empty-icon" />
              <h3 className="empty-title">No tickets match criteria</h3>
              <p className="empty-sub">Reset your filters to see campus tickets.</p>
            </div>
          )}
        </div>
      )}

      {/* Ticket Detail Modal */}
      <TicketDetailModal
        key={selectedTicket?.id || 'none'}
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdateStatus={onUpdateStatus}
        onDeleteTicket={onDeleteTicket}
      />
    </div>
  );
};

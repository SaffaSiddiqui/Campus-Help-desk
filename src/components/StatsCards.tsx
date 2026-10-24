import React from 'react';
import type { TicketStats } from '../types/ticket.ts';
import {
  ClipboardIcon,
  ClockIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
} from './Icons.tsx';

interface StatsCardsProps {
  stats: TicketStats;
  onFilterStatus?: (status: 'All' | 'Pending' | 'In Progress' | 'Resolved') => void;
  activeStatusFilter?: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  onFilterStatus,
  activeStatusFilter = 'All',
}) => {
  return (
    <div className="stats-section-container">
      {/* KPI Cards Grid */}
      <div className="stats-kpi-grid">
        {/* Total Issues */}
        <div
          className={`kpi-card ${activeStatusFilter === 'All' ? 'active-filter-card' : ''}`}
          onClick={() => onFilterStatus?.('All')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onFilterStatus?.('All');
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`Total tickets: ${stats.total}. Click to filter all tickets.`}
        >
          <div className="kpi-header">
            <span className="kpi-title">Total Tickets</span>
            <div className="kpi-icon-badge badge-total">
              <ClipboardIcon size={20} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{stats.total}</span>
            <span className="kpi-sub">All campus reports</span>
          </div>
          <div className="kpi-footer-bar">
            <div className="progress-micro">
              <div className="progress-fill fill-all" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>

        {/* Pending Tickets */}
        <div
          className={`kpi-card ${activeStatusFilter === 'Pending' ? 'active-filter-card' : ''}`}
          onClick={() => onFilterStatus?.('Pending')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onFilterStatus?.('Pending');
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`Pending tickets: ${stats.pending}. Click to filter pending tickets.`}
        >
          <div className="kpi-header">
            <span className="kpi-title">Pending</span>
            <div className="kpi-icon-badge badge-pending">
              <ClockIcon size={20} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value value-pending">{stats.pending}</span>
            <span className="kpi-sub">Needs triage & assignment</span>
          </div>
          <div className="kpi-footer-bar">
            <div className="progress-micro">
              <div
                className="progress-fill fill-pending"
                style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* In Progress Tickets */}
        <div
          className={`kpi-card ${activeStatusFilter === 'In Progress' ? 'active-filter-card' : ''}`}
          onClick={() => onFilterStatus?.('In Progress')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onFilterStatus?.('In Progress');
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`In progress tickets: ${stats.inProgress}. Click to filter in progress tickets.`}
        >
          <div className="kpi-header">
            <span className="kpi-title">In Progress</span>
            <div className="kpi-icon-badge badge-inprogress">
              <AlertCircleIcon size={20} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value value-inprogress">{stats.inProgress}</span>
            <span className="kpi-sub">Work currently active</span>
          </div>
          <div className="kpi-footer-bar">
            <div className="progress-micro">
              <div
                className="progress-fill fill-inprogress"
                style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Resolved Tickets */}
        <div
          className={`kpi-card ${activeStatusFilter === 'Resolved' ? 'active-filter-card' : ''}`}
          onClick={() => onFilterStatus?.('Resolved')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onFilterStatus?.('Resolved');
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`Resolved tickets: ${stats.resolved}. Click to filter resolved tickets.`}
        >
          <div className="kpi-header">
            <span className="kpi-title">Resolved</span>
            <div className="kpi-icon-badge badge-resolved">
              <CheckCircleIcon size={20} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value value-resolved">{stats.resolved}</span>
            <span className="kpi-sub">{stats.resolutionRate}% resolution rate</span>
          </div>
          <div className="kpi-footer-bar">
            <div className="progress-micro">
              <div
                className="progress-fill fill-resolved"
                style={{ width: `${stats.resolutionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Quick Insights */}
      <div className="stats-breakdown-row">
        {/* Category Breakdown Bar */}
        <div className="breakdown-card">
          <h4 className="breakdown-title">Issues by Department / Category</h4>
          <div className="category-bars-list">
            {Object.entries(stats.byCategory).map(([category, count]) => {
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={category} className="cat-stat-row">
                  <div className="cat-stat-meta">
                    <span className="cat-name">{category}</span>
                    <span className="cat-count-pct">{count} ({pct}%)</span>
                  </div>
                  <div className="stat-track">
                    <div className="stat-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority & Urgent Alert Box */}
        <div className="priority-overview-card">
          <h4 className="breakdown-title">Priority Distribution</h4>
          <div className="priority-summary-boxes">
            <div className="pri-box pri-box-urgent">
              <div className="pri-box-top">
                <AlertTriangleIcon size={16} />
                <span>Urgent</span>
              </div>
              <span className="pri-val">{stats.byPriority.Urgent}</span>
              <span className="pri-tag">Critical focus</span>
            </div>

            <div className="pri-box pri-box-high">
              <span className="pri-title">High</span>
              <span className="pri-val">{stats.byPriority.High}</span>
              <span className="pri-tag">Priority triage</span>
            </div>

            <div className="pri-box pri-box-medium">
              <span className="pri-title">Medium</span>
              <span className="pri-val">{stats.byPriority.Medium}</span>
              <span className="pri-tag">Standard SLA</span>
            </div>

            <div className="pri-box pri-box-low">
              <span className="pri-title">Low</span>
              <span className="pri-val">{stats.byPriority.Low}</span>
              <span className="pri-tag">Low impact</span>
            </div>
          </div>

          <div className="sla-banner">
            <span className="sla-label">Resolution Efficiency:</span>
            <span className="sla-metric">{stats.resolutionRate}% closed</span>
            <span className="sla-desc">Target: &gt; 80% SLA compliance</span>
          </div>
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import type { Ticket, TicketStatus } from '../types/ticket.ts';
import {
  EyeIcon,
  TrashIcon,
  MapPinIcon,
  ClockIcon,
} from './Icons.tsx';

interface TicketTableProps {
  tickets: Ticket[];
  onViewTicket: (ticket: Ticket) => void;
  onQuickStatusChange: (ticketId: string, status: TicketStatus) => void;
  onDeleteTicket: (ticketId: string) => void;
}

export const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  onViewTicket,
  onQuickStatusChange,
  onDeleteTicket,
}) => {
  if (tickets.length === 0) {
    return (
      <div className="empty-table-state">
        <ClockIcon size={40} className="empty-icon" />
        <h3 className="empty-title">No tickets match current filters</h3>
        <p className="empty-sub">Try adjusting your search criteria, category, or status filter.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive-wrapper">
      <table className="campus-ticket-table">
        <thead>
          <tr>
            <th className="th-id">ID</th>
            <th className="th-issue">Issue & Details</th>
            <th className="th-category">Category</th>
            <th className="th-priority">Priority</th>
            <th className="th-status">Status</th>
            <th className="th-reporter">Reporter</th>
            <th className="th-date">Date</th>
            <th className="th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="ticket-table-row">
              {/* ID */}
              <td className="td-id">
                <button
                  type="button"
                  className="ticket-id-link"
                  onClick={() => onViewTicket(ticket)}
                  title="Click to view details"
                >
                  {ticket.id}
                </button>
              </td>

              {/* Title & Location */}
              <td className="td-issue">
                <div className="issue-cell-content">
                  <span
                    className="issue-title"
                    onClick={() => onViewTicket(ticket)}
                    title={ticket.title}
                  >
                    {ticket.title}
                  </span>
                  <span className="issue-location">
                    <MapPinIcon size={12} /> {ticket.location}
                  </span>
                  {ticket.assignedTo && (
                    <span className="issue-assignee">Assigned: {ticket.assignedTo}</span>
                  )}
                </div>
              </td>

              {/* Category */}
              <td className="td-category">
                <span className="category-pill">{ticket.category}</span>
              </td>

              {/* Priority */}
              <td className="td-priority">
                <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>
                  {ticket.priority}
                </span>
              </td>

              {/* Status with Quick Inline Changer */}
              <td className="td-status">
                <div className="status-select-wrapper">
                  <select
                    className={`status-dropdown status-select-${ticket.status.toLowerCase().replace(/\s+/g, '-')}`}
                    value={ticket.status}
                    onChange={(e) =>
                      onQuickStatusChange(ticket.id, e.target.value as TicketStatus)
                    }
                    title="Change status directly"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </td>

              {/* Reporter */}
              <td className="td-reporter">
                <div className="reporter-cell">
                  <span className="reporter-name">{ticket.reporterName}</span>
                  <span className="reporter-role">{ticket.reporterRole}</span>
                </div>
              </td>

              {/* Date */}
              <td className="td-date">
                <span className="date-main">
                  {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span className="date-sub">
                  {new Date(ticket.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </td>

              {/* Actions */}
              <td className="td-actions">
                <div className="action-buttons-row">
                  <button
                    type="button"
                    className="table-action-btn btn-view"
                    onClick={() => onViewTicket(ticket)}
                    title="View & Edit Ticket"
                  >
                    <EyeIcon size={16} />
                  </button>
                  <button
                    type="button"
                    className="table-action-btn btn-delete"
                    onClick={() => {
                      if (window.confirm(`Delete ticket ${ticket.id}?`)) {
                        onDeleteTicket(ticket.id);
                      }
                    }}
                    title="Delete Ticket"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


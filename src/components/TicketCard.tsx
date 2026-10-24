import React from 'react';
import type { Ticket, TicketStatus } from '../types/ticket.ts';
import {
  MapPinIcon,
  UserIcon,
  ClockIcon,
  EyeIcon,
  TrashIcon,
} from './Icons.tsx';

interface TicketCardProps {
  ticket: Ticket;
  onViewTicket: (ticket: Ticket) => void;
  onQuickStatusChange: (ticketId: string, status: TicketStatus) => void;
  onDeleteTicket: (ticketId: string) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onViewTicket,
  onQuickStatusChange,
  onDeleteTicket,
}) => {
  return (
    <div className="ticket-mobile-card">
      <div className="card-top-row">
        <span className="card-ticket-id" onClick={() => onViewTicket(ticket)}>
          {ticket.id}
        </span>
        <div className="card-badges">
          <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>
            {ticket.priority}
          </span>
          <select
            className={`status-dropdown status-select-${ticket.status.toLowerCase().replace(/\s+/g, '-')}`}
            value={ticket.status}
            onChange={(e) => onQuickStatusChange(ticket.id, e.target.value as TicketStatus)}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      <h3 className="card-title" onClick={() => onViewTicket(ticket)}>
        {ticket.title}
      </h3>

      <div className="card-meta-list">
        <div className="card-meta-item">
          <MapPinIcon size={14} />
          <span>{ticket.location}</span>
        </div>
        <div className="card-meta-item">
          <UserIcon size={14} />
          <span>{ticket.reporterName} ({ticket.reporterRole})</span>
        </div>
        <div className="card-meta-item">
          <ClockIcon size={14} />
          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="card-footer-row">
        <span className="card-category-tag">{ticket.category}</span>
        <div className="card-actions">
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => onViewTicket(ticket)}
          >
            <EyeIcon size={14} /> Details
          </button>
          <button
            type="button"
            className="btn btn-sm btn-danger-ghost"
            onClick={() => {
              if (window.confirm(`Delete ticket ${ticket.id}?`)) {
                onDeleteTicket(ticket.id);
              }
            }}
          >
            <TrashIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};


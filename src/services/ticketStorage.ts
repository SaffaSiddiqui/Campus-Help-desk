import type {
  Ticket,
  TicketFormData,
  TicketStatus,
  TicketStats,
  TicketCategory,
  TicketPriority,
} from '../types/ticket.ts';
import { INITIAL_TICKETS } from '../data/seedData.ts';

const STORAGE_KEY = 'campus_helpdesk_tickets_v1';

export const ticketStorage = {
  /**
   * Load all tickets from localStorage. Falls back to seed data if empty.
   */
  getTickets(): Ticket[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        this.saveTickets(INITIAL_TICKETS);
        return INITIAL_TICKETS;
      }
      const parsed: Ticket[] = JSON.parse(stored);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        this.saveTickets(INITIAL_TICKETS);
        return INITIAL_TICKETS;
      }
      return parsed;
    } catch (err) {
      console.warn('Failed to parse tickets from localStorage, restoring seed data:', err);
      this.saveTickets(INITIAL_TICKETS);
      return INITIAL_TICKETS;
    }
  },

  /**
   * Direct save array of tickets to localStorage.
   */
  saveTickets(tickets: Ticket[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch (err) {
      console.error('Failed to write tickets to localStorage:', err);
    }
  },

  /**
   * Get a single ticket by its reference ID or return undefined.
   */
  getTicketById(id: string): Ticket | undefined {
    const tickets = this.getTickets();
    const cleanId = id.trim().toUpperCase();
    return tickets.find((t) => t.id.toUpperCase() === cleanId);
  },

  /**
   * Create and append a new ticket from form data.
   */
  createTicket(data: TicketFormData): Ticket {
    const tickets = this.getTickets();
    const currentYear = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `TKT-${currentYear}-${randomSuffix}`;
    const now = new Date().toISOString();

    const newTicket: Ticket = {
      ...data,
      id: newId,
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          id: `TL-${Date.now()}`,
          timestamp: now,
          status: 'Pending',
          action: 'Ticket Created',
          performedBy: data.reporterName || 'Reporter',
          note: 'Submitted via Campus Helpdesk portal',
        },
      ],
    };

    const updatedList = [newTicket, ...tickets];
    this.saveTickets(updatedList);
    return newTicket;
  },

  /**
   * Update the status of a ticket, append timeline entry, and optionally add resolution notes or assignee.
   */
  updateTicketStatus(
    id: string,
    newStatus: TicketStatus,
    performedBy: string = 'Campus Admin',
    note?: string,
    assignedTo?: string,
    resolutionNotes?: string
  ): Ticket | null {
    const tickets = this.getTickets();
    const index = tickets.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const existing = tickets[index];
    const now = new Date().toISOString();

    const updatedTicket: Ticket = {
      ...existing,
      status: newStatus,
      updatedAt: now,
      assignedTo: assignedTo !== undefined ? assignedTo : existing.assignedTo,
      resolvedAt: newStatus === 'Resolved' ? (existing.resolvedAt || now) : undefined,
      timeline: [
        ...existing.timeline,
        {
          id: `TL-${Date.now()}`,
          timestamp: now,
          status: newStatus,
          action: `Status changed to ${newStatus}`,
          performedBy,
          note: note || (resolutionNotes ? `Resolution: ${resolutionNotes}` : undefined),
        },
      ],
    };

    tickets[index] = updatedTicket;
    this.saveTickets(tickets);
    return updatedTicket;
  },

  /**
   * Update any ticket properties (e.g. priority, notes, assignment).
   */
  updateTicket(ticket: Ticket): void {
    const tickets = this.getTickets();
    const index = tickets.findIndex((t) => t.id === ticket.id);
    if (index !== -1) {
      tickets[index] = {
        ...ticket,
        updatedAt: new Date().toISOString(),
      };
      this.saveTickets(tickets);
    }
  },

  /**
   * Delete a ticket by ID.
   */
  deleteTicket(id: string): boolean {
    const tickets = this.getTickets();
    const filtered = tickets.filter((t) => t.id !== id);
    if (filtered.length !== tickets.length) {
      this.saveTickets(filtered);
      return true;
    }
    return false;
  },

  /**
   * Reset localStorage with initial seed data.
   */
  resetToDefaults(): Ticket[] {
    this.saveTickets(INITIAL_TICKETS);
    return INITIAL_TICKETS;
  },

  /**
   * Clear all tickets.
   */
  clearAll(): void {
    this.saveTickets([]);
  },

  /**
   * Compute aggregate statistics for admin dashboard.
   */
  getStats(ticketsList?: Ticket[]): TicketStats {
    const tickets = ticketsList || this.getTickets();

    const defaultCategories: Record<TicketCategory, number> = {
      'IT & Wi-Fi': 0,
      'Facilities & Maintenance': 0,
      'Classroom & Lab Equipment': 0,
      'Hostel & Housing': 0,
      'Library Services': 0,
      'Campus Safety & Security': 0,
      'Other': 0,
    };

    const defaultPriorities: Record<TicketPriority, number> = {
      Low: 0,
      Medium: 0,
      High: 0,
      Urgent: 0,
    };

    const stats: TicketStats = {
      total: tickets.length,
      pending: 0,
      inProgress: 0,
      resolved: 0,
      urgent: 0,
      resolutionRate: 0,
      byCategory: { ...defaultCategories },
      byPriority: { ...defaultPriorities },
    };

    for (const ticket of tickets) {
      // Status counting
      if (ticket.status === 'Pending') stats.pending++;
      else if (ticket.status === 'In Progress') stats.inProgress++;
      else if (ticket.status === 'Resolved') stats.resolved++;

      // Priority counting
      if (ticket.priority === 'Urgent') stats.urgent++;
      if (ticket.priority in stats.byPriority) {
        stats.byPriority[ticket.priority]++;
      }

      // Category counting
      if (ticket.category in stats.byCategory) {
        stats.byCategory[ticket.category]++;
      } else {
        stats.byCategory.Other++;
      }
    }

    stats.resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

    return stats;
  },

  /**
   * Export all tickets to CSV formatted string.
   */
  exportToCsv(tickets: Ticket[]): string {
    const headers = [
      'Ticket ID',
      'Title',
      'Category',
      'Priority',
      'Status',
      'Location',
      'Reporter Name',
      'Reporter Email',
      'Reporter ID',
      'Reporter Role',
      'Assigned To',
      'Created At',
      'Resolved At',
      'Resolution Notes',
    ];

    const escapeCsv = (str: string | undefined) => {
      if (!str) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = tickets.map((t) => [
      escapeCsv(t.id),
      escapeCsv(t.title),
      escapeCsv(t.category),
      escapeCsv(t.priority),
      escapeCsv(t.status),
      escapeCsv(t.location),
      escapeCsv(t.reporterName),
      escapeCsv(t.reporterEmail),
      escapeCsv(t.reporterId),
      escapeCsv(t.reporterRole),
      escapeCsv(t.assignedTo),
      escapeCsv(t.createdAt),
      escapeCsv(t.resolvedAt),
      escapeCsv(t.resolutionNotes),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  },
};


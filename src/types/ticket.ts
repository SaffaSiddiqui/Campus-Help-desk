export type TicketStatus = 'Pending' | 'In Progress' | 'Resolved';

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type TicketCategory =
  | 'IT & Wi-Fi'
  | 'Facilities & Maintenance'
  | 'Classroom & Lab Equipment'
  | 'Hostel & Housing'
  | 'Library Services'
  | 'Campus Safety & Security'
  | 'Other';

export type ReporterRole = 'Student' | 'Faculty' | 'Staff' | 'Visitor';

export interface TicketTimelineEntry {
  id: string;
  timestamp: string;
  status: TicketStatus;
  action: string;
  performedBy: string;
  note?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  location: string;
  reporterName: string;
  reporterEmail: string;
  reporterId: string;
  reporterRole: ReporterRole;
  attachmentName?: string;
  attachmentDataUrl?: string;
  assignedTo?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  timeline: TicketTimelineEntry[];
}

export interface TicketFormData {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  location: string;
  reporterName: string;
  reporterEmail: string;
  reporterId: string;
  reporterRole: ReporterRole;
  attachmentName?: string;
  attachmentDataUrl?: string;
}

export interface TicketFilterOptions {
  searchQuery: string;
  status: 'All' | TicketStatus;
  priority: 'All' | TicketPriority;
  category: 'All' | TicketCategory;
  sortBy: 'newest' | 'oldest' | 'priority' | 'status';
}

export interface TicketStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  urgent: number;
  resolutionRate: number;
  byCategory: Record<TicketCategory, number>;
  byPriority: Record<TicketPriority, number>;
}


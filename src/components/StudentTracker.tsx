import React, { useState, useMemo } from 'react';
import type { Ticket, TicketStatus } from '../types/ticket.ts';
import {
  SearchIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  MapPinIcon,
  UserIcon,
  TagIcon,
  PaperclipIcon,
} from './Icons.tsx';

interface StudentTrackerProps {
  initialSearchId?: string;
  tickets: Ticket[];
}

export const StudentTracker: React.FC<StudentTrackerProps> = ({
  initialSearchId = '',
  tickets,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchId);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(() => {
    if (initialSearchId) {
      const found = tickets.find((t) => t.id.toLowerCase() === initialSearchId.toLowerCase());
      return found ? found.id : '';
    }
    return tickets[0]?.id || '';
  });

  const [hasSearched, setHasSearched] = useState(Boolean(initialSearchId));

  const selectedTicket = useMemo(() => {
    if (!selectedTicketId) return null;
    return tickets.find((t) => t.id.toLowerCase() === selectedTicketId.toLowerCase()) || null;
  }, [tickets, selectedTicketId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      setSelectedTicketId('');
      return;
    }

    const found = tickets.find(
      (t) =>
        t.id.toLowerCase() === query ||
        t.reporterEmail.toLowerCase() === query ||
        t.reporterId.toLowerCase() === query
    );
    setSelectedTicketId(found ? found.id : '');
  };

  const getStatusStepIndex = (status: TicketStatus): number => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'In Progress':
        return 2;
      case 'Resolved':
        return 3;
      default:
        return 1;
    }
  };

  const currentStep = selectedTicket ? getStatusStepIndex(selectedTicket.status) : 0;

  return (
    <div className="student-tracker-container">
      <div className="tracker-header">
        <h1 className="tracker-title">Track Campus Issue Status</h1>
        <p className="tracker-subtitle">
          Check live progress, assigned technicians, and resolution updates for your submitted tickets.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="tracker-search-bar">
          <div className="search-input-wrapper">
            <SearchIcon size={20} className="search-icon" />
            <input
              type="text"
              className="tracker-input"
              placeholder="Enter Ticket ID (e.g. TKT-2026-1001), Student ID, or Email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary search-submit-btn">
            Track Status
          </button>
        </form>

        {/* Quick chip suggestions */}
        <div className="quick-ticket-chips">
          <span className="chips-label">Sample tickets to test:</span>
          {tickets.slice(0, 4).map((t) => (
            <button
              key={t.id}
              type="button"
              className={`chip-btn ${selectedTicket?.id === t.id ? 'active' : ''}`}
              onClick={() => {
                setSearchTerm(t.id);
                setSelectedTicketId(t.id);
                setHasSearched(true);
              }}
            >
              <span>{t.id}</span>
              <span className={`chip-status-dot dot-${t.status.toLowerCase().replace(/\s+/g, '-')}`}></span>
            </button>
          ))}
        </div>
      </div>

      {/* Results area */}
      {selectedTicket ? (
        <div className="tracker-result-card animate-fade-in">
          {/* Top banner with Ticket ID and Status */}
          <div className="tracker-result-top">
            <div>
              <span className="tracker-id-badge">{selectedTicket.id}</span>
              <h2 className="tracker-result-title">{selectedTicket.title}</h2>
              <span className="tracker-timestamp">
                Submitted on {new Date(selectedTicket.createdAt).toLocaleString()}
              </span>
            </div>
            <div>
              <span className={`status-badge status-${selectedTicket.status.toLowerCase().replace(/\s+/g, '-')}`}>
                {selectedTicket.status}
              </span>
            </div>
          </div>

          {/* Stepper workflow: Pending -> In Progress -> Resolved */}
          <div className="status-stepper-box">
            <div className="stepper-track">
              {/* Step 1: Pending */}
              <div className={`step-item ${currentStep >= 1 ? 'completed' : ''} ${currentStep === 1 ? 'current' : ''}`}>
                <div className="step-circle">
                  {currentStep > 1 ? <CheckCircleIcon size={18} /> : <ClockIcon size={18} />}
                </div>
                <div className="step-label-group">
                  <span className="step-name">1. Pending</span>
                  <span className="step-sub">Awaiting Triage</span>
                </div>
              </div>

              <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>

              {/* Step 2: In Progress */}
              <div className={`step-item ${currentStep >= 2 ? 'completed' : ''} ${currentStep === 2 ? 'current' : ''}`}>
                <div className="step-circle">
                  {currentStep > 2 ? <CheckCircleIcon size={18} /> : <AlertCircleIcon size={18} />}
                </div>
                <div className="step-label-group">
                  <span className="step-name">2. In Progress</span>
                  <span className="step-sub">Technician Dispatched</span>
                </div>
              </div>

              <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`}></div>

              {/* Step 3: Resolved */}
              <div className={`step-item ${currentStep >= 3 ? 'completed' : ''} ${currentStep === 3 ? 'current' : ''}`}>
                <div className="step-circle">
                  <CheckCircleIcon size={18} />
                </div>
                <div className="step-label-group">
                  <span className="step-name">3. Resolved</span>
                  <span className="step-sub">Completed & Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="tracker-details-grid">
            <div className="detail-item">
              <span className="detail-label">
                <TagIcon size={15} /> Category
              </span>
              <span className="detail-val">{selectedTicket.category}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Priority</span>
              <span className={`priority-badge priority-${selectedTicket.priority.toLowerCase()}`}>
                {selectedTicket.priority}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                <MapPinIcon size={15} /> Location
              </span>
              <span className="detail-val">{selectedTicket.location}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                <UserIcon size={15} /> Assigned Technician
              </span>
              <span className="detail-val">{selectedTicket.assignedTo || 'Unassigned (Triage in progress)'}</span>
            </div>
          </div>

          {/* Description */}
          <div className="tracker-desc-box">
            <h4 className="box-heading">Issue Description</h4>
            <p className="box-body">{selectedTicket.description}</p>
          </div>

          {/* Attachment Preview if any */}
          {selectedTicket.attachmentName && (
            <div className="tracker-attachment-box">
              <h4 className="box-heading">Attachment</h4>
              <div className="attachment-item">
                <PaperclipIcon size={18} />
                <span>{selectedTicket.attachmentName}</span>
                {selectedTicket.attachmentDataUrl && selectedTicket.attachmentDataUrl.startsWith('data:image') && (
                  <div className="image-preview-wrapper">
                    <img src={selectedTicket.attachmentDataUrl} alt="Attached issue photo" className="attached-img-thumb" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resolution remarks if resolved */}
          {selectedTicket.resolutionNotes && (
            <div className="tracker-resolution-box">
              <h4 className="box-heading">Resolution Remarks</h4>
              <p className="box-body">{selectedTicket.resolutionNotes}</p>
              {selectedTicket.resolvedAt && (
                <span className="resolved-time">
                  Resolved on: {new Date(selectedTicket.resolvedAt).toLocaleString()}
                </span>
              )}
            </div>
          )}

          {/* Timeline Audit Logs */}
          <div className="tracker-timeline-section">
            <h4 className="box-heading">Activity & Status History</h4>
            <div className="timeline-list">
              {selectedTicket.timeline.map((entry) => (
                <div key={entry.id} className="timeline-entry">
                  <div className="timeline-bullet"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-action">{entry.action}</span>
                      <span className="timeline-time">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <span className="timeline-actor">By: {entry.performedBy}</span>
                    {entry.note && <p className="timeline-note">{entry.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="no-result-card animate-fade-in">
          <AlertCircleIcon size={40} className="text-warning" />
          <h3>No Ticket Found</h3>
          <p>We couldn't find a ticket matching "{searchTerm}". Please double-check your Ticket ID or Student ID.</p>
        </div>
      ) : null}
    </div>
  );
};


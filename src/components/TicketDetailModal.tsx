import React, { useState, useEffect } from 'react';
import type { Ticket, TicketStatus } from '../types/ticket.ts';
import {
  CloseIcon,
  ClockIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  TrashIcon,
  UserIcon,
  MapPinIcon,
  TagIcon,
  PaperclipIcon,
} from './Icons.tsx';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (
    ticketId: string,
    status: TicketStatus,
    performedBy: string,
    note?: string,
    assignedTo?: string,
    resolutionNotes?: string
  ) => void;
  onDeleteTicket: (ticketId: string) => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onUpdateStatus,
  onDeleteTicket,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>(ticket?.status || 'Pending');
  const [assignedTo, setAssignedTo] = useState(ticket?.assignedTo || '');
  const [resolutionNotes, setResolutionNotes] = useState(ticket?.resolutionNotes || '');
  const [adminNote, setAdminNote] = useState('');
  const [performedBy, setPerformedBy] = useState('Campus Helpdesk Lead');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formError, setFormError] = useState('');

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !ticket) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStatus === 'Resolved' && !resolutionNotes.trim()) {
      setFormError('Please summarize the resolution actions taken before marking this ticket as Resolved.');
      return;
    }
    setFormError('');
    onUpdateStatus(
      ticket.id,
      selectedStatus,
      performedBy,
      adminNote.trim() || undefined,
      assignedTo.trim() || undefined,
      resolutionNotes.trim() || undefined
    );
    onClose();
  };

  const handleDelete = () => {
    onDeleteTicket(ticket.id);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <div className="modal-id-row">
              <span className="modal-ticket-id">{ticket.id}</span>
              <span className={`status-badge status-${ticket.status.toLowerCase().replace(/\s+/g, '-')}`}>
                Current: {ticket.status}
              </span>
              <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>
                {ticket.priority} Priority
              </span>
            </div>
            <h2 className="modal-title">{ticket.title}</h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body-scrollable">
          {/* Reporter & Location Meta Strip */}
          <div className="modal-meta-grid">
            <div className="meta-cell">
              <span className="meta-cell-label"><UserIcon size={14} /> Reporter</span>
              <span className="meta-cell-val font-semibold">{ticket.reporterName}</span>
              <span className="meta-cell-sub">{ticket.reporterRole} ({ticket.reporterId})</span>
              <span className="meta-cell-sub">{ticket.reporterEmail}</span>
            </div>

            <div className="meta-cell">
              <span className="meta-cell-label"><MapPinIcon size={14} /> Location</span>
              <span className="meta-cell-val">{ticket.location}</span>
            </div>

            <div className="meta-cell">
              <span className="meta-cell-label"><TagIcon size={14} /> Category</span>
              <span className="meta-cell-val">{ticket.category}</span>
            </div>

            <div className="meta-cell">
              <span className="meta-cell-label"><ClockIcon size={14} /> Created</span>
              <span className="meta-cell-val">{new Date(ticket.createdAt).toLocaleString()}</span>
              {ticket.resolvedAt && (
                <span className="meta-cell-sub text-success">
                  Resolved: {new Date(ticket.resolvedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Issue Description */}
          <div className="modal-section-box">
            <h4 className="modal-section-title">Issue Description</h4>
            <p className="modal-description-text">{ticket.description}</p>
          </div>

          {/* Optional Attachment */}
          {ticket.attachmentName && (
            <div className="modal-section-box">
              <h4 className="modal-section-title">Attachment</h4>
              <div className="modal-attachment-row">
                <PaperclipIcon size={18} />
                <span className="font-mono">{ticket.attachmentName}</span>
              </div>
              {ticket.attachmentDataUrl && ticket.attachmentDataUrl.startsWith('data:image') && (
                <div className="modal-image-preview">
                  <img src={ticket.attachmentDataUrl} alt="Issue attachment" />
                </div>
              )}
            </div>
          )}

          {/* Status & Assignment Update Form */}
          <form id="statusUpdateForm" onSubmit={handleSave} className="modal-update-form">
            <h4 className="modal-section-title">Update Status & Assignment</h4>
            {formError && <div className="modal-form-error">{formError}</div>}

            {/* Status Pills */}
            <div className="form-group">
              <label className="form-label font-semibold">Change Status <span className="req">*</span></label>
              <div className="status-selector-grid">
                {(['Pending', 'In Progress', 'Resolved'] as TicketStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`status-select-btn status-btn-${st.toLowerCase().replace(/\s+/g, '-')} ${selectedStatus === st ? 'selected' : ''}`}
                    onClick={() => setSelectedStatus(st)}
                  >
                    {st === 'Pending' && <ClockIcon size={16} />}
                    {st === 'In Progress' && <AlertCircleIcon size={16} />}
                    {st === 'Resolved' && <CheckCircleIcon size={16} />}
                    <span>{st}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="assignedStaff">Assign Technician / Lead</label>
                <input
                  id="assignedStaff"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Marcus Cole (AV Lead)"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="performedBy">Logged By</label>
                <input
                  id="performedBy"
                  type="text"
                  className="form-input"
                  value={performedBy}
                  onChange={(e) => setPerformedBy(e.target.value)}
                />
              </div>
            </div>

            {/* Resolution notes - highlighted if status is Resolved */}
            <div className={`form-group ${selectedStatus === 'Resolved' ? 'highlight-resolution' : ''}`}>
              <label className="form-label" htmlFor="resolutionNotes">
                Resolution Notes {selectedStatus === 'Resolved' && <span className="req">* (Recommended)</span>}
              </label>
              <textarea
                id="resolutionNotes"
                rows={2}
                className="form-textarea"
                placeholder={selectedStatus === 'Resolved' ? 'Explain what action was taken to fix the issue (e.g. replaced parts, reset server, plumbing sealed)...' : 'Optional resolution notes'}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="adminNote">Internal Timeline Note / Remark</label>
              <input
                id="adminNote"
                type="text"
                className="form-input"
                placeholder="Optional remark to record in this ticket's audit log"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />
            </div>
          </form>

          {/* Timeline Audit History */}
          <div className="modal-section-box">
            <h4 className="modal-section-title">Audit Log & Timeline</h4>
            <div className="timeline-list">
              {ticket.timeline.map((entry) => (
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

        {/* Modal Footer */}
        <div className="modal-footer">
          <div className="footer-left">
            {!showDeleteConfirm ? (
              <button
                type="button"
                className="btn btn-danger-ghost"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <TrashIcon size={16} />
                <span>Delete</span>
              </button>
            ) : (
              <div className="delete-confirm-box">
                <span className="confirm-text">Confirm permanent deletion?</span>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={handleDelete}
                >
                  Yes, Delete
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="footer-right">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="statusUpdateForm"
              className="btn btn-primary"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

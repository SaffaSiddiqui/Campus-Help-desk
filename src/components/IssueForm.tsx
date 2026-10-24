import React, { useState } from 'react';
import type {
  TicketCategory,
  TicketPriority,
  ReporterRole,
  TicketFormData,
  Ticket,
} from '../types/ticket.ts';
import {
  WifiIcon,
  ToolIcon,
  MonitorIcon,
  HomeIcon,
  BookOpenIcon,
  ShieldIcon,
  TagIcon,
  CheckCircleIcon,
  PaperclipIcon,
  CloseIcon,
  UserIcon,
  MapPinIcon,
} from './Icons.tsx';

interface IssueFormProps {
  onSubmitTicket: (data: TicketFormData) => Ticket;
  onTrackTicket: (ticketId: string) => void;
}

const CATEGORIES: { label: TicketCategory; icon: React.FC<{ size?: number; className?: string }> }[] = [
  { label: 'IT & Wi-Fi', icon: WifiIcon },
  { label: 'Facilities & Maintenance', icon: ToolIcon },
  { label: 'Classroom & Lab Equipment', icon: MonitorIcon },
  { label: 'Hostel & Housing', icon: HomeIcon },
  { label: 'Library Services', icon: BookOpenIcon },
  { label: 'Campus Safety & Security', icon: ShieldIcon },
  { label: 'Other', icon: TagIcon },
];

const PRIORITIES: { label: TicketPriority; desc: string; colorClass: string }[] = [
  { label: 'Low', desc: 'Minor inconvenience; no study/work disruption', colorClass: 'priority-low' },
  { label: 'Medium', desc: 'Standard issue; workaround available', colorClass: 'priority-medium' },
  { label: 'High', desc: 'Significant impact on class, lab, or dorm', colorClass: 'priority-high' },
  { label: 'Urgent', desc: 'Critical safety, water leak, or midterm exam blocker', colorClass: 'priority-urgent' },
];

export const IssueForm: React.FC<IssueFormProps> = ({ onSubmitTicket, onTrackTicket }) => {
  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: '',
    category: 'IT & Wi-Fi',
    priority: 'Medium',
    location: '',
    reporterName: '',
    reporterEmail: '',
    reporterId: '',
    reporterRole: 'Student',
    attachmentName: '',
    attachmentDataUrl: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TicketFormData, string>>>({});
  const [fileError, setFileError] = useState<string>('');
  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TicketFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Please provide a descriptive issue title.';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please describe the problem in detail.';
    } else if (formData.description.trim().length < 15) {
      newErrors.description = 'Description should be at least 15 characters so technicians can diagnose.';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Please specify the building name and room number.';
    }

    if (!formData.reporterName.trim()) {
      newErrors.reporterName = 'Your name is required.';
    }

    if (!formData.reporterEmail.trim()) {
      newErrors.reporterEmail = 'Contact email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.reporterEmail)) {
      newErrors.reporterEmail = 'Please provide a valid email address.';
    }

    if (!formData.reporterId.trim()) {
      newErrors.reporterId = 'Student or Staff ID is required (e.g. STU-1029).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const ticket = onSubmitTicket(formData);
    setCreatedTicket(ticket);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setFileError('File size exceeds the 2MB limit. Please attach a smaller image or PDF.');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|gif|pdf)$/i)) {
      setFileError('Unsupported file type. Please upload a JPG, PNG, WEBP, or PDF document.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        attachmentName: file.name,
        attachmentDataUrl: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    setFormData((prev) => ({
      ...prev,
      attachmentName: '',
      attachmentDataUrl: '',
    }));
    setFileError('');
  };

  const handleCopyTicketId = () => {
    if (createdTicket) {
      navigator.clipboard.writeText(createdTicket.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'IT & Wi-Fi',
      priority: 'Medium',
      location: '',
      reporterName: '',
      reporterEmail: '',
      reporterId: '',
      reporterRole: 'Student',
      attachmentName: '',
      attachmentDataUrl: '',
    });
    setErrors({});
    setFileError('');
    setCreatedTicket(null);
  };

  const loadSampleData = () => {
    setFormData({
      title: 'Lab 3 Wi-Fi router red light flashing and no internet',
      description: 'The ceiling router in Computer Lab 3 (Engineering Hall) has a persistent flashing red LED. All 25 lab workstations cannot access GitHub or university portal during practical.',
      category: 'IT & Wi-Fi',
      priority: 'High',
      location: 'Engineering Building B, 2nd Floor, Computer Lab 3',
      reporterName: 'Alex Robinson',
      reporterEmail: 'a.robinson@campus.edu',
      reporterId: 'STU-48201',
      reporterRole: 'Student',
      attachmentName: '',
      attachmentDataUrl: '',
    });
    setErrors({});
  };

  // If ticket was successfully created, show confirmation view
  if (createdTicket) {
    return (
      <div className="submission-success-card animate-fade-in">
        <div className="success-icon-badge">
          <CheckCircleIcon size={48} className="text-success" />
        </div>
        <h2 className="success-title">Issue Submitted Successfully!</h2>
        <p className="success-subtitle">
          Your campus helpdesk ticket has been created with status{' '}
          <span className="status-badge status-pending">Pending</span> and dispatched to the triage team.
        </p>

        <div className="ticket-ref-box">
          <span className="ref-label">TICKET REFERENCE ID</span>
          <div className="ref-number-row">
            <span className="ref-number">{createdTicket.id}</span>
            <button
              type="button"
              className="copy-btn"
              onClick={handleCopyTicketId}
            >
              {copiedId ? 'Copied!' : 'Copy ID'}
            </button>
          </div>
          <span className="ref-hint">Save this ID to check updates or receive resolutions at any time.</span>
        </div>

        <div className="ticket-summary-panel">
          <div className="summary-row">
            <span className="summary-label">Title:</span>
            <span className="summary-value">{createdTicket.title}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Category:</span>
            <span className="summary-value">{createdTicket.category}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Location:</span>
            <span className="summary-value">{createdTicket.location}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Priority:</span>
            <span className={`priority-badge priority-${createdTicket.priority.toLowerCase()}`}>
              {createdTicket.priority}
            </span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Reported by:</span>
            <span className="summary-value">
              {createdTicket.reporterName} ({createdTicket.reporterRole} - {createdTicket.reporterId})
            </span>
          </div>
        </div>

        <div className="success-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onTrackTicket(createdTicket.id)}
          >
            Track Status in Real-Time
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={resetForm}
          >
            Submit Another Issue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="issue-form-container">
      <div className="form-header-banner">
        <div className="header-text">
          <h1 className="form-main-title">Submit a Campus Issue</h1>
          <p className="form-main-subtitle">
            Report IT failures, maintenance needs, classroom disruptions, or security concerns across campus.
          </p>
        </div>
        <button
          type="button"
          className="btn-sample-fill"
          onClick={loadSampleData}
          title="Fill form with sample data for quick testing"
        >
          Fill Sample Issue
        </button>
      </div>

      <form className="campus-ticket-form" onSubmit={handleSubmit} noValidate>
        {/* Section 1: Reporter Information */}
        <section className="form-section">
          <div className="section-title-row">
            <UserIcon size={20} className="section-icon" />
            <h3 className="section-title">1. Reporter Information</h3>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label htmlFor="reporterName" className="form-label">
                Full Name <span className="req">*</span>
              </label>
              <input
                id="reporterName"
                type="text"
                className={`form-input ${errors.reporterName ? 'input-error' : ''}`}
                placeholder="e.g. Alex Robinson"
                value={formData.reporterName}
                onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
              />
              {errors.reporterName && <span className="error-text">{errors.reporterName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="reporterEmail" className="form-label">
                Campus Email <span className="req">*</span>
              </label>
              <input
                id="reporterEmail"
                type="email"
                className={`form-input ${errors.reporterEmail ? 'input-error' : ''}`}
                placeholder="name@campus.edu"
                value={formData.reporterEmail}
                onChange={(e) => setFormData({ ...formData, reporterEmail: e.target.value })}
              />
              {errors.reporterEmail && <span className="error-text">{errors.reporterEmail}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="reporterId" className="form-label">
                Student / Staff ID <span className="req">*</span>
              </label>
              <input
                id="reporterId"
                type="text"
                className={`form-input ${errors.reporterId ? 'input-error' : ''}`}
                placeholder="e.g. STU-49201"
                value={formData.reporterId}
                onChange={(e) => setFormData({ ...formData, reporterId: e.target.value })}
              />
              {errors.reporterId && <span className="error-text">{errors.reporterId}</span>}
            </div>
          </div>

          <div className="form-group role-selector-group">
            <label className="form-label">Your Campus Role</label>
            <div className="role-pills">
              {(['Student', 'Faculty', 'Staff', 'Visitor'] as ReporterRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  className={`role-pill ${formData.reporterRole === role ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, reporterRole: role })}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Category & Priority */}
        <section className="form-section">
          <div className="section-title-row">
            <TagIcon size={20} className="section-icon" />
            <h3 className="section-title">2. Category & Urgency</h3>
          </div>

          <div className="form-group">
            <label className="form-label">Issue Category <span className="req">*</span></label>
            <div className="category-card-grid">
              {CATEGORIES.map(({ label, icon: CatIcon }) => (
                <button
                  key={label}
                  type="button"
                  className={`category-select-card ${formData.category === label ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, category: label })}
                >
                  <CatIcon size={22} className="cat-card-icon" />
                  <span className="cat-card-title">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Priority Level <span className="req">*</span></label>
            <div className="priority-cards-grid">
              {PRIORITIES.map(({ label, desc, colorClass }) => (
                <button
                  key={label}
                  type="button"
                  className={`priority-select-btn ${colorClass} ${formData.priority === label ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, priority: label })}
                >
                  <div className="priority-header">
                    <span className="priority-name">{label}</span>
                  </div>
                  <span className="priority-desc">{desc}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Issue Details & Location */}
        <section className="form-section">
          <div className="section-title-row">
            <MapPinIcon size={20} className="section-icon" />
            <h3 className="section-title">3. Issue Details & Location</h3>
          </div>

          <div className="form-group">
            <label htmlFor="issueTitle" className="form-label">
              Issue Summary / Title <span className="req">*</span>
            </label>
            <input
              id="issueTitle"
              type="text"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              placeholder="e.g. Projector audio not playing in Science Hall 101"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="issueLocation" className="form-label">
              Campus Location & Room <span className="req">*</span>
            </label>
            <input
              id="issueLocation"
              type="text"
              className={`form-input ${errors.location ? 'input-error' : ''}`}
              placeholder="e.g. Science Complex Block A, Room 204 or North Dorm Laundry"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="issueDescription" className="form-label">
              Detailed Description <span className="req">*</span>
            </label>
            <textarea
              id="issueDescription"
              rows={4}
              className={`form-textarea ${errors.description ? 'input-error' : ''}`}
              placeholder="Please provide steps to reproduce, error codes seen on screen, or exact symptoms..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="textarea-footer">
              {errors.description ? (
                <span className="error-text">{errors.description}</span>
              ) : (
                <span className="form-hint">Be as specific as possible to expedite diagnosis.</span>
              )}
              <span className="char-count">{formData.description.length} chars</span>
            </div>
          </div>

          {/* Optional Attachment */}
          <div className="form-group attachment-group">
            <label className="form-label">Optional Photo / Screenshot (Max 2MB)</label>
            {formData.attachmentName ? (
              <div className="attachment-preview-box">
                <PaperclipIcon size={18} className="text-accent" />
                <span className="attachment-name">{formData.attachmentName}</span>
                <button
                  type="button"
                  className="btn-remove-attachment"
                  onClick={removeAttachment}
                  title="Remove attachment"
                >
                  <CloseIcon size={16} />
                </button>
              </div>
            ) : (
              <label className="file-upload-dropzone">
                <PaperclipIcon size={24} className="upload-icon" />
                <span className="upload-prompt">Click to attach photo, screenshot, or receipt</span>
                <span className="upload-sub">PNG, JPG, PDF up to 2MB</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden-file-input"
                />
              </label>
            )}
            {fileError && <span className="error-text attachment-error">{fileError}</span>}
          </div>
        </section>

        {/* Submit Bar */}
        <div className="form-actions-bar">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={resetForm}
          >
            Clear Form
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-submit-ticket"
          >
            Submit Helpdesk Ticket
          </button>
        </div>
      </form>
    </div>
  );
};

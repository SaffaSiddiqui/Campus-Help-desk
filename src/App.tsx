import { useState, useMemo } from 'react';
import type { Ticket, TicketFormData, TicketStatus, TicketStats } from './types/ticket.ts';
import { ticketStorage } from './services/ticketStorage.ts';
import { Navbar, type ActiveTab } from './components/Navbar.tsx';
import { IssueForm } from './components/IssueForm.tsx';
import { StudentTracker } from './components/StudentTracker.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { ToastContainer, type ToastMessage } from './components/Toast.tsx';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('submit');
  const [tickets, setTickets] = useState<Ticket[]>(() => ticketStorage.getTickets());
  const stats: TicketStats = useMemo(() => ticketStorage.getStats(tickets), [tickets]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [trackingTicketId, setTrackingTicketId] = useState<string>('');

  const addToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, message?: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Submit Issue
  const handleSubmitTicket = (data: TicketFormData): Ticket => {
    const newTicket = ticketStorage.createTicket(data);
    const updatedTickets = [newTicket, ...tickets];
    setTickets(updatedTickets);
    addToast(
      'success',
      'Ticket Submitted',
      `Reference ${newTicket.id} has been recorded with status Pending.`
    );
    return newTicket;
  };

  // Track Ticket shortcut
  const handleTrackTicket = (ticketId: string) => {
    setTrackingTicketId(ticketId);
    setActiveTab('track');
  };

  // Update Status & Assignment
  const handleUpdateStatus = (
    ticketId: string,
    newStatus: TicketStatus,
    performedBy: string,
    note?: string,
    assignedTo?: string,
    resolutionNotes?: string
  ) => {
    const updated = ticketStorage.updateTicketStatus(
      ticketId,
      newStatus,
      performedBy,
      note,
      assignedTo,
      resolutionNotes
    );

    if (updated) {
      const refreshedList = ticketStorage.getTickets();
      setTickets(refreshedList);
      addToast(
        'info',
        'Status Updated',
        `Ticket ${ticketId} status changed to ${newStatus}.`
      );
    }
  };

  // Delete Ticket
  const handleDeleteTicket = (ticketId: string) => {
    const success = ticketStorage.deleteTicket(ticketId);
    if (success) {
      const refreshedList = ticketStorage.getTickets();
      setTickets(refreshedList);
      addToast('warning', 'Ticket Deleted', `Ticket ${ticketId} was removed.`);
    }
  };

  // Reset to default sample data
  const handleResetDemoData = () => {
    const resetList = ticketStorage.resetToDefaults();
    setTickets(resetList);
    addToast('info', 'Demo Data Restored', 'Realistic campus tickets repopulated into localStorage.');
  };

  // Export to CSV
  const handleExportCsv = () => {
    const csvContent = ticketStorage.exportToCsv(tickets);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.setAttribute('download', `campus-helpdesk-tickets-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('success', 'CSV Export Ready', `Downloaded ${tickets.length} tickets to CSV.`);
  };

  return (
    <div className="helpdesk-app-wrapper">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'track') {
            setTrackingTicketId('');
          }
        }}
        pendingCount={stats.pending}
      />

      {/* Main Content Area */}
      <main className="main-content-layout">
        {activeTab === 'submit' && (
          <IssueForm
            onSubmitTicket={handleSubmitTicket}
            onTrackTicket={handleTrackTicket}
          />
        )}

        {activeTab === 'track' && (
          <StudentTracker
            key={trackingTicketId || 'default'}
            initialSearchId={trackingTicketId}
            tickets={tickets}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            tickets={tickets}
            stats={stats}
            onUpdateStatus={handleUpdateStatus}
            onDeleteTicket={handleDeleteTicket}
            onResetDemoData={handleResetDemoData}
            onExportCsv={handleExportCsv}
          />
        )}
      </main>

      {/* Global Toast Stack */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;

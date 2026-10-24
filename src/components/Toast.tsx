import React from 'react';
import { CheckCircleIcon, AlertTriangleIcon, CloseIcon } from './Icons.tsx';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item toast-${toast.type}`}>
          <div className="toast-icon">
            {toast.type === 'success' && <CheckCircleIcon size={20} />}
            {toast.type === 'warning' && <AlertTriangleIcon size={20} />}
            {toast.type === 'error' && <AlertTriangleIcon size={20} />}
            {toast.type === 'info' && <CheckCircleIcon size={20} />}
          </div>
          <div className="toast-body">
            <h4 className="toast-title">{toast.title}</h4>
            {toast.message && <p className="toast-text">{toast.message}</p>}
          </div>
          <button
            type="button"
            className="toast-close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
          >
            <CloseIcon size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};


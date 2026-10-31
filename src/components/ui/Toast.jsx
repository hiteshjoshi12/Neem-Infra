"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X, Trash2 } from 'lucide-react';

/**
 * Lightweight global event bus for direct imperatively triggered toasts.
 * Allows calling toast.success(...) anywhere in client code without requiring hooks.
 */
const toastListeners = new Set();

export const toast = {
  notify: (message, options = {}) => {
    toastListeners.forEach((listener) => listener({ message, ...options }));
  },
  success: (message, options = {}) => {
    toast.notify(message, { type: 'success', ...options });
  },
  error: (message, options = {}) => {
    toast.notify(message, { type: 'error', ...options });
  },
  warning: (message, options = {}) => {
    toast.notify(message, { type: 'warning', ...options });
  },
  info: (message, options = {}) => {
    toast.notify(message, { type: 'info', ...options });
  },
  delete: (message, options = {}) => {
    toast.notify(message, { type: 'delete', ...options });
  },
};

export default toast;

const ToastContext = createContext({
  toast,
  addToast: () => {},
  removeToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((payload) => {
    const id = payload.id || `toast_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const duration = payload.duration !== undefined ? payload.duration : 4000;
    const newToast = {
      id,
      message: typeof payload === 'string' ? payload : (payload.message || ''),
      type: payload.type || 'info',
      duration,
    };

    setToasts((prev) => {
      // Keep maximum 5 toasts simultaneously to avoid layout crowding
      const filtered = prev.slice(-4);
      return [...filtered, newToast];
    });

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  useEffect(() => {
    const handleEvent = (payload) => addToast(payload);
    toastListeners.add(handleEvent);
    return () => {
      toastListeners.delete(handleEvent);
    };
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <aside
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm sm:max-w-md w-[calc(100vw-2.5rem)] pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 animate-in slide-in-from-bottom-3 ${
              t.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100'
                : t.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/40 text-rose-100'
                : t.type === 'warning'
                ? 'bg-amber-950/90 border-amber-500/40 text-amber-100'
                : t.type === 'delete'
                ? 'bg-neutral-900/95 border-rose-500/40 text-white'
                : 'bg-brand-navy-deep/95 border-white/20 text-white'
            }`}
          >
            {/* Status Icon */}
            <div className="shrink-0 mt-0.5">
              {t.type === 'success' && (
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 size={15} />
                </div>
              )}
              {t.type === 'error' && (
                <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <AlertCircle size={15} />
                </div>
              )}
              {t.type === 'warning' && (
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <AlertTriangle size={15} />
                </div>
              )}
              {t.type === 'delete' && (
                <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Trash2 size={14} />
                </div>
              )}
              {t.type === 'info' && (
                <div className="w-6 h-6 rounded-lg bg-brand-gold/20 text-brand-gold flex items-center justify-center">
                  <Info size={15} />
                </div>
              )}
            </div>

            {/* Message Body */}
            <div className="flex-1 min-w-0 pr-1">
              <p className="text-xs font-semibold leading-relaxed tracking-wide break-words">
                {t.message}
              </p>
            </div>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </aside>
    </ToastContext.Provider>
  );
}


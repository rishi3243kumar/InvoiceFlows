'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          
          let borderColor = 'var(--primary-cyan)';
          let bgColor = 'rgba(6, 182, 212, 0.15)';
          let shadow = 'var(--cyan-glow)';
          let icon = '🪐';

          if (isSuccess) {
            borderColor = '#10b981';
            bgColor = 'rgba(16, 185, 129, 0.15)';
            shadow = '0 0 15px rgba(16, 185, 129, 0.3)';
            icon = '⭐';
          } else if (isError) {
            borderColor = '#ef4444';
            bgColor = 'rgba(239, 68, 68, 0.15)';
            shadow = '0 0 15px rgba(239, 68, 68, 0.3)';
            icon = '☄️';
          }

          return (
            <div
              key={toast.id}
              style={{
                padding: '1rem 1.5rem',
                borderRadius: '1rem',
                border: `1px solid ${borderColor}`,
                background: bgColor,
                color: '#ffffff',
                boxShadow: shadow,
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                animation: 'slideIn 0.3s ease forwards',
                pointerEvents: 'auto',
                minWidth: '300px',
                fontSize: '0.9rem',
                fontWeight: 500,
              }}
            >
              <span>{icon}</span>
              <div>{toast.message}</div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

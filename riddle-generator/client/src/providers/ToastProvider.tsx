"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastType } from '@/components/atoms/Toast/Toast';

interface ToastContextType {
  showGlobalToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: ToastType }>({
    isVisible: false, message: '', type: 'success'
  });

  const showGlobalToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ isVisible: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showGlobalToast }}>
      {children}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
};

export const useGlobalToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useGlobalToast must be used within ToastProvider');
  return context;
};
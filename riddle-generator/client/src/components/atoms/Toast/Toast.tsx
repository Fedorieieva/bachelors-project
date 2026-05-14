"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Typography } from '@/components/atoms/Typography/Typography';
import CheckIcon from '@/assets/check-icon.svg';
import ErrorIcon from '@/assets/circle-x-icon.svg';
import { AlertTriangle } from 'lucide-react';
import styles from './Toast.module.scss';

export type ToastType = 'success' | 'error' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

function getIcon(type: ToastType, iconClass: string) {
  if (type === 'success') return <CheckIcon className={iconClass} />;
  if (type === 'warning') return <AlertTriangle size={20} className={iconClass} />;
  return <ErrorIcon className={iconClass} />;
}

export const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 10000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={cn(styles.toast, styles[type])}
        >
          {getIcon(type, styles.icon)}
          <Typography variant="details">
            {message}
          </Typography>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
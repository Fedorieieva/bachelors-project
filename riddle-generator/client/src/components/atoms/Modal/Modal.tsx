"use client";

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Button } from '@/components/atoms/Button/Button';
import { X } from 'lucide-react';
import styles from './Modal.module.scss';
import { useTranslations } from 'next-intl';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  hideCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  hideCloseButton = false,
}) => {
  const tm = useTranslations('modal');
  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  const contentVariants = {
    closed: { opacity: 0, scale: 0.9, y: 20 },
    open: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal forceMount>
        <AnimatePresence>
          {isOpen && (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  className={styles.overlay}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={overlayVariants}
                />
              </Dialog.Overlay>

              <div className={styles.contentWrapper}>
                <Dialog.Content asChild>
                  <motion.div
                    className={cn(styles.content, className)}
                    initial="closed"
                    animate="open"
                    exit="exit"
                    variants={contentVariants}
                  >
                    {!title && (
                      <VisuallyHidden.Root>
                        <Dialog.Title>{tm('dialogTitle')}</Dialog.Title>
                      </VisuallyHidden.Root>
                    )}

                    <div className={styles.header}>
                      {hideCloseButton ? (
                        <div />
                      ) : (
                        <Dialog.Close asChild>
                          <Button variant="icon-only" size="auto" className={styles.closeBtn}>
                            <X size={24} />
                          </Button>
                        </Dialog.Close>
                      )}
                    </div>

                    <div className={styles.body}>
                      {title && (
                        <Dialog.Title asChild>
                          <div className={styles.titleWrapper}>
                            <Typography variant="h2">
                              {title}
                            </Typography>
                          </div>
                        </Dialog.Title>
                      )}
                      {children}
                    </div>
                  </motion.div>
                </Dialog.Content>
              </div>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
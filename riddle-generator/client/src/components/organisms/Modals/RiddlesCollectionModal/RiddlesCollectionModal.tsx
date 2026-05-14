'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/atoms/Modal/Modal';
import { VisibilityToggle } from '@/components/molecules/VisibilityToggle/VisibilityToggle';
import SaveIcon from '@/assets/save-icon.svg';
import styles from './RiddlesCollectionModal.module.scss';
import { RiddleMessageItem } from '@/hooks/riddles/useRiddleMessages';
import { ChatMessageItem } from '@/components/organisms/Chat/ChatMessageItem/ChatMessageItem';
import { Message, RiddleSettings } from '@/types/riddle';
import TrashIcon from '@/assets/trash-icon.svg';
import { Button } from '@/components/atoms/Button/Button';
import { Typography } from '@/components/atoms/Typography/Typography';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface RiddleCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  riddleMessages: RiddleMessageItem[];
  onSave: (messageId: string) => void;
  onTogglePublic: (riddleId: string) => void;
  onDelete: (riddleId: string) => void;
  isSaving?: boolean;
  isTogglingPublic?: boolean;
  isDeleting?: boolean;
}

const EMPTY_SETTINGS = {} as RiddleSettings;

export const RiddleCollectionModal: React.FC<RiddleCollectionModalProps> = ({
  isOpen,
  onClose,
  riddleMessages,
  onSave,
  onTogglePublic,
  onDelete,
  isSaving,
  isTogglingPublic,
  isDeleting,
}) => {
  const t = useTranslations('riddlesCollectionModal');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('title')}>
      <div className={styles.scrollContainer}>
        <div className={styles.modalContent}>
          {riddleMessages.length === 0 && (
            <p className={styles.emptyState}>{t('empty')}</p>
          )}

          {riddleMessages.map((item, index) => {
            const msg: Message = {
              id: item.id,
              chat_id: '',
              role: 'model',
              content: item.content,
              is_initial: true,
              createdAt: item.createdAt,
            };

            let displayContent = item.content;
            try {
              const parsed = JSON.parse(item.content);
              if (parsed?.content) displayContent = parsed.content;
            } catch {}

            const isSaved = !!item.savedRiddle;
            const isConfirming = confirmDeleteId === item.savedRiddle?.id;

            return (
              <div key={item.id} className={styles.riddleWrapper}>
                <ChatMessageItem
                  msg={msg}
                  isLast={false}
                  isSending={false}
                  displayContent={displayContent}
                  onRegenerate={() => {}}
                  isRegenerating={false}
                  currentSettings={EMPTY_SETTINGS}
                  fullWidth
                />

                <div className={cn(styles.riddleFooter)}>
                  {isSaved ? (
                    <div className={styles.footerActions}>
                      {isConfirming ? (
                        <div className={styles.confirmInline}>
                          <Typography variant="details" className={styles.confirmText}>
                            {t('deleteConfirmText')}
                          </Typography>
                          <Button
                            variant="simple"
                            size="auto"
                            onClick={() => setConfirmDeleteId(null)}
                            className={styles.cancelBtn}
                          >
                            {t('cancel')}
                          </Button>
                          <Button
                            variant="primary"
                            size="auto"
                            onClick={() => {
                              onDelete(item.savedRiddle!.id);
                              setConfirmDeleteId(null);
                            }}
                            isLoading={isDeleting}
                            className={styles.deleteBtn}
                          >
                            {t('delete')}
                          </Button>
                        </div>
                      ) : (
                        <>
                          <VisibilityToggle
                            isPublic={item.savedRiddle!.is_public}
                            onClick={() =>
                              !isTogglingPublic && onTogglePublic(item.savedRiddle!.id)
                            }
                          />
                          <Button
                            variant="icon-only"
                            onClick={() => setConfirmDeleteId(item.savedRiddle!.id)}
                            className={styles.trashBtn}
                          >
                            <TrashIcon className={styles.deleteIcon} />
                          </Button>
                        </>
                      )}
                    </div>
                  ) : (
                    <button
                      className={styles.saveButton}
                      onClick={() => !isSaving && onSave(item.id)}
                      disabled={isSaving}
                      type="button"
                    >
                      <SaveIcon className={styles.saveIcon} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
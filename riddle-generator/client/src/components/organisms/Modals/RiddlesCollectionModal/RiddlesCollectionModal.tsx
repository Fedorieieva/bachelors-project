import React from 'react';
import { Modal } from '@/components/atoms/Modal/Modal';
import { VisibilityToggle } from '@/components/molecules/VisibilityToggle/VisibilityToggle';
import SaveIcon from '@/assets/save-icon.svg';
import styles from './RiddlesCollectionModal.module.scss';
import { RiddleMessageItem } from '@/hooks/riddles/useRiddleMessages';
import { ChatMessageItem } from '@/components/organisms/Chat/ChatMessageItem/ChatMessageItem';
import { Message, RiddleSettings } from '@/types/riddle';

interface RiddleCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  riddleMessages: RiddleMessageItem[];
  onSave: (messageId: string) => void;
  onTogglePublic: (riddleId: string) => void;
  isSaving?: boolean;
  isTogglingPublic?: boolean;
}

const EMPTY_SETTINGS = {} as RiddleSettings;

export const RiddleCollectionModal: React.FC<RiddleCollectionModalProps> = ({
  isOpen,
  onClose,
  riddleMessages,
  onSave,
  onTogglePublic,
  isSaving,
  isTogglingPublic,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generated Riddles">
      <div className={styles.scrollContainer}>
        <div className={styles.modalContent}>
          {riddleMessages.length === 0 && (
            <p className={styles.emptyState}>Загадок ще немає</p>
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

            return (
              <div key={item.id} className={styles.riddleWrapper}>
                <ChatMessageItem
                  msg={msg}
                  index={index}
                  isLast={false}
                  isSending={false}
                  displayContent={displayContent}
                  onRegenerate={() => {}}
                  isRegenerating={false}
                  currentSettings={EMPTY_SETTINGS}
                  fullWidth
                />

                <div className={styles.riddleFooter}>
                  {!isSaved ? (
                    <button
                      className={styles.saveButton}
                      onClick={() => !isSaving && onSave(item.id)}
                      disabled={isSaving}
                      type="button"
                    >
                      <SaveIcon className={styles.saveIcon} />
                    </button>
                  ) : (
                    <VisibilityToggle
                      isPublic={item.savedRiddle!.is_public}
                      onClick={() =>
                        !isTogglingPublic && onTogglePublic(item.savedRiddle!.id)
                      }
                    />
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
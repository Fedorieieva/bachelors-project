import React from 'react';
import { Modal } from '@/components/atoms/Modal/Modal';
import { Message, SavedRiddle } from '@/types/riddle';
import { Button } from '@/components/atoms/Button/Button';
import { VisibilityToggle } from '@/components/molecules/VisibilityToggle/VisibilityToggle';
import SaveIcon from '@/assets/save-icon.svg';

interface RiddleCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onSave: (messageId: string) => void;
  onTogglePublic: (riddleId: string) => void;
  savedRiddlesMap: Record<string, SavedRiddle | undefined>;
}

export const RiddleCollectionModal: React.FC<RiddleCollectionModalProps> = ({
  isOpen,
  onClose,
  messages,
  onSave,
  onTogglePublic,
  savedRiddlesMap,
}) => {
  const riddleMessages = messages.filter(m => m.is_initial && m.role === 'model');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generated Riddles">
      <div>
        {riddleMessages.map((msg) => {
          const savedData = savedRiddlesMap[msg.id];

          return (
            <div key={msg.id}>
              <div>
                {msg.content.substring(0, 100)}...
              </div>

              <div>
                {!savedData ? (
                  <Button
                    size="sm"
                    onClick={() => onSave(msg.id)}
                    icon={<SaveIcon />}
                  >
                    Save to Collection
                  </Button>
                ) : (
                  <div>
                    <span>Saved!</span>
                    <VisibilityToggle
                      isPublic={savedData.is_public}
                      onClick={() => onTogglePublic(savedData.id)}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
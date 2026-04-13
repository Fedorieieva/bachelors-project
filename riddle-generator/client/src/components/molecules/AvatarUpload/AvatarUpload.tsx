"use client";

import React, { useRef } from 'react';
import { Avatar } from '@/components/atoms/Avatar/Avatar';
import { Button } from '@/components/atoms/Button/Button';
import { useCloudinary } from '@/hooks/utils/useCloudinary';
import styles from './AvatarUpload.module.scss';

interface AvatarUploadProps {
  currentUrl: string | null;
  userName: string;
  onUploadSuccess: (url: string) => void;
  onDelete: () => void;
  onError: (message: string) => void;
  isLoading?: boolean;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentUrl,
  userName,
  onUploadSuccess,
  onDelete,
  onError,
  isLoading
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, isUploading } = useCloudinary();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadImage(file);
        onUploadSuccess(url);
      } catch (err) {
        onError("Failed to upload image to Cloudinary");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={styles.container}>
      <Avatar userName={userName} avatarUrl={currentUrl} size="lg" />
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" hidden />

      <div className={styles.actions}>
        <Button
          variant="colored-glass"
          onClick={() => fileInputRef.current?.click()}
          isLoading={isUploading || isLoading}
        >
          Change Avatar
        </Button>

        {currentUrl && (
          <Button
            variant="grey-glass-link"
            className={styles.deleteBtn}
            onClick={onDelete}
            disabled={isUploading || isLoading}
          >
            Remove Photo
          </Button>
        )}
      </div>
    </div>
  );
};
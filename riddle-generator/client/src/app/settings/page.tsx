"use client";

import React, { useState } from 'react';
import { UserService } from '@/services/users/user.service';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Input } from '@/components/atoms/Input/Input';
import { Button } from '@/components/atoms/Button/Button';
import { AvatarUpload } from '@/components/molecules/AvatarUpload/AvatarUpload';
import { Toast, ToastType } from '@/components/atoms/Toast/Toast';
import styles from './SettingsPage.module.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import { apiClient } from '@/lib/api-client';
import { UserProfile } from '@/types/user';
import { ConfirmModal } from '@/components/organisms/Modals/ConfirmModal/ConfirmModal';

interface UserStatsCache {
  profile: UserProfile;
  [key: string]: unknown;
}

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { user } = useAppSelector(state => state.auth);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState<boolean>(false);

  const [name, setName] = useState<string>(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar_url || null);
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success' as ToastType
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: { name?: string; avatar_url: string | null }) =>
      UserService.updateProfile(user!.id, data),
    onSuccess: (updatedUser: UserProfile) => {
      dispatch(updateUser(updatedUser));

      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      queryClient.setQueryData<UserStatsCache>(['user-stats', 'me'], (oldData) => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          profile: updatedUser
        };
      });

      showToast("Profile updated successfully!", "success");
    },
    onError: () => showToast("Error updating profile", "error")
  });

  const showToast = (message: string, type: ToastType): void => {
    setToast({ isVisible: true, message, type });
  };

  const extractPublicId = (url: string): string | undefined => {
    const parts = url.split('/');
    const fileName = parts.pop()?.split('.')[0];
    const uploadIndex = parts.indexOf('upload');

    if (uploadIndex === -1) return fileName;

    const folder = parts.slice(uploadIndex + 2).join('/');
    return folder ? `${folder}/${fileName}` : fileName;
  };

  const handleAvatarUpload = async (newUrl: string): Promise<void> => {
    setAvatarUrl(newUrl);
    await updateProfileMutation.mutateAsync({ name, avatar_url: newUrl });
  };

  const handleAvatarDelete = async (): Promise<void> => {
    if (!avatarUrl) return;

    try {
      const publicId = extractPublicId(avatarUrl);
      if (!publicId) throw new Error("Invalid publicId");

      await apiClient.delete(`/upload/remove`, { params: { publicId } });

      await updateProfileMutation.mutateAsync({
        name: name,
        avatar_url: null
      });

      setAvatarUrl(null);
    } catch (err) {
      showToast("Failed to remove image from storage", "error");
    }
  };

  const handleSaveChanges = (): void => {
    updateProfileMutation.mutate({ name, avatar_url: avatarUrl });
  };

  const handleConfirmDeleteAccount = async (): Promise<void> => {
    setIsDeletingAccount(true);
    try {
      showToast("Account queued for deletion.", "success");
    } catch (err) {
      showToast("Failed to delete account.", "error");
    } finally {
      setIsDeletingAccount(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Typography variant="h1" className={styles.title}>Settings</Typography>

        <section className={styles.section}>
          <AvatarUpload
            userName={user?.name || 'User'}
            currentUrl={avatarUrl}
            onUploadSuccess={handleAvatarUpload}
            onDelete={handleAvatarDelete}
            onError={(msg) => showToast(msg, 'error')}
            isLoading={updateProfileMutation.isPending}
          />

          <div className={styles.form}>
            <Input
              label="Display Name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              fullWidth
            />
            <Input
              label="Email"
              value={user?.email || ''}
              disabled
              fullWidth
              helperText="Email cannot be changed"
            />

            <Button
              variant="primary-glow"
              size="full"
              onClick={handleSaveChanges}
              isLoading={updateProfileMutation.isPending}
              className={styles.saveBtn}
              disabled={name === user?.name && avatarUrl === user?.avatar_url}
            >
              Save Changes
            </Button>
          </div>
        </section>

        <hr className={styles.divider} />

        <section className={styles.dangerZone}>
          <Typography variant="h3" className={styles.dangerTitle}>Danger Zone</Typography>
          <Button
            variant="grey-glass-link"
            className={styles.deleteBtn}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete Account
          </Button>
        </section>
      </div>

      <Toast
        {...toast}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDeleteAccount}
        title="Delete Your Account?"
        description="Are you absolutely sure? This action is permanent and will delete all your generators, results, and settings."
        confirmText="Delete My Account"
        cancelText="No, Keep It"
        variant="danger"
        isLoading={isDeletingAccount}
      />
    </div>
  );
}
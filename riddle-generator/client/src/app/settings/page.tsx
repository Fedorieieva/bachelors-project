"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslations } from 'next-intl';
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
import { AxiosError } from 'axios';

interface UserStatsCache {
  profile: UserProfile;
  [key: string]: unknown;
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
const nameRegex = /^[\p{L}\p{N} _-]+$/u;

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const t = useTranslations('settings');

  useEffect(() => {
    if (!isAuthenticated || user?.is_guest) {
      router.replace('/login');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.is_guest) return null;
  const tv = useTranslations('validation');
  const tt = useTranslations('toasts');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar_url || null);
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success' as ToastType
  });

  const showToast = (message: string, type: ToastType): void => {
    setToast({ isVisible: true, message, type });
  };

  const profileSchema = useMemo(() => Yup.object().shape({
    name: Yup.string()
      .min(2, tv('nameMin'))
      .max(50, tv('nameMax'))
      .matches(nameRegex, tv('namePattern'))
      .required(tv('nameDisplayRequired')),
  }), [tv]);

  const changePasswordSchema = useMemo(() => Yup.object().shape({
    currentPassword: Yup.string().required(tv('currentPasswordRequired')),
    newPassword: Yup.string()
      .min(8, tv('newPasswordMin'))
      .matches(passwordRegex, tv('newPasswordComplexity'))
      .required(tv('newPasswordRequired')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], tv('confirmPasswordMatch'))
      .required(tv('confirmPasswordRequired')),
  }), [tv]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: { name?: string; avatar_url: string | null }) =>
      UserService.updateProfile(user!.id, data),
    onSuccess: (updatedUser: UserProfile) => {
      dispatch(updateUser(updatedUser));
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      queryClient.setQueryData<UserStatsCache>(['user-stats', 'me'], (oldData) => {
        if (!oldData) return undefined;
        return { ...oldData, profile: updatedUser };
      });
      showToast(tt('profileUpdated'), 'success');
    },
    onError: () => showToast(tt('profileUpdateError'), 'error'),
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      UserService.changePassword(data),
    onSuccess: () => showToast(tt('passwordChanged'), 'success'),
    onError: (error: AxiosError<{ message: string }>) => {
      const msg = error.response?.data?.message || tt('passwordChangeFailed');
      showToast(msg, 'error');
    },
  });

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
    await updateProfileMutation.mutateAsync({ name: user?.name || '', avatar_url: newUrl });
  };

  const handleAvatarDelete = async (): Promise<void> => {
    if (!avatarUrl) return;
    try {
      const publicId = extractPublicId(avatarUrl);
      if (!publicId) throw new Error('Invalid publicId');
      await apiClient.delete(`/upload/remove`, { params: { publicId } });
      await updateProfileMutation.mutateAsync({ name: user?.name || '', avatar_url: null });
      setAvatarUrl(null);
    } catch {
      showToast(tt('avatarRemoveError'), 'error');
    }
  };

  const handleConfirmDeleteAccount = async (): Promise<void> => {
    setIsDeletingAccount(true);
    try {
      showToast(tt('accountDeleted'), 'success');
    } catch {
      showToast(tt('accountDeleteError'), 'error');
    } finally {
      setIsDeletingAccount(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Typography variant="h1" className={styles.title}>{t('title')}</Typography>

        <section className={styles.section}>
          <AvatarUpload
            userName={user?.name || 'User'}
            currentUrl={avatarUrl}
            onUploadSuccess={handleAvatarUpload}
            onDelete={handleAvatarDelete}
            onError={(msg) => showToast(msg, 'error')}
            isLoading={updateProfileMutation.isPending}
          />

          <Formik
            initialValues={{ name: user?.name || '' }}
            validationSchema={profileSchema}
            onSubmit={(values) => {
              updateProfileMutation.mutate({ name: values.name, avatar_url: avatarUrl });
            }}
          >
            {({ errors, touched, handleChange, handleBlur, values, isValid }) => (
              <Form className={styles.form}>
                <Input
                  name="name"
                  label={t('displayName')}
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && errors.name ? errors.name : undefined}
                  maxLength={50}
                  fullWidth
                />
                <Input
                  label={t('email')}
                  value={user?.email || ''}
                  disabled
                  fullWidth
                  helperText={t('emailCannotChange')}
                />
                <Button
                  type="submit"
                  variant="primary-glow"
                  size="full"
                  isLoading={updateProfileMutation.isPending}
                  className={styles.saveBtn}
                  disabled={(values.name === user?.name && avatarUrl === user?.avatar_url) || !isValid}
                >
                  {t('saveChanges')}
                </Button>
              </Form>
            )}
          </Formik>
        </section>

        <hr className={styles.divider} />

        {!user?.is_guest && (
          <>
            <section className={styles.section}>
              <Typography variant="h3">{t('changePassword')}</Typography>

              <Formik
                initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
                validationSchema={changePasswordSchema}
                onSubmit={(values, { resetForm }) => {
                  changePasswordMutation.mutate(
                    { currentPassword: values.currentPassword, newPassword: values.newPassword },
                    { onSuccess: () => resetForm() }
                  );
                }}
              >
                {({ errors, touched, handleChange, handleBlur, values }) => (
                  <Form className={styles.form}>
                    <Input
                      name="currentPassword"
                      label={t('currentPassword')}
                      type="password"
                      value={values.currentPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.currentPassword && errors.currentPassword ? errors.currentPassword : undefined}
                      fullWidth
                    />
                    <Input
                      name="newPassword"
                      label={t('newPassword')}
                      type="password"
                      value={values.newPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.newPassword && errors.newPassword ? errors.newPassword : undefined}
                      fullWidth
                    />
                    <Input
                      name="confirmPassword"
                      label={t('confirmNewPassword')}
                      type="password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
                      fullWidth
                    />
                    <Button
                      type="submit"
                      variant="primary-glow"
                      size="full"
                      isLoading={changePasswordMutation.isPending}
                      className={styles.saveBtn}
                    >
                      {t('changePassword')}
                    </Button>
                  </Form>
                )}
              </Formik>
            </section>

            <hr className={styles.divider} />
          </>
        )}

        <section className={styles.dangerZone}>
          <Typography variant="h3" className={styles.dangerTitle}>{t('dangerZone')}</Typography>
          <Button
            variant="grey-glass-link"
            className={styles.deleteBtn}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            {t('deleteAccount')}
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
        title={t('deleteAccountTitle')}
        description={t('deleteAccountDesc')}
        confirmText={t('deleteAccountConfirm')}
        cancelText={t('deleteAccountCancel')}
        variant="danger"
        isLoading={isDeletingAccount}
      />
    </div>
  );
}

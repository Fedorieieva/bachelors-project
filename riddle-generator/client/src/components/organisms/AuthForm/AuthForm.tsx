"use client";

import React, { useMemo } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from './AuthForm.module.scss';
import { Input } from '@/components/atoms/Input/Input';
import { Button } from '@/components/atoms/Button/Button';
import { useLogin, useRegister } from '@/hooks/users/useAuth';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const nameRegex = /^[\p{L}\p{N} _-]+$/u;

interface AuthFormProps {
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onModeChange }) => {
  const ta = useTranslations('auth');
  const tv = useTranslations('validation');
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const isLogin = mode === 'login';

  const loginSchema = useMemo(() => Yup.object().shape({
    email: Yup.string()
      .matches(emailRegex, tv('emailInvalid'))
      .required(tv('emailRequired')),
    password: Yup.string()
      .required(tv('passwordRequired')),
  }), [tv]);

  const registerSchema = useMemo(() => loginSchema.shape({
    name: Yup.string()
      .min(2, tv('nameTooShort'))
      .max(50, tv('nameTooLong'))
      .matches(nameRegex, tv('nameInvalidChars'))
      .required(tv('nameRequired')),
  }), [loginSchema, tv]);

  const springTransition = {
    type: 'spring',
    stiffness: 150,
    damping: 25,
    mass: 1.2
  } as const;

  const collapseToCenterTransition = {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1] as const,
  };

  const collapsableContainerVariants: Variants = {
    hidden: {
      height: 0,
      opacity: 0,
      marginBottom: 0,
      transition: springTransition
    },
    visible: {
      height: 'auto',
      opacity: 1,
      marginBottom: 28,
      transition: {
        ...springTransition,
        when: "beforeChildren",
      }
    },
    exit: {
      height: 0,
      marginBottom: 0,
      transition: {
        ...springTransition,
        when: "afterChildren",
        stiffness: 200,
        damping: 30
      }
    }
  };

  const inputScaleVariants: Variants = {
    hidden: {
      scaleY: 0,
      opacity: 0,
      originY: 0.5,
    },
    visible: {
      scaleY: 1,
      opacity: 1,
      originY: 0.5,
      transition: collapseToCenterTransition,
    },
    exit: {
      scaleY: [1, 0],
      opacity: [1, 0],
      originY: 0.5,
      transition: {
        ...collapseToCenterTransition,
        times: [0, 1],
      }
    }
  };

  return (
    <div className={styles.authCard}>
      <div className={styles.tabs}>
        <Button
          variant={mode === 'register' ? 'colored-glass-active' : 'colored-glass-inactive'}
          onClick={() => onModeChange('register')}
          className={styles.tabBtn}
          size="auto"
        >
          {ta('signUp')}
        </Button>
        <Button
          variant={mode === 'login' ? 'colored-glass-active' : 'colored-glass-inactive'}
          onClick={() => onModeChange('login')}
          className={styles.tabBtn}
          size="auto"
        >
          {ta('signIn')}
        </Button>
      </div>

      <Formik
        initialValues={{ email: '', password: '', name: '' }}
        validationSchema={isLogin ? loginSchema : registerSchema}
        onSubmit={(values) => {
          if (isLogin) {
            loginMutation.mutate({ email: values.email, password: values.password });
          } else {
            registerMutation.mutate(values);
          }
        }}
      >
        {({ errors, touched, handleChange, handleBlur, values, isValid }) => (
          <Form className={styles.form}>
            <AnimatePresence initial={false} mode="sync">
              {!isLogin && (
                <motion.div
                  key="name-field"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={collapsableContainerVariants}
                  className={styles.collapsableContainer}
                >
                  <motion.div
                    variants={inputScaleVariants}
                    className={styles.inputWrapper}
                  >
                    <Input
                      name="name"
                      label={ta('nameLabel')}
                      placeholder={ta('namePlaceholder')}
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && errors.name ? errors.name : undefined}
                      maxLength={50}
                      fullWidth
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={styles.stableField}>
              <Input
                name="email"
                label={ta('emailLabel')}
                placeholder={ta('emailPlaceholder')}
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email ? errors.email : undefined}
                fullWidth
              />
            </div>

            <div className={styles.stableField}>
              <Input
                name="password"
                label={ta('passwordLabel')}
                placeholder={ta('passwordPlaceholder')}
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && errors.password ? errors.password : undefined}
                fullWidth
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size='full'
              className={styles.submitBtn}
              isLoading={loginMutation.isPending || registerMutation.isPending}
              disabled={!isValid || loginMutation.isPending || registerMutation.isPending}
            >
              {isLogin ? ta('signInBtn') : ta('createAccount')}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

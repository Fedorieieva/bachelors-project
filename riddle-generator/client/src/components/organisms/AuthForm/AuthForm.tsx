"use client";

import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AuthForm.module.scss';
import { Input } from '@/components/atoms/Input/Input';
import { Button } from '@/components/atoms/Button/Button';
import { useLogin, useRegister } from '@/hooks/users/useAuth';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .matches(emailRegex, 'Введіть коректний email (наприклад, example@mail.com)')
    .required('Електронна пошта обов’язкова'),
  password: Yup.string()
    .min(8, 'Пароль має містити мінімум 8 символів')
    .matches(
      passwordRegex,
      'Пароль має містити хоча б одну велику літеру, одну малу літеру та одну цифру'
    )
    .required('Пароль обов’язковий'),
});

const registerSchema = loginSchema.shape({
  name: Yup.string()
    .min(2, 'Ім’я занадто коротке')
    .required('Ім’я обов’язкове'),
});

interface AuthFormProps {
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onModeChange }) => {
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const isLogin = mode === 'login';

  const springTransition = {
    type: 'spring',
    stiffness: 150,
    damping: 25,
    mass: 1.2
  };

  const collapseToCenterTransition = {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  };

  const collapsableContainerVariants = {
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

  const inputScaleVariants = {
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
          Sign Up
        </Button>
        <Button
          variant={mode === 'login' ? 'colored-glass-active' : 'colored-glass-inactive'}
          onClick={() => onModeChange('login')}
          className={styles.tabBtn}
          size="auto"
        >
          Sign In
        </Button>
      </div>

      <Formik
        initialValues={{ email: 'user@example.com', password: 'securePassword123', name: '' }}
        validationSchema={isLogin ? loginSchema : registerSchema}
        onSubmit={(values) => {
          if (isLogin) {
            loginMutation.mutate({ email: values.email, password: values.password });
          } else {
            registerMutation.mutate(values);
          }
        }}
      >
        {({ errors, touched, handleChange, handleBlur, values }) => (
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
                      label="Enter your name"
                      placeholder="Name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && errors.name ? errors.name : undefined}
                      fullWidth
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={styles.stableField}>
              <Input
                name="email"
                label="Enter your email"
                placeholder="Email"
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
                label="Enter your password"
                placeholder="Password"
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
            >
              {isLogin ? 'Sign in' : 'Create account'}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
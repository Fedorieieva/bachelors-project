"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AuthForm } from '@/components/organisms/AuthForm/AuthForm';
import { Logo } from '@/components/atoms/Logo/Logo';
import styles from './AuthPage.module.scss';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [distance, setDistance] = useState(275);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width >= 1200) {
        setDistance((650 - 100) / 2);
      } else {
        setDistance(0);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const springTransition = {
    type: 'spring',
    stiffness: 100,
    damping: 20,
    mass: 1,
  };

  const formVariants = {
    login: {
      x: distance,
      zIndex: 2,
      transition: springTransition,
    },
    register: {
      x: -distance,
      zIndex: 2,
      transition: springTransition,
    },
  };

  const visualVariants = {
    login: {
      x: -distance,
      zIndex: 1,
      transition: springTransition,
    },
    register: {
      x: distance,
      zIndex: distance > 0 ? 2 : 1,
      transition: springTransition,
    },
  };

  return (
    <main className={styles.container}>
      <Logo className={styles.logo}/>

      <div className={styles.contentWrapper}>
        <div className={styles.mainContent}>

          <motion.div
            className={cn(styles.motionBlock, styles.visualSide)}
            animate={mode}
            variants={visualVariants}
            initial={false}
          >
            <Image
              src="/futuristic_puzzle.png"
              alt="Futuristic AI Puzzle"
              width={673}
              height={673}
              priority
            />
          </motion.div>

          <motion.div
            className={cn(styles.motionBlock, styles.formSide)}
            animate={mode}
            variants={formVariants}
            initial={false}
          >
            <AuthForm mode={mode} onModeChange={setMode} />
          </motion.div>

        </div>
      </div>
    </main>
  );
}
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Typography } from '@/components/atoms/Typography';
import { cn } from '@/lib/utils';
import ChevronIcon from '@/assets/chevron-down-icon.svg';
import styles from './Select.module.scss';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export const Select: React.FC<SelectProps> = ({ options, value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.wrapper} ref={selectRef}>
      {label && <Typography variant="details" className={styles.label}>{label}</Typography>}

      <div
        className={cn(styles.selectHead, { [styles.open]: isOpen })}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Typography variant="body">{selectedOption?.label}</Typography>
        <ChevronIcon className={cn(styles.chevron, { [styles.rotate]: isOpen })} />
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {options.map((opt) => (
            <div
              key={opt.value}
              className={cn(styles.option, { [styles.selected]: opt.value === value })}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              <Typography variant="body">{opt.label}</Typography>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
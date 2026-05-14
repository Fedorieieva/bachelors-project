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
      if (event.target instanceof Node && selectRef.current && !selectRef.current.contains(event.target)) {
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
        role="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={0}
        className={cn(styles.selectHead, { [styles.open]: isOpen })}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen(!isOpen); } }}
      >
        <Typography variant="body">{selectedOption?.label}</Typography>
        <ChevronIcon className={cn(styles.chevron, { [styles.rotate]: isOpen })} />
      </div>

      {isOpen && (
        <div role="listbox" className={styles.dropdown}>
          {options.map((opt) => (
            <div
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              tabIndex={0}
              className={cn(styles.option, { [styles.selected]: opt.value === value })}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(opt.value); setIsOpen(false); } }}
            >
              <Typography variant="body">{opt.label}</Typography>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
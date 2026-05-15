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

const visuallyHidden: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0,
};

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

      <select
        style={visuallyHidden}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={cn(styles.selectHead, { [styles.open]: isOpen })}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Typography variant="body">{selectedOption?.label}</Typography>
        <ChevronIcon className={cn(styles.chevron, { [styles.rotate]: isOpen })} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={opt.value === value}
              className={cn(styles.option, { [styles.selected]: opt.value === value })}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onChange(opt.value);
                  setIsOpen(false);
                }
              }}
            >
              <Typography variant="body">{opt.label}</Typography>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

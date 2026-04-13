import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Typography } from '../Typography';
import styles from './Input.module.scss';

export type InputVariant = 'form' | 'multiline';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: InputVariant;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  isTransparent?: boolean;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({
     className,
     variant = 'form',
     fullWidth,
     label,
     error,
     helperText,
     icon,
     isTransparent,
     value,
     ...props
   }, ref) => {
    const isMultiline = variant === 'multiline';
    const isError = !!error;
    const isDisabled = !!props.disabled;
    const inputValue = value ?? '';

    return (
      <div className={cn(
        styles.inputWrapper,
        fullWidth && styles.fullWidth,
        isMultiline ? styles.multilineGap : styles.formGap
      )}>
        {label && (
          <span className={styles.label}>
            {label}
          </span>
        )}

        <div className={cn(
          styles.inputContainer,
          styles[variant],
          isError && styles.error,
          isDisabled && styles.disabled,
          isTransparent && styles.transparent
        )}>
          {isMultiline ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              className={cn(styles.baseInput, className)}
              value={inputValue}
              {...props}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              className={cn(styles.baseInput, className)}
              value={inputValue}
              {...props}
            />
          )}

          {icon && (
            <div className={styles.iconWrapper}>
              {icon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <Typography
            variant={isError ? 'details-error' : 'details'}
            className={cn(styles.helperText, isError && styles.errorText)}
          >
            {error || helperText}
          </Typography>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
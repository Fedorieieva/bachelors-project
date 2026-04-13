"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Typography } from '@/components/atoms/Typography';
import styles from './Button.module.scss';

export type ButtonVariant =
  | 'primary'
  | 'primary-glow'
  | 'colored-glass'
  | 'colored-glass-active'
  | 'colored-glass-inactive'
  | 'grey-glass-link'
  | 'grey-glass-tab'
  | 'icon-only'
  | 'simple'
  | 'simple-tab';

export type ButtonSize = 'default' | 'full' | 'auto';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  fullWidth?: boolean;
  href?: string;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size,
  isLoading = false,
  leftIcon,
  children,
  disabled,
  fullWidth = false,
  href,
  ...props
}) => {
  const finalSize: ButtonSize = size ?? (fullWidth ? 'full' : 'default');

  const variantClasses: Record<ButtonVariant, string> = {
    'primary': styles.primary,
    'primary-glow': styles.primaryGlow,
    'colored-glass': styles.coloredGlass,
    'colored-glass-active': styles.coloredGlassActive,
    'colored-glass-inactive': styles.coloredGlassInactive,
    'grey-glass-link': styles.greyGlassLink,
    'grey-glass-tab': styles.greyGlassTab,
    'icon-only': styles.iconOnly,
    'simple': styles.simple,
    'simple-tab': styles.simpleTab,
  };

  const sizeClasses: Record<ButtonSize, string> = {
    'default': styles.sizeDefault,
    'full': styles.sizeFull,
    'auto': styles.sizeAuto,
  };

  const getTypographyVariant = () => {
    if (variant.includes('colored-glass')) return 'h3';
    if (variant.includes('grey-glass') || variant.includes('simple')) return 'body';
    return 'btn-primary';
  };

  const content = (
    <>
      {isLoading ? (
        <div className={styles.spinner} />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {variant !== 'icon-only' && children && (
            <Typography variant={getTypographyVariant()} as="span">
              {children}
            </Typography>
          )}
          {variant === 'icon-only' && children}
        </>
      )}
    </>
  );

  const commonClasses = cn(
    styles.button,
    variantClasses[variant],
    variant !== 'icon-only' && sizeClasses[finalSize],
    className,
    { [styles.disabled]: disabled || isLoading }
  );

  if (href) {
    return (
      <a href={href} className={commonClasses}>
        {content}
      </a>
    );
  }

  return (
    <button className={commonClasses} disabled={disabled || isLoading} {...props}>
      {content}
    </button>
  );
};
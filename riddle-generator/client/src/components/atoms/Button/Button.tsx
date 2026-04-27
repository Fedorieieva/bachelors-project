"use client";

import React, { forwardRef } from 'react';
import Link from 'next/link';
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

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
}

type HTMLButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & BaseButtonProps & { href?: never };
type HTMLLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & BaseButtonProps & { href: string };

type ButtonProps = HTMLButtonProps | HTMLLinkProps;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>((props, ref) => {
  const {
    className,
    variant = 'primary',
    size,
    isLoading = false,
    leftIcon,
    children,
    disabled,
    fullWidth = false,
    ...rest
  } = props;

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
    {
      [styles.disabled]: disabled || isLoading,
      [styles.sizeFull]: fullWidth
    }
  );

  if ('href' in rest && rest.href !== undefined) {
    const { href, ...linkProps } = rest as HTMLLinkProps;
    return (
      <Link
        href={href}
        className={commonClasses}
        ref={ref as React.Ref<HTMLAnchorElement>}
        aria-disabled={disabled || isLoading}
        {...linkProps}
      >
        {content}
      </Link>
    );
  }

  const buttonProps = rest as HTMLButtonProps;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={commonClasses}
      disabled={disabled || isLoading}
      {...buttonProps}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';
import React from 'react';
import { cn } from '@/lib/utils';
import styles from './Typography.module.scss';
import { TypographyProps, TypographyVariant } from './Typography.types';

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  children,
  className,
  as,
  style,
  ...props
}) => {
  const variantClasses: Record<TypographyVariant, string | undefined> = {
    'h1': styles.h1,
    'h2': styles.h2,
    'h3': styles.h3,
    'body': styles.body,
    'btn-primary': styles.btnPrimary,
    'caption': styles.caption,
    'caption-placeholder': styles.captionPlaceholder,
    'input-secondary': styles.inputSecondary,
    'details': styles.details,
    'details-error': styles.detailsError,
  };

  const getDefaultTag = (): React.ElementType => {
    if (variant === 'h1' || variant === 'h2' || variant === 'h3') return variant;
    if (variant === 'body') return 'p';
    return 'span';
  };

  const Component = as || getDefaultTag();

  return (
    <Component
      className={cn(variantClasses[variant], className)}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
};
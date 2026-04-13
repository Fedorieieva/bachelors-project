import React from 'react';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'btn-primary'
  | 'caption'
  | 'caption-placeholder'
  | 'input-secondary'
  | 'details'
  | 'details-error';

export interface TypographyProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}
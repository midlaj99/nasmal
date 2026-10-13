'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Breadcrumb.module.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  variant?: 'light' | 'dark' | 'glass';
  separator?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Breadcrumb({ 
  items, 
  variant = 'light', 
  separator = '>', 
  className = '', 
  style 
}: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  const containerClass = variant === 'dark' 
    ? styles.breadcrumbDark 
    : variant === 'glass'
    ? styles.breadcrumbGlass
    : styles.breadcrumb;

  return (
    <nav aria-label="Breadcrumb" className={`${containerClass} ${className}`} style={style}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isCurrent = item.active ?? isLast;

        return (
          <React.Fragment key={index}>
            {isCurrent || !item.href ? (
              <span className={styles.breadcrumbCurrent} aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className={styles.breadcrumbLink}>
                {item.label}
              </Link>
            )}

            {!isLast && (
              <span className={styles.breadcrumbSeparator} aria-hidden="true">
                {separator}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

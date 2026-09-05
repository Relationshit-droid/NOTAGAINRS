'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  border?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  tilt = false,
  hover = true,
  padding = 'md',
  border = true,
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <motion.div
      className={cn(
        'glass relative overflow-hidden',
        paddingClasses[padding],
        border && 'border border-white/30',
        className
      )}
      whileHover={hover ? { scale: 1.02 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={tilt ? { transformStyle: 'preserve-3d' } : undefined}
    >
      {children}
      {tilt && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          whileHover={{ rotateX: 5, rotateY: 5 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        />
      )}
    </motion.div>
  );
};

export default GlassCard;
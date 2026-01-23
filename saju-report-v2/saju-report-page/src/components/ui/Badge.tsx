import { motion } from 'framer-motion';
import { scaleFade, viewportOnce } from '../../animations/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  const prefersReducedMotion = useReducedMotion();

  const baseClasses = 'inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-pill';
  const variantClasses = {
    default: 'bg-card text-foreground border border-border',
    accent: 'bg-accent-light text-foreground border border-accent/30',
  };

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={prefersReducedMotion ? { hidden: {}, visible: {} } : scaleFade}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </motion.span>
  );
}

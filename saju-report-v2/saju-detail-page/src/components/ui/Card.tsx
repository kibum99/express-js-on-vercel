import { motion } from 'framer-motion';
import { cardVariant, viewportOnce } from '../../animations/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'article';
  animate?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({
  children,
  className = '',
  as: Tag = 'div',
  animate = true,
  variant = 'default',
}: CardProps) {
  const prefersReducedMotion = useReducedMotion();

  const variantClasses = {
    default: 'bg-card border border-border/60 shadow-card',
    elevated: 'bg-card shadow-md',
    outlined: 'bg-transparent border border-border',
  };

  const baseClasses = `rounded-[20px] p-5 ${variantClasses[variant]}`;

  if (!animate) {
    return (
      <Tag className={`${baseClasses} ${className}`}>
        {children}
      </Tag>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={prefersReducedMotion ? { hidden: {}, visible: {} } : cardVariant}
    >
      <Tag className={`${baseClasses} ${className}`}>
        {children}
      </Tag>
    </motion.div>
  );
}

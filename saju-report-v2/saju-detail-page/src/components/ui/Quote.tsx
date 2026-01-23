import { motion } from 'framer-motion';
import { fadeIn, viewportOnce } from '../../animations/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface QuoteProps {
  children: React.ReactNode;
  className?: string;
}

export function Quote({ children, className = '' }: QuoteProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeIn}
      className={`text-center py-6 ${className}`}
    >
      <p className="font-serif text-[20px] md:text-[22px] font-bold text-foreground leading-[1.6]">
        {children}
      </p>
    </motion.div>
  );
}

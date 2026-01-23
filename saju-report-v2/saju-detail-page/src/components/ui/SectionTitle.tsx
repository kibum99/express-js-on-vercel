import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '../../animations/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  subtitle?: string;
}

export function SectionTitle({
  children,
  className = '',
  as: Tag = 'h2',
  subtitle,
}: SectionTitleProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
      className="mb-6"
    >
      <Tag
        className={`font-serif text-[22px] md:text-[26px] font-bold text-foreground leading-[1.35] tracking-tight inline-block px-4 py-2 bg-accent/15 rounded-[12px] ${className}`}
      >
        {children}
      </Tag>
      {subtitle && (
        <p className="mt-3 text-[15px] text-muted leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

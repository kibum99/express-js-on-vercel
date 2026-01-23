import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '../../animations/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Lightbulb } from 'lucide-react';

interface CalloutProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function Callout({
  title,
  children,
  className = '',
  icon,
}: CalloutProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
      className={`bg-accent-light border border-accent/20 rounded-[20px] p-5 ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-accent mt-0.5 shrink-0">
          {icon || <Lightbulb size={20} />}
        </span>
        <div>
          <p className="font-semibold text-foreground text-[15px] mb-2">{title}</p>
          <div className="text-muted text-[14px] leading-[1.75]">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

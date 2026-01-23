import { motion } from 'framer-motion';
import { cardVariant, viewportOnce } from '../../animations/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ArrowRight } from 'lucide-react';
import type { DiffPoint as DiffPointType } from '../../types';

interface DiffPointProps {
  point: DiffPointType;
  number: number;
  className?: string;
}

export function DiffPoint({ point, number, className = '' }: DiffPointProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={prefersReducedMotion ? { hidden: {}, visible: {} } : cardVariant}
      className={`bg-card rounded-[20px] border border-border/60 shadow-card p-5 ${className}`}
    >
      {/* Number Badge */}
      <div className="flex items-center gap-3 mb-4">
        <span className="w-8 h-8 rounded-full bg-accent text-white text-[14px] font-semibold flex items-center justify-center">
          {number}
        </span>
        <h4 className="font-semibold text-foreground text-[15px]">
          {point.title}
        </h4>
      </div>

      {/* Description */}
      <p className="text-muted text-[14px] leading-[1.75] mb-4 whitespace-pre-line">
        {point.description}
      </p>

      {/* Benefit */}
      <div className="flex items-start gap-3 bg-accent-light rounded-[14px] px-4 py-3">
        <ArrowRight size={18} className="text-accent mt-0.5 shrink-0" />
        <p className="text-foreground text-[14px] leading-[1.6]">
          {point.benefit}
        </p>
      </div>
    </motion.div>
  );
}

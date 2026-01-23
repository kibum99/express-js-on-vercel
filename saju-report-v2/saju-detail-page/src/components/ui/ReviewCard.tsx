import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '../../animations/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Star, Dog, Cat } from 'lucide-react';
import type { Review } from '../../types';

interface ReviewCardProps {
  review: Review;
  className?: string;
}

const tagColors = {
  gold: 'bg-accent/10 text-accent',
  green: 'bg-emerald-50 text-emerald-600',
  blue: 'bg-sky-50 text-sky-600',
};

export function ReviewCard({ review, className = '' }: ReviewCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const PetIcon = review.petType === 'dog' ? Dog : Cat;

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
      className={`bg-card rounded-[20px] border border-border/60 shadow-card p-5 ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-11 h-11 rounded-full bg-accent-light flex items-center justify-center">
            <PetIcon size={20} className="text-accent" />
          </div>
          {/* Name & Age */}
          <div>
            <p className="font-semibold text-foreground text-[15px]">
              {review.name} <span className="font-normal text-muted">({review.age})</span>
            </p>
            {/* Stars */}
            <div className="flex items-center gap-0.5 mt-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="fill-accent text-accent" />
              ))}
            </div>
          </div>
        </div>
        {/* Tag */}
        <span className={`text-[12px] font-medium px-2.5 py-1 rounded-full ${tagColors[review.tagColor]}`}>
          {review.tag}
        </span>
      </div>

      {/* Title */}
      <p className="font-semibold text-foreground text-[15px] mb-3">
        "{review.title}"
      </p>

      {/* Content */}
      <p className="text-muted text-[14px] leading-[1.75] whitespace-pre-line">
        {review.content}
      </p>
    </motion.article>
  );
}

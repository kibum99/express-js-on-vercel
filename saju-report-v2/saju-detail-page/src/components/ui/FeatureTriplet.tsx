import { motion } from 'framer-motion';
import { staggerContainer, scaleFade, viewportOnce } from '../../animations/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Clock, PawPrint, Heart } from 'lucide-react';

interface FeatureItem {
  id: string;
  icon: 'clock' | 'paw' | 'heart';
  title: string;
  description: string;
}

interface FeatureTripletProps {
  features: FeatureItem[];
  className?: string;
}

const iconMap = {
  clock: Clock,
  paw: PawPrint,
  heart: Heart,
};

export function FeatureTriplet({ features, className = '' }: FeatureTripletProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={prefersReducedMotion ? { hidden: {}, visible: {} } : staggerContainer}
      className={`space-y-4 ${className}`}
    >
      {features.map((feature) => {
        const IconComponent = iconMap[feature.icon];
        return (
          <motion.div
            key={feature.id}
            variants={prefersReducedMotion ? { hidden: {}, visible: {} } : scaleFade}
            className="flex items-start gap-4 bg-card rounded-card border border-border p-4"
          >
            <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0">
              <IconComponent size={20} className="text-accent" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">
                {feature.title}
              </h4>
              <p className="text-muted text-[15px] leading-relaxed whitespace-pre-line">
                {feature.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

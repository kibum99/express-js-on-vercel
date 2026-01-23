import type { Variants } from 'framer-motion';

// ===== Base Fade Up Animation =====
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// ===== Fade In Only (for reduced motion) =====
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

// ===== Stagger Container =====
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

// ===== Stagger Container (slower for hero) =====
export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// ===== Scale Fade (for icons/badges) =====
export const scaleFade: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// ===== List Item Animation =====
export const listItem: Variants = {
  hidden: {
    opacity: 0,
    x: -8,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

// ===== Card Animation =====
export const cardVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// ===== Viewport Settings =====
export const viewportOnce = {
  once: true,
  amount: 0.2,
};

export const viewportOnceMore = {
  once: true,
  amount: 0.3,
};

// ===== Button Press Animation =====
export const buttonPress = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

// ===== Checkbox Animation =====
export const checkboxVariants: Variants = {
  unchecked: {
    scale: 1,
  },
  checked: {
    scale: [1, 1.15, 1],
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

// ===== Reduced Motion Variants =====
// These variants are used when user prefers reduced motion
export const reducedMotionVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.01,
    },
  },
};

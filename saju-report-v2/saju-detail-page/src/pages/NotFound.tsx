import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeUp, staggerContainerSlow } from '../animations/variants';
import { useReducedMotion } from '../hooks/useReducedMotion';
import pawPattern from '../assets/figma/patterns/paw-pattern.png';

export function NotFound() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className="min-h-screen bg-background relative flex items-center justify-center">
      {/* Global Paw Pattern Background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url(${pawPattern})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '1200px',
          opacity: 0.15,
        }}
        aria-hidden="true"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={prefersReducedMotion ? { hidden: {}, visible: {} } : staggerContainerSlow}
        className="relative max-w-md mx-auto text-center px-6 z-10"
      >
        {/* 404 */}
        <motion.h1
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="font-serif text-[80px] md:text-[120px] font-bold text-accent/30 leading-none mb-4"
        >
          404
        </motion.h1>

        {/* Message */}
        <motion.h2
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="font-serif text-[24px] md:text-[28px] font-bold text-foreground leading-[1.4] mb-4"
        >
          앗, 길을 잃었어요! 🐾
        </motion.h2>

        <motion.p
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-muted text-[15px] leading-[1.8] mb-8"
        >
          찾으시는 페이지가 없거나<br />
          주소가 잘못되었을 수 있어요.
        </motion.p>

        {/* Navigation Links */}
        <motion.div
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            to="/life"
            className="inline-flex items-center justify-center px-6 py-3 bg-accent text-white font-medium rounded-[14px] hover:bg-accent-dark transition-colors shadow-md"
          >
            🔮 사주 분석 보기
          </Link>
          <Link
            to="/chemistry"
            className="inline-flex items-center justify-center px-6 py-3 bg-card border border-border text-foreground font-medium rounded-[14px] hover:bg-accent-light transition-colors shadow-md"
          >
            💕 궁합 분석 보기
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}

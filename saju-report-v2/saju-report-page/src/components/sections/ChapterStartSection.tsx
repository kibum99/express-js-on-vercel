import { motion } from 'framer-motion';
import { fadeUp, staggerContainerSlow, viewportOnce } from '../../animations/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { interpolateTemplate, wrapSpecialCharacters } from '../../utils/template';
import type { Chapter } from '../../types';

interface ChapterStartSectionProps {
  chapter: Chapter;
  chapterIndex: number;
  petName: string;
}

export function ChapterStartSection({ chapter, chapterIndex, petName }: ChapterStartSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center px-6 py-20 bg-warm-gradient overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-accent/8 rounded-full blur-2xl"></div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={prefersReducedMotion ? { hidden: {}, visible: {} } : staggerContainerSlow}
        className="relative z-10 text-center"
      >
        <motion.div
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="mb-6"
        >
          <span className="text-xl font-heading font-bold text-accent">Chapter. {chapterIndex + 1}</span>
        </motion.div>

        <motion.h2
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-8"
        >
          {wrapSpecialCharacters(chapter.title)}
        </motion.h2>

        <motion.div
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto rounded-full bg-white/80 backdrop-blur-sm shadow-lg border-4 border-white flex items-center justify-center overflow-hidden">
            <img src={chapter.icon.replace('./assets', '/assets')} alt={chapter.title} className="w-28 h-28 object-contain" />
          </div>
        </motion.div>

        <motion.p
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-lg md:text-xl text-muted leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: wrapSpecialCharacters(interpolateTemplate(chapter.questionTemplate, { petName })),
          }}
        />
      </motion.div>
    </section>
  );
}

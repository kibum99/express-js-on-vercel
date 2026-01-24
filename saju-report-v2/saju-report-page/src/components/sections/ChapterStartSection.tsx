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
    <section className="relative chapter-start-border flex items-center justify-center px-6 py-20 bg-warm-gradient">
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
        className="relative z-10 text-center w-full flex flex-col gap-12"
      >
        <motion.div
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="flex flex-col items-center justify-center gap-3"
        >
          <span className="text-2xl font-heading font-extrabold text-white">Chapter. {chapterIndex + 1}</span>
          <h2 className="text-5xl md:text-6xl font-heading font-extrabold text-white">
            {wrapSpecialCharacters(chapter.title)}
          </h2>
        </motion.div>

        <motion.div
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
        >
          <div 
            className="w-[52vw] h-[52vw] max-w-[196px] max-h-[196px] mx-auto rounded-full bg-white/80 border-4 border-white flex items-center justify-center overflow-hidden"
            style={{ boxShadow: '0px 0px 64px 0px rgba(0, 0, 0, 1)', backdropFilter: 'none' }}
          >
            <img src={chapter.icon.replace('./assets', '/assets')} alt={chapter.title} className="w-[calc(100%-6px)] h-[calc(100%-6px)] object-contain" />
          </div>
        </motion.div>

        <motion.p
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-lg md:text-xl text-white/90 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: wrapSpecialCharacters(interpolateTemplate(chapter.questionTemplate, { petName })),
          }}
        />
      </motion.div>
    </section>
  );
}

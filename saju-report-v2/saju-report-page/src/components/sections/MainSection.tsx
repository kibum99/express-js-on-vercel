import { motion } from 'framer-motion';
import { fadeUp, staggerContainerSlow } from '../../animations/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { interpolateTemplate, wrapSpecialCharacters } from '../../utils/template';
import type { StaticContent, ReportData } from '../../types';

interface MainSectionProps {
  staticData: StaticContent;
  reportData: ReportData | null;
  petName: string;
}

export function MainSection({ staticData, reportData, petName }: MainSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  const petPersona = reportData?.persona?.find((p) => p.type === 'pet');
  const petImage = petPersona?.profile_image || 'https://via.placeholder.com/300x300?text=Pet+Image';

  const titleHtml = interpolateTemplate(staticData.main.title_template, { petName });

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center px-6 py-12 bg-cover bg-center main-section"
      style={{ backgroundImage: 'url(/assets/img/main-section-background.png)' }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={prefersReducedMotion ? { hidden: {}, visible: {} } : staggerContainerSlow}
        className="text-center"
      >
        {/* Title */}
        <motion.div
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="mb-8"
        >
          <h1
            className="font-heading text-4xl md:text-5xl font-bold text-white leading-tight mb-6"
            dangerouslySetInnerHTML={{ __html: wrapSpecialCharacters(titleHtml) }}
          />
        </motion.div>

        {/* Pet Image */}
        <motion.div
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="mb-12"
        >
          <div className="relative inline-block">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-lg border-4 border-white">
              <img
                src={petImage}
                alt="Pet"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* Scroll Hint */}
        <motion.div
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="mt-8 flex flex-col"
        >
          <div className="flex flex-col items-center gap-3 text-white">
            <svg
              className="w-8 h-8 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
              />
            </svg>
            <p className="text-sm font-medium tracking-wider">
              {staticData.main.scroll_hint.replace('<br>', ' ')}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

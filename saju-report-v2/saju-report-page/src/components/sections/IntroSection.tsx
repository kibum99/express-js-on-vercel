import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '../../animations/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { interpolateTemplate, wrapSpecialCharacters } from '../../utils/template';
import { SajuGrid } from '../ui/SajuGrid';
import { OhaengChart } from '../ui/OhaengChart';
import { Card } from '../ui/Card';
import type { StaticContent, ReportData, Persona } from '../../types';

interface IntroSectionProps {
  staticData: StaticContent;
  reportData: ReportData | null;
  petName: string;
  ownerName: string;
}

export function IntroSection({ staticData, reportData, petName, ownerName }: IntroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set(staticData.chapters.map((_, i) => i)));
  const [allExpanded, setAllExpanded] = useState(true);

  const petPersona = reportData?.persona?.find((p) => p.type === 'pet');
  const ownerPersona = reportData?.persona?.find((p) => p.type === 'owner');
  const petSaju = reportData?.saju?.find((s) => s.type === 'pet') || null;
  const ownerSaju = reportData?.saju?.find((s) => s.type === 'owner') || null;

  const formatPersonaInfo = (persona: Persona | undefined) => {
    if (!persona) return '';
    return `${persona.birth} (${persona.solar_lunar}) / ${persona.gender}`;
  };

  const toggleChapter = (index: number) => {
    setExpandedChapters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      setAllExpanded(newSet.size === staticData.chapters.length);
      return newSet;
    });
  };

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedChapters(new Set());
      setAllExpanded(false);
    } else {
      setExpandedChapters(new Set(staticData.chapters.map((_, i) => i)));
      setAllExpanded(true);
    }
  };

  const welcomeMsg = interpolateTemplate(staticData.intro.welcome_msg_template, { petName, ownerName });
  const paragraphs = welcomeMsg.split('\n\n').filter((p) => p.trim() !== '');

  return (
    <section className="px-6 py-12 bg-background">
      <div className="flex flex-col gap-[80px]">
        {/* Profile Section */}
        <motion.div
          initial="visible"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={staticData.intro.intro_profile.replace('./assets', '/assets') || petPersona?.profile_image || '/assets/img/char/intro.png'}
                alt="Pet"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-heading font-bold mb-4">
              <span className="text-accent">{wrapSpecialCharacters(staticData.intro.welcome_title)}</span>
            </h2>
            <div className="flex flex-col gap-2 text-muted text-sm leading-relaxed text-left">
              {paragraphs.map((p, i) => (
                <p key={i} className="m-0">
                  {wrapSpecialCharacters(p).split('\n').map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < p.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pet Saju Grid */}
        <motion.div
          initial="visible"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-3">
            <div>
              <h3
                className="text-xl font-heading font-bold mb-2"
                dangerouslySetInnerHTML={{
                  __html: wrapSpecialCharacters(
                    interpolateTemplate(staticData.intro.pet_saju_title_template, { petName })
                  ),
                }}
              />
              <p className="text-sm text-muted">{formatPersonaInfo(petPersona)}</p>
            </div>
            <div className="flex flex-col gap-4">
              <SajuGrid saju={petSaju} />
            </div>
          </div>
          {petSaju && (
            <div className="flex flex-col gap-3">
              <h3
                className="text-xl font-heading font-bold w-full"
                dangerouslySetInnerHTML={{
                  __html: wrapSpecialCharacters(
                    interpolateTemplate(staticData.intro.pet_ohaeng_chart_title_template, { petName })
                  ),
                }}
              />
              <OhaengChart saju={petSaju} />
            </div>
          )}
        </motion.div>

        {/* Owner Saju Grid */}
        <motion.div
          initial="visible"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="space-y-4"
        >
          <div>
            <h3
              className="text-xl font-heading font-bold mb-2"
              dangerouslySetInnerHTML={{
                __html: wrapSpecialCharacters(
                  interpolateTemplate(staticData.intro.owner_saju_title_template, { ownerName })
                ),
              }}
            />
            <p className="text-sm text-muted">{formatPersonaInfo(ownerPersona)}</p>
          </div>
          <div className="flex flex-col gap-4">
            <SajuGrid saju={ownerSaju} />
            {ownerSaju && (
              <>
                <h3
                  className="text-xl font-heading font-bold w-full"
                  dangerouslySetInnerHTML={{
                    __html: wrapSpecialCharacters(
                      interpolateTemplate(staticData.intro.owner_ohaeng_chart_title_template, { ownerName })
                    ),
                  }}
                />
                <OhaengChart saju={ownerSaju} />
              </>
            )}
          </div>
        </motion.div>

        {/* Chapters Preview */}
        <motion.div
          initial="visible"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-heading font-bold">리포트에서 확인 가능한 내용</h3>
            <button
              onClick={toggleAll}
              className="text-sm text-accent font-medium hover:text-accent-dark transition-colors"
            >
              {allExpanded ? '모두 접기' : '모두 펼치기'}
            </button>
          </div>

          <div className="space-y-4">
            {staticData.chapters.map((chapter, idx) => {
              const report = reportData?.report_contents?.[idx];
              const queries = report?.reportContent?.map((item) => item.question) || [];
              const isExpanded = expandedChapters.has(idx);

              return (
                <Card key={chapter.id} variant="outlined" className="overflow-hidden py-3 px-3">
                  <button
                    onClick={() => toggleChapter(idx)}
                    className="w-full flex items-center justify-between px-2 py-0 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={chapter.icon.replace('./assets', '/assets')} alt={chapter.title} className="w-10 h-10" />
                      <span className="font-heading font-extrabold text-[22px] text-foreground">
                        {wrapSpecialCharacters(chapter.title)}
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pt-4 pb-4 space-y-2">
                      {queries.map((qText, qIdx) => (
                        <div key={qIdx} className="flex items-start gap-2 text-sm">
                          <span className="text-accent font-bold flex-shrink-0">Q.</span>
                          <span className="text-foreground">
                            {wrapSpecialCharacters(interpolateTemplate(qText, { petName }))}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

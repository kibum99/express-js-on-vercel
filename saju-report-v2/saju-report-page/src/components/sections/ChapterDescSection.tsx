import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '../../animations/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { interpolateTemplate, wrapSpecialCharacters } from '../../utils/template';
import { FaqChat } from '../ui/FaqChat';
import { Card } from '../ui/Card';
import type { Chapter, ReportContent, StaticContent } from '../../types';

interface ChapterDescSectionProps {
  chapter: Chapter;
  reportContent: ReportContent | undefined;
  staticData: StaticContent;
  petName: string;
  petProfileImg: string;
  onShowContent: () => void;
}

export function ChapterDescSection({
  chapter,
  reportContent,
  staticData,
  petName,
  petProfileImg,
  onShowContent,
}: ChapterDescSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  const queries = chapter.desc_queries?.map((q) => q.template) || reportContent?.reportContent?.map((item) => item.question) || [];

  const handleFaqEnd = () => {
    onShowContent();
  };

  return (
    <section className="px-6 py-12 bg-background">
      <div className="flex flex-col gap-[80px]">
        {/* Hero */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="flex flex-col items-center text-center space-y-6"
        >
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img src={chapter.teller_icon.replace('./assets', '/assets')} alt="Teller" className="w-full h-full object-cover" />
          </div>
          <h3 className="text-2xl font-heading font-bold">
            이번 챕터는<br />
            <span className="text-accent">{wrapSpecialCharacters(chapter.title)}</span> 이에요
          </h3>
          <Card className="p-5 mt-4">
            <p
              className="text-sm text-muted leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: wrapSpecialCharacters(interpolateTemplate(chapter.chapter_overview, { petName })),
              }}
            />
          </Card>
        </motion.div>

        {/* Queries List */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="flex flex-col gap-4"
        >
          <h4
            className="flex items-center gap-2 text-xl font-heading font-bold"
            dangerouslySetInnerHTML={{
              __html: wrapSpecialCharacters(staticData.chapter_desc.intro_title),
            }}
          />
          <div className="px-2 flex flex-col gap-2">
            <ol className="flex flex-col gap-2">
              {queries.map((qText, qIdx) => (
                <li key={qIdx} className="flex items-start gap-2">
                  <span className="text-accent font-bold flex-shrink-0">{qIdx + 1}.</span>
                  <span
                    className="text-foreground"
                    dangerouslySetInnerHTML={{
                      __html: wrapSpecialCharacters(interpolateTemplate(qText, { petName })),
                    }}
                  />
                </li>
              ))}
            </ol>
          </div>
          <p className="font-heading font-bold text-foreground text-xl">
            {wrapSpecialCharacters(staticData.chapter_desc.keywords_suffix)}
          </p>
        </motion.div>

        {/* Analysis Elements */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="space-y-4"
        >
          <h4
            className="flex items-center gap-2 text-xl font-heading font-bold"
            dangerouslySetInnerHTML={{
              __html: wrapSpecialCharacters(staticData.chapter_desc.analysis_title),
            }}
          />
          <Card className="p-5">
            <ul className="space-y-4">
              {chapter.analysis_elements.map((el, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-accent font-bold flex-shrink-0">✓</span>
                  <span
                    className="text-foreground text-sm"
                    dangerouslySetInnerHTML={{
                      __html: wrapSpecialCharacters(interpolateTemplate(el, { petName })),
                    }}
                  />
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="space-y-4"
        >
          <h4
            className="text-xl font-heading font-bold leading-tight"
            dangerouslySetInnerHTML={{
              __html: wrapSpecialCharacters(
                interpolateTemplate(staticData.chapter_desc.faq_title, { petName })
              ),
            }}
          />
          <FaqChat chapter={chapter} petName={petName} petProfileImg={petProfileImg} onEnd={handleFaqEnd} />
        </motion.div>
      </div>
    </section>
  );
}

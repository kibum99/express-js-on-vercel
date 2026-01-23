import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '../../animations/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { interpolateTemplate, wrapSpecialCharacters } from '../../utils/template';
import { ScoreChart } from '../ui/ScoreChart';
import { Card } from '../ui/Card';
import type { ReportContent, StaticContent } from '../../types';

interface ChapterContentSectionProps {
  reportContent: ReportContent;
  staticData: StaticContent;
  chapterIndex: number;
  petName: string;
}

export function ChapterContentSection({
  reportContent,
  staticData,
  chapterIndex,
  petName,
}: ChapterContentSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Debug: 데이터 확인
  useEffect(() => {
    console.log('ChapterContentSection - chapterIndex:', chapterIndex);
    console.log('ChapterContentSection - reportContent:', reportContent);
    console.log('ChapterContentSection - reportContent.reportContent:', reportContent?.reportContent);
    console.log('ChapterContentSection - reportContent.reportContent.length:', reportContent?.reportContent?.length);
  }, [chapterIndex, reportContent]);

  return (
    <section
      ref={sectionRef}
      id={`section-chapter-content-${chapterIndex}`}
      className="px-6 py-12 bg-background"
    >
      <div className="space-y-8">
        {/* Score Chart */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
        >
          <Card>
            <ScoreChart score={reportContent.score} hintTemplate={staticData.chapter_content.score_avg_hint} />
          </Card>
        </motion.div>

        {/* Detailed Report */}
        <div className="space-y-6">
          <h4 className="text-xl font-heading font-bold text-foreground">
            {wrapSpecialCharacters(staticData.chapter_content.detailed_report_title)}
          </h4>
          <Card className="p-6" animate={false}>
            <div className="space-y-8">
              {reportContent.reportContent && reportContent.reportContent.length > 0 ? (
                reportContent.reportContent.map((item, qIdx) => {
                  const paragraphs = item.explanation.split('\n').filter((p) => p.trim() !== '');
                  return (
                    <div key={qIdx} className="space-y-4">
                      <h5 className="flex items-start gap-2 text-lg font-heading font-bold text-foreground">
                        <span className="text-accent flex-shrink-0">Q{qIdx + 1}.</span>
                        <span
                          className="text-foreground"
                          dangerouslySetInnerHTML={{
                            __html: wrapSpecialCharacters(interpolateTemplate(item.question, { petName })),
                          }}
                        />
                      </h5>
                      <div className="space-y-2 text-sm leading-relaxed pl-0">
                        {paragraphs.map((p, pIdx) => (
                          <p
                            key={pIdx}
                            className="text-muted"
                            style={{ color: 'var(--color-muted)' }}
                            dangerouslySetInnerHTML={{
                              __html: wrapSpecialCharacters(interpolateTemplate(p, { petName })),
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted text-sm" style={{ color: 'var(--color-muted)' }}>
                  분석 내용을 불러오는 중...
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Lucky Tip */}
        <motion.div
          animate={prefersReducedMotion ? {} : {
            scale: [1, 1.02, 1],
          }}
          transition={prefersReducedMotion ? {} : {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Card 
            variant="elevated" 
            className="bg-gradient-to-br from-accent-light via-accent-light/95 to-accent-light/90 border-2 border-accent/50 shadow-lg"
            animate={false}
          >
            <div className="flex items-start gap-4 p-6">
              <span className="text-4xl flex-shrink-0">{reportContent.lucky_tip.icon}</span>
              <div className="space-y-2">
                <h4 className="text-xl font-heading font-bold text-accent-dark">
                  {wrapSpecialCharacters(staticData.chapter_content.lucky_tip_title)}
                </h4>
                <p className="text-sm text-muted leading-relaxed font-medium">
                  {wrapSpecialCharacters(reportContent.lucky_tip.text)}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

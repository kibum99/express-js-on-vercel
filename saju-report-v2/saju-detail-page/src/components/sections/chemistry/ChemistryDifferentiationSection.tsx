import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, listItem, viewportOnce } from '../../../animations/variants';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { chemistryDiffContent } from '../../../content/chemistryContent';
import { SectionTitle, Card, DiffPoint } from '../../ui';

export function ChemistryDifferentiationSection() {
  const prefersReducedMotion = useReducedMotion();
  const { difference, comparison, diffPoints } = chemistryDiffContent;

  return (
    <section className="relative px-6 py-14 md:py-20 overflow-hidden z-10">
      <div className="max-w-md mx-auto text-center">
        <SectionTitle>
          다른 궁합 서비스와<br />
          뭐가 다를까요?
        </SectionTitle>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-muted text-[15px] leading-[1.8] mb-8"
        >
          시중에도 반려동물 궁합 서비스가 있습니다.<br />
          하지만 대부분은 단순한 띠/별자리 매칭에 그치고 있어요.
        </motion.p>

        {/* Difference Points */}
        <Card className="mb-8 text-left" variant="elevated">
          <h3 className="font-semibold text-foreground text-[15px] mb-4">
            {difference.title}
          </h3>
          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={prefersReducedMotion ? { hidden: {}, visible: {} } : staggerContainer}
            className="space-y-2 mb-4"
          >
            {difference.points.map((point, i) => (
              <motion.li
                key={i}
                variants={prefersReducedMotion ? { hidden: {}, visible: {} } : listItem}
                className="text-muted text-[14px] flex items-start gap-2 leading-[1.7]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                {point}
              </motion.li>
            ))}
          </motion.ul>
          <div className="bg-accent/20 rounded-[12px] px-4 py-3">
            <p className="text-foreground font-medium text-[14px]">
              {difference.closing}
            </p>
          </div>
        </Card>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-foreground text-[15px] font-medium leading-[1.7] mb-8"
        >
          저희는 그 차이를 알고,<br />
          <strong className="text-accent">반려동물과의 관계에 맞춰 설계</strong>했습니다.
        </motion.p>

        {/* Comparison Table */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="mb-10"
        >
          <div className="space-y-3 text-left">
            {comparison.map((row, i) => (
              <div key={i} className="bg-card border border-border/60 rounded-[16px] p-4 shadow-card">
                <p className="font-medium text-foreground text-[13px] mb-3">
                  {row.label}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-background rounded-[12px] p-3">
                    <p className="text-[11px] text-muted mb-1">타사 서비스</p>
                    <p className="text-[13px] text-muted">
                      {row.existing}
                    </p>
                  </div>
                  <div className="bg-accent-light rounded-[12px] p-3">
                    <p className="text-[11px] text-accent mb-1">멍냥사주</p>
                    <p className="text-[13px] text-foreground font-medium">
                      {row.ours}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Diff Points */}
        <motion.h3
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="font-serif font-semibold text-foreground text-[17px] mb-5"
        >
          🏆 멍냥사주 궁합 분석의 핵심 차별점 3가지
        </motion.h3>

        <div className="space-y-4 text-left">
          {diffPoints.map((point, index) => (
            <DiffPoint key={point.id} point={point} number={index + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '../../../animations/variants';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { chemistryReviewsContent } from '../../../content/chemistryContent';
import { SectionTitle, ReviewCard } from '../../ui';
import screenshotPattern from '../../../assets/figma/patterns/screenshot-pattern.png';

export function ChemistryReviewsSection() {
  const prefersReducedMotion = useReducedMotion();
  const { reviews } = chemistryReviewsContent;

  return (
    <section className="relative px-6 py-14 md:py-20 overflow-hidden">
      {/* Screenshot Pattern Background - 은은하게 */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${screenshotPattern})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          opacity: 0.06,
        }}
        aria-hidden="true"
      />
      
      <div className="relative max-w-md mx-auto text-center z-10">
        <SectionTitle subtitle="반려동물과의 궁합 분석, 결과를 보고 나서 관계가 달라졌다는 분들이 많아요.">
          먼저 경험한 보호자들의 이야기
        </SectionTitle>

        {/* Reviews Stack */}
        <div className="space-y-5 text-left">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
              transition={{ delay: index * 0.1 }}
            >
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

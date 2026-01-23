import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '../../animations/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { reviewsContent } from '../../content/content';
import { SectionTitle, ReviewCard } from '../ui';
import screenshotPattern from '../../assets/figma/patterns/screenshot-pattern.png';

export function ReviewsSection() {
  const prefersReducedMotion = useReducedMotion();
  const { reviews } = reviewsContent;

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
        <SectionTitle subtitle="처음엔 반신반의했던 분들이 결과를 받아보고 어떤 변화를 경험했는지 들어보세요.">
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

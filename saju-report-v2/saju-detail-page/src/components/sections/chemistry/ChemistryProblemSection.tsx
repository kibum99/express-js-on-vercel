import { motion } from 'framer-motion';
import { staggerContainer, listItem, fadeUp, viewportOnce } from '../../../animations/variants';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { chemistryProblemContent } from '../../../content/chemistryContent';
import { SectionTitle, Card } from '../../ui';
import { Heart, Users } from 'lucide-react';

export function ChemistryProblemSection() {
  const prefersReducedMotion = useReducedMotion();
  const { petWorries, guardianWorries } = chemistryProblemContent;

  return (
    <section className="relative px-6 py-14 md:py-20 z-10">
      <div className="max-w-md mx-auto text-center">
        <SectionTitle>
          혹시, 이런 생각 해본 적 있나요?
        </SectionTitle>

        {/* Relationship Curiosity */}
        <Card className="mb-5 text-left" variant="elevated">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center">
              <Heart size={20} className="text-accent" />
            </div>
            <h3 className="font-semibold text-foreground text-[16px]">
              {petWorries.title}
            </h3>
          </div>
          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={prefersReducedMotion ? { hidden: {}, visible: {} } : staggerContainer}
            className="space-y-3"
          >
            {petWorries.items.map((item) => (
              <motion.li
                key={item.id}
                variants={prefersReducedMotion ? { hidden: {}, visible: {} } : listItem}
                className="text-muted text-[14px] leading-[1.7] pl-4 border-l-2 border-accent/30"
              >
                {item.text}
              </motion.li>
            ))}
          </motion.ul>
        </Card>

        {/* Relationship Worries */}
        <Card className="mb-6 text-left" variant="elevated">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center">
              <Users size={20} className="text-accent" />
            </div>
            <h3 className="font-semibold text-foreground text-[16px]">
              {guardianWorries.title}
            </h3>
          </div>
          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={prefersReducedMotion ? { hidden: {}, visible: {} } : staggerContainer}
            className="space-y-3"
          >
            {guardianWorries.items.map((item) => (
              <motion.li
                key={item.id}
                variants={prefersReducedMotion ? { hidden: {}, visible: {} } : listItem}
                className="text-muted text-[14px] leading-[1.7] pl-4 border-l-2 border-accent/30"
              >
                {item.text}
              </motion.li>
            ))}
          </motion.ul>
        </Card>

        {/* Moved text */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-foreground text-[15px] leading-[1.8] mb-3 font-medium"
        >
          왜 우리는 만났을까?<br />
          이 인연은 어떤 의미일까?
        </motion.p>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-muted text-[15px] leading-[1.8] mb-8"
        >
          반려동물과 함께하면서<br />
          문득 이런 생각이 드는 순간이 있습니다.
        </motion.p>

        {/* Closing */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="bg-accent/20 rounded-[16px] px-6 py-4"
        >
          <p className="text-foreground text-[15px] font-medium leading-[1.7]">
            사주 궁합은 우리 관계의 의미를<br />
            <strong className="text-accent">'운명'으로 읽어내는</strong> 도구입니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

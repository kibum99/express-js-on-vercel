import { motion } from 'framer-motion';
import { staggerContainer, listItem, fadeUp, viewportOnce } from '../../animations/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { problemContent } from '../../content/content';
import { SectionTitle, Card } from '../ui';
import { PawPrint, Heart } from 'lucide-react';

export function ProblemSection() {
  const prefersReducedMotion = useReducedMotion();
  const { petWorries, guardianWorries } = problemContent;

  return (
    <section className="relative px-6 py-14 md:py-20 z-10">
      <div className="max-w-md mx-auto text-center">
        <SectionTitle>
          혹시, 이런 생각 해본 적 있나요?
        </SectionTitle>

        {/* Pet Worries */}
        <Card className="mb-5 text-left" variant="elevated">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center">
              <PawPrint size={20} className="text-accent" />
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

        {/* Guardian Worries */}
        <Card className="mb-6 text-left" variant="elevated">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center">
              <Heart size={20} className="text-accent" />
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

        {/* Moved text - 기존 subtitle과 p */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-foreground text-[15px] leading-[1.8] mb-3 font-medium"
        >
          함께 살지만, 우리는 서로 다른 언어를 씁니다.
        </motion.p>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-muted text-[15px] leading-[1.8] mb-8"
        >
          눈을 맞추고 꼬리를 흔들며 사랑을 표현하지만,<br />
          가끔은 도무지 알 수 없는 행동들로 물음표를 남기기도 합니다.
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
            사주는 우리 아이를 '고치기' 전에<br />
            먼저 <strong className="text-accent">'깊이 이해하는'</strong> 도구가 되어줍니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

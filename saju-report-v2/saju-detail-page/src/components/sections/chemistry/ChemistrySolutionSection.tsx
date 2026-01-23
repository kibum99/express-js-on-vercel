import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '../../../animations/variants';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { chemistrySolutionContent } from '../../../content/chemistryContent';
import { SectionTitle, ExampleCard } from '../../ui';
import blueDogHeadImg from '../../../assets/figma/characters/blue-dog-head.png';

export function ChemistrySolutionSection() {
  const prefersReducedMotion = useReducedMotion();
  const { example } = chemistrySolutionContent;

  return (
    <section className="relative px-6 py-14 md:py-20 overflow-hidden z-10">
      <div className="max-w-md mx-auto text-center">
        <SectionTitle subtitle="서로의 기질이 어떻게 맞물리는지 알아야 더 좋은 관계를 만들 수 있어요.">
          우리는 서로에게 어떤 존재일까요?
        </SectionTitle>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-muted text-[15px] leading-[1.8] mb-6"
        >
          "이 아이가 나를 좋아하긴 하는 걸까?"<br />
          "혹시 나보다 다른 가족을 더 따르는 건 아닐까?"<br /><br />
          이런 생각이 드는 건 당연해요.<br />
          <strong className="text-foreground">말로 표현할 수 없으니까요.</strong>
        </motion.p>

        {/* Quote */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-center py-6 mb-8"
        >
          <p className="font-serif text-[20px] md:text-[22px] font-bold text-foreground leading-[1.5]">
            반려인과 반려동물의 사주를 함께 분석하면,<br />
            두 존재 사이의 '케미스트리'를 읽을 수 있어요.
          </p>
        </motion.div>

        {/* Example Card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="mb-8"
        >
          <p className="text-[13px] font-medium text-accent mb-4">
            💕 예시: '{example.name}'의 궁합 분석
          </p>
          <ExampleCard 
            data={example} 
            profileImage={blueDogHeadImg}
            multiLineBirthDate={true}
            tipsTitle={`${example.name} 관계 개선 포인트`}
          />
        </motion.div>

        {/* Closing */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-foreground text-[15px] leading-[1.8]"
        >
          "그냥 잘 맞아"라고 느꼈던 것들에<br />
          <strong className="text-accent">구체적인 이유</strong>를 붙여드려요.
        </motion.p>
      </div>
    </section>
  );
}

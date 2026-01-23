import { motion } from 'framer-motion';
import { staggerContainerSlow, fadeUp } from '../../../animations/variants';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import chemistry1Img from '../../../assets/figma/illustrations/chemistry-1.png';

export function ChemistryHeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative px-6 py-14 md:py-20 overflow-hidden z-10">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={prefersReducedMotion ? { hidden: {}, visible: {} } : staggerContainerSlow}
        className="relative max-w-md mx-auto text-center z-10"
      >
        {/* Main Copy */}
        <motion.h1
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="font-serif text-[24px] md:text-[30px] font-bold text-foreground leading-[1.4] mb-6 tracking-tight inline-block px-4 py-2 bg-accent/10 rounded-[12px]"
        >
          우연이라고 생각했던 만남,<br />
          사실은 운명이었을지도 몰라요.
        </motion.h1>

        {/* Sub Copy 1 */}
        <motion.p
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-muted text-[15px] leading-[1.8] mb-6"
        >
          수많은 반려동물 중에서 왜 하필 이 아이와 만났을까요?
          어쩌면 태어날 때부터 정해진, 운명적인 인연이 아닐까요?
        </motion.p>

        {/* Sub Copy 2 */}
        <motion.p
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-foreground text-[15px] leading-[1.8] mb-6 font-medium"
        >
          <strong className="text-accent">반려인과 반려동물의 사주를 함께 분석하여</strong><br />
          두 존재가 어떻게 조화를 이루는지<br />
          <strong>체계적으로 풀어냅니다.</strong>
        </motion.p>

        {/* Hero Illustration Card */}
        <motion.div
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="mb-8"
        >
          <img
            src={chemistry1Img}
            alt="반려동물과 함께하는 따뜻한 인연"
            className="w-full max-w-sm mx-auto rounded-[20px] shadow-card"
            loading="eager"
          />
        </motion.div>

        {/* Differentiator */}
        <motion.p
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-muted text-[14px] leading-[1.8] mb-6"
        >
          단순한 궁합 점이 아닙니다.<br />
          동양 명리학의 오행 상생·상극 원리를 기반으로,<br />
          <strong className="text-foreground">우리가 서로에게 어떤 기운을 주고받는지</strong> 알려드려요.
        </motion.p>

        {/* Closing */}
        <motion.p
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-foreground text-[15px] leading-[1.8] font-medium"
        >
          우연처럼 시작된 인연,<br />
          이제 사주 궁합으로 그 의미를 찾아보세요.
        </motion.p>
      </motion.div>
    </section>
  );
}

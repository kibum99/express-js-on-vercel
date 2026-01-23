import { motion } from 'framer-motion';
import { staggerContainerSlow, fadeUp } from '../../animations/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import livingRoomImg from '../../assets/figma/illustrations/living-room.png';

export function HeroSection() {
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
          사람은 사주를 보는데,<br />
          왜 반려동물은 안 볼까요?
        </motion.h1>

        {/* Sub Copy 1 */}
        <motion.p
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-muted text-[15px] leading-[1.8] mb-6"
        >
          우리는 인생이 궁금할 때, 혹은 누군가를 깊이 이해하고 싶을 때 사주를 봅니다.
          태어난 날에 새겨진 기운을 통해 타고난 성향과 나아갈 길을 가늠해보곤 하죠.
        </motion.p>

        {/* Sub Copy 2 */}
        <motion.p
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-foreground text-[15px] leading-[1.8] mb-6 font-medium"
        >
          <strong className="text-accent">우리 곁의 반려동물도 똑같습니다.</strong><br />
          말을 하지 않을 뿐, 아이들에게도 태어난 순간 부여받은<br />
          <strong>고유한 기운과 운명</strong>이 존재합니다.
        </motion.p>

        {/* Hero Illustration Card */}
        <motion.div
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="mb-8"
        >
          <img
            src={livingRoomImg}
            alt="반려동물과 함께하는 따뜻한 일상"
            className="w-full max-w-sm mx-auto rounded-[20px] shadow-card"
            loading="eager"
          />
        </motion.div>

        {/* Differentiator */}
        <motion.p
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-muted text-[14px] leading-[1.8] mb-6"
        >
          단순한 호기심이어도 좋고, 막연한 걱정 때문이어도 괜찮습니다.<br />
          사람의 사주를 그대로 흉내 낸 것이 아닌,<br />
          반려동물의 생애와 본능에 맞춰 <strong className="text-foreground">제대로 설계된 사주 분석</strong>입니다.
        </motion.p>

        {/* Closing */}
        <motion.p
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-foreground text-[15px] leading-[1.8] font-medium"
        >
          전문가와 함께 만든 반려동물 사주로<br />
          우리 아이의 '타고난 운명'을 읽어보세요.
        </motion.p>
      </motion.div>
    </section>
  );
}

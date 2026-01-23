import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '../../animations/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { solutionContent } from '../../content/content';
import { SectionTitle, ExampleCard } from '../ui';

export function SolutionSection() {
  const prefersReducedMotion = useReducedMotion();
  const { example } = solutionContent;

  return (
    <section className="relative px-6 py-14 md:py-20 overflow-hidden z-10">
      <div className="max-w-md mx-auto text-center">
        <SectionTitle subtitle="타고난 기질을 알면, 양육의 답이 보입니다.">
          우리 아이, 정말 잘 지내고 있는 걸까?
        </SectionTitle>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-muted text-[15px] leading-[1.8] mb-6"
        >
          남들이 좋다는 훈련법, 유행하는 장난감이<br />
          우리 아이에게는 통하지 않을 때가 있습니다.<br /><br />
          그건 내가 부족해서가 아니라,<br />
          <strong className="text-foreground">아이의 타고난 그릇(기질)이 다르기 때문</strong>입니다.
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
            태어난 날부터 정해진 기질을 알고 돌본다면,<br />
            아이는 더 편안해질 수 있지 않을까요?
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
            🐕 예시: 강아지 '{example.name}'의 사주 분석
          </p>
          <ExampleCard data={example} />
        </motion.div>

        {/* Closing */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-foreground text-[15px] leading-[1.8]"
        >
          '문제 행동'이라고 생각했던 것들이<br />
          사실은 <strong className="text-accent">타고난 기질의 표현</strong>이었다는 걸 깨닫는 순간,<br />
          보호자도, 아이도 한결 편안해져요.
        </motion.p>
      </div>
    </section>
  );
}

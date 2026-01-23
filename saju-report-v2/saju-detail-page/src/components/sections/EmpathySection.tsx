import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '../../animations/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { empathyContent } from '../../content/content';
import { SectionTitle } from '../ui';
import bedroomImg from '../../assets/figma/illustrations/bedroom.png';

export function EmpathySection() {
  const prefersReducedMotion = useReducedMotion();
  const { behaviors } = empathyContent;

  return (
    <section className="relative px-6 py-14 md:py-20 overflow-hidden z-10">
      <div className="max-w-md mx-auto text-center">
        <SectionTitle>
          말 없는 우리 아이,<br />
          속마음까지 알 수 있다면요?
        </SectionTitle>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-muted text-[15px] leading-[1.8] mb-6"
        >
          우리 아이는 말을 하지 않습니다.<br />
          하지만 매 순간, 무언가를 느끼고, 생각하고, 표현하고 있어요.
        </motion.p>

        {/* Illustration Card - 높이 제한 및 크롭 */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="mb-6 max-w-sm mx-auto rounded-[20px] shadow-card overflow-hidden"
        >
          <img
            src={bedroomImg}
            alt="반려동물과 함께하는 편안한 휴식"
            className="w-full h-[220px] object-cover object-center"
            loading="lazy"
          />
        </motion.div>

        {/* Behaviors */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="bg-card rounded-[20px] shadow-card border border-border/40 p-5 mb-6"
        >
          <div className="space-y-1 text-foreground text-[15px] leading-[1.7]">
            {behaviors.map((b, i) => (
              <p key={i}>{b}</p>
            ))}
          </div>
          <p className="text-muted text-[14px] mt-4 leading-[1.7]">
            이 모든 행동 하나하나에는<br />
            우리 아이만의 <strong className="text-foreground">고유한 기질과 감정</strong>이 담겨 있습니다.
          </p>
        </motion.div>

        {/* Quotes - 말풍선 스타일 */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="mb-8"
        >
          <div className="flex flex-col gap-3 mb-8">
            {/* 첫 번째 말풍선 - 왼쪽 정렬 */}
            <div className="flex justify-start">
              <div className="relative bg-[#4a6b8a] text-white px-5 py-3 rounded-[20px] rounded-bl-[4px] shadow-md max-w-[80%]">
                <p className="text-[16px] font-medium">왜 저러는 걸까..?</p>
              </div>
            </div>
            {/* 두 번째 말풍선 - 오른쪽 정렬 */}
            <div className="flex justify-end">
              <div className="relative bg-[#4a6b8a] text-white px-5 py-3 rounded-[20px] rounded-br-[4px] shadow-md max-w-[80%]">
                <p className="text-[16px] font-medium">무슨 생각을 하고 있는 걸까?</p>
              </div>
            </div>
            {/* 세 번째 말풍선 - 왼쪽 정렬 */}
            <div className="flex justify-start">
              <div className="relative bg-[#4a6b8a] text-white px-5 py-3 rounded-[20px] rounded-bl-[4px] shadow-md max-w-[80%]">
                <p className="text-[16px] font-medium">나를 좋아하긴 하는 걸까?</p>
              </div>
            </div>
          </div>
          <p className="text-muted text-[14px] leading-[1.8]">
            보호자라면 하루에도 수십 번 이런 생각을 하게 됩니다.
          </p>
        </motion.div>

        {/* Solution Bridge */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-center py-6 mb-8"
        >
          <p className="font-serif text-[20px] md:text-[22px] font-bold text-foreground leading-[1.5]">
            그런데 만약,<br />
            그 마음을 읽을 수 있는 방법이 있다면 어떨까요?
          </p>
        </motion.div>

        {/* MBTI Explanation */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-muted text-[14px] leading-[1.8] mb-6"
        >
          사주는 <strong className="text-foreground">'동양의 MBTI'</strong>라고 불릴 만큼,<br />
          오랜 시간 축적된 체계적인 기질 분석 방법론입니다.
        </motion.p>

        {/* Closing */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="bg-accent/20 rounded-[16px] px-5 py-4"
        >
          <p className="text-foreground text-[15px] leading-[1.8]">
            사람에게만 적용되던 이 체계를,<br />
            이제 우리 반려동물에게 맞춤 적용할 때가 되었어요.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

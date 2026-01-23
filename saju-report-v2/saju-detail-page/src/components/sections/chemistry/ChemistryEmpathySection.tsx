import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '../../../animations/variants';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { chemistryEmpathyContent } from '../../../content/chemistryContent';
import { SectionTitle } from '../../ui';
import chemistry3Img from '../../../assets/figma/illustrations/chemistry-3.png';

export function ChemistryEmpathySection() {
  const prefersReducedMotion = useReducedMotion();
  const { behaviors } = chemistryEmpathyContent;

  return (
    <section className="relative px-6 py-14 md:py-20 overflow-hidden z-10">
      <div className="max-w-md mx-auto text-center">
        <SectionTitle>
          이 아이와 나,<br />
          우연일까요 운명일까요?
        </SectionTitle>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-muted text-[15px] leading-[1.8] mb-6"
        >
          세상에 수많은 반려동물 중에서<br />
          왜 하필 이 아이와 가족이 되었을까요?
        </motion.p>

        {/* Illustration Card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="mb-6 max-w-sm mx-auto"
        >
          <img
            src={chemistry3Img}
            alt="행복한 반려동물 가족"
            className="w-full max-w-sm mx-auto rounded-[20px] shadow-card"
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
            이 모든 것들이<br />
            <strong className="text-foreground">단순한 우연이 아닐 수도 있습니다.</strong>
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
                <p className="text-[16px] font-medium">왜 우리는 만났을까?</p>
              </div>
            </div>
            {/* 두 번째 말풍선 - 오른쪽 정렬 */}
            <div className="flex justify-end">
              <div className="relative bg-[#4a6b8a] text-white px-5 py-3 rounded-[20px] rounded-br-[4px] shadow-md max-w-[80%]">
                <p className="text-[16px] font-medium">이 인연은 어떤 의미일까?</p>
              </div>
            </div>
            {/* 세 번째 말풍선 - 왼쪽 정렬 */}
            <div className="flex justify-start">
              <div className="relative bg-[#4a6b8a] text-white px-5 py-3 rounded-[20px] rounded-bl-[4px] shadow-md max-w-[80%]">
                <p className="text-[16px] font-medium">우리는 천생연분일까?</p>
              </div>
            </div>
          </div>
          <p className="text-muted text-[14px] leading-[1.8]">
            사람도 사주 궁합을 봅니다.<br />
            결혼 전에, 중요한 관계를 맺기 전에.
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
            그런데 생각해보면,<br />
            반려동물과의 관계야말로<br />
            가장 운명적인 만남 아닐까요?
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
          사주 궁합은 두 존재 사이의 <strong className="text-foreground">'기운의 조화'</strong>를 분석합니다.<br />
          어떤 기운이 서로를 끌어당겼는지,<br />
          어떤 부분에서 시너지가 나는지.
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
            우연이라고 생각했던 만남이<br />
            사실은 <strong className="text-accent">운명</strong>이었음을 확인하는 순간,<br />
            우리의 관계는 더 특별해집니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, listItem, viewportOnce } from '../../../animations/variants';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { chemistryCtaContent } from '../../../content/chemistryContent';
import { SectionTitle, ChecklistItem, Card } from '../../ui';
import chemistry2Img from '../../../assets/figma/illustrations/chemistry-2.png';
import groupHappyImg from '../../../assets/figma/characters/group-happy.png';

export function ChemistryCtaSection() {
  const prefersReducedMotion = useReducedMotion();
  const { checklistTitle, checklist } = chemistryCtaContent;

  return (
    <section className="relative px-6 py-14 md:py-20 overflow-hidden z-10">
      <div className="max-w-md mx-auto text-center">
        <SectionTitle>
          우연이라고 생각한 만남,<br />
          이제 그 의미를 확인해보세요.
        </SectionTitle>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-muted text-[15px] leading-[1.8] mb-6"
        >
          수많은 반려동물 중에 왜 하필 이 아이였을까요?<br />
          그 질문에 대한 답을 찾을 수 있습니다.
        </motion.p>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-foreground text-[15px] font-medium leading-[1.7] mb-6"
        >
          동양 명리학의 지혜를<br />
          반려동물과의 관계에 맞춰 <strong className="text-accent">새롭게 설계</strong>했습니다.
        </motion.p>

        {/* Illustration Card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="mb-8 max-w-sm mx-auto rounded-[20px] shadow-card overflow-hidden"
        >
          <img
            src={chemistry2Img}
            alt="반려동물과의 운명적 만남"
            className="w-full h-[260px] object-cover object-center"
            loading="lazy"
          />
        </motion.div>

        {/* Checklist */}
        <Card className="mb-6 text-left" variant="elevated">
          <h3 className="font-semibold text-foreground text-[15px] mb-3">
            ✅ {checklistTitle}
          </h3>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={prefersReducedMotion ? { hidden: {}, visible: {} } : staggerContainer}
          >
            {checklist.map((item) => (
              <motion.div
                key={item.id}
                variants={prefersReducedMotion ? { hidden: {}, visible: {} } : listItem}
              >
                <ChecklistItem
                  id={item.id}
                  text={item.text}
                />
              </motion.div>
            ))}
          </motion.div>
        </Card>

        {/* Value Statement */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-center py-6 mb-8"
        >
          <p className="font-serif text-[20px] md:text-[22px] font-bold text-foreground leading-[1.5]">
            우연이라 여겼던 만남에<br />
            <span className="text-accent">운명이라는 이름</span>을 붙여드립니다.
          </p>
        </motion.div>

        {/* Closing - group-happy 이미지 포함 */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="bg-accent-light border border-accent/20 rounded-[20px] p-6"
        >
          <img
            src={groupHappyImg}
            alt="행복한 보호자와 반려동물들"
            className="w-32 h-auto mx-auto mb-4 opacity-90"
          />
          <p className="text-foreground text-[16px] font-medium mb-2">
            운명처럼 만난 인연,<br />
            저희가 그 의미를 읽어드릴게요.
          </p>
          <p className="text-muted text-[13px]">
            멍냥사주 팀 드림 🐕🐈
          </p>
        </motion.div>
      </div>
    </section>
  );
}

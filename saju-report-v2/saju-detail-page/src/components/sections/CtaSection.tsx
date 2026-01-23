import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, listItem, viewportOnce } from '../../animations/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ctaContent } from '../../content/content';
import { SectionTitle, ChecklistItem, Card } from '../ui';
import sofaNapImg from '../../assets/figma/illustrations/sofa-nap.png';
import groupHappyImg from '../../assets/figma/characters/group-happy.png';

export function CtaSection() {
  const prefersReducedMotion = useReducedMotion();
  const { checklistTitle, checklist } = ctaContent;

  return (
    <section className="relative px-6 py-14 md:py-20 overflow-hidden z-10">
      <div className="max-w-md mx-auto text-center">
        <SectionTitle>
          말 못 하는 아이의 마음,<br />
          이제 사주로 들어보세요.
        </SectionTitle>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-muted text-[15px] leading-[1.8] mb-6"
        >
          우리 아이는 매일 자신만의 방식으로 마음을 전하고 있습니다.<br />
          우리는 그 신호를 조금 더 잘 이해하고 싶었습니다.
        </motion.p>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-foreground text-[15px] font-medium leading-[1.7] mb-6"
        >
          수천 년간 사람을 이해해온 사주의 체계를<br />
          반려동물에게 맞게 <strong className="text-accent">새롭게 설계</strong>했습니다.
        </motion.p>

        {/* Illustration Card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="mb-8"
        >
          <img
            src={sofaNapImg}
            alt="반려동물과 함께하는 평화로운 휴식"
            className="w-full max-w-sm mx-auto rounded-[20px] shadow-card"
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
            아이를 바꾸는 서비스가 아닙니다.<br />
            아이를 <span className="text-accent">이해하는 방식</span>을 바꿔주는 서비스입니다.
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
            좋은 보호자가 되고 싶은 마음,<br />
            저희가 함께하겠습니다.
          </p>
          <p className="text-muted text-[13px]">
            멍냥사주 팀 드림 🐕🐈
          </p>
        </motion.div>
      </div>
    </section>
  );
}

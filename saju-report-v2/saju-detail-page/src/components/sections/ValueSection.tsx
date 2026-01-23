import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, listItem, viewportOnce } from '../../animations/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { valueContent } from '../../content/content';
import { SectionTitle, Card } from '../ui';
import { Clock, PawPrint, CalendarHeart } from 'lucide-react';

// Helper to render text with Hanja in different font
function renderWithHanja(text: string) {
  // Match Hanja characters in parentheses
  const parts = text.split(/(\([一-龯]+\))/g);
  return parts.map((part, i) => {
    if (/^\([一-龯]+\)$/.test(part)) {
      return <span key={i} className="font-sans">{part}</span>;
    }
    return part;
  });
}

export function ValueSection() {
  const prefersReducedMotion = useReducedMotion();
  const { features, analysisItems } = valueContent;

  const featureIcons = [
    <Clock size={20} className="text-accent" />,
    <PawPrint size={20} className="text-accent" />,
    <CalendarHeart size={20} className="text-accent" />,
  ];

  return (
    <section className="relative px-6 py-14 md:py-20 overflow-hidden z-10">
      <div className="max-w-md mx-auto text-center">
        <SectionTitle subtitle="재미로 보셔도 됩니다. 하지만 분석은 '진짜'입니다.">
          사주, 우리 아이를 이해하는<br />
          가장 따뜻한 언어
        </SectionTitle>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-muted text-[15px] leading-[1.8] mb-8"
        >
          반려동물 사주는 단순한 점술이나 미신이 아닙니다.<br /><br />
          오랜 시간 축적된 <strong className="text-foreground">동양 명리학의 해석 체계</strong>를<br />
          반려동물의 생애 주기와 종별 특성에 맞게 재해석한<br />
          <strong className="text-foreground">체계적인 분석 시스템</strong>입니다.
        </motion.p>

        {/* Callout */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="bg-accent/20 border border-accent/30 rounded-[20px] p-6 mb-10"
        >
          <p className="font-serif font-semibold text-foreground text-[17px] mb-3">
            "점<span className="font-sans">(占)</span>이 아니라 분석<span className="font-sans">(分析)</span>입니다."
          </p>
          <p className="text-muted text-[14px] leading-[1.7]">
            만세력 알고리즘 + 종별 기질 특성 + 생애 주기 환산<br />
            → 체계적인 접근으로 우리 아이의 타고난 성향을 읽어냅니다.
          </p>
        </motion.div>

        {/* Features */}
        <motion.h3
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="font-serif font-semibold text-foreground text-[18px] mb-6"
        >
          🏆 멍냥사주만의 3가지 차별점
        </motion.h3>

        <div className="space-y-5 mb-10 text-left">
          {features.map((feature, index) => (
            <Card key={feature.id} variant="elevated">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center shrink-0">
                  {featureIcons[index]}
                </div>
                <h4 className="font-semibold text-foreground text-[15px]">
                  {index + 1}. {renderWithHanja(feature.title)}
                </h4>
              </div>
              <p className="text-muted text-[14px] leading-[1.75] whitespace-pre-line mb-3">
                {feature.description}
              </p>
              {'examples' in feature && feature.examples && (
                <ul className="space-y-2 mb-3">
                  {feature.examples.map((ex, i) => (
                    <li
                      key={i}
                      className="text-muted text-[13px] leading-[1.6] pl-4 border-l-2 border-accent/40"
                    >
                      {ex}
                    </li>
                  ))}
                </ul>
              )}
              {'sub' in feature && feature.sub && (
                <p className="text-muted text-[14px] leading-[1.7]">
                  {feature.sub}
                </p>
              )}
              {'quote' in feature && feature.quote && (
                <p className="text-foreground text-[14px] italic mt-3 bg-accent/20 rounded-[12px] px-4 py-3">
                  {feature.quote}
                </p>
              )}
            </Card>
          ))}
        </div>

        {/* Analysis Items */}
        <motion.h3
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="font-serif font-semibold text-foreground text-[18px] mb-5"
        >
          💡 사주 분석으로 알 수 있는 것들
        </motion.h3>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : staggerContainer}
          className="bg-card border border-border/60 rounded-[20px] overflow-hidden shadow-card text-center"
        >
          {analysisItems.map((item, index) => (
            <motion.div
              key={item.label}
              variants={prefersReducedMotion ? { hidden: {}, visible: {} } : listItem}
              className={`px-5 py-2.5 ${index < analysisItems.length - 1 ? 'border-b border-border/60' : ''}`}
            >
              <p className="font-medium text-foreground text-[14px] mb-0.5">{item.label}</p>
              <p className="text-muted text-[13px] leading-[1.5]">{item.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

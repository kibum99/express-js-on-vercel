import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, listItem, viewportOnce } from '../../../animations/variants';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { chemistryValueContent } from '../../../content/chemistryContent';
import { SectionTitle, Card } from '../../ui';
import { ArrowRightLeft, Puzzle, Shield } from 'lucide-react';

export function ChemistryValueSection() {
  const prefersReducedMotion = useReducedMotion();
  const { features, analysisItems } = chemistryValueContent;

  const featureIcons = [
    <ArrowRightLeft size={20} className="text-accent" />,
    <Puzzle size={20} className="text-accent" />,
    <Shield size={20} className="text-accent" />,
  ];

  return (
    <section className="relative px-6 py-14 md:py-20 overflow-hidden z-10">
      <div className="max-w-md mx-auto text-center">
        <SectionTitle subtitle="동양 명리학의 오행 상생·상극 원리를 기반으로 체계적으로 분석합니다.">
          궁합, 운명적 만남을<br />
          확인하는 과학
        </SectionTitle>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="text-muted text-[15px] leading-[1.8] mb-8"
        >
          반려동물과의 궁합 분석은 단순한 재미가 아닙니다.<br /><br />
          <strong className="text-foreground">목·화·토·금·수 오행의 상생·상극</strong> 원리로<br />
          두 존재 사이의 에너지 흐름을<br />
          <strong className="text-foreground">체계적으로 분석</strong>합니다.
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
            "운명이라는 단어에 담긴 과학적 원리"
          </p>
          <p className="text-muted text-[14px] leading-[1.7]">
            목<span className="font-sans">(木)</span>·화<span className="font-sans">(火)</span>·토<span className="font-sans">(土)</span>·금<span className="font-sans">(金)</span>·수<span className="font-sans">(水)</span> 오행의 상생·상극<br />
            → 서로의 기운이 어떻게 조화를 이루는지 분석합니다.
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
          🏆 멍냥사주 궁합 분석의 3가지 핵심
        </motion.h3>

        <div className="space-y-5 mb-10 text-left">
          {features.map((feature, index) => (
            <Card key={feature.id} variant="elevated">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center shrink-0">
                  {featureIcons[index]}
                </div>
                <h4 className="font-semibold text-foreground text-[15px]">
                  {index + 1}. {feature.title}
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
          💡 궁합 분석으로 알 수 있는 것들
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

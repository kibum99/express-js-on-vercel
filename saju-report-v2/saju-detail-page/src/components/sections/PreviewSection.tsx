import { motion } from 'framer-motion';
import { staggerContainer, listItem, viewportOnce } from '../../animations/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { previewContent } from '../../content/content';
import { SectionTitle, Card, ImagePlaceholder } from '../ui';
import manselyeokImage from '../../assets/manselyeok.png';
import sajuPattern from '../../assets/figma/patterns/pet-items-pattern.png';

export function PreviewSection() {
  const prefersReducedMotion = useReducedMotion();
  const { manselyeok, oheng, guide } = previewContent;

  return (
    <section className="relative px-6 py-14 md:py-20 overflow-hidden">
      {/* Pet Items Pattern Background - 은은하게만 */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${sajuPattern})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '220px',
          opacity: 0.025,
        }}
        aria-hidden="true"
      />
      
      <div className="relative max-w-md mx-auto text-center z-10">
        <SectionTitle subtitle="단순히 '성격이 좋아요'로 끝나는 게 아닙니다. 일상에서 바로 활용할 수 있는 구체적인 정보와 흥미로운 풀이를 제공해드려요.">
          이런 것까지 나온다고?<br />
          우리 아이 맞춤 설명서!
        </SectionTitle>

        {/* Manselyeok */}
        <Card className="mb-6 text-left" variant="elevated">
          <h3 className="font-serif font-semibold text-foreground text-[17px] mb-4 text-center">
            📜 {manselyeok.title}
          </h3>
          <img
            src={manselyeokImage}
            alt="만세력 차트 예시"
            className="w-full rounded-[14px] mb-4"
            loading="lazy"
          />
          <p className="text-muted text-[14px] leading-[1.7] mb-4 text-center">
            태어난 연·월·일·시를 바탕으로<br />
            아이의 사주 원국을 보여주는 기본 차트입니다.
          </p>
          <p className="text-[14px] font-medium text-foreground mb-3">
            분석 결과에서는 다음 내용을 확인할 수 있어요:
          </p>
          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={prefersReducedMotion ? { hidden: {}, visible: {} } : staggerContainer}
            className="space-y-2 mb-4"
          >
            {manselyeok.items.map((item, i) => (
              <motion.li
                key={i}
                variants={prefersReducedMotion ? { hidden: {}, visible: {} } : listItem}
                className="text-[13px] pl-4 border-l-2 border-accent/40"
              >
                <span className="font-medium text-foreground">{item.title}</span>
                <span className="text-muted"> : {item.desc}</span>
              </motion.li>
            ))}
          </motion.ul>
          <div className="bg-accent-light/70 rounded-[14px] px-4 py-3 text-center">
            <p className="text-foreground text-[13px] leading-[1.7]">
              이 복잡한 차트를 저희가 <strong>쉽게 풀어드립니다.</strong><br />
              전문 용어 없이도 우리 아이의 기질을 한눈에 이해할 수 있어요.
            </p>
          </div>
        </Card>

        {/* Oheng */}
        <Card className="mb-6 text-left" variant="elevated">
          <h3 className="font-serif font-semibold text-foreground text-[17px] mb-4 text-center">
            📊 {oheng.title}
          </h3>
          <ImagePlaceholder alt="오행 분석 그래프 예시" aspectRatio="16/9" className="mb-4" />
          <p className="text-muted text-[14px] leading-[1.7] mb-4 text-center">
            우리 아이가 가진<br />
            목<span className="font-sans">(木)</span>·화<span className="font-sans">(火)</span>·토<span className="font-sans">(土)</span>·금<span className="font-sans">(金)</span>·수<span className="font-sans">(水)</span><br />
            에너지의 분포를 한눈에 볼 수 있어요.
          </p>
          <ul className="space-y-2 mb-4">
            {oheng.points.map((point, i) => (
              <li key={i} className="text-muted text-[14px] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                {point}
              </li>
            ))}
          </ul>
          <div className="space-y-2">
            {oheng.examples.map((ex, i) => (
              <p key={i} className="text-foreground text-[13px] italic bg-accent-light/70 rounded-[12px] px-4 py-3 leading-[1.7]">
                {ex}
              </p>
            ))}
          </div>
        </Card>

        {/* Guide */}
        <Card className="text-left" variant="elevated">
          <h3 className="font-serif font-semibold text-foreground text-[17px] mb-4 text-center">
            🎯 {guide.title}
          </h3>
          <p className="text-muted text-[14px] leading-[1.7] mb-4 text-center">
            사주 결과를 바탕으로,<br />
            보호자가 <strong className="text-foreground">지금 당장 실천할 수 있는 팁</strong>을 알려드립니다.
          </p>
          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={prefersReducedMotion ? { hidden: {}, visible: {} } : staggerContainer}
            className="space-y-2"
          >
            {guide.items.map((item, i) => (
              <motion.li
                key={i}
                variants={prefersReducedMotion ? { hidden: {}, visible: {} } : listItem}
                className="text-muted text-[13px] pl-4 border-l-2 border-accent/50 leading-[1.7]"
              >
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </Card>
      </div>
    </section>
  );
}

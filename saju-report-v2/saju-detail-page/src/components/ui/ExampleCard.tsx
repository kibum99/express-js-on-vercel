import { motion } from 'framer-motion';
import { cardVariant, viewportOnce } from '../../animations/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { ExampleData } from '../../types';
import whiteDogHeadImg from '../../assets/figma/characters/white-dog-2-head.png';

interface ExampleCardProps {
  data: ExampleData;
  className?: string;
  profileImage?: string;
  /** birthDate를 여러 줄로 표시할지 여부 */
  multiLineBirthDate?: boolean;
  /** 맞춤 양육 포인트 대신 사용할 타이틀 */
  tipsTitle?: string;
}

export function ExampleCard({ data, className = '', profileImage, multiLineBirthDate = false, tipsTitle }: ExampleCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={prefersReducedMotion ? { hidden: {}, visible: {} } : cardVariant}
      className={`bg-card rounded-[20px] border border-border/60 shadow-card overflow-hidden ${className}`}
    >
      {/* Profile Header */}
      <div className="bg-accent-light px-5 py-4 border-b border-accent/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-accent/10 overflow-hidden shrink-0 flex items-center justify-center">
            <img 
              src={profileImage || whiteDogHeadImg} 
              alt="강아지 프로필" 
              className="w-10 h-10 object-contain"
            />
          </div>
          <div className="text-left">
            <h4 className="font-serif font-bold text-foreground text-[18px]">
              {data.name}
            </h4>
            {multiLineBirthDate ? (
              <p className="text-muted text-[13px] whitespace-pre-line leading-[1.5]">
                {data.breed}
                {'\n'}{data.birthDate}
              </p>
            ) : (
              <p className="text-muted text-[13px]">
                {data.breed}, {data.birthDate}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Content */}
      <div className="p-5 space-y-4 text-center">
        <div>
          <p className="text-foreground text-[14px] leading-[1.85] whitespace-pre-line">
            {data.analysis.join('\n')}
          </p>
        </div>

        {/* Tips */}
        <div className="pt-4 border-t border-border/60">
          <p className="font-serif font-bold text-foreground mb-4 text-[16px]">
            💡 {tipsTitle || `${data.name} 맞춤 양육 포인트`}
          </p>
          <ul className="space-y-3 inline-block text-left">
            {data.tips.map((tip, index) => (
              <li
                key={index}
                className="flex items-start gap-2.5 text-muted text-[14px] leading-[1.6]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, viewportOnce } from '../../animations/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { reportContent } from '../../content/content';
import { SectionTitle, Card } from '../ui';
import {
  Users,
  Heart,
  Activity,
  Sparkles,
  GraduationCap,
  Briefcase,
  Coins,
  Stethoscope,
  Clock,
} from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  family: <Users size={18} />,
  personality: <Heart size={18} />,
  behavior: <Activity size={18} />,
  compatibility: <Sparkles size={18} />,
  learning: <GraduationCap size={18} />,
  career: <Briefcase size={18} />,
  wealth: <Coins size={18} />,
  health: <Stethoscope size={18} />,
  timing: <Clock size={18} />,
};

export function ReportSection() {
  const prefersReducedMotion = useReducedMotion();
  const { categories } = reportContent;

  return (
    <section className="relative px-6 py-14 md:py-20 z-10">
      <div className="max-w-md mx-auto text-center">
        <SectionTitle subtitle="한 번의 분석으로, 우리 아이의 과거·현재·미래를 모두 담은 프리미엄 성향 분석 리포트를 받아보세요.">
          약 30,000자의<br />
          깊이 있는 리포트
        </SectionTitle>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
          className="bg-accent/20 rounded-[16px] px-5 py-4 mb-8"
        >
          <p className="text-foreground text-[15px] font-medium">
            "이렇게까지 자세하게?"라는 반응이 가장 많습니다.
          </p>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={prefersReducedMotion ? { hidden: {}, visible: {} } : staggerContainer}
          className="space-y-4 text-left"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeUp}
              transition={{ delay: index * 0.05 }}
            >
              <Card animate={false} variant="elevated">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-accent-light flex items-center justify-center text-accent shrink-0">
                    {categoryIcons[category.id]}
                  </div>
                  <h4 className="font-semibold text-foreground text-[15px]">
                    {index + 1}. {category.title}
                  </h4>
                </div>
                <ul className="space-y-1.5 pl-12">
                  {category.questions.map((q, i) => (
                    <li key={i} className="text-muted text-[13px] flex items-start gap-2 leading-[1.6]">
                      <span className="text-accent font-medium shrink-0">Q.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

import {
  HeroSection,
  ProblemSection,
  EmpathySection,
  SolutionSection,
  ValueSection,
  PreviewSection,
  DifferentiationSection,
  ReviewsSection,
  ReportSection,
  CtaSection,
} from '../components/sections';
import pawPattern from '../assets/figma/patterns/paw-pattern.png';

export function Landing() {
  return (
    <main className="min-h-screen bg-background relative">
      {/* Global Paw Pattern Background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url(${pawPattern})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '1200px',
          opacity: 0.2,
        }}
        aria-hidden="true"
      />

      {/* Hero */}
      <HeroSection />

      {/* Problem */}
      <ProblemSection />

      {/* Empathy */}
      <EmpathySection />

      {/* Solution + Example */}
      <SolutionSection />

      {/* Reviews - 별도 배경 (Paw Pattern 제외) */}
      <div className="relative z-10 bg-[#f8f6f3]">
        <ReviewsSection />
      </div>

      {/* Value Proposition */}
      <ValueSection />

      {/* Preview */}
      <PreviewSection />

      {/* Differentiation */}
      <DifferentiationSection />

      {/* Report Structure */}
      <ReportSection />

      {/* CTA */}
      <CtaSection />
    </main>
  );
}

import {
  ChemistryHeroSection,
  ChemistryProblemSection,
  ChemistryEmpathySection,
  ChemistrySolutionSection,
  ChemistryValueSection,
  ChemistryPreviewSection,
  ChemistryDifferentiationSection,
  ChemistryReviewsSection,
  ChemistryReportSection,
  ChemistryCtaSection,
} from '../components/sections/chemistry';
import pawPattern from '../assets/figma/patterns/paw-pattern.png';

export function ChemistryLanding() {
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
      <ChemistryHeroSection />

      {/* Problem */}
      <ChemistryProblemSection />

      {/* Empathy */}
      <ChemistryEmpathySection />

      {/* Solution + Example */}
      <ChemistrySolutionSection />

      {/* Reviews - 별도 배경 (Paw Pattern 제외) */}
      <div className="relative z-10 bg-[#f8f6f3]">
        <ChemistryReviewsSection />
      </div>

      {/* Value Proposition */}
      <ChemistryValueSection />

      {/* Preview */}
      <ChemistryPreviewSection />

      {/* Differentiation */}
      <ChemistryDifferentiationSection />

      {/* Report Structure */}
      <ChemistryReportSection />

      {/* CTA */}
      <ChemistryCtaSection />
    </main>
  );
}

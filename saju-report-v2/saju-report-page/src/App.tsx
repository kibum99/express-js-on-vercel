import { useState } from 'react';
import { ReportProvider, useReportContext } from './contexts/ReportContext';
import { MainSection, IntroSection, ChapterStartSection, ChapterDescSection, ChapterContentSection } from './components/sections';
import { ChapterTabs } from './components/ui';
import { useScrollSpy } from './hooks/useScrollSpy';

function AppContent() {
  const { reportData, staticData, loading, error, petName, ownerName } = useReportContext();
  const [showIntro, setShowIntro] = useState(false);
  const [showChapters, setShowChapters] = useState(false);
  const [visibleContentChapters, setVisibleContentChapters] = useState<Set<number>>(new Set());

  const chapterCount = staticData.chapters.length;
  const { activeIndex, isVisible, chapterRefs, scrollToChapter } = useScrollSpy({
    chapterCount,
    headerHeight: 60,
  });

  const petPersona = reportData?.persona?.find((p) => p.type === 'pet');
  const petProfileImg = petPersona?.profile_image || '/assets/img/char/intro.png';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted">리포트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-red-500 mb-4">데이터를 불러오는 중 오류가 발생했습니다.</p>
          <p className="text-muted text-sm">{error?.message}</p>
        </div>
      </div>
    );
  }

  const handleStart = () => {
    setShowIntro(true);
    setShowChapters(true);
    setTimeout(() => {
      const introSection = document.getElementById('intro-section');
      if (introSection) {
        const headerHeight = 60;
        const targetPosition = introSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleShowContent = (chapterIndex: number) => {
    setVisibleContentChapters((prev) => new Set(prev).add(chapterIndex));
    setTimeout(() => {
      const contentSection = document.getElementById(`section-chapter-content-${chapterIndex}`);
      if (contentSection) {
        const headerHeight = 60;
        const targetPosition = contentSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      {/* Global Chapter Tabs */}
      {isVisible && showChapters && (
        <ChapterTabs
          chapters={staticData.chapters}
          activeIndex={activeIndex}
          onTabClick={scrollToChapter}
        />
      )}

      {/* Main Section */}
      <MainSection
        staticData={staticData}
        reportData={reportData}
        petName={petName}
        onStart={handleStart}
      />

      {/* Intro Section */}
      {showIntro && (
        <div id="intro-section">
          <IntroSection
            staticData={staticData}
            reportData={reportData}
            petName={petName}
            ownerName={ownerName}
          />
        </div>
      )}

      {/* Chapters */}
      {showChapters && (
        <div>
          {staticData.chapters.map((chapter, idx) => {
            const reportContent = reportData.report_contents[idx];
            if (!reportContent) return null;

            return (
              <div
                key={chapter.id}
                ref={(el) => {
                  if (el) chapterRefs.current[idx] = el;
                }}
                id={`chapter-wrapper-${idx}`}
                className="border-t border-border/50"
              >
                <ChapterStartSection
                  chapter={chapter}
                  chapterIndex={idx}
                  petName={petName}
                />
                <ChapterDescSection
                  chapter={chapter}
                  chapterIndex={idx}
                  reportContent={reportContent}
                  staticData={staticData}
                  petName={petName}
                  petProfileImg={petProfileImg}
                  onShowContent={() => handleShowContent(idx)}
                />
                {visibleContentChapters.has(idx) && (
                  <ChapterContentSection
                    reportContent={reportContent}
                    staticData={staticData}
                    chapterIndex={idx}
                    petName={petName}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {showChapters && (
        <footer className="px-6 py-16 text-center bg-background border-t border-border/50">
          <p className="text-sm text-muted">© 2026 사주 리포트. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ReportProvider>
      <AppContent />
    </ReportProvider>
  );
}

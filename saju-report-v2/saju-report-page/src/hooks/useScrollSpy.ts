import { useState, useEffect, useRef } from 'react';

interface UseScrollSpyOptions {
  chapterCount: number;
  headerHeight?: number;
  threshold?: number;
}

export function useScrollSpy({ chapterCount, headerHeight = 44, threshold = 10 }: UseScrollSpyOptions) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      // 첫 번째 챕터 시작 위치 확인
      const firstChapter = chapterRefs.current[0];
      if (!firstChapter) return;

      const rect = firstChapter.getBoundingClientRect();
      
      // 탭 가시성 제어
      if (rect.top <= headerHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        return;
      }

      // 활성 챕터 인덱스 계산
      let currentActiveIdx = 0;
      
      for (let i = 0; i < chapterCount; i++) {
        const chapterEl = chapterRefs.current[i];
        if (!chapterEl) continue;
        
        const chapterRect = chapterEl.getBoundingClientRect();
        if (chapterRect.top <= headerHeight + threshold) {
          currentActiveIdx = i;
        } else {
          break;
        }
      }
      
      setActiveIndex(currentActiveIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 초기 실행

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [chapterCount, headerHeight, threshold]);

  const scrollToChapter = (index: number) => {
    const chapterEl = chapterRefs.current[index];
    if (!chapterEl) return;

    const targetPosition =
      chapterEl.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
  };

  return {
    activeIndex,
    isVisible,
    chapterRefs,
    scrollToChapter,
  };
}

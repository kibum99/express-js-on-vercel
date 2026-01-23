import { useEffect, useRef } from 'react';
import type { Chapter } from '../../types';
import { wrapSpecialCharacters } from '../../utils/template';

interface ChapterTabsProps {
  chapters: Chapter[];
  activeIndex: number;
  onTabClick: (index: number) => void;
  className?: string;
}

export function ChapterTabs({
  chapters,
  activeIndex,
  onTabClick,
  className = '',
}: ChapterTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && activeIndex >= 0) {
      const activeTab = containerRef.current.children[activeIndex] as HTMLElement;
      if (activeTab) {
        activeTab.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      className={`flex overflow-x-auto no-scrollbar gap-3 px-3 py-3 bg-white/85 backdrop-blur-md border-b border-black/5 sticky top-0 z-50 transition-all duration-300 ${className}`}
    >
      {chapters.map((chapter, index) => (
        <button
          key={chapter.id}
          onClick={() => onTabClick(index)}
          className={`px-4 py-2 rounded-[20px] text-sm font-medium transition-all duration-300 flex-shrink-0 border ${
            activeIndex === index
              ? 'bg-accent-gradient text-white shadow-md scale-105 border-transparent'
              : 'bg-transparent text-muted border-transparent hover:bg-gray-100'
          }`}
        >
          {wrapSpecialCharacters(chapter.title)}
        </button>
      ))}
    </div>
  );
}

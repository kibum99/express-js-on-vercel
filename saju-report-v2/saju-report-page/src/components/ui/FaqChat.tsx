import { useState } from 'react';
import type { Chapter } from '../../types';
import { interpolateTemplate, wrapSpecialCharacters } from '../../utils/template';

interface FaqChatProps {
  chapter: Chapter;
  petName: string;
  petProfileImg: string;
  onEnd: () => void;
}

interface ChatMessage {
  id: string;
  type: 'question' | 'answer';
  text: string;
  avatar: string;
  isAnswered?: boolean;
}

export function FaqChat({ chapter, petName, petProfileImg, onEnd }: FaqChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return (chapter.faqs || []).map((faq, idx) => ({
      id: `faq-${idx}`,
      type: 'question',
      text: interpolateTemplate(faq.question, { petName }),
      avatar: petProfileImg,
      isAnswered: false,
    }));
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [showEndButton, setShowEndButton] = useState(true);

  const handleFaqClick = async (faqId: string) => {
    if (isTyping) return;

    const faqIndex = parseInt(faqId.split('-')[1]);
    const faq = chapter.faqs?.[faqIndex];
    if (!faq) return;

    setIsTyping(faqId);

    const answerText = interpolateTemplate(faq.answer, { petName });
    const wrappedText = wrapSpecialCharacters(answerText);

    // HTML 태그와 일반 텍스트를 분리하는 정규식
    const tokens = wrappedText.match(/<[^>]+>|[^<]+/g) || [];

    // 답변 메시지 초기화
    setAnswers((prev) => ({ ...prev, [faqId]: '' }));

    // 타이핑 효과 시뮬레이션
    let displayedText = '';
    for (const token of tokens) {
      if (token.startsWith('<')) {
        // 태그는 한 번에 추가
        displayedText += token;
        setAnswers((prev) => ({ ...prev, [faqId]: displayedText }));
      } else {
        // 일반 텍스트는 한 글자씩 추가
        for (let i = 0; i < token.length; i++) {
          displayedText += token[i];
          setAnswers((prev) => ({ ...prev, [faqId]: displayedText }));
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
      }
    }

    setMessages((prev) =>
      prev.map((msg) => (msg.id === faqId ? { ...msg, isAnswered: true } : msg))
    );
    setIsTyping(null);
  };

  const handleEndClick = () => {
    setShowEndButton(false);
    onEnd();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-8">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-4">
            {/* Question */}
            <div className="flex items-start gap-3 flex-row-reverse">
              <img
                src={msg.avatar}
                alt="Pet"
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex flex-col items-end gap-2 max-w-[80%]">
                <div className="rounded-2xl px-4 py-3 bg-gray-50 text-foreground text-right border border-accent/30">
                  <p
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: msg.text }}
                  />
                </div>
                {!msg.isAnswered && (
                  <button
                    onClick={() => handleFaqClick(msg.id)}
                    disabled={!!isTyping}
                    className="flex items-center gap-1 text-xs font-bold text-accent hover:text-accent/80 transition-colors disabled:opacity-50"
                  >
                    질문하고 답변보기 →
                  </button>
                )}
              </div>
            </div>

            {/* Answer */}
            {(msg.isAnswered || isTyping === msg.id) && (
              <div className="flex items-start gap-3 flex-row">
                <img
                  src={chapter.teller_icon.replace('./assets', '/assets')}
                  alt="Teller"
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
                <div className="rounded-2xl px-4 py-3 max-w-[80%] bg-accent-light text-foreground">
                  <p
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: answers[msg.id] || '' }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="pt-4">
        {showEndButton && (
          <button
            onClick={handleEndClick}
            disabled={!!isTyping}
            className="w-full flex flex-col items-center justify-between gap-2 px-4 py-3 bg-accent-light border border-accent/30 rounded-xl text-sm font-bold text-accent transition-all hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <svg
              className="w-6 h-6 animate-bounce-low group-hover:scale-110 transition-transform flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
              />
            </svg>
            <span className="text-left">더 궁금한 점이 없어요. 이제 분석 내용을 보여주세요.</span>
          </button>
        )}
      </div>
    </div>
  );
}

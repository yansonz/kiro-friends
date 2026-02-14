'use client';

// 퀴즈 CTA 버튼 컴포넌트
// URL에 ?completed=true가 있으면 "다시 검사하기", 없으면 "나도 내 유형 알아보기"

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useEffect, useState } from 'react';
import { trackCTAClick } from '@/lib/analytics';

export default function QuizCTAButton() {
  const searchParams = useSearchParams();
  const isCompleted = searchParams.get('completed') === 'true';
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    trackCTAClick(
      isCompleted ? 'retake_quiz' : 'discover_type',
      'result_page'
    );
  };

  // 클라이언트에서만 번역된 텍스트 표시
  if (!mounted) {
    return (
      <section data-testid="result-quiz-cta" className="mb-8 text-center">
        <Link
          href="/"
          onClick={handleClick}
          className="inline-block min-h-[48px] rounded-full bg-gradient-to-r from-purple-600 to-orange-500
                     px-6 py-3 text-base font-semibold text-white shadow-lg shadow-purple-700/30
                     transition-all hover:scale-105 hover:shadow-purple-600/40 active:scale-95"
        >
          {isCompleted ? '🔄 다시 검사하기' : '🔮 나도 내 유형 알아보기'}
        </Link>
      </section>
    );
  }

  return (
    <section data-testid="result-quiz-cta" className="mb-8 text-center">
      <Link
        href="/"
        onClick={handleClick}
        className="inline-block min-h-[48px] rounded-full bg-gradient-to-r from-purple-600 to-orange-500
                   px-6 py-3 text-base font-semibold text-white shadow-lg shadow-purple-700/30
                   transition-all hover:scale-105 hover:shadow-purple-600/40 active:scale-95"
      >
        {isCompleted ? t('result.retake') : t('result.discover')}
      </Link>
    </section>
  );
}

import { Suspense } from 'react';
import QuizCTAButton from './QuizCTAButton';
import Link from 'next/link';

// Suspense fallback 컴포넌트
function QuizCTAButtonFallback() {
  return (
    <section data-testid="result-quiz-cta" className="mb-8 text-center">
      <Link
        href="/"
        className="inline-block min-h-[48px] rounded-full bg-gradient-to-r from-purple-600 to-orange-500
                   px-6 py-3 text-base font-semibold text-white shadow-lg shadow-purple-700/30
                   transition-all hover:scale-105 hover:shadow-purple-600/40 active:scale-95"
      >
        🔮 나도 내 유형 알아보기
      </Link>
    </section>
  );
}

export default function QuizCTAButtonWrapper() {
  return (
    <Suspense fallback={<QuizCTAButtonFallback />}>
      <QuizCTAButton />
    </Suspense>
  );
}

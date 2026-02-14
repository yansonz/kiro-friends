'use client';

// 결과 페이지 클라이언트 컴포넌트
// 캐릭터의 4축 값을 레이더 차트로 렌더링한다
// 퀴즈 완료 여부를 추적한다

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import RadarChart from '@/components/RadarChart';
import type { AxisScores } from '@/lib/types';

interface ResultPageClientProps {
  scores: AxisScores;
  characterSlug: string;
}

function ResultPageClientInner({ scores, characterSlug }: ResultPageClientProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    // 퀴즈 완료 후 이동인지 확인
    const isCompleted = searchParams.get('completed') === 'true';
    
    if (isCompleted) {
      // 퀴즈 완료 후 결과 페이지 조회
      console.log('[Analytics] Quiz Completed - Result View', {
        character: characterSlug,
        timestamp: new Date().toISOString(),
        source: 'quiz_completion',
      });
    } else {
      // 직접 URL 접근
      console.log('[Analytics] Direct Result View', {
        character: characterSlug,
        timestamp: new Date().toISOString(),
        source: 'direct_url',
      });
    }
  }, [searchParams, characterSlug]);

  return <RadarChart scores={scores} />;
}

export default function ResultPageClient(props: ResultPageClientProps) {
  return (
    <Suspense fallback={<RadarChart scores={props.scores} />}>
      <ResultPageClientInner {...props} />
    </Suspense>
  );
}

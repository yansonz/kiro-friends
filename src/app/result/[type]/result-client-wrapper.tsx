'use client';

// 결과 페이지 클라이언트 래퍼
// 캐릭터 슬라이더의 잠금 상태를 관리

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { CharacterProfile } from '@/lib/types';
import ShareButtons from '@/components/ShareButtons';
import CharacterSlider from '@/components/CharacterSlider';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { trackResultLanding, trackRadarChartView } from '@/lib/analytics';

interface ResultClientWrapperProps {
  character: CharacterProfile;
  characters: CharacterProfile[];
  resultUrl: string;
}

function ResultClientContent({
  character,
  characters,
  resultUrl,
}: ResultClientWrapperProps) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [isSliderUnlocked, setIsSliderUnlocked] = useState(false);

  // 결과 페이지 랜딩 추적
  useEffect(() => {
    const completed = searchParams.get('completed');
    let landingType: 'completed' | 'organic' | 'shared' = 'organic';
    
    if (completed === 'true') {
      landingType = 'completed';
    } else if (document.referrer && !document.referrer.includes(window.location.hostname)) {
      landingType = 'shared';
    }
    
    trackResultLanding(character.slug, landingType);
    
    // 레이더 차트 뷰 추적 (engagement 측정)
    trackRadarChartView(character.slug);
  }, [character.slug, searchParams]);

  const handleLinkCopied = () => {
    setIsSliderUnlocked(true);
  };

  return (
    <>
      {/* 공유 버튼 */}
      <section data-testid="result-share-buttons" className="mb-8">
        <h3 className="text-base font-bold text-purple-300 mb-3 text-center">
          {t('result.shareTitle')}
        </h3>
        <ShareButtons
          character={character}
          resultUrl={resultUrl}
          onLinkCopied={handleLinkCopied}
        />
      </section>

      {/* 캐릭터 슬라이더 */}
      <section data-testid="result-character-slider" className="mb-8">
        <CharacterSlider
          characters={characters}
          currentType={character.slug}
          isUnlocked={isSliderUnlocked}
        />
      </section>
    </>
  );
}

export default function ResultClientWrapper(props: ResultClientWrapperProps) {
  return (
    <Suspense fallback={
      <>
        <section data-testid="result-share-buttons" className="mb-8">
          <h3 className="text-base font-bold text-purple-300 mb-3 text-center">
            결과 공유하기
          </h3>
        </section>
        <section data-testid="result-character-slider" className="mb-8">
          <h3 className="text-base font-bold text-purple-300 mb-3 text-center">
            모든 캐릭터 보기
          </h3>
        </section>
      </>
    }>
      <ResultClientContent {...props} />
    </Suspense>
  );
}

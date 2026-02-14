'use client';

// 결과 페이지 클라이언트 래퍼
// 캐릭터 슬라이더의 잠금 상태를 관리

import { useState } from 'react';
import type { CharacterProfile } from '@/lib/types';
import ShareButtons from '@/components/ShareButtons';
import CharacterSlider from '@/components/CharacterSlider';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface ResultClientWrapperProps {
  character: CharacterProfile;
  characters: CharacterProfile[];
  resultUrl: string;
}

export default function ResultClientWrapper({
  character,
  characters,
  resultUrl,
}: ResultClientWrapperProps) {
  const { t } = useTranslation();
  const [isSliderUnlocked, setIsSliderUnlocked] = useState(false);

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

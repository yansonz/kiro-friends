'use client';

// 9개 캐릭터 미리보기 슬라이드 컴포넌트
// 수평 스크롤 가능한 슬라이더로 모든 캐릭터를 compact 카드로 표시
// 현재 캐릭터는 하이라이트 처리, 각 카드는 해당 결과 페이지로 링크
// 자동 슬라이딩 및 무한 루프 기능
// 초기에는 blur 처리, 링크 복사 후 공개

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import type { CharacterProfile, CharacterSlug } from '@/lib/types';
import CharacterCard from './CharacterCard';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { trackCharacterSliderInteraction } from '@/lib/analytics';

interface CharacterSliderProps {
  characters: CharacterProfile[];
  currentType?: CharacterSlug;
  isUnlocked?: boolean; // blur 해제 여부
}

export default function CharacterSlider({ characters, currentType, isUnlocked = false }: CharacterSliderProps) {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollPosition = 0;
    let lastTimestamp = 0;
    const scrollSpeed = 30; // 픽셀/초
    const cardWidth = 128 + 12; // w-32 (128px) + gap-3 (12px)
    const totalWidth = cardWidth * characters.length;

    const animate = (timestamp: number) => {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
      }
      
      const deltaTime = (timestamp - lastTimestamp) / 1000; // 초 단위로 변환
      lastTimestamp = timestamp;
      
      scrollPosition += scrollSpeed * deltaTime;
      
      // 원본 배열 길이만큼 스크롤하면 처음으로 리셋
      if (scrollPosition >= totalWidth) {
        scrollPosition = 0;
      }
      
      container.scrollLeft = scrollPosition;
      animationRef.current = requestAnimationFrame(animate);
    };

    // 마우스 오버 시 애니메이션 일시정지
    const handleMouseEnter = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        lastTimestamp = 0; // 타임스탬프 리셋
      }
    };

    const handleMouseLeave = () => {
      lastTimestamp = 0; // 타임스탬프 리셋
      animationRef.current = requestAnimationFrame(animate);
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 애니메이션 시작
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [characters.length]);

  // 무한 루프를 위해 캐릭터 배열을 3번 복제
  const infiniteCharacters = [...characters, ...characters, ...characters];

  return (
    <section data-testid="character-slider" className="w-full">
      <h3 className="text-base font-bold text-purple-300 mb-3 text-center">
        {t('result.allCharacters')}
      </h3>

      {/* 안내 메시지 (blur 상태일 때만 표시) */}
      {!isUnlocked && (
        <p className="text-xs text-center text-gray-400 mb-3 leading-relaxed">
          {t('result.unlockMessage')}
        </p>
      )}

      {/* 수평 스크롤 컨테이너 - 자동 슬라이딩 */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className={`flex gap-3 overflow-x-auto pb-4 pt-2 px-1
                     scrollbar-thin scrollbar-thumb-purple-800 scrollbar-track-transparent
                     -mx-1 transition-all duration-500
                     ${!isUnlocked ? 'blur-md' : 'blur-0'}`}
          style={{ scrollBehavior: 'auto' }}
          data-testid="slider-container"
        >
          {infiniteCharacters.map((character, index) => {
            const isCurrent = character.slug === currentType;

            return (
              <Link
                key={`${character.slug}-${index}`}
                href={`/result/${character.slug}`}
                onClick={() => {
                  if (isUnlocked) {
                    trackCharacterSliderInteraction('click', character.slug);
                  }
                }}
                className={`flex-shrink-0 w-32 snap-center transition-all duration-300
                  ${isCurrent
                    ? 'ring-2 ring-purple-400 rounded-2xl scale-105 shadow-lg shadow-purple-500/30'
                    : 'opacity-70 hover:opacity-100'
                  }`}
                data-testid={index < characters.length ? `slider-item-${character.slug}` : undefined}
                aria-current={isCurrent ? 'true' : undefined}
                tabIndex={!isUnlocked ? -1 : undefined}
                aria-hidden={!isUnlocked ? 'true' : undefined}
              >
                <CharacterCard character={character} compact />
              </Link>
            );
          })}
        </div>

        {/* Blur 오버레이 (잠금 상태 표시) */}
        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto cursor-not-allowed">
            <div className="bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-500/30 pointer-events-none">
              <p className="text-sm text-purple-300 font-semibold">{t('result.locked')}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

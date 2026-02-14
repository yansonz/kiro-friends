'use client';

// 캐릭터 정보 카드 컴포넌트
// full 모드: 이모지, 유형명, 소개, 잘하는 점, 함정, 추천 Kiro 기능, AI 협업 팁, 시너지/긴장 캐릭터
// compact 모드: 이모지, 유형명, 부제, 한 줄 소개만 표시 (미리보기 슬라이드용)

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { CharacterProfile } from '@/lib/types';
import { getCharacterBySlug } from '@/data/characters';
import { useTranslation } from '@/lib/hooks/useTranslation';
import Toast from './Toast';

interface CharacterCardProps {
  character: CharacterProfile;
  compact?: boolean; // 미리보기 슬라이드용
}

export default function CharacterCard({ character, compact = false }: CharacterCardProps) {
  const { locale, t } = useTranslation();
  
  // 랜덤 선택된 기능들을 상태로 관리 (클라이언트에서만 랜덤 선택)
  const [selectedFeatures, setSelectedFeatures] = useState<typeof character.kiroFeatures>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  useEffect(() => {
    // 클라이언트에서만 랜덤 선택 실행
    const basicFeatures = character.kiroFeatures.filter(f => f.level === 'basic');
    const advancedFeatures = character.kiroFeatures.filter(f => f.level === 'advanced');
    
    // 배열을 랜덤하게 섞는 함수 (Fisher-Yates shuffle)
    const shuffleArray = <T,>(arr: T[]): T[] => {
      const shuffled = [...arr];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };
    
    const selectedBasic = shuffleArray(basicFeatures).slice(0, 1);
    const selectedAdvanced = shuffleArray(advancedFeatures).slice(0, 2);
    setSelectedFeatures([...selectedBasic, ...selectedAdvanced]);
  }, [character.kiroFeatures]);
  
  // compact 모드: 슬라이더 미리보기용 간략 카드
  if (compact) {
    return (
      <div
        className="text-center transition-all duration-300"
        data-testid="character-card-compact"
      >
        <div className="mb-2 flex justify-center" data-testid="character-emoji">
          <Image
            src={`/characters/${character.slug}.png`}
            alt={character.name[locale]}
            width={80}
            height={80}
            className="h-16 w-16 object-contain"
          />
        </div>
        <h3 className="text-sm font-bold text-purple-200" data-testid="character-name">
          {character.name[locale]}
        </h3>
        <p className="text-xs text-purple-400 mt-1" data-testid="character-title">
          {character.title[locale]}
        </p>
      </div>
    );
  }

  // 시너지/긴장 캐릭터 정보 조회
  const synergyCharacter = getCharacterBySlug(character.synergy);
  const tensionCharacter = getCharacterBySlug(character.tension);

  return (
    <div
      className="bg-gray-900/80 border border-purple-900/40 rounded-2xl p-4
                 shadow-xl shadow-purple-950/10"
      data-testid="character-card-full"
    >
      {/* 캐릭터 기본 정보: 이모지, 유형명, 부제, 한 줄 소개 (Req 6.1) */}
      <div className="text-center mb-6">
        <div 
          className="flex justify-center mb-3 animate-gentle-float" 
          data-testid="character-emoji"
        >
          <Image
            src={`/characters/${character.slug}.png`}
            alt={character.name[locale]}
            width={160}
            height={160}
            className="h-24 w-24 object-contain"
          />
        </div>
        <h2 className="text-xl font-bold text-purple-100" data-testid="character-name">
          {character.name[locale]}
        </h2>
        <p className="text-sm text-purple-400 font-medium mt-1" data-testid="character-title">
          {character.title[locale]}
        </p>
        <p className="text-sm text-gray-300 mt-2 max-w-md mx-auto" data-testid="character-description">
          {character.description[locale]}
        </p>
      </div>

      {/* 잘하는 점 / 빠지기 쉬운 함정 (Req 6.3) */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {/* 잘하는 점 */}
        <div
          className="bg-green-950/30 border border-green-800/30 rounded-xl p-4"
          data-testid="strengths-section"
        >
          <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2 text-sm">
            <span>✨</span> {t('result.strengths')}
          </h3>
          <ul className="space-y-1.5">
            {character.strengths[locale].map((strength, index) => (
              <li key={index} className="text-gray-300 text-xs flex items-start gap-2">
                <span className="text-green-500 mt-0.5 shrink-0">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 빠지기 쉬운 함정 */}
        <div
          className="bg-red-950/30 border border-red-800/30 rounded-xl p-4"
          data-testid="pitfalls-section"
        >
          <h3 className="text-orange-400 font-bold mb-2 flex items-center gap-2 text-sm">
            <span>⚠️</span> {t('result.pitfalls')}
          </h3>
          <ul className="space-y-1.5">
            {character.pitfalls[locale].map((pitfall, index) => (
              <li key={index} className="text-gray-300 text-xs flex items-start gap-2">
                <span className="text-orange-500 mt-0.5 shrink-0">•</span>
                <span>{pitfall}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 추천 Kiro 기능 (Req 6.4) */}
      <div className="mb-6" data-testid="kiro-features-section">
        <h3 className="text-purple-300 font-bold mb-3 flex items-center gap-2 text-sm">
          <span>🚀</span> {t('result.kiroFeatures')}
        </h3>
        
        <div className="space-y-2">
          {selectedFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-purple-950/30 border border-purple-800/30 rounded-lg p-3"
              data-testid="kiro-feature"
            >
              <p className="text-purple-200 font-semibold text-xs">{feature.name[locale]}</p>
              <p className="text-gray-400 text-xs mt-1">{feature.description[locale]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI 협업 팁 프롬프트 예시 (Req 6.5) */}
      <div className="mb-6" data-testid="ai-tips-section">
        <h3 className="text-purple-300 font-bold mb-3 flex items-center gap-2 text-sm">
          <span>💡</span> {t('result.aiTips')}
        </h3>
        <div className="space-y-2">
          {character.aiTips[locale].map((tip, index) => (
            <div
              key={index}
              className="bg-gray-800/50 border border-gray-700/40 rounded-lg px-3 py-2.5"
              data-testid="ai-tip-item"
            >
              <p className="text-gray-300 text-xs font-mono break-words">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 시너지 캐릭터 / 긴장 캐릭터 (Req 6.6) */}
      <div className="grid grid-cols-1 gap-3" data-testid="relations-section">
        {/* 시너지 캐릭터 */}
        {synergyCharacter && (
          <button
            onClick={async () => {
              const url = `${window.location.origin}/result/${synergyCharacter.slug}`;
              try {
                await navigator.clipboard.writeText(url);
                setToastMessage(`${t('toast.linkCopied')}\n${t('toast.shareWith').replace('{{name}}', synergyCharacter.name[locale])}`);
              } catch (err) {
                console.error('Failed to copy:', err);
              }
            }}
            className="bg-blue-950/30 border border-blue-800/30 rounded-xl p-4 flex items-center gap-4
                       hover:bg-blue-950/50 active:scale-98 transition-all cursor-pointer text-left"
            data-testid="synergy-character"
          >
            <Image
              src={`/characters/${synergyCharacter.slug}.png`}
              alt={synergyCharacter.name[locale]}
              width={48}
              height={48}
              className="h-12 w-12 object-contain shrink-0"
            />
            <div>
              <p className="text-xs text-blue-400 font-medium">💙 {t('result.synergy')}</p>
              <p className="text-blue-200 font-bold text-sm">{synergyCharacter.name[locale]}</p>
              <p className="text-gray-400 text-xs mt-0.5">{synergyCharacter.title[locale]}</p>
            </div>
          </button>
        )}

        {/* 긴장 캐릭터 */}
        {tensionCharacter && (
          <button
            onClick={() => {
              const shareSection = document.querySelector('[data-testid="result-share-buttons"]');
              if (shareSection) {
                shareSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => {
                  setToastMessage(t('toast.learnAbout').replace('{{name}}', tensionCharacter.name[locale]));
                }, 500);
              }
            }}
            className="bg-amber-950/30 border border-amber-800/30 rounded-xl p-4 flex items-center gap-4
                       hover:bg-amber-950/50 active:scale-98 transition-all cursor-pointer text-left"
            data-testid="tension-character"
          >
            <Image
              src={`/characters/${tensionCharacter.slug}.png`}
              alt={tensionCharacter.name[locale]}
              width={48}
              height={48}
              className="h-12 w-12 object-contain shrink-0"
            />
            <div>
              <p className="text-xs text-amber-400 font-medium">⚡ {t('result.tension')}</p>
              <p className="text-amber-200 font-bold text-sm">{tensionCharacter.name[locale]}</p>
              <p className="text-gray-400 text-xs mt-0.5">{tensionCharacter.title[locale]}</p>
            </div>
          </button>
        )}
      </div>

      {/* Toast 알림 */}
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}
    </div>
  );
}

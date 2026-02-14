'use client';

import Image from 'next/image';
import Link from 'next/link';
import { characters } from '@/data/characters';
import { useTranslation } from '@/lib/hooks/useTranslation';

/** 10개 캐릭터 이모지를 원형으로 배치하기 위한 각도 계산 */
function getCirclePosition(index: number, total: number) {
  const angle = (index * 360) / total - 90; // -90도로 시작하여 12시 방향부터
  const radian = (angle * Math.PI) / 180;
  const radius = 42; // 반지름 (%)
  const x = 50 + radius * Math.cos(radian);
  const y = 50 + radius * Math.sin(radian);
  return { x, y };
}

export default function Home() {
  const { t, locale } = useTranslation();
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 py-8 text-white">
      <main className="flex w-full max-w-2xl flex-col items-center gap-6">
        {/* 타이틀 - 모바일(360px+)에서 읽기 좋은 크기 */}
        <h1 className="text-center text-2xl font-bold tracking-tight text-purple-300 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
          {t('home.title')}
        </h1>

        {/* 세계관 소개 - 모바일에서 적절한 텍스트 크기 */}
        <p className="max-w-md text-center text-sm leading-relaxed text-gray-400">
          {t('home.description.line1')}
          <br />
          {t('home.description.line2')}
        </p>

        {/* 10개 캐릭터 이모지 원형 배치 - 모바일에서 충분한 터치 영역 */}
        <div
          className="relative mx-auto aspect-square w-56"
          aria-label="10개 캐릭터 이모지"
        >
          {/* 회전하는 캐릭터 써클 */}
          <div className="absolute inset-0 animate-spin-slow">
            {characters.map((char, i) => {
              const { x, y } = getCirclePosition(i, characters.length);
              return (
                <div
                  key={char.slug}
                  className="absolute w-0 h-0"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <div className="animate-spin-reverse" style={{ transformOrigin: '0 0' }}>
                    <div
                      className="flex h-14 w-14 items-center justify-center transition-transform hover:scale-125"
                      style={{ transform: 'translate(-50%, -50%)' }}
                      title={char.name[locale]}
                    >
                      <Image
                        src={`/characters/${char.slug}.png`}
                        alt={char.name[locale]}
                        width={80}
                        height={80}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* 중앙 Kiro 메인 캐릭터 (회전하지 않음) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="flex h-24 w-24 items-center justify-center">
              <Image
                src="/characters/kiro.png"
                alt="Kiro"
                width={128}
                height={128}
                className="h-full w-full object-contain drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                priority
              />
            </div>
          </div>
          
          {/* 중앙 글로우 효과 */}
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/20 blur-2xl" />
        </div>

        {/* CTA 버튼 - 최소 44px 터치 타겟 보장 */}
        <Link
          href="/quiz"
          className="min-h-[48px] rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-purple-700/30 transition-all hover:scale-105 hover:shadow-purple-600/40 active:scale-95"
        >
          {t('home.cta')}
        </Link>

        {/* 참여 안내 */}
        <p className="text-xs text-gray-500">{t('home.duration')}</p>
      </main>
    </div>
  );
}

// 결과 페이지 - 캐릭터별 정적 생성
// generateStaticParams로 10개 슬러그를 사전 생성하고
// 캐릭터 정보, 8각형 레이더 차트, 공유 버튼, 슬라이더, CTA 영역을 조합한다

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { CharacterSlug } from '@/lib/types';
import { characters, getCharacterBySlug, allSlugs } from '@/data/characters';
import CharacterCard from '@/components/CharacterCard';
import CTASection from '@/components/CTASection';
import ResultPageClient from './client';
import ResultClientWrapper from './result-client-wrapper';
import QuizCTAButtonWrapper from '@/components/QuizCTAButtonWrapper';
import ResultPageContent from './result-page-content';

// 10개 캐릭터 슬러그를 빌드 타임에 사전 생성 (Req 11.1)
export function generateStaticParams() {
  return allSlugs.map((slug) => ({ type: slug }));
}

// 캐릭터별 OG 메타태그 설정 (Req 8.2)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const character = getCharacterBySlug(type as CharacterSlug);

  if (!character) {
    return { title: 'Kiro 프렌즈' };
  }

  return {
    title: `${character.name.ko} - Kiro 프렌즈`,
    description: character.description.ko,
    openGraph: {
      title: `${character.name.ko} - Kiro 프렌즈`,
      description: character.description.ko,
      images: [{ url: `/og/${character.slug}.png`, width: 1200, height: 630 }],
    },
  };
}

// 결과 페이지 서버 컴포넌트
export default async function ResultPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const character = getCharacterBySlug(type as CharacterSlug);

  // 유효하지 않은 슬러그 접근 시 404 처리
  if (!character) {
    notFound();
  }

  // 공유 URL 생성 (정적 사이트이므로 상대 경로 기반)
  const resultUrl = `https://kiro-friends.example.com/result/${character.slug}`;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-2xl px-3 py-8">
        {/* 캐릭터 정보 카드 (Req 6.1, 6.3, 6.4, 6.5, 6.6) */}
        <section data-testid="result-character-card" className="mb-8">
          <CharacterCard character={character} />
        </section>

        {/* 4축 성향 레이더 차트 (Req 6.2) */}
        <section data-testid="result-radar-chart" className="mb-8">
          <ResultPageContent />
          <ResultPageClient scores={character.axisValues} characterSlug={character.slug} />
        </section>

        {/* 공유 버튼 & 캐릭터 슬라이더 (잠금 상태 관리) */}
        <ResultClientWrapper
          character={character}
          characters={characters}
          resultUrl={resultUrl}
        />

        {/* "나도 내 유형 알아보기" / "다시 검사하기" CTA 버튼 (Req 9.2) - 터치 친화적 크기 */}
        <QuizCTAButtonWrapper />

        {/* CTA 전환 영역 (Req 10) */}
        <section data-testid="result-cta-section" className="mb-8">
          <CTASection character={character} />
        </section>
      </div>
    </div>
  );
}

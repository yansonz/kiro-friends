// 결과 페이지 단위 테스트
// generateStaticParams, generateMetadata, 페이지 렌더링을 검증한다

import { render, screen } from '@testing-library/react';
import { generateStaticParams, generateMetadata } from '../[type]/page';
import ResultPage from '../[type]/page';
import { characters, allSlugs } from '@/data/characters';

// Chart.js canvas 렌더링 모킹
jest.mock('react-chartjs-2', () => ({
  Radar: () => <div data-testid="radar-chart-mock">Radar Chart</div>,
}));

// next/navigation 모킹
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
  useSearchParams: jest.fn(() => {
    const mockSearchParams = new Map();
    return {
      get: (key: string) => mockSearchParams.get(key),
      getAll: (key: string) => mockSearchParams.getAll?.(key) || [],
      has: (key: string) => mockSearchParams.has(key),
      keys: () => mockSearchParams.keys(),
      values: () => mockSearchParams.values(),
      entries: () => mockSearchParams.entries(),
      forEach: (callback: (value: string, key: string) => void) => {
        mockSearchParams.forEach(callback);
      },
      [Symbol.iterator]: () => mockSearchParams[Symbol.iterator](),
    };
  }),
}));

describe('Result Page - generateStaticParams', () => {
  it('10개 캐릭터 슬러그를 모두 반환한다', () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(10);
    allSlugs.forEach((slug) => {
      expect(params).toContainEqual({ type: slug });
    });
  });
});

describe('Result Page - generateMetadata', () => {
  it('유효한 슬러그에 대해 캐릭터별 OG 메타태그를 설정한다', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ type: 'gatssn' }),
    });
    const character = characters.find((c) => c.slug === 'gatssn')!;

    expect(metadata.title).toBe(`${character.name} - Kiro 프렌즈`);
    expect(metadata.description).toBe(character.description);
    expect(metadata.openGraph).toBeDefined();
    const og = metadata.openGraph as { title: string; description: string; images: { url: string }[] };
    expect(og.title).toBe(`${character.name} - Kiro 프렌즈`);
    expect(og.description).toBe(character.description);
    expect(og.images[0].url).toBe(`/og/${character.slug}.png`);
  });

  it('유효하지 않은 슬러그에 대해 기본 메타데이터를 반환한다', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ type: 'invalid-slug' }),
    });
    expect(metadata.title).toBe('Kiro 프렌즈');
  });

  it('10개 캐릭터 모두에 대해 올바른 OG 이미지 경로를 설정한다', async () => {
    for (const slug of allSlugs) {
      const metadata = await generateMetadata({
        params: Promise.resolve({ type: slug }),
      });
      const og = metadata.openGraph as { images: { url: string }[] };
      expect(og.images[0].url).toBe(`/og/${slug}.png`);
    }
  });
});

describe('Result Page - 렌더링', () => {
  it('유효한 캐릭터 결과 페이지를 렌더링한다', async () => {
    const page = await ResultPage({
      params: Promise.resolve({ type: 'gatssn' }),
    });
    render(page);

    const character = characters.find((c) => c.slug === 'gatssn')!;

    // 캐릭터 카드 영역 (Req 6.1)
    expect(screen.getByTestId('result-character-card')).toBeInTheDocument();
    expect(screen.getByTestId('character-card-full')).toBeInTheDocument();

    // 레이더 차트 영역 (Req 6.2)
    expect(screen.getByTestId('result-radar-chart')).toBeInTheDocument();

    // 공유 버튼 영역 (링크 복사, 이미지 다운로드)
    expect(screen.getByTestId('result-share-buttons')).toBeInTheDocument();
    expect(screen.getByTestId('share-copy-button')).toBeInTheDocument();
    expect(screen.getByTestId('share-download-button')).toBeInTheDocument();

    // "나도 내 유형 알아보기" CTA 버튼 (Req 9.2)
    const quizCta = screen.getByText('🔮 나도 내 유형 알아보기');
    expect(quizCta).toBeInTheDocument();
    expect(quizCta.closest('a')).toHaveAttribute('href', '/');

    // 캐릭터 슬라이더 (Req 9.3)
    expect(screen.getByTestId('result-character-slider')).toBeInTheDocument();
    expect(screen.getByTestId('character-slider')).toBeInTheDocument();

    // CTA 섹션 (Req 10)
    expect(screen.getByTestId('result-cta-section')).toBeInTheDocument();
    expect(screen.getByTestId('cta-section')).toBeInTheDocument();
  });

  it('캐릭터 이모지, 유형명, 한 줄 소개를 표시한다 (Req 6.1)', async () => {
    const page = await ResultPage({
      params: Promise.resolve({ type: 'dokkaebi' }),
    });
    render(page);

    const character = characters.find((c) => c.slug === 'dokkaebi')!;
    // full 카드 내부에서 캐릭터 정보 확인 (슬라이더의 compact 카드와 구분)
    const fullCard = screen.getByTestId('character-card-full');
    const nameEl = fullCard.querySelector('[data-testid="character-name"]');
    const descEl = fullCard.querySelector('[data-testid="character-description"]');
    expect(nameEl).toHaveTextContent(character.name);
    expect(descEl).toHaveTextContent(character.description);
  });

  it('잘하는 점과 빠지기 쉬운 함정 섹션을 표시한다 (Req 6.3)', async () => {
    const page = await ResultPage({
      params: Promise.resolve({ type: 'gumiho' }),
    });
    render(page);

    expect(screen.getByTestId('strengths-section')).toBeInTheDocument();
    expect(screen.getByTestId('pitfalls-section')).toBeInTheDocument();
  });

  it('추천 Kiro 기능 상위 3개를 표시한다 (Req 6.4)', async () => {
    const page = await ResultPage({
      params: Promise.resolve({ type: 'haetae' }),
    });
    render(page);

    expect(screen.getByTestId('kiro-features-section')).toBeInTheDocument();
    const featureItems = screen.getAllByTestId('kiro-feature');
    expect(featureItems.length).toBeLessThanOrEqual(3);
  });

  it('AI 협업 팁 프롬프트 예시를 표시한다 (Req 6.5)', async () => {
    const page = await ResultPage({
      params: Promise.resolve({ type: 'jangseung' }),
    });
    render(page);

    expect(screen.getByTestId('ai-tips-section')).toBeInTheDocument();
    const tipItems = screen.getAllByTestId('ai-tip-item');
    expect(tipItems.length).toBeGreaterThan(0);
  });

  it('시너지/긴장 캐릭터 정보를 표시한다 (Req 6.6)', async () => {
    const page = await ResultPage({
      params: Promise.resolve({ type: 'mulgwisin' }),
    });
    render(page);

    expect(screen.getByTestId('relations-section')).toBeInTheDocument();
    expect(screen.getByTestId('synergy-character')).toBeInTheDocument();
    expect(screen.getByTestId('tension-character')).toBeInTheDocument();
  });

  it('유효하지 않은 슬러그로 접근 시 notFound를 호출한다 (Req 9.1)', async () => {
    await expect(
      ResultPage({ params: Promise.resolve({ type: 'invalid' }) })
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it('다크 테마 배경이 적용되어 있다 (Req 13)', async () => {
    const page = await ResultPage({
      params: Promise.resolve({ type: 'cheonyeo' }),
    });
    const { container } = render(page);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('bg-gray-950');
  });
});

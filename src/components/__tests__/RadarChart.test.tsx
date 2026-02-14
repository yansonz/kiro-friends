// RadarChart 컴포넌트 단위 테스트
// 카드 하이라이트 스타일로 4축 성향을 표시한다

import React from 'react';
import { render, screen } from '@testing-library/react';
import RadarChart from '../RadarChart';
import type { AxisScores } from '@/lib/types';
import { I18nProvider } from '@/contexts/I18nContext';

describe('RadarChart', () => {
  const defaultScores: AxisScores = {
    A: 0.5,
    B: -0.5,
    C: 0,
    D: 1,
  };

  it('에러 없이 렌더링된다', () => {
    render(
      <I18nProvider>
        <RadarChart scores={defaultScores} />
      </I18nProvider>
    );
    expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
  });

  it('4개 축 라벨이 표시된다', async () => {
    render(
      <I18nProvider>
        <RadarChart scores={defaultScores} />
      </I18nProvider>
    );
    // 번역이 로드될 때까지 대기
    expect(await screen.findByText(/안정|Stability|安定/)).toBeInTheDocument();
    expect(await screen.findByText(/실험|Experiment|実験/)).toBeInTheDocument();
    expect(await screen.findByText(/구조|Structure|構造/)).toBeInTheDocument();
    expect(await screen.findByText(/즉흥|Improvisation|即興/)).toBeInTheDocument();
    expect(await screen.findByText(/개인|Individual|個人/)).toBeInTheDocument();
    expect(await screen.findByText(/협업|Collaboration|協力/)).toBeInTheDocument();
    expect(await screen.findByText(/품질|Quality|品質/)).toBeInTheDocument();
    expect(await screen.findByText(/속도|Speed|速度/)).toBeInTheDocument();
  });

  it('양수 값은 오른쪽 카드를 강조한다', () => {
    const { container } = render(
      <I18nProvider>
        <RadarChart scores={{ A: 0.8, B: 0, C: 0, D: 0 }} />
      </I18nProvider>
    );
    const highlightedCards = container.querySelectorAll('.bg-purple-600');
    expect(highlightedCards.length).toBeGreaterThan(0);
  });

  it('음수 값은 왼쪽 카드를 강조한다', () => {
    const { container } = render(
      <I18nProvider>
        <RadarChart scores={{ A: 0, B: -0.8, C: 0, D: 0 }} />
      </I18nProvider>
    );
    const highlightedCards = container.querySelectorAll('.bg-purple-600');
    expect(highlightedCards.length).toBeGreaterThan(0);
  });

  it('중립 값은 양쪽 카드를 중립 스타일로 표시한다', () => {
    const { container } = render(
      <I18nProvider>
        <RadarChart scores={{ A: 0.05, B: 0, C: 0, D: 0 }} />
      </I18nProvider>
    );
    const neutralCards = container.querySelectorAll('.bg-gray-800\\/50');
    expect(neutralCards.length).toBeGreaterThan(0);
  });

  it('모든 축이 음수인 경우 처리된다', () => {
    const minScores: AxisScores = {
      A: -1,
      B: -1,
      C: -1,
      D: -1,
    };
    const { container } = render(
      <I18nProvider>
        <RadarChart scores={minScores} />
      </I18nProvider>
    );
    const highlightedCards = container.querySelectorAll('.bg-purple-600');
    expect(highlightedCards.length).toBe(4); // 4개 축의 왼쪽 카드
  });

  it('모든 축이 양수인 경우 처리된다', () => {
    const maxScores: AxisScores = {
      A: 1,
      B: 1,
      C: 1,
      D: 1,
    };
    const { container } = render(
      <I18nProvider>
        <RadarChart scores={maxScores} />
      </I18nProvider>
    );
    const highlightedCards = container.querySelectorAll('.bg-purple-600');
    expect(highlightedCards.length).toBe(4); // 4개 축의 오른쪽 카드
  });
});

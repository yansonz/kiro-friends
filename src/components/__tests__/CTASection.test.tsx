import { render, screen } from '@testing-library/react';
import CTASection from '../CTASection';
import type { CharacterProfile } from '@/lib/types';

// CTASection 컴포넌트 단위 테스트

// 테스트용 캐릭터 데이터
const mockCharacter: CharacterProfile = {
  slug: 'gatssn',
  emoji: '👑',
  name: '갓쓴키로형',
  title: '전략 설계자',
  description: '코드 한 줄도 설계 없이는 쓰지 않는 완벽주의 아키텍트',
  axisValues: { A: -1, B: -1, C: -1, D: -1 },
  primaryTag: '설계',
  strengths: ['시스템 전체를 조감도처럼 그릴 수 있다'],
  pitfalls: ['과도한 설계로 실제 구현이 늦어질 수 있다'],
  kiroFeatures: [
    // Basic 3개
    { name: 'Specs', description: '요구사항부터 설계, 태스크까지 체계적으로 관리', level: 'basic' },
    { name: 'Steering Rules', description: '코딩 컨벤션과 아키텍처 규칙을 AI에게 전달', level: 'basic' },
    { name: 'Autopilot Mode', description: '설계 문서 기반으로 자동 구현', level: 'basic' },
    // Advanced 6개
    { name: 'Hooks', description: '자동화된 코드 리뷰와 품질 체크 파이프라인 구성', level: 'advanced' },
    { name: 'Custom Subagents', description: '도메인별 전문 에이전트 분리', level: 'advanced' },
    { name: 'Checkpointing', description: '설계 변경 시 즉시 롤백', level: 'advanced' },
    { name: 'Powers (AWS CDK)', description: 'CDK 베스트 프랙티스 적용', level: 'advanced' },
    { name: 'Property-Based Testing', description: '설계 의도 자동 검증', level: 'advanced' },
    { name: 'MCP (Architecture Tools)', description: '다이어그램 도구 연동', level: 'advanced' },
  ],
  aiTips: ['"이 모듈의 의존성 그래프를 분석해줘"'],
  synergy: 'dokkaebi',
  tension: 'chonggak',
};

describe('CTASection', () => {
  // Req 10.1: 결과 페이지 하단에 CTA_Section 표시
  it('CTA 섹션을 렌더링한다', () => {
    render(<CTASection character={mockCharacter} />);
    expect(screen.getByTestId('cta-section')).toBeInTheDocument();
  });

  // Req 10.2: "Kiro 다운로드" 버튼과 "Kiro 더 알아보기" 버튼 포함
  it('Kiro 다운로드 버튼을 표시한다', () => {
    render(<CTASection character={mockCharacter} />);
    const downloadBtn = screen.getByTestId('cta-download');
    expect(downloadBtn).toBeInTheDocument();
    expect(downloadBtn).toHaveTextContent('Kiro 다운로드');
    expect(downloadBtn).toHaveAttribute('href', 'https://kiro.dev');
    expect(downloadBtn).toHaveAttribute('target', '_blank');
    expect(downloadBtn).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('Kiro 더 알아보기 버튼을 표시한다', () => {
    render(<CTASection character={mockCharacter} />);
    const learnMoreBtn = screen.getByTestId('cta-learn-more');
    expect(learnMoreBtn).toBeInTheDocument();
    expect(learnMoreBtn).toHaveTextContent('Kiro 더 알아보기');
    expect(learnMoreBtn).toHaveAttribute('href', 'https://kiro.dev');
    expect(learnMoreBtn).toHaveAttribute('target', '_blank');
    expect(learnMoreBtn).toHaveAttribute('rel', 'noopener noreferrer');
  });

  // Req 10.3: 사용자모임 링크 포함
  it('Kiro 한국 사용자모임 링크를 표시한다', () => {
    render(<CTASection character={mockCharacter} />);
    const kiroCommunity = screen.getByTestId('cta-kiro-community');
    expect(kiroCommunity).toBeInTheDocument();
    expect(kiroCommunity).toHaveTextContent('Kiro 한국 사용자모임');
    expect(kiroCommunity).toHaveAttribute('href', 'https://kiro.awskr.org?utm_source=kiro-friends&utm_medium=result-page&utm_campaign=personality-test');
    expect(kiroCommunity).toHaveAttribute('target', '_blank');
    expect(kiroCommunity).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('AWS 한국 사용자모임 링크를 표시한다', () => {
    render(<CTASection character={mockCharacter} />);
    const awsCommunity = screen.getByTestId('cta-aws-community');
    expect(awsCommunity).toBeInTheDocument();
    expect(awsCommunity).toHaveTextContent('AWS 한국 사용자모임');
    expect(awsCommunity).toHaveAttribute('href', 'https://www.awskr.org?utm_source=kiro-friends&utm_medium=result-page&utm_campaign=personality-test');
    expect(awsCommunity).toHaveAttribute('target', '_blank');
    expect(awsCommunity).toHaveAttribute('rel', 'noopener noreferrer');
  });

  // Req 10.4: 캐릭터의 추천 Kiro 기능 목록은 CharacterCard 컴포넌트에서 표시됨
  // CTASection은 다운로드 버튼과 커뮤니티 링크만 담당

  // 외부 링크 보안 속성 확인
  it('모든 외부 링크에 보안 속성이 설정되어 있다', () => {
    render(<CTASection character={mockCharacter} />);
    const externalLinks = [
      screen.getByTestId('cta-download'),
      screen.getByTestId('cta-learn-more'),
      screen.getByTestId('cta-kiro-community'),
      screen.getByTestId('cta-aws-community'),
    ];
    externalLinks.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});

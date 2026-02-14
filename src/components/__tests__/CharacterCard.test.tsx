import { render, screen } from '@testing-library/react';
import CharacterCard from '../CharacterCard';
import type { CharacterProfile } from '@/lib/types';
import { I18nProvider } from '@/contexts/I18nContext';

// CharacterCard 컴포넌트 단위 테스트

// 테스트용 캐릭터 데이터
const mockCharacter: CharacterProfile = {
  slug: 'gatssn',
  emoji: '👑',
  name: {
    ko: '갓쓴키로형',
    en: 'Gatssn Kiro',
    ja: 'ガッスンキロ型',
  },
  title: {
    ko: '전략 설계자',
    en: 'Strategic Architect',
    ja: '戦略設計者',
  },
  description: {
    ko: '코드 한 줄도 설계 없이는 쓰지 않는 완벽주의 아키텍트',
    en: 'A perfectionist architect who never writes a line of code without design',
    ja: 'コード一行も設計なしには書かない完璧主義アーキテクト',
  },
  axisValues: { A: -1, B: -1, C: -1, D: -1 },
  primaryTag: '설계',
  strengths: {
    ko: [
      '시스템 전체를 조감도처럼 그릴 수 있다',
      '기술 부채를 사전에 차단하는 설계 감각이 뛰어나다',
      '복잡한 요구사항을 깔끔한 구조로 정리한다',
    ],
    en: [
      'Can draw the entire system like a bird\'s eye view',
      'Excellent design sense to prevent technical debt in advance',
      'Organizes complex requirements into clean structures',
    ],
    ja: [
      'システム全体を鳥瞰図のように描ける',
      '技術的負債を事前に遮断する設計感覚に優れている',
      '複雑な要求事項をきれいな構造に整理する',
    ],
  },
  pitfalls: {
    ko: [
      '과도한 설계로 실제 구현이 늦어질 수 있다',
      '완벽한 구조를 추구하다 MVP 출시 타이밍을 놓친다',
      '"이건 설계부터 다시 해야 해"가 입버릇이 될 수 있다',
    ],
    en: [
      'Excessive design may delay actual implementation',
      'May miss MVP launch timing while pursuing perfect structure',
      '"We need to redesign this from scratch" may become a habit',
    ],
    ja: [
      '過度な設計で実際の実装が遅れる可能性がある',
      '完璧な構造を追求してMVPリリースのタイミングを逃す',
      '「これは設計からやり直さないと」が口癖になる可能性がある',
    ],
  },
  kiroFeatures: [
    // Basic 3개
    { 
      name: { ko: 'Specs', en: 'Specs', ja: 'Specs' },
      description: { 
        ko: '요구사항부터 설계, 태스크까지 체계적으로 관리',
        en: 'Systematically manage from requirements to design and tasks',
        ja: '要求事項から設計、タスクまで体系的に管理',
      },
      level: 'basic' as const,
    },
    { 
      name: { ko: 'Steering Rules', en: 'Steering Rules', ja: 'Steering Rules' },
      description: { 
        ko: '코딩 컨벤션과 아키텍처 규칙을 AI에게 전달',
        en: 'Convey coding conventions and architecture rules to AI',
        ja: 'コーディング規約とアーキテクチャルールをAIに伝達',
      },
      level: 'basic' as const,
    },
    { 
      name: { ko: 'Autopilot Mode', en: 'Autopilot Mode', ja: 'Autopilot Mode' },
      description: { 
        ko: '설계 문서 기반으로 자동 구현',
        en: 'Automatic implementation based on design documents',
        ja: '設計文書ベースで自動実装',
      },
      level: 'basic' as const,
    },
    // Advanced 6개
    { 
      name: { ko: 'Hooks', en: 'Hooks', ja: 'Hooks' },
      description: { 
        ko: '자동화된 코드 리뷰와 품질 체크 파이프라인 구성',
        en: 'Configure automated code review and quality check pipeline',
        ja: '自動化されたコードレビューと品質チェックパイプライン構成',
      },
      level: 'advanced' as const,
    },
    { 
      name: { ko: 'Custom Subagents', en: 'Custom Subagents', ja: 'Custom Subagents' },
      description: { 
        ko: '도메인별 전문 에이전트 분리',
        en: 'Separate specialized agents by domain',
        ja: 'ドメイン別専門エージェント分離',
      },
      level: 'advanced' as const,
    },
    { 
      name: { ko: 'Checkpointing', en: 'Checkpointing', ja: 'Checkpointing' },
      description: { 
        ko: '설계 변경 시 즉시 롤백',
        en: 'Immediate rollback on design changes',
        ja: '設計変更時に即座にロールバック',
      },
      level: 'advanced' as const,
    },
    { 
      name: { ko: 'Powers (AWS CDK)', en: 'Powers (AWS CDK)', ja: 'Powers (AWS CDK)' },
      description: { 
        ko: 'CDK 베스트 프랙티스 적용',
        en: 'Apply CDK best practices',
        ja: 'CDKベストプラクティス適用',
      },
      level: 'advanced' as const,
    },
    { 
      name: { ko: 'Property-Based Testing', en: 'Property-Based Testing', ja: 'Property-Based Testing' },
      description: { 
        ko: '설계 의도 자동 검증',
        en: 'Automatic verification of design intent',
        ja: '設計意図の自動検証',
      },
      level: 'advanced' as const,
    },
    { 
      name: { ko: 'MCP (Architecture Tools)', en: 'MCP (Architecture Tools)', ja: 'MCP (Architecture Tools)' },
      description: { 
        ko: '다이어그램 도구 연동',
        en: 'Diagram tool integration',
        ja: 'ダイアグラムツール連携',
      },
      level: 'advanced' as const,
    },
  ],
  aiTips: {
    ko: [
      '"이 모듈의 의존성 그래프를 분석해서 순환 참조가 없는지 확인해줘"',
      '"현재 아키텍처에서 이 기능을 추가할 때 영향 범위를 분석해줘"',
      '"SOLID 원칙 관점에서 이 클래스 설계를 리뷰해줘"',
    ],
    en: [
      '"Analyze the dependency graph of this module and check for circular references"',
      '"Analyze the impact scope when adding this feature to the current architecture"',
      '"Review this class design from a SOLID principles perspective"',
    ],
    ja: [
      '"このモジュールの依存関係グラフを分析して循環参照がないか確認して"',
      '"現在のアーキテクチャでこの機能を追加する際の影響範囲を分析して"',
      '"SOLID原則の観点からこのクラス設計をレビューして"',
    ],
  },
  synergy: 'dokkaebi',
  tension: 'chonggak',
};

describe('CharacterCard', () => {
  describe('compact 모드', () => {
    it('compact 카드를 렌더링한다', () => {
      render(
        <I18nProvider>
          <CharacterCard character={mockCharacter} compact />
        </I18nProvider>
      );
      expect(screen.getByTestId('character-card-compact')).toBeInTheDocument();
    });

    it('캐릭터 이미지, 유형명, 부제를 표시한다', () => {
      render(
        <I18nProvider>
          <CharacterCard character={mockCharacter} compact />
        </I18nProvider>
      );
      const emojiContainer = screen.getByTestId('character-emoji');
      const img = emojiContainer.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('alt', '갓쓴키로형');
      expect(screen.getByTestId('character-name')).toHaveTextContent('갓쓴키로형');
      expect(screen.getByTestId('character-title')).toHaveTextContent('전략 설계자');
    });

    it('compact 모드에서는 잘하는 점, 함정 등 상세 정보를 표시하지 않는다', () => {
      render(
        <I18nProvider>
          <CharacterCard character={mockCharacter} compact />
        </I18nProvider>
      );
      expect(screen.queryByTestId('strengths-section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('pitfalls-section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('kiro-features-section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('ai-tips-section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('relations-section')).not.toBeInTheDocument();
    });
  });

  describe('full 모드 (기본)', () => {
    it('full 카드를 렌더링한다', () => {
      render(
        <I18nProvider>
          <CharacterCard character={mockCharacter} />
        </I18nProvider>
      );
      expect(screen.getByTestId('character-card-full')).toBeInTheDocument();
    });

    // Req 6.1: 캐릭터 이미지, 유형명, 한 줄 소개 표시
    it('캐릭터 이미지, 유형명, 부제, 한 줄 소개를 표시한다', () => {
      render(
        <I18nProvider>
          <CharacterCard character={mockCharacter} />
        </I18nProvider>
      );
      const emojiContainer = screen.getByTestId('character-emoji');
      const img = emojiContainer.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('alt', '갓쓴키로형');
      expect(screen.getByTestId('character-name')).toHaveTextContent('갓쓴키로형');
      expect(screen.getByTestId('character-title')).toHaveTextContent('전략 설계자');
      expect(screen.getByTestId('character-description')).toHaveTextContent(
        '코드 한 줄도 설계 없이는 쓰지 않는 완벽주의 아키텍트'
      );
    });

    // Req 6.3: 잘하는 점, 빠지기 쉬운 함정 섹션 표시
    it('잘하는 점 섹션을 표시한다', () => {
      render(
        <I18nProvider>
          <CharacterCard character={mockCharacter} />
        </I18nProvider>
      );
      const section = screen.getByTestId('strengths-section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveTextContent('시스템 전체를 조감도처럼 그릴 수 있다');
      expect(section).toHaveTextContent('기술 부채를 사전에 차단하는 설계 감각이 뛰어나다');
      expect(section).toHaveTextContent('복잡한 요구사항을 깔끔한 구조로 정리한다');
    });

    it('빠지기 쉬운 함정 섹션을 표시한다', () => {
      render(
        <I18nProvider>
          <CharacterCard character={mockCharacter} />
        </I18nProvider>
      );
      const section = screen.getByTestId('pitfalls-section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveTextContent('과도한 설계로 실제 구현이 늦어질 수 있다');
      expect(section).toHaveTextContent('완벽한 구조를 추구하다 MVP 출시 타이밍을 놓친다');
    });

    // Req 6.4: 추천 Kiro 기능 상위 3개 표시 (basic 1개, advanced 2개 랜덤 선택)
    it('추천 Kiro 기능 3개를 표시한다', () => {
      render(
        <I18nProvider>
          <CharacterCard character={mockCharacter} />
        </I18nProvider>
      );
      const section = screen.getByTestId('kiro-features-section');
      expect(section).toBeInTheDocument();
      const items = screen.getAllByTestId('kiro-feature');
      expect(items).toHaveLength(3);
      // 랜덤 선택이므로 정확한 내용은 검증하지 않고 개수만 확인
    });

    // Req 6.5: AI 협업 팁 프롬프트 예시 표시
    it('AI 협업 팁을 표시한다', () => {
      render(
        <I18nProvider>
          <CharacterCard character={mockCharacter} />
        </I18nProvider>
      );
      const section = screen.getByTestId('ai-tips-section');
      expect(section).toBeInTheDocument();
      const items = screen.getAllByTestId('ai-tip-item');
      expect(items).toHaveLength(3);
      expect(items[0]).toHaveTextContent('의존성 그래프를 분석');
    });

    // Req 6.6: 시너지 캐릭터와 긴장 캐릭터 정보 표시
    it('시너지 캐릭터 정보를 표시한다', () => {
      render(
        <I18nProvider>
          <CharacterCard character={mockCharacter} />
        </I18nProvider>
      );
      const synergy = screen.getByTestId('synergy-character');
      expect(synergy).toBeInTheDocument();
      // 갓쓴키로의 시너지 = 도깨비 (이미지로 표시)
      const synergyImg = synergy.querySelector('img');
      expect(synergyImg).toBeInTheDocument();
      expect(synergyImg).toHaveAttribute('alt', '도깨비형');
      expect(synergy).toHaveTextContent('도깨비형');
    });

    it('긴장 캐릭터 정보를 표시한다', () => {
      render(
        <I18nProvider>
          <CharacterCard character={mockCharacter} />
        </I18nProvider>
      );
      const tension = screen.getByTestId('tension-character');
      expect(tension).toBeInTheDocument();
      // 갓쓴키로의 긴장 = 총각귀신 (이미지로 표시)
      const tensionImg = tension.querySelector('img');
      expect(tensionImg).toBeInTheDocument();
      expect(tensionImg).toHaveAttribute('alt', '총각귀신형');
      expect(tension).toHaveTextContent('총각귀신형');
    });
  });

  describe('compact 기본값', () => {
    it('compact prop을 생략하면 full 모드로 렌더링한다', () => {
      render(
        <I18nProvider>
          <CharacterCard character={mockCharacter} />
        </I18nProvider>
      );
      expect(screen.getByTestId('character-card-full')).toBeInTheDocument();
      expect(screen.queryByTestId('character-card-compact')).not.toBeInTheDocument();
    });
  });
});

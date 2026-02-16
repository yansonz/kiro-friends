import { CharacterProfile, CharacterSlug } from '@/lib/types';

/** 10개 캐릭터 프로필 데이터 */
export const characters: CharacterProfile[] = [
  {
    slug: 'gatssn',
    emoji: '👑',
    name: {
      ko: '갓쓴키로',
      en: 'Gatssn Kiro',
      ja: 'ガッスンキロ',
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
        'Can visualize the entire system like a bird\'s-eye view',
        'Excellent design sense to prevent technical debt in advance',
        'Organizes complex requirements into clean structures',
      ],
      ja: [
        'システム全体を俯瞰図のように描ける',
        '技術的負債を事前に防ぐ設計感覚が優れている',
        '複雑な要件をきれいな構造に整理する',
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
        '"We need to redesign this from scratch" can become a habit',
      ],
      ja: [
        '過度な設計で実装が遅れる可能性がある',
        '完璧な構造を追求してMVPリリースのタイミングを逃す',
        '「これは設計からやり直さないと」が口癖になりがち',
      ],
    },
    kiroFeatures: [
      {
        name: { ko: 'Specs', en: 'Specs', ja: 'Specs' },
        description: {
          ko: '요구사항부터 설계, 태스크까지 체계적으로 관리',
          en: 'Systematically manage from requirements to design and tasks',
          ja: '要件から設計、タスクまで体系的に管理',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Steering Rules', en: 'Steering Rules', ja: 'Steering Rules' },
        description: {
          ko: '프로젝트 전반의 설계 원칙과 아키텍처 가이드라인을 Steering 파일로 관리',
          en: 'Manage design principles and architecture guidelines with Steering files',
          ja: 'プロジェクト全体の設計原則とアーキテクチャガイドラインをSteeringファイルで管理',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Autopilot Mode', en: 'Autopilot Mode', ja: 'Autopilot Mode' },
        description: {
          ko: '설계 문서 기반으로 Kiro가 자율적으로 구현 진행, 전략가는 리뷰에 집중',
          en: 'Kiro autonomously implements based on design docs, strategist focuses on review',
          ja: '設計ドキュメントベースでKiroが自律的に実装、戦略家はレビューに集中',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Custom Subagents', en: 'Custom Subagents', ja: 'Custom Subagents' },
        description: {
          ko: '프론트엔드/백엔드/인프라 등 도메인별 전문 에이전트를 분리하여 아키텍처 관점에서 최적 구성',
          en: 'Separate domain-specific agents for optimal architecture configuration',
          ja: 'フロントエンド/バックエンド/インフラなどドメイン別専門エージェントを分離してアーキテクチャ観点で最適構成',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Checkpointing', en: 'Checkpointing', ja: 'Checkpointing' },
        description: {
          ko: '설계 변경 시 이전 상태로 즉시 롤백, 다양한 아키텍처 방향을 안전하게 실험',
          en: 'Instantly rollback to previous state when design changes, safely experiment with various architecture directions',
          ja: '設計変更時に以前の状態に即座にロールバック、様々なアーキテクチャ方向を安全に実験',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Powers (AWS CDK)', en: 'Powers (AWS CDK)', ja: 'Powers (AWS CDK)' },
        description: {
          ko: '인프라 설계 시 Powers로 CDK 베스트 프랙티스 즉시 적용',
          en: 'Apply CDK best practices instantly with Powers for infrastructure design',
          ja: 'インフラ設計時にPowersでCDKベストプラクティスを即座に適用',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Hooks (preToolUse)', en: 'Hooks (preToolUse)', ja: 'Hooks (preToolUse)' },
        description: {
          ko: '코드 변경 전 아키텍처 원칙 준수 여부 자동 검증',
          en: 'Automatically verify architecture principle compliance before code changes',
          ja: 'コード変更前にアーキテクチャ原則遵守を自動検証',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Property-Based Testing', en: 'Property-Based Testing', ja: 'Property-Based Testing' },
        description: {
          ko: 'Spec 기반 속성 테스트로 설계 의도대로 동작하는지 자동 검증',
          en: 'Automatically verify design intent with spec-based property testing',
          ja: 'Specベースのプロパティテストで設計意図通りに動作するか自動検証',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'MCP (Architecture Tools)', en: 'MCP (Architecture Tools)', ja: 'MCP (Architecture Tools)' },
        description: {
          ko: 'PlantUML, Mermaid 등 다이어그램 도구를 연동하여 설계 문서 자동 생성',
          en: 'Auto-generate design documents by integrating diagram tools like PlantUML and Mermaid',
          ja: 'PlantUML、Mermaidなどダイアグラムツールを連携して設計ドキュメント自動生成',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Powers (Strands + Bedrock)', en: 'Powers (Strands + Bedrock)', ja: 'Powers (Strands + Bedrock)' },
        description: {
          ko: 'Strands SDK로 아키텍처 리뷰 전문 에이전트를 구축, Bedrock Claude로 설계 문서 자동 검증 및 개선 제안',
          en: 'Build architecture review agents with Strands SDK, auto-verify and improve design docs with Bedrock Claude',
          ja: 'Strands SDKでアーキテクチャレビュー専門エージェントを構築、Bedrock Claudeで設計ドキュメント自動検証と改善提案',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Skills (Architecture Patterns)', en: 'Skills (Architecture Patterns)', ja: 'Skills (Architecture Patterns)' },
        description: {
          ko: 'DDD, Clean Architecture, Hexagonal 등 아키텍처 패턴 Skills를 필요할 때만 로드하여 컨텍스트 효율적으로 설계 가이드 적용',
          en: 'Load architecture pattern Skills like DDD, Clean Architecture, Hexagonal only when needed for efficient context',
          ja: 'DDD、Clean Architecture、HexagonalなどアーキテクチャパターンSkillsを必要時のみロードしてコンテキスト効率的に設計ガイド適用',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Open Weight Models (DeepSeek v3.2)', en: 'Open Weight Models (DeepSeek v3.2)', ja: 'Open Weight Models (DeepSeek v3.2)' },
        description: {
          ko: '복잡한 추론과 멀티스텝 아키텍처 분석에 최적화된 경량 모델로 빠른 설계 검증',
          en: 'Fast design verification with lightweight model optimized for complex reasoning and multi-step architecture analysis',
          ja: '複雑な推論とマルチステップアーキテクチャ分析に最適化された軽量モデルで高速設計検証',
        },
        level: 'advanced',
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
    synergy: 'jeoseung',
    tension: 'cheonyeo',
  },
  {
    slug: 'chonggak',
    emoji: '👻',
    name: {
      ko: '총각귀신',
      en: 'Chonggak Gwishin',
      ja: 'チョンガクグィシン',
    },
    title: {
      ko: '몰입 장인',
      en: 'Flow Master',
      ja: '没入職人',
    },
    description: {
      ko: '한번 빠지면 밤새 코딩하는 극한의 집중력 보유자',
      en: 'Possesses extreme focus that codes all night once immersed',
      ja: '一度ハマると徹夜でコーディングする極限の集中力保有者',
    },
    axisValues: { A: -1, B: 1, C: -1, D: 1 },
    primaryTag: '몰입',
    strengths: {
      ko: [
        '플로우 상태에 들어가면 놀라운 생산성을 발휘한다',
        '복잡한 버그도 끈질기게 파고들어 해결한다',
        '프로토타입을 빠르게 만들어내는 실행력이 있다',
      ],
      en: [
        'Demonstrates amazing productivity when in flow state',
        'Persistently digs into and solves complex bugs',
        'Has execution power to quickly create prototypes',
      ],
      ja: [
        'フロー状態に入ると驚異的な生産性を発揮する',
        '複雑なバグも粘り強く掘り下げて解決する',
        'プロトタイプを素早く作り出す実行力がある',
      ],
    },
    pitfalls: {
      ko: [
        '과몰입으로 번아웃에 빠지기 쉽다',
        '문서화나 코드 리뷰를 건너뛰는 경향이 있다',
        '혼자 달리다 팀과 방향이 어긋날 수 있다',
      ],
      en: [
        'Prone to burnout from over-immersion',
        'Tends to skip documentation and code reviews',
        'May diverge from team direction while running solo',
      ],
      ja: [
        '過度な没入でバーンアウトに陥りやすい',
        'ドキュメント化やコードレビューを飛ばす傾向がある',
        '一人で走ってチームと方向がずれることがある',
      ],
    },
    kiroFeatures: [
      {
        name: { ko: 'Autopilot Mode', en: 'Autopilot Mode', ja: 'Autopilot Mode' },
        description: {
          ko: '몰입 중 흐름을 끊지 않고 Kiro가 자율적으로 코드 수정 및 디버깅 수행',
          en: 'Kiro autonomously modifies code and debugs without breaking flow during immersion',
          ja: '没入中に流れを断たずKiroが自律的にコード修正とデバッグを実行',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Kiro CLI', en: 'Kiro CLI', ja: 'Kiro CLI' },
        description: {
          ko: '터미널에서 바로 에이전트 호출, IDE 전환 없이 몰입 상태 유지',
          en: 'Call agent directly from terminal, maintain immersion without IDE switching',
          ja: 'ターミナルから直接エージェント呼び出し、IDE切り替えなしで没入状態維持',
        },
        level: 'basic',
      },
      {
        name: { ko: 'MCP Integration', en: 'MCP Integration', ja: 'MCP Integration' },
        description: {
          ko: '외부 도구 연동으로 컨텍스트 전환 없이 디버깅 집중',
          en: 'Focus on debugging without context switching through external tool integration',
          ja: '外部ツール連携でコンテキスト切り替えなしでデバッグに集中',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Hooks (agentStop)', en: 'Hooks (agentStop)', ja: 'Hooks (agentStop)' },
        description: {
          ko: '작업 완료 시 자동으로 테스트 실행하여 밤샘 중 실수 방지',
          en: 'Automatically run tests on task completion to prevent mistakes during all-nighters',
          ja: '作業完了時に自動でテスト実行して徹夜中のミス防止',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Checkpointing', en: 'Checkpointing', ja: 'Checkpointing' },
        description: {
          ko: '밤샘 중 과감한 시도 후 문제 발생 시 원클릭 롤백으로 안전망 확보',
          en: 'Secure safety net with one-click rollback after bold attempts during all-nighters',
          ja: '徹夜中の大胆な試み後、問題発生時にワンクリックロールバックで安全網確保',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Powers (Datadog)', en: 'Powers (Datadog)', ja: 'Powers (Datadog)' },
        description: {
          ko: '모니터링 Powers로 프로덕션 이슈를 IDE 안에서 바로 추적',
          en: 'Track production issues directly in IDE with monitoring Powers',
          ja: 'モニタリングPowersでプロダクション問題をIDE内で直接追跡',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Hooks (fileEdited)', en: 'Hooks (fileEdited)', ja: 'Hooks (fileEdited)' },
        description: {
          ko: '파일 저장 시 자동 린트 실행으로 몰입 중 코드 품질 유지',
          en: 'Maintain code quality during immersion with auto-lint on file save',
          ja: 'ファイル保存時に自動リント実行で没入中のコード品質維持',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Custom Subagents', en: 'Custom Subagents', ja: 'Custom Subagents' },
        description: {
          ko: '디버깅 전문 에이전트를 분리하여 복잡한 버그 추적 자동화',
          en: 'Automate complex bug tracking by separating debugging specialist agents',
          ja: 'デバッグ専門エージェントを分離して複雑なバグ追跡を自動化',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Steering (fileMatch)', en: 'Steering (fileMatch)', ja: 'Steering (fileMatch)' },
        description: {
          ko: '특정 파일 패턴에만 적용되는 디버깅 규칙으로 효율적 문제 해결',
          en: 'Efficient problem solving with debugging rules applied only to specific file patterns',
          ja: '特定ファイルパターンのみに適用されるデバッグルールで効率的問題解決',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Powers (Strands + Bedrock)', en: 'Powers (Strands + Bedrock)', ja: 'Powers (Strands + Bedrock)' },
        description: {
          ko: 'Strands로 디버깅 전문 에이전트 구축, Bedrock Claude가 스택 트레이스 분석하여 근본 원인 자동 추적',
          en: 'Build debugging specialist agents with Strands, Bedrock Claude analyzes stack traces to auto-track root causes',
          ja: 'Strandsでデバッグ専門エージェント構築、Bedrock Claudeがスタックトレース分析して根本原因を自動追跡',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Skills (Performance Debugging)', en: 'Skills (Performance Debugging)', ja: 'Skills (Performance Debugging)' },
        description: {
          ko: '프로파일링, 메모리 누수 분석 등 성능 디버깅 전문 Skills를 필요시에만 활성화하여 집중적 문제 해결',
          en: 'Activate performance debugging Skills like profiling and memory leak analysis only when needed for focused problem solving',
          ja: 'プロファイリング、メモリリーク分析など性能デバッグ専門Skillsを必要時のみ有効化して集中的問題解決',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Open Weight Models (Qwen3 Coder Next)', en: 'Open Weight Models (Qwen3 Coder Next)', ja: 'Open Weight Models (Qwen3 Coder Next)' },
        description: {
          ko: '256K 컨텍스트로 긴 디버깅 세션 유지, 빠른 반복 작업에 최적화된 경량 모델',
          en: 'Maintain long debugging sessions with 256K context, lightweight model optimized for fast iterations',
          ja: '256Kコンテキストで長いデバッグセッション維持、高速反復作業に最適化された軽量モデル',
        },
        level: 'advanced',
      },
    ],
    aiTips: {
      ko: [
        '"이 함수를 리팩토링하면서 테스트 코드도 같이 작성해줘"',
        '"지금 작업 중인 기능의 엣지 케이스를 정리해줘"',
        '"이 코드의 성능 병목 지점을 찾아줘"',
      ],
      en: [
        '"Refactor this function and write test code together"',
        '"Organize edge cases for the feature I\'m working on"',
        '"Find performance bottlenecks in this code"',
      ],
      ja: [
        '"この関数をリファクタリングしながらテストコードも一緒に書いて"',
        '"今作業中の機能のエッジケースを整理して"',
        '"このコードの性能ボトルネック地点を見つけて"',
      ],
    },
    synergy: 'gumiho',
    tension: 'jeoseung',
  },
  {
    slug: 'cheonyeo',
    emoji: '👰',
    name: {
      ko: '처녀귀신',
      en: 'Cheonyeo Gwishin',
      ja: 'チョニョグィシン',
    },
    title: {
      ko: 'UX 수호자',
      en: 'UX Guardian',
      ja: 'UX守護者',
    },
    description: {
      ko: '사용자 경험에 집착하는 디테일의 화신',
      en: 'The embodiment of detail obsessed with user experience',
      ja: 'ユーザー体験に執着するディテールの化身',
    },
    axisValues: { A: -1, B: -1, C: 1, D: 1 },
    primaryTag: 'UX',
    strengths: {
      ko: [
        '사용자 관점에서 불편한 점을 귀신같이 찾아낸다',
        '인터랙션 디테일에 대한 감각이 탁월하다',
        '접근성과 사용성을 동시에 챙기는 균형 감각이 있다',
      ],
      en: [
        'Finds user pain points like a ghost',
        'Excellent sense for interaction details',
        'Has balanced sense to care for both accessibility and usability',
      ],
      ja: [
        'ユーザー視点で不便な点を鬼のように見つける',
        'インタラクションディテールに対する感覚が卓越している',
        'アクセシビリティと使いやすさを同時に配慮するバランス感覚がある',
      ],
    },
    pitfalls: {
      ko: [
        '픽셀 단위 집착으로 개발 일정이 밀릴 수 있다',
        '"이 버튼 2px만 옮기면 안 될까?"가 끝없이 반복된다',
        '기능 구현보다 UI 다듬기에 시간을 더 쓸 수 있다',
      ],
      en: [
        'Development schedule may slip due to pixel-level obsession',
        '"Can we move this button 2px?" repeats endlessly',
        'May spend more time polishing UI than implementing features',
      ],
      ja: [
        'ピクセル単位の執着で開発スケジュールが遅れる可能性がある',
        '「このボタン2pxだけ動かせない？」が無限に繰り返される',
        '機能実装よりUI磨きに時間をより使う可能性がある',
      ],
    },
    kiroFeatures: [
      {
        name: { ko: 'Specs', en: 'Specs', ja: 'Specs' },
        description: {
          ko: 'UX 요구사항을 명확하게 정의하고 추적',
          en: 'Clearly define and track UX requirements',
          ja: 'UX要件を明確に定義して追跡',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Steering Rules', en: 'Steering Rules', ja: 'Steering Rules' },
        description: {
          ko: '디자인 시스템 규칙을 AI 코딩에 반영',
          en: 'Reflect design system rules in AI coding',
          ja: 'デザインシステムルールをAIコーディングに反映',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Multimodal Chat', en: 'Multimodal Chat', ja: 'Multimodal Chat' },
        description: {
          ko: 'UI 디자인 이미지나 스크린샷을 채팅에 드래그하여 시각적 피드백 요청',
          en: 'Drag UI design images or screenshots to chat for visual feedback',
          ja: 'UIデザイン画像やスクリーンショットをチャットにドラッグして視覚的フィードバック要請',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Hooks (fileEdited)', en: 'Hooks (fileEdited)', ja: 'Hooks (fileEdited)' },
        description: {
          ko: '파일 저장 시 자동으로 린트/포맷 체크하여 디테일 누락 방지',
          en: 'Auto-check lint/format on file save to prevent missing details',
          ja: 'ファイル保存時に自動でリント/フォーマットチェックしてディテール漏れ防止',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Powers (Figma)', en: 'Powers (Figma)', ja: 'Powers (Figma)' },
        description: {
          ko: 'Figma Power로 디자인 시안과 코드 컴포넌트 간 일관성 자동 검증',
          en: 'Auto-verify consistency between design mockups and code components with Figma Power',
          ja: 'Figma Powerでデザイン案とコードコンポーネント間の一貫性を自動検証',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Property-Based Testing', en: 'Property-Based Testing', ja: 'Property-Based Testing' },
        description: {
          ko: 'Spec 기반 속성 테스트로 엣지 케이스까지 자동 검증하여 완성도 극대화',
          en: 'Maximize completeness by auto-verifying edge cases with spec-based property testing',
          ja: 'Specベースのプロパティテストでエッジケースまで自動検証して完成度を最大化',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Autopilot Mode', en: 'Autopilot Mode', ja: 'Autopilot Mode' },
        description: {
          ko: '반복적인 UI 컴포넌트 생성을 자동화하여 디테일 작업에 집중',
          en: 'Automate repetitive UI component creation to focus on detail work',
          ja: '反復的なUIコンポーネント生成を自動化してディテール作業に集中',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Hooks (preToolUse)', en: 'Hooks (preToolUse)', ja: 'Hooks (preToolUse)' },
        description: {
          ko: '코드 변경 전 접근성 기준 자동 검증',
          en: 'Auto-verify accessibility standards before code changes',
          ja: 'コード変更前にアクセシビリティ基準を自動検証',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'MCP (Design Tools)', en: 'MCP (Design Tools)', ja: 'MCP (Design Tools)' },
        description: {
          ko: 'Storybook, Chromatic 등 디자인 도구 연동으로 UI 변경사항 실시간 확인',
          en: 'Real-time UI change verification by integrating design tools like Storybook and Chromatic',
          ja: 'Storybook、Chromaticなどデザインツール連携でUI変更事項をリアルタイム確認',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Powers (Strands + Bedrock)', en: 'Powers (Strands + Bedrock)', ja: 'Powers (Strands + Bedrock)' },
        description: {
          ko: 'Strands로 접근성 검증 에이전트 구축, Bedrock Claude가 WCAG 기준으로 UI 컴포넌트 자동 분석 및 개선안 제시',
          en: 'Build accessibility verification agents with Strands, Bedrock Claude auto-analyzes UI components by WCAG standards and suggests improvements',
          ja: 'Strandsでアクセシビリティ検証エージェント構築、Bedrock ClaudeがWCAG基準でUIコンポーネント自動分析と改善案提示',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Skills (Accessibility)', en: 'Skills (Accessibility)', ja: 'Skills (Accessibility)' },
        description: {
          ko: 'WCAG, ARIA 패턴 등 접근성 전문 Skills를 UI 작업 시에만 로드하여 컨텍스트 낭비 없이 a11y 가이드 적용',
          en: 'Load accessibility Skills like WCAG and ARIA patterns only during UI work to apply a11y guides without context waste',
          ja: 'WCAG、ARIAパターンなどアクセシビリティ専門SkillsをUI作業時のみロードしてコンテキスト無駄なくa11yガイド適用',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Open Weight Models (MiniMax 2.1)', en: 'Open Weight Models (MiniMax 2.1)', ja: 'Open Weight Models (MiniMax 2.1)' },
        description: {
          ko: 'Web, Android, iOS UI 생성에 특화된 모델로 빠르고 정확한 컴포넌트 생성',
          en: 'Fast and accurate component generation with model specialized in Web, Android, iOS UI creation',
          ja: 'Web、Android、iOS UI生成に特化したモデルで高速かつ正確なコンポーネント生成',
        },
        level: 'advanced',
      },
    ],
    aiTips: {
      ko: [
        '"이 컴포넌트의 접근성(a11y)을 WCAG 기준으로 점검해줘"',
        '"모바일과 데스크톱에서 이 레이아웃이 어떻게 보일지 분석해줘"',
        '"이 폼의 사용자 입력 검증 로직을 개선해줘"',
      ],
      en: [
        '"Check this component\'s accessibility (a11y) against WCAG standards"',
        '"Analyze how this layout will look on mobile and desktop"',
        '"Improve the user input validation logic for this form"',
      ],
      ja: [
        '"このコンポーネントのアクセシビリティ(a11y)をWCAG基準で点検して"',
        '"モバイルとデスクトップでこのレイアウトがどう見えるか分析して"',
        '"このフォームのユーザー入力検証ロジックを改善して"',
      ],
    },
    synergy: 'haetae',
    tension: 'gatssn',
  },
  {
    slug: 'dokkaebi',
    emoji: '👹',
    name: {
      ko: '도깨비',
      en: 'Dokkaebi',
      ja: 'トッケビ',
    },
    title: {
      ko: '실험 개척자',
      en: 'Experiment Pioneer',
      ja: '実験開拓者',
    },
    description: {
      ko: '새로운 기술이라면 일단 써보는 얼리어답터 개발자',
      en: 'Early adopter developer who tries any new technology first',
      ja: '新しい技術ならとりあえず使ってみるアーリーアダプター開発者',
    },
    axisValues: { A: 1, B: 1, C: -1, D: 1 },
    primaryTag: '실험',
    strengths: {
      ko: [
        '새로운 기술 트렌드를 빠르게 파악하고 적용한다',
        '기존 방식에 얽매이지 않는 창의적 문제 해결력이 있다',
        '해커톤이나 사이드 프로젝트에서 빛을 발한다',
      ],
      en: [
        'Quickly grasps and applies new technology trends',
        'Has creative problem-solving ability not bound by existing methods',
        'Shines in hackathons and side projects',
      ],
      ja: [
        '新しい技術トレンドを素早く把握して適用する',
        '既存の方式に縛られない創造的問題解決力がある',
        'ハッカソンやサイドプロジェクトで輝く',
      ],
    },
    pitfalls: {
      ko: [
        '검증되지 않은 기술을 프로덕션에 도입할 위험이 있다',
        '새 기술에 빠져 기존 프로젝트 유지보수를 소홀히 할 수 있다',
        '"이거 새 프레임워크로 다시 만들자"를 자주 제안한다',
      ],
      en: [
        'Risk of introducing unverified technology to production',
        'May neglect existing project maintenance while absorbed in new tech',
        'Frequently suggests "Let\'s rebuild this with a new framework"',
      ],
      ja: [
        '検証されていない技術をプロダクションに導入するリスクがある',
        '新技術にハマって既存プロジェクトのメンテナンスを疎かにする可能性がある',
        '「これ新しいフレームワークで作り直そう」をよく提案する',
      ],
    },
    kiroFeatures: [
      {
        name: { ko: 'Autopilot Mode', en: 'Autopilot Mode', ja: 'Autopilot Mode' },
        description: {
          ko: '아이디어만 던지면 Kiro가 PoC 코드를 자율적으로 빠르게 생성',
          en: 'Just throw an idea and Kiro autonomously generates PoC code quickly',
          ja: 'アイデアを投げるだけでKiroがPoCコードを自律的に素早く生成',
        },
        level: 'basic',
      },
      {
        name: { ko: 'MCP Integration', en: 'MCP Integration', ja: 'MCP Integration' },
        description: {
          ko: '새로운 기술 스택의 MCP 서버를 연결하여 즉시 실험 환경 구축',
          en: 'Connect MCP servers of new tech stacks to instantly build experiment environment',
          ja: '新しい技術スタックのMCPサーバーを接続して即座に実験環境構築',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Specs', en: 'Specs', ja: 'Specs' },
        description: {
          ko: '실험 범위와 검증 기준을 Spec으로 정리하여 실험이 산으로 가는 것을 방지',
          en: 'Organize experiment scope and verification criteria as Spec to prevent experiments from going astray',
          ja: '実験範囲と検証基準をSpecで整理して実験が迷走するのを防止',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Powers Marketplace', en: 'Powers Marketplace', ja: 'Powers Marketplace' },
        description: {
          ko: 'Supabase, Neon, Stripe 등 다양한 Powers를 원클릭 설치하여 새 기술 즉시 체험',
          en: 'One-click install various Powers like Supabase, Neon, Stripe to instantly experience new tech',
          ja: 'Supabase、Neon、Stripeなど様々なPowersをワンクリックインストールして新技術を即座に体験',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Checkpointing', en: 'Checkpointing', ja: 'Checkpointing' },
        description: {
          ko: '실험 브랜치처럼 활용, 실패한 실험은 체크포인트로 즉시 되돌리기',
          en: 'Use like experiment branches, instantly revert failed experiments to checkpoint',
          ja: '実験ブランチのように活用、失敗した実験はチェックポイントで即座に戻す',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Web Search', en: 'Web Search', ja: 'Web Search' },
        description: {
          ko: '최신 기술 문서와 릴리즈 노트를 IDE 안에서 바로 검색하여 실험 근거 확보',
          en: 'Search latest tech docs and release notes directly in IDE to secure experiment basis',
          ja: '最新技術ドキュメントとリリースノートをIDE内で直接検索して実験根拠確保',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Hooks (postToolUse)', en: 'Hooks (postToolUse)', ja: 'Hooks (postToolUse)' },
        description: {
          ko: '실험 코드 작성 후 자동으로 품질 체크 및 보안 스캔 실행',
          en: 'Auto-run quality check and security scan after writing experiment code',
          ja: '実験コード作成後に自動で品質チェックとセキュリティスキャン実行',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Custom Subagents', en: 'Custom Subagents', ja: 'Custom Subagents' },
        description: {
          ko: 'PoC 전문 에이전트를 분리하여 빠른 프로토타입 생성 자동화',
          en: 'Automate fast prototype generation by separating PoC specialist agents',
          ja: 'PoC専門エージェントを分離して高速プロトタイプ生成を自動化',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Powers (AWS Bedrock)', en: 'Powers (AWS Bedrock)', ja: 'Powers (AWS Bedrock)' },
        description: {
          ko: 'Bedrock Power로 최신 AI 모델을 실험에 즉시 통합',
          en: 'Instantly integrate latest AI models into experiments with Bedrock Power',
          ja: 'Bedrock Powerで最新AIモデルを実験に即座に統合',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Powers (Strands + Bedrock)', en: 'Powers (Strands + Bedrock)', ja: 'Powers (Strands + Bedrock)' },
        description: {
          ko: 'Strands로 PoC 평가 에이전트 구축, Bedrock의 다양한 모델(Claude, Llama, Titan)로 실험 결과를 다각도 분석',
          en: 'Build PoC evaluation agents with Strands, analyze experiment results from multiple angles with Bedrock\'s various models (Claude, Llama, Titan)',
          ja: 'StrandsでPoC評価エージェント構築、Bedrockの様々なモデル(Claude、Llama、Titan)で実験結果を多角的に分析',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Skills (Framework Evaluation)', en: 'Skills (Framework Evaluation)', ja: 'Skills (Framework Evaluation)' },
        description: {
          ko: 'React, Vue, Svelte 등 프레임워크별 평가 Skills를 실험 시에만 로드하여 최신 기술 스택 비교 분석',
          en: 'Load framework evaluation Skills like React, Vue, Svelte only during experiments to compare latest tech stacks',
          ja: 'React、Vue、Svelteなどフレームワーク別評価Skillsを実験時のみロードして最新技術スタック比較分析',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Open Weight Models (All)', en: 'Open Weight Models (All)', ja: 'Open Weight Models (All)' },
        description: {
          ko: 'DeepSeek, MiniMax, Qwen3 등 다양한 오픈 모델을 실험하여 최적의 모델 조합 발견',
          en: 'Experiment with various open models like DeepSeek, MiniMax, Qwen3 to find optimal model combination',
          ja: 'DeepSeek、MiniMax、Qwen3など様々なオープンモデルを実験して最適なモデル組み合わせ発見',
        },
        level: 'advanced',
      },
    ],
    aiTips: {
      ko: [
        '"이 새 라이브러리의 장단점을 기존 솔루션과 비교해줘"',
        '"이 실험적 기능의 롤백 전략을 설계해줘"',
        '"이 PoC 코드를 프로덕션 수준으로 개선해줘"',
      ],
      en: [
        '"Compare pros and cons of this new library with existing solutions"',
        '"Design a rollback strategy for this experimental feature"',
        '"Improve this PoC code to production level"',
      ],
      ja: [
        '"この新しいライブラリの長所短所を既存ソリューションと比較して"',
        '"この実験的機能のロールバック戦略を設計して"',
        '"このPoCコードをプロダクションレベルに改善して"',
      ],
    },
    synergy: 'mulgwisin',
    tension: 'haetae',
  },
  {
    slug: 'gumiho',
    emoji: '🦊',
    name: {
      ko: '구미호',
      en: 'Gumiho',
      ja: 'クミホ',
    },
    title: {
      ko: '자동화 마법사',
      en: 'Automation Wizard',
      ja: '自動化魔法使い',
    },
    description: {
      ko: '반복 작업을 참지 못하는 스크립트 덕후',
      en: 'Script enthusiast who can\'t stand repetitive tasks',
      ja: '反復作業を我慢できないスクリプトオタク',
    },
    axisValues: { A: 1, B: -1, C: -1, D: 1 },
    primaryTag: '자동화',
    strengths: {
      ko: [
        '반복 업무를 자동화해서 팀 전체의 생산성을 높인다',
        'CI/CD 파이프라인 구축에 탁월한 능력을 보인다',
        '효율적인 워크플로우를 설계하는 감각이 있다',
      ],
      en: [
        'Automates repetitive tasks to boost entire team productivity',
        'Shows excellent ability in building CI/CD pipelines',
        'Has sense for designing efficient workflows',
      ],
      ja: [
        '反復業務を自動化してチーム全体の生産性を高める',
        'CI/CDパイプライン構築に卓越した能力を示す',
        '効率的なワークフローを設計する感覚がある',
      ],
    },
    pitfalls: {
      ko: [
        '자동화 자체에 빠져 본래 업무를 잊을 수 있다',
        '5분이면 끝날 일을 자동화하느라 5시간을 쓸 수 있다',
        '과도한 추상화로 다른 팀원이 이해하기 어려운 코드를 만든다',
      ],
      en: [
        'May forget original tasks while absorbed in automation itself',
        'May spend 5 hours automating a 5-minute task',
        'Creates code difficult for other team members to understand through excessive abstraction',
      ],
      ja: [
        '自動化自体にハマって本来の業務を忘れる可能性がある',
        '5分で終わることを自動化するのに5時間使う可能性がある',
        '過度な抽象化で他のチームメンバーが理解しにくいコードを作る',
      ],
    },
    kiroFeatures: [
      {
        name: { ko: 'Hooks', en: 'Hooks', ja: 'Hooks' },
        description: {
          ko: '파일 변경 시 자동 린트, 테스트, 빌드 트리거',
          en: 'Auto-trigger lint, test, build on file changes',
          ja: 'ファイル変更時に自動リント、テスト、ビルドトリガー',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Autopilot Mode', en: 'Autopilot Mode', ja: 'Autopilot Mode' },
        description: {
          ko: '보일러플레이트 코드 자동 생성으로 반복 작업 제거',
          en: 'Eliminate repetitive tasks with auto-generated boilerplate code',
          ja: 'ボイラープレートコード自動生成で反復作業を除去',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Steering Rules', en: 'Steering Rules', ja: 'Steering Rules' },
        description: {
          ko: '반복 사용하는 워크플로우를 Steering 파일로 템플릿화하여 재사용',
          en: 'Template frequently used workflows as Steering files for reuse',
          ja: '反復使用するワークフローをSteeringファイルでテンプレート化して再利用',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Custom Subagents', en: 'Custom Subagents', ja: 'Custom Subagents' },
        description: {
          ko: '용도별 전문 에이전트(코드 리뷰봇, 문서 생성봇 등)를 직접 설계하여 자동화 극대화',
          en: 'Maximize automation by directly designing purpose-specific agents (code review bot, doc generation bot, etc.)',
          ja: '用途別専門エージェント(コードレビューボット、ドキュメント生成ボットなど)を直接設計して自動化を最大化',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Powers Builder', en: 'Powers Builder', ja: 'Powers Builder' },
        description: {
          ko: '자신만의 Power(MCP + Steering + Hooks 번들)를 만들어 팀이나 커뮤니티에 공유',
          en: 'Create your own Power (MCP + Steering + Hooks bundle) and share with team or community',
          ja: '自分だけのPower(MCP + Steering + Hooksバンドル)を作ってチームやコミュニティに共有',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'MCP Integration', en: 'MCP Integration', ja: 'MCP Integration' },
        description: {
          ko: '다양한 외부 도구를 MCP로 연결하여 Kiro 안에서 통합 자동화 파이프라인 구축',
          en: 'Build integrated automation pipeline within Kiro by connecting various external tools via MCP',
          ja: '様々な外部ツールをMCPで接続してKiro内で統合自動化パイプライン構築',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Hooks (agentStop)', en: 'Hooks (agentStop)', ja: 'Hooks (agentStop)' },
        description: {
          ko: '작업 완료 시 자동으로 문서 생성 및 배포 준비',
          en: 'Auto-generate docs and prepare deployment on task completion',
          ja: '作業完了時に自動でドキュメント生成と配備準備',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Skills', en: 'Skills', ja: 'Skills' },
        description: {
          ko: '반복 사용하는 워크플로우를 Skill 패키지로 만들어 필요할 때만 로딩하는 효율적 컨텍스트 관리',
          en: 'Efficient context management by packaging frequently used workflows as Skills and loading only when needed',
          ja: '反復使用するワークフローをSkillパッケージにして必要時のみロードする効率的コンテキスト管理',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Powers (GitHub Actions)', en: 'Powers (GitHub Actions)', ja: 'Powers (GitHub Actions)' },
        description: {
          ko: 'GitHub Actions Power로 CI/CD 파이프라인 자동 구성',
          en: 'Auto-configure CI/CD pipeline with GitHub Actions Power',
          ja: 'GitHub Actions PowerでCI/CDパイプライン自動構成',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Powers (Strands + Bedrock)', en: 'Powers (Strands + Bedrock)', ja: 'Powers (Strands + Bedrock)' },
        description: {
          ko: 'Strands로 워크플로우 최적화 에이전트 구축, Bedrock Claude가 CI/CD 로그 분석하여 병목 지점 자동 탐지 및 개선',
          en: 'Build workflow optimization agents with Strands, Bedrock Claude analyzes CI/CD logs to auto-detect bottlenecks and improve',
          ja: 'Strandsでワークフロー最適化エージェント構築、Bedrock ClaudeがCI/CDログ分析してボトルネック地点を自動検出と改善',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Skills (DevOps Automation)', en: 'Skills (DevOps Automation)', ja: 'Skills (DevOps Automation)' },
        description: {
          ko: 'Terraform, Ansible, Kubernetes 등 인프라 자동화 Skills를 배포 작업 시에만 활성화하여 전문 지식 on-demand 활용',
          en: 'Activate infrastructure automation Skills like Terraform, Ansible, Kubernetes only during deployment to utilize expertise on-demand',
          ja: 'Terraform、Ansible、Kubernetesなどインフラ自動化Skillsを配備作業時のみ有効化して専門知識をon-demand活用',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Open Weight Models (Qwen3 Coder Next)', en: 'Open Weight Models (Qwen3 Coder Next)', ja: 'Open Weight Models (Qwen3 Coder Next)' },
        description: {
          ko: '에이전트 워크플로우에 최적화된 경량 모델로 자동화 스크립트 빠르게 생성',
          en: 'Quickly generate automation scripts with lightweight model optimized for agent workflows',
          ja: 'エージェントワークフローに最適化された軽量モデルで自動化スクリプトを素早く生成',
        },
        level: 'advanced',
      },
    ],
    aiTips: {
      ko: [
        '"이 수동 배포 프로세스를 CI/CD 파이프라인으로 전환해줘"',
        '"이 반복 패턴을 유틸리티 함수로 추출해줘"',
        '"이 스크립트의 에러 핸들링과 로깅을 추가해줘"',
      ],
      en: [
        '"Convert this manual deployment process to CI/CD pipeline"',
        '"Extract this repetitive pattern as a utility function"',
        '"Add error handling and logging to this script"',
      ],
      ja: [
        '"この手動配備プロセスをCI/CDパイプラインに転換して"',
        '"この反復パターンをユーティリティ関数で抽出して"',
        '"このスクリプトのエラーハンドリングとロギングを追加して"',
      ],
    },
    synergy: 'chonggak',
    tension: 'jangseung',
  },
  {
    slug: 'haetae',
    emoji: '🦁',
    name: {
      ko: '해태',
      en: 'Haetae',
      ja: 'ヘテ',
    },
    title: {
      ko: '품질 파수꾼',
      en: 'Quality Guardian',
      ja: '品質番人',
    },
    description: {
      ko: '테스트 커버리지 100%를 향해 달리는 품질 수호자',
      en: 'Quality guardian running towards 100% test coverage',
      ja: 'テストカバレッジ100%に向かって走る品質守護者',
    },
    axisValues: { A: -1, B: -1, C: 1, D: -1 },
    primaryTag: '테스트',
    strengths: {
      ko: [
        '꼼꼼한 테스트로 배포 후 장애를 사전에 방지한다',
        '코드 리뷰에서 잠재적 버그를 정확히 짚어낸다',
        '팀의 코드 품질 기준을 높이는 데 기여한다',
      ],
      en: [
        'Prevents post-deployment failures with meticulous testing',
        'Accurately points out potential bugs in code reviews',
        'Contributes to raising team\'s code quality standards',
      ],
      ja: [
        '綿密なテストで配備後の障害を事前に防止する',
        'コードレビューで潜在的バグを正確に指摘する',
        'チームのコード品質基準を高めることに貢献する',
      ],
    },
    pitfalls: {
      ko: [
        '테스트 작성에 과도한 시간을 투자할 수 있다',
        '"테스트 없이는 머지 불가"로 팀 속도를 늦출 수 있다',
        '완벽한 커버리지 추구가 실용성을 해칠 수 있다',
      ],
      en: [
        'May invest excessive time in writing tests',
        'May slow team velocity with "No merge without tests"',
        'Pursuit of perfect coverage may harm practicality',
      ],
      ja: [
        'テスト作成に過度な時間を投資する可能性がある',
        '「テストなしではマージ不可」でチーム速度を遅らせる可能性がある',
        '完璧なカバレッジ追求が実用性を損なう可能性がある',
      ],
    },
    kiroFeatures: [
      {
        name: { ko: 'Specs', en: 'Specs', ja: 'Specs' },
        description: {
          ko: '테스트 케이스를 요구사항과 연결하여 추적',
          en: 'Track test cases linked to requirements',
          ja: 'テストケースを要件と連結して追跡',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Hooks (fileEdited)', en: 'Hooks (fileEdited)', ja: 'Hooks (fileEdited)' },
        description: {
          ko: '파일 수정 시 자동 테스트 실행으로 회귀 버그 즉시 감지',
          en: 'Instantly detect regression bugs with auto-test on file modification',
          ja: 'ファイル修正時に自動テスト実行で回帰バグを即座に検出',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Steering Rules', en: 'Steering Rules', ja: 'Steering Rules' },
        description: {
          ko: '보안 정책, 테스트 커버리지 기준을 Steering으로 등록하여 팀 전체에 품질 기준 적용',
          en: 'Apply quality standards to entire team by registering security policies and test coverage criteria as Steering',
          ja: 'セキュリティポリシー、テストカバレッジ基準をSteeringで登録してチーム全体に品質基準適用',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Hooks (preToolUse)', en: 'Hooks (preToolUse)', ja: 'Hooks (preToolUse)' },
        description: {
          ko: '코드 변경 전 자동으로 보안/품질 검증 게이트 설정',
          en: 'Auto-set security/quality verification gates before code changes',
          ja: 'コード変更前に自動でセキュリティ/品質検証ゲート設定',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Property-Based Testing', en: 'Property-Based Testing', ja: 'Property-Based Testing' },
        description: {
          ko: 'Spec에서 정의한 속성을 기반으로 무작위 입력 테스트 자동 생성, 예상 못한 엣지 케이스 발견',
          en: 'Auto-generate random input tests based on properties defined in Spec, discover unexpected edge cases',
          ja: 'Specで定義した属性を基に無作為入力テスト自動生成、予想外のエッジケース発見',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Supervised Mode', en: 'Supervised Mode', ja: 'Supervised Mode' },
        description: {
          ko: 'AI 변경사항을 파일 단위로 리뷰 후 승인, 품질 게이트 역할',
          en: 'Review and approve AI changes file by file, act as quality gate',
          ja: 'AI変更事項をファイル単位でレビュー後承認、品質ゲート役割',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Powers (Postman)', en: 'Powers (Postman)', ja: 'Powers (Postman)' },
        description: {
          ko: 'API 테스트 자동화 Power로 통합 테스트 커버리지 확보',
          en: 'Secure integration test coverage with API test automation Power',
          ja: 'APIテスト自動化Powerで統合テストカバレッジ確保',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Hooks (postToolUse)', en: 'Hooks (postToolUse)', ja: 'Hooks (postToolUse)' },
        description: {
          ko: '코드 작성 후 자동으로 정적 분석 및 보안 스캔 실행',
          en: 'Auto-run static analysis and security scan after code writing',
          ja: 'コード作成後に自動で静的分析とセキュリティスキャン実行',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'MCP (Testing Tools)', en: 'MCP (Testing Tools)', ja: 'MCP (Testing Tools)' },
        description: {
          ko: 'Jest, Playwright 등 테스팅 도구 연동으로 다양한 테스트 시나리오 자동 실행',
          en: 'Auto-execute various test scenarios by integrating testing tools like Jest and Playwright',
          ja: 'Jest、Playwrightなどテストツール連携で様々なテストシナリオ自動実行',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Powers (Strands + Bedrock)', en: 'Powers (Strands + Bedrock)', ja: 'Powers (Strands + Bedrock)' },
        description: {
          ko: 'Strands로 테스트 생성 에이전트 구축, Bedrock Claude가 코드 분석하여 엣지 케이스 자동 발견 및 테스트 코드 생성',
          en: 'Build test generation agents with Strands, Bedrock Claude analyzes code to auto-discover edge cases and generate test code',
          ja: 'Strandsでテスト生成エージェント構築、Bedrock Claudeがコード分析してエッジケース自動発見とテストコード生成',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Skills (Security Testing)', en: 'Skills (Security Testing)', ja: 'Skills (Security Testing)' },
        description: {
          ko: 'OWASP, 침투 테스트 등 보안 테스팅 전문 Skills를 보안 검증 시에만 로드하여 효율적 취약점 분석',
          en: 'Load security testing Skills like OWASP and penetration testing only during security verification for efficient vulnerability analysis',
          ja: 'OWASP、侵入テストなどセキュリティテスト専門Skillsをセキュリティ検証時のみロードして効率的脆弱性分析',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Open Weight Models (Qwen3 Coder Next)', en: 'Open Weight Models (Qwen3 Coder Next)', ja: 'Open Weight Models (Qwen3 Coder Next)' },
        description: {
          ko: '에러 감지와 복구에 특화된 모델로 테스트 케이스 자동 생성 및 품질 검증',
          en: 'Auto-generate test cases and verify quality with model specialized in error detection and recovery',
          ja: 'エラー検出と復旧に特化したモデルでテストケース自動生成と品質検証',
        },
        level: 'advanced',
      },
    ],
    aiTips: {
      ko: [
        '"이 함수의 엣지 케이스를 포함한 테스트 코드를 작성해줘"',
        '"이 모듈의 테스트 커버리지를 분석하고 빠진 케이스를 찾아줘"',
        '"이 통합 테스트의 안정성을 개선할 방법을 제안해줘"',
      ],
      en: [
        '"Write test code including edge cases for this function"',
        '"Analyze test coverage of this module and find missing cases"',
        '"Suggest ways to improve stability of this integration test"',
      ],
      ja: [
        '"この関数のエッジケースを含むテストコードを書いて"',
        '"このモジュールのテストカバレッジを分析して抜けているケースを見つけて"',
        '"この統合テストの安定性を改善する方法を提案して"',
      ],
    },
    synergy: 'cheonyeo',
    tension: 'dokkaebi',
  },
  {
    slug: 'jangseung',
    emoji: '🪵',
    name: {
      ko: '장승',
      en: 'Jangseung',
      ja: 'チャンスン',
    },
    title: {
      ko: '거버넌스 수문장',
      en: 'Governance Gatekeeper',
      ja: 'ガバナンス門番',
    },
    description: {
      ko: '코드 컨벤션과 프로세스를 지키는 팀의 기둥',
      en: 'Team pillar that upholds code conventions and processes',
      ja: 'コード規約とプロセスを守るチームの柱',
    },
    axisValues: { A: -1, B: 1, C: 1, D: -1 },
    primaryTag: '거버넌스',
    strengths: {
      ko: [
        '일관된 코딩 컨벤션으로 팀 코드 품질을 유지한다',
        'PR 리뷰 프로세스를 체계적으로 운영한다',
        '온보딩 문서와 가이드라인 정리에 탁월하다',
      ],
      en: [
        'Maintains team code quality with consistent coding conventions',
        'Systematically operates PR review process',
        'Excellent at organizing onboarding docs and guidelines',
      ],
      ja: [
        '一貫したコーディング規約でチームコード品質を維持する',
        'PRレビュープロセスを体系的に運営する',
        'オンボーディングドキュメントとガイドライン整理に卓越している',
      ],
    },
    pitfalls: {
      ko: [
        '규칙에 지나치게 집착해 유연성이 떨어질 수 있다',
        '"컨벤션에 안 맞아요"로 팀원과 마찰이 생길 수 있다',
        '프로세스 개선에 몰두해 실제 개발 시간이 줄어든다',
      ],
      en: [
        'May lose flexibility by being overly obsessed with rules',
        'May cause friction with team members over "Doesn\'t match convention"',
        'Actual development time decreases while absorbed in process improvement',
      ],
      ja: [
        'ルールに過度に執着して柔軟性が落ちる可能性がある',
        '「規約に合わない」でチームメンバーと摩擦が生じる可能性がある',
        'プロセス改善に没頭して実際の開発時間が減る',
      ],
    },
    kiroFeatures: [
      {
        name: { ko: 'Steering Rules', en: 'Steering Rules', ja: 'Steering Rules' },
        description: {
          ko: '팀 코딩 규칙을 AI가 자동으로 준수하도록 설정',
          en: 'Set AI to automatically comply with team coding rules',
          ja: 'チームコーディングルールをAIが自動で遵守するよう設定',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Specs', en: 'Specs', ja: 'Specs' },
        description: {
          ko: '개발 프로세스와 워크플로우를 문서화하고 추적',
          en: 'Document and track development processes and workflows',
          ja: '開発プロセスとワークフローを文書化して追跡',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Hooks (fileEdited)', en: 'Hooks (fileEdited)', ja: 'Hooks (fileEdited)' },
        description: {
          ko: '파일 저장 시 자동으로 컨벤션 체크 및 포맷팅 적용',
          en: 'Auto-check convention and apply formatting on file save',
          ja: 'ファイル保存時に自動で規約チェックとフォーマット適用',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Hooks (preToolUse)', en: 'Hooks (preToolUse)', ja: 'Hooks (preToolUse)' },
        description: {
          ko: '코드 작성 시 컨벤션 위반 여부를 자동 검증하는 게이트 설정',
          en: 'Set gate to auto-verify convention violations when writing code',
          ja: 'コード作成時に規約違反を自動検証するゲート設定',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Steering (fileMatch)', en: 'Steering (fileMatch)', ja: 'Steering (fileMatch)' },
        description: {
          ko: '특정 파일 패턴에만 적용되는 조건부 규칙으로 세밀한 거버넌스 구현',
          en: 'Implement fine-grained governance with conditional rules applied only to specific file patterns',
          ja: '特定ファイルパターンのみに適用される条件付きルールで細かいガバナンス実装',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Skills', en: 'Skills', ja: 'Skills' },
        description: {
          ko: '팀 온보딩 가이드, 코드 리뷰 체크리스트를 Skill로 패키징하여 신규 멤버에게 자동 적용',
          en: 'Package team onboarding guide and code review checklist as Skills to auto-apply to new members',
          ja: 'チームオンボーディングガイド、コードレビューチェックリストをSkillでパッケージ化して新規メンバーに自動適用',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Enterprise Features', en: 'Enterprise Features', ja: 'Enterprise Features' },
        description: {
          ko: '확장 레지스트리 거버넌스, 웹 도구 토글로 조직 수준의 보안 정책 관리',
          en: 'Manage organization-level security policies with extension registry governance and web tool toggle',
          ja: '拡張レジストリガバナンス、Webツールトグルで組織レベルのセキュリティポリシー管理',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Custom Subagents', en: 'Custom Subagents', ja: 'Custom Subagents' },
        description: {
          ko: 'PR 리뷰 전문 에이전트를 분리하여 일관된 리뷰 기준 적용',
          en: 'Apply consistent review standards by separating PR review specialist agents',
          ja: 'PRレビュー専門エージェントを分離して一貫したレビュー基準適用',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Hooks (agentStop)', en: 'Hooks (agentStop)', ja: 'Hooks (agentStop)' },
        description: {
          ko: '작업 완료 시 자동으로 문서 업데이트 및 팀 공유',
          en: 'Auto-update docs and share with team on task completion',
          ja: '作業完了時に自動でドキュメント更新とチーム共有',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Powers (Strands + Bedrock)', en: 'Powers (Strands + Bedrock)', ja: 'Powers (Strands + Bedrock)' },
        description: {
          ko: 'Strands로 컨벤션 검증 에이전트 구축, Bedrock Claude가 PR 코드를 팀 규칙과 비교하여 위반 사항 자동 리뷰',
          en: 'Build convention verification agents with Strands, Bedrock Claude auto-reviews PR code against team rules for violations',
          ja: 'Strandsで規約検証エージェント構築、Bedrock ClaudeがPRコードをチームルールと比較して違反事項を自動レビュー',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Skills (Code Review)', en: 'Skills (Code Review)', ja: 'Skills (Code Review)' },
        description: {
          ko: '언어별, 프레임워크별 코드 리뷰 체크리스트 Skills를 PR 리뷰 시에만 활성화하여 일관된 품질 기준 적용',
          en: 'Activate language and framework-specific code review checklist Skills only during PR review to apply consistent quality standards',
          ja: '言語別、フレームワーク別コードレビューチェックリストSkillsをPRレビュー時のみ有効化して一貫した品質基準適用',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Open Weight Models (Model Selection)', en: 'Open Weight Models (Model Selection)', ja: 'Open Weight Models (Model Selection)' },
        description: {
          ko: '작업 유형별 최적 모델 선택 전략으로 비용 효율과 품질 균형 유지',
          en: 'Maintain balance between cost efficiency and quality with optimal model selection strategy by task type',
          ja: '作業タイプ別最適モデル選択戦略でコスト効率と品質バランス維持',
        },
        level: 'advanced',
      },
    ],
    aiTips: {
      ko: [
        '"이 프로젝트의 코딩 컨벤션 문서를 작성해줘"',
        '"이 PR의 변경사항이 우리 팀 규칙에 맞는지 검토해줘"',
        '"새 팀원을 위한 온보딩 체크리스트를 만들어줘"',
      ],
      en: [
        '"Write coding convention document for this project"',
        '"Review if this PR\'s changes match our team rules"',
        '"Create onboarding checklist for new team members"',
      ],
      ja: [
        '"このプロジェクトのコーディング規約ドキュメントを作成して"',
        '"このPRの変更事項が私たちのチームルールに合っているか検討して"',
        '"新しいチームメンバーのためのオンボーディングチェックリストを作って"',
      ],
    },
    synergy: 'dalgyal',
    tension: 'gumiho',
  },
  {
    slug: 'jeoseung',
    emoji: '⚰️',
    name: {
      ko: '저승사자',
      en: 'Jeoseung Saja',
      ja: 'チョスンサジャ',
    },
    title: {
      ko: '부채 청산자',
      en: 'Debt Liquidator',
      ja: '負債清算者',
    },
    description: {
      ko: '기술 부채를 찾아 끈질기게 청산하는 리팩토링 전문가',
      en: 'Refactoring specialist who persistently finds and liquidates technical debt',
      ja: '技術的負債を見つけて粘り強く清算するリファクタリング専門家',
    },
    axisValues: { A: 1, B: -1, C: -1, D: -1 },
    primaryTag: '부채청산',
    strengths: {
      ko: [
        '레거시 코드에서 개선 포인트를 정확히 찾아낸다',
        '점진적 리팩토링으로 시스템 안정성을 높인다',
        '기술 부채의 비즈니스 임팩트를 설득력 있게 설명한다',
      ],
      en: [
        'Accurately finds improvement points in legacy code',
        'Increases system stability through gradual refactoring',
        'Persuasively explains business impact of technical debt',
      ],
      ja: [
        'レガシーコードで改善ポイントを正確に見つける',
        '段階的リファクタリングでシステム安定性を高める',
        '技術的負債のビジネスインパクトを説得力を持って説明する',
      ],
    },
    pitfalls: {
      ko: [
        '리팩토링에 빠져 새 기능 개발이 지연될 수 있다',
        '"이 코드 다시 짜야 해"를 너무 자주 말할 수 있다',
        '완벽한 코드를 추구하다 실용적 타협을 놓친다',
      ],
      en: [
        'New feature development may be delayed while absorbed in refactoring',
        'May say "We need to rewrite this code" too often',
        'Misses practical compromises while pursuing perfect code',
      ],
      ja: [
        'リファクタリングにハマって新機能開発が遅れる可能性がある',
        '「このコード書き直さないと」をあまりにも頻繁に言う可能性がある',
        '完璧なコードを追求して実用的妥協を逃す',
      ],
    },
    kiroFeatures: [
      {
        name: { ko: 'Autopilot Mode', en: 'Autopilot Mode', ja: 'Autopilot Mode' },
        description: {
          ko: '대규모 리팩토링을 AI와 안전하게 수행',
          en: 'Safely perform large-scale refactoring with AI',
          ja: '大規模リファクタリングをAIと安全に実行',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Specs', en: 'Specs', ja: 'Specs' },
        description: {
          ko: '기술 부채 목록을 체계적으로 관리하고 우선순위 지정',
          en: 'Systematically manage technical debt list and prioritize',
          ja: '技術的負債リストを体系的に管理して優先順位指定',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Hooks (postToolUse)', en: 'Hooks (postToolUse)', ja: 'Hooks (postToolUse)' },
        description: {
          ko: '리팩토링 후 자동으로 영향 범위 분석 및 테스트 실행',
          en: 'Auto-analyze impact scope and run tests after refactoring',
          ja: 'リファクタリング後に自動で影響範囲分析とテスト実行',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Checkpointing', en: 'Checkpointing', ja: 'Checkpointing' },
        description: {
          ko: '대규모 리팩토링 중 단계별 체크포인트 생성, 문제 시 안전하게 부분 롤백',
          en: 'Create step-by-step checkpoints during large refactoring, safely partial rollback on issues',
          ja: '大規模リファクタリング中に段階別チェックポイント生成、問題時に安全に部分ロールバック',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Custom Subagents', en: 'Custom Subagents', ja: 'Custom Subagents' },
        description: {
          ko: '레거시 분석 전문 에이전트와 마이그레이션 전문 에이전트를 분리하여 효율적 작업',
          en: 'Efficient work by separating legacy analysis and migration specialist agents',
          ja: 'レガシー分析専門エージェントとマイグレーション専門エージェントを分離して効率的作業',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Property-Based Testing', en: 'Property-Based Testing', ja: 'Property-Based Testing' },
        description: {
          ko: '리팩토링 전후 동작 동일성을 속성 테스트로 자동 검증',
          en: 'Auto-verify behavior equivalence before and after refactoring with property testing',
          ja: 'リファクタリング前後の動作同一性をプロパティテストで自動検証',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Hooks (preToolUse)', en: 'Hooks (preToolUse)', ja: 'Hooks (preToolUse)' },
        description: {
          ko: '대규모 변경 전 영향 범위 자동 분석 및 경고',
          en: 'Auto-analyze impact scope and warn before large changes',
          ja: '大規模変更前に影響範囲を自動分析と警告',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'MCP (Code Analysis)', en: 'MCP (Code Analysis)', ja: 'MCP (Code Analysis)' },
        description: {
          ko: 'SonarQube, CodeClimate 등 코드 분석 도구 연동으로 기술 부채 자동 탐지',
          en: 'Auto-detect technical debt by integrating code analysis tools like SonarQube and CodeClimate',
          ja: 'SonarQube、CodeClimateなどコード分析ツール連携で技術的負債を自動検出',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Steering (Refactoring Patterns)', en: 'Steering (Refactoring Patterns)', ja: 'Steering (Refactoring Patterns)' },
        description: {
          ko: '리팩토링 패턴과 모범 사례를 Steering으로 등록하여 일관된 개선 방향 유지',
          en: 'Maintain consistent improvement direction by registering refactoring patterns and best practices as Steering',
          ja: 'リファクタリングパターンとベストプラクティスをSteeringで登録して一貫した改善方向維持',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Powers (Strands + Bedrock)', en: 'Powers (Strands + Bedrock)', ja: 'Powers (Strands + Bedrock)' },
        description: {
          ko: 'Strands로 레거시 분석 에이전트 구축, Bedrock Claude가 기술 부채 우선순위를 비즈니스 임팩트 기준으로 자동 산정',
          en: 'Build legacy analysis agents with Strands, Bedrock Claude auto-calculates technical debt priority by business impact',
          ja: 'Strandsでレガシー分析エージェント構築、Bedrock Claudeが技術的負債優先順位をビジネスインパクト基準で自動算定',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Skills (Legacy Migration)', en: 'Skills (Legacy Migration)', ja: 'Skills (Legacy Migration)' },
        description: {
          ko: 'Java to Kotlin, AngularJS to React 등 마이그레이션 전문 Skills를 레거시 전환 작업 시에만 로드하여 체계적 이전 전략 수립',
          en: 'Load migration Skills like Java to Kotlin, AngularJS to React only during legacy conversion to establish systematic migration strategy',
          ja: 'Java to Kotlin、AngularJS to Reactなどマイグレーション専門Skillsをレガシー転換作業時のみロードして体系的移行戦略樹立',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Open Weight Models (DeepSeek v3.2)', en: 'Open Weight Models (DeepSeek v3.2)', ja: 'Open Weight Models (DeepSeek v3.2)' },
        description: {
          ko: '복잡한 리팩토링 추론과 멀티스텝 코드 변환에 강한 모델로 안전한 레거시 개선',
          en: 'Safe legacy improvement with model strong in complex refactoring reasoning and multi-step code conversion',
          ja: '複雑なリファクタリング推論とマルチステップコード変換に強いモデルで安全なレガシー改善',
        },
        level: 'advanced',
      },
    ],
    aiTips: {
      ko: [
        '"이 레거시 모듈을 현대적 패턴으로 리팩토링 계획을 세워줘"',
        '"이 코드의 순환 복잡도를 분석하고 개선 방안을 제안해줘"',
        '"이 함수를 작은 단위로 분리하면서 기존 테스트가 깨지지 않게 해줘"',
      ],
      en: [
        '"Create a refactoring plan to modernize this legacy module"',
        '"Analyze cyclomatic complexity of this code and suggest improvements"',
        '"Split this function into smaller units without breaking existing tests"',
      ],
      ja: [
        '"このレガシーモジュールを現代的パターンでリファクタリング計画を立てて"',
        '"このコードの循環複雑度を分析して改善案を提案して"',
        '"この関数を小さな単位に分離しながら既存テストが壊れないようにして"',
      ],
    },
    synergy: 'gatssn',
    tension: 'chonggak',
  },
  {
    slug: 'mulgwisin',
    emoji: '🌊',
    name: {
      ko: '물귀신',
      en: 'Mulgwisin',
      ja: 'ムルグィシン',
    },
    title: {
      ko: '연결 촉진자',
      en: 'Connection Facilitator',
      ja: '連結促進者',
    },
    description: {
      ko: '사람과 시스템을 연결하는 협업의 달인',
      en: 'Collaboration master connecting people and systems',
      ja: '人とシステムを繋ぐ協業の達人',
    },
    axisValues: { A: -1, B: 1, C: 1, D: 1 },
    primaryTag: '연결',
    strengths: {
      ko: [
        '팀 간 커뮤니케이션을 원활하게 이끈다',
        '서로 다른 시스템을 통합하는 능력이 뛰어나다',
        '지식 공유와 페어 프로그래밍을 적극적으로 실천한다',
      ],
      en: [
        'Smoothly leads inter-team communication',
        'Excellent ability to integrate different systems',
        'Actively practices knowledge sharing and pair programming',
      ],
      ja: [
        'チーム間コミュニケーションを円滑に導く',
        '異なるシステムを統合する能力が優れている',
        '知識共有とペアプログラミングを積極的に実践する',
      ],
    },
    pitfalls: {
      ko: [
        '모든 회의에 참석하려다 개발 시간이 부족해진다',
        '다른 팀 일까지 떠안아 본인 업무가 밀릴 수 있다',
        '"같이 하면 더 좋지 않을까?"로 불필요한 의존성을 만든다',
      ],
      en: [
        'Development time becomes insufficient trying to attend all meetings',
        'Own tasks may pile up by taking on other teams\' work',
        'Creates unnecessary dependencies with "Wouldn\'t it be better together?"',
      ],
      ja: [
        'すべての会議に参加しようとして開発時間が不足する',
        '他チームの仕事まで引き受けて自分の業務が遅れる可能性がある',
        '「一緒にやったらもっと良くない？」で不要な依存性を作る',
      ],
    },
    kiroFeatures: [
      {
        name: { ko: 'MCP Integration', en: 'MCP Integration', ja: 'MCP Integration' },
        description: {
          ko: '다양한 팀 도구와 서비스를 하나로 연결',
          en: 'Connect various team tools and services as one',
          ja: '様々なチームツールとサービスを一つに接続',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Specs', en: 'Specs', ja: 'Specs' },
        description: {
          ko: '팀 간 인터페이스와 계약을 명확하게 정의',
          en: 'Clearly define inter-team interfaces and contracts',
          ja: 'チーム間インターフェースと契約を明確に定義',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Autopilot Mode', en: 'Autopilot Mode', ja: 'Autopilot Mode' },
        description: {
          ko: '통합 작업의 보일러플레이트를 자동 생성',
          en: 'Auto-generate boilerplate for integration work',
          ja: '統合作業のボイラープレートを自動生成',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Specs (API Reference)', en: 'Specs (API Reference)', ja: 'Specs (API Reference)' },
        description: {
          ko: 'API 스펙 파일(OpenAPI, GraphQL)을 Spec에 참조 연결하여 인터페이스 설계 자동화',
          en: 'Automate interface design by linking API spec files (OpenAPI, GraphQL) to Spec',
          ja: 'APIスペックファイル(OpenAPI、GraphQL)をSpecに参照連結してインターフェース設計自動化',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Powers (Supabase, Stripe)', en: 'Powers (Supabase, Stripe)', ja: 'Powers (Supabase, Stripe)' },
        description: {
          ko: '자주 쓰는 외부 서비스를 Powers로 원클릭 연동, 설정 자동화',
          en: 'One-click integrate frequently used external services with Powers, automate configuration',
          ja: 'よく使う外部サービスをPowersでワンクリック連携、設定自動化',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Custom Subagents', en: 'Custom Subagents', ja: 'Custom Subagents' },
        description: {
          ko: 'API 연동 전문 에이전트와 테스트 전문 에이전트를 분리하여 통합 작업 병렬화',
          en: 'Parallelize integration work by separating API integration and testing specialist agents',
          ja: 'API連携専門エージェントとテスト専門エージェントを分離して統合作業を並列化',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Multimodal Chat', en: 'Multimodal Chat', ja: 'Multimodal Chat' },
        description: {
          ko: '아키텍처 다이어그램 이미지를 채팅에 첨부하여 시스템 연결 구조 분석 요청',
          en: 'Attach architecture diagram images to chat to request system connection structure analysis',
          ja: 'アーキテクチャダイアグラム画像をチャットに添付してシステム接続構造分析要請',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Steering (Integration Patterns)', en: 'Steering (Integration Patterns)', ja: 'Steering (Integration Patterns)' },
        description: {
          ko: '외부 의존성 관리 정책과 API 연동 가이드라인을 Steering으로 팀 공유',
          en: 'Share external dependency management policies and API integration guidelines with team via Steering',
          ja: '外部依存性管理ポリシーとAPI連携ガイドラインをSteeringでチーム共有',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Powers (Slack, Notion)', en: 'Powers (Slack, Notion)', ja: 'Powers (Slack, Notion)' },
        description: {
          ko: '협업 도구 Powers로 팀 커뮤니케이션을 IDE 안에서 통합 관리',
          en: 'Integrate team communication within IDE with collaboration tool Powers',
          ja: '協業ツールPowersでチームコミュニケーションをIDE内で統合管理',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Powers (Strands + Bedrock)', en: 'Powers (Strands + Bedrock)', ja: 'Powers (Strands + Bedrock)' },
        description: {
          ko: 'Strands로 API 통합 에이전트 구축, Bedrock Claude가 OpenAPI 스펙 분석하여 클라이언트 코드 및 테스트 자동 생성',
          en: 'Build API integration agents with Strands, Bedrock Claude analyzes OpenAPI specs to auto-generate client code and tests',
          ja: 'StrandsでAPI統合エージェント構築、Bedrock ClaudeがOpenAPIスペック分析してクライアントコードとテスト自動生成',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Skills (API Integration)', en: 'Skills (API Integration)', ja: 'Skills (API Integration)' },
        description: {
          ko: 'REST, GraphQL, gRPC 등 API 통합 패턴 Skills를 외부 서비스 연동 시에만 활성화하여 프로토콜별 베스트 프랙티스 적용',
          en: 'Activate API integration pattern Skills like REST, GraphQL, gRPC only during external service integration to apply protocol-specific best practices',
          ja: 'REST、GraphQL、gRPCなどAPI統合パターンSkillsを外部サービス連携時のみ有効化してプロトコル別ベストプラクティス適用',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Open Weight Models (MiniMax 2.1)', en: 'Open Weight Models (MiniMax 2.1)', ja: 'Open Weight Models (MiniMax 2.1)' },
        description: {
          ko: 'Rust, Java, Go, TypeScript 등 다국어 프로그래밍에 강한 모델로 다양한 시스템 통합',
          en: 'Integrate various systems with model strong in multilingual programming like Rust, Java, Go, TypeScript',
          ja: 'Rust、Java、Go、TypeScriptなど多言語プログラミングに強いモデルで様々なシステム統合',
        },
        level: 'advanced',
      },
    ],
    aiTips: {
      ko: [
        '"이 두 서비스 간의 API 인터페이스를 설계해줘"',
        '"이 회의 내용을 기술 의사결정 문서로 정리해줘"',
        '"이 마이크로서비스 간 데이터 흐름을 다이어그램으로 그려줘"',
      ],
      en: [
        '"Design API interface between these two services"',
        '"Organize this meeting content as technical decision document"',
        '"Draw data flow between these microservices as diagram"',
      ],
      ja: [
        '"この二つのサービス間のAPIインターフェースを設計して"',
        '"この会議内容を技術意思決定ドキュメントで整理して"',
        '"このマイクロサービス間のデータフローをダイアグラムで描いて"',
      ],
    },
    synergy: 'dokkaebi',
    tension: 'dalgyal',
  },
  {
    slug: 'dalgyal',
    emoji: '🥚',
    name: {
      ko: '달걀귀신',
      en: 'Dalgyal Gwishin',
      ja: 'ダルギャルグィシン',
    },
    title: {
      ko: '추상화 장인',
      en: 'Abstraction Artisan',
      ja: '抽象化職人',
    },
    description: {
      ko: '복잡한 것을 단순하게, 본질만 남기는 미니멀리스트 개발자',
      en: 'Minimalist developer who simplifies complexity and leaves only essence',
      ja: '複雑なものをシンプルに、本質だけ残すミニマリスト開発者',
    },
    axisValues: { A: 1, B: -1, C: 1, D: -1 },
    primaryTag: '추상화',
    strengths: {
      ko: [
        '복잡한 시스템에서 핵심 패턴을 추출하는 능력이 탁월하다',
        '깔끔한 인터페이스와 API 설계로 팀 전체의 생산성을 높인다',
        '불필요한 코드를 과감하게 제거하여 유지보수성을 극대화한다',
      ],
      en: [
        'Excellent ability to extract core patterns from complex systems',
        'Boosts entire team productivity with clean interface and API design',
        'Maximizes maintainability by boldly removing unnecessary code',
      ],
      ja: [
        '複雑なシステムから核心パターンを抽出する能力が卓越している',
        'きれいなインターフェースとAPI設計でチーム全体の生産性を高める',
        '不要なコードを大胆に削除してメンテナンス性を最大化する',
      ],
    },
    pitfalls: {
      ko: [
        '과도한 추상화로 오히려 이해하기 어려운 코드를 만들 수 있다',
        '"이건 더 단순하게 만들 수 있어"가 끝없이 반복될 수 있다',
        '구체적인 구현보다 추상적 설계에 시간을 더 쓸 수 있다',
      ],
      en: [
        'May create code difficult to understand through excessive abstraction',
        '"This can be made simpler" may repeat endlessly',
        'May spend more time on abstract design than concrete implementation',
      ],
      ja: [
        '過度な抽象化でかえって理解しにくいコードを作る可能性がある',
        '「これはもっとシンプルにできる」が無限に繰り返される可能性がある',
        '具体的な実装より抽象的設計に時間をより使う可能性がある',
      ],
    },
    kiroFeatures: [
      {
        name: { ko: 'Specs', en: 'Specs', ja: 'Specs' },
        description: {
          ko: '복잡한 요구사항을 핵심 인터페이스로 정제하여 설계',
          en: 'Refine complex requirements into core interfaces for design',
          ja: '複雑な要件を核心インターフェースに精製して設計',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Steering Rules', en: 'Steering Rules', ja: 'Steering Rules' },
        description: {
          ko: '코드 복잡도 제한과 추상화 패턴 규칙을 AI에게 전달',
          en: 'Convey code complexity limits and abstraction pattern rules to AI',
          ja: 'コード複雑度制限と抽象化パターンルールをAIに伝達',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Autopilot Mode', en: 'Autopilot Mode', ja: 'Autopilot Mode' },
        description: {
          ko: '반복적인 보일러플레이트 제거와 리팩토링을 자동화',
          en: 'Automate repetitive boilerplate removal and refactoring',
          ja: '反復的なボイラープレート除去とリファクタリングを自動化',
        },
        level: 'basic',
      },
      {
        name: { ko: 'Steering (Complexity Rules)', en: 'Steering (Complexity Rules)', ja: 'Steering (Complexity Rules)' },
        description: {
          ko: '순환 복잡도, 함수 길이 등 복잡도 메트릭 기준을 Steering으로 강제',
          en: 'Enforce complexity metric standards like cyclomatic complexity and function length via Steering',
          ja: '循環複雑度、関数長など複雑度メトリック基準をSteeringで強制',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Custom Subagents', en: 'Custom Subagents', ja: 'Custom Subagents' },
        description: {
          ko: 'API 설계 전문 에이전트와 구현 전문 에이전트를 분리하여 추상화 레벨 관리',
          en: 'Manage abstraction levels by separating API design and implementation specialist agents',
          ja: 'API設計専門エージェントと実装専門エージェントを分離して抽象化レベル管理',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Hooks (preToolUse)', en: 'Hooks (preToolUse)', ja: 'Hooks (preToolUse)' },
        description: {
          ko: '코드 작성 전 불필요한 추상화 레이어 자동 감지 및 경고',
          en: 'Auto-detect and warn about unnecessary abstraction layers before code writing',
          ja: 'コード作成前に不要な抽象化レイヤーを自動検出と警告',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Property-Based Testing', en: 'Property-Based Testing', ja: 'Property-Based Testing' },
        description: {
          ko: '추상화된 인터페이스의 계약을 속성 테스트로 자동 검증',
          en: 'Auto-verify abstracted interface contracts with property testing',
          ja: '抽象化されたインターフェースの契約をプロパティテストで自動検証',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'MCP (Design Tools)', en: 'MCP (Design Tools)', ja: 'MCP (Design Tools)' },
        description: {
          ko: 'PlantUML, Mermaid 등으로 추상화 구조를 시각화하여 팀과 공유',
          en: 'Visualize abstraction structure with PlantUML, Mermaid, etc. and share with team',
          ja: 'PlantUML、Mermaidなどで抽象化構造を視覚化してチームと共有',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Checkpointing', en: 'Checkpointing', ja: 'Checkpointing' },
        description: {
          ko: '추상화 시도 전 체크포인트 생성, 과도한 추상화 시 즉시 롤백',
          en: 'Create checkpoint before abstraction attempt, instantly rollback on excessive abstraction',
          ja: '抽象化試み前にチェックポイント生成、過度な抽象化時に即座にロールバック',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Powers (Strands + Bedrock)', en: 'Powers (Strands + Bedrock)', ja: 'Powers (Strands + Bedrock)' },
        description: {
          ko: 'Strands로 인터페이스 설계 에이전트 구축, Bedrock Claude가 복잡도 메트릭 분석하여 최적 추상화 레벨 자동 제안',
          en: 'Build interface design agents with Strands, Bedrock Claude analyzes complexity metrics to auto-suggest optimal abstraction level',
          ja: 'Strandsでインターフェース設計エージェント構築、Bedrock Claudeが複雑度メトリック分析して最適抽象化レベルを自動提案',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Skills (Design Patterns)', en: 'Skills (Design Patterns)', ja: 'Skills (Design Patterns)' },
        description: {
          ko: 'GoF 패턴, 함수형 패턴 등 디자인 패턴 Skills를 추상화 설계 시에만 로드하여 컨텍스트 효율적으로 패턴 적용',
          en: 'Load design pattern Skills like GoF patterns and functional patterns only during abstraction design to efficiently apply patterns with context',
          ja: 'GoFパターン、関数型パターンなどデザインパターンSkillsを抽象化設計時のみロードしてコンテキスト効率的にパターン適用',
        },
        level: 'advanced',
      },
      {
        name: { ko: 'Open Weight Models (DeepSeek v3.2)', en: 'Open Weight Models (DeepSeek v3.2)', ja: 'Open Weight Models (DeepSeek v3.2)' },
        description: {
          ko: '복잡한 패턴 추론과 추상화 설계에 강한 모델로 본질적인 인터페이스 도출',
          en: 'Derive essential interfaces with model strong in complex pattern reasoning and abstraction design',
          ja: '複雑なパターン推論と抽象化設計に強いモデルで本質的なインターフェース導出',
        },
        level: 'advanced',
      },
    ],
    aiTips: {
      ko: [
        '"이 모듈의 공개 인터페이스를 최소화하는 방법을 제안해줘"',
        '"이 코드에서 불필요한 추상화 레이어를 찾아줘"',
        '"이 복잡한 로직을 더 단순한 패턴으로 리팩토링해줘"',
      ],
      en: [
        '"Suggest ways to minimize this module\'s public interface"',
        '"Find unnecessary abstraction layers in this code"',
        '"Refactor this complex logic into simpler patterns"',
      ],
      ja: [
        '"このモジュールの公開インターフェースを最小化する方法を提案して"',
        '"このコードで不要な抽象化レイヤーを見つけて"',
        '"この複雑なロジックをよりシンプルなパターンでリファクタリングして"',
      ],
    },
    synergy: 'jangseung',
    tension: 'mulgwisin',
  },
];

/** 슬러그로 캐릭터 프로필 조회 */
export function getCharacterBySlug(slug: CharacterSlug): CharacterProfile | undefined {
  return characters.find((c) => c.slug === slug);
}

/** 모든 캐릭터 슬러그 목록 */
export const allSlugs: CharacterSlug[] = characters.map((c) => c.slug);

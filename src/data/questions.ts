// 질문 데이터 타입 정의 및 질문 목록

import type { Locale } from '@/lib/types';

/** 질문 선택지 */
export interface QuestionOption {
  text: Record<Locale, string>; // 선택지 텍스트 (다국어)
  axisEffect?: {
    // Q1~Q8: 축 점수 영향
    axis: 'A' | 'B' | 'C' | 'D';
    value: -1 | 1;
  };
  tagEffect?: string; // Q9~Q16: 보조 태그
}

/** 질문 */
export interface Question {
  id: number; // 1~16
  text: Record<Locale, string>; // 질문 텍스트 (다국어)
  options: QuestionOption[];
}

/** 전체 질문 목록 (16문항) */
export const questions: Question[] = [
  // === Q1~Q8: 4축 성향 질문 (각 2개 선택지, axisEffect) ===
  // 각 축당 2문항씩 측정하여 점수 범위 -2~+2

  // Q1: A축 - 안정(-1) ↔ 실험(+1)
  {
    id: 1,
    text: {
      ko: '새 프로젝트를 시작할 때, 당신의 기술 스택 선택 기준은?',
      en: 'When starting a new project, what is your criteria for choosing a tech stack?',
      ja: '新しいプロジェクトを始めるとき、技術スタックの選択基準は？',
    },
    options: [
      {
        text: {
          ko: '검증된 기술을 선택한다. 안정성이 최우선이다.',
          en: 'Choose proven technologies. Stability is the top priority.',
          ja: '実績のある技術を選ぶ。安定性が最優先だ。',
        },
        axisEffect: { axis: 'A', value: -1 },
      },
      {
        text: {
          ko: '새로운 기술을 시도한다. 배움과 도전이 중요하다.',
          en: 'Try new technologies. Learning and challenges are important.',
          ja: '新しい技術を試す。学びと挑戦が重要だ。',
        },
        axisEffect: { axis: 'A', value: 1 },
      },
    ],
  },

  // Q2: B축 - 구조(-1) ↔ 즉흥(+1)
  {
    id: 2,
    text: {
      ko: '기능 구현 전, 당신의 작업 스타일은?',
      en: 'Before implementing a feature, what is your work style?',
      ja: '機能実装前、あなたの作業スタイルは？',
    },
    options: [
      {
        text: {
          ko: '설계 문서를 먼저 작성하고 구조를 잡는다.',
          en: 'Write design documents first and establish structure.',
          ja: '設計ドキュメントを先に作成し、構造を固める。',
        },
        axisEffect: { axis: 'B', value: -1 },
      },
      {
        text: {
          ko: '일단 코드를 작성하면서 방향을 잡아간다.',
          en: 'Start coding and figure out the direction as you go.',
          ja: 'まずコードを書きながら方向性を決めていく。',
        },
        axisEffect: { axis: 'B', value: 1 },
      },
    ],
  },

  // Q3: C축 - 개인(-1) ↔ 협업(+1)
  {
    id: 3,
    text: {
      ko: '어려운 버그를 만났을 때, 당신의 대처 방식은?',
      en: 'When you encounter a difficult bug, how do you handle it?',
      ja: '難しいバグに遭遇したとき、あなたの対処方法は？',
    },
    options: [
      {
        text: {
          ko: '혼자 깊이 파고들어 끝까지 해결한다.',
          en: 'Dig deep alone and solve it to the end.',
          ja: '一人で深く掘り下げて最後まで解決する。',
        },
        axisEffect: { axis: 'C', value: -1 },
      },
      {
        text: {
          ko: '팀원과 함께 논의하며 해결 방법을 찾는다.',
          en: 'Discuss with team members to find a solution.',
          ja: 'チームメンバーと一緒に議論して解決方法を見つける。',
        },
        axisEffect: { axis: 'C', value: 1 },
      },
    ],
  },

  // Q4: D축 - 품질(-1) ↔ 속도(+1)
  {
    id: 4,
    text: {
      ko: '배포 일정이 촉박할 때, 당신의 우선순위는?',
      en: 'When the deployment deadline is tight, what is your priority?',
      ja: 'デプロイのスケジュールが厳しいとき、あなたの優先順位は？',
    },
    options: [
      {
        text: {
          ko: '일정이 밀리더라도 코드 품질과 테스트를 챙긴다.',
          en: 'Maintain code quality and testing even if the schedule slips.',
          ja: 'スケジュールが遅れてもコード品質とテストを確保する。',
        },
        axisEffect: { axis: 'D', value: -1 },
      },
      {
        text: {
          ko: '일단 빠르게 배포하고 이후에 개선한다.',
          en: 'Deploy quickly first and improve later.',
          ja: 'まず素早くデプロイして後で改善する。',
        },
        axisEffect: { axis: 'D', value: 1 },
      },
    ],
  },

  // Q5: A축 - 안정(-1) ↔ 실험(+1) (2차 측정)
  {
    id: 5,
    text: {
      ko: '프로젝트에서 예상치 못한 문제가 발생했을 때, 당신의 해결 방식은?',
      en: 'When an unexpected problem occurs in a project, how do you solve it?',
      ja: 'プロジェクトで予期しない問題が発生したとき、あなたの解決方法は？',
    },
    options: [
      {
        text: {
          ko: '검증된 해결책을 찾아 안전하게 적용한다.',
          en: 'Find proven solutions and apply them safely.',
          ja: '実績のある解決策を見つけて安全に適用する。',
        },
        axisEffect: { axis: 'A', value: -1 },
      },
      {
        text: {
          ko: '창의적인 방법을 시도하며 새로운 접근을 탐색한다.',
          en: 'Try creative methods and explore new approaches.',
          ja: '創造的な方法を試して新しいアプローチを探る。',
        },
        axisEffect: { axis: 'A', value: 1 },
      },
    ],
  },

  // Q6: B축 - 구조(-1) ↔ 즉흥(+1) (2차 측정)
  {
    id: 6,
    text: {
      ko: '코드 리뷰를 할 때, 당신이 가장 중요하게 보는 것은?',
      en: 'When doing code reviews, what do you consider most important?',
      ja: 'コードレビューをするとき、最も重要視することは？',
    },
    options: [
      {
        text: {
          ko: '전체 구조와 설계 패턴이 일관성 있게 유지되는지 확인한다.',
          en: 'Check if the overall structure and design patterns are consistent.',
          ja: '全体構造と設計パターンが一貫して維持されているか確認する。',
        },
        axisEffect: { axis: 'B', value: -1 },
      },
      {
        text: {
          ko: '코드가 실용적으로 동작하고 빠르게 수정 가능한지 확인한다.',
          en: 'Check if the code works practically and can be modified quickly.',
          ja: 'コードが実用的に動作し、素早く修正可能か確認する。',
        },
        axisEffect: { axis: 'B', value: 1 },
      },
    ],
  },

  // Q7: C축 - 개인(-1) ↔ 협업(+1) (2차 측정)
  {
    id: 7,
    text: {
      ko: '새로운 기능을 개발할 때, 당신의 선호하는 방식은?',
      en: 'When developing a new feature, what is your preferred approach?',
      ja: '新しい機能を開発するとき、あなたの好みの方法は？',
    },
    options: [
      {
        text: {
          ko: '요구사항을 명확히 파악한 후 혼자 집중해서 완성한다.',
          en: 'Understand requirements clearly and complete it alone with focus.',
          ja: '要件を明確に把握した後、一人で集中して完成させる。',
        },
        axisEffect: { axis: 'C', value: -1 },
      },
      {
        text: {
          ko: '팀원들과 지속적으로 소통하며 함께 만들어간다.',
          en: 'Communicate continuously with team members and build together.',
          ja: 'チームメンバーと継続的にコミュニケーションを取りながら一緒に作る。',
        },
        axisEffect: { axis: 'C', value: 1 },
      },
    ],
  },

  // Q8: D축 - 품질(-1) ↔ 속도(+1) (2차 측정)
  {
    id: 8,
    text: {
      ko: '프로토타입을 만들 때, 당신의 접근 방식은?',
      en: 'When creating a prototype, what is your approach?',
      ja: 'プロトタイプを作るとき、あなたのアプローチは？',
    },
    options: [
      {
        text: {
          ko: '처음부터 확장 가능한 구조로 견고하게 만든다.',
          en: 'Build it robustly with a scalable structure from the start.',
          ja: '最初から拡張可能な構造で堅牢に作る。',
        },
        axisEffect: { axis: 'D', value: -1 },
      },
      {
        text: {
          ko: '빠르게 동작하는 버전을 만들고 필요시 개선한다.',
          en: 'Create a working version quickly and improve as needed.',
          ja: '素早く動作するバージョンを作り、必要に応じて改善する。',
        },
        axisEffect: { axis: 'D', value: 1 },
      },
    ],
  },

  // === Q9~Q16: 보조 태그 질문 (각 4개 선택지, tagEffect) ===
  // 8개 태그: 설계, UX, 부채청산, 몰입, 자동화, 연결, 테스트, 거버넌스
  // 각 태그는 Q9~Q16에 걸쳐 정확히 2개 질문에만 등장 (각 태그당 2번의 선택 기회)

  // Q9: 설계, UX, 부채청산, 몰입
  {
    id: 9,
    text: {
      ko: '팀에서 자유 시간이 주어졌다면, 가장 하고 싶은 일은?',
      en: 'If you had free time in your team, what would you most want to do?',
      ja: 'チームで自由時間が与えられたら、最もやりたいことは？',
    },
    options: [
      {
        text: {
          ko: '시스템 아키텍처를 다이어그램으로 정리한다.',
          en: 'Organize system architecture into diagrams.',
          ja: 'システムアーキテクチャを図で整理する。',
        },
        tagEffect: '설계',
      },
      {
        text: {
          ko: '사용자 피드백을 분석해 UI를 개선한다.',
          en: 'Analyze user feedback and improve the UI.',
          ja: 'ユーザーフィードバックを分析してUIを改善する。',
        },
        tagEffect: 'UX',
      },
      {
        text: {
          ko: '오래된 레거시 코드를 리팩토링한다.',
          en: 'Refactor old legacy code.',
          ja: '古いレガシーコードをリファクタリングする。',
        },
        tagEffect: '부채청산',
      },
      {
        text: {
          ko: '관심 있던 사이드 프로젝트에 몰두한다.',
          en: 'Immerse yourself in a side project of interest.',
          ja: '興味のあったサイドプロジェクトに没頭する。',
        },
        tagEffect: '몰입',
      },
    ],
  },

  // Q10: 자동화, 연결, 테스트, 거버넌스
  {
    id: 10,
    text: {
      ko: '팀의 개발 생산성을 높이기 위해 가장 먼저 하고 싶은 것은?',
      en: 'What would you do first to improve team development productivity?',
      ja: 'チームの開発生産性を高めるために最初にやりたいことは？',
    },
    options: [
      {
        text: {
          ko: 'CI/CD 파이프라인을 구축하거나 개선한다.',
          en: 'Build or improve CI/CD pipelines.',
          ja: 'CI/CDパイプラインを構築または改善する。',
        },
        tagEffect: '자동화',
      },
      {
        text: {
          ko: '팀 간 커뮤니케이션 채널을 정비한다.',
          en: 'Organize communication channels between teams.',
          ja: 'チーム間のコミュニケーションチャネルを整備する。',
        },
        tagEffect: '연결',
      },
      {
        text: {
          ko: '테스트 커버리지를 높이고 자동 테스트를 도입한다.',
          en: 'Increase test coverage and introduce automated testing.',
          ja: 'テストカバレッジを高め、自動テストを導入する。',
        },
        tagEffect: '테스트',
      },
      {
        text: {
          ko: '코딩 컨벤션과 PR 리뷰 프로세스를 정립한다.',
          en: 'Establish coding conventions and PR review processes.',
          ja: 'コーディング規約とPRレビュープロセスを確立する。',
        },
        tagEffect: '거버넌스',
      },
    ],
  },

  // Q11: 설계, UX, 부채청산, 몰입
  {
    id: 11,
    text: {
      ko: 'AI 코딩 어시스턴트를 가장 활용하고 싶은 상황은?',
      en: 'When would you most want to use an AI coding assistant?',
      ja: 'AIコーディングアシスタントを最も活用したい状況は？',
    },
    options: [
      {
        text: {
          ko: '복잡한 시스템의 설계 대안을 비교 분석할 때.',
          en: 'When comparing and analyzing design alternatives for complex systems.',
          ja: '複雑なシステムの設計代替案を比較分析するとき。',
        },
        tagEffect: '설계',
      },
      {
        text: {
          ko: '사용자 경험을 개선하는 인터페이스를 디자인할 때.',
          en: 'When designing interfaces that improve user experience.',
          ja: 'ユーザー体験を改善するインターフェースをデザインするとき。',
        },
        tagEffect: 'UX',
      },
      {
        text: {
          ko: '복잡하게 얽힌 레거시 코드를 이해하고 정리할 때.',
          en: 'When understanding and organizing tangled legacy code.',
          ja: '複雑に絡み合ったレガシーコードを理解して整理するとき。',
        },
        tagEffect: '부채청산',
      },
      {
        text: {
          ko: '깊은 집중이 필요한 알고리즘 구현에 몰입할 때.',
          en: 'When immersing in algorithm implementation that requires deep focus.',
          ja: '深い集中が必要なアルゴリズム実装に没頭するとき。',
        },
        tagEffect: '몰입',
      },
    ],
  },

  // Q12: 자동화, 연결, 테스트, 거버넌스
  {
    id: 12,
    text: {
      ko: '개발 프로세스 개선에서 가장 중요하게 생각하는 것은?',
      en: 'What do you consider most important in improving development processes?',
      ja: '開発プロセス改善で最も重要視することは？',
    },
    options: [
      {
        text: {
          ko: '반복 작업을 자동화하여 효율을 높인다.',
          en: 'Automate repetitive tasks to increase efficiency.',
          ja: '繰り返し作業を自動化して効率を高める。',
        },
        tagEffect: '자동화',
      },
      {
        text: {
          ko: '다른 팀과의 협업 프로세스를 원활하게 만든다.',
          en: 'Make collaboration processes with other teams smooth.',
          ja: '他チームとの協業プロセスをスムーズにする。',
        },
        tagEffect: '연결',
      },
      {
        text: {
          ko: '안정적인 배포를 위한 테스트 전략을 수립한다.',
          en: 'Establish testing strategies for stable deployment.',
          ja: '安定したデプロイのためのテスト戦略を立てる。',
        },
        tagEffect: '테스트',
      },
      {
        text: {
          ko: '팀 전체가 따를 수 있는 명확한 규칙을 만든다.',
          en: 'Create clear rules that the entire team can follow.',
          ja: 'チーム全体が従える明確なルールを作る。',
        },
        tagEffect: '거버넌스',
      },
    ],
  },

  // Q13: 설계, UX, 부채청산, 몰입
  {
    id: 13,
    text: {
      ko: '새로운 기능을 개발할 때, 가장 신경 쓰는 부분은?',
      en: 'When developing a new feature, what do you care about most?',
      ja: '新しい機能を開発するとき、最も気を使う部分は？',
    },
    options: [
      {
        text: {
          ko: '확장 가능한 구조로 설계하여 미래를 대비한다.',
          en: 'Design with a scalable structure to prepare for the future.',
          ja: '拡張可能な構造で設計して未来に備える。',
        },
        tagEffect: '설계',
      },
      {
        text: {
          ko: '사용자가 직관적으로 이해할 수 있는 인터페이스를 만든다.',
          en: 'Create an interface that users can intuitively understand.',
          ja: 'ユーザーが直感的に理解できるインターフェースを作る。',
        },
        tagEffect: 'UX',
      },
      {
        text: {
          ko: '기존 코드와의 일관성을 유지하고 기술 부채를 줄인다.',
          en: 'Maintain consistency with existing code and reduce technical debt.',
          ja: '既存コードとの一貫性を保ち、技術的負債を減らす。',
        },
        tagEffect: '부채청산',
      },
      {
        text: {
          ko: '핵심 로직에 집중하여 완벽하게 구현한다.',
          en: 'Focus on core logic and implement it perfectly.',
          ja: 'コアロジックに集中して完璧に実装する。',
        },
        tagEffect: '몰입',
      },
    ],
  },

  // Q14: 자동화, 연결, 테스트, 거버넌스
  {
    id: 14,
    text: {
      ko: '코드 품질 향상을 위해 우선적으로 하고 싶은 것은?',
      en: 'What would you prioritize to improve code quality?',
      ja: 'コード品質向上のために優先的にやりたいことは？',
    },
    options: [
      {
        text: {
          ko: '빌드와 배포 과정을 자동화하여 실수를 줄인다.',
          en: 'Automate build and deployment processes to reduce mistakes.',
          ja: 'ビルドとデプロイプロセスを自動化してミスを減らす。',
        },
        tagEffect: '자동화',
      },
      {
        text: {
          ko: '코드 리뷰 문화를 정착시켜 지식을 공유한다.',
          en: 'Establish a code review culture to share knowledge.',
          ja: 'コードレビュー文化を定着させて知識を共有する。',
        },
        tagEffect: '연결',
      },
      {
        text: {
          ko: '다양한 시나리오를 커버하는 테스트를 작성한다.',
          en: 'Write tests that cover various scenarios.',
          ja: '様々なシナリオをカバーするテストを作成する。',
        },
        tagEffect: '테스트',
      },
      {
        text: {
          ko: '코드 스타일과 아키텍처 가이드라인을 문서화한다.',
          en: 'Document code style and architecture guidelines.',
          ja: 'コードスタイルとアーキテクチャガイドラインを文書化する。',
        },
        tagEffect: '거버넌스',
      },
    ],
  },

  // Q15: 설계, UX, 부채청산, 몰입
  {
    id: 15,
    text: {
      ko: '프로젝트에서 가장 보람을 느끼는 순간은?',
      en: 'When do you feel most rewarded in a project?',
      ja: 'プロジェクトで最もやりがいを感じる瞬間は？',
    },
    options: [
      {
        text: {
          ko: '복잡한 시스템을 우아한 구조로 설계했을 때.',
          en: 'When designing a complex system with an elegant structure.',
          ja: '複雑なシステムを優雅な構造で設計したとき。',
        },
        tagEffect: '설계',
      },
      {
        text: {
          ko: '사용자가 "이거 진짜 편하다"고 말할 때.',
          en: 'When users say "This is really convenient".',
          ja: 'ユーザーが「これ本当に便利だ」と言うとき。',
        },
        tagEffect: 'UX',
      },
      {
        text: {
          ko: '오래된 기술 부채를 깔끔하게 정리했을 때.',
          en: 'When cleaning up old technical debt neatly.',
          ja: '古い技術的負債をきれいに整理したとき。',
        },
        tagEffect: '부채청산',
      },
      {
        text: {
          ko: '어려운 문제를 끝까지 파고들어 해결했을 때.',
          en: 'When solving a difficult problem by digging deep to the end.',
          ja: '難しい問題を最後まで掘り下げて解決したとき。',
        },
        tagEffect: '몰입',
      },
    ],
  },

  // Q16: 자동화, 연결, 테스트, 거버넌스
  {
    id: 16,
    text: {
      ko: '성공적인 프로젝트의 핵심 요소는?',
      en: 'What is the key element of a successful project?',
      ja: '成功したプロジェクトの核心要素は？',
    },
    options: [
      {
        text: {
          ko: '효율적인 개발 도구와 자동화된 워크플로우.',
          en: 'Efficient development tools and automated workflows.',
          ja: '効率的な開発ツールと自動化されたワークフロー。',
        },
        tagEffect: '자동화',
      },
      {
        text: {
          ko: '다른 팀과의 원활한 협업과 소통.',
          en: 'Smooth collaboration and communication with other teams.',
          ja: '他チームとのスムーズな協業とコミュニケーション。',
        },
        tagEffect: '연결',
      },
      {
        text: {
          ko: '철저한 테스트로 보장된 안정성.',
          en: 'Stability ensured by thorough testing.',
          ja: '徹底したテストで保証された安定性。',
        },
        tagEffect: '테스트',
      },
      {
        text: {
          ko: '명확한 코딩 표준과 일관된 개발 프로세스.',
          en: 'Clear coding standards and consistent development processes.',
          ja: '明確なコーディング標準と一貫した開発プロセス。',
        },
        tagEffect: '거버넌스',
      },
    ],
  },
];

// 캐릭터 데이터 타입 정의

/** 10개 캐릭터 URL 슬러그 */
export type CharacterSlug =
  | 'gatssn'
  | 'chonggak'
  | 'cheonyeo'
  | 'dokkaebi'
  | 'gumiho'
  | 'haetae'
  | 'jangseung'
  | 'jeoseung'
  | 'mulgwisin'
  | 'dalgyal';

/** 4축 성향 점수 (각 축 범위: -2 ~ +2) */
export interface AxisScores {
  A: number; // 안정(-2~-1) ↔ 실험(+1~+2), 범위: -2 ~ +2
  B: number; // 구조(-2~-1) ↔ 즉흥(+1~+2), 범위: -2 ~ +2
  C: number; // 개인(-2~-1) ↔ 협업(+1~+2), 범위: -2 ~ +2
  D: number; // 품질(-2~-1) ↔ 속도(+1~+2), 범위: -2 ~ +2
}

/** 보조 태그 점수 (각 태그 범위: 0 ~ 2) */
export interface AuxiliaryTags {
  설계: number;      // 범위: 0 ~ 2
  UX: number;        // 범위: 0 ~ 2
  부채청산: number;  // 범위: 0 ~ 2
  몰입: number;      // 범위: 0 ~ 2
  자동화: number;    // 범위: 0 ~ 2
  연결: number;      // 범위: 0 ~ 2
  테스트: number;    // 범위: 0 ~ 2
  거버넌스: number;  // 범위: 0 ~ 2
}

/** 언어 타입 */
export type Locale = 'ko' | 'en' | 'ja';

/** 추천 Kiro 기능 */
export interface KiroFeature {
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  level: 'basic' | 'advanced'; // 기본 기능 또는 고급 기능
}

/** 캐릭터 프로필 */
export interface CharacterProfile {
  slug: CharacterSlug;
  emoji: string;
  name: Record<Locale, string>; // 유형명 (예: "갓쓴키로형")
  title: Record<Locale, string>; // 부제 (예: "전략 설계자")
  description: Record<Locale, string>; // 한 줄 소개
  axisValues: AxisScores; // 캐릭터 기준 4축 값
  primaryTag: string; // 핵심 보조 태그
  strengths: Record<Locale, string[]>; // 잘하는 점
  pitfalls: Record<Locale, string[]>; // 빠지기 쉬운 함정
  kiroFeatures: KiroFeature[]; // 추천 Kiro 기능 (상위 3개)
  aiTips: Record<Locale, string[]>; // AI 협업 팁 프롬프트 예시
  synergy: CharacterSlug; // 시너지 캐릭터
  tension: CharacterSlug; // 긴장 캐릭터
}

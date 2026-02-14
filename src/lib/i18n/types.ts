/**
 * i18n 타입 정의
 */

export type Locale = 'ko' | 'en' | 'ja';

/**
 * 번역 키 인터페이스
 * 모든 번역 키는 이 인터페이스에 정의되어야 합니다.
 */
export interface TranslationKeys {
  // 홈 페이지
  'home.title': string;
  'home.description': string;
  'home.cta': string;
  'home.duration': string;
  'home.overlay.welcome': string;
  'home.overlay.start': string;
  'home.overlay.music': string;

  // 퀴즈 페이지
  'quiz.question': string;
  
  // 결과 페이지
  'result.analysis': string;
  'result.strengths': string;
  'result.pitfalls': string;
  'result.kiroFeatures': string;
  'result.aiTips': string;
  'result.share': string;
  'result.cta': string;
  'result.retake': string;

  // 공통
  'common.loading': string;
}

/**
 * 번역 데이터 타입
 */
export type TranslationData = Record<string, string>;

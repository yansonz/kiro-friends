// Amplitude 분석 유틸리티
import * as amplitude from '@amplitude/analytics-browser';

// Amplitude 초기화 여부
let isInitialized = false;

/**
 * Amplitude 초기화
 */
export function initAmplitude() {
  if (isInitialized) return;
  
  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
  
  if (!apiKey) {
    console.warn('Amplitude API key not found');
    return;
  }
  
  amplitude.init(apiKey, undefined, {
    defaultTracking: {
      sessions: true,
      pageViews: false, // 수동으로 추적
      formInteractions: false,
      fileDownloads: false,
    },
  });
  
  isInitialized = true;
}

/**
 * 페이지 뷰 이벤트 추적
 */
export function trackPageView(pageName: string, properties?: Record<string, any>) {
  if (!isInitialized) return;
  
  amplitude.track('page_view', {
    page_name: pageName,
    ...properties,
  });
}

/**
 * 홈 페이지 랜딩 추적
 */
export function trackHomeLanding() {
  trackPageView('home');
}

/**
 * 퀴즈 시작 추적
 */
export function trackQuizStart() {
  amplitude.track('quiz_start');
}

/**
 * 퀴즈 질문 뷰 추적 (이탈 분석용)
 */
export function trackQuizQuestion(questionNumber: number) {
  trackPageView(`quiz_question_${questionNumber}`, {
    question_number: questionNumber,
  });
}

/**
 * 퀴즈 응답 추적
 */
export function trackQuizAnswer(questionNumber: number, optionIndex: number) {
  amplitude.track('quiz_answer', {
    question_number: questionNumber,
    option_index: optionIndex,
  });
}

/**
 * 퀴즈 완료 추적
 */
export function trackQuizComplete(resultType: string) {
  amplitude.track('quiz_complete', {
    result_type: resultType,
  });
}

/**
 * 결과 페이지 랜딩 추적
 */
export function trackResultLanding(
  resultType: string,
  landingType: 'completed' | 'organic' | 'shared'
) {
  trackPageView('result', {
    result_type: resultType,
    landing_type: landingType,
  });
}

/**
 * CTA 버튼 클릭 추적
 */
export function trackCTAClick(
  ctaType: string,
  location: string,
  properties?: Record<string, any>
) {
  amplitude.track('cta_click', {
    cta_type: ctaType,
    location,
    ...properties,
  });
}

/**
 * 공유 버튼 클릭 추적
 */
export function trackShare(platform: string, resultType: string) {
  amplitude.track('share_click', {
    platform,
    result_type: resultType,
  });
}

/**
 * 캐릭터 슬라이더 인터랙션 추적
 */
export function trackCharacterSliderInteraction(action: 'swipe' | 'click', characterSlug: string) {
  amplitude.track('character_slider_interaction', {
    action,
    character_slug: characterSlug,
  });
}

/**
 * 캐릭터 카드 클릭 추적
 */
export function trackCharacterCardClick(characterSlug: string, isLocked: boolean) {
  amplitude.track('character_card_click', {
    character_slug: characterSlug,
    is_locked: isLocked,
  });
}

/**
 * 레이더 차트 뷰 추적 (engagement 측정)
 */
export function trackRadarChartView(resultType: string) {
  amplitude.track('radar_chart_view', {
    result_type: resultType,
  });
}

/**
 * 언어 변경 추적
 */
export function trackLanguageChange(fromLang: string, toLang: string) {
  amplitude.track('language_change', {
    from_language: fromLang,
    to_language: toLang,
  });
}

/**
 * 음악 플레이어 인터랙션 추적
 */
export function trackMusicPlayerInteraction(action: 'play' | 'pause') {
  amplitude.track('music_player_interaction', {
    action,
  });
}

/**
 * i18n 유틸리티 함수
 */

import type { Locale, TranslationData } from './types';

/**
 * 번역 함수
 * @param key - 번역 키
 * @param translations - 번역 데이터
 * @param locale - 현재 언어 (개발 모드 경고용)
 * @returns 번역된 텍스트 또는 키 이름
 */
export function t(
  key: string,
  translations: TranslationData,
  locale?: Locale
): string {
  // Object.prototype의 속성과 충돌을 방지하기 위해 hasOwnProperty 사용
  const value = Object.prototype.hasOwnProperty.call(translations, key) 
    ? translations[key] 
    : undefined;

  if (!value) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `Missing translation key: ${key}${locale ? ` for locale: ${locale}` : ''}`
      );
    }
    return key;
  }

  return value;
}

/**
 * OG 이미지 경로 생성
 * @param characterSlug - 캐릭터 슬러그
 * @param locale - 언어
 * @returns OG 이미지 경로
 */
export function getOgImagePath(characterSlug: string, locale: Locale): string {
  return `/og/${characterSlug}-${locale}.png`;
}

/**
 * 폴백을 포함한 OG 이미지 경로 생성
 * @param characterSlug - 캐릭터 슬러그
 * @param locale - 언어
 * @returns OG 이미지 경로 (언어별 이미지가 없으면 기본 이미지)
 */
export function getOgImagePathWithFallback(
  characterSlug: string,
  locale: Locale
): string {
  // 정적 빌드 환경에서는 파일 존재 여부를 런타임에 확인할 수 없으므로
  // 빌드 타임에 모든 이미지가 생성되었다고 가정하고 언어별 경로 반환
  return getOgImagePath(characterSlug, locale);
}

/**
 * 브라우저 언어 감지
 * @returns 감지된 언어 또는 기본 언어(ko)
 */
export function detectBrowserLocale(): Locale {
  // 서버 사이드에서는 기본값 반환
  if (typeof navigator === 'undefined') {
    return 'ko';
  }

  const browserLang = navigator.language.split('-')[0].toLowerCase();
  const supportedLocales: Locale[] = ['ko', 'en', 'ja'];

  if (supportedLocales.includes(browserLang as Locale)) {
    return browserLang as Locale;
  }

  return 'ko'; // 기본값
}

/**
 * 다음 언어 가져오기 (순환)
 * @param currentLocale - 현재 언어
 * @returns 다음 언어
 */
export function getNextLocale(currentLocale: Locale): Locale {
  const locales: Locale[] = ['ko', 'en', 'ja'];
  const currentIndex = locales.indexOf(currentLocale);
  const nextIndex = (currentIndex + 1) % locales.length;
  return locales[nextIndex];
}

/**
 * 로컬 스토리지에 언어 저장
 * @param locale - 저장할 언어
 */
export function saveLocale(locale: Locale): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('locale', locale);
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to save locale to localStorage:', error);
    }
  }
}

/**
 * 로컬 스토리지에서 언어 불러오기
 * @returns 저장된 언어 또는 null
 */
export function loadLocale(): Locale | null {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('locale');
      if (saved && ['ko', 'en', 'ja'].includes(saved)) {
        return saved as Locale;
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to load locale from localStorage:', error);
    }
  }
  return null;
}

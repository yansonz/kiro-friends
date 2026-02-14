/**
 * Property 10: 브라우저 언어 감지
 * 
 * For any 지원되는 브라우저 언어(ko, en, ja)에 대해, 
 * 저장된 언어 설정이 없을 때 해당 언어가 기본 언어로 선택되어야 한다.
 * 
 * **Validates: Requirements 6.3**
 */

import fc from 'fast-check';
import { detectBrowserLocale } from '../index';
import type { Locale } from '../types';

describe('Property 10: Browser language detection', () => {
  const originalNavigator = global.navigator;

  afterEach(() => {
    // 테스트 후 원래 navigator 복원
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  it('should detect any supported browser language (ko, en, ja)', () => {
    fc.assert(
      fc.property(
        // 지원되는 언어 생성
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        (locale) => {
          // 브라우저 언어 설정 시뮬레이션
          // 실제 브라우저는 'ko-KR', 'en-US', 'ja-JP' 같은 형식 사용
          const languageTag = locale === 'ko' ? 'ko-KR' 
            : locale === 'en' ? 'en-US' 
            : 'ja-JP';

          Object.defineProperty(global, 'navigator', {
            value: { language: languageTag },
            writable: true,
            configurable: true,
          });

          const detected = detectBrowserLocale();
          
          // 감지된 언어가 설정한 언어와 일치해야 함
          return detected === locale;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return ko for any unsupported browser language', () => {
    fc.assert(
      fc.property(
        // 지원되지 않는 언어 생성 (ko, en, ja 제외)
        fc.string({ minLength: 2, maxLength: 2 })
          .filter(lang => !['ko', 'en', 'ja'].includes(lang)),
        (unsupportedLang) => {
          // 지역 코드 추가 (예: fr-FR, de-DE)
          const languageTag = `${unsupportedLang}-${unsupportedLang.toUpperCase()}`;

          Object.defineProperty(global, 'navigator', {
            value: { language: languageTag },
            writable: true,
            configurable: true,
          });

          const detected = detectBrowserLocale();
          
          // 지원되지 않는 언어는 기본값 'ko'를 반환해야 함
          return detected === 'ko';
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle various language tag formats for supported languages', () => {
    fc.assert(
      fc.property(
        // 지원되는 언어와 다양한 지역 코드 조합
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        fc.string({ minLength: 2, maxLength: 2 }),
        (locale, regionCode) => {
          // 다양한 형식의 언어 태그 생성 (예: en-US, en-GB, en-AU)
          const languageTag = `${locale}-${regionCode.toUpperCase()}`;

          Object.defineProperty(global, 'navigator', {
            value: { language: languageTag },
            writable: true,
            configurable: true,
          });

          const detected = detectBrowserLocale();
          
          // 지역 코드와 관계없이 언어 코드만 추출하여 감지해야 함
          return detected === locale;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return ko when navigator is undefined (server-side)', () => {
    fc.assert(
      fc.property(
        fc.constant(undefined),
        () => {
          Object.defineProperty(global, 'navigator', {
            value: undefined,
            writable: true,
            configurable: true,
          });

          const detected = detectBrowserLocale();
          
          // 서버 사이드에서는 기본값 'ko' 반환
          return detected === 'ko';
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should handle edge cases with language tags', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // 언어 코드만 있는 경우
          fc.constantFrom('ko', 'en', 'ja'),
          // 소문자 지역 코드
          fc.constantFrom('ko-kr', 'en-us', 'ja-jp'),
          // 대문자 언어 코드
          fc.constantFrom('KO-KR', 'EN-US', 'JA-JP'),
          // 혼합 케이스
          fc.constantFrom('Ko-KR', 'En-US', 'Ja-JP')
        ),
        (languageTag) => {
          Object.defineProperty(global, 'navigator', {
            value: { language: languageTag },
            writable: true,
            configurable: true,
          });

          const detected = detectBrowserLocale();
          const expectedLocale = languageTag.toLowerCase().split('-')[0] as Locale;
          
          // 대소문자와 관계없이 올바른 언어 감지
          if (['ko', 'en', 'ja'].includes(expectedLocale)) {
            return detected === expectedLocale;
          }
          
          return detected === 'ko'; // 기본값
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: i18n-support, Property 10: For any supported browser language (ko, en, ja), when there is no saved language setting, that language should be selected as the default

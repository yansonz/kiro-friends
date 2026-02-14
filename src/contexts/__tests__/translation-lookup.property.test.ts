/**
 * Property 3: 번역 키 조회 일관성
 * 
 * For any 유효한 번역 키와 언어 조합에 대해, t() 함수는 해당 언어의 번역 텍스트를 반환해야 한다.
 * 
 * **Validates: Requirements 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 4.8, 4.9, 4.10**
 */

import fc from 'fast-check';
import { t } from '@/lib/i18n';
import type { Locale, TranslationData } from '@/lib/i18n/types';

// 번역 파일 동적 로드
async function loadTranslations(locale: Locale): Promise<TranslationData> {
  const data = await import(`@/lib/i18n/locales/${locale}.json`);
  return data.default;
}

describe('Property 3: Translation key lookup consistency', () => {
  let koTranslations: TranslationData;
  let enTranslations: TranslationData;
  let jaTranslations: TranslationData;
  let allKeys: string[];

  beforeAll(async () => {
    // 모든 번역 파일 로드
    koTranslations = await loadTranslations('ko');
    enTranslations = await loadTranslations('en');
    jaTranslations = await loadTranslations('ja');

    // 한국어 번역 파일의 모든 키 추출 (기준)
    allKeys = Object.keys(koTranslations);
  });

  it('should return translated text for any valid key and locale combination', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allKeys),
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        (key, locale) => {
          const translations = 
            locale === 'ko' ? koTranslations 
            : locale === 'en' ? enTranslations 
            : jaTranslations;

          const result = t(key, translations, locale);

          // 번역 텍스트가 문자열이고 비어있지 않아야 함
          return typeof result === 'string' && result.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return valid translations for all locales (translations may be identical for universal symbols)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allKeys),
        (key) => {
          const koText = t(key, koTranslations, 'ko');
          const enText = t(key, enTranslations, 'en');
          const jaText = t(key, jaTranslations, 'ja');

          // 모든 번역이 존재하고 비어있지 않아야 함
          const allExist = koText.length > 0 && enText.length > 0 && jaText.length > 0;

          // 모든 번역이 유효한 문자열이어야 함
          const allValid = 
            typeof koText === 'string' && 
            typeof enText === 'string' && 
            typeof jaText === 'string';

          return allExist && allValid;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should consistently return the same translation for the same key-locale pair', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allKeys),
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        (key, locale) => {
          const translations = 
            locale === 'ko' ? koTranslations 
            : locale === 'en' ? enTranslations 
            : jaTranslations;

          // 같은 키와 언어로 여러 번 조회
          const result1 = t(key, translations, locale);
          const result2 = t(key, translations, locale);
          const result3 = t(key, translations, locale);

          // 모든 결과가 동일해야 함 (일관성)
          return result1 === result2 && result2 === result3;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have all keys present in all three language files', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allKeys),
        (key) => {
          // 모든 언어 파일에 키가 존재해야 함
          const hasInKo = Object.prototype.hasOwnProperty.call(koTranslations, key);
          const hasInEn = Object.prototype.hasOwnProperty.call(enTranslations, key);
          const hasInJa = Object.prototype.hasOwnProperty.call(jaTranslations, key);

          return hasInKo && hasInEn && hasInJa;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return non-empty strings for all valid keys', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allKeys),
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        (key, locale) => {
          const translations = 
            locale === 'ko' ? koTranslations 
            : locale === 'en' ? enTranslations 
            : jaTranslations;

          const result = t(key, translations, locale);

          // 빈 문자열이 아니어야 함
          return result.trim().length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });
});

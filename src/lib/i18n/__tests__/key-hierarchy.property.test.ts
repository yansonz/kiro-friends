/**
 * Property 12: 번역 키 계층 구조
 * 
 * For any 번역 키에 대해, 키는 점(.)으로 구분된 계층적 구조를 따라야 한다
 * (예: home.title, quiz.question1).
 * 
 * Validates: Requirements 7.3
 */

import fc from 'fast-check';
import { readFileSync } from 'fs';
import { join } from 'path';

// === Generators ===

/**
 * 지원되는 언어 생성기
 */
const localeGen = fc.constantFrom('ko', 'en', 'ja');

// === Helper Functions ===

/**
 * 번역 파일 경로 가져오기
 */
function getTranslationFilePath(locale: string): string {
  return join(process.cwd(), 'src', 'lib', 'i18n', 'locales', `${locale}.json`);
}

/**
 * 번역 파일 읽기 및 JSON 파싱
 */
function loadTranslationFile(locale: string): Record<string, string> {
  const filePath = getTranslationFilePath(locale);
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * 키가 계층적 구조를 따르는지 검증
 * 유효한 형식: "category.subcategory.item" 또는 "category.item"
 * 최소 1개의 점(.)이 있어야 하며, 각 부분은 영문자, 숫자, 하이픈, 언더스코어로 구성
 */
function isHierarchicalKey(key: string): boolean {
  // 빈 문자열은 유효하지 않음
  if (!key || key.length === 0) {
    return false;
  }

  // 최소 1개의 점이 있어야 함 (계층 구조)
  if (!key.includes('.')) {
    return false;
  }

  // 점으로 시작하거나 끝나면 안 됨
  if (key.startsWith('.') || key.endsWith('.')) {
    return false;
  }

  // 연속된 점이 있으면 안 됨
  if (key.includes('..')) {
    return false;
  }

  // 각 부분(점으로 구분된)이 유효한 식별자여야 함
  const parts = key.split('.');
  
  // 최소 2개의 부분이 있어야 함 (예: "home.title")
  if (parts.length < 2) {
    return false;
  }

  // 각 부분이 유효한 식별자인지 확인
  // 영문자, 숫자, 하이픈, 언더스코어만 허용
  const validPartRegex = /^[a-zA-Z0-9_-]+$/;
  
  return parts.every(part => {
    // 각 부분이 비어있지 않고 유효한 패턴을 따라야 함
    return part.length > 0 && validPartRegex.test(part);
  });
}

// === Property Tests ===

describe('Property-Based Tests: i18n-support - Key Hierarchy', () => {
  /**
   * Property 12: 번역 키 계층 구조
   * 
   * For any 번역 키에 대해, 키는 점(.)으로 구분된 계층적 구조를 따라야 한다.
   * 
   * **Validates: Requirements 7.3**
   */
  describe('Property 12: Translation key hierarchical structure', () => {
    it('should follow hierarchical structure with dot-separated parts for all keys', () => {
      fc.assert(
        fc.property(localeGen, (locale) => {
          const translations = loadTranslationFile(locale);
          const keys = Object.keys(translations);

          // 모든 키가 계층적 구조를 따라야 함
          return keys.every(key => isHierarchicalKey(key));
        }),
        { numRuns: 100 }
      );
    });

    it('should have at least one dot separator in every key', () => {
      fc.assert(
        fc.property(localeGen, (locale) => {
          const translations = loadTranslationFile(locale);
          const keys = Object.keys(translations);

          // 모든 키가 최소 1개의 점을 포함해야 함
          return keys.every(key => key.includes('.') && key.split('.').length >= 2);
        }),
        { numRuns: 100 }
      );
    });

    it('should not have keys starting or ending with dots', () => {
      fc.assert(
        fc.property(localeGen, (locale) => {
          const translations = loadTranslationFile(locale);
          const keys = Object.keys(translations);

          // 점으로 시작하거나 끝나는 키가 없어야 함
          return keys.every(key => !key.startsWith('.') && !key.endsWith('.'));
        }),
        { numRuns: 100 }
      );
    });

    it('should not have consecutive dots in keys', () => {
      fc.assert(
        fc.property(localeGen, (locale) => {
          const translations = loadTranslationFile(locale);
          const keys = Object.keys(translations);

          // 연속된 점이 있는 키가 없어야 함
          return keys.every(key => !key.includes('..'));
        }),
        { numRuns: 100 }
      );
    });

    it('should have valid identifiers in each part of the key', () => {
      fc.assert(
        fc.property(localeGen, (locale) => {
          const translations = loadTranslationFile(locale);
          const keys = Object.keys(translations);

          // 각 키의 모든 부분이 유효한 식별자여야 함
          const validPartRegex = /^[a-zA-Z0-9_-]+$/;
          
          return keys.every(key => {
            const parts = key.split('.');
            return parts.every(part => part.length > 0 && validPartRegex.test(part));
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should have consistent key structure across all locales', () => {
      // 모든 언어 파일의 키 구조가 동일해야 함
      const koKeys = Object.keys(loadTranslationFile('ko')).sort();
      const enKeys = Object.keys(loadTranslationFile('en')).sort();
      const jaKeys = Object.keys(loadTranslationFile('ja')).sort();

      // 키 개수가 동일해야 함
      expect(koKeys.length).toBe(enKeys.length);
      expect(koKeys.length).toBe(jaKeys.length);

      // 키 이름이 동일해야 함
      expect(koKeys).toEqual(enKeys);
      expect(koKeys).toEqual(jaKeys);
    });

    it('should organize keys by logical categories', () => {
      fc.assert(
        fc.property(localeGen, (locale) => {
          const translations = loadTranslationFile(locale);
          const keys = Object.keys(translations);

          // 첫 번째 부분(카테고리)을 추출
          const categories = new Set(keys.map(key => key.split('.')[0]));

          // 최소 1개 이상의 카테고리가 있어야 함
          if (categories.size === 0) {
            return false;
          }

          // 각 카테고리가 유효한 식별자여야 함
          const validCategoryRegex = /^[a-z]+$/;
          return Array.from(categories).every(category => 
            validCategoryRegex.test(category)
          );
        }),
        { numRuns: 100 }
      );
    });
  });
});

// Feature: i18n-support, Property 12: For any translation key, the key should follow a hierarchical structure separated by dots

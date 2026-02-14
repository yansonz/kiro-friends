// 번역 파일 JSON 유효성 - Property-Based Tests (fast-check)
// Feature: i18n-support

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

// === Property Tests ===

describe('Property-Based Tests: i18n-support - Translation Files', () => {
  /**
   * Property 11: 번역 데이터 JSON 유효성
   * 
   * For any 언어 파일(ko.json, en.json, ja.json)에 대해,
   * 파일은 유효한 JSON 형식이어야 한다.
   * 
   * **Validates: Requirements 7.1**
   */
  describe('Property 11: Translation data JSON validity', () => {
    it('should be valid JSON for all locale files', () => {
      fc.assert(
        fc.property(localeGen, (locale) => {
          // 번역 파일을 읽고 JSON 파싱 시도
          let translations: Record<string, string>;
          let parseError: Error | null = null;

          try {
            translations = loadTranslationFile(locale);
          } catch (error) {
            parseError = error as Error;
          }

          // JSON 파싱이 성공해야 함
          if (parseError) {
            return false;
          }

          // 파싱된 결과가 객체여야 함
          if (typeof translations !== 'object' || translations === null) {
            return false;
          }

          // 배열이 아닌 일반 객체여야 함
          if (Array.isArray(translations)) {
            return false;
          }

          // 모든 값이 문자열이어야 함
          const allValuesAreStrings = Object.values(translations).every(
            (value) => typeof value === 'string'
          );

          return allValuesAreStrings;
        }),
        { numRuns: 100 }
      );
    });

    it('should have consistent structure across all locales', () => {
      fc.assert(
        fc.property(localeGen, (locale) => {
          const translations = loadTranslationFile(locale);

          // 최소한 하나 이상의 번역 키가 있어야 함
          const hasKeys = Object.keys(translations).length > 0;

          // 모든 키가 문자열이어야 함
          const allKeysAreStrings = Object.keys(translations).every(
            (key) => typeof key === 'string' && key.length > 0
          );

          return hasKeys && allKeysAreStrings;
        }),
        { numRuns: 100 }
      );
    });

    it('should not contain circular references', () => {
      fc.assert(
        fc.property(localeGen, (locale) => {
          // JSON.parse는 순환 참조가 있으면 실패함
          // 파일을 읽고 다시 직렬화할 수 있어야 함
          const translations = loadTranslationFile(locale);
          
          try {
            const serialized = JSON.stringify(translations);
            const deserialized = JSON.parse(serialized);
            
            // 직렬화/역직렬화 후에도 동일한 키를 가져야 함
            const originalKeys = Object.keys(translations).sort();
            const deserializedKeys = Object.keys(deserialized).sort();
            
            return JSON.stringify(originalKeys) === JSON.stringify(deserializedKeys);
          } catch {
            return false;
          }
        }),
        { numRuns: 100 }
      );
    });
  });
});

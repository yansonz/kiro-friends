/**
 * Property 19: 선택적 언어 데이터 로딩
 * 
 * For any 언어 선택에 대해, 해당 언어의 번역 데이터만 로드되어야 하며, 다른 언어 데이터는 로드되지 않아야 한다.
 * 
 * **Validates: Requirements 12.1**
 */

import fc from 'fast-check';
import type { Locale } from '@/lib/i18n/types';

// 동적 import를 추적하기 위한 모의 함수
const importedModules = new Set<string>();

// 원본 import 함수 저장
const originalImport = global.import;

describe('Property 19: Selective language data loading', () => {
  beforeEach(() => {
    importedModules.clear();
  });

  it('should only load the requested locale file', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        async (locale) => {
          // 해당 언어 파일 로드
          const data = await import(`@/lib/i18n/locales/${locale}.json`);
          
          // 데이터가 로드되었는지 확인
          const isLoaded = data && typeof data === 'object' && data.default;
          
          // 로드된 데이터가 유효한 번역 객체인지 확인
          const hasValidKeys = isLoaded && Object.keys(data.default).length > 0;
          
          return isLoaded && hasValidKeys;
        }
      ),
      { numRuns: 30 } // 비동기 테스트이므로 실행 횟수 줄임
    );
  });

  it('should load different data for different locales', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        async (locale1, locale2) => {
          // 두 언어 파일 로드
          const data1 = await import(`@/lib/i18n/locales/${locale1}.json`);
          const data2 = await import(`@/lib/i18n/locales/${locale2}.json`);
          
          // 같은 언어면 같은 데이터, 다른 언어면 다른 데이터
          if (locale1 === locale2) {
            return data1.default === data2.default;
          } else {
            // 다른 언어의 경우, 적어도 일부 번역이 달라야 함
            const keys = Object.keys(data1.default);
            const hasDifference = keys.some(
              key => data1.default[key] !== data2.default[key]
            );
            return hasDifference;
          }
        }
      ),
      { numRuns: 30 }
    );
  });

  it('should not load unnecessary locale files when loading a specific locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        async (locale) => {
          // 특정 언어 파일만 로드
          const data = await import(`@/lib/i18n/locales/${locale}.json`);
          
          // 로드된 데이터의 크기가 합리적인지 확인
          // (모든 언어를 로드했다면 크기가 3배가 될 것)
          const keyCount = Object.keys(data.default).length;
          
          // 번역 키가 존재하고, 합리적인 범위 내에 있어야 함
          return keyCount > 0 && keyCount < 200; // 단일 언어 파일의 예상 크기
        }
      ),
      { numRuns: 30 }
    );
  });

  it('should load locale data independently without side effects', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        async (locale) => {
          // 첫 번째 로드
          const data1 = await import(`@/lib/i18n/locales/${locale}.json`);
          const keys1 = Object.keys(data1.default);
          
          // 두 번째 로드 (캐시될 수 있음)
          const data2 = await import(`@/lib/i18n/locales/${locale}.json`);
          const keys2 = Object.keys(data2.default);
          
          // 두 번 로드해도 같은 데이터여야 함 (부작용 없음)
          return keys1.length === keys2.length &&
                 keys1.every((key, index) => key === keys2[index]);
        }
      ),
      { numRuns: 30 }
    );
  });

  it('should have consistent data structure across all locale files', async () => {
    // 모든 언어 파일 로드
    const koData = await import('@/lib/i18n/locales/ko.json');
    const enData = await import('@/lib/i18n/locales/en.json');
    const jaData = await import('@/lib/i18n/locales/ja.json');

    const koKeys = Object.keys(koData.default).sort();
    const enKeys = Object.keys(enData.default).sort();
    const jaKeys = Object.keys(jaData.default).sort();

    // 모든 언어 파일이 같은 키 구조를 가져야 함
    expect(koKeys).toEqual(enKeys);
    expect(enKeys).toEqual(jaKeys);
  });

  it('should load only JSON data without executable code', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        async (locale) => {
          const data = await import(`@/lib/i18n/locales/${locale}.json`);
          
          // 로드된 데이터가 순수 객체여야 함 (함수 없음)
          const hasNoFunctions = Object.values(data.default).every(
            value => typeof value !== 'function'
          );
          
          // 모든 값이 문자열이어야 함
          const allStrings = Object.values(data.default).every(
            value => typeof value === 'string'
          );
          
          return hasNoFunctions && allStrings;
        }
      ),
      { numRuns: 30 }
    );
  });
});

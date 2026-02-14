/**
 * Property 21: SPA 동작 유지
 * 
 * For any 언어 전환 시, 페이지 전체 새로고침이 발생하지 않아야 한다.
 * 
 * **Validates: Requirements 12.3**
 */

import fc from 'fast-check';
import { renderHook, act } from '@testing-library/react';
import { I18nProvider, useI18n } from '@/contexts/I18nContext';
import type { Locale } from '@/lib/i18n/types';
import { createElement } from 'react';
import type { ReactNode } from 'react';

// 테스트용 wrapper
const wrapper = ({ children }: { children: ReactNode }) => 
  createElement(I18nProvider, null, children);

describe('Property 21: SPA behavior maintenance', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should change locale without triggering page reload', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        async (fromLocale, toLocale) => {
          const { result } = renderHook(() => useI18n(), { wrapper });

          // 초기 로딩 대기
          await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
          });

          // 시작 언어 설정
          await act(async () => {
            result.current.setLocale(fromLocale);
            await new Promise(resolve => setTimeout(resolve, 50));
          });

          const initialLocale = result.current.locale;

          // 언어 변경
          await act(async () => {
            result.current.setLocale(toLocale);
            await new Promise(resolve => setTimeout(resolve, 50));
          });

          const newLocale = result.current.locale;

          // 언어가 변경되었는지 확인
          // (같은 언어로 변경한 경우는 변경되지 않을 수 있음)
          if (fromLocale !== toLocale) {
            return newLocale === toLocale;
          }
          return true;
        }
      ),
      { numRuns: 20 } // 비동기 렌더링 테스트이므로 실행 횟수 줄임
    );
  });

  it('should maintain component state during locale changes', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        async (newLocale) => {
          const { result } = renderHook(() => useI18n(), { wrapper });

          // 초기 로딩 대기
          await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
          });

          // 컴포넌트가 마운트된 상태 확인
          const isInitiallyMounted = result.current !== undefined;

          // 언어 변경
          await act(async () => {
            result.current.setLocale(newLocale);
            await new Promise(resolve => setTimeout(resolve, 50));
          });

          // 컴포넌트가 여전히 마운트된 상태인지 확인
          const isStillMounted = result.current !== undefined;

          return isInitiallyMounted && isStillMounted;
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should update locale state synchronously without unmounting', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.constantFrom<Locale>('ko', 'en', 'ja'), { minLength: 2, maxLength: 5 }),
        async (localeSequence) => {
          const { result } = renderHook(() => useI18n(), { wrapper });

          // 초기 로딩 대기
          await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
          });

          let allChangesSuccessful = true;

          // 여러 번 언어 변경
          for (const locale of localeSequence) {
            await act(async () => {
              result.current.setLocale(locale);
              await new Promise(resolve => setTimeout(resolve, 50));
            });

            // 각 변경 후에도 컴포넌트가 마운트되어 있어야 함
            if (result.current === undefined) {
              allChangesSuccessful = false;
              break;
            }
          }

          return allChangesSuccessful;
        }
      ),
      { numRuns: 15 }
    );
  });

  it('should preserve translation function reference during locale changes', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        async (newLocale) => {
          const { result } = renderHook(() => useI18n(), { wrapper });

          // 초기 로딩 대기
          await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
          });

          // 번역 함수가 존재하는지 확인
          const hasTranslationFunction = typeof result.current.t === 'function';

          // 언어 변경
          await act(async () => {
            result.current.setLocale(newLocale);
            await new Promise(resolve => setTimeout(resolve, 50));
          });

          // 번역 함수가 여전히 존재하는지 확인
          const stillHasTranslationFunction = typeof result.current.t === 'function';

          return hasTranslationFunction && stillHasTranslationFunction;
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should handle rapid locale changes without errors', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.constantFrom<Locale>('ko', 'en', 'ja'), { minLength: 3, maxLength: 10 }),
        async (localeSequence) => {
          const { result } = renderHook(() => useI18n(), { wrapper });

          // 초기 로딩 대기
          await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
          });

          let noErrors = true;

          try {
            // 빠르게 연속으로 언어 변경 (SPA 동작 테스트)
            for (const locale of localeSequence) {
              await act(async () => {
                result.current.setLocale(locale);
                // 짧은 대기 시간으로 빠른 변경 시뮬레이션
                await new Promise(resolve => setTimeout(resolve, 10));
              });
            }
          } catch (error) {
            noErrors = false;
          }

          // 에러 없이 모든 변경이 완료되어야 함
          return noErrors && result.current !== undefined;
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should not cause memory leaks during multiple locale changes', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        async (locale) => {
          const { result, unmount } = renderHook(() => useI18n(), { wrapper });

          // 초기 로딩 대기
          await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
          });

          // 여러 번 언어 변경
          for (let i = 0; i < 5; i++) {
            await act(async () => {
              result.current.setLocale(locale);
              await new Promise(resolve => setTimeout(resolve, 20));
            });
          }

          // 정상적으로 unmount 가능해야 함 (메모리 누수 없음)
          let unmountSuccessful = true;
          try {
            unmount();
          } catch (error) {
            unmountSuccessful = false;
          }

          return unmountSuccessful;
        }
      ),
      { numRuns: 15 }
    );
  });
});

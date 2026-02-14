/**
 * Property 9: 로컬 스토리지 영속성
 * 
 * For any 언어 선택에 대해, 해당 언어가 로컬 스토리지에 저장되고, 페이지 새로고침 후 복원되어야 한다.
 * 
 * **Validates: Requirements 6.1, 6.2**
 */

import fc from 'fast-check';
import { saveLocale, loadLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/types';

describe('Property 9: LocalStorage persistence', () => {
  beforeEach(() => {
    // 각 테스트 전에 localStorage 초기화
    localStorage.clear();
  });

  afterEach(() => {
    // 각 테스트 후에 localStorage 정리
    localStorage.clear();
  });

  it('should save and restore any locale from localStorage', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        (locale) => {
          // 언어 저장
          saveLocale(locale);
          
          // 저장된 언어 복원
          const restored = loadLocale();
          
          // 저장한 언어와 복원한 언어가 동일해야 함
          return restored === locale;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should persist locale across multiple save-load cycles', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        (locale) => {
          // 첫 번째 저장 및 복원
          saveLocale(locale);
          const restored1 = loadLocale();
          
          // 두 번째 저장 및 복원 (같은 값)
          saveLocale(locale);
          const restored2 = loadLocale();
          
          // 세 번째 저장 및 복원 (같은 값)
          saveLocale(locale);
          const restored3 = loadLocale();
          
          // 모든 복원 값이 원본과 동일해야 함
          return restored1 === locale && 
                 restored2 === locale && 
                 restored3 === locale;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should overwrite previous locale when saving a new one', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        (firstLocale, secondLocale) => {
          // 첫 번째 언어 저장
          saveLocale(firstLocale);
          
          // 두 번째 언어 저장 (덮어쓰기)
          saveLocale(secondLocale);
          
          // 복원된 언어는 두 번째 언어여야 함
          const restored = loadLocale();
          return restored === secondLocale;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return null when no locale is saved', () => {
    // localStorage가 비어있을 때
    const restored = loadLocale();
    
    // null을 반환해야 함
    expect(restored).toBeNull();
  });

  it('should handle invalid locale values gracefully', () => {
    // 잘못된 값을 직접 localStorage에 저장
    localStorage.setItem('locale', 'invalid-locale');
    
    // loadLocale은 null을 반환해야 함 (유효하지 않은 값)
    const restored = loadLocale();
    expect(restored).toBeNull();
  });

  it('should maintain locale data type as string in storage', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        (locale) => {
          // 언어 저장
          saveLocale(locale);
          
          // localStorage에서 직접 읽기
          const storedValue = localStorage.getItem('locale');
          
          // 저장된 값이 문자열이고 원본과 동일해야 함
          return typeof storedValue === 'string' && storedValue === locale;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should be idempotent - saving the same locale multiple times should have the same effect', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        fc.integer({ min: 1, max: 10 }),
        (locale, times) => {
          // 같은 언어를 여러 번 저장
          for (let i = 0; i < times; i++) {
            saveLocale(locale);
          }
          
          // 복원된 언어는 저장한 언어와 동일해야 함
          const restored = loadLocale();
          return restored === locale;
        }
      ),
      { numRuns: 100 }
    );
  });
});

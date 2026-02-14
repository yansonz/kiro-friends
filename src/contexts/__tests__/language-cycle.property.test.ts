/**
 * Property 1: 언어 순환 일관성
 * 
 * For any 현재 언어 상태에서, 언어 전환 버튼을 클릭하면 다음 언어로 순환해야 한다 (ko → en → ja → ko).
 * 
 * **Validates: Requirements 1.2**
 */

import fc from 'fast-check';
import { getNextLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/types';

describe('Property 1: Language cycle consistency', () => {
  it('should cycle through languages in order (ko → en → ja → ko)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        (currentLocale) => {
          const nextLocale = getNextLocale(currentLocale);
          
          // 예상되는 다음 언어 계산
          const expected = 
            currentLocale === 'ko' ? 'en' 
            : currentLocale === 'en' ? 'ja' 
            : 'ko';
          
          return nextLocale === expected;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return to the starting locale after 3 cycles', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        (startLocale) => {
          let currentLocale = startLocale;
          
          // 3번 순환
          currentLocale = getNextLocale(currentLocale);
          currentLocale = getNextLocale(currentLocale);
          currentLocale = getNextLocale(currentLocale);
          
          // 시작 언어로 돌아와야 함
          return currentLocale === startLocale;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should never return the same locale as input', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        (currentLocale) => {
          const nextLocale = getNextLocale(currentLocale);
          
          // 다음 언어는 현재 언어와 달라야 함
          return nextLocale !== currentLocale;
        }
      ),
      { numRuns: 100 }
    );
  });
});

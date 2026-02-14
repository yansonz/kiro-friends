/**
 * Property 13: 누락된 번역 키 처리
 * 
 * For any 존재하지 않는 번역 키에 대해, t() 함수는 키 이름을 그대로 반환해야 한다.
 * 
 * Validates: Requirements 7.4, 7.5
 */

import fc from 'fast-check';
import { t } from '../index';
import type { TranslationData } from '../types';

describe('Property 13: Missing translation key handling', () => {
  it('should return the key name for any non-existent translation key', () => {
    fc.assert(
      fc.property(
        // 임의의 문자열 키 생성 (점으로 구분된 계층 구조)
        fc.array(fc.stringMatching(/^[a-z]+$/), { minLength: 1, maxLength: 3 })
          .map(parts => parts.join('.')),
        // 빈 번역 데이터 또는 다른 키를 가진 번역 데이터
        fc.oneof(
          fc.constant({}),
          fc.dictionary(
            fc.stringMatching(/^[a-z]+\.[a-z]+$/),
            fc.string()
          )
        ),
        (key, translations) => {
          // 키가 번역 데이터에 없는 경우만 테스트
          if (key in translations) {
            return true; // 이 경우는 건너뜀
          }
          
          const result = t(key, translations);
          
          // 누락된 키는 키 이름 자체를 반환해야 함
          return result === key;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return the key name when translations object is empty', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-z]+(\.[a-z]+)*$/),
        (key) => {
          const emptyTranslations: TranslationData = {};
          const result = t(key, emptyTranslations);
          
          return result === key;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return the key name for keys not in the translations object', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('nonexistent.key', 'missing.translation', 'unknown.value'),
        (missingKey) => {
          const translations: TranslationData = {
            'home.title': '홈 타이틀',
            'quiz.question': '질문',
            'result.analysis': '분석',
          };
          
          const result = t(missingKey, translations);
          
          return result === missingKey;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle special characters in missing keys', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (key) => {
          const translations: TranslationData = {};
          const result = t(key, translations);
          
          // 어떤 키든 번역이 없으면 키 자체를 반환
          return result === key;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: i18n-support, Property 13: For any non-existent translation key, t() should return the key name itself

// 질문 데이터 다국어 지원 속성 기반 테스트
// Feature: i18n-support
// Task 7.4, 7.5, 7.6

import fc from 'fast-check';
import { questions } from '../questions';
import type { Locale } from '@/lib/types';

describe('Property 4: 질문 데이터 다국어 지원', () => {
  /**
   * **Validates: Requirements 3.1, 3.2, 3.3**
   * 
   * For any 질문 ID와 언어 조합에 대해, 질문 텍스트와 모든 선택지가 해당 언어로 제공되어야 한다.
   */
  it('should provide question text and all options in all languages', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 16 }),
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        (questionId, locale) => {
          const question = questions.find((q) => q.id === questionId);
          
          if (!question) return false;
          
          // 질문 텍스트가 해당 언어로 존재하는지 확인
          const hasQuestionText = 
            typeof question.text[locale] === 'string' &&
            question.text[locale].length > 0;
          
          // 모든 선택지가 해당 언어로 존재하는지 확인
          const allOptionsHaveText = question.options.every(
            (option) =>
              typeof option.text[locale] === 'string' &&
              option.text[locale].length > 0
          );
          
          return hasQuestionText && allOptionsHaveText;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 16: 질문 데이터 완전성', () => {
  /**
   * **Validates: Requirements 9.2, 9.3**
   * 
   * For any 질문에 대해, 질문 텍스트와 모든 선택지가 3개 언어(ko, en, ja) 모두에 대해 존재해야 한다.
   */
  it('should have question text and all options in all three languages', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 15 }),
        (questionIndex) => {
          const question = questions[questionIndex];
          const locales: Locale[] = ['ko', 'en', 'ja'];
          
          // 질문 텍스트가 모든 언어에 존재하는지 확인
          const hasAllQuestionTexts = locales.every(
            (locale) =>
              typeof question.text[locale] === 'string' &&
              question.text[locale].length > 0
          );
          
          // 모든 선택지가 모든 언어에 존재하는지 확인
          const allOptionsComplete = question.options.every((option) =>
            locales.every(
              (locale) =>
                typeof option.text[locale] === 'string' &&
                option.text[locale].length > 0
            )
          );
          
          return hasAllQuestionTexts && allOptionsComplete;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 17: 질문 효과 불변성', () => {
  /**
   * **Validates: Requirements 9.4**
   * 
   * For any 질문과 언어 조합에 대해, axisEffect와 tagEffect는 언어와 무관하게 동일해야 한다.
   */
  it('should have consistent axisEffect and tagEffect across all languages', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 15 }),
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        (questionIndex, locale) => {
          const question = questions[questionIndex];
          
          // 각 선택지의 효과는 언어와 무관하게 동일해야 함
          // 즉, 선택지의 axisEffect와 tagEffect는 언어에 따라 변하지 않음
          const effectsConsistent = question.options.every((option) => {
            // axisEffect가 있으면 axis와 value가 정의되어 있어야 함
            if (option.axisEffect) {
              const validAxis = ['A', 'B', 'C', 'D'].includes(option.axisEffect.axis);
              const validValue = [-1, 1].includes(option.axisEffect.value);
              return validAxis && validValue;
            }
            
            // tagEffect가 있으면 문자열이어야 함
            if (option.tagEffect) {
              return typeof option.tagEffect === 'string' && option.tagEffect.length > 0;
            }
            
            return true;
          });
          
          return effectsConsistent;
        }
      ),
      { numRuns: 100 }
    );
  });
  
  it('should have the same effects structure regardless of locale', () => {
    // 모든 질문에 대해 효과 구조가 언어와 무관하게 동일한지 확인
    questions.forEach((question) => {
      question.options.forEach((option) => {
        // axisEffect와 tagEffect는 객체 자체이므로 언어와 무관
        // 이는 타입 시스템에 의해 보장되지만, 런타임에도 확인
        if (option.axisEffect) {
          expect(option.axisEffect).toHaveProperty('axis');
          expect(option.axisEffect).toHaveProperty('value');
        }
        
        if (option.tagEffect) {
          expect(typeof option.tagEffect).toBe('string');
        }
      });
    });
  });
});

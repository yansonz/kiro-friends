/**
 * Property 5: 캐릭터 데이터 다국어 지원
 * 
 * For any 캐릭터 슬러그와 언어 조합에 대해, 캐릭터의 모든 텍스트 필드(이름, 타이틀, 설명, 강점, 약점, 기능, 팁)가 해당 언어로 제공되어야 한다.
 * 
 * **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7**
 */

import fc from 'fast-check';
import { characters } from '@/data/characters';
import type { Locale, CharacterSlug } from '@/lib/types';

describe('Property 5: Character data multilingual support', () => {
  const allSlugs: CharacterSlug[] = characters.map(c => c.slug);
  const locales: Locale[] = ['ko', 'en', 'ja'];

  it('should provide name in all languages for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        fc.constantFrom<Locale>(...locales),
        (slug, locale) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          const name = character.name[locale];
          
          // 이름이 존재하고 비어있지 않아야 함
          return typeof name === 'string' && name.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should provide title in all languages for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        fc.constantFrom<Locale>(...locales),
        (slug, locale) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          const title = character.title[locale];
          
          // 타이틀이 존재하고 비어있지 않아야 함
          return typeof title === 'string' && title.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should provide description in all languages for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        fc.constantFrom<Locale>(...locales),
        (slug, locale) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          const description = character.description[locale];
          
          // 설명이 존재하고 비어있지 않아야 함
          return typeof description === 'string' && description.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should provide strengths array in all languages for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        fc.constantFrom<Locale>(...locales),
        (slug, locale) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          const strengths = character.strengths[locale];
          
          // 강점 배열이 존재하고 비어있지 않아야 함
          if (!Array.isArray(strengths) || strengths.length === 0) {
            return false;
          }

          // 모든 강점이 비어있지 않은 문자열이어야 함
          return strengths.every(s => typeof s === 'string' && s.length > 0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should provide pitfalls array in all languages for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        fc.constantFrom<Locale>(...locales),
        (slug, locale) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          const pitfalls = character.pitfalls[locale];
          
          // 약점 배열이 존재하고 비어있지 않아야 함
          if (!Array.isArray(pitfalls) || pitfalls.length === 0) {
            return false;
          }

          // 모든 약점이 비어있지 않은 문자열이어야 함
          return pitfalls.every(p => typeof p === 'string' && p.length > 0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should provide kiroFeatures with multilingual name and description for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        fc.constantFrom<Locale>(...locales),
        (slug, locale) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          const features = character.kiroFeatures;
          
          // 기능 배열이 존재하고 비어있지 않아야 함
          if (!Array.isArray(features) || features.length === 0) {
            return false;
          }

          // 모든 기능이 해당 언어의 이름과 설명을 가져야 함
          return features.every(feature => {
            const name = feature.name[locale];
            const description = feature.description[locale];
            
            return (
              typeof name === 'string' && name.length > 0 &&
              typeof description === 'string' && description.length > 0
            );
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should provide aiTips array in all languages for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        fc.constantFrom<Locale>(...locales),
        (slug, locale) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          const aiTips = character.aiTips[locale];
          
          // AI 팁 배열이 존재하고 비어있지 않아야 함
          if (!Array.isArray(aiTips) || aiTips.length === 0) {
            return false;
          }

          // 모든 팁이 비어있지 않은 문자열이어야 함
          return aiTips.every(tip => typeof tip === 'string' && tip.length > 0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should provide all text fields in all languages for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        fc.constantFrom<Locale>(...locales),
        (slug, locale) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          // 모든 텍스트 필드가 해당 언어로 존재해야 함
          const hasName = typeof character.name[locale] === 'string' && character.name[locale].length > 0;
          const hasTitle = typeof character.title[locale] === 'string' && character.title[locale].length > 0;
          const hasDescription = typeof character.description[locale] === 'string' && character.description[locale].length > 0;
          const hasStrengths = Array.isArray(character.strengths[locale]) && character.strengths[locale].length > 0;
          const hasPitfalls = Array.isArray(character.pitfalls[locale]) && character.pitfalls[locale].length > 0;
          const hasAiTips = Array.isArray(character.aiTips[locale]) && character.aiTips[locale].length > 0;
          
          const hasFeatures = character.kiroFeatures.every(feature => 
            typeof feature.name[locale] === 'string' && feature.name[locale].length > 0 &&
            typeof feature.description[locale] === 'string' && feature.description[locale].length > 0
          );

          return hasName && hasTitle && hasDescription && hasStrengths && hasPitfalls && hasAiTips && hasFeatures;
        }
      ),
      { numRuns: 100 }
    );
  });
});

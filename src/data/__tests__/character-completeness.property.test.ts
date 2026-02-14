/**
 * Property 14: 캐릭터 데이터 완전성
 * 
 * For any 캐릭터에 대해, 모든 텍스트 필드가 3개 언어(ko, en, ja) 모두에 대해 존재해야 한다.
 * 
 * **Validates: Requirements 8.2**
 */

import fc from 'fast-check';
import { characters } from '@/data/characters';
import type { Locale, CharacterSlug } from '@/lib/types';

describe('Property 14: Character data completeness', () => {
  const allSlugs: CharacterSlug[] = characters.map(c => c.slug);
  const locales: Locale[] = ['ko', 'en', 'ja'];

  it('should have all text fields in all three languages for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        (slug) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          // 모든 언어에 대해 모든 텍스트 필드가 존재해야 함
          return locales.every(locale => {
            const hasName = typeof character.name[locale] === 'string' && character.name[locale].length > 0;
            const hasTitle = typeof character.title[locale] === 'string' && character.title[locale].length > 0;
            const hasDescription = typeof character.description[locale] === 'string' && character.description[locale].length > 0;
            const hasStrengths = Array.isArray(character.strengths[locale]) && character.strengths[locale].length > 0;
            const hasPitfalls = Array.isArray(character.pitfalls[locale]) && character.pitfalls[locale].length > 0;
            const hasAiTips = Array.isArray(character.aiTips[locale]) && character.aiTips[locale].length > 0;

            return hasName && hasTitle && hasDescription && hasStrengths && hasPitfalls && hasAiTips;
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have name field in all three languages for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        (slug) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          // 모든 언어에 이름이 존재해야 함
          return locales.every(locale => 
            typeof character.name[locale] === 'string' && character.name[locale].length > 0
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have title field in all three languages for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        (slug) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          // 모든 언어에 타이틀이 존재해야 함
          return locales.every(locale => 
            typeof character.title[locale] === 'string' && character.title[locale].length > 0
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have description field in all three languages for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        (slug) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          // 모든 언어에 설명이 존재해야 함
          return locales.every(locale => 
            typeof character.description[locale] === 'string' && character.description[locale].length > 0
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have strengths array in all three languages for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        (slug) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          // 모든 언어에 강점 배열이 존재하고 비어있지 않아야 함
          return locales.every(locale => {
            const strengths = character.strengths[locale];
            return Array.isArray(strengths) && 
                   strengths.length > 0 && 
                   strengths.every(s => typeof s === 'string' && s.length > 0);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have pitfalls array in all three languages for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        (slug) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          // 모든 언어에 약점 배열이 존재하고 비어있지 않아야 함
          return locales.every(locale => {
            const pitfalls = character.pitfalls[locale];
            return Array.isArray(pitfalls) && 
                   pitfalls.length > 0 && 
                   pitfalls.every(p => typeof p === 'string' && p.length > 0);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have aiTips array in all three languages for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        (slug) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          // 모든 언어에 AI 팁 배열이 존재하고 비어있지 않아야 함
          return locales.every(locale => {
            const aiTips = character.aiTips[locale];
            return Array.isArray(aiTips) && 
                   aiTips.length > 0 && 
                   aiTips.every(tip => typeof tip === 'string' && tip.length > 0);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have kiroFeatures with multilingual fields in all three languages for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        (slug) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          // 모든 기능이 모든 언어에 대해 이름과 설명을 가져야 함
          return character.kiroFeatures.every(feature => 
            locales.every(locale => {
              const name = feature.name[locale];
              const description = feature.description[locale];
              
              return typeof name === 'string' && name.length > 0 &&
                     typeof description === 'string' && description.length > 0;
            })
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have consistent array lengths across languages for strengths', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        (slug) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          // 모든 언어의 강점 배열 길이가 동일해야 함
          const koLength = character.strengths.ko.length;
          const enLength = character.strengths.en.length;
          const jaLength = character.strengths.ja.length;

          return koLength === enLength && enLength === jaLength;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have consistent array lengths across languages for pitfalls', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        (slug) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          // 모든 언어의 약점 배열 길이가 동일해야 함
          const koLength = character.pitfalls.ko.length;
          const enLength = character.pitfalls.en.length;
          const jaLength = character.pitfalls.ja.length;

          return koLength === enLength && enLength === jaLength;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have consistent array lengths across languages for aiTips', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        (slug) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          // 모든 언어의 AI 팁 배열 길이가 동일해야 함
          const koLength = character.aiTips.ko.length;
          const enLength = character.aiTips.en.length;
          const jaLength = character.aiTips.ja.length;

          return koLength === enLength && enLength === jaLength;
        }
      ),
      { numRuns: 100 }
    );
  });
});

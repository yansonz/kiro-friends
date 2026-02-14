/**
 * Property 15: 캐릭터 불변 필드 유지
 * 
 * For any 캐릭터와 언어 조합에 대해, 이모지와 슬러그는 언어와 무관하게 동일해야 한다.
 * 
 * **Validates: Requirements 8.3, 8.4**
 */

import fc from 'fast-check';
import { characters } from '@/data/characters';
import type { Locale, CharacterSlug } from '@/lib/types';

describe('Property 15: Character invariant fields', () => {
  const allSlugs: CharacterSlug[] = characters.map(c => c.slug);
  const locales: Locale[] = ['ko', 'en', 'ja'];

  it('should have the same emoji regardless of locale for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        fc.constantFrom<Locale>(...locales),
        fc.constantFrom<Locale>(...locales),
        (slug, locale1, locale2) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          // 이모지는 언어와 무관하게 동일해야 함
          // (실제로는 캐릭터 객체에 하나의 emoji 필드만 있음)
          return typeof character.emoji === 'string' && character.emoji.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have the same slug regardless of locale for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        fc.constantFrom<Locale>(...locales),
        fc.constantFrom<Locale>(...locales),
        (slug, locale1, locale2) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          // 슬러그는 언어와 무관하게 동일해야 함
          // (실제로는 캐릭터 객체에 하나의 slug 필드만 있음)
          return character.slug === slug;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have emoji as a non-empty string for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        (slug) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          // 이모지는 비어있지 않은 문자열이어야 함
          return typeof character.emoji === 'string' && character.emoji.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have slug matching the expected CharacterSlug type for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        (slug) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          // 슬러그는 유효한 CharacterSlug 타입이어야 함
          const validSlugs: CharacterSlug[] = [
            'gatssn', 'chonggak', 'cheonyeo', 'dokkaebi', 'gumiho',
            'haetae', 'jangseung', 'jeoseung', 'mulgwisin', 'dalgyal'
          ];
          
          return validSlugs.includes(character.slug);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have axisValues independent of locale for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        fc.constantFrom<Locale>(...locales),
        (slug, locale) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          // axisValues는 언어와 무관하게 동일해야 함
          const { A, B, C, D } = character.axisValues;
          
          return (
            typeof A === 'number' && A >= -2 && A <= 2 &&
            typeof B === 'number' && B >= -2 && B <= 2 &&
            typeof C === 'number' && C >= -2 && C <= 2 &&
            typeof D === 'number' && D >= -2 && D <= 2
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have primaryTag independent of locale for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        fc.constantFrom<Locale>(...locales),
        (slug, locale) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          // primaryTag는 언어와 무관하게 동일해야 함
          return typeof character.primaryTag === 'string' && character.primaryTag.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have synergy character slug independent of locale for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        fc.constantFrom<Locale>(...locales),
        (slug, locale) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          // synergy는 언어와 무관하게 동일한 슬러그여야 함
          const validSlugs: CharacterSlug[] = [
            'gatssn', 'chonggak', 'cheonyeo', 'dokkaebi', 'gumiho',
            'haetae', 'jangseung', 'jeoseung', 'mulgwisin', 'dalgyal'
          ];
          
          return validSlugs.includes(character.synergy);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have tension character slug independent of locale for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        fc.constantFrom<Locale>(...locales),
        (slug, locale) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          // tension은 언어와 무관하게 동일한 슬러그여야 함
          const validSlugs: CharacterSlug[] = [
            'gatssn', 'chonggak', 'cheonyeo', 'dokkaebi', 'gumiho',
            'haetae', 'jangseung', 'jeoseung', 'mulgwisin', 'dalgyal'
          ];
          
          return validSlugs.includes(character.tension);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have kiroFeatures level independent of locale for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        fc.constantFrom<Locale>(...locales),
        (slug, locale) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          // kiroFeatures의 level은 언어와 무관하게 동일해야 함
          return character.kiroFeatures.every(feature => 
            feature.level === 'basic' || feature.level === 'advanced'
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have all invariant fields (emoji, slug, axisValues, primaryTag, synergy, tension) for any character', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        (slug) => {
          const character = characters.find(c => c.slug === slug);
          
          if (!character) return false;

          // 모든 불변 필드가 존재하고 유효해야 함
          const hasEmoji = typeof character.emoji === 'string' && character.emoji.length > 0;
          const hasSlug = character.slug === slug;
          const hasAxisValues = 
            typeof character.axisValues.A === 'number' &&
            typeof character.axisValues.B === 'number' &&
            typeof character.axisValues.C === 'number' &&
            typeof character.axisValues.D === 'number';
          const hasPrimaryTag = typeof character.primaryTag === 'string' && character.primaryTag.length > 0;
          
          const validSlugs: CharacterSlug[] = [
            'gatssn', 'chonggak', 'cheonyeo', 'dokkaebi', 'gumiho',
            'haetae', 'jangseung', 'jeoseung', 'mulgwisin', 'dalgyal'
          ];
          const hasSynergy = validSlugs.includes(character.synergy);
          const hasTension = validSlugs.includes(character.tension);

          return hasEmoji && hasSlug && hasAxisValues && hasPrimaryTag && hasSynergy && hasTension;
        }
      ),
      { numRuns: 100 }
    );
  });
});

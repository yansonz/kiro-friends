/**
 * i18n 유틸리티 함수 단위 테스트
 */

import {
  t,
  getOgImagePath,
  getOgImagePathWithFallback,
  detectBrowserLocale,
  getNextLocale,
  saveLocale,
  loadLocale,
} from '../index';
import type { Locale, TranslationData } from '../types';

describe('i18n utility functions', () => {
  describe('t() function', () => {
    const mockTranslations: TranslationData = {
      'home.title': '👻 당신은 어떤 Kiro 프렌즈?',
      'home.description': 'AI 개발 도구 Kiro와 함께하는 성격 유형 테스트',
    };

    it('should return translated text for valid key', () => {
      const result = t('home.title', mockTranslations);
      expect(result).toBe('👻 당신은 어떤 Kiro 프렌즈?');
    });

    it('should return key name for missing translation', () => {
      const result = t('nonexistent.key', mockTranslations);
      expect(result).toBe('nonexistent.key');
    });

    it('should handle empty translations object', () => {
      const result = t('home.title', {});
      expect(result).toBe('home.title');
    });
  });

  describe('getOgImagePath() function', () => {
    it('should generate correct OG image path', () => {
      expect(getOgImagePath('gatssn', 'ko')).toBe('/og/gatssn-ko.png');
      expect(getOgImagePath('gatssn', 'en')).toBe('/og/gatssn-en.png');
      expect(getOgImagePath('gatssn', 'ja')).toBe('/og/gatssn-ja.png');
    });

    it('should handle different character slugs', () => {
      expect(getOgImagePath('dalgyal', 'ko')).toBe('/og/dalgyal-ko.png');
      expect(getOgImagePath('bbangya', 'en')).toBe('/og/bbangya-en.png');
    });
  });

  describe('getOgImagePathWithFallback() function', () => {
    it('should return localized path', () => {
      expect(getOgImagePathWithFallback('gatssn', 'ko')).toBe(
        '/og/gatssn-ko.png'
      );
      expect(getOgImagePathWithFallback('gatssn', 'en')).toBe(
        '/og/gatssn-en.png'
      );
    });
  });

  describe('detectBrowserLocale() function', () => {
    const originalNavigator = global.navigator;

    afterEach(() => {
      Object.defineProperty(global, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });

    it('should return ko as default when navigator is undefined', () => {
      Object.defineProperty(global, 'navigator', {
        value: undefined,
        writable: true,
      });
      expect(detectBrowserLocale()).toBe('ko');
    });

    it('should detect supported browser language', () => {
      Object.defineProperty(global, 'navigator', {
        value: { language: 'en-US' },
        writable: true,
      });
      expect(detectBrowserLocale()).toBe('en');

      Object.defineProperty(global, 'navigator', {
        value: { language: 'ja-JP' },
        writable: true,
      });
      expect(detectBrowserLocale()).toBe('ja');
    });

    it('should return ko for unsupported language', () => {
      Object.defineProperty(global, 'navigator', {
        value: { language: 'fr-FR' },
        writable: true,
      });
      expect(detectBrowserLocale()).toBe('ko');
    });
  });

  describe('getNextLocale() function', () => {
    it('should cycle through locales in order', () => {
      expect(getNextLocale('ko')).toBe('en');
      expect(getNextLocale('en')).toBe('ja');
      expect(getNextLocale('ja')).toBe('ko');
    });
  });

  describe('saveLocale() and loadLocale() functions', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should save and load locale from localStorage', () => {
      saveLocale('en');
      expect(loadLocale()).toBe('en');

      saveLocale('ja');
      expect(loadLocale()).toBe('ja');
    });

    it('should return null when no locale is saved', () => {
      expect(loadLocale()).toBeNull();
    });

    it('should return null for invalid locale value', () => {
      localStorage.setItem('locale', 'invalid');
      expect(loadLocale()).toBeNull();
    });
  });
});

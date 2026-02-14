/**
 * Property 2: 언어 레이블 표시
 * 
 * For any 선택된 언어에 대해, Language_Switcher는 해당 언어의 올바른 레이블을 표시해야 한다.
 * 
 * **Validates: Requirements 1.3**
 * 
 * Feature: i18n-support
 */

import { render, screen, waitFor } from '@testing-library/react';
import fc from 'fast-check';
import LanguageSwitcher from '../LanguageSwitcher';
import { I18nProvider } from '@/contexts/I18nContext';
import type { Locale } from '@/lib/i18n/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// 언어별 올바른 레이블 매핑
const localeLabels: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
};

describe('Property 2: Language label display', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should display correct label for any selected locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        async (locale) => {
          // 로컬 스토리지에 언어 설정
          localStorageMock.setItem('locale', locale);

          const { unmount } = render(
            <I18nProvider>
              <LanguageSwitcher />
            </I18nProvider>
          );

          // 올바른 레이블이 표시될 때까지 대기
          await waitFor(
            () => {
              const button = screen.getByRole('button');
              const expectedLabel = localeLabels[locale];
              expect(button.textContent).toContain(expectedLabel);
            },
            { timeout: 1000 }
          );

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have correct aria-label for any selected locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('ko', 'en', 'ja'),
        async (locale) => {
          // 로컬 스토리지에 언어 설정
          localStorageMock.setItem('locale', locale);

          const { unmount } = render(
            <I18nProvider>
              <LanguageSwitcher />
            </I18nProvider>
          );

          // aria-label이 현재 언어를 포함하는지 확인
          await waitFor(
            () => {
              const button = screen.getByRole('button');
              const ariaLabel = button.getAttribute('aria-label');
              const expectedLabel = localeLabels[locale];
              
              expect(ariaLabel).toContain('Change language');
              expect(ariaLabel).toContain(expectedLabel);
            },
            { timeout: 1000 }
          );

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

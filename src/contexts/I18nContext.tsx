'use client';

/**
 * I18n Context
 * 언어 상태를 전역으로 관리하는 React Context
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { Locale, TranslationData } from '@/lib/i18n/types';
import {
  detectBrowserLocale,
  saveLocale as saveLocaleToStorage,
  loadLocale as loadLocaleFromStorage,
  t as translateKey,
} from '@/lib/i18n';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ko');
  const [translations, setTranslations] = useState<TranslationData>({});
  const [isLoading, setIsLoading] = useState(true);

  // 번역 데이터 로드
  const loadTranslations = useCallback(async (targetLocale: Locale) => {
    setIsLoading(true);
    try {
      const data = await import(`@/lib/i18n/locales/${targetLocale}.json`);
      setTranslations(data.default);
    } catch (error) {
      console.error(`Failed to load translations for ${targetLocale}:`, error);

      // 한국어로 폴백
      if (targetLocale !== 'ko') {
        try {
          const fallback = await import('@/lib/i18n/locales/ko.json');
          setTranslations(fallback.default);
          setLocaleState('ko');
        } catch (fallbackError) {
          console.error('Failed to load fallback translations:', fallbackError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 초기 로드: 로컬 스토리지 또는 브라우저 언어 감지
  useEffect(() => {
    const savedLocale = loadLocaleFromStorage();
    const browserLocale = detectBrowserLocale();

    const initialLocale = savedLocale || browserLocale;

    setLocaleState(initialLocale);
    loadTranslations(initialLocale);
  }, [loadTranslations]);

  // 언어 변경
  const setLocale = useCallback(
    (newLocale: Locale) => {
      setLocaleState(newLocale);
      saveLocaleToStorage(newLocale);
      loadTranslations(newLocale);

      // HTML lang 속성 업데이트
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLocale;
      }
    },
    [loadTranslations]
  );

  // 번역 함수
  const t = useCallback(
    (key: string): string => {
      return translateKey(key, translations, locale);
    },
    [translations, locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isLoading }}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * I18n Context를 사용하는 커스텀 훅
 * @throws {Error} I18nProvider 외부에서 사용 시 에러 발생
 */
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

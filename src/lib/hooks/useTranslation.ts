/**
 * useTranslation Hook
 * 컴포넌트에서 번역 기능을 사용하기 위한 커스텀 훅
 */

import { useI18n } from '@/contexts/I18nContext';

/**
 * I18n Context에 접근하여 번역 기능을 제공하는 훅
 * 
 * @returns I18nContextValue - locale, setLocale, t, isLoading
 * @throws {Error} I18nProvider 외부에서 사용 시 에러 발생
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { t, locale, setLocale } = useTranslation();
 *   return <h1>{t('home.title')}</h1>;
 * }
 * ```
 */
export function useTranslation() {
  try {
    const context = useI18n();
    return context;
  } catch (error) {
    // useI18n에서 발생한 에러를 useTranslation 에러로 변환
    throw new Error('useTranslation must be used within I18nProvider');
  }
}

/**
 * useTranslation Hook 테스트
 */

import { renderHook } from '@testing-library/react';
import { useTranslation } from '../useTranslation';
import { I18nProvider } from '@/contexts/I18nContext';
import type { ReactNode } from 'react';

describe('useTranslation', () => {
  it('should throw error when used outside I18nProvider', () => {
    // I18nProvider 없이 사용하면 에러 발생
    expect(() => {
      renderHook(() => useTranslation());
    }).toThrow('useTranslation must be used within I18nProvider');
  });

  it('should return context value when used within I18nProvider', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <I18nProvider>{children}</I18nProvider>
    );

    const { result } = renderHook(() => useTranslation(), { wrapper });

    // Context 값이 반환되어야 함
    expect(result.current).toBeDefined();
    expect(result.current.locale).toBeDefined();
    expect(result.current.setLocale).toBeInstanceOf(Function);
    expect(result.current.t).toBeInstanceOf(Function);
    expect(typeof result.current.isLoading).toBe('boolean');
  });

  it('should provide translation function', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <I18nProvider>{children}</I18nProvider>
    );

    const { result } = renderHook(() => useTranslation(), { wrapper });

    // t 함수가 문자열을 반환해야 함
    const translated = result.current.t('home.title');
    expect(typeof translated).toBe('string');
  });
});

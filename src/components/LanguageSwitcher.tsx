'use client';

/**
 * LanguageSwitcher Component
 * 언어 전환 버튼 컴포넌트
 * 
 * 사용자가 클릭하여 언어를 순환할 수 있습니다 (ko → en → ja → ko)
 * 음악 토글 버튼 아래에 위치하며, 접근성을 고려한 디자인입니다.
 */

import { useI18n } from '@/contexts/I18nContext';
import type { Locale } from '@/lib/i18n/types';

const locales: Locale[] = ['ko', 'en', 'ja'];

const localeFlags: Record<Locale, string> = {
  ko: '🇰🇷',
  en: '🇺🇸',
  ja: '🇯🇵',
};

const localeLabels: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
};

interface LanguageSwitcherProps {
  isOverlay?: boolean;
}

export default function LanguageSwitcher({ isOverlay = false }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();

  const handleClick = () => {
    const currentIndex = locales.indexOf(locale);
    const nextIndex = (currentIndex + 1) % locales.length;
    setLocale(locales[nextIndex]);
  };

  // 오버레이 모드일 때는 fixed 위치 제거
  const positionClasses = isOverlay 
    ? '' 
    : 'fixed top-20 right-4 z-[100]';

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${positionClasses} w-12 h-12 rounded-full bg-purple-900/80 
                 border border-purple-700/50 text-2xl flex items-center justify-center
                 hover:bg-purple-800/80 active:scale-95 transition-all shadow-lg cursor-pointer
                 touch-manipulation`}
      aria-label={`Change language. Current: ${localeLabels[locale]}`}
    >
      {localeFlags[locale]}
    </button>
  );
}

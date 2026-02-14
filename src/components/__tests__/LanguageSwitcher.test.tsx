/**
 * LanguageSwitcher Component Unit Tests
 * 
 * 버튼 렌더링, 클릭 이벤트 처리, 접근성 속성을 검증합니다.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LanguageSwitcher from '../LanguageSwitcher';
import { I18nProvider } from '@/contexts/I18nContext';

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

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('버튼이 렌더링되어야 한다', async () => {
    render(
      <I18nProvider>
        <LanguageSwitcher />
      </I18nProvider>
    );

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  it('현재 언어 레이블을 표시해야 한다', async () => {
    render(
      <I18nProvider>
        <LanguageSwitcher />
      </I18nProvider>
    );

    // 언어 레이블이 표시될 때까지 대기
    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button.textContent).toMatch(/한국어|English|日本語/);
    });
  });

  it('클릭 시 언어가 순환되어야 한다', async () => {
    render(
      <I18nProvider>
        <LanguageSwitcher />
      </I18nProvider>
    );

    const button = await screen.findByRole('button');
    
    // 초기 언어 확인
    const initialText = button.textContent;
    expect(initialText).toMatch(/한국어|English|日本語/);

    // 첫 번째 클릭
    fireEvent.click(button);
    await waitFor(() => {
      expect(button.textContent).not.toBe(initialText);
    });

    const secondText = button.textContent;

    // 두 번째 클릭
    fireEvent.click(button);
    await waitFor(() => {
      expect(button.textContent).not.toBe(secondText);
    });

    // 세 번째 클릭 - 원래 언어로 돌아와야 함
    fireEvent.click(button);
    await waitFor(() => {
      expect(button.textContent).toBe(initialText);
    });
  });

  it('aria-label 속성이 있어야 한다', async () => {
    render(
      <I18nProvider>
        <LanguageSwitcher />
      </I18nProvider>
    );

    const button = await screen.findByRole('button');
    expect(button).toHaveAttribute('aria-label');
    expect(button.getAttribute('aria-label')).toContain('Change language');
  });

  it('키보드로 접근 가능해야 한다', async () => {
    render(
      <I18nProvider>
        <LanguageSwitcher />
      </I18nProvider>
    );

    const button = await screen.findByRole('button');
    
    // 버튼은 기본적으로 키보드 포커스 가능
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('최소 44px 높이를 가져야 한다', async () => {
    render(
      <I18nProvider>
        <LanguageSwitcher />
      </I18nProvider>
    );

    const button = await screen.findByRole('button');
    expect(button.className).toContain('min-h-[44px]');
  });
});

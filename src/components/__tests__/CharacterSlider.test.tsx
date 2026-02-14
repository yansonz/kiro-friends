import { render, screen } from '@testing-library/react';
import CharacterSlider from '../CharacterSlider';
import { characters } from '@/data/characters';
import type { CharacterProfile } from '@/lib/types';
import { I18nProvider } from '@/contexts/I18nContext';

// CharacterSlider 컴포넌트 단위 테스트
// Validates: Requirements 9.3

// 테스트용 캐릭터 서브셋 (3개)
const testCharacters: CharacterProfile[] = characters.slice(0, 3);

describe('CharacterSlider', () => {
  it('슬라이더 컨테이너를 렌더링한다', () => {
    render(
      <I18nProvider>
        <CharacterSlider characters={testCharacters} />
      </I18nProvider>
    );
    expect(screen.getByTestId('character-slider')).toBeInTheDocument();
    expect(screen.getByTestId('slider-container')).toBeInTheDocument();
  });

  it('제목 "모든 Kiro 프렌즈"를 표시한다', async () => {
    render(
      <I18nProvider>
        <CharacterSlider characters={testCharacters} />
      </I18nProvider>
    );
    // 번역이 로드될 때까지 대기
    const title = await screen.findByText(/모든 Kiro 프렌즈|All Kiro Friends|すべてのKiroフレンズ/);
    expect(title).toBeInTheDocument();
  });

  it('전달된 캐릭터 수만큼 슬라이더 아이템을 렌더링한다', () => {
    render(
      <I18nProvider>
        <CharacterSlider characters={testCharacters} />
      </I18nProvider>
    );
    testCharacters.forEach((char) => {
      expect(screen.getByTestId(`slider-item-${char.slug}`)).toBeInTheDocument();
    });
  });

  it('9개 캐릭터 전체를 렌더링한다', () => {
    render(
      <I18nProvider>
        <CharacterSlider characters={characters} />
      </I18nProvider>
    );
    characters.forEach((char) => {
      expect(screen.getByTestId(`slider-item-${char.slug}`)).toBeInTheDocument();
    });
  });

  it('각 캐릭터 카드가 /result/[slug] 링크를 가진다', () => {
    render(
      <I18nProvider>
        <CharacterSlider characters={testCharacters} />
      </I18nProvider>
    );
    testCharacters.forEach((char) => {
      const link = screen.getByTestId(`slider-item-${char.slug}`);
      expect(link).toHaveAttribute('href', `/result/${char.slug}`);
    });
  });

  it('currentType이 지정되면 해당 캐릭터에 aria-current를 설정한다', () => {
    render(
      <I18nProvider>
        <CharacterSlider characters={testCharacters} currentType="gatssn" />
      </I18nProvider>
    );
    const currentItem = screen.getByTestId('slider-item-gatssn');
    expect(currentItem).toHaveAttribute('aria-current', 'true');
  });

  it('currentType이 아닌 캐릭터에는 aria-current가 없다', () => {
    render(
      <I18nProvider>
        <CharacterSlider characters={testCharacters} currentType="gatssn" />
      </I18nProvider>
    );
    const otherItem = screen.getByTestId('slider-item-chonggak');
    expect(otherItem).not.toHaveAttribute('aria-current');
  });

  it('currentType이 지정되면 해당 카드에 하이라이트 스타일이 적용된다', () => {
    render(
      <I18nProvider>
        <CharacterSlider characters={testCharacters} currentType="gatssn" />
      </I18nProvider>
    );
    const currentItem = screen.getByTestId('slider-item-gatssn');
    expect(currentItem.className).toContain('ring-2');
    expect(currentItem.className).toContain('scale-105');
  });

  it('currentType이 없으면 모든 카드에 하이라이트가 없다', () => {
    render(
      <I18nProvider>
        <CharacterSlider characters={testCharacters} />
      </I18nProvider>
    );
    testCharacters.forEach((char) => {
      const item = screen.getByTestId(`slider-item-${char.slug}`);
      expect(item.className).not.toContain('ring-2');
      expect(item.className).not.toContain('scale-105');
    });
  });

  it('CharacterCard를 compact 모드로 렌더링한다', () => {
    render(
      <I18nProvider>
        <CharacterSlider characters={testCharacters} />
      </I18nProvider>
    );
    // compact 모드의 CharacterCard는 character-card-compact testid를 가짐
    // 무한 루프를 위해 3배로 복제되므로 3배의 카드가 렌더링됨
    const compactCards = screen.getAllByTestId('character-card-compact');
    expect(compactCards).toHaveLength(testCharacters.length * 3);
  });
});

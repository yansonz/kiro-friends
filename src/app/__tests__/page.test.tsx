import { render, screen } from '@testing-library/react';
import Home from '../page';

// 랜딩 페이지 단위 테스트

describe('Landing Page', () => {
  beforeEach(() => {
    render(<Home />);
  });

  it('프로젝트 타이틀을 표시한다', () => {
    expect(
      screen.getByText('👻 당신은 어떤 Kiro 프렌즈?')
    ).toBeInTheDocument();
  });

  it('세계관 소개 문구를 표시한다', () => {
    expect(
      screen.getByText(/한국 전통 설화 속 10명의 캐릭터/)
    ).toBeInTheDocument();
  });

  it('10개 캐릭터 이미지를 표시한다', () => {
    const characterNames = [
      '갓쓴키로형', '총각귀신형', '처녀귀신형', '도깨비형', '구미호형',
      '해태형', '장승형', '저승사자형', '물귀신형', '달걀귀신형',
    ];
    characterNames.forEach((name) => {
      expect(screen.getByAltText(name)).toBeInTheDocument();
    });
  });

  it('중앙에 Kiro 메인 캐릭터를 표시한다', () => {
    expect(screen.getByAltText('Kiro')).toBeInTheDocument();
  });

  it('"내 유형 알아보기" CTA 버튼을 표시한다', () => {
    const cta = screen.getByRole('link', { name: '내 유형 알아보기' });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute('href', '/quiz');
  });

  it('"16문항, 약 2분 소요" 안내 문구를 표시한다', () => {
    expect(screen.getByText('16문항, 약 2분 소요')).toBeInTheDocument();
  });
});

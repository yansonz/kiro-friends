import { render, screen, cleanup } from '@testing-library/react';
import ProgressBar from '../ProgressBar';
import fc from 'fast-check';

// ProgressBar 컴포넌트 단위 테스트 (16문항 기준)

describe('ProgressBar - Unit Tests', () => {
  it('첫 번째 질문에서 "1/16"을 표시한다', () => {
    render(<ProgressBar current={0} total={16} />);
    expect(screen.getByTestId('progress-text')).toHaveTextContent('1/16');
  });

  it('여덟 번째 질문에서 "8/16"을 표시한다', () => {
    render(<ProgressBar current={7} total={16} />);
    expect(screen.getByTestId('progress-text')).toHaveTextContent('8/16');
  });

  it('마지막 질문에서 "16/16"을 표시한다', () => {
    render(<ProgressBar current={15} total={16} />);
    expect(screen.getByTestId('progress-text')).toHaveTextContent('16/16');
  });

  it('진행률에 따라 프로그레스 바 너비가 변한다', () => {
    render(<ProgressBar current={7} total={16} />);
    const fill = screen.getByTestId('progress-fill');
    // current=7 → displayCurrent=8 → 8/16 = 50%
    expect(fill).toHaveStyle({ width: '50%' });
  });

  it('progressbar role과 aria 속성이 올바르게 설정된다', () => {
    render(<ProgressBar current={7} total={16} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '8');
    expect(bar).toHaveAttribute('aria-valuemin', '1');
    expect(bar).toHaveAttribute('aria-valuemax', '16');
  });

  it('100% 진행 시 프로그레스 바가 가득 찬다', () => {
    render(<ProgressBar current={15} total={16} />);
    const fill = screen.getByTestId('progress-fill');
    expect(fill).toHaveStyle({ width: '100%' });
  });

  it('첫 번째 질문에서 프로그레스 바가 6.25%이다', () => {
    render(<ProgressBar current={0} total={16} />);
    const fill = screen.getByTestId('progress-fill');
    // 1/16 = 6.25%
    expect(fill).toHaveStyle({ width: '6.25%' });
  });

  it('중간 지점(8번째 질문)에서 프로그레스 바가 50%이다', () => {
    render(<ProgressBar current={7} total={16} />);
    const fill = screen.getByTestId('progress-fill');
    expect(fill).toHaveStyle({ width: '50%' });
  });
});

describe('ProgressBar - Property-Based Tests', () => {
  /**
   * Property 11: Progress calculation formula
   * Requirements 8.2, 8.3: (currentQuestion / 16) * 100
   */
  it('Property 11: Progress calculation formula', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 15 }), // current question index (0-15)
        (currentIndex) => {
          // 각 반복마다 cleanup하여 DOM 초기화
          cleanup();
          
          render(<ProgressBar current={currentIndex} total={16} />);
          const fill = screen.getByTestId('progress-fill');
          
          // 예상 진행률: (currentIndex + 1) / 16 * 100
          const expectedPercent = ((currentIndex + 1) / 16) * 100;
          const actualStyle = fill.style.width;
          const actualPercent = parseFloat(actualStyle);
          
          // 부동소수점 오차 허용 (0.01% 이내)
          expect(Math.abs(actualPercent - expectedPercent)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 12: Progress updates after each answer
   * Requirements 8.4: 답변 제출 후 진행률이 증가해야 함
   * 
   * 이 테스트는 ProgressBar 컴포넌트가 current prop 변경에 따라
   * 올바르게 업데이트되는지 확인합니다.
   */
  it('Property 12: Progress update behavior', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 14 }), // 0-14 (마지막 전까지)
        (currentIndex) => {
          // 각 반복마다 cleanup하여 DOM 초기화
          cleanup();
          
          // 현재 상태 렌더링
          const { rerender } = render(<ProgressBar current={currentIndex} total={16} />);
          const fill1 = screen.getByTestId('progress-fill');
          const percent1 = parseFloat(fill1.style.width);
          
          // 다음 질문으로 이동
          rerender(<ProgressBar current={currentIndex + 1} total={16} />);
          const fill2 = screen.getByTestId('progress-fill');
          const percent2 = parseFloat(fill2.style.width);
          
          // 진행률이 증가해야 함
          expect(percent2).toBeGreaterThan(percent1);
          
          // 정확히 (1/16 * 100)% 증가해야 함
          const expectedIncrease = (1 / 16) * 100;
          expect(Math.abs((percent2 - percent1) - expectedIncrease)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 추가 Property: 진행률은 항상 0-100% 범위 내
   */
  it('진행률은 항상 0-100% 범위 내에 있다', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 15 }),
        (currentIndex) => {
          cleanup();
          
          render(<ProgressBar current={currentIndex} total={16} />);
          const fill = screen.getByTestId('progress-fill');
          const percent = parseFloat(fill.style.width);
          
          expect(percent).toBeGreaterThanOrEqual(0);
          expect(percent).toBeLessThanOrEqual(100);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 추가 Property: 표시 텍스트는 항상 "N/16" 형식
   */
  it('표시 텍스트는 항상 올바른 형식이다', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 15 }),
        (currentIndex) => {
          cleanup();
          
          render(<ProgressBar current={currentIndex} total={16} />);
          const text = screen.getByTestId('progress-text');
          
          const expectedText = `${currentIndex + 1}/16`;
          expect(text).toHaveTextContent(expectedText);
        }
      ),
      { numRuns: 100 }
    );
  });
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import QuizPage from '../page';

// Next.js router mock
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Quiz Page 컴포넌트 단위 테스트 (16문항 기준)

describe('QuizPage - UI Rendering with 16 Questions', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    mockPush.mockClear();
  });

  /**
   * Requirements 8.1: 퀴즈 페이지가 1-16 질문 번호를 표시하는지 확인
   */
  it('첫 번째 질문에서 Q1을 표시한다', () => {
    render(<QuizPage />);
    expect(screen.getByText('Q1')).toBeInTheDocument();
  });

  it('질문 텍스트가 표시된다', () => {
    render(<QuizPage />);
    const questionText = screen.getByTestId('question-text');
    expect(questionText).toBeInTheDocument();
    expect(questionText.textContent).toBeTruthy();
  });

  it('선택지가 표시된다', () => {
    render(<QuizPage />);
    // Q1은 2개의 선택지를 가짐
    const options = screen.getAllByTestId(/^option-/);
    expect(options.length).toBeGreaterThanOrEqual(2);
  });

  it('진행률 표시가 1/16으로 시작한다', () => {
    render(<QuizPage />);
    expect(screen.getByTestId('progress-text')).toHaveTextContent('1/16');
  });

  it('선택지를 클릭하면 다음 질문으로 이동한다', () => {
    render(<QuizPage />);
    
    // 첫 번째 선택지 클릭
    const firstOption = screen.getByTestId('option-0');
    fireEvent.click(firstOption);
    
    // Q2가 표시되어야 함
    expect(screen.getByText('Q2')).toBeInTheDocument();
  });

  it('여러 질문을 순차적으로 진행할 수 있다', () => {
    render(<QuizPage />);
    
    // Q1 → Q2
    fireEvent.click(screen.getByTestId('option-0'));
    expect(screen.getByText('Q2')).toBeInTheDocument();
    
    // Q2 → Q3
    fireEvent.click(screen.getByTestId('option-0'));
    expect(screen.getByText('Q3')).toBeInTheDocument();
    
    // Q3 → Q4
    fireEvent.click(screen.getByTestId('option-0'));
    expect(screen.getByText('Q4')).toBeInTheDocument();
  });

  it('진행률이 질문 진행에 따라 업데이트된다', () => {
    render(<QuizPage />);
    
    // 초기: 1/16
    expect(screen.getByTestId('progress-text')).toHaveTextContent('1/16');
    
    // Q1 답변 → 2/16
    fireEvent.click(screen.getByTestId('option-0'));
    expect(screen.getByTestId('progress-text')).toHaveTextContent('2/16');
    
    // Q2 답변 → 3/16
    fireEvent.click(screen.getByTestId('option-0'));
    expect(screen.getByTestId('progress-text')).toHaveTextContent('3/16');
  });

  it('16번째 질문까지 진행할 수 있다', () => {
    render(<QuizPage />);
    
    // Q1-Q15까지 답변 (15번 클릭)
    for (let i = 0; i < 15; i++) {
      fireEvent.click(screen.getByTestId('option-0'));
    }
    
    // Q16이 표시되어야 함
    expect(screen.getByText('Q16')).toBeInTheDocument();
    expect(screen.getByTestId('progress-text')).toHaveTextContent('16/16');
  });

  it('16번째 질문에 답변하면 결과 페이지로 이동한다', async () => {
    render(<QuizPage />);
    
    // Q1-Q16까지 모두 답변 (16번 클릭)
    for (let i = 0; i < 16; i++) {
      fireEvent.click(screen.getByTestId('option-0'));
    }
    
    // 결과 페이지로 라우팅되어야 함 (completed=true 파라미터 포함)
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(expect.stringMatching(/^\/result\/.+\?completed=true$/));
    });
  });

  it('Q1-Q8은 2개의 선택지를 가진다', () => {
    render(<QuizPage />);
    
    // Q1-Q8까지 확인
    for (let i = 0; i < 8; i++) {
      const options = screen.getAllByTestId(/^option-/);
      expect(options.length).toBe(2);
      
      // 마지막 질문이 아니면 다음으로 이동
      if (i < 7) {
        fireEvent.click(options[0]);
      }
    }
  });

  it('Q9-Q16은 4개의 선택지를 가진다', () => {
    render(<QuizPage />);
    
    // Q1-Q8까지 건너뛰기
    for (let i = 0; i < 8; i++) {
      fireEvent.click(screen.getByTestId('option-0'));
    }
    
    // Q9-Q16까지 확인
    for (let i = 8; i < 16; i++) {
      const options = screen.getAllByTestId(/^option-/);
      expect(options.length).toBe(4);
      
      // 마지막 질문이 아니면 다음으로 이동
      if (i < 15) {
        fireEvent.click(options[0]);
      }
    }
  });

  it('각 질문은 고유한 ID를 가진다', () => {
    render(<QuizPage />);
    
    const seenIds = new Set<string>();
    
    // 모든 질문을 순회하며 ID 확인
    for (let i = 0; i < 16; i++) {
      const questionId = screen.getByText(/^Q\d+$/).textContent;
      expect(questionId).toBeTruthy();
      expect(seenIds.has(questionId!)).toBe(false);
      seenIds.add(questionId!);
      
      // 마지막 질문이 아니면 다음으로 이동
      if (i < 15) {
        fireEvent.click(screen.getByTestId('option-0'));
      }
    }
    
    // 16개의 고유한 ID가 있어야 함
    expect(seenIds.size).toBe(16);
  });

  it('질문 번호가 1부터 16까지 순차적이다', () => {
    render(<QuizPage />);
    
    // 모든 질문을 순회하며 번호 확인
    for (let i = 1; i <= 16; i++) {
      expect(screen.getByText(`Q${i}`)).toBeInTheDocument();
      
      // 마지막 질문이 아니면 다음으로 이동
      if (i < 16) {
        fireEvent.click(screen.getByTestId('option-0'));
      }
    }
  });

  it('프로그레스 바가 0%에서 100%까지 증가한다', () => {
    render(<QuizPage />);
    
    // 초기 진행률 확인 (6.25% = 1/16)
    const progressFill = screen.getByTestId('progress-fill');
    expect(progressFill).toHaveStyle({ width: '6.25%' });
    
    // 중간 지점까지 진행 (Q1-Q8 답변, 7번 클릭)
    for (let i = 0; i < 7; i++) {
      fireEvent.click(screen.getByTestId('option-0'));
    }
    
    // 50% 진행률 확인 (8/16)
    expect(screen.getByTestId('progress-fill')).toHaveStyle({ width: '50%' });
    
    // 마지막 질문까지 진행 (Q9-Q16 답변, 8번 클릭)
    for (let i = 0; i < 8; i++) {
      fireEvent.click(screen.getByTestId('option-0'));
    }
    
    // 100% 진행률 확인 (16/16)
    expect(screen.getByTestId('progress-fill')).toHaveStyle({ width: '100%' });
  });
});

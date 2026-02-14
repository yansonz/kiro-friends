import { render, screen, fireEvent, act } from '@testing-library/react';
import ShareButtons from '../ShareButtons';
import type { CharacterProfile } from '@/lib/types';

// ShareButtons 컴포넌트 단위 테스트

// navigator.clipboard 모킹
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

// 테스트용 캐릭터 데이터
const mockCharacter: CharacterProfile = {
  slug: 'dokkaebi',
  emoji: '👹',
  name: '도깨비형',
  title: '파괴적 혁신가',
  description: '기존 방식을 뒤엎고 새로운 길을 만드는 개척자',
  axisValues: { A: 1, B: 1, C: -1, D: 1 },
  primaryTag: '몰입',
  strengths: ['빠른 프로토타이핑 능력'],
  pitfalls: ['기술 부채 누적 가능성'],
  kiroFeatures: [
    // Basic 3개
    { name: 'Autopilot', description: '자동 코드 생성으로 빠른 구현', level: 'basic' },
    { name: 'Hooks', description: '자동화된 워크플로우 구성', level: 'basic' },
    { name: 'Specs', description: '요구사항 체계적 관리', level: 'basic' },
    // Advanced 6개
    { name: 'MCP', description: '외부 도구 연동으로 생산성 극대화', level: 'advanced' },
    { name: 'Checkpointing', description: '실험 실패 시 즉시 롤백', level: 'advanced' },
    { name: 'Powers Marketplace', description: '다양한 Powers 원클릭 설치', level: 'advanced' },
    { name: 'Custom Subagents', description: 'PoC 전문 에이전트 분리', level: 'advanced' },
    { name: 'Web Search', description: '최신 기술 문서 검색', level: 'advanced' },
    { name: 'Hooks (postToolUse)', description: '실험 코드 품질 자동 체크', level: 'advanced' },
  ],
  aiTips: ['"이 아이디어를 빠르게 프로토타입으로 만들어줘"'],
  synergy: 'gatssn',
  tension: 'haetae',
};

const mockResultUrl = 'https://kiro-friends.example.com/result/dokkaebi';

describe('ShareButtons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('2개의 공유 버튼을 렌더링한다', () => {
    render(<ShareButtons character={mockCharacter} resultUrl={mockResultUrl} />);
    expect(screen.getByTestId('share-copy-button')).toBeInTheDocument();
    expect(screen.getByTestId('share-download-button')).toBeInTheDocument();
  });

  it('공유 버튼 컨테이너를 렌더링한다', () => {
    render(<ShareButtons character={mockCharacter} resultUrl={mockResultUrl} />);
    expect(screen.getByTestId('share-buttons')).toBeInTheDocument();
  });

  it('링크 복사 성공 시 토스트 메시지를 표시한다', async () => {
    (navigator.clipboard.writeText as jest.Mock).mockResolvedValue(undefined);
    render(<ShareButtons character={mockCharacter} resultUrl={mockResultUrl} />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('share-copy-button'));
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockResultUrl);
    expect(screen.getByText('✅ 링크가 복사되었습니다!')).toBeInTheDocument();
  });

  it('토스트 메시지가 3초 후 사라진다', async () => {
    (navigator.clipboard.writeText as jest.Mock).mockResolvedValue(undefined);
    render(<ShareButtons character={mockCharacter} resultUrl={mockResultUrl} />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('share-copy-button'));
    });

    expect(screen.getByText('✅ 링크가 복사되었습니다!')).toBeInTheDocument();

    // 3초 후 토스트 사라짐
    act(() => {
      jest.advanceTimersByTime(3500);
    });

    expect(screen.queryByText('✅ 링크가 복사되었습니다!')).not.toBeInTheDocument();
  });

  it('이미지 다운로드 버튼 클릭 시 다운로드를 시작한다', () => {
    const createElementSpy = jest.spyOn(document, 'createElement');
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const removeChildSpy = jest.spyOn(document.body, 'removeChild');

    render(<ShareButtons character={mockCharacter} resultUrl={mockResultUrl} />);

    fireEvent.click(screen.getByTestId('share-download-button'));

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(screen.getByText('📥 이미지 다운로드를 시작합니다')).toBeInTheDocument();

    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  it('각 버튼에 aria-label이 설정되어 있다', () => {
    render(<ShareButtons character={mockCharacter} resultUrl={mockResultUrl} />);
    expect(screen.getByTestId('share-copy-button')).toHaveAttribute('aria-label', '링크 복사하기');
    expect(screen.getByTestId('share-download-button')).toHaveAttribute('aria-label', '이미지 다운로드');
  });
});

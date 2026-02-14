// SNS 공유 모듈 테스트
import {
  getXShareUrl,
  getLinkedInShareUrl,
  shareToX,
  shareToLinkedIn,
  copyLink,
} from '../share';
import { CharacterProfile } from '../types';

// 테스트용 캐릭터 데이터
const mockCharacter: CharacterProfile = {
  slug: 'gatssn',
  emoji: '👑',
  name: '갓쓴키로형',
  title: '전략 설계자',
  description: '코드 한 줄도 설계 없이는 쓰지 않는 완벽주의 아키텍트',
  axisValues: { A: -1, B: -1, C: -1, D: -1 },
  primaryTag: '설계',
  strengths: ['시스템 전체를 조감도처럼 그릴 수 있다'],
  pitfalls: ['과도한 설계로 실제 구현이 늦어질 수 있다'],
  kiroFeatures: [{ name: 'Specs', description: '요구사항 관리' }],
  aiTips: ['"아키텍처를 분석해줘"'],
  synergy: 'dokkaebi',
  tension: 'chonggak',
};

const testUrl = 'https://kiro-friends.example.com/result/gatssn';

describe('getXShareUrl', () => {
  it('트윗 텍스트에 캐릭터 유형명을 포함해야 한다', () => {
    const url = getXShareUrl(mockCharacter, testUrl);
    expect(url).toContain(encodeURIComponent('갓쓴키로형'));
  });

  it('트윗 텍스트에 한 줄 소개를 포함해야 한다', () => {
    const url = getXShareUrl(mockCharacter, testUrl);
    // URLSearchParams는 공백을 +로 인코딩하므로 디코딩 후 비교
    const decodedUrl = decodeURIComponent(url.replace(/\+/g, ' '));
    expect(decodedUrl).toContain(mockCharacter.description);
  });

  it('결과 URL을 포함해야 한다', () => {
    const url = getXShareUrl(mockCharacter, testUrl);
    expect(url).toContain(encodeURIComponent(testUrl));
  });

  it('해시태그(Kiro프렌즈, 개발자유형테스트, Kiro)를 포함해야 한다', () => {
    const url = getXShareUrl(mockCharacter, testUrl);
    // URLSearchParams는 해시태그를 콤마로 구분
    expect(url).toContain('hashtags=Kiro');
    expect(url).toContain(encodeURIComponent('프렌즈'));
    expect(url).toContain(encodeURIComponent('개발자유형테스트'));
  });

  it('twitter.com/intent/tweet URL 형식이어야 한다', () => {
    const url = getXShareUrl(mockCharacter, testUrl);
    expect(url).toMatch(/^https:\/\/twitter\.com\/intent\/tweet\?/);
  });
});

describe('getLinkedInShareUrl', () => {
  it('결과 URL을 포함해야 한다', () => {
    const url = getLinkedInShareUrl(testUrl);
    expect(url).toContain(encodeURIComponent(testUrl));
  });

  it('LinkedIn 공유 URL 형식이어야 한다', () => {
    const url = getLinkedInShareUrl(testUrl);
    expect(url).toMatch(/^https:\/\/www\.linkedin\.com\/sharing\/share-offsite\/\?/);
  });
});

describe('shareToX', () => {
  const originalOpen = window.open;

  beforeEach(() => {
    window.open = jest.fn();
  });

  afterEach(() => {
    window.open = originalOpen;
  });

  it('window.open을 호출하여 새 창을 열어야 한다', () => {
    shareToX(mockCharacter, testUrl);
    expect(window.open).toHaveBeenCalledTimes(1);
  });

  it('올바른 X 공유 URL로 새 창을 열어야 한다', () => {
    shareToX(mockCharacter, testUrl);
    const expectedUrl = getXShareUrl(mockCharacter, testUrl);
    expect(window.open).toHaveBeenCalledWith(expectedUrl, '_blank', 'noopener,noreferrer');
  });
});

describe('shareToLinkedIn', () => {
  const originalOpen = window.open;

  beforeEach(() => {
    window.open = jest.fn();
  });

  afterEach(() => {
    window.open = originalOpen;
  });

  it('window.open을 호출하여 새 창을 열어야 한다', () => {
    shareToLinkedIn(testUrl);
    expect(window.open).toHaveBeenCalledTimes(1);
  });

  it('올바른 LinkedIn 공유 URL로 새 창을 열어야 한다', () => {
    shareToLinkedIn(testUrl);
    const expectedUrl = getLinkedInShareUrl(testUrl);
    expect(window.open).toHaveBeenCalledWith(expectedUrl, '_blank', 'noopener,noreferrer');
  });
});

describe('copyLink', () => {
  const originalClipboard = navigator.clipboard;

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      writable: true,
      configurable: true,
    });
  });

  it('clipboard API가 지원되면 writeText를 호출해야 한다', async () => {
    const writeTextMock = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });

    const result = await copyLink(testUrl);
    expect(writeTextMock).toHaveBeenCalledWith(testUrl);
    expect(result).toBe(true);
  });

  it('clipboard API 실패 시 execCommand 폴백을 사용해야 한다', async () => {
    const writeTextMock = jest.fn().mockRejectedValue(new Error('Permission denied'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });

    document.execCommand = jest.fn().mockReturnValue(true);

    const result = await copyLink(testUrl);
    expect(document.execCommand).toHaveBeenCalledWith('copy');
    expect(result).toBe(true);
  });

  it('clipboard API가 없으면 execCommand 폴백을 사용해야 한다', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    document.execCommand = jest.fn().mockReturnValue(true);

    const result = await copyLink(testUrl);
    expect(document.execCommand).toHaveBeenCalledWith('copy');
    expect(result).toBe(true);
  });

  it('모든 방법이 실패하면 false를 반환해야 한다', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    document.execCommand = jest.fn().mockImplementation(() => {
      throw new Error('execCommand not supported');
    });

    const result = await copyLink(testUrl);
    expect(result).toBe(false);
  });
});

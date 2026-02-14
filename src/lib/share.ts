// SNS 공유 모듈
// X(Twitter), LinkedIn 공유 및 링크 복사 기능

import { CharacterProfile } from './types';

/**
 * X(Twitter) 공유 URL 생성
 * 캐릭터 유형명, 한 줄 소개, 결과 URL, 해시태그 포함
 */
export function getXShareUrl(character: CharacterProfile, resultUrl: string): string {
  const text = `나의 Kiro 프렌즈 유형은 "${character.name}"!\n${character.description}`;
  const hashtags = 'Kiro프렌즈,개발자유형테스트,Kiro';
  const params = new URLSearchParams({
    text,
    url: resultUrl,
    hashtags,
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/**
 * LinkedIn 공유 URL 생성
 * 결과 URL 포함
 */
export function getLinkedInShareUrl(resultUrl: string): string {
  const params = new URLSearchParams({
    url: resultUrl,
  });
  return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
}

/**
 * X(Twitter)로 공유 - 새 창에서 트윗 작성 창 열기
 */
export function shareToX(character: CharacterProfile, resultUrl: string): void {
  const url = getXShareUrl(character, resultUrl);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * LinkedIn으로 공유 - 새 창에서 공유 창 열기
 */
export function shareToLinkedIn(resultUrl: string): void {
  const url = getLinkedInShareUrl(resultUrl);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * 결과 URL을 클립보드에 복사
 * navigator.clipboard API 우선 사용, 미지원 시 execCommand 폴백
 */
export async function copyLink(resultUrl: string): Promise<boolean> {
  // clipboard API 시도
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(resultUrl);
      return true;
    } catch {
      // clipboard API 실패 시 폴백으로 진행
    }
  }

  // execCommand 폴백
  try {
    const textarea = document.createElement('textarea');
    textarea.value = resultUrl;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}

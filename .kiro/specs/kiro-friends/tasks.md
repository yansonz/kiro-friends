# Implementation Plan: Kiro Friends

## Overview

Next.js 14+ App Router + Static Export 기반 개발자 성향 테스트 웹앱을 구현한다. 캐릭터 데이터 → 퀴즈 엔진 → 페이지 UI → 공유 기능 → OG 이미지 → 빌드/배포 순서로 점진적으로 구현한다.

## Tasks

- [x] 1. 프로젝트 초기 설정
  - [x] 1.1 Next.js 프로젝트 생성 및 기본 설정
    - `npx create-next-app@latest` 으로 프로젝트 생성 (App Router, TypeScript, Tailwind CSS)
    - `next.config.js`에 `output: 'export'` 설정
    - 테스트 프레임워크 설치: `jest`, `@testing-library/react`, `@testing-library/jest-dom`, `fast-check`
    - Jest 설정 파일 생성 (`jest.config.ts`)
    - _Requirements: 11.3_

- [x] 2. 캐릭터 데이터 및 질문 데이터 구현
  - [x] 2.1 캐릭터 데이터 타입 정의 및 데이터 파일 생성
    - `lib/types.ts`: CharacterSlug, AxisScores, AuxiliaryTags, CharacterProfile, KiroFeature 타입 정의
    - `data/characters.ts`: 9개 캐릭터 프로필 데이터 (이모지, 유형명, 한 줄 소개, 4축 값, 보조 태그, 잘하는 점, 함정, 추천 Kiro 기능 3개, AI 협업 팁, 시너지/긴장 캐릭터)
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ]* 2.2 캐릭터 데이터 무결성 property 테스트 작성
    - **Property 7: 캐릭터 데이터 무결성**
    - **Validates: Requirements 12.1, 12.2, 12.3**

  - [x] 2.3 질문 데이터 파일 생성
    - `data/questions.ts`: Question, QuestionOption 타입 정의
    - Q1~Q4: 각 2개 선택지, axisEffect 포함
    - Q5~Q8: 각 4개 선택지, tagEffect 포함
    - _Requirements: 2.1, 3.1_

- [x] 3. 퀴즈 엔진 구현
  - [x] 3.1 4축 점수 산출 함수 구현
    - `lib/quiz-engine.ts`: `calculateAxisScores(answers: number[]): AxisScores`
    - Q1~Q4 응답에서 각 축에 -1 또는 +1 부여
    - _Requirements: 3.1_

  - [ ]* 3.2 4축 점수 산출 property 테스트 작성
    - **Property 1: 4축 점수 산출 정확성**
    - **Validates: Requirements 3.1**

  - [x] 3.3 후보군 결정 함수 구현
    - `determineCandidatePool(scores: AxisScores): CharacterSlug[]`
    - 6개 매핑 테이블 기반 후보군 반환
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [x] 3.4 보조 태그 집계 함수 구현
    - `calculateAuxiliaryTags(answers: number[]): AuxiliaryTags`
    - Q5~Q8 응답에서 태그별 점수 집계
    - _Requirements: 4.1_

  - [ ]* 3.5 보조 태그 집계 property 테스트 작성
    - **Property 3: 보조 태그 집계 정확성**
    - **Validates: Requirements 4.1**

  - [x] 3.6 최종 캐릭터 결정 함수 구현
    - `determineCharacter(candidatePool: CharacterSlug[], tags: AuxiliaryTags): CharacterSlug`
    - 후보군별 결정 규칙 및 동점 시 기본값 처리
    - _Requirements: 4.2, 4.3, 4.4_

  - [x] 3.7 유클리드 폴백 함수 구현
    - `euclideanFallback(scores: AxisScores, tags: AuxiliaryTags): CharacterSlug`
    - 유클리드 거리 계산 및 최근접 캐릭터 선택
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 3.8 메인 엔트리 함수 구현
    - `getResult(answers: number[]): CharacterSlug`
    - 전체 파이프라인: 4축 점수 → 후보군 → 보조 태그 → 최종 결정 (폴백 포함)
    - _Requirements: 3.1, 3.2, 4.1, 4.2, 5.1_

  - [ ]* 3.9 퀴즈 엔진 property 테스트 작성
    - **Property 2: 후보군 결정 일관성**
    - **Property 4: 최종 캐릭터 결정 규칙**
    - **Property 5: 유클리드 폴백 최근접 보장**
    - **Property 6: 전체 퀴즈 결과 유효성**
    - **Validates: Requirements 3.2, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3**

- [x] 4. Checkpoint - 퀴즈 엔진 테스트 확인
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. 공통 UI 컴포넌트 구현
  - [x] 5.1 ProgressBar 컴포넌트 구현
    - `components/ProgressBar.tsx`: 현재 진행 상태 표시 (N/8)
    - _Requirements: 2.3_

  - [ ]* 5.2 ProgressBar property 테스트 작성
    - **Property 10: 퀴즈 진행 상태 표시**
    - **Validates: Requirements 2.3**

  - [x] 5.3 RadarChart 컴포넌트 구현
    - `components/RadarChart.tsx`: Chart.js 기반 4축 레이더 차트
    - _Requirements: 6.2_

  - [x] 5.4 CharacterCard 컴포넌트 구현
    - `components/CharacterCard.tsx`: 캐릭터 정보 카드 (compact 모드 지원)
    - _Requirements: 6.1, 6.3, 6.4, 6.5, 6.6_

  - [x] 5.5 CharacterSlider 컴포넌트 구현
    - `components/CharacterSlider.tsx`: 9개 캐릭터 미리보기 슬라이드
    - _Requirements: 9.3_

  - [x] 5.6 CTASection 컴포넌트 구현
    - `components/CTASection.tsx`: Kiro 다운로드, 사용자모임 링크 등 CTA 영역
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 6. 공유 모듈 구현
  - [x] 6.1 Share 함수 구현
    - `lib/share.ts`: shareToX, shareToLinkedIn, copyLink 함수
    - X: 트윗 텍스트 + 해시태그 + URL 생성
    - LinkedIn: 공유 URL 생성
    - 링크 복사: clipboard API + execCommand 폴백
    - _Requirements: 7.2, 7.3, 7.4_

  - [ ]* 6.2 SNS 공유 파라미터 property 테스트 작성
    - **Property 8: SNS 공유 파라미터 생성**
    - **Validates: Requirements 7.2, 7.3**

  - [x] 6.3 ShareButtons 컴포넌트 구현
    - `components/ShareButtons.tsx`: 3개 공유 버튼 UI
    - _Requirements: 7.1_

- [x] 7. 페이지 구현
  - [x] 7.1 랜딩 페이지 구현
    - `app/page.tsx`: 타이틀, 세계관 소개, 9개 캐릭터 이모지 원형 배치, CTA 버튼, 참여 안내
    - OG 메타태그 설정 (기본)
    - _Requirements: 1.1, 1.2, 1.3, 8.1_

  - [x] 7.2 퀴즈 페이지 구현
    - `app/quiz/page.tsx`: 8문항 순차 표시, 선택지 클릭 → 응답 저장 → 다음 질문
    - ProgressBar 연동, 마지막 질문 응답 시 getResult 호출 → router.push
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 7.3 결과 페이지 구현
    - `app/result/[type]/page.tsx`: generateStaticParams로 9개 슬러그 사전 생성
    - CharacterCard, RadarChart, ShareButtons, CharacterSlider, CTASection 조합
    - "나도 내 유형 알아보기" CTA 버튼
    - 캐릭터별 OG 메타태그 설정
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 7.1, 8.2, 9.1, 9.2, 9.3_

  - [ ]* 7.4 OG 메타태그 property 테스트 작성
    - **Property 9: OG 메타태그 캐릭터별 설정**
    - **Validates: Requirements 8.2**

- [x] 8. Checkpoint - 페이지 렌더링 확인
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. OG 이미지 빌드 스크립트
  - [x] 9.1 OG 이미지 생성 스크립트 구현
    - `scripts/generate-og.ts`: Satori 또는 node-canvas 기반
    - 9개 캐릭터 + 1개 기본 이미지 = 10개 PNG (1200x630px)
    - 캐릭터 이모지, 유형명, 한 줄 소개 포함
    - `out/og/` 디렉토리에 출력
    - _Requirements: 8.3, 8.4, 11.2_

- [x] 10. 반응형 디자인 및 모바일 최적화
  - [x] 10.1 전체 페이지 반응형 스타일링
    - Tailwind CSS 반응형 클래스 적용 (sm, md, lg 브레이크포인트)
    - 모바일 터치 친화적 선택지 크기 (최소 44x44px 터치 타겟)
    - _Requirements: 14.1, 14.2_

- [x] 11. 빌드 및 배포 설정
  - [x] 11.1 빌드 파이프라인 설정
    - `package.json` 빌드 스크립트: `next build` + OG 이미지 생성
    - 빌드 결과물 확인: 11개 HTML + 10개 OG 이미지
    - _Requirements: 11.1, 11.2, 11.3_

- [x] 12. Final Checkpoint - 전체 빌드 및 테스트 확인
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- 카카오 SDK 앱 키는 환경 변수로 관리 (빌드 타임에 주입)
- 캐릭터 이미지 에셋은 이모지 기반으로 구현하여 별도 디자인 파일 불필요
- Property 테스트는 fast-check 라이브러리 사용, 최소 100회 반복

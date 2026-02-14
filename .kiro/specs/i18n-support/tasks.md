# Implementation Plan: i18n-support

## Overview

이 구현 계획은 Kiro 프렌즈 퀴즈 애플리케이션에 다국어 지원(한국어, 영어, 일본어)을 추가하는 작업을 단계별로 정의합니다. React Context API를 활용한 클라이언트 사이드 국제화를 구현하며, 정적 사이트 생성(SSG)과 호환되도록 합니다.

## Tasks

- [ ] 1. i18n 기반 구조 설정
  - [x] 1.1 타입 정의 및 유틸리티 함수 생성
    - src/lib/i18n/types.ts 생성: Locale 타입, TranslationKeys 인터페이스 정의
    - src/lib/i18n/index.ts 생성: t() 함수, getOgImagePath() 함수, detectBrowserLocale() 함수 구현
    - _Requirements: 7.1, 7.3, 7.5, 6.3, 6.4, 5.1_
  
  - [x] 1.2 타입 정의 및 유틸리티 함수 속성 테스트
    - **Property 13: 누락된 번역 키 처리**
    - **Validates: Requirements 7.4, 7.5**
  
  - [x] 1.3 브라우저 언어 감지 속성 테스트
    - **Property 10: 브라우저 언어 감지**
    - **Validates: Requirements 6.3**

- [ ] 2. 번역 데이터 파일 생성
  - [x] 2.1 한국어 번역 파일 생성
    - src/lib/i18n/locales/ko.json 생성
    - 홈, 퀴즈, 결과 페이지의 모든 UI 텍스트 번역 키 정의
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [x] 2.2 영어 번역 파일 생성
    - src/lib/i18n/locales/en.json 생성
    - ko.json과 동일한 키 구조로 영어 번역 작성
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [x] 2.3 일본어 번역 파일 생성
    - src/lib/i18n/locales/ja.json 생성
    - ko.json과 동일한 키 구조로 일본어 번역 작성
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [x] 2.4 번역 파일 JSON 유효성 속성 테스트
    - **Property 11: 번역 데이터 JSON 유효성**
    - **Validates: Requirements 7.1**
  
  - [x] 2.5 번역 키 계층 구조 속성 테스트
    - **Property 12: 번역 키 계층 구조**
    - **Validates: Requirements 7.3**

- [ ] 3. I18nContext 및 Provider 구현
  - [x] 3.1 I18nContext 생성
    - src/contexts/I18nContext.tsx 생성
    - I18nContextValue 인터페이스 정의
    - I18nProvider 컴포넌트 구현: 언어 상태 관리, 번역 데이터 로딩, 로컬 스토리지 연동
    - _Requirements: 1.2, 1.5, 6.1, 6.2, 6.3, 6.4, 12.1, 12.2, 12.3, 12.4_
  
  - [x] 3.2 useTranslation 훅 생성
    - src/lib/hooks/useTranslation.ts 생성
    - Context 접근 및 에러 처리 구현
    - _Requirements: 1.5_
  
  - [x] 3.3 App Router에 I18nProvider 적용
    - src/app/layout.tsx 수정: I18nProvider로 children 래핑
    - _Requirements: 1.5_
  
  - [x] 3.4 언어 순환 일관성 속성 테스트
    - **Property 1: 언어 순환 일관성**
    - **Validates: Requirements 1.2**
  
  - [x] 3.5 번역 키 조회 일관성 속성 테스트
    - **Property 3: 번역 키 조회 일관성**
    - **Validates: Requirements 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 4.11, 4.12**
  
  - [x] 3.6 로컬 스토리지 영속성 속성 테스트
    - **Property 9: 로컬 스토리지 영속성**
    - **Validates: Requirements 6.1, 6.2**
  
  - [x] 3.7 선택적 언어 데이터 로딩 속성 테스트
    - **Property 19: 선택적 언어 데이터 로딩**
    - **Validates: Requirements 12.1**
  
  - [x] 3.8 SPA 동작 유지 속성 테스트
    - **Property 21: SPA 동작 유지**
    - **Validates: Requirements 12.3**

- [x] 4. Checkpoint - 기본 i18n 시스템 검증
  - 모든 테스트가 통과하는지 확인
  - 사용자에게 질문이 있으면 문의

- [ ] 5. LanguageSwitcher 컴포넌트 구현
  - [x] 5.1 LanguageSwitcher 컴포넌트 생성
    - src/components/LanguageSwitcher.tsx 생성
    - 언어 전환 버튼 UI 구현 (음악 버튼 아래 위치, 44px 최소 높이)
    - 클릭 시 언어 순환 로직 구현
    - 접근성 속성 추가 (aria-label, 키보드 접근성)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 11.1, 11.2, 11.4_
  
  - [x] 5.2 MusicPlayer 컴포넌트에 LanguageSwitcher 통합
    - src/components/MusicPlayer.tsx 수정: LanguageSwitcher 컴포넌트 추가
    - 음악 토글 버튼 아래에 배치
    - _Requirements: 1.1_
  
  - [x] 5.3 LanguageSwitcher 단위 테스트
    - 버튼 렌더링 테스트
    - 클릭 이벤트 처리 테스트
    - 접근성 속성 존재 확인
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 11.1, 11.2_
  
  - [x] 5.4 언어 레이블 표시 속성 테스트
    - **Property 2: 언어 레이블 표시**
    - **Validates: Requirements 1.3**

- [x] 6. 캐릭터 데이터 다국어화
  - [x] 6.1 CharacterProfile 타입 수정
    - src/lib/types.ts 수정: 텍스트 필드를 Record<Locale, string> 형식으로 변경
    - _Requirements: 8.1_
  
  - [x] 6.2 캐릭터 데이터 다국어 번역 작성
    - src/data/characters.ts 수정: 10개 캐릭터의 모든 텍스트 필드를 3개 언어로 작성
    - 이모지와 슬러그는 언어 무관하게 유지
    - _Requirements: 8.2, 8.3, 8.4_
  
  - [x] 6.3 CharacterCard 컴포넌트 수정
    - src/components/CharacterCard.tsx 수정: useTranslation 훅 사용하여 현재 언어에 맞는 필드 표시
    - 섹션 제목들(잘하는 점, 빠지기 쉬운 함정, 추천 Kiro 기능, AI 협업 팁, 시너지, 긴장)을 번역 키로 교체
    - 토스트 메시지를 번역 키로 교체
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.12_
  
  - [x] 6.4 캐릭터 데이터 다국어 지원 속성 테스트
    - **Property 5: 캐릭터 데이터 다국어 지원**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8**
  
  - [x] 6.5 캐릭터 데이터 완전성 속성 테스트
    - **Property 14: 캐릭터 데이터 완전성**
    - **Validates: Requirements 8.2**
  
  - [x] 6.6 캐릭터 불변 필드 유지 속성 테스트
    - **Property 15: 캐릭터 불변 필드 유지**
    - **Validates: Requirements 8.3, 8.4**

- [ ] 7. 질문 데이터 다국어화
  - [x] 7.1 Question 타입 수정
    - src/data/questions.ts 수정: text와 options.text를 Record<Locale, string> 형식으로 변경
    - _Requirements: 9.1_
  
  - [x] 7.2 질문 데이터 다국어 번역 작성
    - src/data/questions.ts 수정: 16개 질문과 모든 선택지를 3개 언어로 작성
    - axisEffect와 tagEffect는 언어 무관하게 유지
    - _Requirements: 9.2, 9.3, 9.4_
  
  - [x] 7.3 QuizPage 컴포넌트 수정
    - src/app/quiz/page.tsx 수정: useTranslation 훅 사용하여 현재 언어에 맞는 질문 표시
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 7.4 질문 데이터 다국어 지원 속성 테스트
    - **Property 4: 질문 데이터 다국어 지원**
    - **Validates: Requirements 3.1, 3.2, 3.3**
  
  - [x] 7.5 질문 데이터 완전성 속성 테스트
    - **Property 16: 질문 데이터 완전성**
    - **Validates: Requirements 9.2, 9.3**
  
  - [x] 7.6 질문 효과 불변성 속성 테스트
    - **Property 17: 질문 효과 불변성**
    - **Validates: Requirements 9.4**

- [x] 8. Checkpoint - 데이터 다국어화 검증
  - 모든 테스트가 통과하는지 확인
  - 사용자에게 질문이 있으면 문의

- [ ] 9. 홈 페이지 다국어 지원
  - [x] 9.1 HomePage 컴포넌트 수정
    - src/app/page.tsx 수정: useTranslation 훅 사용하여 모든 텍스트를 번역 키로 교체
    - 타이틀, 설명, CTA 버튼, 참여 안내 텍스트 다국어화
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 9.2 시작 오버레이 다국어 지원
    - src/components/MusicPlayer.tsx 수정: 오버레이 텍스트를 번역 키로 교체
    - _Requirements: 2.5_
  
  - [x] 9.3 홈 페이지 통합 테스트
    - 언어 전환 시 모든 텍스트가 업데이트되는지 확인
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 10. 결과 페이지 다국어 지원
  - [x] 10.1 ResultPage 컴포넌트 수정
    - src/app/result/[type]/page.tsx 수정: 섹션 제목, 버튼 텍스트를 번역 키로 교체
    - _Requirements: 4.8, 4.9, 4.10_
  
  - [x] 10.2 공유 버튼 다국어 지원
    - src/components/ShareButtons.tsx 수정: 버튼 텍스트를 번역 키로 교체
    - _Requirements: 4.9_
  
  - [x] 10.3 CTA 섹션 다국어 지원
    - src/components/CTASection.tsx 수정: CTA 텍스트를 번역 키로 교체
    - _Requirements: 4.10_
  
  - [x] 10.4 결과 페이지 통합 테스트
    - 언어 전환 시 모든 캐릭터 정보와 UI 텍스트가 업데이트되는지 확인
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 4.11, 4.12_

- [ ] 11. OG 이미지 다국어 지원
  - [x] 11.1 OG 이미지 생성 스크립트 수정
    - scripts/generate-og.ts 수정: 각 캐릭터당 3개 언어 이미지 생성 (slug-ko.png, slug-en.png, slug-ja.png)
    - 언어별 텍스트 렌더링 (캐릭터 이름, 타이틀, 설명)
    - _Requirements: 5.2_
  
  - [x] 11.2 OG 이미지 생성 실행
    - npm run generate-og 실행하여 30개 이미지 생성 (10 캐릭터 × 3 언어)
    - public/og/ 디렉토리에 저장
    - _Requirements: 5.2_
  
  - [x] 11.3 ResultPage 메타데이터 수정
    - src/app/result/[type]/page.tsx의 generateMetadata 함수 수정
    - 현재 언어에 맞는 OG 이미지 경로 사용
    - _Requirements: 5.1, 5.3_
  
  - [x] 11.4 OG 이미지 경로 생성 속성 테스트
    - **Property 6: OG 이미지 경로 생성**
    - **Validates: Requirements 5.1**
  
  - [x] 11.5 OG 이미지 파일 존재 속성 테스트
    - **Property 7: OG 이미지 파일 존재**
    - **Validates: Requirements 5.2**

- [ ] 12. SEO 메타데이터 다국어 지원
  - [x] 12.1 RootLayout 메타데이터 수정
    - src/app/layout.tsx 수정: 동적 메타데이터 생성 함수 추가
    - HTML lang 속성을 현재 언어로 설정
    - _Requirements: 10.1, 10.2, 10.5_
  
  - [x] 12.2 각 페이지 메타데이터 수정
    - 홈, 퀴즈, 결과 페이지의 메타데이터를 현재 언어에 맞게 동적 생성
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [x] 12.3 메타태그 업데이트 속성 테스트
    - **Property 8: 메타태그 업데이트**
    - **Validates: Requirements 5.3, 10.1, 10.2, 10.3, 10.4, 10.5**

- [ ] 13. 접근성 개선
  - [x] 13.1 ARIA live region 추가
    - I18nProvider에 언어 변경 알림을 위한 ARIA live region 추가
    - _Requirements: 11.3_
  
  - [x] 13.2 접근성 속성 검증
    - LanguageSwitcher의 aria-label, 키보드 접근성, 색상 대비 확인
    - _Requirements: 11.1, 11.2, 11.4_
  
  - [x] 13.3 스크린 리더 알림 속성 테스트
    - **Property 18: 스크린 리더 알림**
    - **Validates: Requirements 11.3**

- [ ] 14. 성능 최적화
  - [x] 14.1 번역 데이터 캐싱 구현
    - I18nProvider에서 로드된 번역 데이터를 메모리에 캐싱
    - _Requirements: 12.2_
  
  - [x] 14.2 로딩 상태 처리
    - 번역 데이터 로딩 중 기본 텍스트 표시 로직 구현
    - _Requirements: 12.4_
  
  - [x] 14.3 번역 데이터 캐싱 속성 테스트
    - **Property 20: 번역 데이터 캐싱**
    - **Validates: Requirements 12.2**
  
  - [x] 14.4 로딩 상태 처리 속성 테스트
    - **Property 22: 로딩 상태 처리**
    - **Validates: Requirements 12.4**

- [ ] 15. 에러 처리 구현
  - [x] 15.1 번역 키 누락 처리
    - t() 함수에 개발 모드 경고 추가
    - 프로덕션에서 키 이름 폴백
    - _Requirements: 7.4, 7.5_
  
  - [x] 15.2 언어 파일 로드 실패 처리
    - loadTranslations 함수에 에러 핸들링 추가
    - 한국어로 폴백 로직 구현
    - _Requirements: 6.4_
  
  - [x] 15.3 로컬 스토리지 접근 불가 처리
    - saveLocale/loadLocale 함수에 try-catch 추가
    - _Requirements: 6.1, 6.2_
  
  - [x] 15.4 에러 처리 단위 테스트
    - 각 에러 시나리오에 대한 폴백 동작 검증
    - _Requirements: 6.4, 7.4, 7.5_

- [x] 16. Final Checkpoint - 전체 기능 검증
  - 모든 테스트가 통과하는지 확인
  - 3개 언어 모두에서 전체 플로우 테스트
  - 사용자에게 질문이 있으면 문의

- [ ] 17. 빌드 및 배포 준비
  - [x] 17.1 정적 빌드 테스트
    - npm run build 실행하여 정적 사이트 생성
    - out/ 디렉토리에 모든 페이지와 OG 이미지 확인
    - _Requirements: 5.2_
  
  - [x] 17.2 빌드 스크립트 업데이트
    - package.json의 build 스크립트가 OG 이미지 생성을 포함하는지 확인
    - _Requirements: 5.2_
  
  - [x] 17.3 빌드 산출물 검증 테스트
    - 모든 언어별 OG 이미지가 생성되었는지 확인
    - 번역 파일이 번들에 포함되었는지 확인
    - _Requirements: 5.2, 7.1, 7.2_

## Notes

- `*` 표시된 태스크는 선택적 테스트 태스크로, 빠른 MVP를 위해 건너뛸 수 있습니다
- 각 태스크는 구체적인 요구사항 번호를 참조하여 추적 가능성을 보장합니다
- Checkpoint 태스크는 단계별 검증을 통해 점진적 개발을 지원합니다
- 속성 테스트는 fast-check 라이브러리를 사용하며 최소 100회 반복 실행됩니다
- 단위 테스트와 속성 테스트는 상호 보완적이며, 함께 사용하여 포괄적인 커버리지를 달성합니다

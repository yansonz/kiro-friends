# Implementation Plan: 16문항 퀴즈 시스템 재설계

## Overview

8문항 퀴즈 시스템을 16문항으로 확장하여 개발자 성향 측정의 정확도를 높이고, 보조 태그가 최종 캐릭터 결정에 실질적으로 영향을 미치도록 개선합니다. 구현은 타입 정의 → 데이터 → 로직 → 테스트 → UI 순서로 진행하며, 각 단계마다 검증을 수행합니다.

## Tasks

- [x] 1. 타입 정의 업데이트
  - src/lib/types.ts의 AxisScores와 AuxiliaryTags 타입 주석 업데이트
  - AxisScores: 각 축 값 범위를 -2~+2로 명시
  - AuxiliaryTags: 각 태그 값 범위를 0~2로 명시
  - _Requirements: 10.3, 10.4_

- [x] 2. 질문 데이터 확장 (Q1-Q8: 4축 측정)
  - [x] 2.1 src/data/questions.ts의 QuestionOption과 Question 인터페이스 검토
    - 기존 인터페이스가 2지선다와 4지선다를 모두 지원하는지 확인
    - _Requirements: 10.1, 10.2_
  
  - [x] 2.2 Q1-Q8 질문 작성 (4축 성향 측정, 각 2지선다)
    - Q1: A축 측정 (안정↔실험), axisEffect: {axis: 'A', value: -1 or 1}
    - Q2: B축 측정 (구조↔즉흥), axisEffect: {axis: 'B', value: -1 or 1}
    - Q3: C축 측정 (개인↔협업), axisEffect: {axis: 'C', value: -1 or 1}
    - Q4: D축 측정 (품질↔속도), axisEffect: {axis: 'D', value: -1 or 1}
    - Q5: A축 측정 (안정↔실험), axisEffect: {axis: 'A', value: -1 or 1}
    - Q6: B축 측정 (구조↔즉흥), axisEffect: {axis: 'B', value: -1 or 1}
    - Q7: C축 측정 (개인↔협업), axisEffect: {axis: 'C', value: -1 or 1}
    - Q8: D축 측정 (품질↔속도), axisEffect: {axis: 'D', value: -1 or 1}
    - 기존 Q1-Q4 질문 내용 재사용 가능, Q5-Q8은 새로운 질문 작성
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 3. 질문 데이터 확장 (Q9-Q16: 보조 태그 측정)
  - [x] 3.1 Q9-Q16 질문 작성 (보조 태그 측정, 각 4지선다)
    - 8개 태그: 설계, UX, 부채청산, 몰입, 자동화, 연결, 테스트, 거버넌스
    - 각 태그가 Q9-Q16 전체에서 정확히 2번씩 등장하도록 배치
    - 각 옵션에 tagEffect 속성 추가
    - 기존 Q5-Q8 질문 내용을 참고하여 새로운 질문 작성
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 3.2 questions 배열 검증
    - 배열 길이가 정확히 16인지 확인
    - ID가 1-16까지 순차적인지 확인
    - Q1-Q8은 2개 옵션, Q9-Q16은 4개 옵션인지 확인
    - 각 태그가 정확히 2번씩 등장하는지 확인
    - _Requirements: 10.5, 2.4_

- [x] 4. 4축 점수 계산 로직 개선
  - [x] 4.1 calculateAxisScores 함수 수정
    - 입력: 16-element answer array
    - Q1-Q8 (indices 0-7)만 사용하도록 수정
    - 각 축 점수 계산: A = Q1 + Q5, B = Q2 + Q6, C = Q3 + Q7, D = Q4 + Q8
    - 각 축 점수 범위: -2 ~ +2
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [x] 4.2 Property test: Axis scores bounded
    - **Property 1: Axis scores are bounded**
    - **Validates: Requirements 1.7, 3.6**
  
  - [x] 4.3 Property test: Axis calculation isolation
    - **Property 2: Axis calculation uses only Q1-Q8**
    - **Validates: Requirements 3.1**
  
  - [x] 4.4 Property test: Axis score calculation correctness
    - **Property 3: Each axis sums its two questions**
    - **Validates: Requirements 3.2, 3.3, 3.4, 3.5**

- [x] 5. 보조 태그 집계 로직 개선
  - [x] 5.1 calculateAuxiliaryTags 함수 수정
    - 입력: 16-element answer array
    - Q9-Q16 (indices 8-15)만 사용하도록 수정
    - 각 선택지의 tagEffect로 해당 태그 점수 +1
    - 각 태그 점수 범위: 0 ~ 2
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [x] 5.2 Property test: Tag scores bounded
    - **Property 4: Tag scores are bounded**
    - **Validates: Requirements 2.5, 4.3**
  
  - [x] 5.3 Property test: Tag calculation isolation
    - **Property 5: Tag calculation uses only Q9-Q16**
    - **Validates: Requirements 4.1**
  
  - [x] 5.4 Property test: Tag scores sum invariant
    - **Property 6: Tag scores sum to 8**
    - **Validates: Requirements 4.4**

- [x] 6. Checkpoint - 점수 계산 로직 검증
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. 후보군 결정 로직 개선
  - [x] 7.1 determineCandidatePool 함수 수정
    - 각 축 점수를 sign으로 변환: <0 → -1, =0 → 0, >0 → +1
    - 4-tuple key 생성: "signA,signB,signC,signD"
    - 매핑 테이블 조회하여 후보군 반환 (1-3개 캐릭터)
    - 매핑 없으면 빈 배열 반환
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_
  
  - [x] 7.2 매핑 테이블 재설계
    - 최소 10개 distinct 4-tuple key 정의
    - 최소 3개 multi-candidate 매핑 (2-3개 캐릭터)
    - 모든 10개 캐릭터가 최소 1번씩 등장
    - 0 값 포함 조합도 적절히 매핑
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [x] 7.3 Property test: Sign conversion correctness
    - **Property 7: Sign conversion is correct**
    - **Validates: Requirements 5.1**
  
  - [x] 7.4 Property test: Mapping key format
    - **Property 8: Mapping table key format**
    - **Validates: Requirements 5.5**
  
  - [x] 7.5 Property test: Candidate pool size validity
    - **Property 9: Candidate pool size is valid**
    - **Validates: Requirements 5.6**
  
  - [x] 7.6 Unit test: Mapping table structure validation
    - 매핑 테이블이 최소 10개 키를 가지는지 확인
    - 최소 3개 multi-candidate 매핑이 있는지 확인
    - 모든 10개 캐릭터가 등장하는지 확인
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 8. 최종 캐릭터 결정 로직 개선
  - [x] 8.1 determineCharacter 함수 수정
    - 후보군 크기가 1이면 해당 캐릭터 반환
    - 후보군 크기가 2 이상이면 각 캐릭터의 primaryTag 점수 비교
    - 가장 높은 primaryTag 점수를 가진 캐릭터 선택
    - 동점이면 첫 번째 캐릭터 반환
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [x] 8.2 Property test: Multi-candidate primaryTag selection
    - **Property 10: Multi-candidate selection uses primaryTag**
    - **Validates: Requirements 6.2, 6.3**
  
  - [x] 8.3 Unit test: Single-candidate pool handling
    - 후보군이 1개일 때 해당 캐릭터 반환 확인
    - _Requirements: 6.1_
  
  - [x] 8.4 Unit test: Tie-breaking in multi-candidate selection
    - 동점일 때 첫 번째 캐릭터 반환 확인
    - _Requirements: 6.4_

- [x] 9. Euclidean fallback 로직 검토
  - [x] 9.1 euclideanFallback 함수 검토 및 필요시 수정
    - 16문항 시스템에서도 동작하는지 확인
    - 0 값 처리가 올바른지 확인
    - _Requirements: 5.7_
  
  - [x] 9.2 Unit test: Empty candidate pool fallback
    - 빈 후보군일 때 euclideanFallback 호출 확인
    - _Requirements: 5.7_

- [x] 10. Checkpoint - 로직 통합 검증
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. UI 컴포넌트 업데이트
  - [x] 11.1 Quiz Page 업데이트 (src/app/quiz/page.tsx)
    - 질문 카운터를 1-16으로 변경
    - answer 배열 크기를 16으로 변경
    - 진행률 계산을 16 기준으로 변경
    - _Requirements: 8.1, 8.2_
  
  - [x] 11.2 Progress Bar 업데이트 (src/components/ProgressBar.tsx)
    - 전체 질문 수를 16으로 변경
    - 진행률 계산 공식: (currentQuestion / 16) * 100
    - _Requirements: 8.2, 8.3_
  
  - [x] 11.3 Property test: Progress calculation formula
    - **Property 11: Progress calculation formula**
    - **Validates: Requirements 8.2, 8.3**
  
  - [x] 11.4 Property test: Progress update behavior
    - **Property 12: Progress updates after each answer**
    - **Validates: Requirements 8.4**
  
  - [x] 11.5 Unit test: UI rendering with 16 questions
    - 퀴즈 페이지가 1-16 질문 번호를 표시하는지 확인
    - _Requirements: 8.1_

- [x] 12. 기존 테스트 업데이트
  - [x] 12.1 src/lib/__tests__/quiz-engine.test.ts 업데이트
    - 모든 테스트의 answer 배열을 16-element로 변경
    - 축 점수 범위를 -2~+2로 변경
    - 태그 점수 범위를 0~2로 변경
    - 새로운 매핑 테이블 기준으로 테스트 케이스 수정
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [x] 12.2 Property-based test 설정
    - fast-check 라이브러리 설정 확인
    - 각 property test가 최소 100회 반복 실행되도록 설정
    - 각 테스트에 Feature와 Property 번호 태그 추가
    - _Requirements: 9.1, 9.2, 9.3_

- [x] 13. 통합 테스트
  - [x] 13.1 End-to-end flow test
    - 16문항 완료 → 점수 계산 → 후보군 결정 → 최종 캐릭터 선택
    - 다양한 응답 패턴으로 모든 10개 캐릭터가 결과로 나올 수 있는지 확인
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1_
  
  - [x] 13.2 UI integration test
    - 퀴즈 페이지에서 16문항 순차 진행
    - 진행률이 0%에서 100%까지 올바르게 업데이트
    - 결과 페이지에 올바른 캐릭터 표시
    - _Requirements: 8.1, 8.2, 8.4_

- [x] 14. Final checkpoint - 전체 시스템 검증
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- 각 task는 특정 requirements를 참조하여 추적 가능성 확보
- Checkpoint tasks는 점진적 검증을 위해 배치
- Property tests는 각 correctness property마다 하나씩 작성
- Unit tests는 특정 예제와 엣지 케이스 검증
- 질문 내용 작성 시 개발자 성향 측정 맥락 유지
- 기존 8문항 데이터와의 호환성은 고려하지 않음 (완전 교체)

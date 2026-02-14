# Requirements Document

## Introduction

Kiro Friends 프로젝트에 10번째 캐릭터 "달걀귀신(dalgyal)"을 추가하고, 기존 9캐릭터 체계에서 10캐릭터 체계로 전체 유형 분류 시스템을 재설계한다. 현재 3명의 캐릭터(갓쓴키로, 처녀귀신, 저승사자)가 동일한 4축 값(-1,-1,-1,-1)을 공유하여 보조 태그에 과도하게 의존하는 문제를 해결하고, 달걀귀신의 캐릭터 컨셉(미니멀리스트/추상화 장인)을 정의하며, 시너지/긴장 관계를 10캐릭터 체계로 재설계한다.

## Glossary

- **Dalgyal_Character**: 달걀귀신 캐릭터. slug는 `dalgyal`, 이모지는 🥚. 한국 전통 설화에서 얼굴이 없는(달걀처럼 밋밋한) 귀신으로, 개발자 유형으로는 "미니멀리스트" 또는 "추상화 장인" 컨셉이다.
- **Axis_Mapping_Table**: 4축 부호 조합을 캐릭터 후보군(Candidate_Pool)에 매핑하는 테이블이다. 기존 6개 조합에서 10캐릭터 체계에 맞게 재설계된다.
- **Synergy_Tension_Map**: 10개 캐릭터 간의 시너지(상호 보완) 및 긴장(상충) 관계를 정의하는 매핑이다.
- **Quiz_Engine**: 클라이언트 사이드에서 동작하는 점수 산출 및 캐릭터 매칭 로직이다.
- **Character_Profile**: 10개 캐릭터 각각의 성향 축 값, 보조 태그, 설명, 추천 Kiro 기능 등 데이터 집합이다.
- **Candidate_Pool**: 4축 조합으로 결정되는 1차 캐릭터 후보군이다.
- **Euclidean_Fallback**: 4축 조합이 정확히 매칭되지 않을 때 유클리드 거리 기반으로 가장 가까운 캐릭터를 찾는 폴백 로직이다.
- **CharacterSlug**: 캐릭터를 식별하는 URL 슬러그 타입이다. 기존 9개에 'dalgyal'이 추가되어 10개가 된다.
- **OG_Image**: SNS 공유 시 미리보기에 표시되는 1200x630px 이미지이다.

## Requirements

### Requirement 1: 달걀귀신 캐릭터 프로필 정의

**User Story:** 개발자로서, 달걀귀신 캐릭터의 완전한 프로필 데이터를 정의하여 기존 9개 캐릭터와 동일한 구조로 관리하고 싶다.

#### Acceptance Criteria

1. THE Dalgyal_Character SHALL slug `dalgyal`, 이모지 🥚, 유형명, 부제, 한 줄 소개를 포함한다
2. THE Dalgyal_Character SHALL 4축 값(A, B, C, D)을 가지며, 기존 9개 캐릭터와 중복되지 않는 4축 조합을 사용한다
3. THE Dalgyal_Character SHALL 핵심 보조 태그, 잘하는 점(3개), 빠지기 쉬운 함정(3개)을 포함한다
4. THE Dalgyal_Character SHALL 추천 Kiro 기능(3개), AI 협업 팁(3개)을 포함한다
5. THE Dalgyal_Character SHALL 시너지 캐릭터 1명과 긴장 캐릭터 1명을 지정한다
6. THE Character_Profile SHALL 기존 9개 캐릭터와 동일한 데이터 구조(CharacterProfile 인터페이스)를 준수한다

### Requirement 2: 4축 매핑 테이블 재설계

**User Story:** 시스템으로서, 10개 캐릭터를 4축 조합에 균형 있게 배치하여 보조 태그 의존도를 줄이고 싶다.

#### Acceptance Criteria

1. THE Axis_Mapping_Table SHALL 기존 3명 중복 문제(갓쓴키로, 처녀귀신, 저승사자가 동일한 (-1,-1,-1,-1))를 해소하도록 일부 캐릭터의 4축 값을 변경한다
2. THE Axis_Mapping_Table SHALL 각 4축 조합에 최대 2명까지만 배치하여 보조 태그 분별력을 확보한다
3. THE Axis_Mapping_Table SHALL 달걀귀신을 포함한 10개 캐릭터 전체를 커버한다
4. WHEN 4축 조합이 변경된 캐릭터가 있으면, THE Character_Profile SHALL 해당 캐릭터의 axisValues를 업데이트한다
5. THE Axis_Mapping_Table SHALL 16가지 가능한 4축 조합 중 사용되는 조합 수를 기존 6개에서 확대하여 분류 정밀도를 높인다

### Requirement 3: 퀴즈 엔진 업데이트

**User Story:** 시스템으로서, 10캐릭터 체계에 맞게 퀴즈 엔진의 매핑 테이블과 후보군 결정 로직을 업데이트하고 싶다.

#### Acceptance Criteria

1. WHEN Quiz_Engine의 determineCandidatePool 함수가 호출되면, THE Quiz_Engine SHALL 재설계된 Axis_Mapping_Table을 사용하여 후보군을 결정한다
2. WHEN Candidate_Pool에 2명이 포함되면, THE Quiz_Engine SHALL 해당 2명의 핵심 보조 태그를 비교하여 최종 캐릭터를 결정한다
3. WHEN Candidate_Pool에 1명만 포함되면, THE Quiz_Engine SHALL 해당 캐릭터를 즉시 반환한다
4. THE Quiz_Engine의 euclideanFallback 함수 SHALL 달걀귀신을 포함한 10개 캐릭터 프로필을 대상으로 유클리드 거리를 계산한다
5. THE Quiz_Engine의 getResult 함수 SHALL 유효한 8문항 응답에 대해 항상 10개 CharacterSlug 중 하나를 반환한다

### Requirement 4: 시너지/긴장 관계 재설계

**User Story:** 사용자로서, 10개 캐릭터 간의 시너지와 긴장 관계를 통해 팀 다이내믹을 이해하고 싶다.

#### Acceptance Criteria

1. THE Synergy_Tension_Map SHALL 10개 캐릭터 각각에 대해 시너지 캐릭터 1명과 긴장 캐릭터 1명을 지정한다
2. THE Synergy_Tension_Map SHALL 달걀귀신의 시너지/긴장 관계를 캐릭터 컨셉에 맞게 설정한다
3. WHEN 기존 캐릭터의 4축 값이 변경되면, THE Synergy_Tension_Map SHALL 변경된 성향에 맞게 시너지/긴장 관계를 재검토한다

### Requirement 5: 타입 시스템 업데이트

**User Story:** 개발자로서, CharacterSlug 타입에 'dalgyal'을 추가하여 타입 안전성을 유지하고 싶다.

#### Acceptance Criteria

1. THE CharacterSlug 타입 SHALL 'dalgyal'을 포함하여 총 10개의 유니온 멤버를 가진다
2. WHEN CharacterSlug 타입이 변경되면, THE 타입_시스템 SHALL 모든 관련 코드에서 컴파일 에러 없이 동작한다

### Requirement 6: UI 업데이트 (10캐릭터 배치)

**User Story:** 사용자로서, 랜딩 페이지와 결과 페이지에서 달걀귀신을 포함한 10개 캐릭터를 확인하고 싶다.

#### Acceptance Criteria

1. THE Landing_Page SHALL 10개 캐릭터 이모지를 원형으로 배치한다
2. THE Result_Page의 캐릭터 슬라이더 SHALL 10개 캐릭터를 모두 표시한다
3. WHEN 사용자가 `/result/dalgyal` 경로에 접속하면, THE Result_Page SHALL 달걀귀신의 결과 정보를 정상적으로 표시한다
4. THE Result_Page의 generateStaticParams SHALL 'dalgyal'을 포함한 10개 슬러그를 반환한다

### Requirement 7: OG 이미지 생성

**User Story:** 시스템으로서, 달걀귀신의 OG 이미지를 빌드 타임에 생성하여 SNS 공유 미리보기를 지원하고 싶다.

#### Acceptance Criteria

1. WHEN 빌드 스크립트가 실행되면, THE 빌드_시스템 SHALL 달걀귀신용 OG 이미지(`out/og/dalgyal.png`)를 1200x630px 크기로 생성한다
2. THE OG_Image SHALL 달걀귀신의 이모지(🥚), 유형명, 한 줄 소개를 포함한다
3. THE 빌드_시스템 SHALL 기존 9개 + 달걀귀신 1개 = 총 10개 캐릭터 OG 이미지와 기본 OG 이미지 1개를 생성한다

### Requirement 8: 테스트 업데이트

**User Story:** 개발자로서, 10캐릭터 체계에 맞게 모든 테스트를 업데이트하여 코드 정확성을 보장하고 싶다.

#### Acceptance Criteria

1. THE 테스트_코드 SHALL 달걀귀신을 포함한 10개 캐릭터에 대해 캐릭터 데이터 무결성을 검증한다
2. THE 테스트_코드 SHALL 재설계된 Axis_Mapping_Table에 대해 모든 매핑 조합의 정확성을 검증한다
3. THE 테스트_코드 SHALL getResult 함수가 유효한 8문항 응답에 대해 항상 10개 CharacterSlug 중 하나를 반환하는지 검증한다
4. THE 테스트_코드 SHALL 기존 테스트에서 9개 캐릭터 기준으로 하드코딩된 값을 10개 캐릭터 기준으로 업데이트한다

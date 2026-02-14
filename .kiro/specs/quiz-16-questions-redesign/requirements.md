# Requirements Document

## Introduction

현재 8문항 퀴즈 시스템을 16문항으로 확장하여 개발자 성향 측정의 정확도를 높이고, 특정 캐릭터로의 편향을 제거하며, 보조 태그가 최종 캐릭터 결정에 실질적으로 영향을 미치도록 개선합니다.

기존 시스템은 Q1-Q4에서 4축 성향을 측정하고 Q5-Q8에서 보조 태그를 수집했으나, 각 축당 1문항만으로는 측정 정밀도가 낮고, 4축 조합이 단일 캐릭터로만 매핑되어 보조 태그가 실질적으로 활용되지 못했습니다.

새로운 16문항 시스템은:
- Q1-Q8: 4축 성향 측정 (각 축당 2문항, 점수 범위 -2~+2)
- Q9-Q16: 보조 태그 측정 (8개 태그 각 2번 등장, 점수 범위 0~2)
- 일부 4축 조합에 2-3개 후보 캐릭터 배치하여 보조 태그로 최종 결정

## Glossary

- **Quiz_System**: 사용자 응답을 수집하고 캐릭터를 결정하는 전체 시스템
- **Question**: 사용자에게 제시되는 질문 (총 16개)
- **Option**: 각 질문의 선택지 (Q1-Q8은 2지선다, Q9-Q16은 4지선다)
- **Axis**: 개발자 성향을 측정하는 4개 축 (A: 안정↔실험, B: 구조↔즉흥, C: 개인↔협업, D: 품질↔속도)
- **Axis_Score**: 각 축의 점수 (-2, -1, 0, +1, +2)
- **Auxiliary_Tag**: 개발자의 세부 특성을 나타내는 8개 태그 (설계, UX, 부채청산, 몰입, 자동화, 연결, 테스트, 거버넌스)
- **Tag_Score**: 각 보조 태그의 점수 (0, 1, 2)
- **Candidate_Pool**: 4축 조합으로 결정된 후보 캐릭터 목록 (1-3개)
- **Character**: 최종 결정된 개발자 캐릭터 (10개 중 1개)
- **Mapping_Table**: 4축 조합을 후보 캐릭터 목록으로 변환하는 테이블
- **UI_Component**: 퀴즈 페이지와 진행률 표시 컴포넌트

## Requirements

### Requirement 1: 4축 성향 측정 질문 확장

**User Story:** 개발자로서, 나의 4축 성향을 더 정확하게 측정받고 싶어서, 각 축당 2문항씩 총 8문항에 응답한다.

#### Acceptance Criteria

1. THE Quiz_System SHALL provide exactly 8 questions for axis measurement (Q1-Q8)
2. WHEN a user answers Q1 or Q5, THE Quiz_System SHALL measure A-axis tendency (안정↔실험)
3. WHEN a user answers Q2 or Q6, THE Quiz_System SHALL measure B-axis tendency (구조↔즉흥)
4. WHEN a user answers Q3 or Q7, THE Quiz_System SHALL measure C-axis tendency (개인↔협업)
5. WHEN a user answers Q4 or Q8, THE Quiz_System SHALL measure D-axis tendency (품질↔속도)
6. WHEN a user selects an option in Q1-Q8, THE Quiz_System SHALL apply axisEffect value of -1 or +1
7. THE Quiz_System SHALL calculate each axis score in the range of -2 to +2

### Requirement 2: 보조 태그 측정 질문 확장

**User Story:** 개발자로서, 나의 세부 특성을 더 풍부하게 표현받고 싶어서, 8개 보조 태그를 측정하는 8문항에 응답한다.

#### Acceptance Criteria

1. THE Quiz_System SHALL provide exactly 8 questions for auxiliary tag measurement (Q9-Q16)
2. WHEN a user answers Q9-Q16, THE Quiz_System SHALL measure 8 auxiliary tags (설계, UX, 부채청산, 몰입, 자동화, 연결, 테스트, 거버넌스)
3. WHEN a user selects an option in Q9-Q16, THE Quiz_System SHALL apply tagEffect to increment the corresponding tag score
4. THE Quiz_System SHALL ensure each auxiliary tag appears exactly twice across Q9-Q16
5. THE Quiz_System SHALL calculate each tag score in the range of 0 to 2

### Requirement 3: 4축 점수 계산 로직 개선

**User Story:** 개발자로서, 나의 응답이 정확하게 점수로 변환되기를 원해서, 시스템이 Q1-Q8 응답을 4축 점수로 계산한다.

#### Acceptance Criteria

1. WHEN calculateAxisScores receives 16 answers, THE Quiz_System SHALL use only answers at indices 0-7 (Q1-Q8)
2. WHEN processing Q1 and Q5 answers, THE Quiz_System SHALL sum their axisEffect values to calculate A-axis score
3. WHEN processing Q2 and Q6 answers, THE Quiz_System SHALL sum their axisEffect values to calculate B-axis score
4. WHEN processing Q3 and Q7 answers, THE Quiz_System SHALL sum their axisEffect values to calculate C-axis score
5. WHEN processing Q4 and Q8 answers, THE Quiz_System SHALL sum their axisEffect values to calculate D-axis score
6. THE Quiz_System SHALL ensure each axis score is within the range -2 to +2

### Requirement 4: 보조 태그 집계 로직 개선

**User Story:** 개발자로서, 나의 보조 태그 점수가 정확하게 집계되기를 원해서, 시스템이 Q9-Q16 응답을 태그 점수로 계산한다.

#### Acceptance Criteria

1. WHEN calculateAuxiliaryTags receives 16 answers, THE Quiz_System SHALL use only answers at indices 8-15 (Q9-Q16)
2. WHEN processing each answer in Q9-Q16, THE Quiz_System SHALL increment the corresponding tag score by 1
3. THE Quiz_System SHALL ensure each tag score is within the range 0 to 2
4. THE Quiz_System SHALL ensure the sum of all tag scores equals 8

### Requirement 5: 후보군 결정 로직 개선

**User Story:** 개발자로서, 나의 4축 성향에 맞는 후보 캐릭터들이 선정되기를 원해서, 시스템이 4축 점수를 후보군으로 변환한다.

#### Acceptance Criteria

1. WHEN determineCandidatePool receives axis scores, THE Quiz_System SHALL convert each axis score to a sign value (-1, 0, or +1)
2. WHEN an axis score is less than 0, THE Quiz_System SHALL assign sign value -1
3. WHEN an axis score equals 0, THE Quiz_System SHALL assign sign value 0
4. WHEN an axis score is greater than 0, THE Quiz_System SHALL assign sign value +1
5. WHEN looking up the mapping table, THE Quiz_System SHALL use the 4-tuple of sign values as the key
6. THE Quiz_System SHALL return a candidate pool containing 1 to 3 character slugs
7. IF the 4-tuple key is not found in the mapping table, THE Quiz_System SHALL return an empty array

### Requirement 6: 최종 캐릭터 결정 로직 개선

**User Story:** 개발자로서, 나의 보조 태그 점수가 최종 캐릭터 선택에 반영되기를 원해서, 시스템이 후보군에서 보조 태그로 최종 캐릭터를 결정한다.

#### Acceptance Criteria

1. WHEN determineCharacter receives a candidate pool with 1 character, THE Quiz_System SHALL return that character
2. WHEN determineCharacter receives a candidate pool with 2 or more characters, THE Quiz_System SHALL compare each candidate's primaryTag score
3. WHEN comparing candidates, THE Quiz_System SHALL select the character whose primaryTag has the highest score in the user's auxiliary tags
4. IF multiple candidates have the same highest primaryTag score, THE Quiz_System SHALL return the first candidate in the pool

### Requirement 7: 매핑 테이블 재설계

**User Story:** 개발자로서, 특정 캐릭터로의 편향 없이 다양한 결과를 받고 싶어서, 시스템이 일부 4축 조합에 여러 후보 캐릭터를 배치한다.

#### Acceptance Criteria

1. THE Mapping_Table SHALL define mappings for at least 10 distinct 4-tuple keys
2. THE Mapping_Table SHALL include at least 3 mappings with 2 or more candidate characters
3. THE Mapping_Table SHALL ensure all 10 characters appear at least once across all mappings
4. WHEN a 4-tuple includes a 0 value, THE Mapping_Table SHALL provide appropriate candidate characters for that neutral tendency

### Requirement 8: UI 컴포넌트 업데이트

**User Story:** 사용자로서, 16문항 퀴즈의 진행 상황을 명확하게 파악하고 싶어서, UI가 16문항 기준으로 표시된다.

#### Acceptance Criteria

1. WHEN rendering the quiz page, THE UI_Component SHALL display question numbers from 1 to 16
2. WHEN calculating progress, THE UI_Component SHALL use the formula (currentQuestion / 16) * 100
3. WHEN displaying the progress bar, THE UI_Component SHALL show the percentage based on 16 total questions
4. THE UI_Component SHALL update the progress indicator after each answer submission

### Requirement 9: 테스트 코드 업데이트

**User Story:** 개발자로서, 16문항 시스템이 정확하게 동작하는지 확인하고 싶어서, 모든 테스트가 16문항 기준으로 작성된다.

#### Acceptance Criteria

1. WHEN running quiz engine tests, THE Test_Suite SHALL provide 16-element answer arrays
2. WHEN testing axis score calculation, THE Test_Suite SHALL verify scores in the range -2 to +2
3. WHEN testing tag score calculation, THE Test_Suite SHALL verify scores in the range 0 to 2
4. WHEN testing candidate pool determination, THE Test_Suite SHALL verify handling of 0 values in axis scores
5. WHEN testing character determination, THE Test_Suite SHALL verify primaryTag-based selection from multi-candidate pools

### Requirement 10: 데이터 타입 정의 업데이트

**User Story:** 개발자로서, 타입 안정성을 유지하고 싶어서, 모든 타입 정의가 16문항 시스템을 반영한다.

#### Acceptance Criteria

1. THE Question interface SHALL support both 2-option questions (Q1-Q8) and 4-option questions (Q9-Q16)
2. THE QuestionOption interface SHALL support both axisEffect (with values -1 or +1) and tagEffect
3. THE AxisScores type SHALL allow values in the range -2 to +2
4. THE AuxiliaryTags type SHALL allow values in the range 0 to 2
5. THE questions array SHALL contain exactly 16 Question objects with sequential IDs from 1 to 16

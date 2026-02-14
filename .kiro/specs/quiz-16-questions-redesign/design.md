# Design Document: 16문항 퀴즈 시스템 재설계

## Overview

현재 8문항 퀴즈 시스템을 16문항으로 확장하여 개발자 성향 측정의 정확도를 높이고, 보조 태그가 최종 캐릭터 결정에 실질적으로 영향을 미치도록 개선합니다.

**핵심 변경사항:**
- Q1-Q8: 4축 성향 측정 (각 축당 2문항, 점수 범위 -2~+2, 5단계)
- Q9-Q16: 보조 태그 측정 (8개 태그 각 2번 등장, 점수 범위 0~2, 3단계)
- 매핑 테이블에 일부 4축 조합에 2-3개 후보 캐릭터 배치
- 보조 태그의 primaryTag 점수로 후보군에서 최종 캐릭터 선택

**설계 원칙:**
- 기존 8문항 시스템과의 호환성은 고려하지 않음 (완전 교체)
- 각 축과 태그의 의미는 기존과 동일하게 유지
- 타입 안정성을 위해 TypeScript 타입 정의 우선 업데이트
- 테스트 주도 개발로 로직 정확성 보장

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Quiz Page (UI)                        │
│  - 16 questions display                                      │
│  - Progress bar (1-16)                                       │
│  - Answer collection                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ answers: number[16]
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Quiz Engine (Logic)                       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ calculateAxisScores(answers)                         │  │
│  │  - Use Q1-Q8 (indices 0-7)                          │  │
│  │  - Sum pairs: (Q1,Q5)→A, (Q2,Q6)→B, (Q3,Q7)→C,     │  │
│  │               (Q4,Q8)→D                             │  │
│  │  - Output: AxisScores {A,B,C,D} ∈ [-2,+2]          │  │
│  └──────────────────────────────────────────────────────┘  │
│                     │                                        │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ determineCandidatePool(scores)                       │  │
│  │  - Convert scores to signs: <0→-1, =0→0, >0→+1     │  │
│  │  - Lookup mapping table with 4-tuple key            │  │
│  │  - Output: CharacterSlug[] (1-3 candidates)         │  │
│  └──────────────────────────────────────────────────────┘  │
│                     │                                        │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ calculateAuxiliaryTags(answers)                      │  │
│  │  - Use Q9-Q16 (indices 8-15)                        │  │
│  │  - Increment tag scores                             │  │
│  │  - Output: AuxiliaryTags (8 tags) ∈ [0,2]          │  │
│  └──────────────────────────────────────────────────────┘  │
│                     │                                        │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ determineCharacter(candidatePool, tags)              │  │
│  │  - If pool.length = 1: return pool[0]               │  │
│  │  - If pool.length > 1: compare primaryTag scores    │  │
│  │  - Output: CharacterSlug (final result)             │  │
│  └──────────────────────────────────────────────────────┘  │
│                     │                                        │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ euclideanFallback(scores, tags)                      │  │
│  │  - Find nearest axis values by Euclidean distance   │  │
│  │  - Retry with determineCandidatePool + determine    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                     │
                     │ characterSlug
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Character Data                            │
│  - 10 character profiles                                     │
│  - Each with primaryTag for tie-breaking                     │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Data Layer (`src/data/questions.ts`)

**QuestionOption Interface (Updated)**
```typescript
interface QuestionOption {
  text: string;
  axisEffect?: {
    axis: 'A' | 'B' | 'C' | 'D';
    value: -1 | 1;  // Only -1 or +1 allowed
  };
  tagEffect?: string;  // Tag name for Q9-Q16
}
```

**Question Interface (Updated)**
```typescript
interface Question {
  id: number;  // 1-16
  text: string;
  options: QuestionOption[];  // 2 options for Q1-Q8, 4 options for Q9-Q16
}
```

**Questions Array Structure**
- Q1-Q8: 2 options each, with axisEffect
  - Q1, Q5: A-axis (안정↔실험)
  - Q2, Q6: B-axis (구조↔즉흥)
  - Q3, Q7: C-axis (개인↔협업)
  - Q4, Q8: D-axis (품질↔속도)
- Q9-Q16: 4 options each, with tagEffect
  - Each of 8 tags appears exactly twice across Q9-Q16

### 2. Type Definitions (`src/lib/types.ts`)

**AxisScores (Updated)**
```typescript
interface AxisScores {
  A: number;  // Range: -2 to +2 (5 levels)
  B: number;  // Range: -2 to +2 (5 levels)
  C: number;  // Range: -2 to +2 (5 levels)
  D: number;  // Range: -2 to +2 (5 levels)
}
```

**AuxiliaryTags (Updated)**
```typescript
interface AuxiliaryTags {
  설계: number;      // Range: 0 to 2 (3 levels)
  UX: number;        // Range: 0 to 2 (3 levels)
  부채청산: number;  // Range: 0 to 2 (3 levels)
  몰입: number;      // Range: 0 to 2 (3 levels)
  자동화: number;    // Range: 0 to 2 (3 levels)
  연결: number;      // Range: 0 to 2 (3 levels)
  테스트: number;    // Range: 0 to 2 (3 levels)
  거버넌스: number;  // Range: 0 to 2 (3 levels)
}
```

### 3. Quiz Engine (`src/lib/quiz-engine.ts`)

**calculateAxisScores(answers: number[]): AxisScores**
- Input: 16-element array (indices 0-15)
- Process:
  1. Use only indices 0-7 (Q1-Q8)
  2. For each axis, sum the two corresponding question effects:
     - A = Q1.axisEffect.value + Q5.axisEffect.value
     - B = Q2.axisEffect.value + Q6.axisEffect.value
     - C = Q3.axisEffect.value + Q7.axisEffect.value
     - D = Q4.axisEffect.value + Q8.axisEffect.value
  3. Each axis score ∈ {-2, -1, 0, +1, +2}
- Output: AxisScores object

**determineCandidatePool(scores: AxisScores): CharacterSlug[]**
- Input: AxisScores object
- Process:
  1. Convert each score to sign:
     - score < 0 → -1
     - score = 0 → 0
     - score > 0 → +1
  2. Create key string: `"${signA},${signB},${signC},${signD}"`
  3. Lookup mapping table
  4. Return candidate array (1-3 characters) or empty array
- Output: CharacterSlug[] (may be empty for fallback)

**Mapping Table Design**
```typescript
const mappingTable: Record<string, CharacterSlug[]> = {
  // Single candidate mappings (7 entries)
  '-1,-1,-1,-1': ['gatssn'],       // 안정, 구조, 개인, 품질
  '1,1,-1,1': ['dokkaebi'],        // 실험, 즉흥, 개인, 속도
  '-1,1,1,1': ['mulgwisin'],       // 안정, 즉흥, 협업, 속도
  '1,-1,-1,-1': ['jeoseung'],      // 실험, 구조, 개인, 품질
  '-1,-1,1,1': ['cheonyeo'],       // 안정, 구조, 협업, 속도
  
  // Multi-candidate mappings (3 entries) - primaryTag decides
  '-1,1,-1,1': ['chonggak', 'gumiho'],  // 안정/실험 중립, 즉흥, 개인, 속도
                                         // chonggak: 몰입, gumiho: 자동화
  '-1,-1,1,-1': ['haetae', 'jangseung'], // 안정, 구조, 협업, 품질
                                          // haetae: 테스트, jangseung: 거버넌스
  '1,-1,1,-1': ['dalgyal', 'gatssn'],    // 실험, 구조, 협업, 품질
                                          // dalgyal: 추상화(설계), gatssn: 설계
  
  // Neutral axis handling (example with 0 values)
  '0,-1,-1,-1': ['gatssn', 'jeoseung'], // A축 중립, 구조, 개인, 품질
  '-1,0,1,-1': ['haetae', 'cheonyeo'],  // B축 중립, 안정, 협업, 품질
  // ... (additional mappings as needed)
};
```

**calculateAuxiliaryTags(answers: number[]): AuxiliaryTags**
- Input: 16-element array (indices 0-15)
- Process:
  1. Initialize all tags to 0
  2. Use only indices 8-15 (Q9-Q16)
  3. For each answer, increment the corresponding tag by 1
  4. Each tag score ∈ {0, 1, 2}
  5. Sum of all tags = 8 (invariant)
- Output: AuxiliaryTags object

**determineCharacter(candidatePool: CharacterSlug[], tags: AuxiliaryTags): CharacterSlug**
- Input: Candidate pool (1-3 characters), auxiliary tags
- Process:
  1. If pool.length = 1: return pool[0]
  2. If pool.length > 1:
     a. For each candidate, get their primaryTag from character profile
     b. Look up the user's score for that primaryTag in tags
     c. Select the candidate with the highest primaryTag score
     d. If tie, return the first candidate in the pool
- Output: CharacterSlug (final result)

**euclideanFallback(scores: AxisScores, tags: AuxiliaryTags): CharacterSlug**
- Input: Axis scores, auxiliary tags
- Process:
  1. Extract unique axis value sets from all character profiles
  2. Calculate Euclidean distance from user scores to each unique set
  3. Find the nearest axis value set
  4. Call determineCandidatePool with nearest axis values
  5. Call determineCharacter with the result
- Output: CharacterSlug (fallback result)

**getResult(answers: number[]): CharacterSlug**
- Input: 16-element answer array
- Process:
  1. scores = calculateAxisScores(answers)
  2. candidatePool = determineCandidatePool(scores)
  3. tags = calculateAuxiliaryTags(answers)
  4. If candidatePool is empty: return euclideanFallback(scores, tags)
  5. Else: return determineCharacter(candidatePool, tags)
- Output: CharacterSlug (final result)

### 4. UI Components

**Quiz Page (`src/app/quiz/page.tsx`)**
- Update question counter: 1-16
- Update answer array size: 16 elements
- Update progress calculation: (currentQuestion / 16) * 100

**Progress Bar (`src/components/ProgressBar.tsx`)**
- Update total questions: 16
- Update progress percentage calculation

## Data Models

### Question Data Structure

```typescript
// Q1-Q8: Axis measurement (2 options each)
{
  id: 1,
  text: "새 프로젝트를 시작할 때, 당신의 기술 스택 선택 기준은?",
  options: [
    {
      text: "검증된 기술을 선택한다. 안정성이 최우선이다.",
      axisEffect: { axis: 'A', value: -1 }
    },
    {
      text: "새로운 기술을 시도한다. 배움과 도전이 중요하다.",
      axisEffect: { axis: 'A', value: 1 }
    }
  ]
}

// Q9-Q16: Tag measurement (4 options each)
{
  id: 9,
  text: "팀에서 자유 시간이 주어졌다면, 가장 하고 싶은 일은?",
  options: [
    { text: "시스템 아키텍처를 다이어그램으로 정리한다.", tagEffect: "설계" },
    { text: "사용자 피드백을 분석해 UI를 개선한다.", tagEffect: "UX" },
    { text: "오래된 레거시 코드를 리팩토링한다.", tagEffect: "부채청산" },
    { text: "관심 있던 사이드 프로젝트에 몰두한다.", tagEffect: "몰입" }
  ]
}
```

### Answer Array Structure

```typescript
// answers: number[16]
// - indices 0-7: Q1-Q8 answers (axis measurement)
// - indices 8-15: Q9-Q16 answers (tag measurement)
// - Each value is the selected option index (0-based)

// Example:
[
  0, 1, 0, 1,  // Q1-Q4: A=-1, B=+1, C=-1, D=+1
  1, 0, 1, 0,  // Q5-Q8: A=+1, B=-1, C=+1, D=-1
  2, 1, 0, 3,  // Q9-Q12: tag selections
  1, 2, 0, 3   // Q13-Q16: tag selections
]
// Resulting scores:
// A = -1 + 1 = 0
// B = 1 + (-1) = 0
// C = -1 + 1 = 0
// D = 1 + (-1) = 0
```

### Mapping Table Structure

```typescript
type MappingTable = Record<string, CharacterSlug[]>;

// Key format: "signA,signB,signC,signD"
// Value: Array of 1-3 character slugs
// Total entries: 10-15 (covering main combinations)
// Multi-candidate entries: 3-5 (for primaryTag differentiation)
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Axis scores are bounded

*For any* valid 16-element answer array, each axis score (A, B, C, D) calculated by calculateAxisScores should be within the range [-2, +2].

**Validates: Requirements 1.7, 3.6**

### Property 2: Axis calculation uses only Q1-Q8

*For any* valid 16-element answer array, modifying answers at indices 8-15 (Q9-Q16) should not change the output of calculateAxisScores.

**Validates: Requirements 3.1**

### Property 3: Each axis sums its two questions

*For any* valid 16-element answer array, each axis score should equal the sum of its two corresponding question effects: A = Q1 + Q5, B = Q2 + Q6, C = Q3 + Q7, D = Q4 + Q8.

**Validates: Requirements 3.2, 3.3, 3.4, 3.5**

### Property 4: Tag scores are bounded

*For any* valid 16-element answer array, each tag score calculated by calculateAuxiliaryTags should be within the range [0, 2].

**Validates: Requirements 2.5, 4.3**

### Property 5: Tag calculation uses only Q9-Q16

*For any* valid 16-element answer array, modifying answers at indices 0-7 (Q1-Q8) should not change the output of calculateAuxiliaryTags.

**Validates: Requirements 4.1**

### Property 6: Tag scores sum to 8

*For any* valid 16-element answer array, the sum of all 8 tag scores calculated by calculateAuxiliaryTags should equal 8.

**Validates: Requirements 4.4**

### Property 7: Sign conversion is correct

*For any* axis scores object, determineCandidatePool should convert each score to the correct sign: negative scores to -1, zero to 0, positive scores to +1.

**Validates: Requirements 5.1**

### Property 8: Mapping table key format

*For any* axis scores object, determineCandidatePool should construct the lookup key in the format "signA,signB,signC,signD".

**Validates: Requirements 5.5**

### Property 9: Candidate pool size is valid

*For any* axis scores object that maps to a valid entry, determineCandidatePool should return a candidate pool with 1 to 3 character slugs.

**Validates: Requirements 5.6**

### Property 10: Multi-candidate selection uses primaryTag

*For any* candidate pool with 2 or more characters and any auxiliary tags object, determineCharacter should select the character whose primaryTag has the highest score in the user's tags.

**Validates: Requirements 6.2, 6.3**

### Property 11: Progress calculation formula

*For any* current question number from 1 to 16, the UI progress percentage should equal (currentQuestion / 16) * 100.

**Validates: Requirements 8.2, 8.3**

### Property 12: Progress updates after each answer

*For any* quiz state, submitting an answer should increment the current question number and update the progress indicator accordingly.

**Validates: Requirements 8.4**

## Error Handling

### Invalid Input Handling

**Empty or Invalid Answer Arrays**
- If answers array length ≠ 16: throw TypeError with message "Answer array must have exactly 16 elements"
- If any answer index is out of bounds for its question: throw RangeError with message "Invalid option index for question N"

**Invalid Axis Scores**
- If any axis score is outside [-2, +2]: log warning and clamp to range
- This should not occur with valid questions data, but provides safety

**Invalid Tag Scores**
- If any tag score is outside [0, 2]: log warning and clamp to range
- If tag sum ≠ 8: log warning (indicates data inconsistency)

**Missing Mapping Table Entry**
- If determineCandidatePool returns empty array: trigger euclideanFallback
- Log the unmapped 4-tuple for monitoring

**Missing Character Profile**
- If a character slug in candidate pool has no profile: throw Error with message "Character profile not found: {slug}"
- This indicates data inconsistency and should be caught in tests

### UI Error Handling

**Question Data Loading**
- If questions array is not exactly 16 elements: show error message and prevent quiz start
- If any question has invalid structure: show error message with question ID

**Navigation Errors**
- If user tries to navigate beyond question 16: prevent navigation and show completion screen
- If user tries to navigate before question 1: prevent navigation

**Answer Submission Errors**
- If answer submission fails: show retry button and preserve current state
- If result calculation fails: show error message and allow quiz restart

## Testing Strategy

### Dual Testing Approach

이 프로젝트는 **Unit Testing**과 **Property-Based Testing**을 모두 사용합니다. 두 접근 방식은 상호 보완적이며 함께 사용해야 합니다:

**Unit Tests (Jest)**
- 특정 예제와 엣지 케이스 검증
- 데이터 구조 검증 (questions 배열, mapping table)
- 통합 지점 테스트 (UI와 로직 연결)
- 에러 조건 테스트

**Property-Based Tests (fast-check)**
- 모든 입력에 대한 보편적 속성 검증
- 랜덤 입력 생성으로 광범위한 커버리지
- 각 테스트는 최소 100회 반복 실행
- 각 correctness property마다 하나의 property test 작성

### Property-Based Testing Configuration

**라이브러리**: fast-check (TypeScript/JavaScript용 property-based testing)

**설정**:
```typescript
import fc from 'fast-check';

// 각 property test는 최소 100회 반복
fc.assert(
  fc.property(/* generators */, (/* inputs */) => {
    // property assertion
  }),
  { numRuns: 100 }
);
```

**태그 형식**:
```typescript
// Feature: quiz-16-questions-redesign, Property 1: Axis scores are bounded
test('Property 1: Axis scores are bounded', () => {
  // property test implementation
});
```

### Test Coverage Requirements

**Unit Tests**:
- Questions data structure validation
- Mapping table structure validation
- Single-candidate pool handling (edge case)
- Empty candidate pool handling (edge case)
- Tie-breaking in multi-candidate selection (edge case)
- UI component rendering with 16 questions
- Progress bar calculation at boundaries (0%, 50%, 100%)

**Property Tests** (각 correctness property마다 1개):
1. Property 1: Axis scores bounded
2. Property 2: Axis calculation isolation from Q9-Q16
3. Property 3: Axis score calculation correctness
4. Property 4: Tag scores bounded
5. Property 5: Tag calculation isolation from Q1-Q8
6. Property 6: Tag scores sum invariant
7. Property 7: Sign conversion correctness
8. Property 8: Mapping key format
9. Property 9: Candidate pool size validity
10. Property 10: Multi-candidate primaryTag selection
11. Property 11: Progress calculation formula
12. Property 12: Progress update behavior

### Generator Strategies

**Answer Array Generator**:
```typescript
// Generate valid 16-element answer arrays
const answerArrayGen = fc.tuple(
  // Q1-Q8: 2 options each (0 or 1)
  fc.integer({ min: 0, max: 1 }),
  fc.integer({ min: 0, max: 1 }),
  fc.integer({ min: 0, max: 1 }),
  fc.integer({ min: 0, max: 1 }),
  fc.integer({ min: 0, max: 1 }),
  fc.integer({ min: 0, max: 1 }),
  fc.integer({ min: 0, max: 1 }),
  fc.integer({ min: 0, max: 1 }),
  // Q9-Q16: 4 options each (0-3)
  fc.integer({ min: 0, max: 3 }),
  fc.integer({ min: 0, max: 3 }),
  fc.integer({ min: 0, max: 3 }),
  fc.integer({ min: 0, max: 3 }),
  fc.integer({ min: 0, max: 3 }),
  fc.integer({ min: 0, max: 3 }),
  fc.integer({ min: 0, max: 3 }),
  fc.integer({ min: 0, max: 3 })
);
```

**Axis Scores Generator**:
```typescript
// Generate valid axis scores (-2 to +2)
const axisScoresGen = fc.record({
  A: fc.integer({ min: -2, max: 2 }),
  B: fc.integer({ min: -2, max: 2 }),
  C: fc.integer({ min: -2, max: 2 }),
  D: fc.integer({ min: -2, max: 2 })
});
```

**Auxiliary Tags Generator**:
```typescript
// Generate valid tag scores (0 to 2, sum = 8)
// This is complex - use custom generator to ensure sum = 8
const auxiliaryTagsGen = fc.array(
  fc.integer({ min: 0, max: 2 }),
  { minLength: 8, maxLength: 8 }
).filter(arr => arr.reduce((a, b) => a + b, 0) === 8)
  .map(arr => ({
    설계: arr[0],
    UX: arr[1],
    부채청산: arr[2],
    몰입: arr[3],
    자동화: arr[4],
    연결: arr[5],
    테스트: arr[6],
    거버넌스: arr[7]
  }));
```

### Integration Testing

**End-to-End Flow**:
- User completes all 16 questions
- System calculates axis scores and tags
- System determines candidate pool
- System selects final character
- Result page displays correct character

**UI Integration**:
- Quiz page renders 16 questions sequentially
- Progress bar updates from 0% to 100%
- Answer submission updates state correctly
- Navigation between questions works correctly

### Test Execution

**명령어**:
```bash
# Run all tests
npm test

# Run only unit tests
npm test -- --testPathPattern=unit

# Run only property tests
npm test -- --testPathPattern=property

# Run with coverage
npm test -- --coverage
```

**CI/CD Integration**:
- All tests must pass before merge
- Property tests run with 100 iterations in CI
- Coverage threshold: 80% for logic files

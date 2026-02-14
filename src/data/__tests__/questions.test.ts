// questions 배열 검증 테스트
// Task 3.2: questions 배열 검증
// Requirements: 10.5, 2.4

import { questions } from '../questions';

describe('Questions Array Validation', () => {
  // 1. 배열 길이가 정확히 16인지 확인
  test('should have exactly 16 questions', () => {
    expect(questions).toHaveLength(16);
  });

  // 2. ID가 1-16까지 순차적인지 확인
  test('should have sequential IDs from 1 to 16', () => {
    questions.forEach((question, index) => {
      expect(question.id).toBe(index + 1);
    });
  });

  // 3. Q1-Q8은 2개 옵션, Q9-Q16은 4개 옵션인지 확인
  test('Q1-Q8 should have exactly 2 options each', () => {
    for (let i = 0; i < 8; i++) {
      expect(questions[i].options).toHaveLength(2);
    }
  });

  test('Q9-Q16 should have exactly 4 options each', () => {
    for (let i = 8; i < 16; i++) {
      expect(questions[i].options).toHaveLength(4);
    }
  });

  // 4. 각 태그가 정확히 4번씩 등장하는지 확인
  // Note: Q9-Q16에서 각 질문이 4개 옵션을 가지므로, 8개 태그를 균등 분배하면 각 태그가 4번씩 등장
  test('each tag should appear exactly 4 times across Q9-Q16', () => {
    const expectedTags = [
      '설계',
      'UX',
      '부채청산',
      '몰입',
      '자동화',
      '연결',
      '테스트',
      '거버넌스',
    ];

    // Q9-Q16의 모든 옵션에서 tagEffect 수집
    const tagCounts: Record<string, number> = {};

    for (let i = 8; i < 16; i++) {
      questions[i].options.forEach((option) => {
        if (option.tagEffect) {
          tagCounts[option.tagEffect] = (tagCounts[option.tagEffect] || 0) + 1;
        }
      });
    }

    // 각 태그가 정확히 4번씩 등장하는지 확인
    expectedTags.forEach((tag) => {
      expect(tagCounts[tag]).toBe(4);
    });

    // 예상하지 못한 태그가 없는지 확인
    const actualTags = Object.keys(tagCounts);
    expect(actualTags.sort()).toEqual(expectedTags.sort());
  });

  // 추가 검증: Q1-Q8은 axisEffect를 가지고 있는지 확인
  test('Q1-Q8 options should have axisEffect', () => {
    for (let i = 0; i < 8; i++) {
      questions[i].options.forEach((option) => {
        expect(option.axisEffect).toBeDefined();
        expect(option.axisEffect?.axis).toMatch(/^[ABCD]$/);
        expect([-1, 1]).toContain(option.axisEffect?.value);
      });
    }
  });

  // 추가 검증: Q9-Q16은 tagEffect를 가지고 있는지 확인
  test('Q9-Q16 options should have tagEffect', () => {
    for (let i = 8; i < 16; i++) {
      questions[i].options.forEach((option) => {
        expect(option.tagEffect).toBeDefined();
        expect(typeof option.tagEffect).toBe('string');
      });
    }
  });

  // 추가 검증: 각 축(A, B, C, D)이 정확히 2번씩 등장하는지 확인
  test('each axis should appear exactly 2 times in Q1-Q8', () => {
    const axisCounts: Record<string, number> = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    };

    for (let i = 0; i < 8; i++) {
      const axis = questions[i].options[0].axisEffect?.axis;
      if (axis) {
        axisCounts[axis]++;
      }
    }

    expect(axisCounts.A).toBe(2);
    expect(axisCounts.B).toBe(2);
    expect(axisCounts.C).toBe(2);
    expect(axisCounts.D).toBe(2);
  });
});

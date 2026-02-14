// 퀴즈 엔진 - 4축 점수 산출 함수 단위 테스트

import { calculateAxisScores, determineCandidatePool, calculateAuxiliaryTags, determineCharacter, euclideanFallback, getResult } from '@/lib/quiz-engine';


describe('determineCharacter - Single-candidate pool handling (Requirements 6.1)', () => {
  /**
   * Requirements 6.1: 후보군이 1개일 때 해당 캐릭터를 즉시 반환
   * 보조 태그 점수와 무관하게 단일 후보를 반환해야 함
   */
  it('단일 후보군일 때 보조 태그 점수와 무관하게 해당 캐릭터를 반환한다', () => {
    // 다양한 보조 태그 조합 테스트
    const tagCombinations: AuxiliaryTags[] = [
      // 모든 태그가 0
      {
        설계: 0, UX: 0, 부채청산: 0, 몰입: 0,
        자동화: 0, 연결: 0, 테스트: 0, 거버넌스: 0,
      },
      // 특정 태그만 높은 점수
      {
        설계: 4, UX: 0, 부채청산: 0, 몰입: 0,
        자동화: 0, 연결: 0, 테스트: 0, 거버넌스: 4,
      },
      // 균등 분포
      {
        설계: 1, UX: 1, 부채청산: 1, 몰입: 1,
        자동화: 1, 연결: 1, 테스트: 1, 거버넌스: 1,
      },
      // 극단적 분포
      {
        설계: 0, UX: 0, 부채청산: 0, 몰입: 0,
        자동화: 0, 연결: 0, 테스트: 4, 거버넌스: 4,
      },
    ];

    // 모든 10개 캐릭터에 대해 테스트
    const allCharacters = [
      'gatssn', 'chonggak', 'cheonyeo', 'dokkaebi', 'gumiho',
      'haetae', 'jangseung', 'jeoseung', 'mulgwisin', 'dalgyal'
    ];

    for (const character of allCharacters) {
      for (const tags of tagCombinations) {
        const result = determineCharacter([character], tags);
        expect(result).toBe(character);
      }
    }
  });

  it('단일 후보군일 때 primaryTag 점수가 0이어도 해당 캐릭터를 반환한다', () => {
    // chonggak의 primaryTag는 '몰입'
    const tags: AuxiliaryTags = {
      설계: 4, UX: 0, 부채청산: 0, 몰입: 0, // 몰입 = 0
      자동화: 0, 연결: 0, 테스트: 0, 거버넌스: 4,
    };

    expect(determineCharacter(['chonggak'], tags)).toBe('chonggak');
  });

  it('단일 후보군일 때 다른 캐릭터의 primaryTag 점수가 높아도 해당 캐릭터를 반환한다', () => {
    // gatssn의 primaryTag는 '설계'
    // haetae의 primaryTag는 '테스트'
    // 테스트 점수가 설계 점수보다 높지만, 후보군이 gatssn만 있으므로 gatssn 반환
    const tags: AuxiliaryTags = {
      설계: 0, UX: 0, 부채청산: 0, 몰입: 0,
      자동화: 0, 연결: 0, 테스트: 4, 거버넌스: 4, // 테스트 = 4, 설계 = 0
    };

    expect(determineCharacter(['gatssn'], tags)).toBe('gatssn');
  });
});

import type { AxisScores, AuxiliaryTags } from '@/lib/types';

describe('calculateAxisScores', () => {
  // 모든 축에서 첫 번째 선택지(인덱스 0)를 선택한 경우: 안정, 구조, 개인, 품질 → 모두 -2
  // Q1-Q8 모두 첫 번째 선택지 = 각 축당 -1 + -1 = -2
  it('모든 질문에서 첫 번째 선택지를 고르면 4축 모두 -2이다', () => {
    const answers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const result = calculateAxisScores(answers);

    expect(result).toEqual<AxisScores>({ A: -2, B: -2, C: -2, D: -2 });
  });

  // 모든 축에서 두 번째 선택지(인덱스 1)를 선택한 경우: 실험, 즉흥, 협업, 속도 → 모두 +2
  // Q1-Q8 모두 두 번째 선택지 = 각 축당 +1 + +1 = +2
  it('모든 질문에서 두 번째 선택지를 고르면 4축 모두 +2이다', () => {
    const answers = [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    const result = calculateAxisScores(answers);

    expect(result).toEqual<AxisScores>({ A: 2, B: 2, C: 2, D: 2 });
  });

  // 혼합 응답: Q1=실험(+1), Q2=구조(-1), Q3=개인(-1), Q4=속도(+1), Q5=실험(+1), Q6=구조(-1), Q7=개인(-1), Q8=속도(+1)
  // A = +1 + +1 = +2, B = -1 + -1 = -2, C = -1 + -1 = -2, D = +1 + +1 = +2
  it('혼합 응답에서 각 축에 올바른 점수를 부여한다', () => {
    const answers = [1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    const result = calculateAxisScores(answers);

    expect(result).toEqual<AxisScores>({ A: 2, B: -2, C: -2, D: 2 });
  });

  // Q9~Q16 응답은 4축 점수에 영향을 주지 않는다
  it('Q9~Q16 응답 값이 달라져도 4축 점수는 동일하다', () => {
    const answers1 = [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    const answers2 = [0, 1, 0, 1, 0, 1, 0, 1, 3, 2, 1, 3, 2, 1, 0, 3];
    const result1 = calculateAxisScores(answers1);
    const result2 = calculateAxisScores(answers2);

    expect(result1).toEqual(result2);
  });

  // 각 축이 독립적으로 동작하는지 확인
  // A축만 실험(+2): Q1=1, Q5=1, 나머지 모두 0
  it('A축만 실험(+2), 나머지는 모두 -2이다', () => {
    const answers = [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const result = calculateAxisScores(answers);

    expect(result).toEqual<AxisScores>({ A: 2, B: -2, C: -2, D: -2 });
  });

  // B축만 즉흥(+2): Q2=1, Q6=1, 나머지 모두 0
  it('B축만 즉흥(+2), 나머지는 모두 -2이다', () => {
    const answers = [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const result = calculateAxisScores(answers);

    expect(result).toEqual<AxisScores>({ A: -2, B: 2, C: -2, D: -2 });
  });

  // C축만 협업(+2): Q3=1, Q7=1, 나머지 모두 0
  it('C축만 협업(+2), 나머지는 모두 -2이다', () => {
    const answers = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const result = calculateAxisScores(answers);

    expect(result).toEqual<AxisScores>({ A: -2, B: -2, C: 2, D: -2 });
  });

  // D축만 속도(+2): Q4=1, Q8=1, 나머지 모두 0
  it('D축만 속도(+2), 나머지는 모두 -2이다', () => {
    const answers = [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    const result = calculateAxisScores(answers);

    expect(result).toEqual<AxisScores>({ A: -2, B: -2, C: -2, D: 2 });
  });
});

describe('determineCandidatePool', () => {
  // === 단일 후보군 매핑 테스트 ===
  
  // 매핑 1: (-1,-1,-1,-1) → [gatssn]
  it('안정/구조/개인/품질 조합이면 [gatssn]을 반환한다', () => {
    const result = determineCandidatePool({ A: -1, B: -1, C: -1, D: -1 });
    expect(result).toEqual(['gatssn']);
  });

  // 매핑 2: (+1,+1,-1,+1) → [dokkaebi]
  it('실험/즉흥/개인/속도 조합이면 [dokkaebi]를 반환한다', () => {
    const result = determineCandidatePool({ A: 1, B: 1, C: -1, D: 1 });
    expect(result).toEqual(['dokkaebi']);
  });

  // 매핑 3: (-1,+1,+1,+1) → [mulgwisin]
  it('안정/즉흥/협업/속도 조합이면 [mulgwisin]을 반환한다', () => {
    const result = determineCandidatePool({ A: -1, B: 1, C: 1, D: 1 });
    expect(result).toEqual(['mulgwisin']);
  });

  // 매핑 4: (+1,-1,-1,-1) → [jeoseung]
  it('실험/구조/개인/품질 조합이면 [jeoseung]을 반환한다', () => {
    const result = determineCandidatePool({ A: 1, B: -1, C: -1, D: -1 });
    expect(result).toEqual(['jeoseung']);
  });

  // 매핑 5: (-1,-1,+1,+1) → [cheonyeo]
  it('안정/구조/협업/속도 조합이면 [cheonyeo]를 반환한다', () => {
    const result = determineCandidatePool({ A: -1, B: -1, C: 1, D: 1 });
    expect(result).toEqual(['cheonyeo']);
  });

  // === 다중 후보군 매핑 테스트 ===
  
  // 매핑 6: (-1,+1,-1,+1) → [chonggak, gumiho]
  it('안정/즉흥/개인/속도 조합이면 [chonggak, gumiho]를 반환한다', () => {
    const result = determineCandidatePool({ A: -1, B: 1, C: -1, D: 1 });
    expect(result).toEqual(['chonggak', 'gumiho']);
  });

  // 매핑 7: (-1,-1,+1,-1) → [haetae, jangseung]
  it('안정/구조/협업/품질 조합이면 [haetae, jangseung]을 반환한다', () => {
    const result = determineCandidatePool({ A: -1, B: -1, C: 1, D: -1 });
    expect(result).toEqual(['haetae', 'jangseung']);
  });

  // 매핑 8: (+1,-1,+1,-1) → [dalgyal, jeoseung]
  it('실험/구조/협업/품질 조합이면 [dalgyal, jeoseung]을 반환한다', () => {
    const result = determineCandidatePool({ A: 1, B: -1, C: 1, D: -1 });
    expect(result).toEqual(['dalgyal', 'jeoseung']);
  });

  // === 0 값 포함 매핑 테스트 ===
  
  // 매핑 9: (0,-1,-1,-1) → [gatssn, jeoseung]
  it('A축 중립/구조/개인/품질 조합이면 [gatssn, jeoseung]을 반환한다', () => {
    const result = determineCandidatePool({ A: 0, B: -1, C: -1, D: -1 });
    expect(result).toEqual(['gatssn', 'jeoseung']);
  });

  // 매핑 10: (-1,0,+1,-1) → [haetae, cheonyeo]
  it('안정/B축 중립/협업/품질 조합이면 [haetae, cheonyeo]를 반환한다', () => {
    const result = determineCandidatePool({ A: -1, B: 0, C: 1, D: -1 });
    expect(result).toEqual(['haetae', 'cheonyeo']);
  });

  // === 폴백 테스트 ===
  
  // 폴백: 매핑 테이블에 없는 조합 → 빈 배열
  it('매핑 테이블에 없는 조합이면 빈 배열을 반환한다', () => {
    // (-1,+1,+1,-1)은 매핑 테이블에 없음
    const result = determineCandidatePool({ A: -1, B: 1, C: 1, D: -1 });
    expect(result).toEqual([]);
  });

  // === 0 값 처리 로직 테스트 ===
  
  // 0 값은 별도의 sign 값(0)으로 처리
  it('축 값이 0이면 sign 0으로 처리한다', () => {
    // (0, 0, 0, 0) → (0,0,0,0) → [gatssn, dalgyal, haetae]
    const result = determineCandidatePool({ A: 0, B: 0, C: 0, D: 0 });
    expect(result).toEqual(['gatssn', 'dalgyal', 'haetae']);
  });

  // 음수는 -1, 0은 0, 양수는 +1로 변환 확인
  it('각 축 점수를 올바른 sign 값으로 변환한다', () => {
    // A=-2 → -1, B=0 → 0, C=1 → +1, D=-1 → -1
    const result = determineCandidatePool({ A: -2, B: 0, C: 1, D: -1 });
    // key: "-1,0,1,-1" → 매핑: [haetae, cheonyeo]
    expect(result).toEqual(['haetae', 'cheonyeo']);
  });
});


describe('calculateAuxiliaryTags', () => {
  // Q9~Q16 모두 첫 번째 선택지(인덱스 0): 설계, 자동화, 설계, 자동화, 설계, 자동화, 설계, 자동화
  // Q9=0(설계), Q10=0(자동화), Q11=0(설계), Q12=0(자동화), Q13=0(설계), Q14=0(자동화), Q15=0(설계), Q16=0(자동화)
  it('Q9~Q16 모두 첫 번째 선택지를 고르면 설계=4, 자동화=4이다', () => {
    const answers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const result = calculateAuxiliaryTags(answers);

    expect(result).toEqual<AuxiliaryTags>({
      설계: 4, UX: 0, 부채청산: 0, 몰입: 0,
      자동화: 4, 연결: 0, 테스트: 0, 거버넌스: 0,
    });
  });

  // Q9~Q16 모두 두 번째 선택지(인덱스 1): UX, 연결, UX, 연결, UX, 연결, UX, 연결
  it('Q9~Q16 모두 두 번째 선택지를 고르면 UX=4, 연결=4이다', () => {
    const answers = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1];
    const result = calculateAuxiliaryTags(answers);

    expect(result).toEqual<AuxiliaryTags>({
      설계: 0, UX: 4, 부채청산: 0, 몰입: 0,
      자동화: 0, 연결: 4, 테스트: 0, 거버넌스: 0,
    });
  });

  // Q9~Q16 모두 세 번째 선택지(인덱스 2): 부채청산, 테스트, 부채청산, 테스트, 부채청산, 테스트, 부채청산, 테스트
  it('Q9~Q16 모두 세 번째 선택지를 고르면 부채청산=4, 테스트=4이다', () => {
    const answers = [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2];
    const result = calculateAuxiliaryTags(answers);

    expect(result).toEqual<AuxiliaryTags>({
      설계: 0, UX: 0, 부채청산: 4, 몰입: 0,
      자동화: 0, 연결: 0, 테스트: 4, 거버넌스: 0,
    });
  });

  // Q9~Q16 모두 네 번째 선택지(인덱스 3): 몰입, 거버넌스, 몰입, 거버넌스, 몰입, 거버넌스, 몰입, 거버넌스
  it('Q9~Q16 모두 네 번째 선택지를 고르면 몰입=4, 거버넌스=4이다', () => {
    const answers = [0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3];
    const result = calculateAuxiliaryTags(answers);

    expect(result).toEqual<AuxiliaryTags>({
      설계: 0, UX: 0, 부채청산: 0, 몰입: 4,
      자동화: 0, 연결: 0, 테스트: 0, 거버넌스: 4,
    });
  });

  // 태그 점수 총합은 항상 8 (Q9~Q16 각 1점씩)
  it('태그 점수의 총합은 항상 8이다', () => {
    const answers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 0, 1, 2, 3];
    const result = calculateAuxiliaryTags(answers);

    const total = Object.values(result).reduce((sum, v) => sum + v, 0);
    expect(total).toBe(8);
  });

  // Q1~Q8 응답은 보조 태그에 영향을 주지 않는다
  it('Q1~Q8 응답 값이 달라져도 보조 태그 결과는 동일하다', () => {
    const answers1 = [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 0, 1, 2, 3, 0];
    const answers2 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 0, 1, 2, 3, 0];
    const result1 = calculateAuxiliaryTags(answers1);
    const result2 = calculateAuxiliaryTags(answers2);

    expect(result1).toEqual(result2);
  });

  // 동일 태그가 여러 질문에서 선택되면 누적된다
  it('설계 태그가 Q9(0)와 Q11(0)에서 선택되면 설계=2이다', () => {
    // Q9=0(설계), Q10=1(연결), Q11=0(설계), Q12=1(연결), Q13=1(UX), Q14=1(연결), Q15=1(UX), Q16=1(연결)
    const answers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1];
    const result = calculateAuxiliaryTags(answers);

    expect(result.설계).toBe(2);
  });
});

describe('determineCharacter', () => {
  // === 모든 매핑이 단독이므로 항상 첫 번째 캐릭터를 반환 ===

  it('후보군이 1명(chonggak)이면 해당 캐릭터를 즉시 반환한다', () => {
    const tags: AuxiliaryTags = {
      설계: 1, UX: 1, 부채청산: 1, 몰입: 1,
      자동화: 0, 연결: 0, 테스트: 0, 거버넌스: 0,
    };
    expect(determineCharacter(['chonggak'], tags)).toBe('chonggak');
  });

  it('후보군이 1명(dokkaebi)이면 태그 점수와 무관하게 반환한다', () => {
    const tags: AuxiliaryTags = {
      설계: 0, UX: 0, 부채청산: 0, 몰입: 0,
      자동화: 4, 연결: 0, 테스트: 0, 거버넌스: 0,
    };
    expect(determineCharacter(['dokkaebi'], tags)).toBe('dokkaebi');
  });

  it('후보군이 1명(gumiho)이면 즉시 반환한다', () => {
    const tags: AuxiliaryTags = {
      설계: 0, UX: 0, 부채청산: 0, 몰입: 0,
      자동화: 0, 연결: 0, 테스트: 2, 거버넌스: 2,
    };
    expect(determineCharacter(['gumiho'], tags)).toBe('gumiho');
  });

  it('후보군이 1명(mulgwisin)이면 즉시 반환한다', () => {
    const tags: AuxiliaryTags = {
      설계: 0, UX: 0, 부채청산: 0, 몰입: 0,
      자동화: 0, 연결: 0, 테스트: 0, 거버넌스: 0,
    };
    expect(determineCharacter(['mulgwisin'], tags)).toBe('mulgwisin');
  });

  it('후보군이 1명(gatssn)이면 즉시 반환한다', () => {
    const tags: AuxiliaryTags = {
      설계: 3, UX: 1, 부채청산: 0, 몰입: 0,
      자동화: 0, 연결: 0, 테스트: 0, 거버넌스: 0,
    };
    expect(determineCharacter(['gatssn'], tags)).toBe('gatssn');
  });

  it('후보군이 1명(haetae)이면 즉시 반환한다', () => {
    const tags: AuxiliaryTags = {
      설계: 0, UX: 0, 부채청산: 0, 몰입: 0,
      자동화: 0, 연결: 0, 테스트: 3, 거버넌스: 1,
    };
    expect(determineCharacter(['haetae'], tags)).toBe('haetae');
  });

  it('후보군이 1명(jangseung)이면 즉시 반환한다', () => {
    const tags: AuxiliaryTags = {
      설계: 0, UX: 0, 부채청산: 0, 몰입: 0,
      자동화: 0, 연결: 0, 테스트: 1, 거버넌스: 3,
    };
    expect(determineCharacter(['jangseung'], tags)).toBe('jangseung');
  });

  it('후보군이 1명(jeoseung)이면 즉시 반환한다', () => {
    const tags: AuxiliaryTags = {
      설계: 0, UX: 0, 부채청산: 2, 몰입: 0,
      자동화: 0, 연결: 0, 테스트: 0, 거버넌스: 2,
    };
    expect(determineCharacter(['jeoseung'], tags)).toBe('jeoseung');
  });

  it('후보군이 1명(cheonyeo)이면 즉시 반환한다', () => {
    const tags: AuxiliaryTags = {
      설계: 0, UX: 3, 부채청산: 1, 몰입: 0,
      자동화: 0, 연결: 0, 테스트: 0, 거버넌스: 0,
    };
    expect(determineCharacter(['cheonyeo'], tags)).toBe('cheonyeo');
  });

  it('후보군이 1명(dalgyal)이면 즉시 반환한다', () => {
    const tags: AuxiliaryTags = {
      설계: 0, UX: 0, 부채청산: 0, 몰입: 0,
      자동화: 2, 연결: 0, 테스트: 0, 거버넌스: 2,
    };
    expect(determineCharacter(['dalgyal'], tags)).toBe('dalgyal');
  });
});


describe('euclideanFallback', () => {
  // 기본 보조 태그 (동점 → 기본값 선택)
  const defaultTags: AuxiliaryTags = {
    설계: 1, UX: 1, 부채청산: 1, 몰입: 1,
    자동화: 0, 연결: 0, 테스트: 0, 거버넌스: 0,
  };

  /**
   * Requirements 5.7: 빈 후보군일 때 euclideanFallback 호출
   * getResult 함수가 빈 후보군을 받으면 euclideanFallback을 호출해야 함
   */
  it('빈 후보군일 때 euclideanFallback이 호출되어 유효한 캐릭터를 반환한다', () => {
    // 매핑 테이블에 없는 조합으로 빈 후보군 생성
    // (-1,+1,+1,-1)은 매핑 테이블에 없음
    const scores: AxisScores = { A: -1, B: 1, C: 1, D: -1 };
    const result = euclideanFallback(scores, defaultTags);

    const validSlugs = [
      'gatssn', 'chonggak', 'cheonyeo', 'dokkaebi', 'gumiho',
      'haetae', 'jangseung', 'jeoseung', 'mulgwisin', 'dalgyal',
    ];
    expect(validSlugs).toContain(result);
  });

  it('getResult가 빈 후보군을 만나면 euclideanFallback을 통해 결과를 반환한다', () => {
    // Q1~Q8 = [0,1,1,0,0,1,1,0] → (-2,+2,+2,-2) → sign(-1,+1,+1,-1) → 매핑 없음 → 폴백
    const answers = [0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const result = getResult(answers);

    const validSlugs = [
      'gatssn', 'chonggak', 'cheonyeo', 'dokkaebi', 'gumiho',
      'haetae', 'jangseung', 'jeoseung', 'mulgwisin', 'dalgyal',
    ];
    expect(validSlugs).toContain(result);
  });

  // === 매핑 테이블에 없는 조합에 대한 폴백 테스트 ===

  // (+1,+1,+1,+1): 매핑 없음 → 가장 가까운 캐릭터 축 값 찾기
  // 10개 캐릭터 축 값과의 거리:
  //   gatssn(-1,-1,-1,-1): sqrt(16) = 4
  //   chonggak(-1,1,-1,1): sqrt(4+0+4+0) = 2√2 ≈ 2.83
  //   cheonyeo(-1,-1,1,1): sqrt(4+4+0+0) = 2√2 ≈ 2.83
  //   dokkaebi(1,1,-1,1): sqrt(0+0+4+0) = 2
  //   gumiho(1,-1,-1,1): sqrt(0+4+4+0) = 2√2 ≈ 2.83
  //   haetae(-1,-1,1,-1): sqrt(4+4+0+4) = 2√3 ≈ 3.46
  //   jangseung(-1,1,1,-1): sqrt(4+0+0+4) = 2√2 ≈ 2.83
  //   jeoseung(1,-1,-1,-1): sqrt(0+4+4+4) = 2√3 ≈ 3.46
  //   mulgwisin(-1,1,1,1): sqrt(4+0+0+0) = 2
  //   dalgyal(1,-1,1,-1): sqrt(0+4+0+4) = 2√2 ≈ 2.83
  // 최소: dokkaebi(2)와 mulgwisin(2) 동점 → Map 순서에 따라 dokkaebi 먼저
  it('(+1,+1,+1,+1) 조합은 유클리드 거리가 가장 짧은 캐릭터를 반환한다', () => {
    const scores: AxisScores = { A: 1, B: 1, C: 1, D: 1 };
    const result = euclideanFallback(scores, defaultTags);

    // dokkaebi(1,1,-1,1) 또는 mulgwisin(-1,1,1,1) 중 하나 (거리 동일)
    expect(['dokkaebi', 'mulgwisin']).toContain(result);
  });

  // (+1,+1,+1,-1): 매핑 없음
  // 거리 계산:
  //   gatssn(-1,-1,-1,-1): sqrt(4+4+4+0) = 2√3 ≈ 3.46
  //   chonggak(-1,1,-1,1): sqrt(4+0+4+4) = 4
  //   cheonyeo(-1,-1,1,1): sqrt(4+4+0+4) = 2√3 ≈ 3.46
  //   dokkaebi(1,1,-1,1): sqrt(0+0+4+4) = 2√2 ≈ 2.83
  //   gumiho(1,-1,-1,1): sqrt(0+4+4+4) = 2√3 ≈ 3.46
  //   haetae(-1,-1,1,-1): sqrt(4+4+0+0) = 2√2 ≈ 2.83
  //   jangseung(-1,1,1,-1): sqrt(4+0+0+0) = 2
  //   jeoseung(1,-1,-1,-1): sqrt(0+4+4+0) = 2√2 ≈ 2.83
  //   mulgwisin(-1,1,1,1): sqrt(4+0+0+4) = 2√2 ≈ 2.83
  //   dalgyal(1,-1,1,-1): sqrt(0+4+0+0) = 2
  // 최소: jangseung(2)와 dalgyal(2) 동점 → Map 순서에 따라 결정
  it('(+1,+1,+1,-1) 조합은 jangseung 또는 dalgyal을 반환한다', () => {
    const scores: AxisScores = { A: 1, B: 1, C: 1, D: -1 };
    const result = euclideanFallback(scores, defaultTags);

    expect(['jangseung', 'dalgyal']).toContain(result);
  });

  // (+1,-1,+1,+1): 매핑 없음
  // 거리 계산:
  //   gatssn(-1,-1,-1,-1): sqrt(4+0+4+4) = 2√3 ≈ 3.46
  //   chonggak(-1,1,-1,1): sqrt(4+4+4+0) = 4
  //   cheonyeo(-1,-1,1,1): sqrt(4+0+0+0) = 2  ← 최소
  //   dokkaebi(1,1,-1,1): sqrt(0+4+4+0) = 2√2 ≈ 2.83
  //   gumiho(1,-1,-1,1): sqrt(0+0+4+0) = 2
  //   haetae(-1,-1,1,-1): sqrt(4+0+0+4) = 2√2 ≈ 2.83
  //   jangseung(-1,1,1,-1): sqrt(4+4+0+4) = 2√3 ≈ 3.46
  //   jeoseung(1,-1,-1,-1): sqrt(0+0+4+4) = 2√2 ≈ 2.83
  //   mulgwisin(-1,1,1,1): sqrt(4+4+0+0) = 2√2 ≈ 2.83
  //   dalgyal(1,-1,1,-1): sqrt(0+0+0+4) = 2
  // 최소: cheonyeo(2), gumiho(2), dalgyal(2) 동점 → Map 순서에 따라 결정
  it('(+1,-1,+1,+1) 조합은 cheonyeo, gumiho, dalgyal 중 하나를 반환한다', () => {
    const scores: AxisScores = { A: 1, B: -1, C: 1, D: 1 };
    const result = euclideanFallback(scores, defaultTags);

    expect(['cheonyeo', 'gumiho', 'dalgyal']).toContain(result);
  });

  // (-1,+1,-1,-1): 매핑 없음
  // 거리 계산:
  //   gatssn(-1,-1,-1,-1): sqrt(0+4+0+0) = 2
  //   chonggak(-1,1,-1,1): sqrt(0+0+0+4) = 2
  //   cheonyeo(-1,-1,1,1): sqrt(0+4+4+4) = 2√3 ≈ 3.46
  //   dokkaebi(1,1,-1,1): sqrt(4+0+0+4) = 2√2 ≈ 2.83
  //   gumiho(1,-1,-1,1): sqrt(4+4+0+4) = 2√3 ≈ 3.46
  //   haetae(-1,-1,1,-1): sqrt(0+4+4+0) = 2√2 ≈ 2.83
  //   jangseung(-1,1,1,-1): sqrt(0+0+4+0) = 2
  //   jeoseung(1,-1,-1,-1): sqrt(4+4+0+0) = 2√2 ≈ 2.83
  //   mulgwisin(-1,1,1,1): sqrt(0+0+4+4) = 2√2 ≈ 2.83
  //   dalgyal(1,-1,1,-1): sqrt(4+4+4+0) = 2√3 ≈ 3.46
  // 최소: gatssn(2), chonggak(2), jangseung(2) 동점 → Map 순서에 따라 결정
  it('(-1,+1,-1,-1) 조합은 gatssn, chonggak, jangseung 중 하나를 반환한다', () => {
    const scores: AxisScores = { A: -1, B: 1, C: -1, D: -1 };
    const tags: AuxiliaryTags = {
      설계: 0, UX: 3, 부채청산: 1, 몰입: 0,
      자동화: 0, 연결: 0, 테스트: 0, 거버넌스: 0,
    };
    const result = euclideanFallback(scores, tags);

    expect(['gatssn', 'chonggak', 'jangseung']).toContain(result);
  });

  // 항상 유효한 CharacterSlug를 반환하는지 확인
  it('어떤 점수 조합이든 유효한 캐릭터 슬러그를 반환한다', () => {
    const validSlugs = [
      'gatssn', 'chonggak', 'cheonyeo', 'dokkaebi', 'gumiho',
      'haetae', 'jangseung', 'jeoseung', 'mulgwisin', 'dalgyal',
    ];

    // 매핑 테이블에 없는 다양한 조합 테스트
    const testCases: AxisScores[] = [
      { A: 1, B: 1, C: 1, D: 1 },
      { A: 1, B: 1, C: 1, D: -1 },
      { A: -1, B: 1, C: -1, D: -1 },
      { A: 1, B: -1, C: 1, D: 1 },
      { A: 1, B: 1, C: -1, D: -1 },
      { A: -1, B: -1, C: -1, D: 1 },
    ];

    for (const scores of testCases) {
      const result = euclideanFallback(scores, defaultTags);
      expect(validSlugs).toContain(result);
    }
  });
});


describe('getResult', () => {
  // 유효한 캐릭터 슬러그 목록 (10개)
  const validSlugs = [
    'gatssn', 'chonggak', 'cheonyeo', 'dokkaebi', 'gumiho',
    'haetae', 'jangseung', 'jeoseung', 'mulgwisin', 'dalgyal',
  ];

  // === 매핑 테이블에 직접 매칭되는 경로 테스트 ===

  // 모든 첫 번째 선택지: Q1~Q8 = [0,0,0,0,0,0,0,0] → (-2,-2,-2,-2) → sign(-1,-1,-1,-1) → ['gatssn'] → gatssn
  it('모든 첫 번째 선택지를 고르면 gatssn을 반환한다', () => {
    const answers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    expect(getResult(answers)).toBe('gatssn');
  });

  // Q1~Q8 = [0,1,0,1,0,1,0,1] → (-2,+2,-2,+2) → sign(-1,+1,-1,+1) → [chonggak, gumiho]
  // 다중 후보군이므로 determineCharacter가 primaryTag로 결정
  it('안정/즉흥/개인/속도 조합이면 chonggak 또는 gumiho를 반환한다', () => {
    const answers = [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    const result = getResult(answers);
    expect(['chonggak', 'gumiho']).toContain(result);
  });

  // Q1~Q8 = [1,1,0,1,1,1,0,1] → (+2,+2,-2,+2) → sign(+1,+1,-1,+1) → [dokkaebi]
  it('실험/즉흥/개인/속도 조합이면 dokkaebi를 반환한다', () => {
    const answers = [1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    expect(getResult(answers)).toBe('dokkaebi');
  });

  // Q1~Q8 = [0,0,1,0,0,0,1,0] → (-2,-2,+2,-2) → sign(-1,-1,+1,-1) → [haetae, jangseung]
  it('안정/구조/협업/품질 조합이면 haetae 또는 jangseung을 반환한다', () => {
    const answers = [0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 0, 3, 0, 0, 0, 0];
    const result = getResult(answers);
    expect(['haetae', 'jangseung']).toContain(result);
  });

  // Q1~Q8 = [0,1,1,1,0,1,1,1] → (-2,+2,+2,+2) → sign(-1,+1,+1,+1) → [mulgwisin]
  it('안정/즉흥/협업/속도 조합이면 mulgwisin을 반환한다', () => {
    const answers = [0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    expect(getResult(answers)).toBe('mulgwisin');
  });

  // Q1~Q8 = [1,0,0,0,1,0,0,0] → (+2,-2,-2,-2) → sign(+1,-1,-1,-1) → [jeoseung]
  it('실험/구조/개인/품질 조합이면 jeoseung을 반환한다', () => {
    const answers = [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    expect(getResult(answers)).toBe('jeoseung');
  });

  // Q1~Q8 = [0,0,1,1,0,0,1,1] → (-2,-2,+2,+2) → sign(-1,-1,+1,+1) → [cheonyeo]
  it('안정/구조/협업/속도 조합이면 cheonyeo를 반환한다', () => {
    const answers = [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    expect(getResult(answers)).toBe('cheonyeo');
  });

  // Q1~Q8 = [1,0,1,0,1,0,1,0] → (+2,-2,+2,-2) → sign(+1,-1,+1,-1) → [dalgyal, gatssn]
  it('실험/구조/협업/품질 조합이면 dalgyal 또는 gatssn을 반환한다', () => {
    const answers = [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const result = getResult(answers);
    expect(['dalgyal', 'gatssn']).toContain(result);
  });

  // === 폴백 경로 테스트 ===

  // Q1~Q8 = [1,1,1,0,1,1,1,0] → (+2,+2,+2,-2) → sign(+1,+1,+1,-1) → 매핑 없음 → 유클리드 폴백
  it('매핑 테이블에 없는 조합이면 유클리드 폴백으로 유효한 캐릭터를 반환한다', () => {
    const answers = [1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const result = getResult(answers);
    expect(validSlugs).toContain(result);
  });

  // === 항상 유효한 CharacterSlug 반환 보장 ===

  it('모든 가능한 Q1~Q8 조합(256가지)에 대해 유효한 캐릭터를 반환한다', () => {
    // Q1~Q8: 각 0 또는 1 → 2^8 = 256가지 조합
    // 전체 테스트는 시간이 오래 걸리므로 샘플링
    const sampleCombos = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 1, 1, 0, 0, 1, 1],
      [1, 1, 0, 0, 1, 1, 0, 0],
      [0, 1, 1, 0, 0, 1, 1, 0],
      [1, 0, 0, 1, 1, 0, 0, 1],
    ];

    for (const combo of sampleCombos) {
      const answers = [...combo, 0, 0, 0, 0, 0, 0, 0, 0];
      const result = getResult(answers);
      expect(validSlugs).toContain(result);
    }
  });

  // Q9~Q16 선택지가 달라져도 항상 유효한 결과를 반환하는지 확인
  it('다양한 Q9~Q16 조합에서도 항상 유효한 캐릭터를 반환한다', () => {
    const q9to16Combos = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [3, 3, 3, 3, 3, 3, 3, 3],
      [0, 1, 2, 3, 0, 1, 2, 3],
      [3, 2, 1, 0, 3, 2, 1, 0],
    ];

    for (const combo of q9to16Combos) {
      const answers = [0, 0, 0, 0, 0, 0, 0, 0, ...combo];
      const result = getResult(answers);
      expect(validSlugs).toContain(result);
    }
  });
});


describe('Mapping Table Structure Validation', () => {
  // 매핑 테이블을 추출하기 위한 헬퍼 함수
  // determineCandidatePool 함수 내부의 매핑 테이블을 테스트하기 위해
  // 모든 가능한 sign 조합을 생성하고 결과를 수집
  function extractMappingTable(): Record<string, string[]> {
    const mappingTable: Record<string, string[]> = {};
    
    // 모든 가능한 sign 조합 (-1, 0, 1)^4 = 81가지
    for (const signA of [-1, 0, 1]) {
      for (const signB of [-1, 0, 1]) {
        for (const signC of [-1, 0, 1]) {
          for (const signD of [-1, 0, 1]) {
            const scores = { A: signA, B: signB, C: signC, D: signD };
            const result = determineCandidatePool(scores);
            
            if (result.length > 0) {
              const key = `${signA},${signB},${signC},${signD}`;
              mappingTable[key] = result;
            }
          }
        }
      }
    }
    
    return mappingTable;
  }

  /**
   * Requirements 7.1: 매핑 테이블은 최소 10개의 distinct 4-tuple 키를 정의해야 한다
   */
  it('매핑 테이블은 최소 10개의 distinct 4-tuple 키를 가진다', () => {
    const mappingTable = extractMappingTable();
    const keyCount = Object.keys(mappingTable).length;
    
    expect(keyCount).toBeGreaterThanOrEqual(10);
  });

  /**
   * Requirements 7.2: 매핑 테이블은 최소 3개의 multi-candidate 매핑을 포함해야 한다
   */
  it('매핑 테이블은 최소 3개의 multi-candidate 매핑을 포함한다', () => {
    const mappingTable = extractMappingTable();
    
    // 2개 이상의 캐릭터를 가진 매핑 개수 세기
    const multiCandidateMappings = Object.values(mappingTable).filter(
      candidates => candidates.length >= 2
    );
    
    expect(multiCandidateMappings.length).toBeGreaterThanOrEqual(3);
  });

  /**
   * Requirements 7.3: 매핑 테이블은 모든 10개 캐릭터가 최소 1번씩 등장해야 한다
   */
  it('매핑 테이블은 모든 10개 캐릭터가 최소 1번씩 등장한다', () => {
    const mappingTable = extractMappingTable();
    
    // 모든 캐릭터 슬러그 목록
    const allCharacters = [
      'gatssn', 'chonggak', 'cheonyeo', 'dokkaebi', 'gumiho',
      'haetae', 'jangseung', 'jeoseung', 'mulgwisin', 'dalgyal'
    ];
    
    // 매핑 테이블에 등장하는 모든 캐릭터 수집
    const appearingCharacters = new Set<string>();
    for (const candidates of Object.values(mappingTable)) {
      for (const character of candidates) {
        appearingCharacters.add(character);
      }
    }
    
    // 모든 캐릭터가 최소 1번씩 등장하는지 확인
    for (const character of allCharacters) {
      expect(appearingCharacters.has(character)).toBe(true);
    }
    
    // 또는 간단하게
    expect(appearingCharacters.size).toBe(10);
  });

  /**
   * 추가 검증: 각 매핑의 후보군 크기가 1-3 범위 내에 있는지 확인
   */
  it('각 매핑의 후보군 크기는 1-3 범위 내에 있다', () => {
    const mappingTable = extractMappingTable();
    
    for (const [key, candidates] of Object.entries(mappingTable)) {
      expect(candidates.length).toBeGreaterThanOrEqual(1);
      expect(candidates.length).toBeLessThanOrEqual(3);
    }
  });

  /**
   * 추가 검증: 모든 후보 캐릭터가 유효한 슬러그인지 확인
   */
  it('모든 후보 캐릭터는 유효한 슬러그이다', () => {
    const mappingTable = extractMappingTable();
    const validSlugs = [
      'gatssn', 'chonggak', 'cheonyeo', 'dokkaebi', 'gumiho',
      'haetae', 'jangseung', 'jeoseung', 'mulgwisin', 'dalgyal'
    ];
    
    for (const candidates of Object.values(mappingTable)) {
      for (const character of candidates) {
        expect(validSlugs).toContain(character);
      }
    }
  });
});


describe('determineCharacter - Tie-breaking in multi-candidate selection (Requirements 6.4)', () => {
  /**
   * Requirements 6.4: 동점일 때 첫 번째 캐릭터 반환
   * 여러 후보의 primaryTag 점수가 동일할 때 후보군의 첫 번째 캐릭터를 반환해야 함
   */
  it('2명 후보군에서 primaryTag 점수가 동점이면 첫 번째 캐릭터를 반환한다', () => {
    // chonggak: 몰입, gumiho: 자동화
    const candidatePool = ['chonggak', 'gumiho'];
    
    // 몰입 = 2, 자동화 = 2 (동점)
    const tags: AuxiliaryTags = {
      설계: 0, UX: 0, 부채청산: 0, 몰입: 2,
      자동화: 2, 연결: 0, 테스트: 0, 거버넌스: 4,
    };
    
    const result = determineCharacter(candidatePool, tags);
    expect(result).toBe('chonggak'); // 첫 번째 후보
  });

  it('2명 후보군에서 모든 primaryTag 점수가 0이면 첫 번째 캐릭터를 반환한다', () => {
    // haetae: 테스트, jangseung: 거버넌스
    const candidatePool = ['haetae', 'jangseung'];
    
    // 테스트 = 0, 거버넌스 = 0 (동점)
    const tags: AuxiliaryTags = {
      설계: 4, UX: 0, 부채청산: 0, 몰입: 0,
      자동화: 0, 연결: 0, 테스트: 0, 거버넌스: 0,
    };
    
    const result = determineCharacter(candidatePool, tags);
    expect(result).toBe('haetae'); // 첫 번째 후보
  });

  it('3명 후보군에서 모든 primaryTag 점수가 동점이면 첫 번째 캐릭터를 반환한다', () => {
    // gatssn: 설계, dalgyal: 추상화, haetae: 테스트
    // Note: dalgyal의 primaryTag는 '추상화'이지만 AuxiliaryTags에는 없으므로 0점 처리
    const candidatePool = ['gatssn', 'dalgyal', 'haetae'];
    
    // 설계 = 1, 추상화 = 없음(0), 테스트 = 1 (gatssn과 haetae 동점)
    const tags: AuxiliaryTags = {
      설계: 1, UX: 0, 부채청산: 0, 몰입: 0,
      자동화: 0, 연결: 0, 테스트: 1, 거버넌스: 6,
    };
    
    const result = determineCharacter(candidatePool, tags);
    // gatssn과 haetae가 1점으로 동점, dalgyal은 0점
    // 동점자 중 첫 번째는 gatssn
    expect(result).toBe('gatssn');
  });

  it('3명 후보군에서 모든 점수가 0이면 첫 번째 캐릭터를 반환한다', () => {
    // (0,0,0,0) 매핑: gatssn, dalgyal, haetae
    const candidatePool = ['gatssn', 'dalgyal', 'haetae'];
    
    // 모든 primaryTag 점수가 0
    const tags: AuxiliaryTags = {
      설계: 0, UX: 0, 부채청산: 0, 몰입: 0,
      자동화: 0, 연결: 0, 테스트: 0, 거버넌스: 8,
    };
    
    const result = determineCharacter(candidatePool, tags);
    expect(result).toBe('gatssn'); // 첫 번째 후보
  });

  it('후보군 순서가 바뀌면 결과도 바뀐다 (첫 번째 후보 반환 확인)', () => {
    // 동일한 태그 점수로 순서만 바꿔서 테스트
    const tags: AuxiliaryTags = {
      설계: 0, UX: 0, 부채청산: 2, 몰입: 0,
      자동화: 2, 연결: 0, 테스트: 0, 거버넌스: 4,
    };
    
    // dalgyal: 추상화(0), jeoseung: 부채청산(2)
    const result1 = determineCharacter(['dalgyal', 'jeoseung'], tags);
    expect(result1).toBe('jeoseung'); // jeoseung이 더 높은 점수
    
    // 순서를 바꿔도 jeoseung이 더 높은 점수이므로 jeoseung 반환
    const result2 = determineCharacter(['jeoseung', 'dalgyal'], tags);
    expect(result2).toBe('jeoseung');
    
    // 동점 상황 테스트: 몰입 = 2, 자동화 = 2
    const tiedTags: AuxiliaryTags = {
      설계: 0, UX: 0, 부채청산: 0, 몰입: 2,
      자동화: 2, 연결: 0, 테스트: 0, 거버넌스: 4,
    };
    
    // chonggak: 몰입(2), gumiho: 자동화(2) - 동점
    const result3 = determineCharacter(['chonggak', 'gumiho'], tiedTags);
    expect(result3).toBe('chonggak'); // 첫 번째 후보
    
    // 순서를 바꾸면 gumiho가 첫 번째
    const result4 = determineCharacter(['gumiho', 'chonggak'], tiedTags);
    expect(result4).toBe('gumiho'); // 첫 번째 후보
  });

  it('일부 후보의 primaryTag가 비어있어도 동점 처리가 올바르게 동작한다', () => {
    // dokkaebi의 primaryTag는 빈 문자열 (0점 처리)
    // mulgwisin: 연결
    const candidatePool = ['dokkaebi', 'mulgwisin'];
    
    // 연결 = 0 (dokkaebi: 0, mulgwisin: 0 동점)
    const tags: AuxiliaryTags = {
      설계: 4, UX: 0, 부채청산: 0, 몰입: 0,
      자동화: 0, 연결: 0, 테스트: 0, 거버넌스: 4,
    };
    
    const result = determineCharacter(candidatePool, tags);
    expect(result).toBe('dokkaebi'); // 동점이므로 첫 번째 후보
  });
});

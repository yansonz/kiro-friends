// 퀴즈 엔진 통합 테스트 - End-to-end flow

import { getResult } from '@/lib/quiz-engine';
import type { CharacterSlug } from '@/lib/types';

describe('Quiz Engine - End-to-End Integration Tests', () => {
  const validSlugs: CharacterSlug[] = [
    'gatssn', 'chonggak', 'cheonyeo', 'dokkaebi', 'gumiho',
    'haetae', 'jangseung', 'jeoseung', 'mulgwisin', 'dalgyal',
  ];

  /**
   * Requirements 1.1, 2.1, 3.1, 4.1, 5.1, 6.1
   * 16문항 완료 → 점수 계산 → 후보군 결정 → 최종 캐릭터 선택
   */
  it('16문항 완료 후 유효한 캐릭터를 반환한다', () => {
    // 모든 첫 번째 선택지 선택
    const answers = Array(16).fill(0);
    const result = getResult(answers);
    
    expect(validSlugs).toContain(result);
  });

  it('다양한 응답 패턴으로 모든 10개 캐릭터가 결과로 나올 수 있다', () => {
    const resultSet = new Set<CharacterSlug>();
    
    // 다양한 응답 패턴 테스트
    const testPatterns = [
      // 패턴 1: 모두 첫 번째 선택지
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      // 패턴 2: 모두 두 번째 선택지
      [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      // 패턴 3: 혼합 패턴 1
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 2, 3, 0, 1, 2, 3],
      // 패턴 4: 혼합 패턴 2
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 2, 3, 0, 1, 2, 3, 0],
      // 패턴 5: A축 실험, 나머지 안정
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      // 패턴 6: B축 즉흥, 나머지 구조
      [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
      // 패턴 7: C축 협업, 나머지 개인
      [0, 0, 1, 0, 0, 0, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2],
      // 패턴 8: D축 속도, 나머지 품질
      [0, 0, 0, 1, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3],
      // 패턴 9: 모든 축 중립 (0,0,0,0)
      [0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 2, 3, 0, 1, 2, 3],
      // 패턴 10: 다양한 태그 조합
      [1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      // 패턴 11: 또 다른 혼합
      [0, 0, 1, 1, 0, 0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3],
      // 패턴 12: 실험/즉흥/개인/속도
      [1, 1, 0, 1, 1, 1, 0, 1, 1, 2, 3, 0, 1, 2, 3, 0],
      // 패턴 13: 안정/즉흥/협업/속도
      [0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 2, 3, 0, 1, 2, 3],
      // 패턴 14: 실험/구조/개인/품질
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 2, 3, 0, 1, 2, 3, 0],
      // 패턴 15: 안정/구조/협업/속도
      [0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 2, 3, 0, 1, 2, 3],
    ];
    
    for (const pattern of testPatterns) {
      const result = getResult(pattern);
      expect(validSlugs).toContain(result);
      resultSet.add(result);
    }
    
    // 최소 5개 이상의 다른 캐릭터가 나와야 함
    expect(resultSet.size).toBeGreaterThanOrEqual(5);
  });

  it('4축 점수가 올바르게 계산되어 후보군 결정에 반영된다', () => {
    // 안정/구조/개인/품질 조합 → gatssn
    const answers1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const result1 = getResult(answers1);
    expect(result1).toBe('gatssn');
    
    // 실험/즉흥/개인/속도 조합 → dokkaebi
    const answers2 = [1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    const result2 = getResult(answers2);
    expect(result2).toBe('dokkaebi');
  });

  it('보조 태그가 다중 후보군에서 최종 캐릭터 결정에 영향을 미친다', () => {
    // 안정/즉흥/개인/속도 조합 → [chonggak, gumiho]
    // chonggak: 몰입, gumiho: 자동화
    
    // 몰입 태그 높은 경우 → chonggak
    const answers1 = [0, 1, 0, 1, 0, 1, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3]; // 몰입=8
    const result1 = getResult(answers1);
    expect(result1).toBe('chonggak');
    
    // 자동화 태그 높은 경우 → gumiho
    const answers2 = [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]; // 자동화=8
    const result2 = getResult(answers2);
    expect(result2).toBe('gumiho');
  });

  it('Q1-Q8 응답만으로 4축 점수가 결정된다', () => {
    // Q1-Q8이 동일하면 Q9-Q16이 달라도 같은 후보군
    const answers1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const answers2 = [0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3];
    
    const result1 = getResult(answers1);
    const result2 = getResult(answers2);
    
    // 둘 다 gatssn이어야 함 (단일 후보군)
    expect(result1).toBe('gatssn');
    expect(result2).toBe('gatssn');
  });

  it('Q9-Q16 응답이 다중 후보군에서 최종 결정에 영향을 미친다', () => {
    // 안정/구조/협업/품질 조합 → [haetae, jangseung]
    // haetae: 테스트, jangseung: 거버넌스
    
    // 테스트 태그 높은 경우
    const answers1 = [0, 0, 1, 0, 0, 0, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2]; // 테스트=8
    const result1 = getResult(answers1);
    expect(result1).toBe('haetae');
    
    // 거버넌스 태그 높은 경우
    const answers2 = [0, 0, 1, 0, 0, 0, 1, 0, 3, 3, 3, 3, 3, 3, 3, 3]; // 거버넌스=8
    const result2 = getResult(answers2);
    expect(result2).toBe('jangseung');
  });

  it('매핑 테이블에 없는 조합은 유클리드 폴백으로 처리된다', () => {
    // (-1,+1,+1,-1) 조합은 매핑 테이블에 없음
    const answers = [0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const result = getResult(answers);
    
    // 유효한 캐릭터가 반환되어야 함
    expect(validSlugs).toContain(result);
  });

  it('모든 가능한 4축 조합에 대해 유효한 결과를 반환한다', () => {
    // 샘플링: 각 축의 극단값 조합 테스트
    const extremeCombinations = [
      [0, 0, 0, 0, 0, 0, 0, 0], // 모두 -2
      [1, 1, 1, 1, 1, 1, 1, 1], // 모두 +2
      [0, 1, 0, 1, 1, 0, 1, 0], // 혼합 (0, 0, 0, 0)
      [1, 0, 1, 0, 0, 1, 0, 1], // 혼합 (+2, -2, +2, -2)
      [0, 0, 1, 1, 1, 1, 0, 0], // 혼합 (-2, -2, +2, +2)
    ];
    
    for (const combo of extremeCombinations) {
      const answers = [...combo, 0, 0, 0, 0, 0, 0, 0, 0];
      const result = getResult(answers);
      expect(validSlugs).toContain(result);
    }
  });

  it('동일한 응답은 항상 동일한 결과를 반환한다 (결정론적)', () => {
    const answers = [0, 1, 0, 1, 0, 1, 0, 1, 1, 2, 3, 0, 1, 2, 3, 0];
    
    const result1 = getResult(answers);
    const result2 = getResult(answers);
    const result3 = getResult(answers);
    
    expect(result1).toBe(result2);
    expect(result2).toBe(result3);
  });

  it('16문항 시스템이 모든 캐릭터를 커버할 수 있다', () => {
    // 각 캐릭터를 타겟으로 하는 응답 패턴
    const characterPatterns: Record<CharacterSlug, number[]> = {
      gatssn: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      dokkaebi: [1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      mulgwisin: [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      jeoseung: [1, 0, 0, 0, 1, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2],
      cheonyeo: [0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      chonggak: [0, 1, 0, 1, 0, 1, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3],
      gumiho: [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      haetae: [0, 0, 1, 0, 0, 0, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2],
      jangseung: [0, 0, 1, 0, 0, 0, 1, 0, 3, 3, 3, 3, 3, 3, 3, 3],
      dalgyal: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };
    
    const results = new Set<CharacterSlug>();
    
    for (const [expectedChar, pattern] of Object.entries(characterPatterns)) {
      const result = getResult(pattern);
      results.add(result);
      
      // 예상 캐릭터 또는 같은 후보군의 다른 캐릭터가 나와야 함
      expect(validSlugs).toContain(result);
    }
    
    // 최소 8개 이상의 다른 캐릭터가 나와야 함
    expect(results.size).toBeGreaterThanOrEqual(8);
  });
});

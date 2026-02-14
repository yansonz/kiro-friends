// 퀴즈 엔진 - 점수 산출 및 캐릭터 매칭 로직

import type { AxisScores, AuxiliaryTags, CharacterSlug } from '@/lib/types';
import { questions } from '@/data/questions';
import { characters } from '@/data/characters';

/**
 * 4축 점수 산출 함수
 * Q1~Q8 응답에서 각 축(A, B, C, D)에 점수를 부여한다.
 * 각 축은 2개 문항의 합으로 계산된다: A = Q1 + Q5, B = Q2 + Q6, C = Q3 + Q7, D = Q4 + Q8
 * @param answers - 전체 응답 배열 (16개 요소, 인덱스 0~15). Q1~Q8(인덱스 0~7)만 사용. 각 값은 선택한 옵션 인덱스(0 또는 1).
 * @returns 4축 점수 객체 (각 축 점수 범위: -2 ~ +2)
 */
export function calculateAxisScores(answers: number[]): AxisScores {
  const scores: AxisScores = { A: 0, B: 0, C: 0, D: 0 };

  // Q1~Q8 (인덱스 0~7)만 사용하여 4축 점수 산출
  // 각 축은 2개 문항의 axisEffect 값을 합산
  // A축: Q1(인덱스 0) + Q5(인덱스 4)
  // B축: Q2(인덱스 1) + Q6(인덱스 5)
  // C축: Q3(인덱스 2) + Q7(인덱스 6)
  // D축: Q4(인덱스 3) + Q8(인덱스 7)

  for (let i = 0; i < 8; i++) {
    const question = questions[i];
    const selectedOptionIndex = answers[i];
    const selectedOption = question.options[selectedOptionIndex];

    if (selectedOption.axisEffect) {
      const { axis, value } = selectedOption.axisEffect;
      scores[axis] += value;
    }
  }

  return scores;
}

/**
 * 후보군 결정 함수
 * 4축 점수의 부호(sign)를 기반으로 매핑 테이블에서 후보 캐릭터 풀을 결정한다.
 * 매핑 테이블에 해당하는 조합이 없으면 빈 배열을 반환한다 (유클리드 폴백 대상).
 * @param scores - 4축 점수 객체
 * @returns 후보 캐릭터 슬러그 배열 (1-3개 또는 빈 배열)
 */
export function determineCandidatePool(scores: AxisScores): CharacterSlug[] {
  // 각 축 값을 부호로 변환: <0 → -1, =0 → 0, >0 → +1
  const signA = scores.A < 0 ? -1 : scores.A === 0 ? 0 : 1;
  const signB = scores.B < 0 ? -1 : scores.B === 0 ? 0 : 1;
  const signC = scores.C < 0 ? -1 : scores.C === 0 ? 0 : 1;
  const signD = scores.D < 0 ? -1 : scores.D === 0 ? 0 : 1;

  // 4축 부호를 키 문자열로 변환하여 매핑 테이블 조회
  const key = `${signA},${signB},${signC},${signD}`;

  // 매핑 테이블 정의
  // - 단일 후보군 매핑: 7개
  // - 다중 후보군 매핑: 4개 (보조 태그로 최종 결정)
  // - 모든 10개 캐릭터가 최소 1번씩 등장
  const mappingTable: Record<string, CharacterSlug[]> = {
    // 단일 후보군 매핑 (7개)
    '-1,-1,-1,-1': ['gatssn'],       // 안정, 구조, 개인, 품질 → 설계
    '1,1,-1,1': ['dokkaebi'],        // 실험, 즉흥, 개인, 속도 → 실험 개척자
    '-1,1,1,1': ['mulgwisin'],       // 안정, 즉흥, 협업, 속도 → 연결
    '1,-1,-1,-1': ['jeoseung'],      // 실험, 구조, 개인, 품질 → 부채청산
    '-1,-1,1,1': ['cheonyeo'],       // 안정, 구조, 협업, 속도 → UX
    '1,1,1,1': ['dokkaebi'],         // 실험, 즉흥, 협업, 속도 → 실험 개척자
    '1,1,-1,-1': ['dokkaebi'],       // 실험, 즉흥, 개인, 품질 → 실험 개척자
    
    // 다중 후보군 매핑 (4개, primaryTag로 최종 결정)
    '-1,1,-1,1': ['chonggak', 'gumiho'],  // 안정, 즉흥, 개인, 속도
                                           // chonggak: 몰입, gumiho: 자동화
    '-1,-1,1,-1': ['haetae', 'jangseung'], // 안정, 구조, 협업, 품질
                                            // haetae: 테스트, jangseung: 거버넌스
    '1,-1,1,-1': ['dalgyal', 'jeoseung'],  // 실험, 구조, 협업, 품질
                                            // dalgyal: 추상화, jeoseung: 부채청산
    '1,-1,1,1': ['dalgyal', 'mulgwisin'],  // 실험, 구조, 협업, 속도
                                            // dalgyal: 추상화, mulgwisin: 연결
    
    // 0 값 포함 매핑 (3개)
    '0,-1,-1,-1': ['gatssn', 'jeoseung'], // A축 중립, 구조, 개인, 품질
                                           // gatssn: 설계, jeoseung: 부채청산
    '-1,0,1,-1': ['haetae', 'cheonyeo'],  // B축 중립, 안정, 협업, 품질
                                           // haetae: 테스트, cheonyeo: UX
    '0,0,0,0': ['gatssn', 'dalgyal', 'haetae'], // 모든 축 중립 (3-way tie)
                                                 // gatssn: 설계, dalgyal: 추상화, haetae: 테스트
  };

  return mappingTable[key] ?? [];
}

/**
 * 보조 태그 집계 함수
 * Q9~Q16 응답에서 각 선택지에 해당하는 보조 태그 점수를 집계한다.
 * @param answers - 전체 응답 배열 (16개 요소, 인덱스 0~15). Q9~Q16(인덱스 8~15)만 사용.
 * @returns 8개 보조 태그별 점수 객체 (각 태그 점수 범위: 0 ~ 4)
 */
export function calculateAuxiliaryTags(answers: number[]): AuxiliaryTags {
  const tags: AuxiliaryTags = {
    설계: 0,
    UX: 0,
    부채청산: 0,
    몰입: 0,
    자동화: 0,
    연결: 0,
    테스트: 0,
    거버넌스: 0,
  };

  // Q9~Q16 (인덱스 8~15)만 사용하여 보조 태그 집계
  for (let i = 8; i < 16; i++) {
    const question = questions[i];
    const selectedOptionIndex = answers[i];
    const selectedOption = question.options[selectedOptionIndex];

    if (selectedOption.tagEffect) {
      const tagName = selectedOption.tagEffect as keyof AuxiliaryTags;
      tags[tagName] += 1;
    }
  }

  return tags;
}

/**
 * 최종 캐릭터 결정 함수
 * 후보군과 보조 태그 점수를 기반으로 최종 캐릭터를 결정한다.
 *
 * - 후보군이 1명이면 즉시 반환
 * - 후보군이 2명 이상이면 각 캐릭터의 primaryTag 점수를 비교하여 최고점 캐릭터 선택
 * - 동점이면 후보군의 첫 번째 캐릭터 반환
 *
 * @param candidatePool - 후보 캐릭터 슬러그 배열
 * @param tags - 보조 태그 점수 객체
 * @returns 최종 결정된 캐릭터 슬러그
 */
export function determineCharacter(
  candidatePool: CharacterSlug[],
  tags: AuxiliaryTags
): CharacterSlug {
  // 후보군이 비어있으면 첫 번째 캐릭터 반환 (폴백)
  if (candidatePool.length === 0) {
    return characters[0].slug;
  }

  // 후보군이 1명이면 즉시 반환
  if (candidatePool.length === 1) {
    return candidatePool[0];
  }

  // 후보군이 2명 이상이면 primaryTag 점수로 결정
  let maxScore = -1;
  let selectedCharacter = candidatePool[0];

  for (const slug of candidatePool) {
    const character = characters.find((c) => c.slug === slug);
    if (!character) {
      // 캐릭터를 찾을 수 없으면 건너뛰기
      continue;
    }

    // primaryTag 점수 조회 (빈 문자열이거나 유효하지 않은 태그면 0점)
    const primaryTag = character.primaryTag as keyof AuxiliaryTags;
    const score = primaryTag && tags[primaryTag] !== undefined ? tags[primaryTag] : 0;

    // 더 높은 점수를 가진 캐릭터로 업데이트
    if (score > maxScore) {
      maxScore = score;
      selectedCharacter = slug;
    }
    // 동점이면 첫 번째 캐릭터 유지 (아무 작업도 하지 않음)
  }

  return selectedCharacter;
}




/**
 * 유클리드 폴백 함수
 * 4축 조합이 사전 정의된 매핑 테이블에 없을 때, 유클리드 거리 기반으로 가장 가까운 캐릭터를 찾는다.
 *
 * 알고리즘:
 * 1. 모든 캐릭터와 사용자 점수 간 유클리드 거리 계산
 * 2. 최소 거리의 캐릭터들을 찾음 (동점 가능)
 * 3. 동점이면 보조 태그의 primaryTag 점수로 최종 결정
 *
 * @param scores - 사용자의 4축 점수
 * @param tags - 보조 태그 점수 객체
 * @returns 최종 결정된 캐릭터 슬러그
 */
export function euclideanFallback(
  scores: AxisScores,
  tags: AuxiliaryTags
): CharacterSlug {
  // 모든 캐릭터와의 유클리드 거리 계산
  let minDistance = Infinity;
  const nearestCharacters: CharacterSlug[] = [];

  for (const character of characters) {
    const { A, B, C, D } = character.axisValues;
    const distance = Math.sqrt(
      (scores.A - A) ** 2 +
      (scores.B - B) ** 2 +
      (scores.C - C) ** 2 +
      (scores.D - D) ** 2
    );

    if (distance < minDistance) {
      // 더 가까운 캐릭터 발견 - 리스트 초기화
      minDistance = distance;
      nearestCharacters.length = 0;
      nearestCharacters.push(character.slug);
    } else if (distance === minDistance) {
      // 동점 캐릭터 추가
      nearestCharacters.push(character.slug);
    }
  }

  // 가장 가까운 캐릭터가 1명이면 즉시 반환
  if (nearestCharacters.length === 1) {
    return nearestCharacters[0];
  }

  // 여러 명이면 보조 태그로 최종 결정
  return determineCharacter(nearestCharacters, tags);
}

/**
 * 메인 엔트리 함수 - 전체 응답에서 최종 캐릭터를 결정한다.
 *
 * 파이프라인:
 * 1. Q1~Q8 응답으로 4축 점수 산출
 * 2. 4축 점수로 후보군 결정
 * 3. Q9~Q16 응답으로 보조 태그 집계
 * 4. 후보군이 비어있으면 유클리드 폴백 실행
 * 5. 후보군이 있으면 보조 태그로 최종 캐릭터 결정
 *
 * @param answers - 16문항 응답 배열 (인덱스 0~15, 각 값은 선택한 옵션 인덱스)
 * @returns 최종 결정된 캐릭터 슬러그
 */
export function getResult(answers: number[]): CharacterSlug {
  // 1단계: 4축 점수 산출 (Q1~Q8)
  const scores = calculateAxisScores(answers);

  // 2단계: 후보군 결정
  const candidatePool = determineCandidatePool(scores);

  // 3단계: 보조 태그 집계 (Q9~Q16)
  const tags = calculateAuxiliaryTags(answers);

  // 4단계: 후보군이 비어있으면 유클리드 폴백, 아니면 보조 태그로 최종 결정
  if (candidatePool.length === 0) {
    return euclideanFallback(scores, tags);
  }

  return determineCharacter(candidatePool, tags);
}


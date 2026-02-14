'use client';

// 퀴즈 페이지 - 16문항 순차 표시 및 응답 수집
// 선택지 클릭 → 응답 저장 → 다음 질문 → 마지막 질문 시 결과 페이지로 이동

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/data/questions';
import { getResult } from '@/lib/quiz-engine';
import ProgressBar from '@/components/ProgressBar';
import { useTranslation } from '@/lib/hooks/useTranslation';
import Image from 'next/image';
import { trackQuizStart, trackQuizQuestion, trackQuizAnswer, trackQuizComplete } from '@/lib/analytics';

/** 전체 질문 수 */
const TOTAL_QUESTIONS = 16;

// 캐릭터 이미지 목록
const characterImages = [
  'gatssn', 'chonggak', 'cheonyeo', 'dokkaebi', 'gumiho',
  'haetae', 'jangseung', 'jeoseung', 'mulgwisin', 'dalgyal'
];

// 떠다니는 캐릭터 생성
interface FloatingCharacter {
  id: number;
  image: string;
  x: number;
  y: number;
  duration: number;
  delay: number;
  size: number;
}

export default function QuizPage() {
  const router = useRouter();
  const { locale, t } = useTranslation();
  // 현재 질문 인덱스 (0~15)
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // 16개 응답 저장 배열
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(TOTAL_QUESTIONS).fill(null)
  );
  const [floatingCharacters, setFloatingCharacters] = useState<FloatingCharacter[]>([]);

  // 퀴즈 시작 추적 (최초 1회만)
  useEffect(() => {
    trackQuizStart();
  }, []);

  // 질문 변경 시 추적
  useEffect(() => {
    trackQuizQuestion(currentQuestion + 1);
  }, [currentQuestion]);

  // 떠다니는 캐릭터 초기화 - 겹치지 않도록 그리드 배치
  useEffect(() => {
    const characters: FloatingCharacter[] = [];
    // 화면을 그리드로 나누어 각 영역에 캐릭터 배치
    const positions = [
      { x: 10, y: 10 },   // 좌상단
      { x: 75, y: 15 },   // 우상단
      { x: 15, y: 50 },   // 좌중단
      { x: 70, y: 55 },   // 우중단
      { x: 40, y: 80 },   // 하단 중앙
    ];
    
    for (let i = 0; i < 5; i++) {
      const pos = positions[i];
      characters.push({
        id: i,
        image: characterImages[Math.floor(Math.random() * characterImages.length)],
        x: pos.x + (Math.random() * 10 - 5), // ±5% 랜덤 오프셋
        y: pos.y + (Math.random() * 10 - 5),
        duration: 20 + Math.random() * 20, // 20-40초
        delay: Math.random() * 10, // 0-10초 딜레이
        size: 107 + Math.random() * 107, // 107-214px (2/3배)
      });
    }
    setFloatingCharacters(characters);
  }, []);

  // 현재 표시할 질문 데이터
  const question = questions[currentQuestion];

  /** 선택지 클릭 핸들러 */
  const handleOptionClick = useCallback(
    (optionIndex: number) => {
      // 응답 추적
      trackQuizAnswer(currentQuestion + 1, optionIndex);
      
      // 응답 저장
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = optionIndex;
      setAnswers(newAnswers);

      // 마지막 질문이면 결과 계산 후 결과 페이지로 이동
      if (currentQuestion === TOTAL_QUESTIONS - 1) {
        const finalAnswers = newAnswers as number[];
        const result = getResult(finalAnswers);
        
        // 퀴즈 완료 추적
        trackQuizComplete(result);
        
        // 퀴즈 완료 후 이동임을 표시하는 쿼리 파라미터 추가
        router.push(`/result/${result}?completed=true`);
        return;
      }

      // 다음 질문으로 이동
      setCurrentQuestion((prev) => prev + 1);
    },
    [answers, currentQuestion, router]
  );

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gray-950 px-3 py-6 text-white overflow-hidden">
      {/* 떠다니는 캐릭터 배경 */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingCharacters.map((char) => (
          <div
            key={char.id}
            className="absolute animate-float"
            style={{
              left: `${char.x}%`,
              top: `${char.y}%`,
              width: `${char.size}px`,
              height: `${char.size}px`,
              opacity: 0.1,
              filter: 'blur(2px)',
              animationDuration: `${char.duration}s`,
              animationDelay: `${char.delay}s`,
            }}
          >
            <Image
              src={`/characters/${char.image}.png`}
              alt=""
              width={char.size}
              height={char.size}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* 프로그레스 바 */}
        <div className="mb-6">
          <ProgressBar current={currentQuestion} total={TOTAL_QUESTIONS} />
        </div>

        {/* 질문 영역 - 모바일에서 적절한 텍스트 크기 */}
        <div className="mb-6 text-center">
          <span className="mb-2 inline-block text-xs text-purple-400">
            Q{question.id}
          </span>
          <h2
            className="text-lg font-bold leading-relaxed text-gray-100"
            data-testid="question-text"
          >
            {question.text[locale]}
          </h2>
        </div>

        {/* 선택지 목록 - 터치 친화적 크기 (최소 48px 높이, 충분한 패딩) */}
        <div className="flex flex-col gap-3" role="group" aria-label="선택지">
          {question.options.map((option, index) => (
            <button
              key={`q${question.id}-opt${index}`}
              onClick={() => handleOptionClick(index)}
              className="min-h-[48px] w-full rounded-xl border border-purple-500/20 bg-gray-900/80 px-4 py-3.5 text-left text-sm text-gray-200 shadow-md shadow-purple-900/10 transition-all hover:border-purple-400/50 hover:bg-gray-800/90 hover:shadow-purple-700/20 active:scale-[0.98]"
              data-testid={`option-${index}`}
            >
              {option.text[locale]}
            </button>
          ))}
        </div>

        {/* 하단 으스스한 분위기 장식 */}
        <div className="mt-8 flex justify-center">
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-transparent via-purple-600/40 to-transparent" />
        </div>
      </div>
    </div>
  );
}

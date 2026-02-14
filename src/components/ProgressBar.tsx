'use client';

// 퀴즈 진행 상태 표시 컴포넌트
// 현재 진행 단계와 전체 단계를 시각적으로 표시한다

interface ProgressBarProps {
  current: number; // 0~7 (현재 질문 인덱스)
  total: number;   // 전체 질문 수 (8)
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  // 표시용 번호: 0-based index를 1-based로 변환
  const displayCurrent = current + 1;
  // 진행률 퍼센트 계산
  const progressPercent = (displayCurrent / total) * 100;

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* 진행 상태 텍스트 */}
      <div className="flex justify-between items-center mb-1.5">
        <span
          className="text-xs text-purple-300 font-medium"
          data-testid="progress-text"
        >
          {displayCurrent}/{total}
        </span>
        <span className="text-xs text-gray-500">
          {Math.round(progressPercent)}%
        </span>
      </div>

      {/* 프로그레스 바 - 모바일에서도 잘 보이는 높이 */}
      <div
        className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={displayCurrent}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`퀴즈 진행 상태: ${displayCurrent}/${total}`}
      >
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
          data-testid="progress-fill"
        />
      </div>
    </div>
  );
}

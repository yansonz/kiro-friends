'use client';

// 4축 성향 카드 하이라이트 스타일 시각화 컴포넌트
// 안정↔실험, 구조↔즉흥, 개인↔협업, 품질↔속도 4축을 카드 형태로 표시

import type { AxisScores } from '@/lib/types';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface RadarChartProps {
  scores: AxisScores;
}

export default function RadarChart({ scores }: RadarChartProps) {
  const { t } = useTranslation();

  // 4축 라벨 정의 (왼쪽, 오른쪽)
  const AXIS_CONFIG = [
    { key: 'A' as const, left: t('axis.stability'), right: t('axis.experiment') },
    { key: 'B' as const, left: t('axis.structure'), right: t('axis.improvisation') },
    { key: 'C' as const, left: t('axis.individual'), right: t('axis.collaboration') },
    { key: 'D' as const, left: t('axis.quality'), right: t('axis.speed') },
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-3" data-testid="radar-chart">
      {AXIS_CONFIG.map((axis) => {
        const value = scores[axis.key]; // -1 ~ 1
        const isLeft = value < 0;
        const isRight = value > 0;
        const isNeutral = Math.abs(value) < 0.1;
        
        return (
          <div key={axis.key} className="flex gap-2">
            {/* 왼쪽 카드 */}
            <div
              className={`flex-1 rounded-xl p-3 text-center transition-all duration-300 ${
                isLeft
                  ? 'bg-purple-600 border-2 border-purple-400 shadow-lg shadow-purple-500/50 scale-105'
                  : isNeutral
                  ? 'bg-gray-800/50 border border-gray-700'
                  : 'bg-gray-900/30 border border-gray-800/50 opacity-40'
              }`}
            >
              <div
                className={`text-sm font-bold transition-colors ${
                  isLeft ? 'text-white' : 'text-gray-400'
                }`}
              >
                {axis.left}
              </div>
            </div>

            {/* 오른쪽 카드 */}
            <div
              className={`flex-1 rounded-xl p-3 text-center transition-all duration-300 ${
                isRight
                  ? 'bg-purple-600 border-2 border-purple-400 shadow-lg shadow-purple-500/50 scale-105'
                  : isNeutral
                  ? 'bg-gray-800/50 border border-gray-700'
                  : 'bg-gray-900/30 border border-gray-800/50 opacity-40'
              }`}
            >
              <div
                className={`text-sm font-bold transition-colors ${
                  isRight ? 'text-white' : 'text-gray-400'
                }`}
              >
                {axis.right}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

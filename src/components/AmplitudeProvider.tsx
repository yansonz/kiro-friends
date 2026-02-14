'use client';

import { useEffect } from 'react';
import { initAmplitude } from '@/lib/analytics';

/**
 * Amplitude 초기화 Provider
 * 앱 최상위에서 Amplitude를 초기화합니다
 */
export default function AmplitudeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initAmplitude();
  }, []);

  return <>{children}</>;
}

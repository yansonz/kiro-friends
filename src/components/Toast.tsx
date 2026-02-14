'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 마운트 직후 애니메이션 시작
    setTimeout(() => setIsVisible(true), 10);

    // 3초 후 사라지기 시작
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    // 3.5초 후 완전히 제거
    const removeTimer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-[200] 
                  px-6 py-4 bg-gradient-to-r from-purple-600/90 to-orange-500/90 
                  border border-purple-400/30 rounded-xl
                  shadow-lg shadow-purple-700/30 backdrop-blur-md w-[calc(100%-2rem)] max-w-md
                  transition-all duration-500 ease-out
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <p className="text-white text-sm text-center whitespace-pre-line font-medium drop-shadow-sm">
        {message}
      </p>
    </div>
  );
}

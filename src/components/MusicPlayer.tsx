'use client';

import { useState, useEffect, useRef } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { trackMusicPlayerInteraction } from '@/lib/analytics';

// 음계 주파수 (반음 포함 - 불협화음용)
const notes: Record<string, number> = {
  'C2': 65.41, 'Db2': 69.30, 'D2': 73.42, 'Eb2': 77.78, 'E2': 82.41, 'F2': 87.31, 'Gb2': 92.50, 'G2': 98.00, 'Ab2': 103.83, 'A2': 110.00, 'Bb2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'Db3': 138.59, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'Gb3': 185.00, 'G3': 196.00, 'Ab3': 207.65, 'A3': 220.00, 'Bb3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'Db4': 277.18, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'Gb4': 369.99, 'G4': 392.00, 'Ab4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'Db5': 554.37, 'D5': 587.33, 'Eb5': 622.25, 'E5': 659.25,
  '-': 0
};

// 공포 영화 스타일 멜로디 (불협화음, 불규칙한 패턴)
const melody = [
  'E4','-','Eb4','-', 'D4','-','Db4','-',
  'C4','-','-','-', 'Gb4','-','F4','-',
  'E4','-','Eb4','D4', '-','-','Db4','-',
  'C4','-','B3','-', 'Bb3','-','-','-',
  'Ab4','-','G4','-', 'Gb4','-','F4','-',
  'E4','-','Eb4','-', 'D4','-','Db4','-',
  'C4','-','-','-', 'B3','-','Bb3','-',
  'A3','-','Ab3','-', 'G3','-','-','-',
];

// 낮은 드론 베이스 (공포 분위기)
const bass = [
  'C2','C2','C2','C2', 'C2','C2','C2','C2',
  'Bb1','Bb1','Bb1','Bb1', 'Bb1','Bb1','Bb1','Bb1',
  'Ab1','Ab1','Ab1','Ab1', 'Ab1','Ab1','Ab1','Ab1',
  'C2','C2','C2','C2', 'C2','C2','C2','C2',
  'Eb2','Eb2','Eb2','Eb2', 'Eb2','Eb2','Eb2','Eb2',
  'D2','D2','D2','D2', 'D2','D2','D2','D2',
  'C2','C2','C2','C2', 'C2','C2','C2','C2',
  'Bb1','Bb1','Bb1','Bb1', 'Bb1','Bb1','Bb1','Bb1',
];

// 불협화음 레이어 (긴장감 추가)
const dissonance = [
  'Gb3','-','F3','-', 'E3','-','Eb3','-',
  'D3','-','-','-', 'Db3','-','C3','-',
  'B2','-','Bb2','-', 'A2','-','Ab2','-',
  'G2','-','-','-', 'Gb2','-','F2','-',
  'E2','-','Eb2','-', 'D2','-','Db2','-',
  'C2','-','-','-', 'B1','-','Bb1','-',
  'A1','-','Ab1','-', 'G1','-','Gb1','-',
  'F1','-','-','-', 'E1','-','-','-',
];

// 배경음악 플레이어 컴포넌트
export default function MusicPlayer() {
  const { t } = useTranslation();
  const [isMuted, setIsMuted] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const tempo = 40; // 매우 느리고 긴장감 있는 템포

  const playNoteAt = (freq: number, duration: number, type: OscillatorType, gainVal: number, time: number) => {
    if (!audioContextRef.current || freq === 0) return;
    
    const osc = audioContextRef.current.createOscillator();
    const gain = audioContextRef.current.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    
    // 공포 영화 스타일: 느린 어택, 긴 서스테인, 느린 릴리즈
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(gainVal, time + 0.1);
    gain.gain.setValueAtTime(gainVal * 0.8, time + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    
    osc.connect(gain);
    gain.connect(masterGainRef.current!);
    osc.start(time);
    osc.stop(time + duration);
  };

  const scheduleLoop = (loopCount: number, startTime: number, loopDuration: number) => {
    if (!isPlayingRef.current || !audioContextRef.current) return;
    
    const stepDuration = 60 / tempo / 2;
    const loopStartTime = startTime + loopCount * loopDuration;
    
    // 현재 루프의 모든 음 미리 스케줄
    for (let i = 0; i < melody.length; i++) {
      const noteTime = loopStartTime + i * stepDuration;
      
      if (isMuted) continue;
      
      // 멜로디 (삼각파 - 날카롭고 불안한 느낌)
      const melNote = notes[melody[i]];
      if (melNote) playNoteAt(melNote, stepDuration * 4, 'triangle', 0.08, noteTime);
      
      // 베이스 드론 (사인파 - 낮고 지속적인 공포감)
      const bassNote = notes[bass[i]];
      if (bassNote) playNoteAt(bassNote, stepDuration * 4, 'sine', 0.25, noteTime);
      
      // 불협화음 레이어 (톱니파 - 긴장감과 불안)
      const dissNote = notes[dissonance[i]];
      if (dissNote) playNoteAt(dissNote, stepDuration * 3, 'sawtooth', 0.04, noteTime);
    }
    
    // 다음 루프 스케줄 (현재 루프 끝나기 전에)
    if (isPlayingRef.current) {
      setTimeout(() => scheduleLoop(loopCount + 1, startTime, loopDuration), loopDuration * 900);
    }
  };

  useEffect(() => {
    // 오버레이 클릭 이벤트 리스너
    const overlay = document.getElementById('start-overlay');
    if (!overlay) return;

    const handleStart = (e: MouseEvent | TouchEvent) => {
      // 설정 버튼 영역 클릭 시에는 시작하지 않음
      const target = e.target as HTMLElement;
      if (target.closest('.settings-buttons')) {
        return;
      }

      // AudioContext 초기화
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        masterGainRef.current = audioContextRef.current.createGain();
        masterGainRef.current.gain.value = isMuted ? 0 : 0.2;
        masterGainRef.current.connect(audioContextRef.current.destination);
      }

      // 음악 재생 시작
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      if (!isPlayingRef.current && !isMuted) {
        isPlayingRef.current = true;
        const startTime = audioContextRef.current.currentTime;
        const stepDuration = 60 / tempo / 2;
        const loopDuration = melody.length * stepDuration;
        scheduleLoop(0, startTime, loopDuration);
      }
      
      overlay.classList.add('hidden');
      setIsOverlayVisible(false);
    };

    overlay.addEventListener('click', handleStart as EventListener);
    overlay.addEventListener('touchend', handleStart as EventListener);

    return () => {
      overlay.removeEventListener('click', handleStart as EventListener);
      overlay.removeEventListener('touchend', handleStart as EventListener);
    };
  }, [isMuted]);

  const handleToggle = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    
    // 음악 플레이어 인터랙션 추적
    trackMusicPlayerInteraction(newMuted ? 'pause' : 'play');
    
    // AudioContext가 이미 초기화되어 있으면 즉시 볼륨 조정
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = newMuted ? 0 : 0.2;
    }
  };

  return (
    <>
      {/* 시작 오버레이 */}
      <div
        id="start-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-pointer"
      >
        <div className="text-center px-6">
          <div className="text-6xl mb-6 animate-gentle-float">👻</div>
          <h2 className="text-2xl font-bold text-purple-100 mb-4">
            {t('home.overlay.welcome')}
          </h2>
          <p className="text-gray-400 mb-8">
            {t('home.overlay.start')}
          </p>
          <div className="text-sm text-gray-500 mb-6">
            {t('home.overlay.music')}
          </div>
          
          {/* 설정 버튼들 */}
          <div className="flex gap-4 justify-center items-center settings-buttons">
            {/* 음악 토글 버튼 */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
              className="w-12 h-12 rounded-full bg-purple-900/80 
                         border border-purple-700/50 text-2xl flex items-center justify-center
                         hover:bg-purple-800/80 active:scale-95 transition-all shadow-lg cursor-pointer
                         touch-manipulation"
              aria-label={t('common.musicToggle')}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
            
            {/* 언어 전환 버튼 */}
            <div onClick={(e) => e.stopPropagation()}>
              <LanguageSwitcher isOverlay={true} />
            </div>
          </div>
        </div>
      </div>

      {/* 음악 토글 버튼 */}
      {!isOverlayVisible && (
        <>
          <button
            type="button"
            onClick={handleToggle}
            className="fixed top-4 right-4 z-[100] w-12 h-12 rounded-full bg-purple-900/80 
                       border border-purple-700/50 text-2xl flex items-center justify-center
                       hover:bg-purple-800/80 active:scale-95 transition-all shadow-lg cursor-pointer
                       touch-manipulation"
            aria-label={t('common.musicToggle')}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          
          {/* 언어 전환 버튼 */}
          <LanguageSwitcher isOverlay={false} />
        </>
      )}
    </>
  );
}

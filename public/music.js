// BGM 시스템 - Web Audio API 기반 할로윈 귀신의 집 스타일
// Safari 백그라운드 탭 throttle 우회: 모든 음을 미리 스케줄링

const Music = {
  ctx: null,
  playing: false,
  muted: false,
  masterGain: null,
  tempo: 50, // 느리고 으스스한 템포
  startTime: 0,
  loopDuration: 0,

  // 음계 주파수 (단조 - 으스스하고 어두운 느낌)
  notes: {
    'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
    'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25,
    '-': 0
  },

  // 멜로디 (으스스하고 불안한 오리지널)
  melody: [
    // 1-2마디: 조용한 시작, 불안감
    'E4','-','D4','C4', 'B3','-','-','A3',
    'G3','-','A3','-', 'B3','-','-','-',
    // 3-4마디: 상승, 긴장감
    'C4','-','D4','E4', 'F4','-','E4','D4',
    'E4','-','-','-', 'C4','-','-','-',
    // 5-6마디: 클라이맥스, 공포
    'G4','-','F4','E4', 'D4','-','-','C4',
    'B3','-','A3','G3', 'A3','-','-','-',
    // 7-8마디: 여운, 으스스함
    'E4','-','D4','C4', 'B3','-','A3','G3',
    'A3','-','G3','-', '-','-','-','-',
  ],

  // 낮은 베이스 (귀신의 집 분위기)
  bass: [
    // Am 아르페지오
    'A2','E3','A3','E3', 'A2','E3','A3','E3',
    'G2','D3','G3','D3', 'G2','D3','G3','D3',
    // Dm - Am
    'D2','A2','D3','A2', 'D2','A2','D3','A2',
    'A2','E3','A3','E3', 'A2','E3','A3','E3',
    // Em - Dm
    'E2','B2','E3','B2', 'E2','B2','E3','B2',
    'D2','A2','D3','A2', 'D2','A2','D3','A2',
    // Am - Em
    'A2','E3','A3','E3', 'A2','E3','A3','E3',
    'E2','B2','E3','B2', 'E2','B2','E3','B2',
  ],

  init() {
    const overlay = document.getElementById('start-overlay');
    if (!overlay) return;

    const startGame = (e) => {
      e.preventDefault();

      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.15; // 조금 더 낮은 볼륨
        this.masterGain.connect(this.ctx.destination);
      }

      // 사파리 unlock
      const silent = this.ctx.createBuffer(1, 1, 22050);
      const src = this.ctx.createBufferSource();
      src.buffer = silent;
      src.connect(this.ctx.destination);
      src.start(0);

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().then(() => {
          if (!this.playing) this.play();
        });
      } else {
        if (!this.playing) this.play();
      }

      overlay.classList.add('hidden');
      overlay.removeEventListener('click', startGame);
      overlay.removeEventListener('touchend', startGame);
      document.removeEventListener('keydown', startGame);
    };

    overlay.addEventListener('click', startGame);
    overlay.addEventListener('touchend', startGame);
    document.addEventListener('keydown', startGame);
  },

  // 지정된 시간에 음 재생
  playNoteAt(freq, duration, type, gainVal, time) {
    if (!this.ctx || freq === 0) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    // 으스스한 어택, 긴 릴리즈
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(gainVal, time + 0.05);
    gain.gain.setValueAtTime(gainVal * 0.6, time + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + duration);
  },

  play() {
    if (this.playing) return;
    this.playing = true;
    this.startTime = this.ctx.currentTime;
    const stepDuration = 60 / this.tempo / 2; // 8분음표 기준
    
    // 멜로디 길이 계산
    this.loopDuration = this.melody.length * stepDuration;
    
    // 무한 루프: 30초마다 다시 스케줄 (Safari 안정성)
    this.scheduleLoop(0);
  },

  scheduleLoop(loopCount) {
    if (!this.playing) return;
    
    const stepDuration = 60 / this.tempo / 2;
    const loopStartTime = this.startTime + loopCount * this.loopDuration;
    
    // 현재 루프의 모든 음 미리 스케줄
    for (let i = 0; i < this.melody.length; i++) {
      const noteTime = loopStartTime + i * stepDuration;
      
      if (this.muted) continue;
      
      // 멜로디 (사각파 - 으스스한 느낌)
      const melNote = this.notes[this.melody[i]];
      if (melNote) this.playNoteAt(melNote, stepDuration * 3, 'square', 0.12, noteTime);
      
      // 베이스 (사인파 - 낮고 무거운 느낌)
      const bassNote = this.notes[this.bass[i]];
      if (bassNote) this.playNoteAt(bassNote, stepDuration * 2, 'sine', 0.18, noteTime);
    }
    
    // 다음 루프 스케줄 (현재 루프 끝나기 전에)
    if (this.playing) {
      setTimeout(() => this.scheduleLoop(loopCount + 1), this.loopDuration * 900);
    }
  },

  toggle() {
    this.muted = !this.muted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.muted ? 0 : 0.15;
    }
  },

  stop() {
    this.playing = false;
  }
};

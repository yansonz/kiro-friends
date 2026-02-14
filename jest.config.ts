import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Next.js 앱의 루트 디렉토리
  dir: './',
});

const config: Config = {
  // 테스트 환경: jsdom (브라우저 환경 시뮬레이션)
  testEnvironment: 'jsdom',

  // 테스트 파일 패턴
  testMatch: [
    '<rootDir>/src/**/*.test.{ts,tsx}',
    '<rootDir>/src/**/*.spec.{ts,tsx}',
  ],

  // 모듈 경로 별칭 (@/* -> src/*)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // 테스트 실행 전 설정 파일
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // 커버리지 수집 대상
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/layout.tsx',
  ],
};

export default createJestConfig(config);

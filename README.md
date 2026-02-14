# 👻 Kiro 프렌즈

한국 전통 설화 캐릭터로 알아보는 개발자 성향 테스트

## 프로젝트 소개

Kiro 프렌즈는 개발자의 성향을 분석하고 AI 협업 전략을 제안하는 인터랙티브 웹 애플리케이션입니다.

- 16문항의 선택형 질문
- 10개의 한국 전통 설화 캐릭터 유형
- 4축 성향 분석 (안정↔실험, 구조↔즉흥, 개인↔협업, 품질↔속도)
- 캐릭터별 Kiro 기능 추천 및 AI 협업 팁

## 기술 스택

- **프레임워크**: Next.js 16 (Static Export)
- **스타일링**: Tailwind CSS
- **언어**: TypeScript
- **테스트**: Jest + React Testing Library
- **OG 이미지**: Satori + @resvg/resvg-js

## 시작하기

### 개발 서버 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
npm run build
```

정적 HTML 파일이 `out/` 디렉토리에 생성됩니다.

### 테스트

```bash
npm test
```

## 프로젝트 구조

```
├── src/
│   ├── app/              # Next.js App Router 페이지
│   │   ├── page.tsx      # 랜딩 페이지
│   │   ├── quiz/         # 퀴즈 페이지
│   │   └── result/       # 결과 페이지
│   ├── components/       # React 컴포넌트
│   ├── data/            # 캐릭터 및 질문 데이터
│   └── lib/             # 유틸리티 함수
├── scripts/             # 빌드 스크립트 (OG 이미지 생성)
├── public/              # 정적 파일
└── docs/                # 프로젝트 문서
```

## 캐릭터 유형 (10개)

1. 👑 갓쓴키로형 - 전략 설계자
2. 👻 총각귀신형 - 몰입 장인
3. 👰 처녀귀신형 - UX 수호자
4. 👹 도깨비형 - 실험 개척자
5. 🦊 구미호형 - 자동화 마법사
6. 🦁 해태형 - 품질 파수꾼
7. 🪵 장승형 - 거버넌스 수문장
8. ⚰️ 저승사자형 - 부채 청산자
9. 🌊 물귀신형 - 연결 촉진자
10. 🥚 달걀귀신형 - 추상화 장인

## 문서

- [아키텍처 문서](docs/architecture.md)
- [캐릭터 네트워크](docs/character-network.md)
- [질문 설계](docs/question.md)
- [프로젝트 계획](plan.md)

## 라이선스

MIT

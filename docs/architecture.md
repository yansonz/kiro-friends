# 🏗️ Kiro 프렌즈 기술 아키텍처

## 설계 원칙

- 서버 없음 (100% 정적 사이트)
- 월 운영비 $0~1 수준
- 빌드 타임에 모든 결과 페이지 + OG 이미지 사전 생성

---

## 기술 스택

| 구분 | 선택 | 이유 |
|---|---|---|
| 프레임워크 | Next.js (Static Export) | `next export`로 순수 정적 HTML 생성, 라우팅/OG 메타태그 처리 편리 |
| 스타일링 | Tailwind CSS | 빌드 시 사용 클래스만 추출, 번들 최소화 |
| 차트 | 카드 하이라이트 스타일 | 4축 레이더 차트 대신 카드 선택 방식으로 시각화 |
| OG 이미지 | Satori + @resvg/resvg-js | 10개 캐릭터 이미지를 빌드 타임에 미리 생성 |
| 호스팅 | CloudFront + S3 | 이미 보유한 인프라 활용, 커스텀 도메인 연결 |
| 대안 호스팅 | GitHub Pages 또는 Cloudflare Pages | 완전 무료, CDN 포함 |

---

## 페이지 구조 (빌드 타임 생성)

```
빌드 출력물 (out/)
├── index.html                    ← 랜딩 페이지
├── quiz/index.html               ← 질문 페이지 (16문항, SPA)
├── result/
│   ├── gatssn/index.html         ← 갓쓴키로 결과
│   ├── chonggak/index.html       ← 총각귀신 결과
│   ├── cheonyeo/index.html       ← 처녀귀신 결과
│   ├── dokkaebi/index.html       ← 도깨비 결과
│   ├── gumiho/index.html         ← 구미호 결과
│   ├── haetae/index.html         ← 해태 결과
│   ├── jangseung/index.html      ← 장승 결과
│   ├── jeoseung/index.html       ← 저승사자 결과
│   ├── mulgwisin/index.html      ← 물귀신 결과
│   └── dalgyal/index.html        ← 달걀귀신 결과
└── og/
    ├── default.png               ← 랜딩용 OG 이미지
    ├── gatssn.png                ← 캐릭터별 OG 이미지 (10개)
    ├── chonggak.png
    ├── dalgyal.png
    └── ...
```

총 HTML 파일: 12개 (랜딩 1 + 퀴즈 1 + 결과 10)
총 OG 이미지: 11개 (기본 1 + 캐릭터 10)

---

## 핵심 플로우

### 퀴즈 → 결과 (서버 불필요)

```
[/quiz 페이지]
  ↓ 사용자가 16문항 응답 (클라이언트 JS)
  ↓ 4축 점수 + 보조 태그 계산 (클라이언트 JS)
  ↓ 캐릭터 매칭 로직 실행 (클라이언트 JS)
  ↓ location.href = "/result/dokkaebi"
[/result/dokkaebi 페이지]
  ↓ 사전 생성된 정적 HTML 로드
  ↓ OG 메타태그에 /og/dokkaebi.png 포함
```

점수 계산, 캐릭터 매칭 모두 브라우저에서 실행.
결과 페이지는 빌드 시 10개 모두 미리 생성되어 있으므로 서버 로직 없음.

### SNS 공유 → 재방문 (OG 이미지 사전 생성)

```
[사용자가 결과 URL 공유]
  https://kiro-friends.example.com/result/dokkaebi
  ↓
[SNS 크롤러가 OG 메타태그 읽음]
  og:title = "나는 도깨비형 – 실험광 👹"
  og:image = "/og/dokkaebi.png"
  ↓ 미리 생성된 정적 이미지 반환 (S3/CDN)
  ↓
[클릭한 방문자]
  ↓ 정적 결과 페이지 로드
  ↓ "나도 해보기" CTA → /quiz로 이동
```

동적 서버 렌더링 불필요. OG 이미지 10개를 빌드 시 생성해두면 끝.

---

## OG 이미지 생성 전략

### 빌드 타임 생성 (추천)

```javascript
// scripts/generate-og.ts
// 빌드 시 실행: npx tsx scripts/generate-og.ts
// 10개 캐릭터 × 1200x630px PNG 생성

// Satori + @resvg/resvg-js 사용
// HTML → SVG → PNG 변환
```

결과물은 `public/og/` 폴더에 저장, S3에 함께 배포.

---

## 카카오톡 공유

카카오 JavaScript SDK는 클라이언트에서 동작하므로 서버 불필요:

```javascript
Kakao.Share.sendDefault({
  objectType: 'feed',
  content: {
    title: '나는 도깨비형 – 실험광 👹',
    description: '당신의 개발자 영혼은?',
    imageUrl: 'https://kiro-friends.example.com/og/dokkaebi.png',
    link: { webUrl: 'https://kiro-friends.example.com/result/dokkaebi' }
  },
  buttons: [{
    title: '나도 해보기',
    link: { webUrl: 'https://kiro-friends.example.com' }
  }]
});
```

카카오 앱 키만 등록하면 됨 (무료).

---

## 참여자 수 카운터 (선택사항)

완전 무료로 구현하는 방법:

### 옵션 A: 카운터 없이 운영
- 가장 단순, 비용 $0
- "많은 개발자가 참여 중" 같은 정적 문구로 대체

### 옵션 B: 외부 무료 카운터 API
- CountAPI (countapi.xyz) 등 무료 서비스 활용
- 클라이언트 JS에서 호출

### 옵션 C: CloudFront 로그 기반
- CloudFront 액세스 로그를 S3에 저장
- 주기적으로 집계하여 정적 JSON 파일로 업데이트
- 실시간은 아니지만 비용 거의 없음

---

## 배포 파이프라인

```
[GitHub Repository]
  ↓ push to main
  ↓
[GitHub Actions]
  ↓ npm run build (next export)
  ↓ node scripts/generate-og.js (OG 이미지 생성)
  ↓ aws s3 sync out/ s3://bucket-name/
  ↓ aws cloudfront create-invalidation
  ↓
[CloudFront + S3]
  ↓ 정적 파일 서빙
  ↓
[사용자 브라우저]
```

---

## 비용 추정

| 항목 | 월 비용 |
|---|---|
| S3 스토리지 (수 MB) | ~$0.01 |
| CloudFront 전송 (10만 PV 기준) | ~$0.50 |
| Route 53 도메인 | $0.50 |
| GitHub Actions (빌드) | 무료 (퍼블릭 레포) |
| 카카오 SDK | 무료 |
| **합계** | **~$1/월** |

GitHub Pages나 Cloudflare Pages 사용 시 $0/월 가능.

---

## 대안 비교

| 방식 | 비용 | 복잡도 | OG 이미지 | 카운터 |
|---|---|---|---|---|
| **Next.js Static Export + S3** (추천) | ~$1/월 | 낮음 | 빌드 타임 | 선택 |
| Astro + Cloudflare Pages | $0/월 | 낮음 | 빌드 타임 | 선택 |
| 순수 HTML/JS + GitHub Pages | $0/월 | 중간 | 수동 제작 | 선택 |
| Next.js SSR + Vercel | $0~20/월 | 중간 | 런타임 | 가능 |
| SPA + Lambda@Edge | ~$5/월 | 높음 | 런타임 | 가능 |

---

## 추천 구성

```
Next.js Static Export + S3 + CloudFront

이유:
- 이미 S3/CloudFront 인프라 보유 (이미지 서버)
- 빌드 타임에 9개 결과 페이지 + OG 이미지 모두 생성
- 서버 런타임 제로, 월 $1 이하
- 카카오/X/LinkedIn 공유 시 OG 미리보기 완벽 지원
```

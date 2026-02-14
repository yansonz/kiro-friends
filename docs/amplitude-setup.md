# Amplitude 설정 가이드

## 1. Amplitude 계정 생성

1. [Amplitude](https://amplitude.com) 웹사이트 방문
2. 무료 계정 생성 (Starter 플랜)
3. 새 프로젝트 생성

## 2. API Key 확인

1. Amplitude 대시보드에서 Settings > Projects 이동
2. 프로젝트 선택
3. API Keys 탭에서 API Key 복사

## 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```bash
NEXT_PUBLIC_AMPLITUDE_API_KEY=your_amplitude_api_key_here
```

**주의:** `.env.local` 파일은 Git에 커밋하지 마세요!

## 4. 개발 환경 vs 프로덕션 환경

### 권장 사항
개발 환경과 프로덕션 환경에서 별도의 Amplitude 프로젝트를 사용하는 것을 권장합니다.

### 설정 방법

#### 개발 환경
`.env.local`:
```bash
NEXT_PUBLIC_AMPLITUDE_API_KEY=dev_api_key_here
```

#### 프로덕션 환경
Vercel, Netlify 등의 배포 플랫폼에서 환경 변수 설정:
```bash
NEXT_PUBLIC_AMPLITUDE_API_KEY=prod_api_key_here
```

## 5. 테스트

### 로컬에서 테스트

1. 개발 서버 실행:
```bash
npm run dev
```

2. 브라우저에서 `http://localhost:3000` 접속

3. 페이지를 탐색하고 버튼을 클릭

4. Amplitude 대시보드에서 실시간 이벤트 확인:
   - User Look-Up > Events Stream

### 확인할 이벤트

- 홈 페이지 접속 시: `page_view` (page_name: home)
- 퀴즈 시작 시: `quiz_start`
- 질문 응답 시: `quiz_answer`
- 퀴즈 완료 시: `quiz_complete`
- 결과 페이지 접속 시: `page_view` (page_name: result)
- 공유 버튼 클릭 시: `share_click`
- CTA 버튼 클릭 시: `cta_click`

## 6. Amplitude 대시보드 설정

### 추천 차트

#### 1. 퀴즈 완료 퍼널
- Chart Type: Funnel
- Steps:
  1. `page_view` where page_name = "home"
  2. `quiz_start`
  3. `quiz_complete`
  4. `page_view` where page_name = "result"

#### 2. 질문별 이탈률
- Chart Type: Funnel
- Steps:
  1. `page_view` where page_name = "quiz_question_1"
  2. `page_view` where page_name = "quiz_question_2"
  3. ... (16번까지)

#### 3. 결과 페이지 Engagement
- Chart Type: Event Segmentation
- Events:
  - `radar_chart_view`
  - `share_click`
  - `character_slider_interaction`
  - `cta_click`
- Group by: result_type

#### 4. 랜딩 유형별 전환율
- Chart Type: Funnel
- Segment by: landing_type
- Steps:
  1. `page_view` where page_name = "result"
  2. `cta_click` where cta_type = "start_quiz"
  3. `quiz_complete`

#### 5. 공유 퍼널
- Chart Type: Funnel
- Steps:
  1. `page_view` where page_name = "result" and landing_type = "completed"
  2. `share_click`

## 7. 문제 해결

### 이벤트가 전송되지 않는 경우

1. **API Key 확인**
   - `.env.local` 파일에 올바른 API Key가 설정되어 있는지 확인
   - 환경 변수 이름이 `NEXT_PUBLIC_AMPLITUDE_API_KEY`인지 확인

2. **브라우저 콘솔 확인**
   - 개발자 도구 > Console 탭에서 에러 메시지 확인
   - Network 탭에서 Amplitude API 요청 확인

3. **개발 서버 재시작**
   - 환경 변수 변경 후 개발 서버를 재시작해야 합니다
   ```bash
   # Ctrl+C로 서버 종료 후
   npm run dev
   ```

4. **Amplitude 초기화 확인**
   - 브라우저 콘솔에서 "Amplitude API key not found" 경고가 있는지 확인

### 이벤트가 중복으로 전송되는 경우

- React Strict Mode로 인해 개발 환경에서 일부 이벤트가 중복 전송될 수 있습니다
- 프로덕션 빌드에서는 정상적으로 작동합니다

## 8. 추가 리소스

- [Amplitude 공식 문서](https://www.docs.developers.amplitude.com/)
- [Amplitude Browser SDK](https://www.docs.developers.amplitude.com/data/sdks/browser-2/)
- [프로젝트 이벤트 목록](./amplitude-events.md)

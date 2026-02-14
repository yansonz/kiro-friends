# Amplitude 이벤트 추적 가이드

## 개요
Kiro Friends 프로젝트는 Amplitude를 사용하여 사용자 행동을 추적하고 분석합니다.

## 설정

### 1. Amplitude API Key 설정
`.env.local` 파일에 Amplitude API Key를 추가하세요:

```bash
NEXT_PUBLIC_AMPLITUDE_API_KEY=your_amplitude_api_key_here
```

### 2. 초기화
`AmplitudeProvider` 컴포넌트가 앱 최상위에서 자동으로 Amplitude를 초기화합니다.

## 추적 이벤트 목록

### 페이지 뷰 이벤트

#### 1. `page_view`
모든 페이지 뷰를 추적합니다.

**Properties:**
- `page_name`: 페이지 이름 (home, quiz_question_N, result)
- 추가 속성 (페이지별로 다름)

#### 2. 홈 페이지 랜딩
**Event:** `page_view`
**Properties:**
- `page_name`: "home"

#### 3. 퀴즈 질문 뷰
**Event:** `page_view`
**Properties:**
- `page_name`: "quiz_question_N" (N은 1-16)
- `question_number`: 질문 번호

#### 4. 결과 페이지 랜딩
**Event:** `page_view`
**Properties:**
- `page_name`: "result"
- `result_type`: 캐릭터 슬러그
- `landing_type`: "completed" | "organic" | "shared"
  - `completed`: 퀴즈 완료 후 이동
  - `organic`: 직접 URL 접근
  - `shared`: 공유 링크를 통한 접근

### 퀴즈 이벤트

#### 5. `quiz_start`
퀴즈 시작 시 추적 (첫 질문 페이지 진입 시)

#### 6. `quiz_answer`
각 질문에 대한 응답 추적

**Properties:**
- `question_number`: 질문 번호 (1-16)
- `option_index`: 선택한 옵션 인덱스 (0-3)

#### 7. `quiz_complete`
퀴즈 완료 시 추적

**Properties:**
- `result_type`: 결과 캐릭터 슬러그

### 인터랙션 이벤트

#### 8. `cta_click`
모든 CTA 버튼 클릭 추적

**Properties:**
- `cta_type`: CTA 유형
  - `start_quiz`: 홈에서 퀴즈 시작
  - `retake_quiz`: 결과 페이지에서 다시 하기
  - `discover_type`: 결과 페이지에서 내 유형 알아보기
  - `download_kiro`: Kiro 다운로드
  - `learn_more`: 더 알아보기
  - `kiro_community`: Kiro 커뮤니티
  - `aws_community`: AWS 커뮤니티
- `location`: 버튼 위치 (home, result_page, cta_section)
- 추가 속성 (버튼별로 다름)

#### 9. `share_click`
공유 버튼 클릭 추적

**Properties:**
- `platform`: 공유 플랫폼
  - `link_copy`: 링크 복사
  - `image_download`: 이미지 다운로드
- `result_type`: 캐릭터 슬러그

#### 10. `character_slider_interaction`
캐릭터 슬라이더 인터랙션 추적

**Properties:**
- `action`: "swipe" | "click"
- `character_slug`: 캐릭터 슬러그

#### 11. `character_card_click`
캐릭터 카드 클릭 추적

**Properties:**
- `character_slug`: 캐릭터 슬러그
- `is_locked`: 잠금 상태 여부

#### 12. `radar_chart_view`
레이더 차트 뷰 추적 (engagement 측정)

**Properties:**
- `result_type`: 캐릭터 슬러그

#### 13. `language_change`
언어 변경 추적

**Properties:**
- `from_language`: 이전 언어 (ko, en, ja)
- `to_language`: 변경된 언어 (ko, en, ja)

#### 14. `music_player_interaction`
음악 플레이어 인터랙션 추적

**Properties:**
- `action`: "play" | "pause"

## 퍼널 분석

### 퀴즈 완료 퍼널
1. `page_view` (home)
2. `quiz_start`
3. `page_view` (quiz_question_1) ~ `page_view` (quiz_question_16)
4. `quiz_complete`
5. `page_view` (result, landing_type: completed)

### 공유 퍼널
1. `page_view` (result)
2. `share_click` (link_copy 또는 image_download)
3. 외부 사용자의 `page_view` (result, landing_type: shared)

## 이탈 분석

### 퀴즈 이탈 지점 파악
각 질문별 `page_view` 이벤트를 추적하여 어느 질문에서 이탈이 많이 발생하는지 분석할 수 있습니다.

**분석 방법:**
1. Amplitude에서 Funnel 차트 생성
2. 각 단계를 `page_view` (quiz_question_N)으로 설정
3. 각 단계별 전환율 확인

## Engagement 분석

### 결과 페이지 Engagement
다음 이벤트들을 조합하여 사용자의 결과 페이지 engagement를 측정할 수 있습니다:

- `radar_chart_view`: 레이더 차트 확인
- `share_click`: 공유 버튼 클릭
- `character_slider_interaction`: 다른 캐릭터 탐색
- `cta_click`: CTA 버튼 클릭

## 랜딩 유형별 분석

### 결과 페이지 랜딩 유형
`landing_type` 속성을 사용하여 다음을 분석할 수 있습니다:

- **completed**: 퀴즈를 완료한 사용자의 행동
- **organic**: 직접 URL로 접근한 사용자의 행동
- **shared**: 공유 링크를 통해 접근한 사용자의 행동

**분석 예시:**
- 공유 링크를 통해 접근한 사용자 중 몇 %가 퀴즈를 시작하는가?
- 각 랜딩 유형별 평균 체류 시간은?
- 각 랜딩 유형별 공유율은?

## 사용 예시

### 코드에서 이벤트 추적하기

```typescript
import { trackCTAClick, trackShare, trackQuizAnswer } from '@/lib/analytics';

// CTA 버튼 클릭 추적
trackCTAClick('start_quiz', 'home');

// 공유 버튼 클릭 추적
trackShare('link_copy', 'gumiho');

// 퀴즈 응답 추적
trackQuizAnswer(5, 2); // 5번 질문, 2번 옵션 선택
```

## 주의사항

1. **개인정보 보호**: 개인 식별 정보(PII)를 이벤트 속성에 포함하지 마세요.
2. **API Key 보안**: `.env.local` 파일은 절대 Git에 커밋하지 마세요.
3. **테스트**: 개발 환경에서는 별도의 Amplitude 프로젝트를 사용하는 것을 권장합니다.

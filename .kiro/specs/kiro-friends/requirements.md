# Requirements Document

## Introduction

Kiro Friends는 한국 전통 설화 캐릭터 기반 개발자 성향 테스트 웹앱이다. 사용자는 8문항의 퀴즈를 통해 9가지 캐릭터 중 자신의 개발자 유형을 발견하고, AI 협업 가이드와 팀 다이내믹 진단을 받는다. 100% 정적 사이트(Next.js Static Export + S3 + CloudFront)로 운영되며, Kiro 브랜딩 강화와 바이럴 확산, 사용자모임 전환을 목적으로 한다.

## Glossary

- **Landing_Page**: 메인 진입 페이지(`/`). 9개 캐릭터 이모지 배치, CTA 버튼, 참여 안내를 포함한다.
- **Quiz_Page**: 퀴즈 페이지(`/quiz`). 8문항을 순차적으로 표시하고 사용자 응답을 수집한다.
- **Result_Page**: 결과 페이지(`/result/[type]`). 캐릭터별 사전 생성된 정적 HTML 페이지이다.
- **Quiz_Engine**: 클라이언트 사이드에서 동작하는 점수 산출 및 캐릭터 매칭 로직이다.
- **Character_Profile**: 9개 캐릭터 각각의 성향 축 값, 보조 태그, 설명, 추천 Kiro 기능 등 데이터 집합이다.
- **Axis_Score**: 4개 성향 축(안정↔실험, 구조↔즉흥, 개인↔협업, 품질↔속도) 각각의 점수이다.
- **Auxiliary_Tag**: Q5~Q8에서 획득하는 보조 구분 태그(설계, UX, 부채청산, 몰입, 자동화, 연결, 테스트, 거버넌스)이다.
- **OG_Image**: SNS 공유 시 미리보기에 표시되는 1200x630px 이미지이다. 빌드 타임에 캐릭터별로 생성된다.
- **Radar_Chart**: 4축 성향을 시각화하는 레이더 차트이다. Chart.js 또는 SVG로 클라이언트에서 렌더링한다.
- **Share_Module**: SNS 공유 기능 모듈이다. X, 카카오톡, LinkedIn, 링크 복사를 지원한다.
- **CTA_Section**: 결과 페이지 하단의 전환 유도 영역이다. Kiro 다운로드, 사용자모임 링크 등을 포함한다.
- **Candidate_Pool**: 4축 조합으로 결정되는 1차 캐릭터 후보군이다.
- **Euclidean_Fallback**: 4축 조합이 정확히 매칭되지 않을 때 유클리드 거리 기반으로 가장 가까운 캐릭터를 찾는 폴백 로직이다.

## Requirements

### Requirement 1: 랜딩 페이지

**User Story:** 사용자로서, 매력적인 랜딩 페이지를 통해 테스트의 목적을 이해하고 퀴즈를 시작하고 싶다.

#### Acceptance Criteria

1. WHEN 사용자가 루트 URL(`/`)에 접속하면, THE Landing_Page SHALL 프로젝트 타이틀("👻 당신은 어떤 Kiro Friends?"), 세계관 소개 문구, 9개 캐릭터 이모지 원형 배치를 표시한다
2. THE Landing_Page SHALL "내 유형 알아보기" CTA 버튼과 "8문항, 약 1분 소요" 안내 문구를 표시한다
3. WHEN 사용자가 "내 유형 알아보기" CTA 버튼을 클릭하면, THE Landing_Page SHALL `/quiz` 페이지로 이동시킨다

### Requirement 2: 퀴즈 페이지 UI

**User Story:** 사용자로서, 8개의 질문에 순차적으로 답변하여 나의 개발자 성향을 분석받고 싶다.

#### Acceptance Criteria

1. WHEN 사용자가 `/quiz` 페이지에 접속하면, THE Quiz_Page SHALL 첫 번째 질문(Q1)을 선택지와 함께 표시한다
2. WHEN 사용자가 선택지를 클릭하면, THE Quiz_Page SHALL 해당 응답을 저장하고 다음 질문으로 전환한다
3. WHILE 퀴즈가 진행 중일 때, THE Quiz_Page SHALL 현재 진행 상태를 표시한다(예: "3/8")
4. WHEN 사용자가 마지막 질문(Q8)에 응답하면, THE Quiz_Page SHALL Quiz_Engine을 실행하여 결과 캐릭터를 결정하고 해당 Result_Page로 이동시킨다

### Requirement 3: 퀴즈 점수 산출 (4축 점수)

**User Story:** 시스템으로서, Q1~Q4 응답을 기반으로 4개 성향 축 점수를 정확하게 산출하고 싶다.

#### Acceptance Criteria

1. WHEN 사용자가 Q1~Q4에 응답하면, THE Quiz_Engine SHALL 각 질문의 선택지에 따라 해당 축에 -1(안정/구조/개인/품질) 또는 +1(실험/즉흥/협업/속도) 점수를 부여한다
2. THE Quiz_Engine SHALL 4개 축 점수를 조합하여 Candidate_Pool을 결정한다
3. WHEN 4축 조합이 (안정, 구조, 개인, 품질)이면, THE Quiz_Engine SHALL Candidate_Pool을 [갓쓴키로, 처녀귀신, 저승사자]로 설정한다
4. WHEN 4축 조합이 (안정, 즉흥, 개인, 속도)이면, THE Quiz_Engine SHALL Candidate_Pool을 [총각귀신]으로 설정한다
5. WHEN 4축 조합이 (실험, 즉흥, 개인, 속도)이면, THE Quiz_Engine SHALL Candidate_Pool을 [도깨비]로 설정한다
6. WHEN 4축 조합이 (실험, 구조, 개인, 속도)이면, THE Quiz_Engine SHALL Candidate_Pool을 [구미호]로 설정한다
7. WHEN 4축 조합이 (안정, 구조, 협업, 품질)이면, THE Quiz_Engine SHALL Candidate_Pool을 [해태, 장승]으로 설정한다
8. WHEN 4축 조합이 (안정, 즉흥, 협업, 속도)이면, THE Quiz_Engine SHALL Candidate_Pool을 [물귀신]으로 설정한다

### Requirement 4: 보조 태그 및 최종 캐릭터 결정

**User Story:** 시스템으로서, Q5~Q8 보조 태그를 활용하여 후보군 내에서 최종 캐릭터를 정확하게 결정하고 싶다.

#### Acceptance Criteria

1. WHEN 사용자가 Q5~Q8에 응답하면, THE Quiz_Engine SHALL 각 선택지에 해당하는 Auxiliary_Tag 점수를 집계한다
2. WHEN Candidate_Pool이 [갓쓴키로, 처녀귀신, 저승사자]이면, THE Quiz_Engine SHALL 설계 태그 최다 시 갓쓴키로, UX 태그 최다 시 처녀귀신, 부채청산 태그 최다 시 저승사자를 선택한다
3. WHEN Candidate_Pool이 [해태, 장승]이면, THE Quiz_Engine SHALL 테스트 태그 최다 시 해태, 거버넌스 태그 최다 시 장승을 선택한다
4. WHEN 보조 태그 점수가 동점이면, THE Quiz_Engine SHALL 후보군의 첫 번째 캐릭터를 기본값으로 선택한다(갓쓴키로 또는 해태)

### Requirement 5: 폴백 매칭

**User Story:** 시스템으로서, 4축 조합이 정의된 매핑에 없을 때에도 적절한 캐릭터를 결정하고 싶다.

#### Acceptance Criteria

1. WHEN 4축 조합이 사전 정의된 매핑 테이블에 존재하지 않으면, THE Quiz_Engine SHALL Euclidean_Fallback을 실행한다
2. THE Euclidean_Fallback SHALL 사용자의 4축 점수와 각 캐릭터 프로필의 4축 값 사이의 유클리드 거리를 계산한다
3. THE Euclidean_Fallback SHALL 유클리드 거리가 가장 짧은 캐릭터의 후보군을 선택하고, 보조 태그로 최종 캐릭터를 결정한다

### Requirement 6: 결과 페이지 표시

**User Story:** 사용자로서, 나의 개발자 유형 결과를 캐릭터 정보, 레이더 차트, 추천 기능과 함께 확인하고 싶다.

#### Acceptance Criteria

1. WHEN 사용자가 Result_Page에 도착하면, THE Result_Page SHALL 캐릭터 이모지, 유형명, 한 줄 소개를 표시한다
2. THE Result_Page SHALL 4축 성향을 Radar_Chart로 시각화하여 표시한다
3. THE Result_Page SHALL 해당 캐릭터의 "잘하는 점", "빠지기 쉬운 함정" 섹션을 표시한다
4. THE Result_Page SHALL 해당 캐릭터의 추천 Kiro 기능 상위 3개를 표시한다
5. THE Result_Page SHALL AI 협업 팁 프롬프트 예시를 표시한다
6. THE Result_Page SHALL 시너지 캐릭터와 긴장 캐릭터 정보를 표시한다

### Requirement 7: SNS 공유

**User Story:** 사용자로서, 나의 결과를 X, LinkedIn, 링크 복사를 통해 공유하고 싶다.

#### Acceptance Criteria

1. THE Result_Page SHALL X, LinkedIn, 링크 복사 3가지 공유 버튼을 표시한다
2. WHEN 사용자가 X 공유 버튼을 클릭하면, THE Share_Module SHALL 캐릭터 유형명, 한 줄 소개, 결과 URL, 해시태그(#KiroFriends #개발자유형테스트 #Kiro)를 포함한 트윗 작성 창을 연다
3. WHEN 사용자가 LinkedIn 공유 버튼을 클릭하면, THE Share_Module SHALL 결과 URL을 포함한 LinkedIn 공유 창을 연다
4. WHEN 사용자가 링크 복사 버튼을 클릭하면, THE Share_Module SHALL 결과 URL을 클립보드에 복사하고 완료 토스트 메시지를 표시한다

### Requirement 8: OG 메타태그 및 이미지

**User Story:** 시스템으로서, SNS 공유 시 각 캐릭터별 적절한 미리보기가 표시되도록 OG 메타태그와 이미지를 제공하고 싶다.

#### Acceptance Criteria

1. THE Landing_Page SHALL 기본 OG 메타태그(og:title, og:description, og:image)를 포함한다
2. WHEN 각 Result_Page가 빌드되면, THE Result_Page SHALL 해당 캐릭터의 유형명과 소개를 og:title과 og:description에, 캐릭터별 OG_Image 경로를 og:image에 설정한다
3. THE OG_Image SHALL 빌드 타임에 9개 캐릭터별로 1200x630px 크기로 생성된다
4. THE OG_Image SHALL 캐릭터 이모지, 유형명, 한 줄 소개, 미니 레이더 차트를 포함한다

### Requirement 9: 공유 링크 진입 및 재검사 유도

**User Story:** 공유 링크를 통해 진입한 방문자로서, 결과를 확인하고 나도 테스트를 해보고 싶다.

#### Acceptance Criteria

1. WHEN 방문자가 공유 링크(`/result/[type]`)로 직접 진입하면, THE Result_Page SHALL 해당 캐릭터의 결과 정보를 정상적으로 표시한다
2. THE Result_Page SHALL "나도 내 유형 알아보기" CTA 버튼을 표시하여 `/quiz` 페이지로 이동을 유도한다
3. THE Result_Page SHALL 하단에 9개 캐릭터 미리보기 슬라이드를 표시한다

### Requirement 10: CTA 전환 영역

**User Story:** 사용자로서, 결과 확인 후 Kiro 다운로드 및 커뮤니티 참여로 자연스럽게 연결되고 싶다.

#### Acceptance Criteria

1. THE Result_Page SHALL 하단에 CTA_Section을 표시한다
2. THE CTA_Section SHALL "Kiro 다운로드" 버튼과 "Kiro 더 알아보기" 버튼을 포함한다
3. THE CTA_Section SHALL "Kiro 한국 사용자모임" 링크와 "AWS 한국 사용자모임" 링크를 포함한다
4. THE CTA_Section SHALL 해당 캐릭터의 추천 Kiro 기능 목록을 함께 표시한다

### Requirement 11: 정적 사이트 빌드 및 배포

**User Story:** 개발자로서, 전체 사이트를 정적 파일로 빌드하여 S3 + CloudFront에 배포하고 싶다.

#### Acceptance Criteria

1. WHEN `next build`가 실행되면, THE 빌드_시스템 SHALL 랜딩 페이지 1개, 퀴즈 페이지 1개, 결과 페이지 9개를 정적 HTML로 생성한다
2. WHEN 빌드가 완료되면, THE 빌드_시스템 SHALL OG 이미지 10개(기본 1 + 캐릭터 9)를 `out/og/` 디렉토리에 생성한다
3. THE 빌드_시스템 SHALL 서버 사이드 런타임 없이 순수 정적 파일만으로 모든 기능이 동작하도록 출력한다

### Requirement 12: 캐릭터 데이터 관리

**User Story:** 개발자로서, 9개 캐릭터의 프로필 데이터를 체계적으로 관리하고 싶다.

#### Acceptance Criteria

1. THE Character_Profile SHALL 각 캐릭터별로 이모지, 유형명, 한 줄 소개, 4축 값, 핵심 보조 태그, 잘하는 점, 빠지기 쉬운 함정, 추천 Kiro 기능(상위 3개), AI 협업 팁, 시너지 캐릭터, 긴장 캐릭터 정보를 포함한다
2. THE Character_Profile SHALL 9개 캐릭터 모두에 대해 동일한 데이터 구조를 유지한다
3. THE Character_Profile SHALL URL 슬러그(gatssn, chonggak, cheonyeo, dokkaebi, gumiho, haetae, jangseung, jeoseung, mulgwisin)를 각 캐릭터에 매핑한다

### Requirement 13: 비주얼 테마 (할로윈 / 귀신 분위기)

**User Story:** 사용자로서, 한국 전통 설화 귀신 테마에 어울리는 어둡고 으스스한 분위기의 UI를 경험하고 싶다.

#### Acceptance Criteria

1. THE Landing_Page, Quiz_Page, Result_Page SHALL 어두운 배경(dark theme)을 기본으로 사용한다
2. THE 전체 UI SHALL 할로윈 느낌의 컬러 팔레트를 적용한다 (예: 짙은 남색/검정 배경, 보라/주황/초록 포인트 컬러, 안개/연기 효과)
3. THE 전체 UI SHALL 귀신이 나올 것 같은 으스스한 분위기를 연출한다 (예: 미묘한 글로우 효과, 그림자, 페이드 인/아웃 애니메이션)

### Requirement 14: 반응형 디자인 및 모바일 최적화

**User Story:** 사용자로서, 모바일 기기에서도 편리하게 퀴즈를 진행하고 결과를 확인하고 싶다.

#### Acceptance Criteria

1. THE Landing_Page, Quiz_Page, Result_Page SHALL 모바일(360px 이상), 태블릿, 데스크톱 화면에서 적절하게 레이아웃을 조정한다
2. WHEN 모바일 기기에서 Quiz_Page를 사용할 때, THE Quiz_Page SHALL 터치 친화적인 선택지 크기와 간격을 제공한다

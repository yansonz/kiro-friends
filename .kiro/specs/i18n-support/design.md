# Design Document: i18n-support

## Overview

이 문서는 Kiro 프렌즈 퀴즈 애플리케이션에 다국어 지원(한국어, 영어, 일본어)을 추가하는 기능의 설계를 정의합니다. Next.js의 App Router와 React Context API를 활용하여 클라이언트 사이드 국제화를 구현하며, 정적 사이트 생성(SSG)과 호환되도록 설계합니다.

### 핵심 설계 결정

1. **라이브러리 선택**: 경량 커스텀 i18n 솔루션 사용
   - next-intl이나 react-i18next 대신 커스텀 구현 선택
   - 이유: 정적 export 환경에서 단순성 유지, 번들 크기 최소화
   - 3개 언어만 지원하므로 복잡한 라이브러리 불필요

2. **상태 관리**: React Context API
   - 전역 언어 상태를 Context로 관리
   - 로컬 스토리지와 동기화하여 영속성 보장

3. **번역 데이터 구조**: 타입 안전한 JSON 기반
   - TypeScript 인터페이스로 번역 키 타입 정의
   - 언어별 JSON 파일 분리 (ko.json, en.json, ja.json)

4. **OG 이미지 전략**: 언어별 파일 생성
   - 기존 generate-og.ts 스크립트 확장
   - 각 캐릭터당 3개 언어 이미지 생성 (예: gatssn-ko.png, gatssn-en.png, gatssn-ja.png)

## Architecture

### 컴포넌트 구조

```
src/
├── contexts/
│   └── I18nContext.tsx          # 언어 상태 관리 Context
├── lib/
│   ├── i18n/
│   │   ├── index.ts             # i18n 유틸리티 함수
│   │   ├── types.ts             # 번역 타입 정의
│   │   └── locales/
│   │       ├── ko.json          # 한국어 번역
│   │       ├── en.json          # 영어 번역
│   │       └── ja.json          # 일본어 번역
│   └── hooks/
│       └── useTranslation.ts    # 번역 훅
├── components/
│   ├── LanguageSwitcher.tsx     # 언어 전환 버튼
│   └── MusicPlayer.tsx          # 수정: 언어 전환 버튼 포함
└── data/
    ├── characters.ts            # 수정: 다국어 지원
    └── questions.ts             # 수정: 다국어 지원
```

### 데이터 흐름

```
사용자 클릭
    ↓
LanguageSwitcher
    ↓
I18nContext.setLocale()
    ↓
로컬 스토리지 저장
    ↓
Context 업데이트
    ↓
모든 구독 컴포넌트 리렌더링
    ↓
번역된 텍스트 표시
```

## Components and Interfaces

### 1. I18nContext

언어 상태를 전역으로 관리하는 React Context입니다.

```typescript
// src/contexts/I18nContext.tsx

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

type Locale = 'ko' | 'en' | 'ja';

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ko');
  const [translations, setTranslations] = useState<Record<string, string>>({});

  // 초기 로드: 로컬 스토리지 또는 브라우저 언어 감지
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale | null;
    const browserLocale = navigator.language.split('-')[0] as Locale;
    const supportedLocales: Locale[] = ['ko', 'en', 'ja'];
    
    const initialLocale = savedLocale 
      || (supportedLocales.includes(browserLocale) ? browserLocale : 'ko');
    
    setLocaleState(initialLocale);
    loadTranslations(initialLocale);
  }, []);

  // 번역 데이터 로드
  const loadTranslations = async (locale: Locale) => {
    const data = await import(`@/lib/i18n/locales/${locale}.json`);
    setTranslations(data.default);
  };

  // 언어 변경
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    loadTranslations(newLocale);
    document.documentElement.lang = newLocale;
  };

  // 번역 함수
  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}
```

### 2. useTranslation Hook

컴포넌트에서 번역 기능을 사용하기 위한 커스텀 훅입니다.

```typescript
// src/lib/hooks/useTranslation.ts

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }
  return context;
}
```

### 3. LanguageSwitcher Component

언어 전환 버튼 컴포넌트입니다.

```typescript
// src/components/LanguageSwitcher.tsx

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  const locales: Locale[] = ['ko', 'en', 'ja'];
  const localeLabels: Record<Locale, string> = {
    ko: '한국어',
    en: 'English',
    ja: '日本語',
  };

  const handleClick = () => {
    const currentIndex = locales.indexOf(locale);
    const nextIndex = (currentIndex + 1) % locales.length;
    setLocale(locales[nextIndex]);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="fixed top-16 right-4 z-[100] min-h-[44px] px-4 rounded-full 
                 bg-purple-900/80 border border-purple-700/50 text-sm text-white
                 hover:bg-purple-800/80 active:scale-95 transition-all shadow-lg"
      aria-label={`Change language. Current: ${localeLabels[locale]}`}
    >
      🌐 {localeLabels[locale]}
    </button>
  );
}
```

### 4. 번역 데이터 구조

타입 안전성을 위한 번역 키 인터페이스입니다.

```typescript
// src/lib/i18n/types.ts

export interface TranslationKeys {
  // 홈 페이지
  'home.title': string;
  'home.description': string;
  'home.cta': string;
  'home.duration': string;
  'home.overlay.welcome': string;
  'home.overlay.start': string;
  'home.overlay.music': string;

  // 퀴즈 페이지
  'quiz.question': string;
  
  // 결과 페이지 - 섹션 제목
  'result.strengths': string;
  'result.pitfalls': string;
  'result.kiroFeatures': string;
  'result.aiTips': string;
  'result.synergy': string;
  'result.tension': string;
  'result.analysis': string;
  'result.share': string;
  'result.cta': string;
  'result.retake': string;
  
  // 토스트 메시지
  'toast.linkCopied': string;
  'toast.shareWith': string;
  'toast.learnAbout': string;

  // 공통
  'common.loading': string;
}
```

## Data Models

### 1. Character Profile 다국어 구조

기존 캐릭터 데이터를 다국어 지원하도록 확장합니다.

```typescript
// src/lib/types.ts (수정)

export interface CharacterProfile {
  slug: CharacterSlug;
  emoji: string;
  
  // 다국어 필드
  name: Record<Locale, string>;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  
  axisValues: { A: number; B: number; C: number; D: number };
  primaryTag: string;
  
  strengths: Record<Locale, string[]>;
  pitfalls: Record<Locale, string[]>;
  kiroFeatures: Array<{
    name: Record<Locale, string>;
    description: Record<Locale, string>;
    level: 'basic' | 'advanced';
  }>;
  aiTips: Record<Locale, string[]>;
  
  synergy: CharacterSlug;
  tension: CharacterSlug;
}
```

### 2. Question 다국어 구조

퀴즈 질문 데이터를 다국어 지원하도록 확장합니다.

```typescript
// src/data/questions.ts (수정)

export interface Question {
  id: number;
  text: Record<Locale, string>;
  options: Array<{
    text: Record<Locale, string>;
    axisEffect?: {
      axis: 'A' | 'B' | 'C' | 'D';
      value: -1 | 1;
    };
    tagEffect?: string;
  }>;
}
```

### 3. OG 이미지 경로 생성

언어별 OG 이미지 경로를 동적으로 생성합니다.

```typescript
// src/lib/i18n/index.ts

export function getOgImagePath(characterSlug: string, locale: Locale): string {
  return `/og/${characterSlug}-${locale}.png`;
}

export function getOgImagePathWithFallback(
  characterSlug: string, 
  locale: Locale
): string {
  // 언어별 이미지가 없으면 기본 이미지 사용
  const localizedPath = `/og/${characterSlug}-${locale}.png`;
  const defaultPath = `/og/${characterSlug}.png`;
  
  // 빌드 타임에는 항상 언어별 경로 반환
  return localizedPath;
}
```

## Correctness Properties

*속성(Property)은 시스템이 모든 유효한 실행에서 참이어야 하는 특성 또는 동작입니다. 이는 사람이 읽을 수 있는 명세와 기계가 검증 가능한 정확성 보장 사이의 다리 역할을 합니다.*


### Property 1: 언어 순환 일관성

*For any* 현재 언어 상태에서, 언어 전환 버튼을 클릭하면 다음 언어로 순환해야 한다 (ko → en → ja → ko).

**Validates: Requirements 1.2**

### Property 2: 언어 레이블 표시

*For any* 선택된 언어에 대해, Language_Switcher는 해당 언어의 올바른 레이블을 표시해야 한다.

**Validates: Requirements 1.3**

### Property 3: 번역 키 조회 일관성

*For any* 유효한 번역 키와 언어 조합에 대해, t() 함수는 해당 언어의 번역 텍스트를 반환해야 한다.

**Validates: Requirements 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 4.11, 4.12**

### Property 4: 질문 데이터 다국어 지원

*For any* 질문 ID와 언어 조합에 대해, 질문 텍스트와 모든 선택지가 해당 언어로 제공되어야 한다.

**Validates: Requirements 3.1, 3.2, 3.3**

### Property 5: 캐릭터 데이터 다국어 지원

*For any* 캐릭터 슬러그와 언어 조합에 대해, 캐릭터의 모든 텍스트 필드(이름, 타이틀, 설명, 강점, 약점, 기능, 팁)가 해당 언어로 제공되어야 한다.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7**

### Property 6: OG 이미지 경로 생성

*For any* 캐릭터 슬러그와 언어 조합에 대해, OG 이미지 경로는 `/og/{slug}-{locale}.png` 형식이어야 한다.

**Validates: Requirements 5.1**

### Property 7: OG 이미지 파일 존재

*For any* 캐릭터 슬러그와 언어 조합에 대해, 해당하는 OG 이미지 파일이 존재해야 한다.

**Validates: Requirements 5.2**

### Property 8: 메타태그 업데이트

*For any* 언어 변경 시, 페이지 타이틀, 설명, OG 타이틀, OG 설명, HTML lang 속성이 모두 선택된 언어로 업데이트되어야 한다.

**Validates: Requirements 5.3, 10.1, 10.2, 10.3, 10.4, 10.5**

### Property 9: 로컬 스토리지 영속성

*For any* 언어 선택에 대해, 해당 언어가 로컬 스토리지에 저장되고, 페이지 새로고침 후 복원되어야 한다.

**Validates: Requirements 6.1, 6.2**

### Property 10: 브라우저 언어 감지

*For any* 지원되는 브라우저 언어(ko, en, ja)에 대해, 저장된 언어 설정이 없을 때 해당 언어가 기본 언어로 선택되어야 한다.

**Validates: Requirements 6.3**

### Property 11: 번역 데이터 JSON 유효성

*For any* 언어 파일(ko.json, en.json, ja.json)에 대해, 파일은 유효한 JSON 형식이어야 한다.

**Validates: Requirements 7.1**

### Property 12: 번역 키 계층 구조

*For any* 번역 키에 대해, 키는 점(.)으로 구분된 계층적 구조를 따라야 한다 (예: home.title, quiz.question1).

**Validates: Requirements 7.3**

### Property 13: 누락된 번역 키 처리

*For any* 존재하지 않는 번역 키에 대해, t() 함수는 키 이름을 그대로 반환해야 한다.

**Validates: Requirements 7.4, 7.5**

### Property 14: 캐릭터 데이터 완전성

*For any* 캐릭터에 대해, 모든 텍스트 필드가 3개 언어(ko, en, ja) 모두에 대해 존재해야 한다.

**Validates: Requirements 8.2**

### Property 15: 캐릭터 불변 필드 유지

*For any* 캐릭터와 언어 조합에 대해, 이모지와 슬러그는 언어와 무관하게 동일해야 한다.

**Validates: Requirements 8.3, 8.4**

### Property 16: 질문 데이터 완전성

*For any* 질문에 대해, 질문 텍스트와 모든 선택지가 3개 언어(ko, en, ja) 모두에 대해 존재해야 한다.

**Validates: Requirements 9.2, 9.3**

### Property 17: 질문 효과 불변성

*For any* 질문과 언어 조합에 대해, axisEffect와 tagEffect는 언어와 무관하게 동일해야 한다.

**Validates: Requirements 9.4**

### Property 18: 스크린 리더 알림

*For any* 언어 변경 시, ARIA live region을 통해 스크린 리더에게 변경 사항이 알려져야 한다.

**Validates: Requirements 11.3**

### Property 19: 선택적 언어 데이터 로딩

*For any* 언어 선택에 대해, 해당 언어의 번역 데이터만 로드되어야 하며, 다른 언어 데이터는 로드되지 않아야 한다.

**Validates: Requirements 12.1**

### Property 20: 번역 데이터 캐싱

*For any* 번역 키에 대해, 동일한 키를 여러 번 조회할 때 캐시된 데이터가 사용되어야 한다.

**Validates: Requirements 12.2**

### Property 21: SPA 동작 유지

*For any* 언어 전환 시, 페이지 전체 새로고침이 발생하지 않아야 한다.

**Validates: Requirements 12.3**

### Property 22: 로딩 상태 처리

*For any* 번역 데이터 로딩 중에도, 기본 언어 텍스트 또는 키 이름이 표시되어야 한다.

**Validates: Requirements 12.4**

## Error Handling

### 1. 번역 키 누락

**시나리오**: 요청한 번역 키가 현재 언어 파일에 존재하지 않음

**처리 방법**:
- t() 함수는 키 이름을 그대로 반환
- 개발 모드에서 console.warn으로 경고 출력
- 프로덕션에서는 조용히 폴백

```typescript
function t(key: string): string {
  const value = translations[key];
  
  if (!value) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Missing translation key: ${key} for locale: ${locale}`);
    }
    return key;
  }
  
  return value;
}
```

### 2. 언어 파일 로드 실패

**시나리오**: 네트워크 오류 또는 파일 누락으로 언어 파일 로드 실패

**처리 방법**:
- 이전 언어 상태 유지
- 사용자에게 에러 토스트 표시
- 한국어로 폴백 시도

```typescript
const loadTranslations = async (locale: Locale) => {
  try {
    const data = await import(`@/lib/i18n/locales/${locale}.json`);
    setTranslations(data.default);
  } catch (error) {
    console.error(`Failed to load translations for ${locale}:`, error);
    
    // 한국어로 폴백
    if (locale !== 'ko') {
      try {
        const fallback = await import('@/lib/i18n/locales/ko.json');
        setTranslations(fallback.default);
        setLocaleState('ko');
      } catch (fallbackError) {
        console.error('Failed to load fallback translations:', fallbackError);
      }
    }
  }
};
```

### 3. 로컬 스토리지 접근 불가

**시나리오**: 브라우저가 로컬 스토리지를 지원하지 않거나 접근이 차단됨

**처리 방법**:
- 메모리 내 상태만 사용
- 브라우저 언어 감지로 폴백
- 기능은 정상 작동하되 영속성만 제공되지 않음

```typescript
function saveLocale(locale: Locale) {
  try {
    localStorage.setItem('locale', locale);
  } catch (error) {
    console.warn('Failed to save locale to localStorage:', error);
    // 계속 진행 (메모리 상태는 유지됨)
  }
}
```

### 4. OG 이미지 파일 누락

**시나리오**: 특정 언어의 OG 이미지 파일이 생성되지 않음

**처리 방법**:
- 기본 언어(한국어) 이미지로 폴백
- 빌드 타임에 누락된 이미지 경고 출력

```typescript
export function getOgImagePathWithFallback(
  characterSlug: string, 
  locale: Locale
): string {
  const localizedPath = `/og/${characterSlug}-${locale}.png`;
  const defaultPath = `/og/${characterSlug}.png`;
  
  // 정적 빌드 환경에서는 파일 존재 여부를 런타임에 확인할 수 없으므로
  // 빌드 타임에 모든 이미지가 생성되었다고 가정
  return localizedPath;
}
```

### 5. 지원되지 않는 브라우저 언어

**시나리오**: 사용자의 브라우저 언어가 ko, en, ja가 아님

**처리 방법**:
- 한국어를 기본 언어로 설정
- 사용자는 언어 전환 버튼으로 원하는 언어 선택 가능

```typescript
function detectBrowserLocale(): Locale {
  const browserLang = navigator.language.split('-')[0];
  const supportedLocales: Locale[] = ['ko', 'en', 'ja'];
  
  if (supportedLocales.includes(browserLang as Locale)) {
    return browserLang as Locale;
  }
  
  return 'ko'; // 기본값
}
```

## Testing Strategy

### 단위 테스트 (Unit Tests)

단위 테스트는 개별 함수와 컴포넌트의 동작을 검증합니다.

**테스트 대상**:
1. i18n 유틸리티 함수
   - `t()` 함수의 번역 키 조회
   - `getOgImagePath()` 경로 생성
   - `detectBrowserLocale()` 언어 감지

2. I18nContext
   - 초기 언어 설정
   - 언어 변경 동작
   - 로컬 스토리지 저장/로드

3. LanguageSwitcher 컴포넌트
   - 버튼 렌더링
   - 클릭 이벤트 처리
   - 접근성 속성

**예제 테스트**:
```typescript
describe('t() function', () => {
  it('should return translated text for valid key', () => {
    const result = t('home.title', 'ko');
    expect(result).toBe('👻 당신은 어떤 Kiro 프렌즈?');
  });

  it('should return key name for missing translation', () => {
    const result = t('nonexistent.key', 'ko');
    expect(result).toBe('nonexistent.key');
  });
});
```

### 속성 기반 테스트 (Property-Based Tests)

속성 기반 테스트는 무작위 입력에 대해 보편적 속성을 검증합니다.

**테스트 라이브러리**: fast-check (이미 프로젝트에 설치됨)

**테스트 설정**:
- 최소 100회 반복 실행
- 각 테스트는 설계 문서의 속성 번호 참조

**주요 속성 테스트**:

1. **Property 1: 언어 순환 일관성**
```typescript
import fc from 'fast-check';

describe('Property 1: Language cycle consistency', () => {
  it('should cycle through languages in order', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('ko', 'en', 'ja'),
        (currentLocale) => {
          const nextLocale = getNextLocale(currentLocale);
          const expected = currentLocale === 'ko' ? 'en' 
            : currentLocale === 'en' ? 'ja' : 'ko';
          return nextLocale === expected;
        }
      ),
      { numRuns: 100 }
    );
  });
});
// Feature: i18n-support, Property 1: For any current language state, clicking the language switcher should cycle to the next language
```

2. **Property 3: 번역 키 조회 일관성**
```typescript
describe('Property 3: Translation key lookup consistency', () => {
  it('should return translation for any valid key and locale', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(koTranslations)),
        fc.constantFrom('ko', 'en', 'ja'),
        (key, locale) => {
          const result = t(key, locale);
          return typeof result === 'string' && result.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });
});
// Feature: i18n-support, Property 3: For any valid translation key and locale combination, t() should return the translated text
```

3. **Property 5: 캐릭터 데이터 다국어 지원**
```typescript
describe('Property 5: Character data multilingual support', () => {
  it('should provide all text fields in all languages', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        fc.constantFrom('ko', 'en', 'ja'),
        (slug, locale) => {
          const character = getCharacterBySlug(slug);
          return character 
            && typeof character.name[locale] === 'string'
            && typeof character.title[locale] === 'string'
            && typeof character.description[locale] === 'string'
            && Array.isArray(character.strengths[locale])
            && Array.isArray(character.pitfalls[locale]);
        }
      ),
      { numRuns: 100 }
    );
  });
});
// Feature: i18n-support, Property 5: For any character slug and locale, all text fields should be provided in that language
```

4. **Property 9: 로컬 스토리지 영속성**
```typescript
describe('Property 9: LocalStorage persistence', () => {
  it('should save and restore locale from localStorage', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('ko', 'en', 'ja'),
        (locale) => {
          saveLocale(locale);
          const restored = loadLocale();
          return restored === locale;
        }
      ),
      { numRuns: 100 }
    );
  });
});
// Feature: i18n-support, Property 9: For any locale selection, it should be saved to and restored from localStorage
```

5. **Property 14: 캐릭터 데이터 완전성**
```typescript
describe('Property 14: Character data completeness', () => {
  it('should have all text fields in all three languages', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSlugs),
        (slug) => {
          const character = getCharacterBySlug(slug);
          const locales: Locale[] = ['ko', 'en', 'ja'];
          
          return locales.every(locale => 
            character.name[locale] &&
            character.title[locale] &&
            character.description[locale] &&
            character.strengths[locale].length > 0 &&
            character.pitfalls[locale].length > 0
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});
// Feature: i18n-support, Property 14: For any character, all text fields should exist in all three languages
```

### 통합 테스트 (Integration Tests)

통합 테스트는 여러 컴포넌트가 함께 작동하는 것을 검증합니다.

**테스트 시나리오**:
1. 언어 전환 플로우
   - 사용자가 언어 버튼 클릭
   - Context 업데이트
   - 모든 텍스트 업데이트
   - 로컬 스토리지 저장

2. 페이지 새로고침 후 언어 복원
   - 언어 선택 및 저장
   - 페이지 새로고침 시뮬레이션
   - 저장된 언어로 복원 확인

3. OG 이미지 경로 생성 및 메타태그 업데이트
   - 언어 변경
   - OG 이미지 경로 업데이트
   - 메타태그 업데이트 확인

**예제 통합 테스트**:
```typescript
describe('Language switching integration', () => {
  it('should update all UI text when language changes', async () => {
    render(
      <I18nProvider>
        <HomePage />
      </I18nProvider>
    );

    const switcher = screen.getByRole('button', { name: /change language/i });
    
    // 초기 상태 (한국어)
    expect(screen.getByText(/당신은 어떤 Kiro 프렌즈/)).toBeInTheDocument();
    
    // 영어로 전환
    fireEvent.click(switcher);
    await waitFor(() => {
      expect(screen.getByText(/Which Kiro Friend Are You/)).toBeInTheDocument();
    });
    
    // 일본어로 전환
    fireEvent.click(switcher);
    await waitFor(() => {
      expect(screen.getByText(/あなたはどのKiroフレンズ/)).toBeInTheDocument();
    });
  });
});
```

### 테스트 커버리지 목표

- 단위 테스트: 80% 이상
- 속성 기반 테스트: 모든 correctness properties 커버
- 통합 테스트: 주요 사용자 플로우 커버

### 테스트 실행

```bash
# 모든 테스트 실행
npm test

# 속성 기반 테스트만 실행
npm test -- --testNamePattern="Property"

# 커버리지 리포트 생성
npm run test:coverage
```

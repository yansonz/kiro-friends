# GitHub Actions 배포 설정 가이드

## Amplitude API Key 설정

GitHub Actions에서 Amplitude를 사용하려면 Repository Secret에 API Key를 추가해야 합니다.

### 1. GitHub Repository Secret 추가

1. **GitHub Repository 페이지 접속**
   - 프로젝트 GitHub 페이지로 이동

2. **Settings 탭 클릭**
   - 상단 메뉴에서 "Settings" 선택

3. **Secrets and variables 메뉴**
   - 왼쪽 사이드바에서 "Secrets and variables" → "Actions" 클릭

4. **New repository secret 클릭**
   - "New repository secret" 버튼 클릭

5. **Secret 정보 입력**
   - **Name**: `AMPLITUDE_API_KEY`
   - **Secret**: Amplitude API Key 입력 (32자리 영숫자)
   - "Add secret" 버튼 클릭

### 2. GitHub Actions 워크플로우 확인

`.github/workflows/deploy.yml` 파일에 다음과 같이 환경 변수가 설정되어 있는지 확인:

```yaml
- name: Build Next.js
  env:
    NEXT_PUBLIC_AMPLITUDE_API_KEY: ${{ secrets.AMPLITUDE_API_KEY }}
  run: npm run build
```

### 3. 배포 확인

1. **코드 푸시**
   ```bash
   git add .
   git commit -m "feat: Add Amplitude analytics"
   git push origin main
   ```

2. **GitHub Actions 실행 확인**
   - Repository → "Actions" 탭
   - 최신 워크플로우 실행 확인
   - 빌드 로그에서 에러 없는지 확인

3. **배포된 사이트 확인**
   - 배포 완료 후 사이트 접속
   - 브라우저 개발자 도구 → Console 탭
   - Amplitude 에러 메시지가 없는지 확인

4. **Amplitude 대시보드 확인**
   - Amplitude 대시보드 → User Look-Up → Events Stream
   - 실시간 이벤트가 수신되는지 확인

## 문제 해결

### Secret이 제대로 설정되지 않은 경우

**증상:**
- 빌드는 성공하지만 Amplitude 이벤트가 전송되지 않음
- 브라우저 콘솔에 "Invalid API key" 에러

**해결 방법:**
1. GitHub Repository Settings → Secrets and variables → Actions
2. `AMPLITUDE_API_KEY` Secret이 존재하는지 확인
3. Secret 값이 올바른지 확인 (32자리 영숫자)
4. Secret을 다시 생성하고 코드를 다시 푸시

### 빌드 시 환경 변수가 포함되지 않은 경우

**증상:**
- 배포된 사이트에서 Amplitude가 초기화되지 않음
- `process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY`가 undefined

**해결 방법:**
1. `.github/workflows/deploy.yml` 파일 확인
2. `Build Next.js` 스텝에 `env` 섹션이 있는지 확인
3. 환경 변수 이름이 `NEXT_PUBLIC_` 접두사로 시작하는지 확인

## 보안 주의사항

### ✅ 해야 할 것
- GitHub Repository Secret 사용
- 환경 변수 이름에 `NEXT_PUBLIC_` 접두사 사용 (클라이언트 사이드)
- `.env.local` 파일을 `.gitignore`에 추가

### ❌ 하지 말아야 할 것
- API Key를 코드에 직접 하드코딩
- `.env.local` 파일을 Git에 커밋
- API Key를 공개 저장소에 노출
- Secret Key 대신 API Key 사용 (Amplitude는 클라이언트용 API Key 사용)

## 추가 환경 변수 (선택사항)

개발/스테이징/프로덕션 환경별로 다른 Amplitude 프로젝트를 사용하려면:

### 개발 환경
`.env.local`:
```bash
NEXT_PUBLIC_AMPLITUDE_API_KEY=dev_api_key_here
```

### 프로덕션 환경
GitHub Repository Secret:
- Name: `AMPLITUDE_API_KEY`
- Value: `prod_api_key_here`

## 참고 자료

- [GitHub Actions - Encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Next.js - Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Amplitude - Browser SDK](https://www.docs.developers.amplitude.com/data/sdks/browser-2/)

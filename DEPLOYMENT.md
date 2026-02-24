# GitHub Pages 배포 가이드

이 문서는 wanbae.github.io를 GitHub Pages에 배포하는 방법을 설명합니다.

## 📋 사전 준비

### 1. GitHub 저장소 생성

1. GitHub에 로그인
2. 새 저장소 생성: `wanbae.github.io`
   - **중요**: 저장소 이름은 반드시 `{username}.github.io` 형식이어야 합니다
   - Public 저장소로 설정
   - README, .gitignore, license 추가 **안함** (이미 로컬에 있음)

### 2. GitHub Secrets 설정

서비스 상태 및 백업 자동 업데이트를 위해 다음 Secrets를 설정해야 합니다:

#### Repository Settings → Secrets and variables → Actions → New repository secret

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `OCI_HOST` | Oracle Cloud 서버 IP | `146.56.185.73` |
| `OCI_SSH_KEY` | SSH private key | `-----BEGIN OPENSSH PRIVATE KEY-----\n...` |

**SSH 키 가져오기:**
```bash
# 현재 서버에서 실행
cat ~/.ssh/id_rsa
```

전체 내용을 복사하여 `OCI_SSH_KEY`에 붙여넣기

---

## 🚀 배포 단계

### Step 1: 로컬 저장소를 GitHub에 푸시

```bash
cd /home/ubuntu/git/wanbae.github.io

# 리모트 추가
git remote add origin https://github.com/wanbae/wanbae.github.io.git

# 기본 브랜치 이름 확인/변경 (main으로 통일)
git branch -M main

# 푸시
git push -u origin main
```

**Personal Access Token (PAT) 필요 시:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Scopes: `repo` (전체 선택)
4. 생성된 토큰을 비밀번호 대신 사용

```bash
# 푸시 시 username과 PAT 입력
git push -u origin main
Username: wanbae
Password: ghp_xxxxxxxxxxxxxxxxxxxx
```

### Step 2: GitHub Pages 활성화

1. GitHub 저장소 페이지 이동
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Pages** 클릭
4. **Source** 섹션:
   - **Source**: GitHub Actions 선택
   - (또는) Branch를 선택하고 `main` / `/ (root)` 선택
5. **Save** 클릭

### Step 3: GitHub Actions 워크플로우 활성화

저장소에 푸시하면 자동으로 워크플로우가 실행됩니다:

1. **Actions** 탭에서 워크플로우 확인
2. 처음 실행 시 권한 승인 필요할 수 있음:
   - Settings → Actions → General
   - Workflow permissions: **Read and write permissions** 선택
   - **Save** 클릭

### Step 4: 배포 확인

1. **Actions** 탭에서 "Deploy to GitHub Pages" 워크플로우 상태 확인
2. 성공 시 약 1-2분 후 사이트 접속 가능:
   - https://wanbae.github.io

---

## 🔄 자동화 워크플로우

### 1. Deploy to GitHub Pages
- **트리거**: main 브랜치 푸시 시
- **동작**: 전체 사이트를 GitHub Pages에 배포
- **소요 시간**: 약 1-2분

### 2. Update Service Status
- **트리거**: 5분마다 (cron: `*/5 * * * *`)
- **동작**:
  1. ChargeBook, Proud English, Reserve Camping 서비스 헬스체크
  2. HTTP 상태 코드 및 응답 시간 측정
  3. `status/status.json` 파일 업데이트
  4. 자동 커밋 및 푸시

### 3. Update Backup Status
- **트리거**: 매일 03:00 UTC (cron: `0 3 * * *`)
- **동작**:
  1. OCI 서버에 SSH 접속
  2. 각 프로젝트의 백업 로그 수집
  3. `backups/backup-status.json` 파일 업데이트
  4. 자동 커밋 및 푸시

---

## 🔧 트러블슈팅

### 문제 1: GitHub Actions 워크플로우 실패

**증상**: Actions 탭에서 워크플로우가 빨간색으로 실패 표시

**해결**:
1. 워크플로우 클릭하여 로그 확인
2. Permission denied 에러 시:
   - Settings → Actions → General → Workflow permissions
   - "Read and write permissions" 선택
3. SSH 관련 에러 시:
   - Secrets에 `OCI_HOST`와 `OCI_SSH_KEY`가 올바르게 설정되었는지 확인
   - SSH 키에 개행문자가 제대로 포함되었는지 확인

### 문제 2: 사이트가 표시되지 않음

**증상**: https://wanbae.github.io 접속 시 404 에러

**해결**:
1. Settings → Pages에서 Source가 올바르게 설정되었는지 확인
2. Actions 탭에서 최근 배포가 성공했는지 확인
3. 브라우저 캐시 삭제 후 새로고침 (Ctrl + Shift + R)
4. 10-15분 정도 기다린 후 재시도 (DNS 전파 시간)

### 문제 3: 서비스 상태가 업데이트되지 않음

**증상**: Status 페이지의 데이터가 Mock Data로 표시

**해결**:
1. Actions 탭에서 "Update Service Status" 워크플로우 수동 실행:
   - Actions → Update Service Status → Run workflow
2. 워크플로우 로그에서 에러 확인
3. 서비스 URL이 실제로 접근 가능한지 확인

### 문제 4: 백업 상태가 업데이트되지 않음

**증상**: Backup Dashboard가 Mock Data로 표시

**해결**:
1. OCI SSH Key가 올바른지 확인:
   ```bash
   # 로컬에서 테스트
   ssh -i ~/.ssh/id_rsa ubuntu@146.56.185.73 "ls -la /home/ubuntu/chargebook/logs/"
   ```
2. 백업 로그 파일이 존재하는지 확인
3. Actions에서 "Update Backup Status" 수동 실행
4. 워크플로우 로그 확인

---

## 🔐 보안 주의사항

1. **SSH Private Key**
   - GitHub Secrets에만 저장
   - 절대 코드에 하드코딩하지 말 것
   - Public 저장소이므로 특히 주의

2. **API Keys / Tokens**
   - 향후 API 문서 등에서 API key가 필요한 경우
   - 반드시 GitHub Secrets 사용
   - `.env` 파일을 `.gitignore`에 추가

3. **민감한 정보**
   - 이메일 주소는 `README.md`에서 실제 값으로 변경
   - 도메인 정보 확인 후 업데이트

---

## 📊 모니터링

### GitHub Actions 실행 상태 확인
```
https://github.com/wanbae/wanbae.github.io/actions
```

### 사이트 상태 확인
```
https://wanbae.github.io
https://wanbae.github.io/status
https://wanbae.github.io/backups
```

### 로그 확인 방법
1. GitHub Actions 탭
2. 해당 워크플로우 클릭
3. 최근 실행 기록 클릭
4. 각 Step 클릭하여 상세 로그 확인

---

## 🎨 커스터마이징

### 색상 변경
`assets/css/style.css`의 `:root` 섹션 수정:
```css
:root {
    --primary: #667eea;    /* 원하는 색상으로 변경 */
    --secondary: #764ba2;
    /* ... */
}
```

### 프로젝트 정보 수정
`index.html`에서 프로젝트 카드 내용 수정

### 서비스 목록 변경
- `status/status.js`: SERVICES 배열 수정
- `backups/backups.js`: PROJECTS 배열 수정
- `.github/workflows/update-service-status.yml`: services 목록 수정

---

## 🚧 향후 계획

- [ ] Custom domain 설정 (예: docs.proudeng.com)
- [ ] 프로젝트별 문서 사이트 (Jekyll)
- [ ] API 문서 페이지 (Swagger UI)
- [ ] 인프라 메트릭 대시보드
- [ ] 알림 기능 (Discord/Slack 웹훅)

---

## 📞 지원

문제가 발생하면:
1. [GitHub Issues](https://github.com/wanbae/wanbae.github.io/issues) 생성
2. Actions 탭의 워크플로우 로그 첨부
3. 에러 메시지 및 스크린샷 포함

---

**배포 성공을 기원합니다! 🎉**

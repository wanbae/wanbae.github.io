# 🚀 빠른 시작 가이드

5분 안에 GitHub Pages 배포하기!

## 📋 필요 사항

- [x] GitHub 계정
- [x] 로컬 Git 저장소 (이미 준비됨: `/home/ubuntu/git/wanbae.github.io`)
- [ ] GitHub Personal Access Token (처음 푸시 시)

---

## ⚡ 3단계 배포

### Step 1: GitHub 저장소 생성 (2분)

1. **브라우저에서 GitHub 로그인**
   - https://github.com

2. **새 저장소 생성**
   - 우측 상단 `+` → `New repository` 클릭
   - Repository name: **`wanbae.github.io`** (정확히 이 이름!)
   - Public 선택
   - ⚠️ **"Add a README file" 체크 해제** (중요!)
   - `Create repository` 클릭

3. **Personal Access Token 생성** (처음 한 번만)
   - Settings → Developer settings → Personal access tokens → Tokens (classic)
   - `Generate new token (classic)` 클릭
   - Note: `github-pages-deploy`
   - Scopes: `repo` (전체 선택)
   - `Generate token` 클릭
   - **토큰 복사** (다시 볼 수 없으니 메모장에 저장!)

---

### Step 2: 코드 푸시 (1분)

```bash
cd /home/ubuntu/git/wanbae.github.io

# Remote 추가
git remote add origin https://github.com/wanbae/wanbae.github.io.git

# 브랜치 이름 확인/변경
git branch -M main

# 푸시
git push -u origin main
```

**인증 프롬프트 나오면:**
```
Username: wanbae
Password: [여기에 Personal Access Token 붙여넣기]
```

---

### Step 3: GitHub Pages 활성화 (1분)

1. **저장소 Settings로 이동**
   - https://github.com/wanbae/wanbae.github.io/settings/pages

2. **Source 설정**
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
   - `Save` 클릭

3. **권한 설정** (GitHub Actions 사용 시)
   - Settings → Actions → General
   - Workflow permissions: **Read and write permissions** 선택
   - `Save` 클릭

---

## ✅ 배포 확인 (1-2분 대기)

### 1. 배포 상태 확인
- https://github.com/wanbae/wanbae.github.io/actions
- 녹색 체크 표시 확인

### 2. 사이트 접속
```
https://wanbae.github.io          → 메인 포트폴리오
https://wanbae.github.io/status   → 서비스 상태
https://wanbae.github.io/backups  → 백업 대시보드
```

### 3. 성공 확인
Settings → Pages에 녹색 메시지:
```
✓ Your site is live at https://wanbae.github.io
```

---

## 🐛 404 에러가 나온다면?

### 즉시 해결 방법

**1. 2-3분 더 기다리기**
- 첫 배포는 최대 10분 소요
- 브라우저 캐시 삭제: `Ctrl + Shift + R`

**2. Settings → Pages 재확인**
- Source가 `main` / `/ (root)`로 설정되었는지 확인

**3. .nojekyll 확인**
```bash
ls -la .nojekyll
# 없으면 이미 커밋되어 있어야 함
```

**4. 강제 재배포**
```bash
git commit --allow-empty -m "Trigger rebuild"
git push
```

**상세 해결법:** `TROUBLESHOOTING.md` 참고

---

## 🔄 자동 업데이트 설정

배포 후 자동화를 활성화하려면:

### 1. GitHub Secrets 추가
Settings → Secrets and variables → Actions → New repository secret

| Secret Name | Value |
|-------------|-------|
| `OCI_HOST` | `146.56.185.73` |
| `OCI_SSH_KEY` | [SSH private key 전체 내용] |

**SSH Key 가져오기:**
```bash
cat ~/.ssh/id_rsa
```

### 2. 워크플로우 활성화
- Push 후 자동으로 활성화됨
- Actions 탭에서 확인:
  - ✅ Update Service Status (5분마다)
  - ✅ Update Backup Status (매일 03:00 UTC)

---

## 📱 다음 단계

### 커스터마이징
1. `index.html` - 프로젝트 정보 수정
2. `assets/css/style.css` - 색상 변경
3. `README.md` - 이메일 주소 업데이트

### 업데이트 푸시
```bash
git add .
git commit -m "Update project info"
git push
```

### 도메인 연결 (선택)
- Settings → Pages → Custom domain
- 예: `docs.proudeng.com`

---

## 📚 추가 문서

- **DEPLOYMENT.md** - 상세 배포 가이드
- **TROUBLESHOOTING.md** - 404 에러 해결
- **README.md** - 프로젝트 개요

---

## 🎉 배포 완료!

모든 단계를 완료하셨다면 축하합니다!

이제 다음을 즐기세요:
- ✅ 무료 호스팅
- ✅ 자동 HTTPS
- ✅ 실시간 서비스 모니터링
- ✅ 자동 백업 대시보드

**Questions?** → https://github.com/wanbae/wanbae.github.io/issues

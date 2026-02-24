# 404 에러 해결 가이드

## 문제 진단

GitHub Pages에서 404 에러가 발생하는 경우 다음 순서로 확인하세요.

---

## ✅ 체크리스트

### 1. GitHub 저장소 확인

**확인 사항:**
- [ ] GitHub에 `wanbae.github.io` 저장소가 생성되어 있는가?
- [ ] 저장소가 **Public**으로 설정되어 있는가?
- [ ] 코드가 푸시되어 있는가?

**확인 방법:**
```bash
# 브라우저에서 확인
https://github.com/wanbae/wanbae.github.io

# 또는 git remote 확인
cd /home/ubuntu/git/wanbae.github.io
git remote -v
```

**해결:**
```bash
# 저장소가 없다면
# 1. GitHub.com에서 New Repository 클릭
# 2. Repository name: wanbae.github.io
# 3. Public 선택
# 4. 아래 명령어로 푸시

cd /home/ubuntu/git/wanbae.github.io
git remote add origin https://github.com/wanbae/wanbae.github.io.git
git push -u origin main
```

---

### 2. GitHub Pages 설정 확인

**확인 사항:**
- [ ] Settings → Pages가 활성화되어 있는가?
- [ ] Source 설정이 올바른가?

**확인 방법:**
1. https://github.com/wanbae/wanbae.github.io/settings/pages 접속
2. **Source** 섹션 확인

**올바른 설정 (방법 A - 추천):**
```
Source: Deploy from a branch
Branch: main
Folder: / (root)
```

**올바른 설정 (방법 B):**
```
Source: GitHub Actions
```

**해결:**
- Source를 위 두 가지 방법 중 하나로 설정
- **Save** 클릭
- 1-2분 대기 후 재접속

---

### 3. 브랜치 이름 확인

**확인 사항:**
- [ ] 기본 브랜치가 `main`인가? (GitHub Pages는 `main` 또는 `master`만 지원)

**확인 방법:**
```bash
cd /home/ubuntu/git/wanbae.github.io
git branch
```

**해결:**
```bash
# 현재 브랜치 이름 변경
git branch -M main

# 푸시
git push -u origin main

# GitHub에서 기본 브랜치 설정
# Settings → Branches → Default branch → main으로 변경
```

---

### 4. index.html 파일 확인

**확인 사항:**
- [ ] 루트 디렉토리에 `index.html`이 있는가?
- [ ] 파일 이름이 정확히 `index.html`인가? (대소문자 구분)

**확인 방법:**
```bash
cd /home/ubuntu/git/wanbae.github.io
ls -la index.html
```

**해결:**
```bash
# index.html이 없다면 재생성 필요
# 이미 있다면 이 문제는 아님
```

---

### 5. .nojekyll 파일 확인

**확인 사항:**
- [ ] `.nojekyll` 파일이 루트에 있는가?

**확인 방법:**
```bash
cd /home/ubuntu/git/wanbae.github.io
ls -la .nojekyll
```

**해결:**
```bash
# 없다면 생성
touch .nojekyll
git add .nojekyll
git commit -m "Add .nojekyll"
git push
```

**이 파일이 중요한 이유:**
- GitHub Pages는 기본적으로 Jekyll을 사용
- `_` (언더스코어)로 시작하는 파일/폴더를 무시
- `.nojekyll`이 있으면 Jekyll 처리를 건너뜀

---

### 6. GitHub Actions 실행 상태 확인

**확인 사항 (GitHub Actions 방식 사용 시):**
- [ ] Actions 탭에서 워크플로우가 성공했는가?

**확인 방법:**
```
https://github.com/wanbae/wanbae.github.io/actions
```

**해결:**
1. 워크플로우가 실패했다면 로그 확인
2. **가장 흔한 원인: 권한 부족**
   - Settings → Actions → General
   - Workflow permissions: **Read and write permissions** 선택
   - Save
3. Actions 탭에서 Re-run all jobs

---

### 7. 빌드 완료 대기

**확인 사항:**
- [ ] 충분히 기다렸는가? (최소 2-3분)

**해결:**
- 첫 배포는 최대 10분까지 걸릴 수 있음
- 브라우저 캐시 삭제: `Ctrl + Shift + R` (또는 `Cmd + Shift + R`)
- 시크릿 모드에서 재시도

---

### 8. DNS/CDN 전파 대기

**확인 사항:**
- [ ] DNS 전파가 완료되었는가?

**해결:**
- 최대 24시간까지 걸릴 수 있음 (드물지만)
- 대부분 10-15분 내 완료

---

## 🚀 빠른 해결 (권장 순서)

### Step 1: 기본 확인
```bash
cd /home/ubuntu/git/wanbae.github.io

# 1. Remote 확인
git remote -v

# 2. 브랜치 확인
git branch

# 3. index.html 확인
ls -la index.html

# 4. .nojekyll 확인
ls -la .nojekyll
```

### Step 2: GitHub 저장소 상태 확인
브라우저에서:
1. https://github.com/wanbae/wanbae.github.io
2. 코드가 푸시되어 있는지 확인
3. `index.html`이 보이는지 확인

### Step 3: GitHub Pages 설정
1. https://github.com/wanbae/wanbae.github.io/settings/pages
2. Source: **Deploy from a branch**
3. Branch: **main** / **/ (root)**
4. Save

### Step 4: 2-3분 대기 후 접속
```
https://wanbae.github.io
```

---

## 🐛 여전히 404가 나온다면?

### 방법 1: 강제 재배포
```bash
cd /home/ubuntu/git/wanbae.github.io

# 빈 커밋으로 재배포 트리거
git commit --allow-empty -m "Trigger rebuild"
git push
```

### 방법 2: GitHub Actions 비활성화하고 직접 배포
```bash
# .github 폴더 임시 제거
mv .github .github.bak
git add .
git commit -m "Use branch deployment instead of Actions"
git push

# GitHub Settings → Pages
# Source: Deploy from a branch
# Branch: main / / (root)
```

### 방법 3: 로컬 테스트로 파일 확인
```bash
cd /home/ubuntu/git/wanbae.github.io

# 로컬 서버 실행
python3 -m http.server 8000

# 다른 터미널에서 테스트
curl -I http://localhost:8000/

# 브라우저에서 확인
# http://<서버IP>:8000
```

---

## 📞 추가 도움

### GitHub 공식 문서
- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

### 일반적인 오류 메시지

**"404 File not found"**
→ index.html이 루트에 없음 또는 Pages가 비활성화됨

**"There isn't a GitHub Pages site here."**
→ Settings → Pages에서 Source가 설정되지 않음

**"Your site is having problems building"**
→ Actions 탭에서 에러 로그 확인

---

## ✅ 배포 성공 확인

다음이 모두 표시되면 성공:

1. **Settings → Pages에 녹색 체크 표시**
   ```
   ✓ Your site is live at https://wanbae.github.io
   ```

2. **Actions 탭에서 녹색 체크 표시**
   ```
   ✓ pages build and deployment
   ```

3. **브라우저에서 사이트 접속 가능**
   ```
   https://wanbae.github.io → 포트폴리오 페이지 표시
   https://wanbae.github.io/status → 서비스 상태 페이지 표시
   https://wanbae.github.io/backups → 백업 대시보드 표시
   ```

---

**문제가 해결되지 않으면 GitHub Issues에 질문해주세요!**

https://github.com/wanbae/wanbae.github.io/issues

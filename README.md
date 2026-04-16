# ETF 대시보드

Grok AI + Cloudflare Workers + GitHub Pages로 만든 ETF 추천 대시보드

## 기능

- 미국/한국/글로벌 ETF 실시간 시세 조회 (Yahoo Finance)
- Grok AI 기반 맞춤형 ETF 추천
- 포트폴리오 관리 및 평가금액 계산
- 섹터별 ETF 분류 및 성과 비교

---

## 배포 가이드

### Step 1 — Cloudflare 설정

```bash
# Wrangler CLI 설치
npm install -g wrangler

# 로그인
wrangler login

# KV 네임스페이스 생성 (출력된 ID를 wrangler.toml에 입력)
cd cloudflare-worker
wrangler kv:namespace create ETF_KV

# Grok API 키 비밀 설정
wrangler secret put GROK_API_KEY

# 로컬 테스트
wrangler dev

# 배포
wrangler deploy
```

배포 완료 후 Worker URL을 복사해둡니다 (예: `https://etf-dashboard-api.your-subdomain.workers.dev`)

---

### Step 2 — GitHub 설정

1. GitHub 저장소 생성 후 이 코드를 push

2. **Settings → Pages** 에서 Source를 `GitHub Actions`로 설정

3. **Settings → Secrets and variables → Actions** 에서 두 가지 Secret 추가:
   - `CLOUDFLARE_API_TOKEN`: Cloudflare 대시보드 → My Profile → API Tokens에서 생성
     - 권한: `Account:Cloudflare Workers:Edit`, `Zone:Workers Routes:Edit`
   - `VITE_WORKER_URL`: Step 1에서 복사한 Worker URL

---

### Step 3 — 배포

```bash
git add .
git commit -m "init: ETF dashboard"
git push origin main
```

GitHub Actions가 자동으로:
1. Cloudflare Worker 배포
2. React 앱 빌드
3. GitHub Pages 배포

---

## 로컬 개발

```bash
# 의존성 설치
npm install

# .env.local 파일 생성
echo "VITE_WORKER_URL=http://localhost:8787" > .env.local

# Worker 로컬 실행 (터미널 1)
cd cloudflare-worker && wrangler dev

# 프론트엔드 실행 (터미널 2)
npm run dev
```

---

## 구조

```
etf-dashboard/
├── .github/workflows/deploy.yml   # CI/CD
├── cloudflare-worker/
│   ├── worker.js                  # API 프록시 (Grok + Yahoo Finance)
│   └── wrangler.toml              # Cloudflare 설정
├── src/
│   ├── App.jsx                    # 메인 앱
│   ├── components/
│   │   ├── Dashboard.jsx          # ETF 시세 대시보드
│   │   ├── AIRecommend.jsx        # AI 추천
│   │   ├── Portfolio.jsx          # 포트폴리오
│   │   └── SectorChart.jsx        # 섹터별 분류
│   └── api/client.js              # API 클라이언트
├── package.json
└── vite.config.js
```

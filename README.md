# maker-tools

핸드메이드·메이커(캔들, 비누, 레진, 뜨개, 재봉, 3D 프린팅)용 무료 계산기 사이트. 영어(/en/)·한국어(/ko/) 이중 구조, 정적 빌드, 광고(AdSense) 수익 모델.

## 명령

```
npm install
npm run dev       # http://localhost:4321
npm run build     # dist/
npm test          # check.mjs: 도구별 계산 예제 검증
```

## 구조

```
backlog.csv                     도구 백로그 54개 (priority 1 = 첫 10개). volume 열은 Keyword Planner로 채움
src/layouts/Base.astro          공용 레이아웃: head/hreflang/글꼴/헤더/푸터
src/styles/site.css             커팅매트 디자인 전체 CSS (색 토큰, 매트·눈금자, 카드, 입력칸, 결과 패널, 모바일 결과 바, 인쇄)
src/styles/ko-fonts.css         한국어 페이지에서만 불러오는 IBM Plex Sans KR (비차단 로드)
src/categories.js               카테고리 이름(en/ko)·색·아이콘. 홈 순서도 여기서 정해짐
src/components/                 CatTile(카테고리 아이콘), Step(번호 카드), Field(입력칸·프리셋·힌트), Seg(단위 토글), Readout(결과 패널+모바일 바)
src/pages/[lang]/[slug].astro   도구 페이지 템플릿 (meta.json + Tool.astro 를 자동으로 묶음)
src/pages/[lang]/index.astro    카테고리별 도구 목록
src/pages/[lang]/{about,privacy,contact}.astro   AdSense 심사 필수 페이지
src/tools/<slug>/meta.json      도구 메타 + en/ko 본문 (title, short, tagline, description, h1, intro, howto[], formula, faq[])
src/tools/<slug>/Tool.astro     도구 UI (입력·출력 마크업, en/ko 라벨)
src/tools/<slug>/calc.js        순수 계산 함수 compute(values) → { 출력키: 값 } (브라우저·Node 공용)
src/tools/form.js               공용 연결: 입력 읽기 → compute → [data-out] 표시, [data-show] 조건부 표시
check.mjs                       도구별 손계산 예제 assert (npm test)
public/_redirects               / → /en/ (Cloudflare 정적 자산 리디렉트)
wrangler.jsonc                  Cloudflare Worker 설정: dist를 정적 자산으로 배포
src/pages/robots.txt.js         robots.txt (site 주소로 생성)
.node-version                   Cloudflare 빌드 Node 버전 고정
```

## 도구 추가 방법 (Claude Code에 그대로 지시)

1. `backlog.csv`에서 다음 `todo` 행을 고르고 `wip`으로 바꾼다.
2. `src/tools/candle-fragrance-load/`를 `src/tools/<slug>/`로 복사한다.
3. `meta.json`: slug/category 수정, en·ko 본문 작성. short(홈 카드용 짧은 이름)와 tagline(관련 도구 카드 한 줄 설명)도 채운다. formula는 "계산식 문장들. Example: 예시" 형식을 지킨다 (ko는 "예: "). 분량 기준은 intro + howto + formula + faq 합쳐 영어 300~500 단어. faq 3개, howto 3~5단계.
4. `calc.js`에 `compute`를 쓰고, `Tool.astro`는 `<form class="tool wrap" id="<slug>">` 안에 `.inputs`(Step 카드들 + Field)와 `Readout`을 둔다. Field의 `name`과 Readout 항목의 `out`을 compute의 키에 맞춘다. 결과 항목 중 size가 xl/lg인 앞의 두 개가 모바일 하단 바에 나온다. 텍스트는 전부 `t` 딕셔너리(en/ko)에, 언어별 기본값(통화 등)은 `d` 객체로 분기한다.
   - 셸 heredoc에 백틱이 든 파일 여러 개를 한 번에 쓰면 Git Bash가 파싱에 실패한다. 파일 쓰기 도구로 하나씩 쓴다.
5. `check.mjs`에 meta.json 계산식 예제와 같은 숫자로 `check(...)` 한 줄 이상 추가하고 `npm test`를 통과시킨다.
6. `npm run build`가 통과하고 `/en/<slug>/`, `/ko/<slug>/`가 생성되는지 확인한다.
7. `backlog.csv` 상태를 `done`으로 바꾼다.

## 배포 (Cloudflare Workers + GitHub 연동)

Cloudflare 프로젝트는 Pages가 아니라 Workers(정적 자산 전용)로 만들어져 있다. `main`에 푸시하면 Workers Builds가 자동으로 빌드·배포한다. 빌드 명령이 `check.mjs`를 먼저 돌리므로 계산 검증이 실패하면 배포되지 않는다.

| 설정 (Worker → Settings → Build) | 값 |
|---|---|
| Git branch | `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |

- `wrangler.jsonc`가 `dist` 폴더를 정적 자산으로 올리라고 지정한다. 이 파일이 없으면 Cloudflare가 프레임워크를 추측해 설정을 자동 생성한다.
- `wrangler.jsonc`의 `name`은 대시보드의 Worker 이름(`maker-tools`)과 같아야 한다.
- `public/_redirects`(/ → /en/)는 Workers 정적 자산에서도 동작한다.
- Node 버전은 `.node-version`으로 고정한다. Cloudflare 빌드 이미지 기본값(22.16)은 Astro 요구사항(22.22 이상)보다 낮다.
- canonical, hreflang, sitemap, robots.txt 주소는 전부 `astro.config.mjs`의 `site`(https://craftnumbers.com)에서 나온다.
- 커스텀 도메인은 Worker의 Domains 탭(또는 Settings → Domains & Routes)에서 연결한다. DNS 레코드는 Cloudflare가 자동으로 만든다.

## 남은 TODO

- [x] 도메인 구입 (craftnumbers.com, Cloudflare Registrar)
- [x] Cloudflare Worker 프로젝트 생성 (maker-tools, GitHub 연동)
- [x] Worker Domains 탭에서 craftnumbers.com, www.craftnumbers.com 연결
- [x] `src/pages/[lang]/contact.astro`의 이메일 교체
- [ ] 도메인 연결 2~4주 뒤 AdSense 신청
- [ ] 승인 후 `Base.astro` head에 AdSense 스크립트 추가, `.ad` 슬롯에 `<ins>` 삽입
- [ ] Search Console에 도메인 속성 등록 → `sitemap-index.xml` 제출

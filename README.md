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
src/layouts/Base.astro          공용 레이아웃: head/hreflang/CSS/헤더/푸터/AdSense 자리
src/pages/[lang]/[slug].astro   도구 페이지 템플릿 (meta.json + Tool.astro 를 자동으로 묶음)
src/pages/[lang]/index.astro    카테고리별 도구 목록
src/pages/[lang]/{about,privacy,contact}.astro   AdSense 심사 필수 페이지
src/tools/<slug>/meta.json      도구 메타 + en/ko 본문 (title, description, h1, intro, howto[], formula, faq[])
src/tools/<slug>/Tool.astro     도구 UI (입력·출력 마크업, en/ko 라벨)
src/tools/<slug>/calc.js        순수 계산 함수 compute(values) → { 출력키: 값 } (브라우저·Node 공용)
src/tools/form.js               공용 연결: 입력 읽기 → compute → [data-out] 표시, [data-show] 조건부 표시
check.mjs                       도구별 손계산 예제 assert (npm test)
public/_redirects               / → /en/ (Cloudflare Pages)
src/pages/robots.txt.js         robots.txt (site 주소로 생성)
.node-version                   Cloudflare 빌드 Node 버전 고정
```

## 도구 추가 방법 (Claude Code에 그대로 지시)

1. `backlog.csv`에서 다음 `todo` 행을 고르고 `wip`으로 바꾼다.
2. `src/tools/candle-fragrance-load/`를 `src/tools/<slug>/`로 복사한다.
3. `meta.json`: slug/category 수정, en·ko 본문 작성. 분량 기준은 intro + howto + formula + faq 합쳐 영어 300~500 단어. faq 3개, howto 3~5단계.
4. `calc.js`에 `compute`를 쓰고, `Tool.astro`에서 form id를 slug와 같게 한 뒤 입력 `name`과 출력 `data-out`을 compute의 키에 맞춘다. 텍스트는 전부 `t` 딕셔너리(en/ko)에 둔다. 언어별 기본값(통화 등)은 `d` 객체로 분기한다.
   - 셸 heredoc에 백틱이 든 파일 여러 개를 한 번에 쓰면 Git Bash가 파싱에 실패한다. 파일 쓰기 도구로 하나씩 쓴다.
5. `check.mjs`에 meta.json 계산식 예제와 같은 숫자로 `check(...)` 한 줄 이상 추가하고 `npm test`를 통과시킨다.
6. `npm run build`가 통과하고 `/en/<slug>/`, `/ko/<slug>/`가 생성되는지 확인한다.
7. `backlog.csv` 상태를 `done`으로 바꾼다.

## 배포 (Cloudflare Pages + GitHub 연동)

`main`에 푸시하면 Cloudflare가 자동으로 빌드·배포한다. 빌드 명령이 `check.mjs`를 먼저 돌리므로 계산 검증이 실패하면 배포되지 않는다.

| 설정 | 값 |
|---|---|
| Framework preset | Astro |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |

- Node 버전은 `.node-version`으로 고정한다. Cloudflare 기본값(22.16)은 Astro 요구사항(22.22 이상)보다 낮아 빌드가 실패한다.
- canonical, hreflang, sitemap, robots.txt 주소는 전부 `astro.config.mjs`의 `site`(https://craftnumbers.com)에서 나온다.
- 커스텀 도메인은 Pages 프로젝트의 Custom domains에서만 연결한다. DNS 레코드를 먼저 손으로 만들면 522 오류가 난다.

## 남은 TODO

- [x] 도메인 구입 (craftnumbers.com, Cloudflare Registrar)
- [ ] Pages 프로젝트 생성 → Custom domains에 craftnumbers.com 연결
- [x] `src/pages/[lang]/contact.astro`의 이메일 교체
- [ ] 도메인 연결 2~4주 뒤 AdSense 신청
- [ ] 승인 후 `Base.astro` head에 AdSense 스크립트 추가, `.ad` 슬롯에 `<ins>` 삽입
- [ ] Search Console에 도메인 속성 등록 → `sitemap-index.xml` 제출

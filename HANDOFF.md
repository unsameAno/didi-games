# DIDI Games — 인수인계 문서 (2026-11-16 기준, v4: 숫자 찾기 추가)

## 한 줄 요약
친구들과 폰으로 즐기는 실시간 미니게임 플랫폼(멀티 + 1인). 가입 없이 닉네임만으로 입장. GitHub Pages(정적 호스팅) + Firebase Realtime Database(실시간 통신). 한국어/일본어 지원. **모바일 우선**(PC는 넓혀서 대응), **도트(픽셀) 디자인**으로 통일.

## 배포·인프라
- 사이트: **GitHub Pages** — 저장소 `unsameAno/didi-games`(Public), 주소 https://unsameano.github.io/didi-games/
  - 이전 Netlify 주소: https://silver-marigold-c5055f.netlify.app (사용 중단)
- 배포 방법: zip을 풀어서 나온 파일들을 GitHub 저장소의 Add file → Upload files에 끌어다 놓고 Commit(같은 이름은 덮어씀, 1~2분 뒤 반영). 사용자가 직접 함. 수정은 모아서 한 번에. Claude 작업 공간에서는 Netlify·Firebase 주소에 접속할 수 없음 → 새 세션에서는 사용자에게 zip을 첨부받아 시작.
- **zip 파일 이름 규칙**: `didi-games-MMDD[b].zip` (예: didi-games-1116.zip, didi-games-1116b.zip). 날짜를 붙여 구분.
- Firebase 프로젝트 `ngmind` (Realtime Database, asia-southeast1). 설정값은 common.js 상단 `firebaseConfig`에 하드코딩 (공개 가능한 값).
  - ⚠️ DB 보안 규칙이 "테스트 모드"라 **2026년 12월 중순쯤 자동으로 잠김**. 그때 게임이 "오프라인"이 되면 Firebase 콘솔 → Realtime Database → 규칙에서 `{"rules":{".read":true,".write":true}}`로 바꾸도록 안내.
- 폰트: 도트 폰트 Galmuri(갈무리, 한글·일본어 지원)를 CDN으로 불러옴(`common.css` 맨 위 @import, jsdelivr `galmuri@latest`). 못 불러오면 Noto Sans KR로 대체.

## 파일 구조 (/home/claude/platform에서 작업)
- `index.html` — 언어 선택(처음 한 번만, localStorage `dm-ui` 있으면 건너뜀) → 닉네임+캐릭터 → 로비. 게임 카드를 누르면 **소개 팝업**(아이콘·소개·인원·시간·언어 표시·규칙 3줄, `NG.GAMES[].info`) → '방 만들기'/'시작하기'. 열린 방·코드·접속자 클릭은 팝업 없이 바로 입장. 로비: 로고(누르면 홈=게임 탭), **'보유 뱃지' 버튼**(PC: 언어 버튼 왼쪽 / 폰: 닉네임 줄 오른쪽 끝, 금색 보석 픽셀 아이콘, NEW 카운터), 랭킹 탭 맨 위에 내 기록 고정, 탭(게임 / 열린 방 / 랭킹 — 모바일에선 화면 아래 고정 탭바), 게임 탭은 **멀티 게임 / 1인 게임** 두 구역, 방 참여(코드로 멀티 게임 방 찾아 입장), 접속 중 패널(모바일에선 접힘). `index.html?tab=rank&g=react`로 열면 해당 게임 랭킹 탭.
- `common.js` — Firebase 초기화, `NG` 네임스페이스: 다국어(`NG.T`, `NG.t`, `NG.addT`, `applyText`가 `[data-ic]` 아이콘도 채움), 사용자(`NG.me`, `NG.login`, uid=정규화 닉네임), **픽셀 아트**: 아바타 16×16 8종(`NG.AV`, `NG.avatarSVG`), 게임 썸네일은 16×16 그림(palette, who, search, mafia, bolt, target, nunchi 등) + 게임별 배경색(`NG.GAMES[].bg`) — 크기는 16의 배수(16/32/48/64)로 써야 또렷함. UI 아이콘(`NG.icon(name,size)` — pad, palette, bolt, door, trophy, globe, key, chat, people, crown, home, play, star, back), 로고(`NG.logoHTML(small)`, `NG.bindLogo(root, onLeave)`), `NG.Room` 클래스(입장/퇴장, 방장=가장 먼저 들어온 사람, 상태 동기화, 채팅, 로비 색인), 랭킹(`recordResult`, `recordBest`, `recordSolo`(낮을수록 좋음), `recordTop`(높을수록 좋음), `leaderboard`, `myStats`), 접속 상태(`setPresence`, `watchPresence`, `setHidePresence`), 모바일 레이아웃(`mobileLayout`), 서버 시간 `NG.now()` = `Date.now() + serverOffset`.
- `common.css` — 도트 테마. 픽셀 테두리는 box-shadow 4방향(계단형 모서리) + 아래 깊이 그림자; 요소마다 `--bc`(테두리색) `--dc`(깊이색) `--dp`(깊이)만 바꿈. 클래스 `.pxb`를 붙이면 아무 요소나 픽셀 테두리. 버튼은 누르면 3px 내려감. 게임 공통 레이아웃(.top/.main/.board/.stage/.side/.quick), 모바일 규칙.
- `draw.html` — Draw Mind(캐치마인드류, 멀티). 제시어 4개 중 선택(쉬움1·보통2·어려움1, 15초), 그리기 1/2/3분, 힌트 초성, 점수 10/15/25 + 속도 보너스, 인원×2 라운드.
- `react.html` — **반응속도 테스트(1인 게임)**. 화면 전체가 터치 패드, 소개 → 빨강(1.5~4.5초 랜덤) → 초록에서 터치 → 기록 표시, 5회. 랭킹은 **평균(avg) 낮은 순**.
- `who.html` — **누구 누구 / だれだれ(멀티, 3~10명)**. 주제("~할 것 같은 사람")가 나오면 각자 한 명에게 무기명 투표(20초) → 1등과 득표수만 공개(7초) → 10개 주제 후 칭호. `anyLang`=true.
- `aim.html` — **에임 테스트(1인)**. 30초 동안 원 맞히기. 빗나가면 -0.5초. 랭킹은 맞힌 개수(hits) 많은 순.
- `ingyu.html` — **잉규게임(멀티, 3~10명, 같은 언어끼리)**. 카테고리 선택 → 고리로 주제어 배정 → 질문/예아니오 → 정답 도전. 랭킹: 1등=승리.
- `mafia.html` — **마피아(멀티, 4~15명, 같은 언어끼리)**. 역할 11종+시민. 낮/밤/투표 사이클. 소리(speechSynthesis + Web Audio 합성).
- `num.html` — **숫자 찾기 / 数字さがし(1인)**. 3·2·1 카운트다운 → 5×5에 섞인 1~25를 순서대로 터치, 틀리면 +0.5초. 기록=time(초, 소수 둘째자리), 랭킹 낮은 순(`recordSolo`). 썸네일 아이콘 `grid`. 뱃지 카운터: f_plays, f_eagle(≤10초), f_doctor(≤15초), f_slow(실수 0), f_slip(실수 5+, 숨김).
- `nunchi.html` — **눈치 게임 / 空気読みゲーム(3~15명, 언어 무관)**. 단판 20초. 누르면 `press/{gid}/{uid} = NG.now()` 기록 → 방장이 판정(`WINDOW=0.3s`, `GRACE=0.5s`). 세 가지 종료: `collide`(0.3초 안에 2명+), `last`(1명 남음), `timeout`(20초 초과). 랭킹은 승리 횟수. 뱃지 카운터: n_plays, n_wins, n_collide, n_last, n_first, n_freeze.
- `badges.js` — **뱃지(업적 50개 + 누구 누구 칭호)**. 모든 페이지에서 common.js 다음에 불러옴. 아래 뱃지 시스템 항목 참조.
- `HANDOFF.md` — 이 문서.

## 뱃지 시스템 (badges.js)
`NG.Badge`: `run(obj)`, `addTitle`, `open()`, `mini(uid,name,av)`, `load()`, `art(id,size,locked)`

### 뱃지 탭
| 탭 ID | 아이콘 | 이름(ko/ja) |
|-------|--------|-------------|
| all | star | 전체 / 全部 |
| react | bolt | 반응속도 / 反射神経 |
| aim | target | 에임 / エイム |
| ingyu | search | 잉규 / インギュ |
| mafia | mafia | 마피아 / マフィア |
| nunchi | nunchi | 눈치 게임 / 空気読み |
| num | grid | 숫자 찾기 / 数字さがし |
| common | globe | 공통 / 共通 |

### 뱃지 목록 요약 (+숫자 찾기 5개)
- **반응속도(react)**: 내 꿈은 프로게이머(≤165ms), 엄청 빠르다(≤200ms), 평범한 속도(300~450ms), 느린 편(≥500ms), 100판(숨김)
- **에임(aim)**: 명사수(≥55), 인간 터렛(≥70), 에임핵 의심(≥80), 초보 사수(≤30), 딱 한 개만(1개), 연습벌레(100판)
- **잉규(ingyu)**: 탈출 성공(첫 승), 고수(5승), 연속 패배(3연패), 힌트 없이 탈출(첫 질문에 정답), 패스의 왕(5번 패스)
- **마피아(mafia)**: 마피아 마스터(10승), 완벽한 하루(첫날 처형 성공), 의심은 금물(10번 경찰), 그게 나야(첫날 처형), 마피아 단체행동(5번 공동승리)
- **눈치(nunchi)**: 1번 선봉대(3번 1등), 역시 눈치왕(3번 승리), 얼음이 되었다(3번 freeze), 동시충돌(collide 10번, 숨김), 눈치 중독(100판)
- **공통(common)**: 올라운더(8게임 모두), 혼자서도 잘 놀아요(1인 게임 r+a+f 50판), 그랜드마스터(금 보석 아이콘)

### 뱃지 아트
16×16 도트 픽셀 아트. `D.art[id]`에 문자열 행 배열로 저장. 팔레트:
```
k=검정, w=흰색/밝음, e=크림, f=살색, g=주황, y=노랑, r=빨강, o=산호
t=하늘, b=파랑, v=보라, p=핑크, n=갈색, j=카키, i=회색, s=은색, .=투명
```
- `D.art.r200` — 번개 손(엄지+검지+중지 편, 번개 마크). 비율: 손바닥 ≈ 중지 길이, 손가락 길이 다양. 첫 행: `.......kk.......`
- `D.art.n_wins`, `n_collide`, `n_last`, `n_first`, `n_freeze` — 눈치 게임 뱃지 아트

### PC 뱃지 탭 접기/펴기
`fitTabs()` 함수. `@media (hover: hover) and (min-width: 620px)` 블록 안에서 작동. 탭이 2줄 이상이면 '더 보기' 버튼 표시, `tabsOpen` 상태로 토글.

### 저장 구조
`badges/{uid}/c` 카운터, `got` 획득 여부, `rep` 대표 뱃지 3개, `titles` 칭호 목록. 새 뱃지 수는 localStorage `dm-bnew`.

## Firebase 데이터 구조
- `badges/{uid}` 뱃지 카운터·획득·대표·칭호
- `users/{uid}` 프로필 · `presence/{uid}` 접속 상태(status: 'lobby'|게임id, code)
- `rooms/{game}/{code}/players|state|chat|strokes|pick|results` (멀티 게임만)
- `lobby/{code}` 열린 방 색인(방장이 갱신, 끊기면 자동 삭제)
- `stats/{game}/{uid}` {name, av, plays, wins, score, best, avg}
- `press/{gid}/{uid}` = 서버 시각 (눈치 게임 전용, 임시)

## 픽셀 아트 시스템
- **아이콘 렌더링**: `NG.icon(name, size)` — 16×16 문자열 행 → SVG `<rect>` 타일. `[data-ic]` 속성으로 자동 채움.
- **아바타**: `NG.avatarSVG(avKey, size)` — 8종 캐릭터 중 하나를 SVG로.
- **뱃지 아트**: `NG.Badge.art(id, size, locked)` — locked=true면 실루엣(투명도 50%, 색상 제거).
- **그림 추가 방법**: `ICONS` 객체에 16행의 문자열 배열 추가. 팔레트 문자 1개 = 1픽셀.
- **미리보기**: `/home/claude/art/` 아래 Python 스크립트들 (새 세션에서는 없음 — badges.js 안의 art가 원본).

## 확정된 설계 결정
- **모바일 우선**: 폰 세로(360~430px) 기준 설계, 터치 영역 44px 이상, 키보드가 열려도 무대가 안 가려지게.
- **도트 디자인 통일**: 각진 픽셀 테두리·계단형 모서리·눌리는 버튼, 도트 폰트(Galmuri), 이모지 대신 픽셀 아이콘.
- `NG.GAMES[].anyLang`=true인 게임은 방 언어 고정 규칙 없음(현재: nunchi, who).
- 게임 구분: `NG.GAMES[].type` = 'multi'(방 만들기) | 'solo'(바로 시작). 로비 목록도 멀티/1인 분리.
- 보유 뱃지 버튼: PC에서는 언어 버튼 왼쪽, 모바일에서는 닉네임 줄 오른쪽 끝.
- 로고 클릭 = 홈(로비). 게임 화면에서 로비로 가면 언어 선택 화면 다시 보여주지 않음.
- 방 언어는 빈 방에 첫 입장한 사람의 화면 언어로 고정. 다른 언어 사용자는 입장 거부.
- 코드 칩 클릭 → 코드 4자리만 복사. 주소 `#코드`로 열면 코드 자동 입력.
- 색: 블랙/보라 기반, 포인트 핑크/노랑/민트/보라/파랑.
- **작업 방식**: 사용자와 먼저 의견을 나누고, "작업해줘"라고 할 때만 작업물을 만든다.

## 작업 규칙 (Claude가 지킬 것)
1. 수정 후 반드시 JS 문법 검사: `node --check common.js badges.js`; html 안 `<script>`는 추출해서 검사
2. zip 재생성:
   ```
   cd /home/claude/platform && rm -f ../didi-games-MMDD.zip && zip -r ../didi-games-MMDD.zip \
     index.html draw.html who.html ingyu.html mafia.html nunchi.html react.html aim.html num.html \
     common.js badges.js common.css HANDOFF.md
   ```
   (새 게임 추가 시 목록에 추가)
3. zip 파일을 SendUserFile로 사용자에게 전송
4. 화면 확인: google-chrome + playwright로 390×844(폰)·1280×800(PC) 스크린샷 (Firebase·폰트 CDN은 막혀 있으니 오프라인 상태로 확인)
5. 큰 변경마다 이 HANDOFF.md와 스킬 모두 갱신

### 새 게임 추가 체크리스트
- [ ] `NG.GAMES[]`에 등록: `{id, type, page, icon, bg, anchor, min, max, anyLang, name{ko,ja}, desc{ko,ja}, rank{field,asc,unit}, info{ko:[],ja:[]}}`
- [ ] 필요한 아이콘을 `common.js ICONS`에 16×16 도트로 추가
- [ ] `{id}.html` 작성 (멀티는 nunchi.html, 1인은 react.html을 템플릿으로)
- [ ] `badges.js`에 탭 추가 + 뱃지 5개 정의 + 아트
- [ ] `badges.js PLAYS` 배열에 `{id}_plays` 추가
- [ ] 올라운더 뱃지 조건 카운터 수 증가
- [ ] 모든 문구 ko/ja 둘 다

### 뱃지 추가 체크리스트
- [ ] `LIST`에 뱃지 한 줄 추가: `[id, tab, counter_key_or_fn, threshold, hidden, {ko,ja}, {ko,ja}]`
- [ ] `D.art[id]`에 16×16 도트 아트 추가
- [ ] 게임 HTML에서 `NG.Badge.run({카운터: 값})` 호출 추가

## 다음 할 일 후보
- ✅ 숫자 찾기 추가, 눈치 게임 썸네일 수정(둥근 머리, 땀방울 머리 안) — 1116d
- **똥피하기류 게임**(1인, 좌우 이동 피하기, 버틴 시간 랭킹) 논의 중
- 이심전심, 기억력 게임, 밸런스 게임
- 랭킹에 "내 기록" 강조·프로필 페이지
- Firebase 규칙 정식 설정 (테스트 모드 2026년 12월 중순 만료 대비)
- Draw Mind 도트 디테일 다듬기 (그림판 도구 아이콘화, 메시지 이모지 → 픽셀 아이콘)

## 아직 검증 안 된 것
- 뱃지: 실제 Firebase에서 카운터 증가, 획득 알림, 대표 뱃지 설정, 친구 프로필(`mini`). 게임별 세부 카운터 대부분(실제 상황).
- 마피아: 소리(음성·배경음), 실제 여러 기기, 마피아 채팅, 방장 교체, 중간 퇴장, 일본어 화면.
- 잉규게임: 채팅 표시, 중간 퇴장 처리, 실제 여러 기기.
- 에임 테스트: 실기기 터치 체감·랭킹 표시.
- 눈치 게임: 실제 Firebase·여러 기기.
- 숫자 찾기: 실기기 터치·랭킹 표시(초 단위).
- v2 도트 리디자인 실기기 확인 (Galmuri 폰트 로딩, iPhone 안전 영역, 아래 탭바).
- 플랫폼 로비(열린 방·접속자·랭킹) 다중 접속 실제 테스트.

# DIDI Games — 인수인계 문서 (2026-11-13 기준, v2: 도트 리디자인)

## 한 줄 요약
친구들과 폰으로 즐기는 실시간 미니게임 플랫폼(멀티 + 1인). 가입 없이 닉네임만으로 입장. Netlify(정적 호스팅) + Firebase Realtime Database(실시간 통신). 한국어/일본어 지원. **모바일 우선**(PC는 넓혀서 대응), **도트(픽셀) 디자인**으로 통일.

## 배포·인프라
- 사이트: https://silver-marigold-c5055f.netlify.app (Netlify, 사용자 계정으로 로그인됨)
- 배포 방법: 파일들을 zip으로 묶어(압축 루트에 index.html) Netlify 프로젝트의 Deploys 탭에 드래그. 사용자가 직접 함. Claude 작업 공간에서는 Netlify·Firebase 주소에 접속할 수 없음 → 새 세션에서는 사용자에게 zip을 첨부받아 시작.
- Firebase 프로젝트 `ngmind` (Realtime Database, asia-southeast1). 설정값은 common.js 상단 `firebaseConfig`에 하드코딩 (공개 가능한 값).
  - ⚠️ DB 보안 규칙이 "테스트 모드"라 **2026년 12월 중순쯤 자동으로 잠김**. 그때 게임이 "오프라인"이 되면 Firebase 콘솔 → Realtime Database → 규칙에서 `".read": true, ".write": true`로 바꾸도록 안내할 것.
- 폰트: 도트 폰트 Galmuri(갈무리, 한글·일본어 지원)를 CDN으로 불러옴(`common.css` 맨 위 @import, jsdelivr `galmuri@latest`). 못 불러오면 Noto Sans KR로 대체.

## 파일 구조 (/home/claude/platform 에서 작업, zip: didi-games-site.zip)
- `index.html` — 언어 선택(**처음 한 번만**, localStorage `dm-ui` 있으면 건너뜀) → 닉네임+캐릭터 → 로비. 게임 카드를 누르면 **소개 팝업**(아이콘·소개·인원·시간·언어 표시·규칙 3줄, `NG.GAMES[].info`) → '방 만들기'/'시작하기'. 열린 방·코드·접속자 클릭은 팝업 없이 바로 입장. 로비: 로고(누르면 홈=게임 탭), 탭(게임 / 열린 방 / 랭킹 — 모바일에선 화면 아래 고정 탭바), 게임 탭은 **멀티 게임 / 1인 게임** 두 구역, 방 참여(코드로 멀티 게임 방 찾아 입장), 접속 중 패널(모바일에선 접힘, 안에 '내 접속 숨기기' 스위치). `index.html?tab=rank&g=react`로 열면 해당 게임 랭킹 탭.
- `common.js` — Firebase 초기화, `NG` 네임스페이스: 다국어(`NG.T`, `NG.t`, `NG.addT`, `applyText`가 `[data-ic]` 아이콘도 채움), 사용자(`NG.me`, `NG.login`, uid=정규화 닉네임), **픽셀 아트**: 아바타 16×16 8종(`NG.AV`, `NG.avatarSVG`), UI 아이콘(`NG.icon(name,size)` — pad, palette, bolt, door, trophy, globe, key, chat, people, crown, home, play, star, back), 로고(`NG.logoHTML(small)`, `NG.bindLogo(root, onLeave)`), `NG.Room` 클래스(입장/퇴장, 방장=가장 먼저 들어온 사람, 상태 동기화, 채팅, 로비 색인), 랭킹(`recordResult`, `recordBest`, `recordSolo`(낮을수록 좋음), `recordTop`(높을수록 좋음), `leaderboard`, `myStats`), 접속 상태(`setPresence`, `watchPresence`, `setHidePresence` — '내 접속 숨기기', localStorage `dm-hide`, 켜면 presence에 쓰지 않음), 모바일 레이아웃(`mobileLayout`: 100svh 기준, 키보드 열림/닫힘·화면 폭 변경·게임 단계 변경 때만 그림판 크기 재계산. `NG.layoutLock`=그리는 중 완전 고정, `NG.layoutHold`=게임 진행 중 유지).
- `common.css` — 도트 테마. 픽셀 테두리는 box-shadow 4방향(계단형 모서리) + 아래 깊이 그림자; 요소마다 `--bc`(테두리색) `--dc`(깊이색) `--dp`(깊이)만 바꿈. 클래스 `.pxb`를 붙이면 아무 요소나 픽셀 테두리. 버튼은 누르면 3px 내려감. 게임 공통 레이아웃(.top/.main/.board/.stage/.side/.quick), 모바일 규칙.
- `draw.html` — Draw Mind(캐치마인드류, 멀티). 제시어 4개 중 선택(쉬움1·보통2·어려움1, 15초), 그리기 1/2/3분, 힌트는 빈 박스→시간 절반 후 초성(일본어는 첫 글자), 점수 10/15/25 + 속도 보너스(그린 사람 절반), 인원×2 라운드. 제시어는 언어별 520개(쉬움 190·보통 200·어려움 130, 분류 20개; 추가분은 `MORE` 블록의 문자열 목록). 같은 방에서 후보로 한 번 나온 제시어는 다시 안 나옴(`rooms/draw/{code}/used`, 방이 비면 초기화, 한 난이도를 다 쓰면 그 난이도만 다시). 일본어 제시어는 [표기, 읽기, 별칭…]. 상단 로고 누르면 방에서 나가 로비로. 모바일: 그리는 사람은 그림판에서 스크롤·확대가 막히고(터치 이벤트 preventDefault), 힌트 칸은 상단바에서 항상 한 줄을 차지해 높이가 안 바뀜. 그리는 사람에게는 정답 입력칸을 숨기고(최근 채팅 2줄만) 그림판을 크게, 게임 중엔 상단바의 언어 배지·연결 상태 숨김.
- `react.html` — **반응속도 테스트(1인 게임, v2에서 새로 만듦)**. 방·코드 없음. 화면 전체가 터치 패드: 소개 → 빨강(1.5~4.5초 랜덤) → 초록에서 터치 → 기록 표시, 5회. 초록 전 터치=반칙(그 라운드 다시), 90ms 미만=찍기 반칙. 결과: 평균·가장 빠름·가장 느림·반칙 수·막대 그래프, 최고 기록 경신 표시, 현재 순위. 랭킹은 **평균(avg) 낮은 순**. PC는 스페이스/엔터.
- `who.html` — **누구 누구 / だれだれ (멀티, 3~10명, 아이스 브레이킹)**. 주제("~할 것 같은 사람")가 나오면 각자 한 명에게 무기명 투표(20초, 자기 자신 불가, 고르고 아래 '투표하기'로 확정) → 1등(동점이면 공동)과 득표수만 공개(7초) → 10개 주제 후 각자 가장 많이 뽑힌 주제(최대 3개) 칭호, 0번이면 '아직 미스터리한 사람'. 랭킹·채팅 없음. 주제는 기본 120 + 매운맛 40을 섞어서 출제(파일 안 `BASIC`/`SPICY`, 한 줄에 `한국어 | 日本語`, 줄 순서가 주제 ID). 같은 방에서 나온 주제는 다시 안 나옴(`used`). **언어가 달라도 같은 방 가능**(`anyLang`) — 각자 자기 언어로 주제를 봄. 저장: `tally/{gid_round}/{뽑힌 uid}`=표 수, `voted/{gid_round}/{투표한 uid}`=true (누가 누구를 골랐는지는 저장하지 않음), state.wins[uid]="주제번호:표수,…".
- `aim.html` — **에임 테스트 / エイムテスト (1인)**. 30초 동안 정사각형 영역에 원(영역의 18%, 고정 크기)이 하나씩 랜덤 위치에 나타나고, 맞히면 다음 원. 빗나가면 개수는 그대로, 남은 시간 -0.5초(누른 자리에 작은 '-0.5초' + 타이머 칸이 잠깐 분홍). 터치는 4px 여유. 결과: 맞힌 개수·정확도·빗나감·최고 기록 경신·순위. 랭킹은 맞힌 개수(hits) 많은 순 + 그 판의 정확도(acc). 폰/PC 구분 없음. 기록은 `NG.recordTop`.
- `HANDOFF.md` — 이 문서.

## Firebase 데이터 구조
- `users/{uid}` 프로필 · `presence/{uid}` 접속 상태(status: 'lobby'|게임id, code — 1인 게임은 code 없음)
- `rooms/{game}/{code}/players|state|chat|strokes|pick|results` (멀티 게임만)
- `lobby/{code}` 열린 방 색인(방장이 갱신, 끊기면 자동 삭제)
- `stats/{game}/{uid}` {name, av, plays, wins, score, best, avg} — react는 avg(평균 최고)·best(한 번 최고)

## 확정된 설계 결정
- **모바일 우선**: 폰 세로(360~430px) 기준 설계, 터치 영역 44px 이상, 주요 버튼은 엄지 닿는 아래쪽, 키보드가 열려도 무대가 안 가려지게. PC는 넓혀서 대응.
- **도트 디자인 통일**: 각진 픽셀 테두리·계단형 모서리·눌리는 버튼, 도트 폰트, 이모지 대신 픽셀 아이콘(게임 안 메시지의 이모지 일부는 남아 있음). 캐릭터는 디즈니처럼 귀여운 느낌(큰 눈·하이라이트·볼터치)의 **DIDI 오리지널** 픽셀 캐릭터 — 기존 캐릭터 IP를 닮게 만들지 않음.
- `NG.GAMES[].anyLang`=true인 게임은 방 언어 고정 규칙을 적용하지 않음(현재 who). `rank`가 없는 게임은 랭킹 탭에 안 나옴.
- 게임 구분: `NG.GAMES[].type` = 'multi'(방 만들기) | 'solo'(바로 시작). 로비 목록도 이 기준으로 위(멀티)/아래(1인) 분리.
- 언어 선택 화면에 안내 문구(일부 게임은 같은 언어끼리만 함께 플레이 가능, ko/ja 병기).
- 작업 방식: 사용자와 먼저 의견을 나누고, 만들어 달라고 할 때만 작업물을 만든다.
- 로고 클릭 = 홈(로비). 게임 화면에서 로비로 가면 언어 선택 화면을 다시 보여주지 않음.
- 사용자 구분은 닉네임만(지인 위주). 나중에 커지면 PIN 추가 예정.
- 방 언어는 빈 방에 첫 입장한 사람의 화면 언어로 고정. 다른 언어 사용자는 입장 거부(안내 후 로비로).
- 빈 방에 첫 입장 시 이전 기록(상태·그림·채팅) 초기화.
- 코드 칩 클릭 → 코드 4자리만 복사(링크 아님). 주소 `#코드`로 열면 코드 자동 입력.
- 모바일 순서(멀티): 상단바 → 그림판(+도구) → 빠른 정답 입력칸(최근 채팅 2줄) → 참가자(가로 칩) → 채팅. 상단바+그림판은 sticky.
- 색: 블랙/보라 기반, 포인트 핑크/노랑/민트/보라/파랑.
- 플랫폼 이름 DIDI Games, 그림 게임 이름 Draw Mind, 반응속도 게임 이름 반응속도 테스트(反射神経テスト).

## 작업 규칙 (Claude가 지킬 것)
- 수정 후 반드시 JS 문법 검사(`node --check common.js`, html 안 `<script>`는 추출해서 검사) → zip 재생성(`cd /home/claude/platform && rm -f ../didi-games-site.zip && zip -r ../didi-games-site.zip index.html draw.html who.html react.html aim.html common.js common.css HANDOFF.md`) → 사용자에게 zip 전송.
- 화면 확인: 작업 공간의 google-chrome + playwright로 390×844(폰)·1280×800(PC) 스크린샷. Firebase·폰트 CDN은 막혀 있으니 오프라인 상태 화면으로 확인(실제 동작은 사용자 테스트).
- 새 게임 추가 시: `NG.GAMES`에 등록(id, type, page, icon(픽셀 아이콘 이름), name/desc ko·ja, min/max, rank{field, asc, unit}) + `{id}.html` 작성(멀티는 draw.html, 1인은 react.html을 템플릿으로) + 다국어 `NG.addT`. 필요한 아이콘은 common.js `ICONS`에 문자열 도트로 추가.
- 모든 문구는 ko/ja 둘 다. 방 안에서 언어가 섞이지 않게.
- 큰 변경마다 이 HANDOFF.md를 갱신.

## 다음 할 일 후보
- 1인 게임 후보: 숫자 순서 터치, 색깔 맞히기, 순간 기억, 타이밍 멈추기
- 라이어 게임(여행용 추천), 텔레스트레이션, 스피드 퀴즈, 마피아, 밸런스 게임, 이심전심
- 랭킹에 "내 기록" 강조·프로필 페이지
- Firebase 규칙 정식 설정(테스트 모드 만료 대비)
- Netlify 사이트 이름 변경(예: didi-games.netlify.app)
- Draw Mind 화면 도트 디테일 다듬기(그림판 도구 아이콘화, 메시지 이모지 → 픽셀 아이콘)

## 아직 검증 안 된 것
- 에임 테스트: 가짜 DB로 자동 플레이 통과(빗나감 4번 → 2초 감소, 기록 저장 확인). 실기기 터치 체감·랭킹 표시는 미확인.
- 누구 누구: 가짜 DB로 한 판 끝까지 자동 테스트는 통과. 실제 Firebase·여러 기기·한일 혼합 방은 미확인.
- v2 도트 리디자인 실기기 확인(특히 Galmuri 폰트 로딩, iPhone 안전 영역, 아래 탭바).
- 반응속도 테스트 실기기 체감 측정값, 랭킹 저장(avg). 이전 '반응속도 대결' 기록(best만 있음)은 새 랭킹(avg)에 안 보임.
- 플랫폼 로비(열린 방·접속자·랭킹) 다중 접속 실제 테스트.

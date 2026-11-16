/* DIDI Games — 공통 모듈
   Firebase 연결, 사용자(닉네임), 다국어, 픽셀 아바타, 방/채팅/랭킹 헬퍼 */
(() => {
  const NG = {};
  window.NG = NG;

  // ═══════════════════ Firebase ═══════════════════
  const firebaseConfig = {
    apiKey: "AIzaSyCi1b16yMwIslcTsXGPar4H_cPX1ZgdPoQ",
    authDomain: "ngmind.firebaseapp.com",
    databaseURL: "https://ngmind-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ngmind",
    storageBucket: "ngmind.firebasestorage.app",
    messagingSenderId: "478774655900",
    appId: "1:478774655900:web:d9d315f250e6302a8e2659",
  };
  let db = null;
  try { firebase.initializeApp(firebaseConfig); db = firebase.database(); } catch (e) { db = null; }
  NG.db = db;
  NG.TS = () => firebase.database.ServerValue.TIMESTAMP;
  // 서버 시간 보정 (반응속도 게임처럼 동시에 시작해야 할 때)
  NG.serverOffset = 0;
  if (db) db.ref('.info/serverTimeOffset').on('value', s => { NG.serverOffset = s.val() || 0; });
  NG.now = () => Date.now() + NG.serverOffset;

  // ═══════════════════ 게임 목록 ═══════════════════
  // type: 'multi' (방 만들고 친구와) | 'solo' (혼자 바로 시작)
  // anyLang: 언어가 달라도 같은 방에서 플레이 가능(방 언어 고정 안 함) · rank 없으면 랭킹 탭에 안 나옴
  // icon/bg: 썸네일 그림과 칸 배경색 · anchor: 'bottom'이면 그림을 칸 바닥에 붙임
  // info: 로비 소개 팝업용 { time, rules[3], tip? }
  NG.GAMES = [
    { id: 'draw',  type: 'multi', page: 'draw.html',  icon: 'palette', bg: '#22386e', min: 2, max: 10, name: { ko: 'Draw Mind', ja: 'Draw Mind' },
      desc: { ko: '그림 보고 제시어 맞히기', ja: '絵を見てお題を当てよう' }, rank: { field: 'wins', label: { ko: '승리', ja: '勝利' } },
      info: { time: { ko: '약 5~15분', ja: '約5〜15分' }, rules: {
        ko: ['차례가 되면 제시어 4개 중 하나를 골라 그려요.', '친구들은 그림을 보고 채팅으로 정답을 맞혀요.', '빨리 맞힐수록, 어려운 단어일수록 점수가 높아요.'],
        ja: ['順番が来たら、お題4つから1つ選んで描きます。', 'みんなは絵を見てチャットで答えを当てます。', '早く当てるほど、難しいお題ほど高得点です。'] } } },
    { id: 'who',   type: 'multi', page: 'who.html',   icon: 'who', bg: '#4a3a10', min: 3, max: 10, anyLang: true, name: { ko: '누구 누구', ja: 'だれだれ' },
      desc: { ko: '첫인상으로 뽑는 무기명 투표', ja: '第一印象で選ぶ匿名投票' },
      info: { time: { ko: '약 5분', ja: '約5分' }, tip: { ko: '4명 이상 추천', ja: '4人以上がおすすめ' }, rules: {
        ko: ['주제가 나오면 가장 어울리는 사람을 한 명 골라요.', '무기명 투표라 누가 골랐는지는 아무도 몰라요.', '가장 많이 뽑힌 사람만 공개! 10개 주제를 돌아요.'],
        ja: ['お題が出たら、一番似合いそうな人を1人選びます。', '匿名投票なので、誰が選んだかは分かりません。', '一番多く選ばれた人だけ発表！お題は10個です。'] } } },
    { id: 'ingyu', type: 'multi', page: 'ingyu.html', icon: 'search', bg: '#11463a', min: 3, max: 10, name: { ko: '잉규게임', ja: 'インギュゲーム' },
      desc: { ko: '서로 주제어를 정해 주고 질문으로 맞히기 (구 양세찬 게임)', ja: 'お互いにお題を決めて、質問で当てよう（私は誰でしょうゲーム）' }, rank: { field: 'wins', label: { ko: '승리', ja: '勝利' } },
      info: { time: { ko: '약 10~20분', ja: '約10〜20分' }, rules: {
        ko: ['서로 다음 사람의 주제어를 정해 줘요. 내 주제어는 나만 못 봐요.', '내 차례에 질문을 하나 하면 친구들이 예 / 아니오 / 애매해로 답해요.', '먼저 맞힐수록 순위가 높아요. 정답은 띄어쓰기 없이, 오타는 오답!'],
        ja: ['次の人のお題をお互いに決めます。自分のお題は自分だけ見えません。', '自分の番に質問を1つすると、みんなが「はい／いいえ／微妙」で答えます。', '早く当てるほど順位が上。答えはスペースなし、打ち間違いは不正解！'] } } },
    { id: 'mafia', type: 'multi', page: 'mafia.html', icon: 'mafia', bg: '#4a1428', anchor: 'bottom', min: 4, max: 15, name: { ko: '마피아', ja: 'マフィア' },
      desc: { ko: '낮에는 토론, 밤에는 암살. 숨은 마피아를 찾아라', ja: '昼は議論、夜は襲撃。隠れたマフィアを探せ' }, rank: { field: 'wins', label: { ko: '승리', ja: '勝利' } },
      info: { time: { ko: '약 15~40분', ja: '約15〜40分' }, tip: { ko: '6~12명 추천', ja: '6〜12人がおすすめ' }, rules: {
        ko: ['시작하면 각자 비밀 역할을 받아요. 방장이 역할 구성을 정해요.', '낮에는 토론하고 투표로 한 명을 처형, 밤에는 마피아와 능력자가 움직여요.', '마피아를 모두 찾으면 시민 승리, 마피아가 절반이 되면 마피아 승리!'],
        ja: ['スタートすると秘密の役職が配られます。構成はホストが決めます。', '昼は議論して投票で1人を処刑、夜はマフィアと能力者が動きます。', 'マフィアを全員見つければ市民の勝ち、マフィアが半数になればマフィアの勝ち！'] } } },
    { id: 'nunchi', type: 'multi', page: 'nunchi.html', icon: 'nunchi', bg: '#5a2740', min: 3, max: 15, anyLang: true, name: { ko: '눈치 게임', ja: '空気読みゲーム' },
      desc: { ko: '같이 누르면 둘 다 탈락! 단판 눈치 싸움', ja: '同時に押すと両方アウト！一発勝負の空気読み' }, rank: { field: 'wins', label: { ko: '승리', ja: '勝利' } },
      info: { time: { ko: '20초', ja: '20秒' }, tip: { ko: '언어가 달라도 함께 할 수 있어요', ja: '言語が違っても一緒に遊べます' }, rules: {
        ko: ['아무 때나 버튼을 눌러 다음 숫자를 가져가요.', '0.3초 안에 두 명이 같이 누르면 둘 다 탈락!', '끝까지 안 누르고 혼자 남아도 탈락이에요.'],
        ja: ['好きなタイミングでボタンを押し、次の数字を取ります。', '0.3秒以内に2人が同時に押すと両方アウト！', '最後まで押さずに1人残ってもアウトです。'] } } },
    { id: 'react', type: 'solo',  page: 'react.html', icon: 'bolt', bg: '#2a2466', min: 1, max: 1, name: { ko: '반응속도 테스트', ja: '反射神経テスト' },
      desc: { ko: '초록불이 켜지면 바로 터치!', ja: '緑になったらすぐタップ！' }, rank: { field: 'avg', label: { ko: '평균 기록', ja: '平均記録' }, asc: true, unit: 'ms' },
      info: { time: { ko: '약 1분', ja: '約1分' }, rules: {
        ko: ['빨간 화면이 초록색으로 바뀌는 순간 터치!', '5번 재서 평균으로 랭킹에 올라가요.', '초록색 전에 누르면 반칙, 그 라운드는 다시 해요.'],
        ja: ['赤い画面が緑に変わった瞬間にタップ！', '5回測って、平均でランキングに載ります。', '緑になる前に押すと反則、そのラウンドはやり直し。'] } } },
    { id: 'aim',   type: 'solo',  page: 'aim.html',   icon: 'target', bg: '#123a48', min: 1, max: 1, name: { ko: '에임 테스트', ja: 'エイムテスト' },
      desc: { ko: '30초 동안 원을 최대한 많이 터치!', ja: '30秒で丸をできるだけ多くタップ！' }, rank: { field: 'hits', label: { ko: '맞힌 개수', ja: '当てた数' }, unit: { ko: '개', ja: '個' }, sub: 'acc' },
      info: { time: { ko: '30초', ja: '30秒' }, rules: {
        ko: ['원이 나타나면 최대한 빨리 터치해요.', '빗나가면 남은 시간이 0.5초 줄어들어요.', '30초 동안 맞힌 개수로 랭킹에 올라가요.'],
        ja: ['丸が出たら、できるだけ早くタップします。', '外すと残り時間が0.5秒減ります。', '30秒間に当てた数でランキングに載ります。'] } } },
    { id: 'num',   type: 'solo',  page: 'num.html',   icon: 'grid', bg: '#3a2a5e', min: 1, max: 1, name: { ko: '숫자 찾기', ja: '数字さがし' },
      desc: { ko: '1부터 25까지 순서대로 빠르게 터치!', ja: '1から25まで順番に素早くタップ！' }, rank: { field: 'time', label: { ko: '최고 기록', ja: 'ベスト記録' }, asc: true, unit: { ko: '초', ja: '秒' } },
      info: { time: { ko: '약 30초', ja: '約30秒' }, rules: {
        ko: ['5×5 칸에 1~25가 섞여 있어요.', '1부터 25까지 순서대로 최대한 빨리 터치!', '틀린 숫자를 누르면 0.5초가 더해져요.'],
        ja: ['5×5のマスに1〜25がバラバラに並んでいます。', '1から25まで順番にできるだけ早くタップ！', '違う数字を押すと0.5秒プラスされます。'] } } },
  ];
  NG.game = (id) => NG.GAMES.find(g => g.id === id);

  // ═══════════════════ 다국어 ═══════════════════
  const T = {
    ko: {
      appName: 'DIDI Games', pickLang: '언어를 선택하세요 · 言語を選んでください',
      nickLabel: '내 닉네임', nickPh: '예: 그림천재', avLabel: '내 캐릭터', enter: '입장하기',
      needNick: '닉네임을 먼저 입력해 주세요!', nickRule: '닉네임은 2~10자예요.', badCode: '방 코드는 영문·숫자 4자리예요.',
      welcome: (n) => `안녕, ${n}!`, lobbyTitle: '게임 고르기', joinRoom: '방 참여', joinTitle: '방 코드 입력', joinGo: '입장',
      openRooms: '열린 방', noRooms: '지금 열린 방이 없어요. 게임을 골라 새 방을 만들어 보세요!', rooms_people: (n, m) => `${n}/${m}명`,
      phase_lobby: '대기 중', phase_playing: '게임 중', hostTag: (n) => `호스트 ${n}`,
      ranking: '랭킹', rankEmpty: '아직 기록이 없어요.', plays: '판', wins: '승', score: '점', best: '최고', accuracy: '정확도',
      myRecord: '내 기록', logout: '닉네임 바꾸기', players: '참가자', chatTitle: '채팅 · 정답', send: '전송',
      spectator: '관전', host: '방장', me: '나', lobby: '대기실', end: '게임 종료', start: '게임 시작!', again: '한 판 더!',
      leave: '나가기', backLobby: '← 로비', connected: '연결됨', connecting: '연결 중…', offline: '오프라인',
      roomLang: (l) => l === 'ja' ? '🇯🇵 일본어 방' : '🇰🇷 한국어 방',
      langMismatch: (l) => l === 'ja' ? '이 방은 🇯🇵 일본어 방이에요. 🌐에서 日本語로 바꾼 뒤 다시 입장해 주세요.' : '이 방은 🇰🇷 한국어 방이에요. 🌐에서 한국어로 바꾼 뒤 다시 입장해 주세요.',
      dupNick: (n) => `「${n}」은(는) 이미 이 방에 접속 중이에요. 다른 기기에서 접속했다면 그쪽을 닫아 주세요.`,
      roomFull: '방이 가득 찼어요. 관전으로 들어가요.', noServer: '😢 서버 연결 실패', noServerText: '잠시 후 다시 시도해 주세요.',
      joined: (n) => `👋 ${n}님이 들어왔어요`, left: (n) => `${n}님이 나갔어요`, copied: '복사됨!',
      copyFail: (c) => `자동 복사가 안 되는 환경이에요. 코드를 직접 알려주세요: ${c}`,
      waitFriends: '친구를 기다리는 중…', ready: '준비 완료!',
      shareCode: (c) => `친구에게 방 코드 「${c}」를 알려주세요. 노란 코드를 누르면 복사돼요.`,
      pressStart: '위의 「게임 시작!」 버튼을 누르세요.', waitHost: (h) => `방장(${h})이 시작하길 기다리는 중…`,
      stop: '게임 중단', stopConfirm: '정말 중단? (한 번 더)', stopped: '── 방장이 게임을 중단했어요 ──',
      winner: (n) => `🏆 우승: ${n}`, pts: (n) => `${n}점`, ranks: ['🥇', '🥈', '🥉'], phChat: '정답 · 채팅', sendFail: '전송 실패',
      needMin: (n) => `${n}명 이상 모이면 시작할 수 있어요.`,
      online: '온라인', onlineTitle: '접속 중', inGame: (g) => `${g} 중`, more: (n) => `+${n}명 더 보기`, less: '접기', joinThis: '이 방으로 →',
    },
    ja: {
      appName: 'DIDI Games', pickLang: '言語を選んでください · 언어를 선택하세요',
      nickLabel: 'ニックネーム', nickPh: '例: おえかき名人', avLabel: 'キャラクター', enter: '入室する',
      needNick: 'まずニックネームを入力してください！', nickRule: 'ニックネームは2〜10文字です。', badCode: '部屋コードは英数字4文字です。',
      welcome: (n) => `こんにちは、${n}！`, lobbyTitle: 'ゲームを選ぶ', joinRoom: '部屋に参加', joinTitle: '部屋コードを入力', joinGo: '入室',
      openRooms: '開いている部屋', noRooms: '今は開いている部屋がありません。ゲームを選んで新しい部屋を作ろう！', rooms_people: (n, m) => `${n}/${m}人`,
      phase_lobby: '待機中', phase_playing: 'プレイ中', hostTag: (n) => `ホスト ${n}`,
      ranking: 'ランキング', rankEmpty: 'まだ記録がありません。', plays: '回', wins: '勝', score: '点', best: 'ベスト', accuracy: '正確度',
      myRecord: '自分の記録', logout: 'ニックネーム変更', players: '参加者', chatTitle: 'チャット・回答', send: '送信',
      spectator: '観戦', host: 'ホスト', me: '自分', lobby: '待機室', end: 'ゲーム終了', start: 'ゲーム開始！', again: 'もう一回！',
      leave: '退出', backLobby: '← ロビー', connected: '接続中', connecting: '接続しています…', offline: 'オフライン',
      roomLang: (l) => l === 'ja' ? '🇯🇵 日本語ルーム' : '🇰🇷 韓国語ルーム',
      langMismatch: (l) => l === 'ja' ? 'この部屋は 🇯🇵 日本語ルームです。🌐で日本語に変えてから入室してください。' : 'この部屋は 🇰🇷 韓国語ルームです。🌐で한국어に変えてから入室してください。',
      dupNick: (n) => `「${n}」は既にこの部屋に接続中です。別の端末で開いている場合はそちらを閉じてください。`,
      roomFull: '部屋が満員です。観戦で入ります。', noServer: '😢 サーバーに接続できません', noServerText: 'しばらくしてからもう一度お試しください。',
      joined: (n) => `👋 ${n}さんが入室しました`, left: (n) => `${n}さんが退出しました`, copied: 'コピーしました！',
      copyFail: (c) => `自動コピーできない環境です。コードを直接伝えてください: ${c}`,
      waitFriends: '友達を待っています…', ready: '準備OK！',
      shareCode: (c) => `友達に部屋コード「${c}」を教えてください。黄色いコードを押すとコピーできます。`,
      pressStart: '上の「ゲーム開始！」を押してください。', waitHost: (h) => `ホスト(${h})の開始を待っています…`,
      stop: 'ゲーム中断', stopConfirm: '本当に中断？(もう一度)', stopped: '── ホストがゲームを中断しました ──',
      winner: (n) => `🏆 優勝: ${n}`, pts: (n) => `${n}点`, ranks: ['🥇', '🥈', '🥉'], phChat: '回答・チャット', sendFail: '送信失敗',
      needMin: (n) => `${n}人以上集まると開始できます。`,
      online: 'オンライン', onlineTitle: '接続中', inGame: (g) => `${g}中`, more: (n) => `+${n}人をもっと見る`, less: '閉じる', joinThis: 'この部屋へ →',
    },
  };
  NG.T = T;
  NG.ui = (navigator.language || '').toLowerCase().startsWith('ja') ? 'ja' : 'ko';
  try { const sv = localStorage.getItem('dm-ui'); if (sv === 'ko' || sv === 'ja') NG.ui = sv; } catch {}
  NG.setUi = (l) => { NG.ui = l === 'ja' ? 'ja' : 'ko'; try { localStorage.setItem('dm-ui', NG.ui); } catch {} document.documentElement.lang = NG.ui; };
  NG.addT = (extra) => { for (const l of Object.keys(extra)) Object.assign(T[l] = T[l] || {}, extra[l]); };
  NG.t = (k, ...a) => { const v = (T[NG.ui] || T.ko)[k] ?? T.ko[k]; return typeof v === 'function' ? v(...a) : (v ?? k); };
  NG.applyText = (root = document) => {
    root.querySelectorAll('[data-t]').forEach(el => { const v = NG.t(el.dataset.t); if (/<br>/.test(v)) el.innerHTML = v; else el.textContent = v; });
    root.querySelectorAll('[data-tph]').forEach(el => { el.placeholder = NG.t(el.dataset.tph); });
    if (NG.applyIcons) NG.applyIcons(root);
  };

  // 문자열 정규화 (정답 비교·닉네임 비교용): 공백 제거, 소문자, 가타카나→히라가나
  NG.norm = (s) => String(s || '').normalize('NFKC').replace(/\s+/g, '').toLowerCase().replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));

  // ═══════════════════ 사용자 ═══════════════════
  // 닉네임이 곧 사용자. uid = 정규화한 닉네임 (Firebase 키로 못 쓰는 문자는 _ 로)
  NG.uidOf = (name) => NG.norm(name).replace(/[.#$/\[\]]/g, '_').slice(0, 24) || 'anon';
  NG.me = null;
  try { const u = JSON.parse(localStorage.getItem('dm-user') || 'null'); if (u && u.name) NG.me = u; } catch {}
  let sid = '';
  try { sid = sessionStorage.getItem('dm-sid') || ''; } catch {}
  if (!sid) { sid = 's' + Math.random().toString(36).slice(2, 10); try { sessionStorage.setItem('dm-sid', sid); } catch {} }
  NG.sid = sid;
  NG.login = (name, av) => {
    name = String(name || '').trim().slice(0, 10);
    NG.me = { uid: NG.uidOf(name), name, av: +av || 0 };
    try { localStorage.setItem('dm-user', JSON.stringify(NG.me)); } catch {}
    if (db) db.ref('users/' + NG.me.uid).update({ name, av: NG.me.av, lang: NG.ui, lastSeen: NG.TS() }).catch(() => {});
    return NG.me;
  };
  NG.logout = () => { NG.me = null; try { localStorage.removeItem('dm-user'); } catch {} };

  // ═══════════════════ 픽셀 아트 (아바타 16×16 · UI 아이콘) ═══════════════════
  // 문자 → 색. '.' 투명, k 윤곽, e 눈, w 흰색/하이라이트, p 볼, m 입, a 메인, b 보조, c 그림자
  const AV = [
    { id: 'cat', name: { ko: '고양이', ja: 'ねこ' }, a: '#ffb347', b: '#ffc2d4', c: '#e8913a', rows: [
      '.k............k.', '.kk..........kk.', '.kbk........kbk.', '.kbbkkkkkkkkbbk.',
      '.kbaaaaaaaaaabk.', '.kaaaacaacaaaak.', '.kaaaaaaaaaaaak.', '.kaaaaaaaaaaaak.',
      'kaaweaaaaaaweaak', 'kaaeeaaaaaaeeaak', 'kaaeeaaaaaaeeaak', 'kappaaammaaappak',
      'kcaaaaaaaaaaaack', '.kcaaaaaaaaaack.', '..kkcccccccckk..', '....kkkkkkkk....',
    ] },
    { id: 'dog', name: { ko: '강아지', ja: 'いぬ' }, a: '#f3d2a2', b: '#a8693f', c: '#dcb27d', rows: [
      '................', '................', '................', '..kkk......kkk..',
      '.kbbbkkkkkkbbbk.', 'kbbbbaaaaaabbbbk', 'kbbbbaaaaaabbbbk', 'kbbbkaaaaaakbbbk',
      'kbkweaaaaaawekbk', 'kbkeeaaaaaaeekbk', 'kaaeeaaaaaaeeaak', 'kappaaakkaaappak',
      'kcaaaaammaaaaack', '.kcaaaaaaaaaack.', '..kkcccccccckk..', '....kkkkkkkk....',
    ] },
    { id: 'bear', name: { ko: '곰', ja: 'くま' }, a: '#b9845a', b: '#efd2aa', c: '#93633d', rows: [
      '................', '.kkk........kkk.', 'kaaak......kaaak', 'kabakkkkkkkkabak',
      '.kaaaaaaaaaaaak.', '.kaaaaaaaaaaaak.', '.kaaaaaaaaaaaak.', '.kaaaaaaaaaaaak.',
      'kaaweaaaaaaweaak', 'kaaeeaaaaaaeeaak', 'kaaeeabkkbaeeaak', 'kappabbmmbbappak',
      'kcaaaabbbbaaaack', '.kcaaaaaaaaaack.', '..kkcccccccckk..', '....kkkkkkkk....',
    ] },
    { id: 'bunny', name: { ko: '토끼', ja: 'うさぎ' }, a: '#f7f3ff', b: '#ffb3c8', c: '#d9d0ee', rows: [
      '....kk....kk....', '...kabk..kbak...', '...kabk..kbak...', '...kabk..kbak...',
      '...kabkkkkbak...', '..kkaaaaaaaakk..', '.kaaaaaaaaaaaak.', '.kaaaaaaaaaaaak.',
      'kaaweaaaaaaweaak', 'kaaeeaaaaaaeeaak', 'kaaeeaaaaaaeeaak', 'kappaaammaaappak',
      'kcaaaaaaaaaaaack', '.kcaaaaaaaaaack.', '..kkcccccccckk..', '....kkkkkkkk....',
    ] },
    { id: 'frog', name: { ko: '개구리', ja: 'かえる' }, a: '#72d66e', b: '#3fa34d', c: '#4cb85a', rows: [
      '................', '..kkk......kkk..', '.kwwek....kewwk.', '.kweek....keewk.',
      '.kaaakkkkkkaaak.', '.kaaaaaaaaaaaak.', '.kaabaaaaaabaak.', '.kaaaaaaaaaaaak.',
      'kaaaaaaaaaaaaaak', 'kaaaaaaaaaaaaaak', 'kappaaaaaaaappak', 'kaakaaaaaaaakaak',
      'kcaakkkkkkkkaack', '.kcaaaaaaaaaack.', '..kkcccccccckk..', '....kkkkkkkk....',
    ] },
    { id: 'chick', name: { ko: '병아리', ja: 'ひよこ' }, a: '#ffe14a', b: '#ff9f3a', c: '#f2c22e', rows: [
      '................', '......k..k......', '.......kk.......', '......kaak......',
      '....kkkkkkkk....', '..kkaaaaaaaakk..', '.kaaaaaaaaaaaak.', '.kaaaaaaaaaaaak.',
      'kaaweaaaaaaweaak', 'kaaeeaaaaaaeeaak', 'kaaeeaaaaaaeeaak', 'kappaabbbbaappak',
      'kcaaaaabbaaaaack', '.kcaaaaaaaaaack.', '..kkcccccccckk..', '....kkkkkkkk....',
    ] },
    { id: 'panda', name: { ko: '판다', ja: 'パンダ' }, a: '#f7f7fb', b: '#4a4560', c: '#d6d6e3', rows: [
      '................', '.kkk........kkk.', 'kbbbk......kbbbk', 'kbbbkkkkkkkkbbbk',
      '.kaaaaaaaaaaaak.', '.kaaaaaaaaaaaak.', '.kaaaaaaaaaaaak.', '.kaaaaaaaaaaaak.',
      'kabbbbaaaabbbbak', 'kabwbbaaaabbwbak', 'kaabbaakkaabbaak', 'kappaaammaaappak',
      'kcaaaaaaaaaaaack', '.kcaaaaaaaaaack.', '..kkcccccccckk..', '....kkkkkkkk....',
    ] },
    { id: 'ghost', name: { ko: '유령', ja: 'おばけ' }, a: '#ece6ff', b: '#b9a6ff', c: '#c9bbff', rows: [
      '................', '....kkkkkkkk....', '..kkaaaaaaaakk..', '.kawaaaaaaaaaak.',
      '.kaaaaaaaaaaaak.', 'kaaaaaaaaaaaaaak', 'kaaaaaaaaaaaaaak', 'kaaaaaaaaaaaaaak',
      'kaaweaaaaaaweaak', 'kaaeeaaaaaaeeaak', 'kaaeeaaaaaaeeaak', 'kappaaammaaappak',
      'kaaaaaaaaaaaaaak', 'kcaaaaaaaaaaaack', 'kcakkaakkaakkack', '.kk..kk..kk..kk.',
    ] },
  ];
  const ICONS = {
    pad: ['..kkkkkkkkkkkk..', '.kllllllllllllk.', 'klvvwvvvvvvyvvvk', 'kvvwwwvvvvvpvmvk', 'kvvvwvvvvvvvgvvk', 'kvvvvvvvvvvvvvvk', 'kvvvvkkkkkkvvvvk', 'kvvvk......kvvvk', '.kkk........kkk.'],
    palette: ['................', '................', '.....kkkkkk.....', '...kknnnnnnkk...', '..knnpnnnnynnk..', '.knnppnnnnyynnk.', '.knnnnnnnnnnnnk.', '.kngnnnnnnnnmnk.', '.knggnnnnnnmmnk.', '.knnnnnkkknnnnk.', '.knnvnk...knnnk.', '..knvvnkkknnnk..', '...kknnnnnnkk...', '.....kkkkkk.....', '................', '................'],
    bolt: ['................', '........kkkkkk..', '.......kqyyyk...', '......kqyyyk....', '.....kqyyyk.....', '....kqyyykkkkk..', '...kqyyyyyyyyk..', '..kkkkkyyyyyk...', '......kyyyok....', '.....kyyyok.....', '....kyyook......', '...kyyook.......', '...kyok.........', '..kyok..........', '..kkk...........', '................'],
    door: ['.kkkkkkkk.', '.kbbbbbbk.', '.kbnnnnbk.', '.kbnnnnbk.', '.kbbbbbbk.', '.kbnnnybk.', '.kbnnnnbk.', '.kbnnnnbk.', '.kbbbbbbk.', 'kkkkkkkkkk'],
    trophy: ['kkkkkkkkkk', 'kyyyyyywyk', 'ykyyyyywky', 'ykyyyyyyky', '.kkyyyykk.', '...kyyk...', '....kk....', '...kyyk...', '..kkkkkk..', '..kooook..', '..kkkkkk..'],
    globe: ['...kkkk...', '..kgmmgk..', '.kmmmggmk.', 'kgmmggggmk', 'kggmgggmmk', 'kgggggmmmk', 'kmmggggmgk', '.kgmmgggk.', '..kgggmk..', '...kkkk...'],
    key: ['.kkkk.....', 'kyyyyk....', 'kykkyk....', 'kyyyykkkkk', '.kkkkyyyyk', '....kykyk.', '....kk.k..'],
    chat: ['.kkkkkkkk.', 'kwwwwwwwwk', 'kwkwkwkwwk', 'kwwwwwwwwk', '.kkwkkkkk.', '..kk......'],
    people: ['..kkkk..', '.kwwwwk.', '.kwwwwk.', '..kkkk..', '.kkkkkk.', 'kppppppk', 'kppppppk', 'kkkkkkkk'],
    crown: ['k...kk...k', 'kk.kyyk.kk', 'kykyyyykyk', 'kyyyyyyyyk', 'kypyymyygk', 'kyyyyyyyyk', 'kkkkkkkkkk'],
    home: ['....kk....', '...kppk...', '..kppppk..', '.kppppppk.', 'kkkkkkkkkk', '.kwwwwwwk.', '.kwwkkwwk.', '.kwwkykwk.', '.kkkkkkkk.'],
    play: ['kk......', 'kwkk....', 'kwwwkk..', 'kwwwwwk.', 'kwwwwwk.', 'kwwwkk..', 'kwkk....', 'kk......'],
    target: ['....kkkkkkkk....', '..kkrrrrrrrrkk..', '.krrwwwwwwwwrrk.', '.krwwrrrrrrwwrk.', 'krwwrrwwwwrrwwrk', 'krwrrwwrrwwrrwrk', 'krwrwwrrrrwwrwrk', 'krwrwrryyrrwrwrk', 'krwrwrryyrrwrwrk', 'krwrwwrrrrwwrwrk', 'krwrrwwrrwwrrwrk', 'krwwrrwwwwrrwwrk', '.krwwrrrrrrwwrk.', '.krrwwwwwwwwrrk.', '..kkrrrrrrrrkk..', '....kkkkkkkk....'],
    search: ['....kkkkkkkk....', '...kyyyyyyyyk...', '...kyykkkkyyk...', '...kyyyyykyyk...', '...kyyyykyyyk...', '...kyyyyyyyyk...', '...kyyyykyyyk...', '..kkkkkkkkkkkk..', '.kffffffffffffk.', '.kffkffffffkffk.', '.kffkffffffkffk.', '.kfpffffffffpfk.', '.kffffkkkkffffk.', '..kffffffffffk..', '...kkffffffkk...', '.....kkkkkk.....'],
    mafia: ['.....llllll.....', '....lxxxxxxl....', '...lxxxxxxxxl...', '...lxxxxxxxxl...', '..llppppppppll..', '.lxxxxxxxxxxxxl.', '..llxxxxxxxxll..', '...lxxxxxxxxl...', '...llxxxxxxll...', '..lxxxxxxxxxxl..', '.lxxxxxxxxxxxxl.', 'lxxxxxxxxxxxxxxl', 'lxxxxxxxxxxxxxxl', 'lxxxxxxxxxxxxxxl', 'lxxxxxxxxxxxxxxl', 'lxxxxxxxxxxxxxxl'],
    moon: ['....kkkk..', '..kkyyyk..', '.kyyykk...', '.kyyk.....', 'kyyyk.....', 'kyyyk.....', '.kyyk.....', '.kyyykk...', '..kkyyyk..', '....kkkk..'],
    sound: ['....kk....', '...kwk..k.', 'kkkwwk...k', 'kwwwwk.k.k', 'kwwwwk.k.k', 'kkkwwk...k', '...kwk..k.', '....kk....'],
    note: ['...kkkkkk.', '...kwwwwk.', '...kwkkwk.', '...kwk.kk.', '...kwk....', '.kkkwk....', 'kwwwwk....', 'kwwwk.....', '.kkk......'],
    nunchi: ['................', '....kkkkkkkk....', '..kkqqffffffkk..', '.kqqffffffffgfk.', '.kqffffffffgggk.', 'kffffffffffgwgfk', 'kffkkfffkkfgggfk', 'kffkwfffkwffgffk', 'kffffffffffffffk', 'kfppffffffffppfk', '.kffffkfkfkfffk.', '.kfffffkfkffffk.', '..kffffffffffk..', '...kkffffffkk...', '.....kkkkkk.....', '................'],
    grid: ['kkkkkkkkkkkkkkkk', 'kmmmmkmmmmkwwwwk', 'kmmmmkmmmmkwwwwk', 'kmmmmkmmmmkwwwwk', 'kmmmmkmmmmkwwwwk', 'kkkkkkkkkkkkkkkk', 'kwwwwkyyyykwwwwk', 'kwwwwkyyyykwwwwk', 'kwwwwkyyyykwwwwk', 'kwwwwkyyyykwwwwk', 'kkkkkkkkkkkkkkkk', 'kwwwwkwwwwkwwwwk', 'kwwwwkwwwwkwwwwk', 'kwwwwkwwwwkwwwwk', 'kwwwwkwwwwkwwwwk', 'kkkkkkkkkkkkkkkk'],
    who: ['.....kkkkkk.....', '.....kwkkwk.....', '.....kwwwkk.....', '.....kwwkwk.....', '.....kwwwwk.....', '.....kwwkwk.....', '.....kwwwwk.....', '..kkkkkkkkkkkk..', '.kvvvvkkkkvvvvk.', '.kvlvvvvvvvvvvk.', '.kvlvvvvvvvvvvk.', '.kvvvvvppvvvvvk.', '.kvvvvppppvvvvk.', '.kvvvvvppvvvvvk.', '.kddddddddddddk.', '..kkkkkkkkkkkk..'],
    star: ['....kk....', '...kyyk...', 'kkkkyykkkk', 'kyyyyyyyyk', '.kyyyyyyk.', '..kyyyyk..', '.kyykkyyk.', '.kkk..kkk.'],
    back: ['...kk.....', '..kwk.....', '.kwwkkkkk.', 'kwwwwwwwwk', '.kwwkkkkk.', '..kwk.....', '...kk.....'],
  };
  const ICON_PAL = {'k': '#2a1f3d', 'w': '#ffffff', 'y': '#ffd23f', 'p': '#ff4d8d', 'm': '#2ee6a6', 'g': '#4d8dff', 'v': '#a46bff', 'l': '#c9a8ff', 'o': '#ff9f3a', 'r': '#e2506e', 's': '#8e94a8', 'd': '#5a4a7a', 'b': '#9b6a3f', 'n': '#c8955f', 'x': '#07050e', 'f': '#ffd9b0', 'q': '#fff1a8'};
  const AV_COMMON = {'k': '#2a1f3d', 'e': '#1d1433', 'w': '#ffffff', 'p': '#ff8fb1', 'm': '#e2506e'};
  NG.AV = AV;
  const pxSVG = (rows, col, size, h) => {
    const w = rows[0].length, ht = rows.length; let r = '';
    rows.forEach((row, y) => { let x = 0; while (x < row.length) { const ch = row[x]; if (!col[ch]) { x++; continue; } let n = 1; while (row[x + n] === ch) n++; r += `<rect x="${x}" y="${y}" width="${n}" height="1" fill="${col[ch]}"/>`; x += n; } });
    const H = h || Math.round(size * ht / w);
    return `<svg viewBox="0 0 ${w} ${ht}" width="${size}" height="${H}" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
  };
  NG.avatarSVG = (i, size = 32) => {
    const a = AV[(+i || 0) % AV.length];
    return `<span class="px" style="width:${size}px;height:${size}px">${pxSVG(a.rows, { ...AV_COMMON, a: a.a, b: a.b, c: a.c }, size, size)}</span>`;
  };
  // 픽셀 아이콘: NG.icon('trophy', 18). HTML에서는 <i data-ic="trophy"></i> → applyText가 채움
  NG.icon = (name, size = 18) => ICONS[name] ? `<span class="pxi">${pxSVG(ICONS[name], ICON_PAL, size)}</span>` : '';
  NG.applyIcons = (root = document) => root.querySelectorAll('[data-ic]').forEach(el => { if (!el.dataset.icDone) { el.innerHTML = NG.icon(el.dataset.ic, +el.dataset.size || 18); el.dataset.icDone = 1; } });
  // 로고 (클릭 → 홈/로비). 게임 화면에서는 onLeave로 방 정리 후 이동
  NG.logoHTML = (small) => `<a class="logo${small ? ' sm' : ''}" href="index.html" title="DIDI Games">${NG.icon('pad', small ? 30 : 40)}<span class="logo-t">DIDI<b>GAMES</b></span></a>`;
  NG.bindLogo = (root, onLeave) => root.querySelectorAll('a.logo').forEach(a => a.addEventListener('click', async (e) => {
    e.preventDefault(); try { if (onLeave) await onLeave(); } catch {} location.href = 'index.html';
  }));

  // ═══════════════════ 접속 상태 (presence/{uid}) ═══════════════════
  // status: 'lobby' | 게임 id,  code: 게임 중이면 방 코드
  // NG.hidePresence: '내 접속 숨기기' (기기에 저장). 켜면 presence에 아무것도 쓰지 않음 → 접속 중 목록·인원수에서 빠짐
  NG.hidePresence = false; try { NG.hidePresence = localStorage.getItem('dm-hide') === '1'; } catch {}
  NG.setPresence = (status, code) => {
    if (!db || !NG.me) return;
    NG._pres = { status: status || 'lobby', code: code || null };
    const ref = db.ref('presence/' + NG.me.uid);
    clearInterval(NG._presT);
    if (NG.hidePresence) { ref.onDisconnect().cancel(); ref.remove().catch(() => {}); return; }
    const data = () => ({ name: NG.me.name, av: NG.me.av, status: NG._pres.status, code: NG._pres.code, lang: NG.ui, updatedAt: NG.TS() });
    ref.onDisconnect().remove();
    ref.set(data()).catch(() => {});
    NG._presT = setInterval(() => { if (!NG.hidePresence) ref.update({ updatedAt: NG.TS() }).catch(() => {}); }, 30000);
    if (!NG._presConn) { NG._presConn = true;
      db.ref('.info/connected').on('value', (sn) => { if (!sn.val() || NG.hidePresence || !NG.me || !NG._pres) return; const r = db.ref('presence/' + NG.me.uid); r.onDisconnect().remove(); r.set(data()).catch(() => {}); });
    }
  };
  NG.setHidePresence = (on) => { NG.hidePresence = !!on; try { localStorage.setItem('dm-hide', on ? '1' : '0'); } catch {} if (NG._pres) NG.setPresence(NG._pres.status, NG._pres.code); };
  NG.watchPresence = (cb) => {
    if (!db) return () => {};
    const ref = db.ref('presence');
    const fn = (sn) => { const all = sn.val() || {}; const now = Date.now();
      const list = Object.entries(all).map(([uid, v]) => ({ uid, ...v })).filter(v => v && v.name && now - (v.updatedAt || 0) < 2 * 60 * 1000)
        .sort((a, b) => (a.uid === (NG.me && NG.me.uid) ? -1 : b.uid === (NG.me && NG.me.uid) ? 1 : 0) || (a.status !== 'lobby') - (b.status !== 'lobby') || a.name.localeCompare(b.name));
      cb(list); };
    ref.on('value', fn); return () => ref.off('value', fn);
  };

  // ═══════════════════ 유틸 ═══════════════════
  NG.genCode = () => { const a = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; let s = ''; for (let i = 0; i < 4; i++) s += a[Math.floor(Math.random() * a.length)]; return s; };
  NG.copyText = (text) => {
    const legacy = () => { try { const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;font-size:16px'; document.body.appendChild(ta); ta.focus(); ta.select(); ta.setSelectionRange(0, text.length); const ok = document.execCommand('copy'); document.body.removeChild(ta); return ok; } catch { return false; } };
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).then(() => true, () => legacy());
    return Promise.resolve(legacy());
  };
  NG.confetti = () => {
    let cc = document.getElementById('confetti'); if (!cc) { cc = document.createElement('canvas'); cc.id = 'confetti'; document.body.appendChild(cc); }
    const ctx = cc.getContext('2d'); cc.width = innerWidth; cc.height = innerHeight;
    let bits = []; for (let i = 0; i < 140; i++) bits.push({ x: innerWidth / 2, y: innerHeight / 3, vx: (Math.random() - .5) * 18, vy: -Math.random() * 16 - 4, r: Math.random() * 7 + 4, c: ['#ff4d8d', '#ffd23f', '#2ee6a6', '#4d8dff', '#a46bff'][i % 5], a: Math.random() * 6 });
    (function step() { ctx.clearRect(0, 0, cc.width, cc.height); bits = bits.filter(b => b.y < cc.height + 20); for (const b of bits) { b.vy += .45; b.x += b.vx; b.y += b.vy; b.a += .2; ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.a); ctx.fillStyle = b.c; ctx.fillRect(-b.r / 2, -b.r / 2, b.r, b.r * .6); ctx.restore(); } if (bits.length) requestAnimationFrame(step); })();
  };
  NG.el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  NG.fmtTime = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

  // ═══════════════════ 방 (Room) ═══════════════════
  // rooms/{game}/{code}/players/{uid}, /state, /chat, 게임별 자유 경로
  // lobby/{code} : 로비에 보이는 열린 방 정보 (방장이 갱신)
  NG.Room = class {
    constructor(gameId, code) {
      this.game = gameId; this.code = code; this.ref = db ? db.ref(`rooms/${gameId}/${code}`) : null;
      this.players = {}; this.state = null; this.isHost = false; this.offs = []; this.hostTimer = null; this.hostFn = null;
      this.nameCache = {}; this.lastChatKey = null; this.handlers = { players: [], state: [], chat: [] };
      this.maxPlayers = (NG.game(gameId) || {}).max || 10;
    }
    on(ev, fn) { this.handlers[ev].push(fn); return this; }
    emit(ev, ...a) { for (const f of this.handlers[ev]) { try { f(...a); } catch (e) { console.error(e); } } }
    listen(ref, ev, fn) { ref.on(ev, fn); this.offs.push(() => ref.off(ev, fn)); }
    playerList() { return Object.entries(this.players).map(([id, p]) => ({ id, ...p })).sort((a, b) => (a.joinedAt - b.joinedAt) || (a.id < b.id ? -1 : 1)); }
    active() { return this.playerList().slice(0, this.maxPlayers); }
    nameOf(id) { const n = this.players[id] && String(this.players[id].name || '').slice(0, 10); if (n) this.nameCache[id] = n; return n || this.nameCache[id] || '?'; }
    avOf(id) { return (this.players[id] && +this.players[id].av) || 0; }
    hostId() { const a = this.active(); return a.length ? a[0].id : null; }

    // 입장. 실패 시 {error: 문구} 반환
    async join(freshState) {
      if (!this.ref || !NG.me) return { error: NG.t('noServer') };
      const me = NG.me;
      try {
        const cur = (await this.ref.child('players').once('value')).val() || {};
        const others = Object.keys(cur).filter(id => id !== me.uid);
        if (cur[me.uid] && cur[me.uid].sid && cur[me.uid].sid !== NG.sid && Date.now() - (cur[me.uid].seen || 0) < 40000) return { error: NG.t('dupNick', me.name) };
        if (others.length === 0) {
          // 빈 방: 이전 기록 정리하고 내 언어로 새로 연다
          await this.ref.set({ state: { ...freshState, lang: NG.ui, langSet: true, phase: 'lobby' } }).catch(() => {});
        } else {
          const st = (await this.ref.child('state').once('value')).val();
          const rl = st && st.lang === 'ja' ? 'ja' : 'ko';
          if (rl !== NG.ui && !(NG.game(this.game) || {}).anyLang) return { error: NG.t('langMismatch', rl) };
        }
      } catch (e) { return { error: NG.t('noServer') }; }

      const meRef = this.ref.child('players/' + me.uid);
      meRef.onDisconnect().remove();
      await meRef.set({ name: me.name, av: me.av, sid: NG.sid, joinedAt: NG.TS(), seen: NG.TS() }).catch(() => {});
      this.seenTimer = setInterval(() => meRef.update({ seen: NG.TS() }).catch(() => {}), 15000);
      NG.setPresence(this.game, this.code);

      this.listen(db.ref('.info/connected'), 'value', (s) => {
        const on = !!s.val(); this.connected = on;
        if (on) { meRef.onDisconnect().remove(); meRef.update({ name: me.name, av: me.av, sid: NG.sid }); }
        this.emit('players', this.playerList(), { connected: on });
      });
      this.listen(this.ref.child('players'), 'value', (s) => {
        const next = s.val() || {}; const notes = [];
        for (const id of Object.keys(next)) if (!this.players[id] && id !== me.uid) notes.push(NG.t('joined', String(next[id].name || '?').slice(0, 10)));
        for (const id of Object.keys(this.players)) if (!next[id]) notes.push(NG.t('left', this.nameOf(id)));
        this.players = next; this.updateHost(); this.emit('players', this.playerList(), { notes });
      });
      this.listen(this.ref.child('state'), 'value', (s) => { this.state = s.val(); this.emit('state', this.state); this.updateLobby(); });
      this.listen(this.ref.child('chat').limitToLast(30), 'child_added', (s) => {
        const m = s.val(); if (!m) return;
        if (this.lastChatKey && s.key <= this.lastChatKey) return; this.lastChatKey = s.key;
        if (m.name && m.by) this.nameCache[m.by] = String(m.name).slice(0, 10);
        this.emit('chat', m);
      });
      return { ok: true };
    }
    updateHost() {
      const nowHost = this.hostId() === (NG.me && NG.me.uid);
      if (nowHost && !this.isHost) { this.isHost = true; if (this.hostFn) { clearInterval(this.hostTimer); this.hostTimer = setInterval(() => { try { this.hostFn(); } catch (e) { console.error(e); } }, 1000); } if (this.ref) db.ref('lobby/' + this.code).onDisconnect().remove(); this.updateLobby(); }
      else if (!nowHost && this.isHost) { this.isHost = false; clearInterval(this.hostTimer); this.hostTimer = null; }
    }
    setHostLoop(fn) { this.hostFn = fn; if (this.isHost) { clearInterval(this.hostTimer); this.hostTimer = setInterval(() => { try { fn(); } catch (e) { console.error(e); } }, 1000); } }
    pushState(state) { this.state = state; if (this.ref) this.ref.child('state').set(state).catch(() => {}); this.emit('state', state); this.updateLobby(); }
    updateLobby() {
      if (!this.isHost || !this.ref || !this.state) return;
      const act = this.active();
      db.ref('lobby/' + this.code).set({ game: this.game, code: this.code, host: NG.me.uid, hostName: NG.me.name, hostAv: NG.me.av, lang: this.state.lang || NG.ui,
        count: act.length, max: this.maxPlayers, phase: this.state.phase === 'lobby' || this.state.phase === 'end' ? 'lobby' : 'playing', updatedAt: NG.TS() }).catch(() => {});
    }
    sendChat(text, extra) {
      text = String(text || '').trim().slice(0, 40); if (!text || !this.ref) return;
      return this.ref.child('chat').push({ by: NG.me.uid, name: NG.me.name, text, ...(extra || {}), t: NG.TS() });
    }
    async leave() {
      for (const f of this.offs) { try { f(); } catch {} } this.offs = [];
      clearInterval(this.hostTimer); clearInterval(this.seenTimer); this.hostTimer = null;
      if (this.ref && NG.me) {
        try { await this.ref.child('players/' + NG.me.uid).remove(); } catch {}
        if (this.isHost) { try { await db.ref('lobby/' + this.code).remove(); } catch {} }
      }
      NG.setPresence('lobby');
      this.isHost = false;
    }
  };

  // ═══════════════════ 랭킹 ═══════════════════
  // stats/{game}/{uid}: { name, av, plays, wins, score, best }
  NG.recordResult = (gameId, { winner, players, scores }) => {
    if (!db) return;
    for (const uid of players || []) {
      const name = (scores && scores.__names && scores.__names[uid]) || null;
      db.ref(`stats/${gameId}/${uid}`).transaction(cur => {
        cur = cur || { plays: 0, wins: 0, score: 0 };
        cur.plays = (cur.plays || 0) + 1;
        if (uid === winner) cur.wins = (cur.wins || 0) + 1;
        if (scores && typeof scores[uid] === 'number') cur.score = (cur.score || 0) + scores[uid];
        if (name) cur.name = name;
        cur.updatedAt = Date.now();
        return cur;
      }).catch(() => {});
    }
  };
  NG.recordBest = (gameId, uid, name, av, value, lowerIsBetter = true) => {
    if (!db) return;
    db.ref(`stats/${gameId}/${uid}`).transaction(cur => {
      cur = cur || { plays: 0, wins: 0, score: 0 };
      if (cur.best == null || (lowerIsBetter ? value < cur.best : value > cur.best)) cur.best = value;
      cur.name = name; cur.av = av; cur.updatedAt = Date.now(); return cur;
    }).catch(() => {});
  };
  // 1인 게임 기록: 판수+1, 더 좋은 값만 갱신 (fields: {avg: 231, best: 198} 등, 낮을수록 좋음)
  NG.recordSolo = (gameId, fields, lowerIsBetter = true) => {
    if (!db || !NG.me) return Promise.resolve(null);
    let prev = null;
    return db.ref(`stats/${gameId}/${NG.me.uid}`).transaction(cur => {
      cur = cur || { plays: 0, wins: 0, score: 0 }; prev = { ...cur };
      cur.plays = (cur.plays || 0) + 1;
      for (const [k, v] of Object.entries(fields)) if (typeof v === 'number' && (cur[k] == null || (lowerIsBetter ? v < cur[k] : v > cur[k]))) cur[k] = v;
      cur.name = NG.me.name; cur.av = NG.me.av; cur.updatedAt = Date.now(); return cur;
    }).then(r => ({ prev, now: r.snapshot.val() })).catch(() => null);
  };
  // 1인 게임 기록(높을수록 좋음): 판수+1, field 값이 더 높을 때만 그 값과 extra(그 판의 부가 기록)를 함께 갱신
  NG.recordTop = (gameId, field, value, extra) => {
    if (!db || !NG.me) return Promise.resolve(null);
    let prev = null;
    return db.ref(`stats/${gameId}/${NG.me.uid}`).transaction(cur => {
      cur = cur || { plays: 0 }; prev = { ...cur };
      cur.plays = (cur.plays || 0) + 1;
      if (cur[field] == null || value > cur[field]) { cur[field] = value; Object.assign(cur, extra || {}); }
      cur.name = NG.me.name; cur.av = NG.me.av; cur.updatedAt = Date.now(); return cur;
    }).then(r => ({ prev, now: r.snapshot.val() })).catch(() => null);
  };
  // 팀 게임 결과: players 모두 판수+1, winners에 든 사람만 승리+1
  NG.recordTeam = (gameId, players, winners) => {
    if (!db) return;
    for (const uid of players || []) db.ref(`stats/${gameId}/${uid}`).transaction(cur => {
      cur = cur || { plays: 0, wins: 0, score: 0 }; cur.plays = (cur.plays || 0) + 1; cur.wins = cur.wins || 0; cur.score = cur.score || 0;
      if ((winners || []).includes(uid)) { cur.wins = (cur.wins || 0) + 1; cur.score = (cur.score || 0) + 10; }
      cur.updatedAt = Date.now(); return cur;
    }).catch(() => {});
  };
  NG.touchProfile = (gameId) => { if (db && NG.me) db.ref(`stats/${gameId}/${NG.me.uid}`).update({ name: NG.me.name, av: NG.me.av }).catch(() => {}); };
  NG.leaderboard = async (gameId, field = 'wins', limit = 20, asc = false) => {
    if (!db) return [];
    const snap = await db.ref(`stats/${gameId}`).orderByChild(field).limitToLast(asc ? 200 : limit).once('value');
    const rows = []; snap.forEach(c => { const v = c.val(); if (v && v[field] != null) rows.push({ uid: c.key, ...v }); });
    rows.sort((a, b) => asc ? a[field] - b[field] : b[field] - a[field]);
    return rows.slice(0, limit);
  };
  NG.myStats = async (gameId) => { if (!db || !NG.me) return null; return (await db.ref(`stats/${gameId}/${NG.me.uid}`).once('value')).val(); };

  // ═══════════════════ 공통 UI 조각 ═══════════════════
  // 참가자 목록 렌더. tagOf(id, idx) → 태그 문자열|null, scoreOf(id) → 숫자|null, hl(id) → 강조 여부
  NG.renderPlayers = (room, el, { tagOf, scoreOf, hl } = {}) => {
    el.innerHTML = '';
    const act = room.active();
    for (const p of room.playerList()) {
      const idx = act.findIndex(a => a.id === p.id);
      const row = NG.el('div', 'pl' + (hl && hl(p.id) ? ' hl' : '') + (p.id === NG.me.uid ? ' me' : ''));
      row.insertAdjacentHTML('beforeend', NG.avatarSVG(p.av, 28));
      row.appendChild(NG.el('span', 'nm', room.nameOf(p.id)));
      const tag = idx < 0 ? NG.t('spectator') : (tagOf && tagOf(p.id, idx)) || (idx === 0 ? NG.t('host') : null);
      if (tag) row.appendChild(NG.el('span', 'tag', tag));
      if (scoreOf) { const sc = scoreOf(p.id); if (sc != null) row.appendChild(NG.el('span', 'sc', sc)); }
      el.appendChild(row);
    }
  };
  // 채팅 로그에 한 줄 추가 (+ 모바일 빠른 입력칸 미러)
  NG.addMsg = (kind, name, text) => {
    const log = document.getElementById('log'); if (!log) return;
    const d = NG.el('div', 'msg ' + (kind || ''));
    if (name) d.appendChild(NG.el('b', '', name));
    d.appendChild(document.createTextNode(text));
    log.appendChild(d); log.scrollTop = log.scrollHeight;
    while (log.children.length > 200) log.removeChild(log.firstChild);
    const q = document.getElementById('qlog'); if (q) { q.appendChild(d.cloneNode(true)); while (q.children.length > 2) q.removeChild(q.firstChild); }
  };
  // 모바일: 무대(stage) 크기 조정.
  // 크기는 '상태가 바뀔 때만' 다시 계산한다 → 키보드 열림/닫힘, 화면 폭(회전) 변경, (게임 중이 아닐 때) 상단바 높이 변화.
  // 주소창이 숨었다 나타나는 것·스크롤·매초 갱신으로는 크기가 바뀌지 않음.
  // NG.layoutLock: 손가락으로 그리는 중(완전 고정) / NG.layoutHold: 게임 진행 중(키보드·회전 때만 변경)
  NG.mobileLayout = (extraSelector) => {
    NG.layoutLock = false; NG.layoutHold = false;
    // 100svh(주소창이 보일 때의 작은 화면 높이)를 기준으로 삼아 주소창 때문에 흔들리지 않게
    const probe = document.createElement('div');
    probe.style.cssText = 'position:fixed;top:0;left:-10px;width:1px;height:100vh;height:100svh;visibility:hidden;pointer-events:none';
    document.body.appendChild(probe);
    let last = null;
    const sync = (force) => {
      try {
        const top = document.querySelector('.top'); if (!top) return;
        const toph = top.offsetHeight;
        document.documentElement.style.setProperty('--toph', toph + 'px');
        if (innerWidth > 760) { document.documentElement.style.removeProperty('--cvh'); last = null; return; }
        if (NG.layoutLock && force !== true) return;
        const H = probe.offsetHeight || innerHeight;
        const vh = window.visualViewport ? window.visualViewport.height : innerHeight;
        const kb = H - vh > 150;                               // 150px 이상 줄었으면 키보드가 열린 것
        if (last && force !== true) {
          const same = last.kb === kb && last.w === innerWidth;
          if (same && (NG.layoutHold || Math.abs(toph - last.toph) < 8)) return;   // 같은 상태면 크기 유지
        }
        let used = 0; document.querySelectorAll(extraSelector || '.tools, .quick').forEach(e => used += e.offsetHeight);
        const avail = Math.max(140, Math.round((kb ? vh : H) - toph - used - 44));
        last = { kb, w: innerWidth, toph };
        document.documentElement.style.setProperty('--cvh', avail + 'px');
      } catch {}
    };
    window.addEventListener('resize', () => sync());
    window.addEventListener('orientationchange', () => { last = null; setTimeout(() => sync(true), 350); });
    if (window.visualViewport) window.visualViewport.addEventListener('resize', () => { sync(); setTimeout(sync, 200); });
    document.querySelectorAll('.quick input').forEach(i => i.addEventListener('focus', () => setTimeout(() => { sync(); window.scrollTo({ top: 0, behavior: 'smooth' }); }, 300)));
    NG.syncLayout = (force) => sync(force === true && !NG.layoutLock ? true : undefined); sync(true);
  };
  // 코드 칩 클릭 → 코드 복사
  NG.bindCodeChip = (chip, code) => chip.addEventListener('click', () => {
    NG.copyText(code).then(ok => { if (ok) { chip.textContent = NG.t('copied'); setTimeout(() => chip.textContent = code, 1200); } else { chip.textContent = code; NG.addMsg('sys', '', NG.t('copyFail', code)); } });
  });
  // 로그인 안 됐으면 로비로
  NG.requireLogin = () => { if (!NG.me) { location.href = 'index.html' + (location.hash || ''); return false; } return true; };
  NG.codeFromHash = () => { const h = (location.hash || '').replace('#', '').toUpperCase(); return /^[A-Z0-9]{4}$/.test(h) ? h : ''; };
})();

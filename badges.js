/* DIDI Games — 뱃지 (업적 + 누구 누구 칭호). common.js 다음에 불러온다.
   저장: badges/{uid}/c/{카운터}=숫자 · got/{뱃지id}=얻은 시각 · rep=[대표 뱃지 최대 3개] · titles/{주제번호}={n,ko,ja}
   각 게임은 NG.Badge.run({카운터: 늘릴 값 또는 true}) 만 부르면 됨. 조건 판정·획득 알림은 여기서 처리.
   새 뱃지 추가: 아래 LIST에 한 줄 + ART에 16×16 그림(없으면 로고 그림). 서버가 없어 조작은 막을 수 없음(재미용). */
(() => {
  const NG = window.NG; if (!NG) return;
  const db = NG.db, D = {"art":{"r165":["....kkkkkkkk....","...kggggggggk...","..kggkkkkkkggk..",".kggkffffffkggk.",".kgkffffffffkgk.","kkkkfkffffkfkkkk","kggkfkffffkfkggk","kggkffffffffkggk","kggkfpffffpfkggk","kkkkffkkkkffkkkk","..kkkffffffkkgk.","....kkkkkkk.kgk.","...........kgk..","........kkkgk...","........kggk....","........kkk....."],"r200":[".......kk.......", "....kkkffkkk....", "...kffkffkffk...", "...kffkffkffkkk.", "...kffkffkffkffk", "...kffkffkffkffk", ".kkkffkffkffkffk", "kffkffkffkffkffk", "kffkfffffffffffk", "kffffffffyyffffk", "kfffffffyyfffffk", ".kfffffyyyyffffk", "..kfffffyyfffffk", "...kfffyyfffffk.", "....kffyfffffk..", "....kkkkkkkkkk.."],"r_slow":["................","................","...kkkkkkkkkk...","..kbbbbbbbbbbk..",".kbbnnnnnnnnbbk.",".kbnnnnnnnnnnbk.","kbnddnnnnnnddnbk","kbdkdnnnnnndkdbk","kbnddnnkknnddnbk","kbnnnnnnnnnnnnbk",".kbnnkkkkkknnbk.",".kbbnnnnnnnnbbk.","..kbbbbbbbbbbk..","...kkkkkkkkkk...","................","................"],"a55":[".......kk.......",".....kkmmkk.....","...kkmmkkmmkk...","..kmm..kk..mmk..","..km........mk..",".km..........mk.",".km....rr....mk.","kmkk..rrrr..kkmk","kmkk..rrrr..kkmk",".km....rr....mk.",".km..........mk.","..km........mk..","..kmm..kk..mmk..","...kkmmkkmmkk...",".....kkmmkk.....",".......kk......."],"a80":[".......kk.......",".......kk.......","..kkkkkkkkkkkk..",".kssssssssssssk.",".kssssssssssssk.",".kskkkksskkkksk.",".kskrrksskrrksk.",".kskrrksskrrksk.",".kskkkksskkkksk.",".kssssssssssssk.",".ksskwkwkwkkssk.",".ksskkkkkkkkssk.",".kssssssssssssk.","..kkkkkkkkkkkk..","...kk......kk...","................"],"m_wins":["................","................",".......kk.......","......kyyk......",".....kkyykk.....","....kkkkkkkk....","...kddddddddk...","...kddddddddk...","...kddddddddk...","...kppppppppk...","kkkkddddddddkkkk","kddddddddddddddk",".kkkkkkkkkkkkkk.","................","................","................"],"m_police":["....kkkkkk......","..kkuuuuuukk....",".kuuwwuuuuuuk...",".kuwwuuuuuuuk...","kuuwuuuuuuuuuk..","kuuuuuuuuuuuuk..","kuuuuuuuuuuuuk..","kuuuuuuuuuuuuk..",".kuuuuuuuuuuk...",".kuuuuuuuuuuk...","..kkuuuuuukkk...","....kkkkkkkbbk..","...........kbbk.","............kbbk",".............kkk","................"],"g_dawn":["............w...","....kkkkk..www..","..kkyyyyk...w...",".kyyyykk........",".kyyyk.......w..","kyyyyk..........","kyyyk....w......","kyyyk...www.....","kyyyk....w......","kyyyyk..........",".kyyyk.....kk...",".kyyyykk.kkyk...","..kkyyyykyyyk...","....kkyyyyykk...","......kkkkk.....","................"],"d_plays":["................","................",".....kkkkkk.....","...kknnnnnnkk...","..knnpnnnnynnk..",".knnppnnnnyynnk.",".knnnnnnnnnnnnk.",".kngnnnnnnnnmnk.",".knggnnnnnnmmnk.",".knnnnnkkknnnnk.",".knnvnk...knnnk.","..knvvnkkknnnk..","...kknnnnnnkk...",".....kkkkkk.....","................","................"],"g_solo":["................","................","................","..kkkkkkkkkkkk..",".kllllllllllllk.","klvvwvvvvvvyvvvk","kvvwwwvvvvvpvmvk","kvvvwvvvvvvvgvvk","kvvvvvvvvvvvvvvk","kvvvvkkkkkkvvvvk","kvvvk......kvvvk",".kkk........kkk.","................","................","................","................"],"t_talent":["................","................","................","......kkkkkk....","......kwwwwk....","......kwkkwk....","......kwk.kk....","......kwk.......","....kkkwk.......","...kwwwwk.......","...kwwwk........","....kkk.........","................","................","................","................"],"r250":["................","................","................","............kk..","...........kmk..","..........kmmk..",".........kmmk...","..kk....kmmk....","..kmk..kmmk.....","..kmmkkmmk......","...kmmmmk.......","....kmmk........",".....kk.........","................","................","................"],"r400":["................","................",".....kkkkkk.....","...kkyyyyyykk...","...kyyyyyyyyk...","..kyyyyyyyyyyk..","..kykkkyykkkyk..","..kyyyyyyyyyyk..","..kyyyyyyyyyyk..","..kyyyykkyyyyk..","..kyyyykkyyyyk..","...kyyyyyyyyk...","...kkyyyyyykk...",".....kkkkkk.....","................","................"],"r_foul5":["................",".......kk.......","......krk.......","......krrk......",".....krrrk.k....","....krrrrkkrk...","....krrorrrrk...","...krroorrrrk...","...krrooorork...","..krrooyooorrk..","..krroyyyoorrk..","..krroyyyyorrk..","...krroyyorrk...","....kkrrrrkk....","......kkkk......","................"],"r_guess":["................","................","..kkkkkkkkkkkk..","..kwwwwwwwwwwk..","..kwkkwwwwkkwk..","..kwkkwwwwkkwk..","..kwwwwwwwwwwk..","..kwwwwkkwwwwk..","..kwwwwkkwwwwk..","..kwwwwwwwwwwk..","..kwkkwwwwkkwk..","..kwkkwwwwkkwk..","..kwwwwwwwwwwk..","..kkkkkkkkkkkk..","................","................"],"r_plays":["................","................","......kkkk.kkk..","....kkggggkkgk..","...kggkkkkgggk..","..kggk....kggk..","..kgk....kkkkk..","..kgk...........","..kgk...........","..kgk......kkk..","..kggk....kggk..","...kggkkkkggk...","....kkggggkk....","......kkkk......","................","................"],"a70":["................","................","...........kkkk.","........kkkssk..",".....kkkssskk...","...kksssskk.....","..kssssskk......","..ksskkk........","...kkgggkk......","..kggggggggk....",".kggggggggggk...",".kgkkggggkkgk...",".kkkkkkkkkkkk...","................","................","................"],"a_perfect":["................","...........kk.k.",".....kkkk.kwkwk.","...kkrrrrkkwwk..","..krrwwwwkwwkk..","..krwwrrkwwkrk..",".krwwrrkwkrwrk..",".krwrrykkrrwrk..",".krwrryyrrrwrk..",".krwwrrrrrwwrk..","..krwwrrrrwwk...","..krrwwwwwrrk...","...kkrrrrrkk....",".....kkkkk......","................","................"],"a_acc50":["................","......kkkk......",".....kffffk.....",".....kffffk.....",".....kfwwfk.....",".....kffffk.....",".....kffffk.....",".....kffffkkk...","...kkkffffkffk..","..kffkffffkffk..","..kffkfffffffk..","..kfffffffffk...","...kffffffffk...","....kffffffk....","....kkkkkkkk....","................"],"a_miss30":["................",".....kkkkkk.....",".....kbkkbk.....",".....kkbbkk.....","......kbbk......","......kbbk......","......kbbk......","......kbbk......","....kkkbbkkk....","....kssssssk....","....kssssssk....","....kssssssk....",".....kssssk.....","......kssk......",".......kk.......","................"],"a_lost":["................","...kkkkkkkkkk...","...kbbbbbbbbk...","....kwwwwwwk....","....kwyyyywk....",".....kwyywk.....","......kwyk......",".......kk.......","......kwyk......",".....kwwywk.....","....kwwwywwk....","....kwyyyywk....","...kbbbbbbbbk...","...kkkkkkkkkk...","................","................"],"a_one":["................","................",".......kkk......","......kyyk......",".....kyyyk......","....kyyyyk......","....kkkyyk......","......kyyk......","......kyyk......","......kyyk......","......kyyk......","....kkkyykkk....","....kyyyyyyk....","....kkkkkkkk....","................","................"],"a_plays":["................","................","................","................","..kkkkkkkkkkkk..",".knnnnwwwwnnnnk.",".knknnwwwwnnknk.",".knnnnwkkwnnnnk.",".knnnnwkkwnnnnk.",".knknnwwwwnnknk.",".knnnnwwwwnnnnk.","..kkkkkkkkkkkk..","................","................","................","................"],"m_mafwin":["................",".....kkkkk......","....krrrrrk.....","...krrkkrrrk....","...krkrrkrrk....","...krrrrrrrk....","....krrrrrk.....",".....kkkkk......",".......kt.......","....kk.kt.......","...kttkkt.......","....kttt........",".......kt.......",".......kt.......",".......kk.......","................"],"m_doc":["................","................","..kkkkkkkkkkkk..","..kwwwwwwwwwwk..","..kwwwwrrwwwwk..","..kwwwwrrwwwwk..","..kwwwwrrwwwwk..","..kwrrrrrrrrwk..","..kwrrrrrrrrwk..","..kwwwwrrwwwwk..","..kwwwwrrwwwwk..","..kwwwwrrwwwwk..","..kwwwwwwwwwwk..","..kkkkkkkkkkkk..","................","................"],"m_jokerwin":["................","................","..k....kk....k..",".kyk..kvvk..kyk.","..kvk.kvvk.kvk..","..kvvkkvvkkvvk..","...kvvvvvvvvk...","...kvvpvvpvvk...","...kvvvvvvvvk...","..kkkkkkkkkkkk..","..kffffffffffk..","..kfkffffffkfk..","..kffkkkkkkffk..","...kkkkkkkkkk...","................","................"],"m_exec1":["................",".....kkkkkk.....","....kssssssk....","...kssssssssk...","...kssssssssk...","...kssskksssk...","...kskkkkkksk...","...kssskksssk...","...kssskksssk...","...kssssssssk...","...kssssssssk...","...kssssssssk...","...kkkkkkkkkk...","...tttttttttt...","................","................"],"m_cit_exec":["................","................",".....kkkkkk.....","...kkyyyyyykk...","...kyyyyyyyyk...","..kykkyyyykkyk..","..kykkyyyykkyk..","..kyuuyyyyuuyk..","..kyuuyyyyuuyk..","..kyuuykkyuuyk..","..kyyykyykyyyk..","...kyyyyyyyyk...","...kkyyyyyykk...",".....kkkkkk.....","................","................"],"m_night1":["................",".......kk.......","......kwwk......","......kwsk......","......kwsk......","......kwsk......","......kwsk......","......kwsk......","......kwsk......","....kkkkkkkk....","....kyyyyyyk....","....kkkbbkkk....","......kbbk......","......kbbk......","......kkkk......","................"],"m_flawless":["................","................","................","kk..kkk..kkk..kk","kwkkrrrkkrrrkkwk","kwwkrwrrrrrrkwwk",".kwkrrrrrrrrkwk.",".kwwkrrrrrrkwwk.","..kkkrrrrrrkkk..","....krrrrrrk....",".....krrrrk.....","......krrk......",".......kk.......","................","................","................"],"m_plays":["................","................","....k..k..k.....",".....k..k..k....","....k..k..k.....","..kkkkkkkkkk....","..kwwwwwwwwkkk..","..kwbbbbbbwkwk..","..kwwwwwwwwkwk..","..kwwwwwwwwkwk..","..kwwwwwwwwkkk..","..kwwwwwwwwk....","...kwwwwwwk.....","....kkkkkk......","................","................"],"d_wins":["................","................","...........kkk..","..........kbbk..",".........kbbk...","........kbbk....",".......kbbk.....","......kssk......",".....kssk.......","....kppk........","...kpppk........","..kpppk.........","..kppk..........","..kkk...........","................","................"],"d_correct":["................","................","................","................",".....kkkkkk.....","...kkwwwwwwkk...","..kwwwggggwwwk..",".kwwwggkkggwwwk.",".kwwwggkkggwwwk.","..kwwwggggwwwk..","...kkwwwwwwkk...",".....kkkkkk.....","................","................","................","................"],"d_fast":["................","......kkkk......","......kssk......",".......kk..k....",".....kkkkkkkk...","....kwwwwwwk....","...kwwwwkwwwk...","..kwwwwwkwwwwk..","..kwwwwwkwwwwk..","..kwwwwwkkkwwk..","..kwwwwwwwwwwk..","...kwwwwwwwwk...","....kwwwwwwk....",".....kkkkkk.....","................","................"],"d_picasso":["................","................",".....kkkkkk.....","...kkuuuyyykk...","...kuuuuyyyyk...","..kuukkuyyyyyk..","..kuukkukyyyyk..","..kuuuuukykkyk..","..kuuuuukykkyk..","..kuuuukkyyyyk..","..kuurrrkyyyyk..","...kuurrryyyk...","...kkuuuyyykk...",".....kkkkkk.....","................","................"],"d_close":["................","................",".....kkkkkk.u...","...kkyyyyyykuu..","...kyyyyyyyyku..","..kyyyyyyyyyyk..","..kykkyyyykkyk..","..kykkyyyykkyk..","..kyyyyyyyyyyk..","..kyyyyyyyyyyk..","..kyykkkkkkyyk..","...kyyyyyyyyk...","...kkyyyyyykk...",".....kkkkkk.....","................","................"],"i_oneshot":["................",".....kkkkkk.....","....kyyyyyyk....","...kyyqyyyyyk...","...kyqyyyyyyk...","...kyyyyyyyyk...","...kyyyyyyyyk...","....kyyyyyyk....",".....kyyyyk.....",".....kyyyyk.....",".....kkkkkk.....",".....kssssk.....",".....kkkkkk.....","......kssk......",".......kk.......","................"],"i_first":["................","................","................",".k.....kk.....k.",".kk...kyyk...kk.",".kyk..kyyk..kyk.",".kyyk.kyyk.kyyk.",".kyyykyyyykyyyk.",".kyyyyyyyyyyyyk.",".kyryyyygyyyryk.",".kyyyyyyyyyyyyk.",".kkkkkkkkkkkkkk.","................","................","................","................"],"i_wrong":["................","..kkkkkkkkkk....","..kwwwwwwwwkk...","..kwwwwwwwwwk...","..kwrwwwwrwwk...","..kwwrwwrwwwk...","..kwwwrrwwwwk...","..kwwwrrwwwwk...","..kwwrwwrwwwk...","..kwrwwwwrwwk...","..kwwwwwwwwwk...","..kwsssssswwk...","..kwwwwwwwwwk...","..kkkkkkkkkkk...","................","................"],"i_last":["................",".....kkkkkk.....","....kvvvvvvk....","...kvvkkkkvvk...","...kvk....kvk...","...kkk...kvvk...","........kvvk....",".......kvvk.....","......kvvk......","......kvk.......","......kkk.......","................","......kkk.......","......kvk.......","......kkk.......","................"],"i_pass5":["................","................","................",".kk.....kk......",".kgk....kgk.....",".kggk...kggk....",".kgggk..kgggk...",".kggggk.kggggk..",".kggggk.kggggk..",".kgggk..kgggk...",".kggk...kggk....",".kgk....kgk.....",".kk.....kk......","................","................","................"],"w_star":["................",".......kk.......","......kyyk......","......kyyk......",".....kyyyyk.....",".kkkkkyyyykkkkk.",".kyyyyyyyyyyyyk.","..kyyyyyyyyyyk..","...kyyyyyyyyk...","....kyyyyyyk....","...kyyyyyyyyk...","...kyyykkyyyk...","..kyyyk..kyyyk..","..kykk....kkyk..","..kk........kk..","................"],"w_none":["................",".....kkkkkk.....","....kddddddk....","...kddkkkkddk...","...kdkxxxxkdk...","..kddkxwwxkddk..","..kddkxxwxkddk..","..kddkxwxxkddk..","..kddkxxxxkddk..","..kddkxwxxkddk..","..kdddkkkkdddk..","..kddddddddddk..","..kddddddddddk..","..kddddddddddk..","..kkkkkkkkkkkk..","................"],"g_all":["................","................","................","................",".....kkkkkk.....","...kkrrrrrrkk...","..krroooooorrk..",".krooyyyyyyoork.",".kroyykkkkyyork.",".kroykk..kkyork.",".kkkkk....kkkkk.","................","................","................","................","................"],"g_100":["................",".....kkkkkk.....","...kkyyyyyykk...","..kyyqqqqqqyyk..","..kyqyyyyyyqyk..",".kyqykkkkyyyqyk.",".kyqykyykkyyqyk.",".kyqykyyykyyqyk.",".kyqykyyykyyqyk.",".kyqykyykkyyqyk.",".kyqykkkkyyyqyk.","..kyqyyyyyyqyk..","..kyyqqqqqqyyk..","...kkyyyyyykk...",".....kkkkkk.....","................"],"g_500":["................","................",".......kk.......","......krrk......",".....krrrrk.....","....krrrrrrk....","...krrrrrrrrk...","..krrrrrrrrrrk..",".kkkkkkkkkkkkkk.","..kwwwwwwwwwwk..","..kwukwwwkkkwk..","..kwkkwwwkbkwk..","..kwwwwwwkbkwk..","..kkkkkkkkkkkk..","................","................"],"t_life":["................","................",".....kkkkkk.....","...kkwwwwwwkk...","...kwwwwkwwwk...","..kwwwwwkwwwwk..","..kwwwwwkwwwwk..","..kwwwwwkkkwwk..","..kwwwwwwwwwwk..","..kwwwwwwwwwwk..","..kwwwwwwwwwwk..","...kwwwwwwwwk...","...kkwwwwwwkk...",".....kkkkkk.....","................","................"],"t_if":["................","................","................",".....kkkk.......","...kkwwwwkkk....","..kwwwwwwwwwk...",".kwwwwwwwwwwwk..",".kwwwwwwwwwwwk..","..kkkkkkkkkkk...","...........kk...","............kwk.",".............kk.","................","................","................","................"],"t_friend":["................","................","................","...kkk....kkk...","..kpppk..kpppk..","..kppppkkppppk..","..kppppppppppk..","..kppppppppppk..","...kppppppppk...","....kppppppk....",".....kppppk.....","......kppk......",".......kk.......","................","................","................"],"t_taste":["................","................","......kkkk......",".....kppppk.....","....kpwppppk....","....kppppppk....","....kppppppk....","....kkkkkkkk....","....knnnnnnk....",".....knnnnk.....",".....knnnnk.....","......knnk......","......knnk......",".......kk.......","................","................"],"t_spicy":["................","................",".........kk.....","........ktk.....",".......kttk.....","......kkkk......",".....krrrrk.....","....krrrrrk.....","...krrwrrrk.....","...krrrrrk......","..krrrrrk.......","..krrrrk........","..krrkk.........","..kkk...........","................","................"],"logo":[".......kk.......","......kyyk......",".k...kyyyyk...k.","kyk.kyyqqyyk.kyk","kyykyyqrrqyykyyk","kyyyyqrrrrqyyyyk",".kyyyqrwrrqyyyk.",".kyyyqrrrrqyyyk.","..kyyyqrrqyyyk..","..kyoyyqqyyoyk..","...kooyyyyook...","....kooyyook....",".....kooook.....","......kook......",".......kk.......","................"]},"pal":{"k":"#2a1f3d","w":"#ffffff","y":"#ffd23f","p":"#ff4d8d","m":"#2ee6a6","g":"#4d8dff","v":"#a46bff","l":"#c9a8ff","o":"#ff9f3a","r":"#e2506e","s":"#8e94a8","d":"#5a4a7a","b":"#9b6a3f","n":"#c8955f","x":"#07050e","f":"#ffd9b0","q":"#fff1a8","u":"#9cc2ff","t":"#3fa34d"}};
  const L = () => NG.ui === 'ja' ? 'ja' : 'ko';
  const svg = (id, size, locked) => {
    const rows = D.art[id] || D.art.logo; let r = '';
    rows.forEach((row, y) => { let x = 0; while (x < 16) { const ch = row[x]; if (ch === '.') { x++; continue; } let n = 1; while (row[x + n] === ch) n++; r += `<rect x="${x}" y="${y}" width="${n}" height="1" fill="${locked ? '#3a325c' : D.pal[ch]}"/>`; x += n; } });
    return `<span class="pxi" style="margin:0"><svg viewBox="0 0 16 16" width="${size}" height="${size}" shape-rendering="crispEdges" aria-hidden="true">${r}</svg></span>`;
  };
  const sum = (c, ks) => ks.reduce((a, k) => a + (c[k] || 0), 0);
  const PLAYS = ['d_plays', 'w_plays', 'i_plays', 'm_plays', 'r_plays', 'a_plays'];
  // [id, 탭, 카운터 키(또는 계산 함수), 필요 값, 숨김 여부, 이름 ko, 이름 ja, 조건 ko, 조건 ja]
  const LIST = [
    ['r165', 'react', 'r165', 1, 0, '내 꿈은 프로게이머', '夢はプロゲーマー', '평균 165ms 이하', '平均165ms以下'],
    ['r200', 'react', 'r200', 1, 0, '번개 손', '稲妻の手', '평균 200ms 이하', '平均200ms以下'],
    ['r250', 'react', 'r250', 1, 0, '사람은 맞음', '一応、人間', '평균 250ms 이하', '平均250ms以下'],
    ['r400', 'react', 'r400', 1, 0, '방금 일어났어요', '寝起きです', '평균 400ms 이상', '平均400ms以上'],
    ['r_slow', 'react', 'r_slow', 1, 1, '나무늘보', 'ナマケモノ', '한 번이라도 1초를 넘김', '1回でも1秒を超える'],
    ['r_foul5', 'react', 'r_foul5', 1, 0, '성질 급한 사람', 'せっかちさん', '한 판에 반칙 5번 이상', '1ゲームで反則5回以上'],
    ['r_guess', 'react', 'r_guess', 3, 1, '찍기의 달인', 'ヤマ勘の達人', '찍기 반칙 3번', '予測タップ3回'],
    ['r_plays', 'react', 'r_plays', 100, 0, '한 번만 더', 'もう一回だけ', '100판 플레이', '100回プレイ'],
    ['a55', 'aim', 'a55', 1, 0, '명사수', '名射手', '55개 이상', '55個以上'],
    ['a70', 'aim', 'a70', 1, 0, '인간 터렛', '人間タレット', '70개 이상', '70個以上'],
    ['a80', 'aim', 'a80', 1, 0, '에임핵 의심', 'チート疑惑', '80개 이상', '80個以上'],
    ['a_perfect', 'aim', 'a_perfect', 1, 0, '백발백중', '百発百中', '정확도 100%로 30개 이상', '正確度100%で30個以上'],
    ['a_acc50', 'aim', 'a_acc50', 1, 0, '손가락이 두꺼워요', '指が太いんです', '정확도 50% 이하', '正確度50%以下'],
    ['a_miss30', 'aim', 'a_miss30', 1, 0, '허공에 삽질', '空振り王', '한 판에 30번 빗나감', '1ゲームで30回ミス'],
    ['a_lost', 'aim', 'a_lost', 1, 0, '시간 도둑맞음', '時間泥棒にあった', '빗나감으로 10초 날림', 'ミスで10秒失う'],
    ['a_one', 'aim', 'a_one', 1, 1, '딱 한 개만', 'たった1個', '1개만 맞히고 끝', '1個だけ当てて終了'],
    ['a_plays', 'aim', 'a_plays', 100, 0, '손목 터널 증후군', '腱鞘炎', '100판 플레이', '100回プレイ'],
    ['m_wins', 'mafia', 'm_wins', 10, 0, '마피아 마스터', 'マフィアマスター', '10번 승리', '10勝'],
    ['m_mafwin', 'mafia', 'm_mafwin', 5, 0, '대부', 'ゴッドファーザー', '마피아 편으로 5번 승리', 'マフィア側で5勝'],
    ['m_police', 'mafia', 'm_police', 5, 0, '명탐정', '名探偵', '경찰로 마피아를 5번 찾아냄', '警察でマフィアを5回見つける'],
    ['m_doc', 'mafia', 'm_doc', 3, 0, '명의', '名医', '의사로 3번 구출', '医者で3回救出'],
    ['m_jokerwin', 'mafia', 'm_jokerwin', 1, 0, '희대의 사기꾼', '稀代のペテン師', '조커로 승리', 'ジョーカーで勝利'],
    ['m_exec1', 'mafia', 'm_exec1', 3, 0, '첫날의 저주', '初日の呪い', '첫 투표에서 처형당함 3번', '最初の投票で処刑3回'],
    ['m_cit_exec', 'mafia', 'm_cit_exec', 5, 0, '억울합니다', '無実です', '시민 편인데 처형당함 5번', '市民側なのに処刑5回'],
    ['m_night1', 'mafia', 'm_night1', 3, 0, '밤길 조심', '夜道に注意', '첫날 밤에 탈락 3번', '最初の夜に脱落3回'],
    ['m_flawless', 'mafia', 'm_flawless', 10, 0, '불사조', '不死鳥', '끝까지 살아남아 승리 10번', '最後まで生き残って10勝'],
    ['m_plays', 'mafia', 'm_plays', 100, 0, '마피아 폐인', 'マフィア廃人', '100판 플레이', '100回プレイ'],
    ['d_wins', 'draw', 'd_wins', 10, 0, '그림 장인', '絵の匠', '10번 승리', '10勝'],
    ['d_correct', 'draw', 'd_correct', 50, 0, '눈치 백단', '察しの達人', '정답 50번', '正解50回'],
    ['d_fast', 'draw', 'd_fast', 1, 0, '0.1초 컷', '秒殺', '5초 안에 정답', '5秒以内に正解'],
    ['d_picasso', 'draw', 'd_picasso', 5, 0, '피카소', 'ピカソ', '내 그림을 아무도 못 맞힘 5번', '自分の絵を誰も当てられない5回'],
    ['d_close', 'draw', 'd_close', 20, 0, '아깝다 수집가', 'おしいコレクター', '"아깝다" 20번', '「おしい」20回'],
    ['d_plays', 'draw', 'd_plays', 100, 0, '붓을 놓지 못해', '筆が止まらない', '100판 플레이', '100回プレイ'],
    ['i_oneshot', 'ingyu', 'i_oneshot', 1, 0, '한 방에 정답', '一発正解', '첫 도전에 정답', '最初の挑戦で正解'],
    ['i_first', 'ingyu', 'i_first', 5, 0, '스무고개 왕', '質問王', '1등으로 5번 맞힘', '1位で5回当てる'],
    ['i_wrong', 'ingyu', 'i_wrong', 10, 0, '오타도 실력', '誤字も実力', '오답 10번', '不正解10回'],
    ['i_last', 'ingyu', 'i_last', 5, 0, '끝까지 몰랐어요', '最後まで分からず', '못 맞히고 끝남 5번', '当てられず終了5回'],
    ['i_pass5', 'ingyu', 'i_pass5', 1, 1, '넘기기 장인', 'パスの達人', '한 판에 5번 넘김', '1ゲームで5回パス'],
    ['w_star', 'who', 'w_star', 1, 0, '인기 스타', '人気スター', '한 판에 5개 주제 1등', '1ゲームで5つのお題1位'],
    ['w_none', 'who', 'w_none', 3, 0, '미스터리한 사람', 'ミステリアスな人', '한 번도 안 뽑힌 판 3번', '一度も選ばれないゲーム3回'],
    ['g_all', 'global', (c) => PLAYS.filter(k => c[k] > 0).length, 6, 0, '올라운더', 'オールラウンダー', '모든 게임을 한 번씩 플레이', '全ゲームを1回ずつプレイ'],
    ['g_100', 'global', (c) => sum(c, PLAYS), 100, 0, '단골손님', '常連さん', '전체 100판', '合計100回'],
    ['g_500', 'global', (c) => sum(c, PLAYS), 500, 0, '집에 안 가요', '帰りません', '전체 500판', '合計500回'],
    ['g_dawn', 'global', 'g_dawn', 1, 1, '새벽반', '深夜組', '새벽 2~5시에 플레이', '深夜2〜5時にプレイ'],
    ['g_solo', 'global', (c) => sum(c, ['r_plays', 'a_plays']), 50, 0, '혼자서도 잘 놀아요', 'ひとりでも楽しい', '1인 게임 50판', 'ひとりゲーム50回'],
  ].map(([id, tab, key, n, secret, ko, ja, cko, cja]) => ({ id, tab, key, n, secret: !!secret, name: { ko, ja }, cond: { ko: cko, ja: cja } }));
  const TABS = [['all', 'logo', { ko: '전체', ja: 'すべて' }], ['draw', 'palette', { ko: 'Draw Mind', ja: 'Draw Mind' }], ['who', 'who', { ko: '누구 누구', ja: 'だれだれ' }], ['ingyu', 'search', { ko: '잉규게임', ja: 'インギュ' }], ['mafia', 'mafia', { ko: '마피아', ja: 'マフィア' }], ['react', 'bolt', { ko: '반응속도', ja: '反射神経' }], ['aim', 'target', { ko: '에임', ja: 'エイム' }], ['global', 'star', { ko: '공통', ja: '共通' }]];
  const T = { ko: { title: '보유 뱃지', got: '획득!', newB: '새 뱃지 획득!', rep: '대표 뱃지', repTip: '뱃지를 눌러 대표 뱃지로 고를 수 있어요 (최대 3개, 친구에게 보여요)', setRep: '대표 뱃지로 설정', unRep: '대표 뱃지에서 빼기', repFull: '대표 뱃지는 3개까지예요', locked: '아직 얻지 못했어요', secret: '숨겨진 뱃지예요. 조건은 비밀!', date: '얻은 날', titles: '받은 칭호', titlesNone: '아직 받은 칭호가 없어요. 누구 누구에서 1등으로 뽑혀 보세요!', count: (a, b) => `${a} / ${b}`, close: '닫기', none: '아직 대표 뱃지가 없어요', badgeN: (n) => `뱃지 ${n}개`, times: (n) => `×${n}`, empty: '이 탭에는 뱃지가 없어요', more: '더 보기 ▼', fold: '접기 ▲' },
              ja: { title: '獲得バッジ', got: '獲得！', newB: '新しいバッジ獲得！', rep: '代表バッジ', repTip: 'バッジを押すと代表バッジに選べます（最大3個、友達に見えます）', setRep: '代表バッジにする', unRep: '代表バッジから外す', repFull: '代表バッジは3個までです', locked: 'まだ獲得していません', secret: '隠しバッジです。条件は秘密！', date: '獲得日', titles: 'もらった称号', titlesNone: 'まだ称号がありません。だれだれで1位に選ばれてみよう！', count: (a, b) => `${a} / ${b}`, close: '閉じる', none: 'まだ代表バッジがありません', badgeN: (n) => `バッジ ${n}個`, times: (n) => `×${n}`, empty: 'このタブにはバッジがありません', more: 'もっと見る ▼', fold: '閉じる ▲' } };
  const t = (k, ...a) => { const v = T[L()][k]; return typeof v === 'function' ? v(...a) : v; };
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let data = { c: {}, got: {}, rep: [], titles: {} }, uid = null, ready = Promise.resolve(), listeners = [];
  const arr = (x) => Array.isArray(x) ? x.filter(Boolean) : Object.values(x || {}).filter(Boolean);
  const value = (b, c = data.c) => typeof b.key === 'function' ? b.key(c) : (c[b.key] || 0);
  const emit = () => listeners.forEach(f => { try { f(); } catch {} });
  function load() {
    uid = NG.me ? NG.me.uid : null; data = { c: {}, got: {}, rep: [], titles: {} };
    if (!db || !uid) { ready = Promise.resolve(); return ready; }
    ready = db.ref('badges/' + uid).once('value').then(async (s) => {
      const v = s.val() || {}; data = { c: v.c || {}, got: v.got || {}, rep: arr(v.rep), titles: v.titles || {} };
      if (!data.c._seed) await seed(); check(true); emit();
    }).catch(() => {});
    return ready;
  }
  // 이미 쌓여 있던 기록(stats)을 한 번만 뱃지 카운터로 옮김
  async function seed() {
    const p = { _seed: 1 }, mx = (k, v) => { if (v > (data.c[k] || 0)) p[k] = v; };
    try {
      const [d, m, i, r, a] = await Promise.all(['draw', 'mafia', 'ingyu', 'react', 'aim'].map(g => NG.myStats(g)));
      if (d) { mx('d_plays', d.plays || 0); mx('d_wins', d.wins || 0); } if (m) { mx('m_plays', m.plays || 0); mx('m_wins', m.wins || 0); } if (i) { mx('i_plays', i.plays || 0); mx('i_first', i.wins || 0); }
      if (r) { mx('r_plays', r.plays || 0); if (r.avg != null) { if (r.avg <= 165) mx('r165', 1); if (r.avg <= 200) mx('r200', 1); if (r.avg <= 250) mx('r250', 1); } }
      if (a) { mx('a_plays', a.plays || 0); if (a.hits >= 55) mx('a55', 1); if (a.hits >= 70) mx('a70', 1); if (a.hits >= 80) mx('a80', 1); }
    } catch {}
    Object.assign(data.c, p); db.ref(`badges/${uid}/c`).update(p).catch(() => {});
  }
  function check(quiet) {
    const fresh = [];
    for (const b of LIST) if (!data.got[b.id] && value(b) >= b.n) { data.got[b.id] = Date.now(); fresh.push(b); if (db && uid) db.ref(`badges/${uid}/got/${b.id}`).set(data.got[b.id]).catch(() => {}); }
    if (fresh.length) { try { localStorage.setItem('dm-bnew', String((+localStorage.getItem('dm-bnew') || 0) + fresh.length)); } catch {} if (!quiet) fresh.forEach((b, i) => setTimeout(() => toast(b), i * 900)); emit(); }
    return fresh;
  }
  // 게임에서 부르는 함수: {카운터: 숫자|true|false}. 끝나면 새로 얻은 뱃지 목록을 돌려줌
  async function run(obj) {
    if (!db || !NG.me) return []; if (uid !== NG.me.uid) load(); await ready;
    const h = new Date().getHours(); if (h >= 2 && h < 5) obj = { ...obj, g_dawn: 1 };
    for (const [k, v] of Object.entries(obj || {})) { const n = v === true ? 1 : (typeof v === 'number' ? v : 0); if (n > 0) { data.c[k] = (data.c[k] || 0) + n; db.ref(`badges/${uid}/c/${k}`).transaction(x => (x || 0) + n).catch(() => {}); } }
    return check(false);
  }
  async function addTitle(qi, ko, ja) { if (!db || !NG.me) return; await ready; const cur = data.titles[qi] || { n: 0 }; data.titles[qi] = { n: (cur.n || 0) + 1, ko, ja }; db.ref(`badges/${uid}/titles/${qi}`).transaction(x => ({ n: ((x && x.n) || 0) + 1, ko, ja })).catch(() => {}); emit(); }

  // ───── 화면 조각
  const css = `
  .bd-toast { position: fixed; left: 50%; top: max(14px, env(safe-area-inset-top)); transform: translateX(-50%); z-index: 90; display: flex; align-items: center; gap: 10px; padding: 8px 14px 8px 8px; background: #2a2148; color: var(--text); font-weight: 700; font-size: 13px; box-shadow: 0 -3px 0 0 var(--yellow), 0 3px 0 0 var(--yellow), -3px 0 0 0 var(--yellow), 3px 0 0 0 var(--yellow), 0 9px 0 0 var(--ink); animation: bdin .35s steps(4) both; max-width: calc(100vw - 30px); }
  .bd-toast small { display: block; font-size: 10px; color: var(--yellow); font-weight: 700; } .bd-toast .ic { background: var(--ink); padding: 4px; line-height: 0; }
  @keyframes bdin { from { transform: translate(-50%, -30px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
  .bd-wrap { position: fixed; inset: 0; z-index: 60; background-color: var(--bg); overflow-y: auto; -webkit-overflow-scrolling: touch; }
  .bd-in { max-width: 760px; margin: 0 auto; padding: 0 15px calc(30px + env(safe-area-inset-bottom)); }
  .bd-head { position: sticky; top: 0; z-index: 2; background: var(--bg); padding: max(12px, env(safe-area-inset-top)) 3px 12px; display: flex; align-items: center; gap: 12px; }
  .bd-head h2 { font-size: 18px; display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; } .bd-head button { min-height: 40px; padding: 6px 12px; margin: 0; }
  .bd-head .cnt { font-size: 13px; font-weight: 700; color: #1a1426; background: var(--yellow); padding: 3px 8px; }
  .bd-rep { background: var(--panel); padding: 12px; margin: 6px 3px 18px; } .bd-rep h3 { font-size: 12px; color: var(--muted); margin-bottom: 10px; } .bd-rep p { font-size: 11px; color: var(--muted); line-height: 1.6; margin-top: 10px; }
  .bd-slots { display: flex; gap: 12px; } .bd-slot { width: 64px; height: 64px; background: var(--ink); display: flex; align-items: center; justify-content: center; color: var(--line); font-weight: 700; }
  .bd-tabs { display: flex; gap: 10px; overflow-x: auto; padding: 3px 3px 12px; scrollbar-width: none; } .bd-tabs::-webkit-scrollbar { display: none; }
  .bd-tabs button { flex-shrink: 0; display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; font-size: 12px; min-height: 40px; margin: 0 0 3px; white-space: nowrap; } .bd-tabs button.on { background: var(--yellow); color: #1a1426; } .bd-tabs button small { font-size: 10px; opacity: .8; }
  /* PC(마우스): 탭을 여러 줄로 접어 놓고, 두 줄을 넘으면 '더 보기'로 펼침. 폰은 옆으로 밀어 넘김 */
  @media (hover: hover) and (min-width: 620px) { .bd-tabs { flex-wrap: wrap; overflow: hidden; padding-bottom: 3px; } .bd-tabs button { margin-bottom: 6px; } }
  .bd-more { display: block; margin: 0 3px 12px auto; padding: 4px 12px; font-size: 12px; min-height: 34px; } .bd-tabs + .bd-more.hidden + .bd-body { margin-top: 9px; }
  .bd-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px 12px; padding: 3px; } @media (min-width: 620px) { .bd-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); } }
  .bd-cell { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 10px 4px 8px; background: var(--panel); min-height: 0; margin: 0; font-size: 11px; line-height: 1.35; text-align: center; word-break: keep-all; --bc: var(--line); --dc: var(--ink); --dp: 4px; --in: 0 0 0 0 transparent; }
  .bd-cell .ic { background: var(--ink); padding: 4px; line-height: 0; } .bd-cell.lock { color: var(--muted); } .bd-cell.got { --bc: var(--yellow); } .bd-cell.rep { --bc: var(--pink); }
  .bd-cell small { font-size: 10px; color: var(--muted); } .bd-cell.t1 { --bc: #c9794a; } .bd-cell.t2 { --bc: #cfd3e6; } .bd-cell.t3 { --bc: var(--yellow); }
  .bd-sec { font-size: 13px; color: var(--muted); margin: 26px 3px 12px; font-weight: 700; } .bd-empty { color: var(--muted); font-size: 12px; padding: 18px; text-align: center; background: var(--panel); margin: 3px; line-height: 1.7; }
  .bd-modal { position: fixed; inset: 0; z-index: 70; background: rgba(7,5,14,.8); display: flex; align-items: center; justify-content: center; padding: 20px; }
  .bd-box { width: 100%; max-width: 320px; background: var(--panel); padding: 20px 18px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px; box-shadow: 0 -3px 0 0 var(--line), 0 3px 0 0 var(--line), -3px 0 0 0 var(--line), 3px 0 0 0 var(--line), 0 9px 0 0 var(--ink); animation: pop .2s steps(3); }
  .bd-box .ic { background: var(--ink); padding: 8px; line-height: 0; } .bd-box h3 { font-size: 18px; color: var(--yellow); } .bd-box p { font-size: 13px; line-height: 1.7; word-break: keep-all; } .bd-box small { font-size: 11px; color: var(--muted); }
  .bd-bar { width: 100%; height: 10px; background: var(--ink); position: relative; } .bd-bar i { position: absolute; inset: 0 auto 0 0; background: var(--mint); }
  .bd-box button { width: 100%; margin: 0; font-size: 14px; }`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function toast(b) { const el = document.createElement('div'); el.className = 'bd-toast'; el.innerHTML = `<span class="ic">${svg(b.id, 32)}</span><span><small>${t('newB')}</small>${esc(b.name[L()])}</span>`; document.body.appendChild(el); try { NG.confetti && NG.confetti(); } catch {} setTimeout(() => el.remove(), 4200); }

  let view = null, tab = 'all', tabsOpen = false;
  // PC에서 탭이 두 줄을 넘으면 두 줄까지만 보이고 '더 보기'. 고른 탭이 접힌 줄에 있으면 자동으로 펼침
  function fitTabs() {
    if (!view) return; const tabs = view.querySelector('.bd-tabs'), more = view.querySelector('.bd-more'), first = tabs.firstElementChild; if (!first) return;
    tabs.style.maxHeight = ''; const wraps = getComputedStyle(tabs).flexWrap === 'wrap';
    const rowH = first.offsetHeight + 6 + 10, two = 3 + rowH * 2 - 10 + 3, need = wraps && tabs.scrollHeight > two + 6;
    more.classList.toggle('hidden', !need); if (!need) return;
    const on = tabs.querySelector('button.on'); if (on && on.offsetTop - first.offsetTop >= rowH * 2 - 4) tabsOpen = true;
    tabs.style.maxHeight = tabsOpen ? '' : two + 'px'; more.textContent = t(tabsOpen ? 'fold' : 'more');
  }
  window.addEventListener('resize', () => fitTabs());
  const gotCount = (d = data) => LIST.filter(b => d.got[b.id]).length;
  function detail(b) {
    const got = data.got[b.id], isRep = data.rep.includes(b.id), v = Math.min(value(b), b.n), hide = b.secret && !got;
    const m = document.createElement('div'); m.className = 'bd-modal';
    m.innerHTML = `<div class="bd-box"><span class="ic">${svg(b.id, 96, !got)}</span><h3>${hide ? '???' : esc(b.name[L()])}</h3><p>${hide ? t('secret') : esc(b.cond[L()])}</p>`
      + (!hide && b.n > 1 ? `<div class="bd-bar"><i style="width:${Math.round(v / b.n * 100)}%"></i></div><small>${t('count', v, b.n)}</small>` : '')
      + `<small>${got ? t('date') + ' ' + new Date(got).toLocaleDateString() : t('locked')}</small>` + (got ? `<button class="${isRep ? 'btn-ghost' : 'btn-main'}" data-a="rep">${t(isRep ? 'unRep' : 'setRep')}</button>` : '') + `<button class="btn-ghost" data-a="x">${t('close')}</button></div>`;
    m.addEventListener('click', (e) => { const a = e.target.closest('[data-a]'); if (e.target === m || (a && a.dataset.a === 'x')) { m.remove(); return; } if (a && a.dataset.a === 'rep') {
      if (isRep) data.rep = data.rep.filter(x => x !== b.id); else if (data.rep.length >= 3) { a.textContent = t('repFull'); return; } else data.rep.push(b.id);
      if (db && uid) db.ref(`badges/${uid}/rep`).set(data.rep).catch(() => {}); m.remove(); render(); emit(); } });
    document.body.appendChild(m);
  }
  function render() {
    if (!view) return; const total = LIST.length, n = gotCount();
    view.querySelector('.cnt').textContent = t('count', n, total);
    const slots = view.querySelector('.bd-slots'); slots.innerHTML = '';
    for (let i = 0; i < 3; i++) { const id = data.rep[i], s = document.createElement('div'); s.className = 'bd-slot pxb'; s.innerHTML = id ? svg(id, 48) : '+'; if (id) { s.style.cursor = 'pointer'; s.addEventListener('click', () => detail(LIST.find(b => b.id === id))); } slots.appendChild(s); }
    const tabs = view.querySelector('.bd-tabs'); tabs.innerHTML = '';
    for (const [id, ic, nm] of TABS) { const list = LIST.filter(b => id === 'all' || b.tab === id), b = document.createElement('button'); b.className = id === tab ? 'on' : '';
      b.innerHTML = `${id === 'all' ? svg('logo', 16) : NG.icon(ic, 16)}<span>${nm[L()]}</span><small>${list.filter(x => data.got[x.id]).length}/${list.length}</small>`; b.addEventListener('click', () => { tab = id; render(); }); tabs.appendChild(b); }
    fitTabs();
    const body = view.querySelector('.bd-body'); body.innerHTML = '';
    let list = LIST.filter(b => tab === 'all' || b.tab === tab);
    if (tab === 'all') list = [...list.filter(b => data.got[b.id]).sort((a, b) => data.got[b.id] - data.got[a.id]), ...list.filter(b => !data.got[b.id])];
    const g = document.createElement('div'); g.className = 'bd-grid';
    for (const b of list) { const got = data.got[b.id], c = document.createElement('button'); c.className = 'bd-cell' + (got ? ' got' : ' lock') + (data.rep.includes(b.id) ? ' rep' : '');
      c.innerHTML = `<span class="ic">${svg(b.id, 48, !got)}</span><span>${b.secret && !got ? '???' : esc(b.name[L()])}</span>` + (!got && b.n > 1 && !b.secret ? `<small>${t('count', Math.min(value(b), b.n), b.n)}</small>` : ''); c.addEventListener('click', () => detail(b)); g.appendChild(c); }
    body.appendChild(g);
    if (tab === 'who' || tab === 'all') {   // 누구 누구 칭호 모음 (1번=동, 3번=은, 5번=금 테두리)
      const ts = Object.entries(data.titles || {}).filter(([, v]) => v && v.n).sort((a, b) => b[1].n - a[1].n);
      if (tab === 'who' || ts.length) { const h = document.createElement('div'); h.className = 'bd-sec'; h.textContent = t('titles') + (ts.length ? ` (${ts.length})` : ''); body.appendChild(h); }
      if (ts.length) { const tg = document.createElement('div'); tg.className = 'bd-grid'; for (const [qi, v] of ts) { const cat = +qi >= 120 ? 't_spicy' : ['t_life', 't_talent', 't_if', 't_friend', 't_taste'][Math.floor(+qi / 24)] || 't_life';
          const c = document.createElement('div'); c.className = 'bd-cell pxb t' + (v.n >= 5 ? 3 : v.n >= 3 ? 2 : 1); c.innerHTML = `<span class="ic">${svg(cat, 32)}</span><span>${esc(v[L()] || v.ko || '')}</span><small>${t('times', v.n)}</small>`; tg.appendChild(c); } body.appendChild(tg); }
      else if (tab === 'who') { const e = document.createElement('div'); e.className = 'bd-empty pxb'; e.textContent = t('titlesNone'); body.appendChild(e); }
    }
  }
  function open() {
    try { localStorage.setItem('dm-bnew', '0'); } catch {} emit();
    if (view) view.remove();
    view = document.createElement('div'); view.className = 'bd-wrap';
    view.innerHTML = `<div class="bd-in"><div class="bd-head"><button class="btn-ghost" data-a="back">${NG.icon('back', 16)}</button><h2>${svg('logo', 32)}<span>${t('title')}</span></h2><span class="cnt"></span></div>
      <div class="bd-rep pxb"><h3>${t('rep')}</h3><div class="bd-slots"></div><p>${t('repTip')}</p></div><div class="bd-tabs"></div><button class="bd-more btn-ghost hidden"></button><div class="bd-body"></div></div>`;
    view.querySelector('.bd-more').addEventListener('click', () => { tabsOpen = !tabsOpen; fitTabs(); });
    view.querySelector('[data-a="back"]').addEventListener('click', () => { view.remove(); view = null; });
    document.body.appendChild(view); render(); ready.then(render);
  }
  // 친구의 작은 프로필: 캐릭터 + 대표 뱃지 3개
  async function mini(fuid, name, av) {
    const m = document.createElement('div'); m.className = 'bd-modal';
    m.innerHTML = `<div class="bd-box">${NG.avatarSVG(av, 64)}<h3>${esc(name)}</h3><small class="mc">…</small><div class="bd-slots mr"></div><button class="btn-ghost">${t('close')}</button></div>`;
    m.addEventListener('click', (e) => { if (e.target === m || e.target.tagName === 'BUTTON') m.remove(); }); document.body.appendChild(m);
    let v = {}; try { v = (await db.ref('badges/' + fuid).once('value')).val() || {}; } catch {}
    const rep = arr(v.rep).slice(0, 3), n = LIST.filter(b => (v.got || {})[b.id]).length;
    m.querySelector('.mc').textContent = t('badgeN', n);
    const s = m.querySelector('.mr'); s.style.justifyContent = 'center';
    if (!rep.length) s.innerHTML = `<small>${t('none')}</small>`; else for (const id of rep) { const b = LIST.find(x => x.id === id); if (!b) continue; const d = document.createElement('div'); d.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;width:84px;font-size:10px;line-height:1.3'; d.innerHTML = `<div class="bd-slot pxb" style="width:56px;height:56px">${svg(id, 48)}</div><span>${esc(b.name[L()])}</span>`; s.appendChild(d); }
  }
  NG.Badge = { LIST, run, addTitle, open, mini, load, art: svg, ready: () => ready, count: () => gotCount(), total: LIST.length, newCount: () => { try { return +localStorage.getItem('dm-bnew') || 0; } catch { return 0; } }, onChange: (f) => listeners.push(f), t };
  if (NG.me) load();
})();

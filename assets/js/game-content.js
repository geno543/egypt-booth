/*
  Game text, English (en) and Simplified Chinese (zh).
  Event and booth names come from window.EG.config in content.js.
*/
window.EG_GAME = {

  settings: {
    perfectStars: 13      /* stars (out of 15) that unlock "free choice" of gift */
  },

  /* The five stops, in journey order: north to south along the Nile */
  stops: [
    { id: 'alex', game: 'words', icon: 'wave', bg: 'alexandria.jpg', ar: 'الإسكندرية', ink: '#2340A8',
      en: { place: 'Alexandria', title: 'Chat on the corniche', how: 'First study five words. Then tap a word and tap its meaning. Every mistake costs a star.', fact: 'Egyptian Arabic is understood across the whole Arab world, thanks to decades of Egyptian films and songs.' },
      zh: { place: '亚历山大', title: '海滨大道上聊聊天', how: '先记住五个词，再点一个词和它的意思来配对。每次出错都会少一颗星。', fact: '多亏了几十年来的埃及电影和歌曲，整个阿拉伯世界都听得懂埃及方言。' } },
    { id: 'cairo', game: 'koshari', icon: 'bowl', bg: 'koshari.jpg', ar: 'القاهرة', ink: '#B3261E',
      en: { place: 'Cairo', title: 'The koshari stall', how: 'The cook shouts each layer in Arabic. Tap the right one, fast, before the customers get hungry.', fact: 'Koshari is Egypt’s favorite street food: cheap, filling and vegan. People add da’ah (garlic vinegar) and shatta (chili) to taste.' },
      zh: { place: '开罗', title: '库沙里小摊', how: '厨师会用阿拉伯语喊出每一层配料。快点对的那一个，别让客人饿着！', fact: '库沙里是埃及人最爱的街头美食：便宜、管饱，还是纯素。大家会按口味加蒜醋汁（da’ah）和辣酱（shatta）。' } },
    { id: 'khan', game: 'tawla', icon: 'dice', bg: 'ahwa.jpg', ar: 'خان الخليلي', ink: '#1D7347',
      en: { place: 'Khan el-Khalili', title: 'Tawla at the ahwa', how: 'Roll the dice, then call them the Egyptian way. The cheat sheet is right above the board.', fact: 'In every ahwa you will hear “shesh besh!” (six and five) shouted with a slam of the checker. The numbers come from old Persian and Turkish.' },
      zh: { place: '汗·哈利利', title: '茶馆里玩双陆棋', how: '掷骰子，再用埃及人的叫法喊出点数。棋盘上方有小抄。', fact: '在每家街角茶馆里，你都会听到有人边拍棋子边大喊 “shesh besh！”（六和五）。这些数字来自古老的波斯语和土耳其语。' } },
    { id: 'moez', game: 'lanterns', icon: 'lantern', bg: 'ramadan.jpg', ar: 'شارع المعز', ink: '#9A5B00',
      en: { place: 'Al-Moez Street', title: 'Ramadan night', how: 'Lanterns flicker for a moment. Tap one while it flickers to light it, and it shows you a Ramadan word. Light all nine!', fact: 'In Ramadan, Cairo hangs thousands of fanous lanterns over its streets, and the whole country breaks the fast together at sunset.' },
      zh: { place: '穆伊兹街', title: '斋月之夜', how: '灯笼会短暂闪烁，趁它闪的时候点一下就能点亮，还会显示一个斋月词语。把九盏全部点亮！', fact: '斋月期间，开罗的街道上挂满成千上万盏斋月灯笼，日落时全国一起开斋。' } },
    { id: 'aswan', game: 'felucca', icon: 'boat', bg: 'nubia.jpg', ar: 'أسوان', ink: '#2340A8',
      en: { place: 'Aswan', title: 'Sail the felucca', how: 'Drag left and right to steer. Dodge the granite rocks and catch the red hibiscus flowers.', fact: 'Feluccas have sailed the Nile for thousands of years. Aswan’s hibiscus flowers make karkadeh, the deep red drink served at every wedding.' },
      zh: { place: '阿斯旺', title: '驾驶三角帆船', how: '左右拖动来掌舵。躲开花岗岩礁石，接住红色的洛神花。', fact: '三角帆船在尼罗河上航行了几千年。阿斯旺的洛神花被做成 karkadeh，这种深红色饮料每场婚礼都少不了。' } }
  ],

  /* Koshari layers in the right order, plus two things that do NOT go in */
  koshari: {
    layers: [
      { id: 'rice',     ar: 'رز',     tr: 'Ruz',      en: 'Rice',          zh: '米饭' },
      { id: 'lentils',  ar: 'عدس',    tr: 'Ads',      en: 'Lentils',       zh: '扁豆' },
      { id: 'pasta',    ar: 'مكرونة', tr: 'Makarona', en: 'Pasta',         zh: '意面' },
      { id: 'chickpea', ar: 'حمص',    tr: 'Hommos',   en: 'Chickpeas',     zh: '鹰嘴豆' },
      { id: 'sauce',    ar: 'صلصة',   tr: 'Salsa',    en: 'Tomato sauce',  zh: '番茄酱' },
      { id: 'onion',    ar: 'بصل',    tr: 'Basal',    en: 'Crispy onions', zh: '炸洋葱' }
    ],
    decoys: [
      { id: 'cheese', ar: 'جبنة', tr: 'Gebna', en: 'Cheese', zh: '奶酪' },
      { id: 'fish',   ar: 'سمك',  tr: 'Samak', en: 'Fish',   zh: '鱼' }
    ]
  },

  /* Tawla dice names, 1 to 6, the way they are called in an Egyptian ahwa */
  tawla: {
    names: ['yek', 'du', 'se', 'gahar', 'besh', 'shesh'],
    ar:    ['يك', 'دو', 'سي', 'جهار', 'بيش', 'شيش']
  },

  /* Short lessons shown before each mini-game (most players know nothing about Egypt yet).
     t = lesson title, d = two plain sentences, r = one line for the final "what you now know" recap */
  lessons: {
    alex: {
      en: { t: 'Speaking Egyptian', d: 'Egyptians speak Egyptian Arabic, and they love it when visitors try a few words. Alexandria, on the Mediterranean Sea, is Egypt’s second biggest city and a good place to start.', r: 'Five Egyptian words for hello, thanks and never mind' },
      zh: { t: '说埃及话', d: '埃及人说埃及阿拉伯语，游客哪怕只说几个词，他们也会很开心。亚历山大位于地中海边，是埃及第二大城市，从这里开始正合适。', r: '五个埃及方言词：打招呼、道谢、说 “没关系”' } },
    cairo: {
      en: { t: 'What is koshari?', d: 'Koshari is Egypt’s national dish: rice, lentils, pasta and chickpeas, topped with spicy tomato sauce and crispy fried onions. Everyone eats it, rich or poor.', r: 'How koshari is built, with the Arabic name of each layer' },
      zh: { t: '什么是库沙里？', d: '库沙里是埃及的国菜：米饭、扁豆、意面和鹰嘴豆，浇上辣番茄酱，再撒上炸得酥脆的洋葱。无论贫富，人人都爱吃。', r: '库沙里是怎样一层层做成的，以及每层的阿拉伯语名字' } },
    khan: {
      en: { t: 'Tawla and the ahwa', d: 'Khan el-Khalili is Cairo’s 600-year-old market. In its ahwas, street coffee houses, friends drink tea and play tawla, the Egyptian name for backgammon.', r: 'Tawla, the ahwa, and how to call the dice from 1 to 6' },
      zh: { t: '双陆棋与街头茶馆', d: '汗·哈利利是开罗有600多年历史的老市场。在市场里的 ahwa（街头茶馆），朋友们喝茶、玩 tawla，也就是埃及人说的双陆棋。', r: '双陆棋、街头茶馆，以及骰子1到6的叫法' } },
    moez: {
      en: { t: 'What is Ramadan?', d: 'Ramadan is the holy month when Muslims fast from sunrise to sunset. At sunset families eat together, and Cairo’s old streets glow with colored lanterns called fanous.', r: 'Ramadan: fasting, iftar at sunset and the fanous lanterns' },
      zh: { t: '什么是斋月？', d: '斋月是穆斯林从日出到日落禁食的神圣月份。日落后全家一起吃饭，开罗老城的街道被叫作 fanous 的彩色灯笼照亮。', r: '斋月：禁食、日落时的开斋饭和斋月灯笼' } },
    aswan: {
      en: { t: 'Aswan and the felucca', d: 'Aswan is in the far south, near Sudan. The Nile is calm here, Nubian villages are painted in bright colors, and people still sail wooden boats called feluccas.', r: 'Feluccas, Nubia, and karkadeh made from hibiscus' },
      zh: { t: '阿斯旺与三角帆船', d: '阿斯旺位于埃及最南部，靠近苏丹。这里的尼罗河平静，努比亚村庄涂满鲜艳的颜色，人们至今还驾驶一种叫 felucca 的木帆船。', r: '三角帆船、努比亚，以及用洛神花做的 karkadeh' } }
  },

  /* Shown under the bowl as each koshari layer goes in */
  layerNotes: {
    rice:     { en: 'Rice, the base of the bowl',              zh: '米饭，碗底的第一层' },
    lentils:  { en: 'Brown lentils, cooked with the rice',      zh: '褐色扁豆，和米饭一起煮' },
    pasta:    { en: 'Little macaroni and broken spaghetti',     zh: '小通心粉和掰断的意面' },
    chickpea: { en: 'Soft boiled chickpeas',                    zh: '煮软的鹰嘴豆' },
    sauce:    { en: 'Spicy tomato sauce with garlic and vinegar', zh: '加了大蒜和醋的辣番茄酱' },
    onion:    { en: 'Crispy fried onions, the best part',       zh: '酥脆的炸洋葱，最好吃的部分' }
  },

  /* Each lantern you light reveals one Ramadan word */
  ramadanWords: [
    { ar: 'رمضان كريم', tr: 'Ramadan Kareem', en: 'The Ramadan greeting: “generous Ramadan”', zh: '斋月问候语：“慷慨的斋月”' },
    { ar: 'إفطار', tr: 'Iftar', en: 'The meal at sunset that breaks the fast', zh: '日落时打破禁食的开斋饭' },
    { ar: 'سحور', tr: 'Suhoor', en: 'The meal eaten before dawn', zh: '黎明前吃的封斋饭' },
    { ar: 'فانوس', tr: 'Fanous', en: 'The colored Ramadan lantern', zh: '彩色的斋月灯笼' },
    { ar: 'تمر', tr: 'Tamr', en: 'Dates, the first bite after sunset', zh: '椰枣，日落后的第一口' },
    { ar: 'مسحراتي', tr: 'Mesaharati', en: 'The drummer who wakes people for suhoor', zh: '敲鼓叫大家起床吃封斋饭的人' },
    { ar: 'قطايف', tr: 'Qatayef', en: 'Small stuffed pancakes, a Ramadan sweet', zh: '夹馅小煎饼，斋月甜点' },
    { ar: 'فوازير', tr: 'Fawazeer', en: 'Ramadan riddle shows on TV', zh: '斋月电视猜谜节目' },
    { ar: 'عيد', tr: 'Eid', en: 'The three-day feast when Ramadan ends', zh: '斋月结束后的三天节日' }
  ],

  /* Words taught at the Aswan stop */
  feluccaWords: [
    { ar: 'فلوكة', tr: 'Felucca', en: 'Wooden sailboat of the Nile', zh: '尼罗河上的木帆船' },
    { ar: 'كركديه', tr: 'Karkadeh', en: 'Red drink made from hibiscus flowers', zh: '用洛神花做的红色饮料' },
    { ar: 'النوبة', tr: 'Nubia', en: 'The land of the Nubian people in the south', zh: '南部努比亚人的家园' }
  ],

  ui: {
    en: {
      'title': 'Egypt Passport: a game from the Egypt booth',
      'cover.kicker': 'Passport to everyday Egypt',
      'cover.sub': 'Five stops along the Nile. Five mini-games. One gift at the end.',
      'cover.open': 'Open passport',
      'cover.time': 'About 3 minutes',
      'cover.guide': 'Just want to read? Open the Egypt guide',
      'credits': 'Photo credits',
      'id.title': 'Traveler',
      'id.name': 'Your name (optional)',
      'id.placeholder': 'Type your name',
      'id.status': 'Status',
      'id.statusVal': 'Friend of Egypt',
      'id.issued': 'Issued at',
      'id.date': 'Date',
      'id.start': 'Start the journey',
      'id.welcome': 'Ahlan! Your journey starts in Alexandria.',
      'bar.passport': 'Passport',
      'bar.soundOn': 'Sound on',
      'bar.soundOff': 'Sound off',
      'map.title': 'Your journey down the Nile',
      'map.sea': 'Mediterranean Sea',
      'map.nile': 'Nile',
      'map.stop': 'Stop {n} of 5',
      'map.play': 'Play',
      'map.replay': 'Play again',
      'map.locked': 'Finish the stop before this one first.',
      'map.allDone': 'All five stamps collected!',
      'map.claim': 'Claim your gift',
      'map.sec': '20 sec',
      'game.how': 'How to play',
      'learn.k': 'Quick lesson',
      'learn.go': 'Got it, let’s play',
      'res.learned': 'You learned',
      'w.study': 'Study these five words. Then match them from memory.',
      'w.ready': 'I’m ready',
      'f.k5': 'Enough hibiscus for a glass of karkadeh!',
      'f.k10': 'That’s a whole jug of karkadeh!',
      'fin.learned': 'What you now know about Egypt',
      'game.start': 'Start',
      'game.go': 'Yalla!',
      'game.back': 'Back to the map',
      'game.time': 'Time',
      'game.mistakes': 'Mistakes',
      'res.3': 'Perfect, ya habibi!',
      'res.2': 'Very good!',
      'res.1': 'Ma’lesh, you made it!',
      'res.fact': 'Did you know?',
      'res.stamp': 'Stamp my passport',
      'pass.title': 'Your passport',
      'pass.count': '{n} of 5 stamps',
      'pass.empty': 'Not visited yet',
      'pass.close': 'Close',
      'pass.stars': '{s} of 15 stars',
      'k.cook': 'The cook shouts',
      'k.bowl': 'Your koshari',
      'k.nope': 'Not in koshari!',
      'k.wrong': 'Not yet, listen to the cook!',
      'w.pairs': '{n} of 5 pairs',
      'd.cheat': 'Cheat sheet',
      'd.roll': 'Roll the dice',
      'd.rolling': 'Rolling…',
      'd.call': 'What do you shout?',
      'd.round': 'Roll {n} of 3',
      'd.right': 'Yes! That is how the ahwa says it.',
      'd.wrong': 'Not quite. The right call was “{c}”.',
      'l.lit': '{n} of 9 lit',
      'l.tap': 'Tap the flickering lanterns',
      'f.flowers': 'Hibiscus',
      'f.drag': 'Drag to steer',
      'fin.title': 'Mabrouk!',
      'fin.sub': 'Your passport is full. That was the Egypt we grew up with.',
      'fin.stars': '{s} of 15 stars',
      'fin.guide': 'Read more in the Egypt guide',
      'fin.again': 'Replay a stop',
      'ticket.stars': 'Stars',
      'ticket.name': 'Traveler',
      'ticket.perfect': 'Top score: free choice of gift'
    },
    zh: {
      'title': '埃及护照：埃及展位的小游戏',
      'cover.kicker': '日常埃及护照',
      'cover.sub': '沿着尼罗河走五站，玩五个小游戏，最后领一份礼物。',
      'cover.open': '打开护照',
      'cover.time': '大约 3 分钟',
      'cover.guide': '只想看看？打开埃及指南',
      'credits': '图片来源',
      'id.title': '旅客',
      'id.name': '你的名字（可选）',
      'id.placeholder': '输入你的名字',
      'id.status': '身份',
      'id.statusVal': '埃及之友',
      'id.issued': '签发地',
      'id.date': '日期',
      'id.start': '出发！',
      'id.welcome': 'Ahlan！你的旅程从亚历山大开始。',
      'bar.passport': '护照',
      'bar.soundOn': '声音开',
      'bar.soundOff': '声音关',
      'map.title': '沿尼罗河南下的旅程',
      'map.sea': '地中海',
      'map.nile': '尼罗河',
      'map.stop': '第 {n} 站，共 5 站',
      'map.play': '开始',
      'map.replay': '再玩一次',
      'map.locked': '请先完成上一站。',
      'map.allDone': '五个印章全部集齐！',
      'map.claim': '领取礼物',
      'map.sec': '20 秒',
      'game.how': '玩法',
      'learn.k': '小课堂',
      'learn.go': '明白了，开始玩',
      'res.learned': '你学会了',
      'w.study': '先记住这五个词，然后凭记忆配对。',
      'w.ready': '我记住了',
      'f.k5': '这些洛神花够泡一杯 karkadeh 了！',
      'f.k10': '够泡一大壶 karkadeh 了！',
      'fin.learned': '现在你了解的埃及',
      'game.start': '开始',
      'game.go': 'Yalla！',
      'game.back': '返回地图',
      'game.time': '时间',
      'game.mistakes': '失误',
      'res.3': '完美，habibi！',
      'res.2': '很棒！',
      'res.1': 'Ma’lesh，你完成了！',
      'res.fact': '你知道吗？',
      'res.stamp': '给护照盖章',
      'pass.title': '你的护照',
      'pass.count': '已集 {n}/5 个印章',
      'pass.empty': '尚未到访',
      'pass.close': '关闭',
      'pass.stars': '共 {s}/15 颗星',
      'k.cook': '厨师喊',
      'k.bowl': '你的库沙里',
      'k.nope': '库沙里里没有这个！',
      'k.wrong': '还没轮到它，听厨师的！',
      'w.pairs': '已配对 {n}/5',
      'd.cheat': '小抄',
      'd.roll': '掷骰子',
      'd.rolling': '掷骰中……',
      'd.call': '你该喊什么？',
      'd.round': '第 {n} 掷，共 3 掷',
      'd.right': '对！茶馆里就是这么喊的。',
      'd.wrong': '差一点，正确的叫法是 “{c}”。',
      'l.lit': '已点亮 {n}/9',
      'l.tap': '点击正在闪烁的灯笼',
      'f.flowers': '洛神花',
      'f.drag': '拖动掌舵',
      'fin.title': '恭喜！Mabrouk！',
      'fin.sub': '你的护照集满了。这就是我们从小生活的埃及。',
      'fin.stars': '共获得 {s}/15 颗星',
      'fin.guide': '在埃及指南里了解更多',
      'fin.again': '重玩某一站',
      'ticket.stars': '星星',
      'ticket.name': '旅客',
      'ticket.perfect': '高分：礼物任选'
    }
  }
};

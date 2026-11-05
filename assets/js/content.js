/*
  All words on the site live here, in English (en) and Simplified Chinese (zh).
  Edit freely. Keep the keys the same. Photos live in assets/img/.
*/
window.EG = {

  /* ------------------------------------------------------------------
     EVENT SETTINGS: change these for your booth
  ------------------------------------------------------------------ */
  config: {
    event:      { en: 'International Culture Festival', zh: '国际文化节' },
    booth:      { en: 'Egypt booth', zh: '埃及展位' },
    university: { en: '', zh: '' },        // e.g. { en: 'Zhejiang University', zh: '浙江大学' }
    questionsPerRound: 6,                  // how many quiz questions each visitor gets
    staffHoldMs: 1200                      // how long staff hold the button to redeem a gift
  },

  /* ------------------------------------------------------------------
     INTERFACE TEXT
  ------------------------------------------------------------------ */
  ui: {
    en: {
      'meta.title': 'Egypt, beyond the pyramids',
      'meta.desc': 'A five-minute guide to everyday Egypt from the Egyptian students at the festival, with a quick quiz and a gift.',
      'skip': 'Skip to content',
      'nav.words': 'Words', 'nav.food': 'Food', 'nav.life': 'Daily life', 'nav.feasts': 'Feasts', 'nav.arts': 'Arts', 'nav.places': 'Places',
      'cta.quiz': 'Play the game',
      'cta.explore': 'Explore first',
      'hero.title': 'Come for the pyramids.<br>Stay for the tea.',
      'hero.sub': 'The Egypt we grew up with: food, slang, music and jokes. Read our guide, then play the game for a gift.',
      'hero.caption': 'Ramadan lanterns over Al-Moez Street, Cairo.',

      'words.title': 'Nine words that get you through Cairo',
      'words.intro': 'Thanks to our films, the whole Arab world understands Egyptian Arabic. Tap a word to learn it.',
      'words.listen': 'Listen',
      'words.useit': 'How we use it',

      'food.title': 'A day of eating in Egypt',
      'food.intro': 'Egyptians eat late, eat together, and always cook too much. Pick a time of day.',
      'food.tip': 'Local tip',

      'life.title': 'Life happens at the ahwa',
      'life.intro': 'The ahwa is our street-corner coffee house, a bit like a Chinese teahouse. Most of daily life passes through one.',

      'feasts.title': 'A year of feasts',
      'feasts.intro': 'Islamic feasts follow the moon, so Ramadan arrives about eleven days earlier every year.',
      'feasts.calendar': 'Through the year',

      'arts.title': 'Sound, screen and stitch',
      'arts.intro': 'Before streaming, Cairo was where the Arab world got its songs and its films.',

      'places.title': 'There is more than one Egypt',
      'places.intro': 'About 95% of us live along the Nile. Leave the river and the language, the food and the pace all change.',
      'places.med': 'Mediterranean Sea', 'places.red': 'Red Sea', 'places.west': 'Western Desert', 'places.nile': 'Nile',
      'places.pick': 'Choose a place',

      'quizcta.title': 'Five stops.<br>Five games. One gift.',
      'quizcta.body': 'Travel the Nile, play a 20-second mini-game at each stop and collect five passport stamps. Then show your ticket at our booth.',
      'quizcta.note': 'One gift per person, while they last.',
      'quizcta.preview': 'Your gift ticket appears here',

      'quiz.label': 'Egypt quiz',
      'quiz.progress': 'Question {n} of {t}',
      'quiz.correct': 'Correct.',
      'quiz.wrong': 'Not quite.',
      'quiz.next': 'Next question',
      'quiz.finish': 'See my result',
      'quiz.close': 'Close',
      'quiz.keys': 'Tip: press 1, 2 or 3 to answer.',

      'result.score': 'You got {s} of {t}',
      'result.perfect': 'A perfect score. Pick any gift you like at the booth.',
      'result.good': 'Nicely done. Your gift is waiting at the booth.',
      'result.ok': 'You know a little more Egypt than you did this morning. Your gift is waiting at the booth.',
      'result.earlier': 'This is the ticket you earned earlier. One ticket per phone.',

      'ticket.title': 'Gift ticket',
      'ticket.show': 'Show this screen at the Egypt booth.',
      'ticket.code': 'Ticket',
      'ticket.score': 'Score',
      'ticket.time': 'Issued',
      'ticket.live': 'Live ticket. The star keeps turning, so screenshots don’t count.',
      'ticket.hold': 'Staff only: press and hold to redeem',
      'ticket.redeemed': 'Redeemed',
      'ticket.redeemedAt': 'Gift given at {time}. Shukran!',
      'ticket.perfect': 'Perfect score: free choice',
      'ticket.again': 'Play again for fun',
      'ticket.back': 'Back to the site',
      'ticket.note': 'Playing again keeps the same ticket.',

      'footer.made': 'Made by Egyptian students for the {event}.',
      'footer.madeU': 'Made by the Egyptian students of {university} for {event}.',
      'footer.say': 'Come and say ahlan at our booth.',
      'footer.credits': 'Photo credits',
      'footer.creditsNote': 'Photos from Wikimedia Commons, cropped and resized for this page. Thank you to every photographer.',
      'footer.top': 'Back to top'
    },

    zh: {
      'meta.title': '埃及，不止金字塔',
      'meta.desc': '埃及留学生带你用五分钟认识日常的埃及，做个小测验还能领礼物。',
      'skip': '跳到正文',
      'nav.words': '方言', 'nav.food': '美食', 'nav.life': '日常', 'nav.feasts': '节日', 'nav.arts': '艺术', 'nav.places': '地方',
      'cta.quiz': '开始游戏',
      'cta.explore': '先逛逛',
      'hero.title': '为金字塔而来，<br>为一杯茶留下。',
      'hero.sub': '我们从小生活的埃及：美食、俚语、音乐和笑话。先看看指南，再玩游戏赢礼物。',
      'hero.caption': '开罗穆伊兹街上空的斋月灯笼。',

      'words.title': '在开罗够用的九个词',
      'words.intro': '多亏了埃及电影，整个阿拉伯世界都听得懂埃及方言。点一个词，学一学。',
      'words.listen': '听发音',
      'words.useit': '怎么用',

      'food.title': '埃及的一天，从早吃到晚',
      'food.intro': '埃及人吃得晚、一起吃，而且永远做得太多。选一个时间看看。',
      'food.tip': '本地人提示',

      'life.title': '生活就在街角的茶馆里',
      'life.intro': 'Ahwa 是埃及街角的咖啡馆，很像中国的茶馆。日常生活的大部分时光都在这里度过。',

      'feasts.title': '一年到头的节日',
      'feasts.intro': '伊斯兰节日跟着月亮走，所以斋月每年都会提前大约十一天。',
      'feasts.calendar': '一年中的节日',

      'arts.title': '声音、银幕与针线',
      'arts.intro': '在流媒体出现之前，整个阿拉伯世界的歌和电影都来自开罗。',

      'places.title': '不止一个埃及',
      'places.intro': '约95%的埃及人生活在尼罗河两岸。离开河谷，语言、饮食和生活节奏都会改变。',
      'places.med': '地中海', 'places.red': '红海', 'places.west': '西部沙漠', 'places.nile': '尼罗河',
      'places.pick': '选择一个地方',

      'quizcta.title': '五站旅程，<br>五个游戏，一份礼物。',
      'quizcta.body': '沿着尼罗河旅行，每站玩一个20秒小游戏，集齐五个护照印章，再到我们的展位出示兑换券。',
      'quizcta.note': '每人限领一份，送完即止。',
      'quizcta.preview': '你的礼物兑换券会出现在这里',

      'quiz.label': '埃及小测验',
      'quiz.progress': '第 {n} 题，共 {t} 题',
      'quiz.correct': '答对了！',
      'quiz.wrong': '差一点。',
      'quiz.next': '下一题',
      'quiz.finish': '查看结果',
      'quiz.close': '关闭',
      'quiz.keys': '提示：按 1、2、3 键作答。',

      'result.score': '你答对了 {s} / {t} 题',
      'result.perfect': '满分！到展位可以任选一份礼物。',
      'result.good': '答得好！你的礼物在展位等你。',
      'result.ok': '今天你又多认识了埃及一点。你的礼物在展位等你。',
      'result.earlier': '这是你之前获得的兑换券。每部手机限一张。',

      'ticket.title': '礼物兑换券',
      'ticket.show': '请到埃及展位出示此页面。',
      'ticket.code': '券号',
      'ticket.score': '得分',
      'ticket.time': '时间',
      'ticket.live': '实时兑换券：星星一直在转，截图无效。',
      'ticket.hold': '工作人员专用：长按核销',
      'ticket.redeemed': '已领取',
      'ticket.redeemedAt': '已于 {time} 领取礼物。Shukran！',
      'ticket.perfect': '满分：礼物任选',
      'ticket.again': '再玩一次',
      'ticket.back': '返回网站',
      'ticket.note': '再玩一次不会生成新的兑换券。',

      'footer.made': '由埃及留学生为{event}制作。',
      'footer.madeU': '由{university}的埃及留学生为{event}制作。',
      'footer.say': '欢迎来我们的展位，跟我们说一声 ahlan！',
      'footer.credits': '图片来源',
      'footer.creditsNote': '图片来自维基共享资源，为本页面做了裁剪和缩放。感谢每一位摄影师。',
      'footer.top': '回到顶部'
    }
  },

  /* ------------------------------------------------------------------
     WORDS (Egyptian Arabic)
  ------------------------------------------------------------------ */
  words: [
    { id: 'ahlan', ar: 'أهلاً', tr: 'Ahlan',
      en: { m: 'Hi. Welcome.', n: 'The first word you’ll hear, often twice in a row. Reply with “ahlan beek”.' },
      zh: { m: '你好，欢迎。', n: '你听到的第一个词，常常连说两遍。回一句 “ahlan beek” 就好。' } },
    { id: 'izzayak', ar: 'إزيك', tr: 'Izzayak?',
      en: { m: 'How are you?', n: 'You may be asked three times in one conversation. That is warmth, not forgetfulness.' },
      zh: { m: '你好吗？', n: '一次聊天里可能会被问三遍。这是热情，不是健忘。' } },
    { id: 'shukran', ar: 'شكراً', tr: 'Shukran',
      en: { m: 'Thank you.', n: 'Add “awi” for “thanks a lot”: shukran awi.' },
      zh: { m: '谢谢。', n: '加上 “awi” 就是 “非常感谢”：shukran awi。' } },
    { id: 'yalla', ar: 'يلا', tr: 'Yalla',
      en: { m: 'Let’s go. Come on.', n: 'One word for starting, leaving and running out of patience.' },
      zh: { m: '走吧！快点！', n: '出发、离开、等得不耐烦，全靠这一个词。' } },
    { id: 'malesh', ar: 'معلش', tr: 'Ma’lesh',
      en: { m: 'Never mind. It’s okay.', n: 'Missed the bus? Burnt the rice? Ma’lesh. Probably the most Egyptian word there is.' },
      zh: { m: '没关系，算了。', n: '错过了公交？米饭烧糊了？Ma’lesh。这大概是最 “埃及” 的一个词。' } },
    { id: 'tamam', ar: 'تمام', tr: 'Tamam',
      en: { m: 'Okay. All good.', n: 'Ask an Egyptian how things are going and the answer is tamam, whatever the truth is.' },
      zh: { m: '好的，没问题。', n: '问埃及人过得怎么样，答案永远是 tamam，不管实际情况如何。' } },
    { id: 'habibi', ar: 'حبيبي', tr: 'Habibi',
      en: { m: 'My dear. Buddy.', n: 'Said to friends, shopkeepers and total strangers. To a woman, say habibti.' },
      zh: { m: '亲爱的，兄弟。', n: '对朋友、店主、陌生人都可以说。对女生要说 habibti。' } },
    { id: 'inshallah', ar: 'إن شاء الله', tr: 'Inshallah',
      en: { m: 'God willing.', n: 'It can mean yes, maybe or not a chance. The tone tells you which one.' },
      zh: { m: '如果真主愿意。', n: '可能是 “好”、“也许”，也可能是 “别指望了”，听语气分辨。' } },
    { id: 'khalas', ar: 'خلاص', tr: 'Khalas',
      en: { m: 'Done. Enough.', n: 'Ends arguments, haggling and second helpings. It rarely works on mothers.' },
      zh: { m: '好了，够了。', n: '能结束争论、讨价还价和第二碗饭。不过对妈妈们通常无效。' } }
  ],

  /* ------------------------------------------------------------------
     FOOD (a day of eating)
  ------------------------------------------------------------------ */
  food: [
    { id: 'breakfast', time: '08:00', img: 'breakfast.jpg', pos: '55% center',
      en: { label: 'Breakfast', tip: 'Ful carts appear on street corners at sunrise. Most people eat standing up, wrapped in bread.' },
      zh: { label: '早餐', tip: '清晨，街角就出现了卖 ful 的小推车。大多数人站着吃，用饼一卷就走。' },
      dishes: [
        { icon: 'pot', ar: 'فول مدمس',
          en: { n: 'Ful medames', d: 'Fava beans cooked slowly overnight, finished with olive oil, cumin and lemon.' },
          zh: { n: '炖蚕豆 Ful', d: '文火慢炖一整夜的蚕豆，淋上橄榄油、孜然和柠檬汁。' } },
        { icon: 'taameya', ar: 'طعمية',
          en: { n: 'Ta’ameya', d: 'Our falafel, made with fava beans instead of chickpeas, so it’s bright green inside.' },
          zh: { n: '蚕豆饼 Ta’ameya', d: '埃及版的法拉费，用蚕豆而不是鹰嘴豆做的，所以里面是鲜绿色的。' } },
        { icon: 'bread', ar: 'عيش بلدي',
          en: { n: 'Aish baladi', d: 'Round, puffy whole-wheat bread. In Egyptian Arabic, aish also means “life”.' },
          zh: { n: '埃及大饼 Aish', d: '圆圆鼓鼓的全麦饼。在埃及方言里，aish 这个词还有 “生命” 的意思。' } }
      ] },
    { id: 'lunch', time: '15:00', img: 'koshari.jpg',
      en: { label: 'Lunch', tip: 'Lunch is the big meal, and it comes late. Families sit down together after work and school.' },
      zh: { label: '午餐', tip: '午餐才是正餐，而且吃得很晚。下班放学后，全家人一起坐下来吃。' },
      dishes: [
        { icon: 'bowl', ar: 'كشري',
          en: { n: 'Koshari', d: 'Rice, lentils, pasta and chickpeas under spicy tomato sauce and crispy onions. Cheap, filling and vegan.' },
          zh: { n: '库沙里 Koshari', d: '米饭、扁豆、意面和鹰嘴豆，浇上辣番茄酱，撒上炸洋葱。便宜、管饱，还是纯素。' } },
        { icon: 'soup', ar: 'ملوخية',
          en: { n: 'Molokhia', d: 'Silky green soup of jute leaves and garlic, eaten with rice or bread. Every family swears theirs is best.' },
          zh: { n: '黄麻叶汤 Molokhia', d: '用黄麻叶和大蒜熬的绿色浓汤，配米饭或大饼吃。每家都说自己做得最好。' } },
        { icon: 'mahshi', ar: 'محشي',
          en: { n: 'Mahshi', d: 'Vine leaves, peppers and zucchini stuffed with herby rice. A whole afternoon of rolling for one pot.' },
          zh: { n: '酿蔬菜 Mahshi', d: '葡萄叶、青椒和西葫芦里塞满香草米饭。卷一整个下午，才够一锅。' } }
      ] },
    { id: 'tea', time: '18:00', img: 'tea.jpg', pos: '58% center',
      en: { label: 'Tea time', tip: 'You will be offered tea in shops, in offices, even while you wait for a mechanic. Saying no takes practice.' },
      zh: { label: '喝茶时间', tip: '在商店、办公室，甚至等修车时，都会有人给你倒茶。学会拒绝需要练习。' },
      dishes: [
        { icon: 'tea', ar: 'شاي',
          en: { n: 'Shai', d: 'Strong black tea in a small glass, often with fresh mint and more sugar than you expect.' },
          zh: { n: '红茶 Shai', d: '装在小玻璃杯里的浓红茶，常加新鲜薄荷，糖比你想象的还多。' } },
        { icon: 'karkadeh', ar: 'كركديه',
          en: { n: 'Karkadeh', d: 'Hibiscus tea, deep red and a little sour. Iced in summer, hot in winter, always at weddings.' },
          zh: { n: '洛神花茶 Karkadeh', d: '深红色、微酸的洛神花茶。夏天冰着喝，冬天热着喝，婚礼上一定有。' } },
        { icon: 'cane', ar: 'عصير قصب',
          en: { n: 'Asab', d: 'Sugarcane juice pressed right in front of you at street stalls. Sweet, pale green and very cold.' },
          zh: { n: '甘蔗汁 Asab', d: '街边小店当面现榨的甘蔗汁，清甜、淡绿、冰凉。' } }
      ] },
    { id: 'sweets', time: '22:00', img: 'sweets.jpg', pos: '30% center',
      en: { label: 'Something sweet', tip: 'The night before Eid, whole families stay up baking kahk together, and plates of it go to every neighbor in the building.' },
      zh: { label: '甜点', tip: '开斋节前夜，全家人熬夜一起烤 kahk，烤好后还要一盘盘送给楼里的每户邻居。' },
      dishes: [
        { icon: 'kahk', ar: 'كحك',
          en: { n: 'Kahk', d: 'Butter cookies filled with honey or dates, stamped with patterns and buried in powdered sugar. Made by the hundred for Eid.' },
          zh: { n: '开斋节饼干 Kahk', d: '黄油饼干，夹蜂蜜或椰枣馅，压上花纹，再埋进厚厚的糖粉里。开斋节一做就是好几百个。' } },
        { icon: 'kunafa', ar: 'كنافة',
          en: { n: 'Kunafa', d: 'Golden shredded pastry filled with cream or cheese and soaked in syrup. A Ramadan must.' },
          zh: { n: '库纳法 Kunafa', d: '金黄的细丝酥皮，夹奶油或奶酪，浸满糖浆。斋月必吃。' } },
        { icon: 'omali', ar: 'أم علي',
          en: { n: 'Om Ali', d: 'Pastry baked in sweet milk with nuts, raisins and coconut. Our answer to bread pudding.' },
          zh: { n: '阿里妈妈 Om Ali', d: '酥皮泡在甜牛奶里烤，加坚果、葡萄干和椰丝。埃及版的面包布丁。' } }
      ] }
  ],

  /* ------------------------------------------------------------------
     DAILY LIFE
  ------------------------------------------------------------------ */
  life: {
    ahwa: {
      en: { t: 'The ahwa', d: 'Small tables, glasses of tea, a match on the TV, and strangers who become friends by the second round.' },
      zh: { t: 'Ahwa 街角茶馆', d: '小桌子、一杯杯红茶、电视里的球赛。喝到第二杯，陌生人就成了朋友。' } },
    tawla: { ar: 'شيش بيش', tr: 'Shesh besh',
      en: { t: 'Tawla', d: 'Backgammon, played fast and loud. Players call the dice in old Persian and Turkish numbers. Shesh besh is a six and a five.' },
      zh: { t: '双陆棋 Tawla', d: '节奏快、声音大的双陆棋。玩家用古老的波斯语和土耳其语数字喊骰子，shesh besh 就是六和五。' } },
    football: { img: 'football.jpg', pos: '60% center',
      en: { t: 'Football', d: 'Al Ahly or Zamalek? Pick a side before dinner. The one thing everyone agrees on is Mohamed Salah.' },
      zh: { t: '足球', d: '阿赫利还是扎马雷克？吃饭前最好先站好队。全国唯一的共识：萨拉赫。' } },
    jokes: {
      en: { t: 'The jokes', d: 'Egyptians are famous across the Arab world for their humor. The harder the day, the better the joke.' },
      zh: { t: '笑话', d: '埃及人的幽默在阿拉伯世界出了名。日子越难，笑话越好笑。' } },
    guests: {
      en: { t: 'Guests', d: 'Visit an Egyptian home and you will be fed. Say you are full, and you will be fed again.' },
      zh: { t: '好客', d: '去埃及人家里做客，一定会被喂饱。说你吃饱了？那就再来一盘。' } }
  },

  /* ------------------------------------------------------------------
     FEASTS
  ------------------------------------------------------------------ */
  ramadan: {
    img: 'ramadan.jpg', pos: '38% center',
    en: { t: 'Ramadan nights', d: 'For a month, people fast from dawn to sunset. At sunset the whole country sits down to eat at the same minute, and the streets stay awake until dawn.' },
    zh: { t: '斋月之夜', d: '整整一个月，人们从黎明到日落禁食。日落那一刻，全国同时开饭，街道一直热闹到天亮。' },
    facts: [
      { icon: 'lantern',
        en: { t: 'Fanous', d: 'Colored lanterns hang over every street. Kids get a new one each year.' },
        zh: { t: '斋月灯 Fanous', d: '五彩灯笼挂满每条街。孩子们每年都会得到一盏新灯。' } },
      { icon: 'drum',
        en: { t: 'Mesaharati', d: 'Before dawn, a drummer walks the streets calling neighbors by name to wake up and eat.' },
        zh: { t: '敲鼓人 Mesaharati', d: '黎明前，敲鼓人走街串巷，喊着邻居的名字叫大家起床吃封斋饭。' } },
      { icon: 'tablia',
        en: { t: 'Mawa’id el-Rahman', d: 'Long free tables on the street where anyone, rich or poor, neighbor or stranger, can break the fast.' },
        zh: { t: '慈悲餐桌', d: '街边摆起长长的免费餐桌，不论贫富、是否相识，人人都可以坐下开斋。' } }
    ]
  },

  feasts: [
    { icon: 'cross', ar: 'عيد الميلاد',
      en: { w: '7 January', t: 'Coptic Christmas', d: 'Egypt’s Christians belong to one of the oldest churches in the world. Muslim neighbors drop by with greetings.' },
      zh: { w: '1月7日', t: '科普特圣诞节', d: '埃及的基督徒属于世界上最古老的教会之一。穆斯林邻居也会上门道贺。' } },
    { icon: 'kahk', ar: 'عيد الفطر',
      en: { w: 'After Ramadan', t: 'Eid al-Fitr', d: 'New clothes, family visits and kahk, butter cookies under a snow of sugar. Kids collect eidiya, pocket money from every relative.' },
      zh: { w: '斋月结束后', t: '开斋节', d: '穿新衣、走亲戚，吃撒满糖粉的 kahk 黄油饼干。孩子们会从每位亲戚那里收到 eidiya，也就是 “节日红包”。' } },
    { icon: 'egg', ar: 'شم النسيم',
      en: { w: 'Spring', t: 'Sham el-Nessim', d: 'It means “smelling the breeze”. Everyone picnics with colored eggs and salted fish, a custom from ancient Egypt shared by Muslims and Christians.' },
      zh: { w: '春天', t: '闻风节', d: '字面意思是 “闻一闻微风”。人们带着彩蛋和咸鱼去户外野餐。这个源自古埃及的习俗，穆斯林和基督徒一起过。' } },
    { icon: 'teapot', ar: 'عيد الأضحى',
      en: { w: 'Two months later', t: 'Eid al-Adha', d: 'The feast of sacrifice. Families share meat with neighbors and with people in need, so nobody is left out.' },
      zh: { w: '约两个月后', t: '宰牲节', d: '家家户户把肉分给邻居和有需要的人，不让任何人落下。' } },
    { icon: 'doll', ar: 'المولد النبوي',
      en: { w: 'Moves with the moon', t: 'Moulid an-Nabi', d: 'Sweet shops fill with sugar dolls: a bride for girls and a knight on horseback for boys.' },
      zh: { w: '随月历变动', t: '圣纪节', d: '甜品店里摆满糖做的娃娃：女孩拿新娘，男孩拿骑马的骑士。' } }
  ],

  /* ------------------------------------------------------------------
     ARTS
  ------------------------------------------------------------------ */
  arts: [
    { id: 'umm', icon: 'oud', img: 'umm-kulthum.jpg', pos: 'center 22%', ar: 'أم كلثوم',
      en: { t: 'Umm Kulthum', k: 'Music', d: 'The Star of the East. On the first Thursday of each month the Arab world tuned in to her live concerts, and one song could last over an hour.' },
      zh: { t: '乌姆·库勒苏姆', k: '音乐', d: '“东方之星”。每月第一个星期四，整个阿拉伯世界都守在收音机旁听她的现场演唱，一首歌能唱一个多小时。' } },
    { id: 'cinema', icon: 'film', img: null, ar: 'سينما',
      en: { t: 'Egyptian cinema', k: 'Film', d: 'Cairo made so many films that Egyptian became the Arabic everyone understands. Black-and-white classics still play on TV every afternoon.' },
      zh: { t: '埃及电影', k: '电影', d: '开罗拍了太多电影，埃及方言因此成了全阿拉伯世界都听得懂的阿拉伯语。黑白老片至今每天下午还在电视上播。' } },
    { id: 'mahraganat', icon: 'sound', img: null, ar: 'مهرجانات',
      en: { t: 'Mahraganat', k: 'Street sound', d: 'Loud electro-shaabi music born in Cairo’s working-class neighborhoods. Fast beats, auto-tune, and the soundtrack of every wedding.' },
      zh: { t: '电子街头乐 Mahraganat', k: '街头音乐', d: '诞生于开罗平民街区的电子 shaabi 音乐。节奏快、电音重，是每场婚礼的背景音乐。' } },
    { id: 'tanoura', icon: 'tanoura', img: 'tanoura.jpg', pos: '40% center', ar: 'تنورة',
      en: { t: 'Tanoura', k: 'Dance', d: 'Dancers spin for long minutes in heavy, layered, rainbow skirts, lifting them overhead like spinning plates. It grew from Sufi tradition.' },
      zh: { t: '坦努拉旋转舞', k: '舞蹈', d: '舞者穿着厚重的多层彩裙一转就是好几分钟，还会把裙子举过头顶旋转。它源于苏非派传统。' } },
    { id: 'khayamiya', icon: 'needle', img: 'khayamiya.jpg', ar: 'خيامية',
      en: { t: 'Khayamiya', k: 'Craft', d: 'Hand-stitched appliqué from the Street of the Tentmakers, next to Bab Zuweila. It once lined the big tents for weddings and Ramadan nights.' },
      zh: { t: '帐篷布艺 Khayamiya', k: '手工艺', d: '开罗祖维拉门旁 “帐篷匠人街” 的手工贴布绣，过去用来装饰婚礼和斋月夜的大帐篷。' } }
  ],

  /* ------------------------------------------------------------------
     PLACES (map coordinates are in the map's own units)
  ------------------------------------------------------------------ */
  places: [
    { id: 'cairo', icon: 'minaret', x: 473.3, y: 148.8, img: 'khan.jpg', pos: '35% center', ar: 'القاهرة',
      en: { t: 'Cairo', k: '20+ million people', d: 'City of a thousand minarets and traffic that somehow works. Dinner at midnight is normal, and the city never fully sleeps.' },
      zh: { t: '开罗', k: '两千多万人口', d: '千塔之城，交通乱中有序。午夜吃晚饭很正常，这座城市从不真正入睡。' } },
    { id: 'alexandria', icon: 'wave', x: 379.2, y: 56, img: 'alexandria.jpg', ar: 'الإسكندرية',
      en: { t: 'Alexandria', k: 'On the Mediterranean', d: 'Sea breeze, fresh fish and old cafés along the corniche. When Cairo gets hot, Cairo goes to Alex.' },
      zh: { t: '亚历山大', k: '地中海畔', d: '海风、鲜鱼和海滨大道上的老咖啡馆。开罗一热，开罗人就往亚历山大跑。' } },
    { id: 'siwa', icon: 'palm', x: 65.6, y: 216, img: 'siwa.jpg', ar: 'سيوة',
      en: { t: 'Siwa Oasis', k: 'Western Desert', d: 'Palm groves, salt lakes and a mud-brick old town near the Libyan border. People here speak their own Amazigh language, Siwi.' },
      zh: { t: '锡瓦绿洲', k: '西部沙漠', d: '靠近利比亚边境，有椰枣林、盐湖和泥砖老城。当地人说自己的柏柏尔语：锡瓦语。' } },
    { id: 'aswan', icon: 'house', x: 591.6, y: 624.8, img: 'nubia.jpg', pos: 'center 38%', ar: 'أسوان',
      en: { t: 'Aswan and Nubia', k: 'The south', d: 'Painted Nubian houses, the Nubian language and the calmest stretch of the Nile. Take a felucca at sunset.' },
      zh: { t: '阿斯旺与努比亚', k: '南部', d: '彩绘的努比亚房屋、努比亚语，还有尼罗河最宁静的一段。日落时坐一趟三角帆船吧。' } },
    { id: 'sinai', icon: 'mountain', x: 666.5, y: 267.2, img: 'sinai.jpg', pos: 'center 60%', ar: 'سيناء',
      en: { t: 'Sinai', k: 'Between two seas', d: 'Bedouin tea by the fire, a night climb up Mount Sinai for sunrise, and coral reefs off Dahab.' },
      zh: { t: '西奈半岛', k: '两海之间', d: '围着篝火喝贝都因茶，夜爬西奈山看日出，在达哈卜潜水看珊瑚礁。' } }
  ],

  /* ------------------------------------------------------------------
     QUIZ: each visitor gets a random set. a = index of the right answer.
  ------------------------------------------------------------------ */
  quiz: [
    { icon: 'bowl', a: 0,
      en: { q: 'What is in a plate of koshari?', o: ['Rice, lentils, pasta and chickpeas with tomato sauce', 'Grilled lamb with yogurt and mint', 'Seafood rice with saffron'], f: 'Koshari is Egypt’s favorite street food, topped with crispy onions and a garlic-vinegar sauce. It is also vegan.' },
      zh: { q: '一盘库沙里（Koshari）里有什么？', o: ['米饭、扁豆、意面和鹰嘴豆，浇番茄酱', '烤羊肉配酸奶和薄荷', '藏红花海鲜饭'], f: '库沙里是埃及人最爱的街头美食，上面撒炸洋葱，再淋一勺蒜醋汁。而且它是纯素的。' } },
    { icon: 'taameya', a: 1,
      en: { q: 'Egyptian falafel, ta’ameya, is made from…', o: ['Chickpeas', 'Fava beans', 'Lentils'], f: 'That is why it is bright green inside. In most other countries falafel is made from chickpeas.' },
      zh: { q: '埃及的法拉费（Ta’ameya）是用什么做的？', o: ['鹰嘴豆', '蚕豆', '扁豆'], f: '所以它里面是鲜绿色的。在其他大多数国家，法拉费用的是鹰嘴豆。' } },
    { icon: 'words', a: 0,
      en: { q: 'A friend spills tea on you and says “ma’lesh”. What do they mean?', o: ['Never mind, it’s okay', 'You pay for it', 'Good morning'], f: 'Ma’lesh might be the most useful word in Egypt: sorry, never mind and cheer up, all in one.' },
      zh: { q: '朋友把茶洒在你身上，说了句 “ma’lesh”。是什么意思？', o: ['没关系，别介意', '你来买单', '早上好'], f: 'Ma’lesh 可能是埃及最有用的词：对不起、没关系、别难过，全都是它。' } },
    { icon: 'lantern', a: 0,
      en: { q: 'During Ramadan, Egyptian streets glow with…', o: ['Fanous lanterns', 'Paper dragons', 'Fireworks every night'], f: 'The fanous tradition in Cairo is said to be over a thousand years old. Kids still get a new lantern every Ramadan.' },
      zh: { q: '斋月期间，埃及的街道被什么点亮？', o: ['Fanous 斋月灯笼', '纸龙', '每晚的烟花'], f: '据说开罗的斋月灯笼传统已有一千多年。孩子们至今每年斋月都会得到一盏新灯。' } },
    { icon: 'egg', a: 0,
      en: { q: 'On Sham el-Nessim, the spring festival, Egyptians…', o: ['Picnic outside with colored eggs and salted fish', 'Throw colored powder at each other', 'Stay home and fast'], f: 'Its roots go back to ancient Egypt, and Muslims and Christians celebrate it together.' },
      zh: { q: '在春天的闻风节（Sham el-Nessim），埃及人会……', o: ['带着彩蛋和咸鱼去户外野餐', '互相泼彩色粉末', '待在家里禁食'], f: '它起源于古埃及，穆斯林和基督徒一起庆祝。' } },
    { icon: 'oud', a: 0,
      en: { q: 'Who was Umm Kulthum?', o: ['A legendary singer, the Star of the East', 'An ancient queen', 'A famous football player'], f: 'Her monthly radio concerts stopped the Arab world. A single song could last more than an hour.' },
      zh: { q: '乌姆·库勒苏姆（Umm Kulthum）是谁？', o: ['被称为 “东方之星” 的传奇女歌手', '一位古埃及女王', '一位著名足球运动员'], f: '她每月一次的电台直播让整个阿拉伯世界停下来聆听。一首歌能唱一个多小时。' } },
    { icon: 'dice', a: 1,
      en: { q: 'Which game will you hear clacking in every Egyptian coffee house?', o: ['Chess', 'Tawla (backgammon)', 'Mahjong'], f: 'Players shout the dice in old Persian and Turkish numbers. “Shesh besh” means a six and a five.' },
      zh: { q: '在埃及每家街角茶馆里，你都能听到哪种棋的啪嗒声？', o: ['国际象棋', '双陆棋（Tawla）', '麻将'], f: '玩家用古老的波斯语和土耳其语数字喊骰子，“shesh besh” 就是六和五。' } },
    { icon: 'bread', a: 0,
      en: { q: 'Egyptian bread is called “aish”. What else does aish mean?', o: ['Life', 'Sun', 'Water'], f: 'Bread is so central to every meal that it shares its name with life itself.' },
      zh: { q: '埃及大饼叫 “aish”。这个词还有什么意思？', o: ['生命', '太阳', '水'], f: '面包在埃及餐桌上太重要了，连名字都和 “生命” 是同一个词。' } },
    { icon: 'boat', a: 2,
      en: { q: 'Roughly how many Egyptians live close to the Nile?', o: ['About 20%', 'About half', 'About 95%'], f: 'More than 100 million people live on a narrow green strip along the river. The rest of the country is mostly desert.' },
      zh: { q: '大约多少埃及人住在尼罗河附近？', o: ['约20%', '约一半', '约95%'], f: '一亿多人生活在尼罗河两岸的狭长绿带上，国土的其余部分大多是沙漠。' } },
    { icon: 'book', a: 0,
      en: { q: 'Which Egyptian writer won the Nobel Prize in Literature in 1988?', o: ['Naguib Mahfouz', 'Mohamed Salah', 'Omar Sharif'], f: 'He was the first Arabic-language writer to win it, and he wrote about the alleys of old Cairo.' },
      zh: { q: '哪位埃及作家在1988年获得了诺贝尔文学奖？', o: ['纳吉布·马哈福兹', '穆罕默德·萨拉赫', '奥马尔·沙里夫'], f: '他是第一位获得诺贝尔文学奖的阿拉伯语作家，笔下写的是开罗老城的小巷。' } },
    { icon: 'karkadeh', a: 0,
      en: { q: 'What is karkadeh?', o: ['A red hibiscus drink, hot or iced', 'A spicy bean stew', 'A wedding dance'], f: 'Deep red and a little sour, it is served at weddings and in the summer heat. The best hibiscus is said to come from Aswan.' },
      zh: { q: 'Karkadeh 是什么？', o: ['一种冷热皆宜的红色洛神花茶', '一种辣味炖豆子', '一种婚礼舞蹈'], f: '深红微酸，婚礼和炎夏必备。据说最好的洛神花产自阿斯旺。' } },
    { icon: 'kahk', a: 0,
      en: { q: 'Before Eid, Egyptian families bake piles of…', o: ['Kahk, cookies dusted with sugar', 'Mooncakes', 'Gingerbread houses'], f: 'Whole families bake them together, and Egyptians will tell you the recipe goes back to the pharaohs.' },
      zh: { q: '开斋节前，埃及家庭会烤一大堆……', o: ['撒满糖粉的 Kahk 饼干', '月饼', '姜饼屋'], f: '全家人一起动手做。埃及人会告诉你，这个配方可以追溯到法老时代。' } },
    { icon: 'drum', a: 0,
      en: { q: 'In Ramadan, who walks the streets with a drum before dawn?', o: ['The mesaharati, waking people to eat', 'A wedding band', 'The night police'], f: 'Many still call out each family by name as they pass.' },
      zh: { q: '斋月里，谁会在黎明前敲着鼓走街串巷？', o: ['Mesaharati，叫大家起床吃饭', '婚礼乐队', '夜间巡警'], f: '很多敲鼓人至今还会边走边喊出每户人家的名字。' } },
    { icon: 'film', a: 0,
      en: { q: 'Why do people across the Arab world understand the Egyptian dialect?', o: ['Egyptian films, TV and songs', 'Every school teaches it', 'It is the oldest dialect'], f: 'For decades, Cairo was the Hollywood of the Arab world.' },
      zh: { q: '为什么整个阿拉伯世界都听得懂埃及方言？', o: ['因为埃及的电影、电视剧和歌曲', '因为所有学校都教', '因为它是最古老的方言'], f: '几十年来，开罗一直是阿拉伯世界的 “好莱坞”。' } },
    { icon: 'ball', a: 0,
      en: { q: 'Al Ahly and Zamalek are…', o: ['Cairo’s two biggest football rivals', 'Two kinds of bread', 'Two famous desserts'], f: 'Al Ahly is one of the most successful clubs in Africa. A derby can split a family dinner table in two.' },
      zh: { q: '阿赫利（Al Ahly）和扎马雷克（Zamalek）是……', o: ['开罗最大的两支宿敌足球俱乐部', '两种面包', '两种有名的甜点'], f: '阿赫利是非洲最成功的俱乐部之一。一场德比，能让一家人在饭桌上分成两派。' } }
  ],

  /* Photo credits (copied from assets/img/credits.json). Shown in the footer. */
  credits: [
    {
      "subject": "Ramadan fanous lanterns and lights over a Cairo street at night",
      "author": "Basssant Meligy",
      "license": "CC BY-SA 4.0",
      "source": "https://commons.wikimedia.org/wiki/File:Ramadan_nights.jpg"
    },
    {
      "subject": "Ramadan lantern stall with khayamiya-print fabric, Cairo",
      "author": "Alaazzpov",
      "license": "CC BY-SA 4.0",
      "source": "https://commons.wikimedia.org/wiki/File:%D8%A3%D8%AC%D9%88%D8%A7%D8%A1_%D8%B1%D9%85%D8%B6%D8%A7%D9%86.jpg"
    },
    {
      "subject": "Koshari",
      "author": "Dina Said",
      "license": "CC BY-SA 4.0",
      "source": "https://commons.wikimedia.org/wiki/File:Egyptian_food_Koshary.jpg"
    },
    {
      "subject": "Ta'ameya (Egyptian fava-bean falafel) being fried at a street stall",
      "author": "Mohamed shokry algarnosy",
      "license": "CC BY-SA 4.0",
      "source": "https://commons.wikimedia.org/wiki/File:%D8%A7%D9%84%D8%B7%D8%B9%D9%85%D9%8A%D8%A9_%D9%85%D8%AD%D9%85%D8%AF_%D8%B4%D9%83%D8%B1%D9%8A_%D8%A7%D9%84%D8%AC%D8%B1%D9%86%D9%88%D8%B3%D9%8A_4.jpg"
    },
    {
      "subject": "El Fishawy coffee house (ahwa), Khan el-Khalili, Cairo",
      "author": "Djehouty",
      "license": "CC BY-SA 4.0",
      "source": "https://commons.wikimedia.org/wiki/File:Kairo_2016-03-28g.jpg"
    },
    {
      "subject": "Egyptian tea in a small glass",
      "author": "Mona Hassan Abo-Abda",
      "license": "CC BY-SA 4.0",
      "source": "https://commons.wikimedia.org/wiki/File:Drinking_tea.jpg"
    },
    {
      "subject": "Khan el-Khalili market street, Cairo",
      "author": "MoonDreem",
      "license": "CC BY-SA 4.0",
      "source": "https://commons.wikimedia.org/wiki/File:%D8%A7%D8%AD%D8%AF_%D8%B4%D9%88%D8%A7%D8%B1%D8%B9_%D8%AE%D8%A7%D9%86_%D8%A7%D9%84%D8%AE%D9%84%D9%8A%D9%84%D9%8A.jpg"
    },
    {
      "subject": "Tanoura dancer performing in a Cairo street",
      "author": "Nourhan Moubarak",
      "license": "CC BY-SA 4.0",
      "source": "https://commons.wikimedia.org/wiki/File:Tanoura_dance_2.jpg"
    },
    {
      "subject": "Khayamiya artisan stitching applique, Street of the Tentmakers, Cairo",
      "author": "Waled ibarhim",
      "license": "Public domain",
      "source": "https://commons.wikimedia.org/wiki/File:%D8%AA%D8%B5%D9%88%D9%8A%D8%B1_%D9%81%D9%86%D8%A7%D9%86%D9%8A%D9%86_%D8%A7%D9%84%D8%AE%D9%8A%D8%A7%D9%85%D9%8A%D8%A9_23_%D9%85%D8%A7%D9%8A%D9%88_2026_%D8%A8%D8%B4%D8%A7%D8%B1%D8%B9_%D8%A7%D9%84%D8%AE%D9%8A%D8%A7%D9%85%D9%8A%D8%A9_07.jpg"
    },
    {
      "subject": "Colorful Nubian houses on the Nile, Aswan",
      "author": "Myousry6666",
      "license": "CC BY-SA 4.0",
      "source": "https://commons.wikimedia.org/wiki/File:Colorful_Nubian_Houses_(4).jpg"
    },
    {
      "subject": "Shali old town and palm groves, Siwa Oasis",
      "author": "Michael Hermann",
      "license": "CC BY-SA 4.0",
      "source": "https://commons.wikimedia.org/wiki/File:Shali_(Historic_Center_of_Siwa)_02.JPG"
    },
    {
      "subject": "Alexandria Corniche on the Mediterranean",
      "author": "Abdelrhman 1990",
      "license": "CC BY-SA 4.0",
      "source": "https://commons.wikimedia.org/wiki/File:Corniche_of_Alexandria.jpg"
    },
    {
      "subject": "Umm Kulthum performing in concert (c. 1968)",
      "author": "Unknown photographer",
      "license": "Public domain",
      "source": "https://commons.wikimedia.org/wiki/File:Umm_Kulthum4.jpg"
    },
    {
      "subject": "Making kahk (Eid cookies) at home",
      "author": "Hbegzee",
      "license": "CC BY-SA 4.0",
      "source": "https://commons.wikimedia.org/wiki/File:Eid_kahk_rituals.jpg"
    },
    {
      "subject": "Boys playing football in a Ramadan neighborhood tournament",
      "author": "Mohamed shokry algarnosy",
      "license": "CC BY-SA 4.0",
      "source": "https://commons.wikimedia.org/wiki/File:%D8%AF%D9%88%D8%B1%D8%A7%D8%AA_%D9%83%D8%B1%D8%A9_%D8%A7%D9%84%D9%82%D8%AF%D9%85_%D8%A7%D9%84%D8%B4%D8%B9%D8%A8%D9%8A%D9%87_%D8%A7%D9%84%D9%85%D8%B1%D8%AA%D8%A8%D8%B7%D8%A9_%D8%A8%D8%B4%D9%87%D8%B1_%D8%B1%D9%85%D8%B6%D8%A7%D9%86_34.jpg"
    },
    {
      "subject": "Sunrise over the mountains from Mount Sinai",
      "author": "Ibrahim El-Mezayen",
      "license": "CC BY-SA 4.0",
      "source": "https://commons.wikimedia.org/wiki/File:Sunrise_on_Mount_Sinai_-_Egypt.jpg"
    }
  ]
};

/**
 * WU GUOHENG SIMULATOR - GAME DATA DEFINITIONS
 * Events, Endings, Achievements, Quotes & Dialogue
 */

const GUOHENG_QUOTES = [
  "只要我下班夠快，加班的陰影就追不上我！",
  "不要問公司能為你做什麼，要問你在公司摸了多少魚。",
  "我不是在發呆，我是在用大腦進行深度量子運算。",
  "薪水就像月經，一個月來一次，一個禮拜就沒了。",
  "遇事不決，先喝奶茶；世事無常，大腸包小腸。",
  "工作可以摸，但工資不能少，這叫職業素養。",
  "當你覺得累的時候，記住：這說明你還沒學會極致摸魚。",
  "真正的強者，打卡從不遲到，下班從不多待一秒。",
  "今天你對我愛理不理，明天亨幣暴漲讓你高攀不起！",
  "天塌下來有高個子頂著，項目延期有產品經理扛著。",
  "工位再小，也是我的摸魚江山！",
  "只要心態夠佛，全世界的Bug都與我無關。",
  "世上本沒有難題，只要你敢甩鍋，就一身輕鬆。",
  "早起是為了打卡，活著是為了下班。",
  "錢不是萬能的，但沒有亨幣是萬萬不能的！",
  "不要低估一個準時下班的人，他的執行力超乎你的想像。"
];

const ACHIEVEMENTS_DATA = [
  { id: "first_slack", name: "初試啼聲", desc: "完成第一次帶薪摸魚", icon: "☕", unlocked: false },
  { id: "crypto_master", name: "幣圈狂徒", desc: "單次炒幣賺取超過 NT$10,000", icon: "📈", unlocked: false },
  { id: "rich_starter", name: "小富即安", desc: "總資產首次突破 NT$50,000", icon: "💰", unlocked: false },
  { id: "millionaire", name: "亨門大亨", desc: "總資產突破 NT$200,000", icon: "💎", unlocked: false },
  { id: "gym_rat", name: "鋼鐵猛男", desc: "進行 5 次極限健身鍛鍊", icon: "🏋️", unlocked: false },
  { id: "bookworm", name: "哲學宗師", desc: "智謀格局達到 80 以上", icon: "🧠", unlocked: false },
  { id: "social_king", name: "熱炒局霸主", desc: "舉辦 3 次請客熱炒局", icon: "🥂", unlocked: false },
  { id: "slack_god", name: "摸魚真仙", desc: "摸魚魅力達到 85 以上", icon: "🕶️", unlocked: false },
  { id: "arcade_500", name: "街機初級", desc: "在街機跑酷中單局達到 500 分", icon: "🎮", unlocked: false },
  { id: "arcade_2000", name: "跑酷神之手", desc: "在街機跑酷中單局達到 2,000 分", icon: "⚡", unlocked: false },
  { id: "combo_king", name: "十連神技", desc: "在街機模式中達成 15 連擊 Combo", icon: "🔥", unlocked: false },
  { id: "fever_rush", name: "黃金錦鯉", desc: "在街機模式中觸發無敵暴富狂潮", icon: "🌟", unlocked: false },
  { id: "meme_creator", name: "表情包巨匠", desc: "在工坊中成功導出 1 張亨哥表情包", icon: "🎨", unlocked: false },
  { id: "sound_master", name: "打擊樂大師", desc: "點擊音效板累計超過 15 次", icon: "📢", unlocked: false },
  { id: "poke_lover", name: "真愛互動", desc: "在主頁連續戳亨哥超過 10 次", icon: "👉", unlocked: false },
  { id: "survivor_30", name: "三十日圓滿", desc: "完整經歷 30 天傳奇人生到達結算", icon: "📅", unlocked: false },
  { id: "high_iq_fame", name: "德高望重", desc: "亨界聲望達到 60 以上", icon: "👑", unlocked: false },
  { id: "hotpot_addict", name: "火鍋狂魔", desc: "享用 3 次豪華麻辣火鍋", icon: "🍲", unlocked: false },
  { id: "ending_collector", name: "平行宇宙", desc: "解鎖至少 3 個不同的人生結局", icon: "🌌", unlocked: false },
  { id: "true_legend", name: "全能吳國亨", desc: "完成任一 SSS 級頂尖人生結局", icon: "🏆", unlocked: false }
];

const ENDINGS_DATA = [
  {
    id: "end_billionaire",
    title: "《全球商業大亨・亨哥帝國》",
    rank: "SSS",
    badge: "👑",
    condition: "總資產達到 NT$ 300,000 以上",
    desc: "你憑藉過人的商業嗅覺與梭哈魄力，建立了橫跨科技與餐飲的亨哥跨國集團，正式榮登富豪榜首！",
    comment: "「錢對我來說只是一串數字，摸魚才是靈魂的歸宿。」"
  },
  {
    id: "end_slack_god",
    title: "《摸魚真仙・帶薪養老祖師》",
    rank: "SS",
    badge: "☕",
    condition: "摸魚魅力達到 85 以上",
    desc: "在公司 30 年無人知曉你在做什麼，但每次升遷名單都有你。你出版了《極致摸魚心法》，萬人景仰！",
    comment: "「只要坐姿端正，螢幕代碼滾動，神明亦難辨真偽。」"
  },
  {
    id: "end_philosopher",
    title: "《量子哲人・看破紅塵的高人》",
    rank: "SS",
    badge: "🧠",
    condition: "智謀格局達到 85 以上",
    desc: "你深研宇宙真理，在公司的飲水機旁領悟了時空穿梭理論，成為世界頂級物理哲學名家。",
    comment: "「凡所有相，皆是虛妄；唯有下班，真實不虛。」"
  },
  {
    id: "end_social_tycoon",
    title: "《國民大哥・亨界社交之王》",
    rank: "S",
    badge: "🥂",
    condition: "聲望 >= 60 且 魅力 >= 70",
    desc: "全台灣從夜市熱炒老闆到科技巨頭CEO都是你的拜把兄弟，任何難題一通電話搞定。",
    comment: "「兄弟見面先乾三杯，合同的事情吃完再聊！」"
  },
  {
    id: "end_fitness_god",
    title: "《健美戰神・極限體魄宗師》",
    rank: "S",
    badge: "🏋️",
    condition: "體力上限大增且健身超過 5 次",
    desc: "深蹲破 300 公斤，西裝被肌肉撐爆。老闆見了你說話都得客客氣氣，無人敢催你交報告。",
    comment: "「道理是講給同量級的人聽的，現在我是超重量級。」"
  },
  {
    id: "end_crypto_king",
    title: "《華爾街孤狼・幣圈傳說》",
    rank: "S",
    badge: "📈",
    condition: "資產超過 NT$ 150,000 且 投資次數多",
    desc: "憑著一手亨幣神操作，精準抄底逃頂。操盤室裡你叼著雪茄，全世界韭菜都聽你的號令！",
    comment: "「別人在恐懼，我在加倉；別人在貪婪，我已提車。」"
  },
  {
    id: "end_food_master",
    title: "《米其林三星・夜市神級掌門》",
    rank: "A",
    badge: "🍲",
    condition: "大吃美食超過 5 次",
    desc: "吃遍天下美味後，你憤而轉行開創特色麻辣雞排店，每天排隊人潮癱瘓整條忠孝東路！",
    comment: "「寫代碼哪有炸雞排香？來，加辣不切！」"
  },
  {
    id: "end_arcade_champion",
    title: "《極速閃電・街機逃脫傳奇》",
    rank: "A",
    badge: "⚡",
    condition: "街機跑酷分數破 1,500 分",
    desc: "你的反應速度突破人類極限，在職場中精準躲避所有無效任務與甩鍋，成為職場不敗幻影！",
    comment: "「殘影是我的起手式，閃現是我的基本步法。」"
  },
  {
    id: "end_happy_worker",
    title: "《佛系逍遙・極致幸福打工人》",
    rank: "A",
    badge: "🏖️",
    condition: "正常平穩完成 30 天",
    desc: "不爭不搶，準時下班，週末露營釣魚。你過上了世人最羨慕的鬆弛感人生，無病無災。",
    comment: "「能吃能睡，下班追劇，這才是人間值得。」"
  },
  {
    id: "end_burnout_icu",
    title: "《爆肝輪椅俠・急診室的頓悟》",
    rank: "B",
    badge: "🏥",
    condition: "連續精力過低崩潰",
    desc: "你太過拼命，終於被送進了VIP急診室。在病床上你望著天花板，大徹大悟：健康最重要！",
    comment: "「我不要做優秀員工了，醫生，再給我續一袋葡萄糖！」"
  },
  {
    id: "end_broke_restart",
    title: "《天台吹風・破產逆襲狂人》",
    rank: "B",
    badge: "🌪️",
    condition: "資產歸零或負數結算",
    desc: "梭哈失敗一貧如洗，但亨哥從不言敗！你在天台上喝完最後一罐可樂，決定重頭再來！",
    comment: "「三十年河東，三十年河西，莫欺中年吳國亨！」"
  },
  {
    id: "end_cosmic_traveler",
    title: "《宇宙開拓者・火星亨哥首任總督》",
    rank: "SSS",
    badge: "🚀",
    condition: "資產 >= 250,000 且 智謀 >= 80",
    desc: "地球已經裝不下亨哥的野心，你搭乘亨哥號太空船直奔火星，並在火星建立了第一家摸魚度假村！",
    comment: "「我們的征途是星辰大海，以及無重力帶薪漂浮。」"
  }
];

const RANDOM_EVENTS = [
  {
    id: "evt_boss_behind",
    title: "🚨 老闆突然站在你背後！",
    desc: "正當你在瀏覽熱門八卦時，突然感覺後背一涼，老闆那嚴肅的目光正注視著你的螢幕！",
    choices: [
      {
        text: "🅰️ 瞬間切換到滿屏代碼「老闆，我在思考深層邏輯！」",
        check: "iq",
        successVal: 45,
        winMsg: "老闆驚為天人，拍了拍你的肩膀：『國亨啊，辛苦了，注意身體！』獲得獎金與讚賞！",
        winEffect: { money: 3000, iq: 4, fame: 3 },
        failMsg: "手忙腳亂切到了購物網頁，老闆臉色鐵青...",
        failEffect: { charisma: -4, energy: -15 }
      },
      {
        text: "🅱️ 深情回眸，展現亨式招牌魅力笑顏：「老闆，您今天氣色真好！」",
        check: "charisma",
        successVal: 50,
        winMsg: "老闆被你的英俊與真誠感染，心情大好，順手請了全組下午茶！",
        winEffect: { charisma: 6, energy: 15, fame: 4 },
        failMsg: "老闆皺眉：「少油嘴滑舌，專案進度如何了？」",
        failEffect: { energy: -10 }
      },
      {
        text: "🅲 遞上一罐熱咖啡：「老闆您忙了一早，先喝一口歇歇。」",
        winMsg: "經典暖男操作！老闆欣慰地接過咖啡，轉身離去不再深究。",
        winEffect: { money: -50, charisma: 3, energy: -5 }
      }
    ]
  },
  {
    id: "evt_crypto_surge",
    title: "📈 亨幣 (HengCoin) 突然暴漲 300%！",
    desc: "朋友圈與財經新聞瘋狂推播，你之前順手買的一點亨幣竟然被海外神秘財團拉盤狂飆！",
    choices: [
      {
        text: "🅰️ 果斷落袋為安，立刻全部清倉套現！",
        winMsg: "落袋為安是真正的大師！戶頭瞬間多了一大筆鉅款！",
        winEffect: { money: 18000, iq: 3 }
      },
      {
        text: "🅱️ 乘勝追擊！開 5 倍槓桿直衝火星！",
        check: "charisma",
        successVal: 55,
        winMsg: "天選之子！幣價再次拉升，你狠狠大賺了一筆天文數字！",
        winEffect: { money: 35000, fame: 8 },
        failMsg: "大莊家無情砸盤插針，槓桿爆倉，血虧一場！",
        failEffect: { money: -12000, energy: -20 }
      },
      {
        text: "🅲 在網上發文「聽哥一句勸，財富密碼已掌握」，招募學徒",
        winMsg: "吸引了一大批忠實粉絲，亨界聲望暴增！",
        winEffect: { fame: 12, charisma: 5 }
      }
    ]
  },
  {
    id: "evt_mystic_master",
    title: "🧘 街頭偶遇算命天機老人",
    desc: "路過騎樓，一位穿著八卦道袍的仙風道骨老者突然叫住你：「這位亨兄，你印堂發亮，乃人中龍鳳也！」",
    choices: [
      {
        text: "🅰️ 遞上 NT$500 求教財富秘法",
        winMsg: "老仙人附耳低語：「遇金則發，遇綠則抄！」你頓開茅塞，運勢大振！",
        winEffect: { money: -500, iq: 6, charisma: 5 },
      },
      {
        text: "🅱️ 反手跟老者推銷公司理財產品",
        check: "iq",
        successVal: 52,
        winMsg: "你的商業口才讓算命先生甘拜下風，當場認購了一份基金！",
        winEffect: { money: 4000, charisma: 5, fame: 5 },
        failMsg: "算命先生搖搖頭跑開了：「年輕人，你的套路比老夫還深！」",
        failEffect: { energy: -5 }
      },
      {
        text: "🅲 請老仙人吃一碗熱騰騰的魯肉飯",
        winMsg: "善有善報！老人贈你一道「護體靈符」，精神體力大幅回升！",
        winEffect: { money: -100, energy: 30, charisma: 4 }
      }
    ]
  },
  {
    id: "evt_water_cooler",
    title: "💡 飲水機旁的宇宙大頓悟",
    desc: "在茶水間接溫水時，看著水滴落下激起的漣漪，你腦中彷彿連通了宇宙高維信息庫...",
    choices: [
      {
        text: "🅰️ 領悟「高維摸魚力學」——不動如山",
        winMsg: "你掌握了摸魚的最高境界，從此任何雜事都無法消耗你的元神！",
        winEffect: { charisma: 8, energy: 20 }
      },
      {
        text: "🅱️ 順便把公司的核心演算法優化了",
        winMsg: "隨手改了兩行代碼，系統運行速度翻倍，CTO親自送來錦旗！",
        winEffect: { iq: 9, fame: 8, money: 3000 }
      },
      {
        text: "🅲 倒了一大杯枸杞菊花茶，給全組分發",
        winMsg: "同事們紛紛投來崇拜與感謝的目光，人緣爆棚！",
        winEffect: { charisma: 6, fame: 4 }
      }
    ]
  },
  {
    id: "evt_headhunter",
    title: "📞 跨國巨頭獵頭深夜來電",
    desc: "一位英語流利的獵頭打來：「吳先生您好，我們客戶非常看好您的傳奇氣場，開出雙倍年薪邀請您加入！」",
    choices: [
      {
        text: "🅰️ 霸氣拿offer跟現老闆談判加薪！",
        check: "charisma",
        successVal: 50,
        winMsg: "老闆害怕失去你這位頂樑柱，當場簽字加薪並升職為特別顧問！",
        winEffect: { money: 8000, fame: 6, charisma: 4 },
        failMsg: "老闆拍桌子：「想走就走，誰怕誰！」氣氛一度尷尬...",
        failEffect: { energy: -15, fame: -2 }
      },
      {
        text: "🅱️ 要求對方先把簽約金打入戶頭驗證誠意",
        winMsg: "對方被你的氣場所震懾，竟然真的打來了誠意諮詢費！",
        winEffect: { money: 5000, iq: 4 }
      },
      {
        text: "🅲 回覆：「我不是為了錢，我留在這只為了享受摸魚的藝術。」",
        winMsg: "格局拉滿！此番發言在獵頭圈被瘋傳為神仙傳說！",
        winEffect: { charisma: 10, fame: 10 }
      }
    ]
  },
  {
    id: "evt_night_market",
    title: "🍗 夜市刮刮樂大奇遇",
    desc: "逛夜市時吃完大雞排，看見彩券行老闆正在叫賣最新款「亨旺彩券」，似乎冥冥中有聲音在召喚你...",
    choices: [
      {
        text: "🅰️ 豪擲 NT$1,000 刮一張試試手氣！",
        check: "charisma",
        successVal: 48,
        winMsg: "金光閃閃！竟然刮中了三獎 NT$ 15,000！全夜市都在圍觀亨哥！",
        winEffect: { money: 14000, charisma: 5, fame: 5 },
        failMsg: "可惜只中了「感謝惠顧」，但雞排依然很香！",
        failEffect: { money: -1000, energy: 10 }
      },
      {
        text: "🅱️ 幫旁邊猶豫的小情侶選一張",
        winMsg: "你隨手一指，小情侶中了頭獎！他們激動得非要分你紅包紅利！",
        winEffect: { money: 3000, fame: 6, charisma: 6 }
      },
      {
        text: "🅲 買了一袋甘草芭樂邊吃邊看別人刮",
        winMsg: "人間清醒！既省了錢又看了熱鬧，心情格外愉悅。",
        winEffect: { money: -100, energy: 15 }
      }
    ]
  }
];

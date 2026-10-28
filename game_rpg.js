/**
 * WU GUOHENG SIMULATOR - RPG LIFE ENGINE (game_rpg.js)
 * Manages player status, daily turns, choices, events, and endings.
 */

const GameRPG = (function () {
  // State
  let state = {
    day: 1,
    maxDays: 30,
    timeIndex: 0, // 0: 上午, 1: 下午, 2: 晚上
    times: ["上午 09:00", "下午 14:00", "晚上 20:00"],
    money: 10000,
    energy: 100,
    maxEnergy: 100,
    iq: 50,
    charisma: 50,
    fame: 10,
    // Counters for achievements/endings
    gymCount: 0,
    hotpotCount: 0,
    socialCount: 0,
    cryptoCount: 0,
    slackCount: 0,
    pokeCount: 0,
    unlockedEndings: [],
    unlockedAchievements: []
  };

  const STORAGE_KEY = "WU_GUOHENG_SIM_SAVE_V2";

  function saveGame() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        unlockedEndings: state.unlockedEndings,
        unlockedAchievements: state.unlockedAchievements
      }));
    } catch (e) {}
  }

  function loadGame() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.unlockedEndings) state.unlockedEndings = parsed.unlockedEndings;
        if (parsed.unlockedAchievements) state.unlockedAchievements = parsed.unlockedAchievements;
      }
    } catch (e) {}
  }

  function updateUI() {
    // Nav quick stats
    const navMoney = document.getElementById("nav-stat-money");
    const navEnergy = document.getElementById("nav-stat-energy");
    const navDay = document.getElementById("nav-stat-day");
    if (navMoney) navMoney.innerText = "$" + state.money.toLocaleString();
    if (navEnergy) navEnergy.innerText = `${Math.max(0, state.energy)}/${state.maxEnergy}`;
    if (navDay) navDay.innerText = `第 ${state.day} 天`;

    // RPG Dashboard Stats
    const valMoney = document.getElementById("val-money");
    const valEnergy = document.getElementById("val-energy");
    const valIq = document.getElementById("val-iq");
    const valCharisma = document.getElementById("val-charisma");
    const valFame = document.getElementById("val-fame");

    if (valMoney) valMoney.innerText = "NT$ " + state.money.toLocaleString();
    if (valEnergy) valEnergy.innerText = `${Math.max(0, state.energy)} / ${state.maxEnergy}`;
    if (valIq) valIq.innerText = `${state.iq} (${getIqTitle(state.iq)})`;
    if (valCharisma) valCharisma.innerText = `${state.charisma} (${getCharismaTitle(state.charisma)})`;
    if (valFame) valFame.innerText = `${state.fame} (${getFameTitle(state.fame)})`;

    // Progress bars
    const barMoney = document.getElementById("bar-money");
    const barEnergy = document.getElementById("bar-energy");
    const barIq = document.getElementById("bar-iq");
    const barCharisma = document.getElementById("bar-charisma");
    const barFame = document.getElementById("bar-fame");

    if (barMoney) barMoney.style.width = Math.min(100, Math.max(5, (state.money / 300000) * 100)) + "%";
    if (barEnergy) barEnergy.style.width = Math.min(100, Math.max(0, (state.energy / state.maxEnergy) * 100)) + "%";
    if (barIq) barIq.style.width = Math.min(100, state.iq) + "%";
    if (barCharisma) barCharisma.style.width = Math.min(100, state.charisma) + "%";
    if (barFame) barFame.style.width = Math.min(100, state.fame) + "%";

    // Round Day & Time Pills
    const dayPill = document.getElementById("display-day-pill");
    const timePill = document.getElementById("display-time-pill");
    if (dayPill) dayPill.innerText = `第 ${state.day} / ${state.maxDays} 天`;
    if (timePill) timePill.innerText = state.times[state.timeIndex];

    // Character Alias Title & Accessories
    updateAvatarAura();
    checkAllAchievements();
  }

  function getIqTitle(v) {
    if (v >= 90) return "通曉宇宙";
    if (v >= 75) return "深謀遠慮";
    if (v >= 60) return "聰慧敏銳";
    return "平平無奇";
  }

  function getCharismaTitle(v) {
    if (v >= 90) return "摸魚真仙";
    if (v >= 75) return "八面玲瓏";
    if (v >= 60) return "幽默瀟灑";
    return "初窺門徑";
  }

  function getFameTitle(v) {
    if (v >= 80) return "名震寰宇";
    if (v >= 50) return "職場明星";
    if (v >= 30) return "小有名氣";
    return "初出茅廬";
  }

  function updateAvatarAura() {
    const moodBadge = document.getElementById("char-mood-badge");
    const charTitle = document.getElementById("char-title");
    const glasses = document.getElementById("char-glasses");
    const crown = document.getElementById("char-crown");
    const laser = document.getElementById("char-laser");
    const charPhoto = document.getElementById("char-avatar") || document.getElementById("char-photo");

    if (state.energy <= 20) {
      if (moodBadge) moodBadge.innerText = "😫 爆肝虛脫";
      if (charPhoto) charPhoto.style.filter = "grayscale(50%) hue-rotate(320deg)";
    } else if (state.money >= 100000) {
      if (moodBadge) moodBadge.innerText = "💰 暴富霸總";
      if (charPhoto) charPhoto.style.filter = "contrast(115%) brightness(110%)";
    } else if (state.charisma >= 75) {
      if (moodBadge) moodBadge.innerText = "😎 萬人迷真仙";
      if (charPhoto) charPhoto.style.filter = "none";
    } else {
      if (moodBadge) moodBadge.innerText = "✨ 精神抖擻";
      if (charPhoto) charPhoto.style.filter = "none";
    }

    // Dynamic Title
    if (charTitle) {
      if (state.money >= 200000) charTitle.innerText = "【財富巨擘】";
      else if (state.charisma >= 80) charTitle.innerText = "【摸魚大師】";
      else if (state.iq >= 80) charTitle.innerText = "【首席智囊】";
      else if (state.fame >= 50) charTitle.innerText = "【職場風雲人物】";
      else charTitle.innerText = "【職場新星】";
    }

    // Accessories overlay
    if (glasses) {
      if (state.charisma >= 70 || state.money >= 80000) glasses.classList.add("active");
      else glasses.classList.remove("active");
    }
    if (crown) {
      if (state.fame >= 60 || state.money >= 200000) crown.classList.add("active");
      else crown.classList.remove("active");
    }
    if (laser) {
      if (state.iq >= 85) laser.classList.add("active");
      else laser.classList.remove("active");
    }
  }

  function addLog(text, type = "normal") {
    const logBox = document.getElementById("rpg-log-box");
    if (!logBox) return;

    const entry = document.createElement("div");
    entry.className = `log-entry log-${type}`;
    entry.innerHTML = `<span class="log-time">[第 ${state.day} 天 ${state.times[state.timeIndex]}]</span> ${text}`;
    logBox.insertBefore(entry, logBox.firstChild);

    // Keep max 50 entries
    while (logBox.children.length > 50) {
      logBox.removeChild(logBox.lastChild);
    }
  }

  function setDialogue(text) {
    const d = document.getElementById("char-dialogue");
    if (d) {
      d.innerText = `「${text}」`;
      d.parentElement.style.transform = "scale(1.05)";
      setTimeout(() => {
        d.parentElement.style.transform = "scale(1)";
      }, 200);
    }
  }

  function advanceTimeSlot() {
    state.timeIndex++;
    if (state.timeIndex >= state.times.length) {
      nextDay();
    } else {
      updateUI();
      // Chance of random event on slot advance
      if (Math.random() < 0.35) {
        triggerRandomEvent();
      }
    }
  }

  function nextDay() {
    state.day++;
    state.timeIndex = 0;

    // Daily recovery and small life cost
    state.energy = Math.min(state.maxEnergy, state.energy + 40);
    const livingCost = 350;
    state.money -= livingCost;

    SoundEngine.playBoing();
    addLog(`新的一天開始了！早起打卡，扣除日常伙食與交通開銷 NT$${livingCost}。`, "good");

    if (state.day > state.maxDays) {
      concludeGame();
      return;
    }

    updateUI();
    // High chance of event at morning
    if (Math.random() < 0.5) {
      triggerRandomEvent();
    }
  }

  function performAction(actionId) {
    SoundEngine.playClick();

    switch (actionId) {
      case "work_pro":
        if (state.energy < 25) {
          alert("⚡ 精力不足！亨哥需要稍微摸魚或休息補充體力！");
          return;
        }
        state.energy -= 25;
        state.money += 4500;
        state.iq += 3;
        addLog("認真撰寫了一份驚豔四座的專案提案，獲得公司表彰與獎金 NT$4,500！", "good");
        setDialogue("提案搞定！這波實力在線，老闆都得給我鼓掌！");
        SoundEngine.playCoin();
        break;

      case "work_slack":
        state.energy = Math.min(state.maxEnergy, state.energy + 20);
        state.charisma += 4;
        state.money += 800; // paid poop
        state.slackCount++;
        addLog("在洗手間隔間享受了 40 分鐘的極致帶薪摸魚，體力大幅回復，摸魚力+4！", "good");
        setDialogue("工作可以摸，但工資不能少！這就是帶薪摸魚的美學。");
        SoundEngine.playBoing();
        unlockAchievement("first_slack");
        if (state.charisma >= 85) unlockAchievement("slack_god");
        break;

      case "work_pretend":
        if (state.energy < 5) {
          alert("⚡ 精力耗盡了！");
          return;
        }
        state.energy -= 5;
        state.charisma += 3;
        state.fame += 2;
        addLog("雙手在機械鍵盤上瘋狂敲擊，螢幕放著黑客終端，其實正在看八卦！深藏不露。", "highlight");
        setDialogue("看著很忙，其實很閒，這叫職場量子疊加態！");
        SoundEngine.playLaser();
        break;

      case "invest_crypto":
        if (state.energy < 10) {
          alert("⚡ 精力不足！");
          return;
        }
        state.energy -= 10;
        state.cryptoCount++;
        const isWin = Math.random() > 0.45;
        if (isWin) {
          const profit = Math.floor(Math.random() * 16000) + 4000;
          state.money += profit;
          state.iq += 2;
          addLog(`🔥 亨幣暴拉！神操作精準高拋低吸，爆賺 NT$${profit.toLocaleString()}！`, "good");
          setDialogue("我早就說過，相信亨幣，住上大別墅！");
          SoundEngine.playCoin();
          if (profit >= 10000) unlockAchievement("crypto_master");
        } else {
          const loss = Math.floor(Math.random() * 10000) + 3000;
          state.money -= loss;
          addLog(`📉 亨幣突遭巨鯨砸盤插針，虧損 NT$${loss.toLocaleString()}，天台風好大...`, "danger");
          setDialogue("跌了算什麼？只要我不賣，就永遠沒有虧！");
          SoundEngine.playBuzzer();
        }
        break;

      case "buy_lottery":
        if (state.money < 500) {
          alert("💰 錢包空空，連 NT$500 刮刮樂都買不起了！");
          return;
        }
        state.money -= 500;
        const roll = Math.random();
        if (roll < 0.05) {
          state.money += 20000;
          addLog("🎉 驚天大爆發！刮出特等獎 NT$20,000！全店彩民為亨哥歡呼！", "good");
          setDialogue("天選之子降臨！今天全場消費由亨哥買單！");
          SoundEngine.playVictory();
        } else if (roll < 0.35) {
          state.money += 2500;
          addLog("🎊 手氣不錯！刮中小獎 NT$2,500！小賺一波！", "good");
          SoundEngine.playCoin();
        } else {
          addLog("刮出「銘謝惠顧」，為公益事業貢獻了 NT$500。", "warn");
          SoundEngine.playBuzzer();
        }
        break;

      case "gym_workout":
        if (state.energy < 15) {
          alert("⚡ 太累了，硬拉會閃到腰的！");
          return;
        }
        state.energy -= 15;
        state.maxEnergy += 3;
        state.charisma += 5;
        state.gymCount++;
        addLog(`在健身房完成了 5 組大重量硬拉！體力上限永久 +3 (目前 ${state.maxEnergy})，霸氣外露！`, "good");
        setDialogue("強健的體魄，是打持久戰與摸魚的堅實基礎！");
        SoundEngine.playLevelUp();
        if (state.gymCount >= 5) unlockAchievement("gym_rat");
        break;

      case "eat_hotpot":
        if (state.money < 1200) {
          alert("💰 錢不夠吃豪華和牛火鍋了，先去賺錢吧！");
          return;
        }
        state.money -= 1200;
        state.energy = Math.min(state.maxEnergy, state.energy + 45);
        state.hotpotCount++;
        addLog("大啖頂級麻辣和牛火鍋與冰鎮烏龍茶，精力瞬間拉滿 +45！人生值得！", "good");
        setDialogue("熱氣騰騰的火鍋，才是靈魂最好的解藥！");
        SoundEngine.playBoing();
        if (state.hotpotCount >= 3) unlockAchievement("hotpot_addict");
        break;

      case "social_party":
        if (state.money < 2500) {
          alert("💰 囊中羞澀，組不起熱炒局了！");
          return;
        }
        state.money -= 2500;
        state.charisma += 8;
        state.fame += 6;
        state.socialCount++;
        addLog("組局熱炒店請客喝酒！滿座高朋，稱兄道弟，亨哥名號威震四方！", "good");
        setDialogue("江湖不是打打殺殺，江湖是人情世故！乾杯！");
        SoundEngine.playVictory();
        if (state.socialCount >= 3) unlockAchievement("social_king");
        break;

      case "study_philosophy":
        if (state.energy < 15) {
          alert("⚡ 腦力透支，看書會睡著的！");
          return;
        }
        state.energy -= 15;
        state.iq += 8;
        addLog("深夜翻閱量子力學與先秦哲學，悟出「大巧若拙、大智若魚」，智謀+8！", "highlight");
        setDialogue("肉體困於工位，靈魂已漫步於仙女座星系。");
        SoundEngine.playLevelUp();
        if (state.iq >= 80) unlockAchievement("bookworm");
        break;

      case "rest_deep":
        state.energy = state.maxEnergy;
        addLog("戴上眼罩美美地睡了一場高質量大覺，精力完全回滿 100%！", "good");
        setDialogue("睡覺是世上成本最低、收益最高的自我投資！");
        SoundEngine.playBoing();
        break;
    }

    advanceTimeSlot();
  }

  function triggerRandomEvent() {
    const evt = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
    if (!evt) return;

    const modal = document.getElementById("event-modal");
    const title = document.getElementById("event-title");
    const desc = document.getElementById("event-description");
    const choicesBox = document.getElementById("event-choices-box");

    if (!modal || !title || !desc || !choicesBox) return;

    title.innerText = evt.title;
    desc.innerText = evt.desc;
    choicesBox.innerHTML = "";

    evt.choices.forEach(ch => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.innerHTML = `<span>${ch.text}</span> <span>👉</span>`;
      btn.onclick = () => {
        modal.classList.remove("active");
        handleEventChoice(ch);
      };
      choicesBox.appendChild(btn);
    });

    modal.classList.add("active");
    SoundEngine.playLaser();
  }

  function handleEventChoice(choice) {
    let success = true;
    if (choice.check) {
      const playerVal = state[choice.check] || 50;
      const roll = Math.random() * 20 - 10;
      success = (playerVal + roll) >= choice.successVal;
    }

    const msg = success ? choice.winMsg : choice.failMsg;
    const effect = success ? choice.winEffect : choice.failEffect;

    if (effect) {
      if (effect.money) state.money += effect.money;
      if (effect.energy) state.energy = Math.min(state.maxEnergy, Math.max(0, state.energy + effect.energy));
      if (effect.iq) state.iq = Math.max(0, state.iq + effect.iq);
      if (effect.charisma) state.charisma = Math.max(0, state.charisma + effect.charisma);
      if (effect.fame) state.fame = Math.max(0, state.fame + effect.fame);
    }

    addLog(msg, success ? "good" : "danger");
    setDialogue(msg.substring(0, 30) + "...");
    if (success) SoundEngine.playLevelUp();
    else SoundEngine.playBuzzer();

    updateUI();
  }

  function checkAllAchievements() {
    if (state.money >= 50000) unlockAchievement("rich_starter");
    if (state.money >= 200000) unlockAchievement("millionaire");
    if (state.fame >= 60) unlockAchievement("high_iq_fame");
  }

  function unlockAchievement(id) {
    if (state.unlockedAchievements.includes(id)) return;
    state.unlockedAchievements.push(id);
    saveGame();

    const ach = ACHIEVEMENTS_DATA.find(a => a.id === id);
    if (ach) {
      ach.unlocked = true;
      SoundEngine.playVictory();
      SoundEngine.showEffect(`🏆 解鎖成就：【${ach.name}】！`);
      renderAchievements();
    }
  }

  function concludeGame() {
    unlockAchievement("survivor_30");

    // Evaluate Ending
    let matchedEnding = null;

    if (state.money >= 300000) {
      matchedEnding = ENDINGS_DATA.find(e => e.id === "end_billionaire");
      unlockAchievement("true_legend");
    } else if (state.charisma >= 85) {
      matchedEnding = ENDINGS_DATA.find(e => e.id === "end_slack_god");
    } else if (state.iq >= 85) {
      matchedEnding = ENDINGS_DATA.find(e => e.id === "end_philosopher");
    } else if (state.fame >= 60 && state.charisma >= 70) {
      matchedEnding = ENDINGS_DATA.find(e => e.id === "end_social_tycoon");
    } else if (state.gymCount >= 5) {
      matchedEnding = ENDINGS_DATA.find(e => e.id === "end_fitness_god");
    } else if (state.money >= 150000 && state.cryptoCount >= 4) {
      matchedEnding = ENDINGS_DATA.find(e => e.id === "end_crypto_king");
    } else if (state.hotpotCount >= 5) {
      matchedEnding = ENDINGS_DATA.find(e => e.id === "end_food_master");
    } else if (state.money <= 0) {
      matchedEnding = ENDINGS_DATA.find(e => e.id === "end_broke_restart");
    } else {
      matchedEnding = ENDINGS_DATA.find(e => e.id === "end_happy_worker");
    }

    if (!state.unlockedEndings.includes(matchedEnding.id)) {
      state.unlockedEndings.push(matchedEnding.id);
      saveGame();
    }

    if (state.unlockedEndings.length >= 3) {
      unlockAchievement("ending_collector");
    }

    // Show ending modal
    const modal = document.getElementById("ending-modal");
    if (!modal) return;

    document.getElementById("ending-rank").innerText = `🏆 ${matchedEnding.rank} 級傳奇結算`;
    document.getElementById("ending-title").innerText = matchedEnding.title;
    document.getElementById("ending-subtitle").innerText = matchedEnding.desc;
    document.getElementById("ending-comment").innerText = matchedEnding.comment;

    const statsBox = document.getElementById("ending-stats-box");
    if (statsBox) {
      statsBox.innerHTML = `
        <div class="end-stat-col">
          <span class="end-stat-title">最終資產</span>
          <span class="end-stat-num">$${state.money.toLocaleString()}</span>
        </div>
        <div class="end-stat-col">
          <span class="end-stat-title">智謀格局</span>
          <span class="end-stat-num">${state.iq}</span>
        </div>
        <div class="end-stat-col">
          <span class="end-stat-title">摸魚魅力</span>
          <span class="end-stat-num">${state.charisma}</span>
        </div>
        <div class="end-stat-col">
          <span class="end-stat-title">傳奇聲望</span>
          <span class="end-stat-num">${state.fame}</span>
        </div>
      `;
    }

    modal.classList.add("active");
    SoundEngine.playVictory();
    renderEndingsGallery();
  }

  function restartGame() {
    state.day = 1;
    state.timeIndex = 0;
    // Inherit bonus starting cash based on unlocked endings
    const bonus = state.unlockedEndings.length * 5000;
    state.money = 10000 + bonus;
    state.energy = 100;
    state.maxEnergy = 100;
    state.iq = 50;
    state.charisma = 50;
    state.fame = 10;
    state.gymCount = 0;
    state.hotpotCount = 0;
    state.socialCount = 0;
    state.cryptoCount = 0;
    state.slackCount = 0;
    state.pokeCount = 0;

    const modal = document.getElementById("ending-modal");
    if (modal) modal.classList.remove("active");

    const logBox = document.getElementById("rpg-log-box");
    if (logBox) logBox.innerHTML = "";

    addLog(`【傳奇重生】吳國亨開啟了新一輪模擬！繼承天賦獲得啟動紅利 NT$${bonus.toLocaleString()}！`, "highlight");
    setDialogue("新的人生，新的傳奇！這一次我要拿滿所有成就！");
    updateUI();
  }

  function pokeGuoheng() {
    state.pokeCount++;
    SoundEngine.playBoing();
    const avatar = document.getElementById("char-avatar-container");
    if (avatar) {
      avatar.style.transform = "scale(0.85) rotate(-5deg)";
      setTimeout(() => {
        avatar.style.transform = "scale(1) rotate(0deg)";
      }, 150);
    }
    const reactions = [
      "哎唷！戳我幹嘛？我正摸魚呢！",
      "不要迷戀哥，哥只是個傳說。",
      "再戳就扣你這個月的年終獎金喔！",
      "被你戳得靈光一閃，精力+2！",
      "帥氣的臉龐是不能隨便亂摸的！"
    ];
    setDialogue(reactions[state.pokeCount % reactions.length]);
    state.energy = Math.min(state.maxEnergy, state.energy + 2);
    updateUI();
    if (state.pokeCount >= 10) unlockAchievement("poke_lover");
  }

  function complimentGuoheng() {
    SoundEngine.playLevelUp();
    state.charisma += 2;
    state.energy = Math.min(state.maxEnergy, state.energy + 5);
    setDialogue("會說話就多說點！亨哥的帥氣全公司有目共睹！");
    addLog("誇讚亨哥器宇軒昂，亨哥心情大悅，魅力+2，精力+5！", "good");
    updateUI();
  }

  function renderAchievements() {
    const container = document.getElementById("achievements-container");
    const countEl = document.getElementById("achieve-count");
    const textEl = document.getElementById("achieve-text");
    const barEl = document.getElementById("achieve-bar");

    if (!container) return;

    let unlockedCount = 0;
    container.innerHTML = "";

    ACHIEVEMENTS_DATA.forEach(ach => {
      const isUnlocked = state.unlockedAchievements.includes(ach.id);
      if (isUnlocked) unlockedCount++;

      const card = document.createElement("div");
      card.className = `achieve-card ${isUnlocked ? "unlocked" : ""}`;
      card.innerHTML = `
        <div class="achieve-icon">${ach.icon}</div>
        <div class="achieve-info">
          <h4>${ach.name} ${isUnlocked ? "✅" : "🔒"}</h4>
          <p>${ach.desc}</p>
        </div>
      `;
      container.appendChild(card);
    });

    if (countEl) countEl.innerText = unlockedCount;
    if (textEl) textEl.innerText = `${unlockedCount} / ${ACHIEVEMENTS_DATA.length}`;
    if (barEl) barEl.style.width = `${(unlockedCount / ACHIEVEMENTS_DATA.length) * 100}%`;
  }

  function renderEndingsGallery() {
    const container = document.getElementById("endings-container");
    if (!container) return;

    container.innerHTML = "";
    ENDINGS_DATA.forEach(end => {
      const isUnlocked = state.unlockedEndings.includes(end.id);
      const card = document.createElement("div");
      card.className = `ending-badge-card ${isUnlocked ? "unlocked" : ""}`;
      card.innerHTML = `
        <div class="end-card-title">${end.badge} ${end.title} [${end.rank}]</div>
        <div class="end-card-desc">${isUnlocked ? end.desc : "❓ 達成特定條件解鎖此傳奇結局"}</div>
      `;
      container.appendChild(card);
    });
  }

  function addMoneyFromArcade(amt) {
    state.money += amt;
    addLog(`🎮 街機通關獎勵！成功將街機累積的 NT$${amt.toLocaleString()} 存入個人帳戶！`, "good");
    SoundEngine.playVictory();
    updateUI();
  }

  function init() {
    loadGame();
    updateUI();
    renderAchievements();
    renderEndingsGallery();

    // Event listeners
    const btnNext = document.getElementById("btn-next-day");
    if (btnNext) btnNext.onclick = () => nextDay();

    const btnPoke = document.getElementById("btn-poke-guoheng");
    if (btnPoke) btnPoke.onclick = pokeGuoheng;

    const btnComp = document.getElementById("btn-compliment-guoheng");
    if (btnComp) btnComp.onclick = complimentGuoheng;

    const btnRestart = document.getElementById("btn-restart-game");
    if (btnRestart) {
      btnRestart.onclick = () => {
        if (confirm("確定要重啟這段人生嗎？天賦與已解鎖圖鑑將完整保留！")) {
          restartGame();
        }
      };
    }

    const btnRestartEnding = document.getElementById("btn-restart-from-ending");
    if (btnRestartEnding) btnRestartEnding.onclick = restartGame;

    const btnShareEnding = document.getElementById("btn-share-ending");
    if (btnShareEnding) {
      btnShareEnding.onclick = () => {
        const modal = document.getElementById("ending-modal");
        if (modal) modal.classList.remove("active");
        // Switch to meme tab
        document.querySelector("[data-tab='tab-meme']").click();
      };
    }
  }

  return {
    init,
    performAction,
    addMoneyFromArcade,
    unlockAchievement,
    clearLog() {
      const logBox = document.getElementById("rpg-log-box");
      if (logBox) logBox.innerHTML = "";
    }
  };
})();

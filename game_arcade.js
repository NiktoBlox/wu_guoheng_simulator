/**
 * WU GUOHENG SIMULATOR - ARCADE ACTION GAME (game_arcade.js)
 * Dodge Overtime & Catch the Bonuses!
 */

const GameArcade = (function () {
  let canvas, ctx;
  let isRunning = false;
  let animationId = null;

  // Player State
  const player = {
    x: 270,
    y: 600,
    width: 68,
    height: 68,
    speed: 8,
    hp: 100,
    maxHp: 100,
    isFever: false,
    feverTimer: 0,
    speedBoostTimer: 0
  };

  // Game Metrics
  let score = 0;
  let highScore = 0;
  let combo = 0;
  let maxCombo = 0;
  let earnedMoney = 0;
  let items = [];
  let particles = [];
  let stars = [];
  let shakeTime = 0;
  let spawnTimer = 0;

  // Keyboard controls
  const keys = { left: false, right: false };

  // Avatar image
  const avatarImg = new Image();
  avatarImg.src = window.WU_GUOHENG_AVATAR || "assets/wu_guoheng.jpg";

  // Item Types
  const ITEM_TYPES = [
    { type: "coin", icon: "💰", points: 100, hp: 0, bad: false, weight: 40 },
    { type: "coffee", icon: "☕", points: 50, hp: 15, bad: false, weight: 20 },
    { type: "redpack", icon: "🧧", points: 500, hp: 5, bad: false, weight: 10 },
    { type: "koi", icon: "🌟", points: 300, hp: 20, bad: false, weight: 5 },
    { type: "overtime", icon: "📋", points: 0, hp: -25, bad: true, weight: 25 },
    { type: "bug", icon: "🐛", points: 0, hp: -35, bad: true, weight: 15 }
  ];

  function init() {
    canvas = document.getElementById("arcade-canvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");

    // Load Highscore
    try {
      highScore = parseInt(localStorage.getItem("WU_GUOHENG_ARCADE_HIGH") || "0", 10);
    } catch (e) {}
    updateHUD();

    // Init background stars
    stars = [];
    for (let i = 0; i < 40; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 1.5 + 0.5
      });
    }

    // Controls
    window.addEventListener("keydown", (e) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = true;
      if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = true;
    });

    window.addEventListener("keyup", (e) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = false;
      if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = false;
    });

    // Mouse & Touch Controls on Canvas
    function handlePointerMove(clientX) {
      if (!isRunning) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const mouseX = (clientX - rect.left) * scaleX;
      player.x = Math.max(0, Math.min(canvas.width - player.width, mouseX - player.width / 2));
    }

    canvas.addEventListener("mousemove", (e) => handlePointerMove(e.clientX));
    canvas.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX);
      }
      e.preventDefault();
    }, { passive: false });

    // Buttons
    const btnStart = document.getElementById("btn-start-arcade");
    const overlayBtn = document.getElementById("overlay-btn-action");
    if (btnStart) btnStart.onclick = startGame;
    if (overlayBtn) overlayBtn.onclick = startGame;

    const btnTransfer = document.getElementById("btn-transfer-arcade");
    if (btnTransfer) {
      btnTransfer.onclick = () => {
        if (earnedMoney > 0) {
          GameRPG.addMoneyFromArcade(earnedMoney);
          earnedMoney = 0;
          btnTransfer.disabled = true;
          updateHUD();
        }
      };
    }
  }

  function startGame() {
    isRunning = true;
    score = 0;
    combo = 0;
    maxCombo = 0;
    player.hp = 100;
    player.x = (canvas.width - player.width) / 2;
    player.isFever = false;
    player.feverTimer = 0;
    player.speedBoostTimer = 0;
    items = [];
    particles = [];

    const overlay = document.getElementById("arcade-overlay");
    if (overlay) overlay.classList.add("hidden");

    SoundEngine.playVictory();
    updateHUD();

    if (animationId) cancelAnimationFrame(animationId);
    lastTime = performance.now();
    loop();
  }

  function gameOver() {
    isRunning = false;
    SoundEngine.playBuzzer();

    // Money calculation
    const sessionEarned = Math.floor(score / 2);
    earnedMoney += sessionEarned;

    if (score > highScore) {
      highScore = score;
      try {
        localStorage.setItem("WU_GUOHENG_ARCADE_HIGH", highScore.toString());
      } catch (e) {}
    }

    // Achievements check
    if (score >= 500) GameRPG.unlockAchievement("arcade_500");
    if (score >= 2000) GameRPG.unlockAchievement("arcade_2000");
    if (maxCombo >= 15) GameRPG.unlockAchievement("combo_king");

    updateHUD();

    const overlay = document.getElementById("arcade-overlay");
    const title = document.getElementById("overlay-title");
    const desc = document.getElementById("overlay-desc");
    const btn = document.getElementById("overlay-btn-action");

    if (overlay && title && desc && btn) {
      title.innerText = "💥 遊戲結束！加班單淹沒了工位！";
      desc.innerHTML = `
        本局得分：<b style="color:var(--accent-cyan); font-size:1.2rem;">${score}</b> 分<br>
        最高連擊：<b style="color:var(--accent-pink);">${maxCombo}</b> Combo<br>
        轉化獎勵：<b style="color:var(--accent-gold);">+NT$ ${sessionEarned.toLocaleString()}</b>
      `;
      btn.innerText = "🔄 再次挑戰";
      overlay.classList.remove("hidden");
    }

    const btnTransfer = document.getElementById("btn-transfer-arcade");
    if (btnTransfer && earnedMoney > 0) {
      btnTransfer.disabled = false;
    }
  }

  function spawnItem() {
    // Pick weighted item
    const totalWeight = ITEM_TYPES.reduce((acc, cur) => acc + cur.weight, 0);
    let rand = Math.random() * totalWeight;
    let chosen = ITEM_TYPES[0];

    for (const item of ITEM_TYPES) {
      if (rand < item.weight) {
        chosen = item;
        break;
      }
      rand -= item.weight;
    }

    // If Fever mode, force spawn good coins / koi
    if (player.isFever && chosen.bad) {
      chosen = ITEM_TYPES[0]; // convert to coin
    }

    items.push({
      x: Math.random() * (canvas.width - 40) + 10,
      y: -40,
      size: 36,
      speed: Math.random() * 2 + (player.isFever ? 4.5 : 2.5),
      type: chosen.type,
      icon: chosen.icon,
      points: chosen.points,
      hp: chosen.hp,
      bad: chosen.bad,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.08
    });
  }

  function addParticles(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 1,
        color: color,
        size: Math.random() * 4 + 2
      });
    }
  }

  let lastTime = 0;
  function loop() {
    if (!isRunning) return;

    update();
    render();

    animationId = requestAnimationFrame(loop);
  }

  function update() {
    // Player speed boost
    let curSpeed = player.speed;
    if (player.speedBoostTimer > 0) {
      player.speedBoostTimer--;
      curSpeed *= 1.4;
    }

    // Keyboard movement
    if (keys.left) player.x -= curSpeed;
    if (keys.right) player.x += curSpeed;
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

    // Fever timer
    const feverBadge = document.getElementById("arcade-fever-badge");
    if (player.isFever) {
      player.feverTimer--;
      if (feverBadge) feverBadge.style.display = "block";
      if (player.feverTimer <= 0) {
        player.isFever = false;
        if (feverBadge) feverBadge.style.display = "none";
      }
    } else {
      if (feverBadge) feverBadge.style.display = "none";
    }

    // Spawn items
    spawnTimer++;
    const interval = player.isFever ? 15 : 30;
    if (spawnTimer >= interval) {
      spawnTimer = 0;
      spawnItem();
    }

    // Update stars background
    stars.forEach(st => {
      st.y += st.speed * (player.isFever ? 2.5 : 1);
      if (st.y > canvas.height) {
        st.y = 0;
        st.x = Math.random() * canvas.width;
      }
    });

    // Update items
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      it.y += it.speed;
      it.rot += it.rotSpeed;

      // Collision detection with player
      if (
        it.x + it.size > player.x + 8 &&
        it.x < player.x + player.width - 8 &&
        it.y + it.size > player.y + 8 &&
        it.y < player.y + player.height - 8
      ) {
        handleCollision(it);
        items.splice(i, 1);
        continue;
      }

      // Out of bounds
      if (it.y > canvas.height + 40) {
        items.splice(i, 1);
      }
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.03;
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }

    if (shakeTime > 0) shakeTime--;
  }

  function handleCollision(item) {
    if (!item.bad) {
      // Good item
      combo++;
      if (combo > maxCombo) maxCombo = combo;

      const comboMultiplier = Math.min(4, 1 + Math.floor(combo / 5) * 0.5);
      const earned = Math.floor(item.points * (player.isFever ? 2 : 1) * comboMultiplier);
      score += earned;

      if (item.hp > 0) {
        player.hp = Math.min(player.maxHp, player.hp + item.hp);
      }

      if (item.type === "coin") {
        SoundEngine.playCoin();
        addParticles(item.x, item.y, "#ffbe0b", 8);
      } else if (item.type === "coffee") {
        player.speedBoostTimer = 180; // 3 sec boost
        SoundEngine.playBoing();
        addParticles(item.x, item.y, "#05ffa1", 10);
      } else if (item.type === "redpack") {
        SoundEngine.playVictory();
        addParticles(item.x, item.y, "#ff2a85", 14);
      } else if (item.type === "koi") {
        player.isFever = true;
        player.feverTimer = 420; // 7 seconds
        SoundEngine.playLevelUp();
        GameRPG.unlockAchievement("fever_rush");
        addParticles(item.x, item.y, "#00f0ff", 20);
      }
    } else {
      // Bad item
      if (player.isFever) {
        // Invincible during fever!
        score += 150;
        SoundEngine.playSlap();
        addParticles(item.x, item.y, "#ffffff", 12);
        return;
      }

      combo = 0;
      player.hp += item.hp;
      shakeTime = 12;
      SoundEngine.playDamage();
      addParticles(item.x, item.y, "#ff2a85", 15);

      if (player.hp <= 0) {
        player.hp = 0;
        gameOver();
      }
    }

    updateHUD();
  }

  function render() {
    ctx.save();

    // Screen Shake effect
    if (shakeTime > 0) {
      const dx = (Math.random() - 0.5) * 12;
      const dy = (Math.random() - 0.5) * 12;
      ctx.translate(dx, dy);
    }

    // Clear
    ctx.fillStyle = player.isFever ? "#140c26" : "#070a14";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render stars
    stars.forEach(st => {
      ctx.fillStyle = player.isFever ? "#ff2a85" : "rgba(255, 255, 255, 0.4)";
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Render falling items
    ctx.font = "28px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    items.forEach(it => {
      ctx.save();
      ctx.translate(it.x + it.size / 2, it.y + it.size / 2);
      ctx.rotate(it.rot);
      ctx.fillText(it.icon, 0, 0);
      ctx.restore();
    });

    // Render particles
    particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Render Player (吳國亨 Avatar)
    renderPlayer();

    ctx.restore();
  }

  function renderPlayer() {
    ctx.save();
    const px = player.x;
    const py = player.y;
    const pw = player.width;
    const ph = player.height;

    // Outer Glow Ring
    ctx.beginPath();
    ctx.arc(px + pw / 2, py + ph / 2, pw / 2 + 4, 0, Math.PI * 2);
    ctx.strokeStyle = player.isFever ? "#ffbe0b" : "#00f0ff";
    ctx.lineWidth = 4;
    ctx.shadowColor = player.isFever ? "#ff2a85" : "#00f0ff";
    ctx.shadowBlur = player.isFever ? 20 : 12;
    ctx.stroke();

    // Clip circular avatar
    ctx.save();
    ctx.beginPath();
    ctx.arc(px + pw / 2, py + ph / 2, pw / 2, 0, Math.PI * 2);
    ctx.clip();

    if (avatarImg.complete && avatarImg.naturalWidth > 0) {
      ctx.drawImage(avatarImg, px, py, pw, ph);
    } else {
      ctx.fillStyle = "#ffbe0b";
      ctx.fillRect(px, py, pw, ph);
      ctx.fillStyle = "#000";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("亨", px + pw / 2, py + ph / 2 + 7);
    }
    ctx.restore();

    // Fever Crown or Thug Glasses on player
    if (player.isFever) {
      ctx.font = "24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("👑", px + pw / 2, py - 6);
    }

    ctx.restore();
  }

  function updateHUD() {
    const curScoreEl = document.getElementById("arcade-current-score");
    const highScoreEl = document.getElementById("arcade-high-score");
    const comboEl = document.getElementById("arcade-combo");
    const earnedEl = document.getElementById("arcade-earned-money");
    const hpFill = document.getElementById("arcade-hp-fill");
    const hpText = document.getElementById("arcade-hp-text");

    if (curScoreEl) curScoreEl.innerText = score;
    if (highScoreEl) highScoreEl.innerText = highScore;
    if (comboEl) comboEl.innerText = `x${combo}`;
    if (earnedEl) earnedEl.innerText = `+$${earnedMoney.toLocaleString()}`;

    if (hpFill) hpFill.style.width = `${Math.max(0, (player.hp / player.maxHp) * 100)}%`;
    if (hpText) hpText.innerText = `${Math.max(0, player.hp)} / ${player.maxHp}`;
  }

  return {
    init
  };
})();

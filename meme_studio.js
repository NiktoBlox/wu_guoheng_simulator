/**
 * WU GUOHENG SIMULATOR - MEME STUDIO & SOUNDBOARD (meme_studio.js)
 * High-definition Canvas meme generator & interactive soundboard.
 */

const MemeStudio = (function () {
  let canvas, ctx;
  const avatarImg = new Image();
  avatarImg.src = window.WU_GUOHENG_AVATAR || "assets/wu_guoheng.jpg";

  // Sticker States
  const accessories = {
    sunglasses: true,
    goldChain: false,
    crown: false,
    laserEyes: false,
    cigar: false,
    moneyRain: false
  };

  let soundClickCount = 0;

  const FUNNY_PUNCHLINES = [
    { top: "聽哥一句勸", bottom: "下班了別找我！" },
    { top: "上班摸魚千夫指", bottom: "準時下班萬人迷！" },
    { top: "你在教我做事？", bottom: "這波我很滿意！" },
    { top: "錢不錢的無所謂", bottom: "主要想給大腦散熱" },
    { top: "莫欺中年吳國亨", bottom: "明天亨幣翻十倍！" },
    { top: "只要心態夠佛", bottom: "全天下的Bug都與我無關" },
    { top: "我不是在發呆", bottom: "我是在進行深度量子運算" },
    { top: "工作可以摸", bottom: "工資不能少！" }
  ];

  function init() {
    canvas = document.getElementById("meme-canvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");

    avatarImg.onload = () => {
      renderMeme();
    };
    if (avatarImg.complete) {
      renderMeme();
    }

    // Text inputs
    const topInput = document.getElementById("meme-top-text");
    const bottomInput = document.getElementById("meme-bottom-text");
    if (topInput) topInput.oninput = renderMeme;
    if (bottomInput) bottomInput.oninput = renderMeme;

    // Sticker toggles
    const stickerButtons = document.querySelectorAll(".btn-sticker-toggle");
    stickerButtons.forEach(btn => {
      const accKey = btn.dataset.acc;
      if (accessories[accKey]) {
        btn.classList.add("active");
      }
      btn.onclick = () => {
        accessories[accKey] = !accessories[accKey];
        if (accessories[accKey]) btn.classList.add("active");
        else btn.classList.remove("active");
        SoundEngine.playClick();
        renderMeme();
      };
    });

    // Random quote button
    const btnRandom = document.getElementById("btn-random-meme-quote");
    if (btnRandom) {
      btnRandom.onclick = () => {
        const item = FUNNY_PUNCHLINES[Math.floor(Math.random() * FUNNY_PUNCHLINES.length)];
        if (topInput) topInput.value = item.top;
        if (bottomInput) bottomInput.value = item.bottom;
        SoundEngine.playBoing();
        renderMeme();
      };
    }

    // Export PNG
    const btnExport = document.getElementById("btn-export-meme");
    if (btnExport) {
      btnExport.onclick = exportMemeImage;
    }

    // Soundboard quote refresh
    const btnRefreshQuote = document.getElementById("btn-refresh-quote");
    if (btnRefreshQuote) {
      btnRefreshQuote.onclick = refreshDailyQuote;
    }
    refreshDailyQuote();

    // Track sound clicks for achievement
    const soundBtns = document.querySelectorAll(".sound-btn");
    soundBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        soundClickCount++;
        if (soundClickCount >= 15) {
          GameRPG.unlockAchievement("sound_master");
        }
      });
    });
  }

  function renderMeme() {
    if (!ctx) return;

    // 1. Clear background
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw 吳國亨 Image centered and cropped cleanly
    if (avatarImg.complete && avatarImg.naturalWidth > 0) {
      const imgRatio = avatarImg.naturalWidth / avatarImg.naturalHeight;
      let drawW = canvas.width;
      let drawH = canvas.height;
      let drawX = 0;
      let drawY = 0;

      if (imgRatio > 1) {
        drawW = canvas.height * imgRatio;
        drawX = -(drawW - canvas.width) / 2;
      } else {
        drawH = canvas.width / imgRatio;
        drawY = -(drawH - canvas.height) / 2;
      }

      ctx.drawImage(avatarImg, drawX, drawY, drawW, drawH);
    }

    // 3. Draw Accessories based on face location estimate
    // Standard coordinates on 600x600 canvas for the portrait
    const centerX = canvas.width / 2;
    const eyeY = 245;

    // Money Rain
    if (accessories.moneyRain) {
      ctx.font = "32px sans-serif";
      const icons = ["💸", "💰", "✨", "💎", "🪙"];
      for (let i = 0; i < 18; i++) {
        const x = (i * 73) % canvas.width;
        const y = (i * 97) % (canvas.height - 120) + 40;
        ctx.fillText(icons[i % icons.length], x, y);
      }
    }

    // Laser Eyes
    if (accessories.laserEyes) {
      ctx.save();
      ctx.strokeStyle = "#ff0055";
      ctx.lineWidth = 10;
      ctx.shadowColor = "#ff0000";
      ctx.shadowBlur = 25;

      // Left eye beam
      ctx.beginPath();
      ctx.moveTo(centerX - 38, eyeY);
      ctx.lineTo(0, eyeY + 120);
      ctx.stroke();

      // Right eye beam
      ctx.beginPath();
      ctx.moveTo(centerX + 38, eyeY);
      ctx.lineTo(canvas.width, eyeY + 120);
      ctx.stroke();

      // Glowing pupils
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(centerX - 38, eyeY, 8, 0, Math.PI * 2);
      ctx.arc(centerX + 38, eyeY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Sunglasses
    if (accessories.sunglasses) {
      ctx.save();
      const glassW = 200;
      const glassH = 50;
      const gx = centerX - glassW / 2;
      const gy = eyeY - 20;

      ctx.fillStyle = "#0a0a0a";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;

      // Left lens & Right lens
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(gx, gy, 85, glassH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.roundRect(gx + 115, gy, 85, glassH, 8);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillRect(gx, gy, 85, glassH);
        ctx.strokeRect(gx, gy, 85, glassH);

        ctx.fillRect(gx + 115, gy, 85, glassH);
        ctx.strokeRect(gx + 115, gy, 85, glassH);
      }

      // Bridge
      ctx.fillRect(gx + 80, gy + 14, 40, 8);

      // Thug life white glare pixels
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(gx + 15, gy + 8, 18, 6);
      ctx.fillRect(gx + 130, gy + 8, 18, 6);
      ctx.restore();
    }

    // Crown
    if (accessories.crown) {
      ctx.save();
      ctx.font = "110px sans-serif";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(255, 190, 11, 0.8)";
      ctx.shadowBlur = 20;
      ctx.fillText("👑", centerX, 140);
      ctx.restore();
    }

    // Gold Chain
    if (accessories.goldChain) {
      ctx.save();
      ctx.strokeStyle = "#ffbe0b";
      ctx.lineWidth = 14;
      ctx.shadowColor = "#e69d00";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.ellipse(centerX, 470, 120, 45, 0, 0, Math.PI);
      ctx.stroke();

      // Medallion
      ctx.fillStyle = "#ffbe0b";
      ctx.beginPath();
      ctx.arc(centerX, 520, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.font = "bold 24px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("亨", centerX, 522);
      ctx.restore();
    }

    // Cigar
    if (accessories.cigar) {
      ctx.save();
      ctx.translate(centerX + 35, 345);
      ctx.rotate(0.2);
      ctx.fillStyle = "#8b4513";
      ctx.fillRect(0, 0, 55, 14);
      ctx.fillStyle = "#ffbe0b";
      ctx.fillRect(10, 0, 8, 14);
      // Burning tip
      ctx.fillStyle = "#ff3b00";
      ctx.shadowColor = "#ff3b00";
      ctx.shadowBlur = 10;
      ctx.fillRect(52, 0, 7, 14);
      // Smoke
      ctx.font = "24px sans-serif";
      ctx.fillText("💨", 58, -6);
      ctx.restore();
    }

    // 4. Draw Meme Impact Text (Top & Bottom)
    const topInput = document.getElementById("meme-top-text");
    const bottomInput = document.getElementById("meme-bottom-text");
    const topText = (topInput ? topInput.value : "").trim();
    const bottomText = (bottomInput ? bottomInput.value : "").trim();

    drawMemeText(topText, canvas.width / 2, 65);
    drawMemeText(bottomText, canvas.width / 2, canvas.height - 35);
  }

  function drawMemeText(text, x, y) {
    if (!text) return;
    ctx.save();
    ctx.font = "900 42px Impact, 'Segoe UI', 'Microsoft JhengHei', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#ffffff";
    ctx.lineJoin = "miter";
    ctx.miterLimit = 2;

    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function exportMemeImage() {
    SoundEngine.playVictory();
    GameRPG.unlockAchievement("meme_creator");

    try {
      const link = document.createElement("a");
      link.download = `吳國亨專屬表情包_${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      SoundEngine.showEffect("💾 高清表情包已下載！快去發給朋友吧！");
    } catch (e) {
      alert("導出失敗，請檢查瀏覽器安全性設置。");
    }
  }

  function refreshDailyQuote() {
    const qEl = document.getElementById("daily-quote-text");
    if (qEl && typeof GUOHENG_QUOTES !== "undefined") {
      const q = GUOHENG_QUOTES[Math.floor(Math.random() * GUOHENG_QUOTES.length)];
      qEl.innerText = `「${q}」`;
      SoundEngine.playBoing();
    }
  }

  return {
    init,
    renderMeme
  };
})();

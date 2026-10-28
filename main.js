/**
 * WU GUOHENG SIMULATOR - MAIN APP CONTROLLER (main.js)
 * Ties tabs, sound controllers, modules, and keyboard shortcuts together.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Setup Avatar Sources
  const avatarSrc = window.WU_GUOHENG_AVATAR || "assets/wu_guoheng.jpg";
  const navAvatar = document.getElementById("nav-avatar");
  const charAvatar = document.getElementById("char-avatar");
  const eventAvatar = document.getElementById("event-avatar");

  if (navAvatar) navAvatar.src = avatarSrc;
  if (charAvatar) charAvatar.src = avatarSrc;
  if (eventAvatar) eventAvatar.src = avatarSrc;

  // 2. Tab Navigation
  const tabButtons = document.querySelectorAll(".nav-tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.tab;

      tabButtons.forEach(b => b.classList.remove("active"));
      tabPanels.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }

      SoundEngine.playClick();

      // Trigger redraws if switching to canvas tabs
      if (targetId === "tab-meme" && typeof MemeStudio !== "undefined") {
        setTimeout(() => MemeStudio.renderMeme(), 50);
      }
    });
  });

  // 3. Audio Controls
  const btnSound = document.getElementById("btn-sound-toggle");
  const btnBGM = document.getElementById("btn-bgm-toggle");

  if (btnSound) {
    btnSound.addEventListener("click", () => {
      const enabled = SoundEngine.toggleSFX();
      btnSound.innerText = enabled ? "🔊" : "🔇";
      btnSound.style.opacity = enabled ? "1" : "0.5";
      if (enabled) SoundEngine.playClick();
    });
  }

  if (btnBGM) {
    btnBGM.addEventListener("click", () => {
      const enabled = SoundEngine.toggleBGM();
      btnBGM.innerText = enabled ? "🎶" : "🎵";
      btnBGM.style.color = enabled ? "var(--accent-cyan)" : "var(--text-main)";
    });
  }

  // 4. Keyboard Shortcuts for Tabs
  window.addEventListener("keydown", (e) => {
    // Only if not focused on text inputs
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if (e.key === "1") tabButtons[0] && tabButtons[0].click();
    if (e.key === "2") tabButtons[1] && tabButtons[1].click();
    if (e.key === "3") tabButtons[2] && tabButtons[2].click();
    if (e.key === "4") tabButtons[3] && tabButtons[3].click();
  });

  // 5. Initialize Subsystems
  if (typeof GameRPG !== "undefined") {
    GameRPG.init();
  }
  if (typeof GameArcade !== "undefined") {
    GameArcade.init();
  }
  if (typeof MemeStudio !== "undefined") {
    MemeStudio.init();
  }

  console.log("🎮 《吳國亨模擬器：傳奇人生的覺醒》 已完全就緒！");
});

/* =======================================
   ЗМІННІ ГРИ
======================================= */
let score = 0;
let clickPower = 1;
let baseClickPower = 1;

let doubleClickLevel = 0;
let doubleClickPrice = 50;
let doubleClickBonus = 2;

let autoClickLevel = 0;
let autoClickPrice = 100;
let autoClickBonus = 0;

let boosterLevel = 0;
let boosterPrice = 200;
const boosterDuration = 10; // секунд
const boosterPower = 10; // +10 кліків

let autoClickInterval = null;
let boosterInterval = null;

let currentSkin = "лапка.png";

let skin1Bought = false;
let skin2Bought = false;
let skin3Bought = false;
let skin4Bought = false;

/* =======================================
   ЕЛЕМЕНТИ DOM
======================================= */
const scoreDisplay = document.getElementById("score");
const clickBtn = document.getElementById("clickBtn");
const resetBtn = document.getElementById("resetBtn");

const doubleClickBtn = document.getElementById("doubleClickBtn");
const autoClickBtn = document.getElementById("autoClickBtn");
const boosterBtn = document.getElementById("boosterBtn");

const skin1Btn = document.getElementById("skin1Btn");
const skin2Btn = document.getElementById("skin2Btn");
const skin3Btn = document.getElementById("skin3Btn");
const skin4Btn = document.getElementById("skin4Btn");

const boosterTimer = document.getElementById("boosterTimer");

const clickSound = document.getElementById("clickSound");
const upgradeBuySound = document.getElementById("upgradeBuySound");
upgradeBuySound.volume = 0.2;
const skinBuySound = document.getElementById("skinBuySound");

/* =======================================
   ФУНКЦІЇ СКІНІВ
======================================= */
function applySkin(skin) {
  currentSkin = skin;

  // Звук покупки
  if (skinBuySound) {
    skinBuySound.currentTime = 0;
    skinBuySound.play();
  }

  // Застосування до кнопки
  clickBtn.style.backgroundImage = `url("${skin}")`;
  clickBtn.style.webkitMaskImage = `url("${skin}")`;
  clickBtn.style.maskImage = `url("${skin}")`;

  updateSkinButtons();
  updateUI();
  saveGame();
}

function updateOneSkinButton(btn, bought, price, skin) {
  if (!bought) {
    btn.textContent = `${price} кліків`;
    btn.disabled = score < price;
    btn.classList.toggle("active", score >= price);
  } else if (currentSkin === skin) {
    btn.textContent = "Обрано ✅";
    btn.disabled = true;
    btn.classList.remove("active");
  } else {
    btn.textContent = "Вибрати";
    btn.disabled = false;
    btn.classList.add("active");
  }
}

function updateSkinButtons() {
  updateOneSkinButton(skin1Btn, skin1Bought, 100, "skin1.png");
  updateOneSkinButton(skin2Btn, skin2Bought, 300, "skin2.png");
  updateOneSkinButton(skin3Btn, skin3Bought, 600, "skin3.png");
  updateOneSkinButton(skin4Btn, skin4Bought, 1000, "skin4.png");
}

/* =======================================
   ПОДІЇ СКІНІВ
======================================= */
skin1Btn.addEventListener("click", () => {
  if (!skin1Bought && score >= 100) {
    score -= 100;
    skin1Bought = true;
  }
  applySkin("skin1.png");
});

skin2Btn.addEventListener("click", () => {
  if (!skin2Bought && score >= 300) {
    score -= 300;
    skin2Bought = true;
  }
  applySkin("skin2.png");
});

skin3Btn.addEventListener("click", () => {
  if (!skin3Bought && score >= 600) {
    score -= 600;
    skin3Bought = true;
  }
  applySkin("skin3.png");
});

skin4Btn.addEventListener("click", () => {
  if (!skin4Bought && score >= 1000) {
    score -= 1000;
    skin4Bought = true;
  }
  applySkin("skin4.png");
});

/* =======================================
   ОСНОВНИЙ КЛІК
======================================= */
clickBtn.addEventListener("click", () => {
  score += clickPower;

  if (clickSound) {
    clickSound.currentTime = 0;
    clickSound.play();
  }

  updateUI();
  saveGame();
});

/* =======================================
   ПОДВІЙНИЙ КЛІК
======================================= */
doubleClickBtn.addEventListener("click", () => {
  if (score >= doubleClickPrice) {
    score -= doubleClickPrice;
    doubleClickLevel++;
    clickPower = 1 + doubleClickBonus;
    baseClickPower = clickPower;
    doubleClickBonus += 2;
    doubleClickPrice += 50;

    if (upgradeBuySound) {
      upgradeBuySound.currentTime = 0;
      upgradeBuySound.play();
    }

    updateDoubleClickUI();
    updateUI();
    saveGame();
  }
});

function updateDoubleClickUI() {
  doubleClickBtn.textContent = `${doubleClickPrice} кліків`;
  const desc = doubleClickBtn.closest(".upgrade").querySelector("p");
  desc.textContent = `Кожен клік дає +${doubleClickBonus}`;
}

/* =======================================
   АВТОКЛІК
======================================= */
autoClickBtn.addEventListener("click", () => {
  if (score < autoClickPrice) return;

  score -= autoClickPrice;
  autoClickLevel++;
  autoClickBonus = autoClickLevel * 2;
  autoClickPrice += 100;

  if (!autoClickInterval) {
    autoClickInterval = setInterval(() => {
      score += autoClickBonus;
      updateUI();
      saveGame();
    }, 1000);
  }

  if (upgradeBuySound) {
    upgradeBuySound.currentTime = 0;
    upgradeBuySound.play();
  }

  updateAutoClickUI();
  updateUI();
  saveGame();
});

function updateAutoClickUI() {
  autoClickBtn.textContent = `${autoClickPrice} кліків`;
  const desc = autoClickBtn.closest(".upgrade").querySelector("p");
  desc.textContent = `+${2 + autoClickBonus} кліка кожну секунду`;
}

/* =======================================
   БУСТЕР
======================================= */
boosterBtn.addEventListener("click", () => {
  if (score < boosterPrice) return;

  score -= boosterPrice;
  boosterLevel++;
  boosterPrice += 200;

  let timeLeft = boosterDuration;
  boosterTimer.textContent = timeLeft;
  boosterTimer.style.display = "block";

  clickPower = boosterPower;

  if (boosterInterval) clearInterval(boosterInterval);

  boosterInterval = setInterval(() => {
    timeLeft--;
    boosterTimer.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(boosterInterval);
      boosterInterval = null;
      boosterTimer.style.display = "none";
      clickPower = baseClickPower;
    }
  }, 1000);

  if (upgradeBuySound) {
    upgradeBuySound.currentTime = 0;
    upgradeBuySound.play();
  }

  updateUI();
  updateBoosterUI();
  saveGame();
});

function updateBoosterUI() {
  boosterBtn.textContent = `${boosterPrice} кліків`;
  boosterBtn.disabled = score < boosterPrice;
}

/* =======================================
   ОНОВЛЕННЯ UI
======================================= */
function updateUI() {
  scoreDisplay.textContent = score;

  // Скін кнопки
  if (!skin1Bought) toggleButton(skin1Btn, 100);
  if (!skin2Bought) toggleButton(skin2Btn, 300);
  if (!skin3Bought) toggleButton(skin3Btn, 600);
  if (!skin4Bought) toggleButton(skin4Btn, 1000);

  toggleButton(doubleClickBtn, doubleClickPrice);
  toggleButton(autoClickBtn, autoClickPrice);
  toggleButton(boosterBtn, boosterPrice);

  updateSkinButtons();
}

function toggleButton(btn, price) {
  if (score >= price) {
    btn.disabled = false;
    btn.classList.add("active");
  } else {
    btn.disabled = true;
    btn.classList.remove("active");
  }
}

/* =======================================
   ЗБЕРЕЖЕННЯ ГРИ
======================================= */
function saveGame() {
  const gameData = {
    score,
    clickPower,
    baseClickPower,
    doubleClickLevel,
    doubleClickPrice,
    doubleClickBonus,
    autoClickLevel,
    autoClickPrice,
    autoClickBonus,
    boosterLevel,
    boosterPrice,
    skin1Bought,
    skin2Bought,
    skin3Bought,
    skin4Bought,
    currentSkin
  };

  localStorage.setItem("clickerGame", JSON.stringify(gameData));
}

function loadGame() {
  const saved = localStorage.getItem("clickerGame");
  if (!saved) return;

  const data = JSON.parse(saved);

  score = data.score || 0;
  clickPower = data.clickPower || 1;
  baseClickPower = data.baseClickPower || 1;

  doubleClickLevel = data.doubleClickLevel || 0;
  doubleClickPrice = data.doubleClickPrice || 50;
  doubleClickBonus = data.doubleClickBonus || 2;

  autoClickLevel = data.autoClickLevel || 0;
  autoClickPrice = data.autoClickPrice || 100;
  autoClickBonus = data.autoClickBonus || autoClickLevel * 2;

  boosterLevel = data.boosterLevel || 0;
  boosterPrice = data.boosterPrice || 200;

  skin1Bought = data.skin1Bought || false;
  skin2Bought = data.skin2Bought || false;
  skin3Bought = data.skin3Bought || false;
  skin4Bought = data.skin4Bought || false;

  currentSkin = data.currentSkin || "лапка.png";

  // Відновлення скіну
  clickBtn.style.backgroundImage = `url("${currentSkin}")`;
  clickBtn.style.webkitMaskImage = `url("${currentSkin}")`;
  clickBtn.style.maskImage = `url("${currentSkin}")`;

  if (doubleClickLevel > 0) updateDoubleClickUI();
  if (autoClickLevel > 0) {
    autoClickInterval = setInterval(() => {
      score += autoClickBonus;
      updateUI();
      saveGame();
    }, 1000);
  }
  if (boosterLevel > 0) updateBoosterUI();

  updateSkinButtons();
  updateUI();
  updateDoubleClickUI();
  updateAutoClickUI();
  updateBoosterUI();
}

/* =======================================
   СКИНУТИ ПРОГРЕС
======================================= */
resetBtn.addEventListener("click", () => {
  if (!confirm("Точно скинути весь прогрес?")) return;

  // Зупиняємо інтервали
  if (autoClickInterval) clearInterval(autoClickInterval);
  if (boosterInterval) clearInterval(boosterInterval);

  // Скидаємо змінні
  score = 0;
  clickPower = 1;
  baseClickPower = 1;

  doubleClickLevel = 0;
  doubleClickPrice = 50;
  doubleClickBonus = 2;

  autoClickLevel = 0;
  autoClickPrice = 100;
  autoClickBonus = 0;

  boosterLevel = 0;
  boosterPrice = 200;

  autoClickInterval = null;
  boosterInterval = null;

  skin1Bought = false;
  skin2Bought = false;
  skin3Bought = false;
  skin4Bought = false;

  // Скидаємо UI
  resetButtons();
  currentSkin = "лапка.png";
  clickBtn.style.backgroundImage = `url("${currentSkin}")`;
  clickBtn.style.webkitMaskImage = `url("${currentSkin}")`;
  clickBtn.style.maskImage = `url("${currentSkin}")`;

  localStorage.removeItem("clickerGame");
  updateUI();
});

/* =======================================
   ФУНКЦІЯ СКИНУТИ UI КНОПОК
======================================= */
function resetButtons() {
  doubleClickBtn.disabled = true;
  doubleClickBtn.classList.remove("active");
  doubleClickBtn.textContent = "50 кліків";

  autoClickBtn.disabled = true;
  autoClickBtn.classList.remove("active");
  autoClickBtn.textContent = "100 кліків";

  boosterBtn.disabled = true;
  boosterBtn.classList.remove("active");
  boosterBtn.textContent = "200 кліків";

  boosterTimer.style.display = "none";

  skin1Btn.disabled = true;
  skin1Btn.textContent = "100 кліків";
  skin1Btn.classList.remove("active");

  skin2Btn.disabled = true;
  skin2Btn.textContent = "300 кліків";
  skin2Btn.classList.remove("active");

  skin3Btn.disabled = true;
  skin3Btn.textContent = "600 кліків";
  skin3Btn.classList.remove("active");

  skin4Btn.disabled = true;
  skin4Btn.textContent = "1000 кліків";
  skin4Btn.classList.remove("active");
}

/* =======================================
   ІНІЦІАЛІЗАЦІЯ
======================================= */
loadGame();
updateUI();

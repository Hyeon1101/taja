// Hancom Taja Typing Practice Main Application Engine

class HancomTajaApp {
  constructor() {
    this.currentMode = 'short'; // 'short' | 'long' | 'game'
    
    // Global Stats
    this.startTime = null;
    this.timerInterval = null;
    this.elapsedSeconds = 0;
    this.totalStrokes = 0;
    this.correctStrokes = 0;
    this.errorCount = 0;
    this.maxCPM = 0;

    // Short / Long State
    this.shortList = [];
    this.shortIndex = 0;
    this.longArticle = null;
    this.longLineIndex = 0;

    // Word Game State
    this.gameScore = 0;
    this.gameLevel = 1;
    this.gameLives = 5;
    this.fallingWords = [];
    this.gameLoopInterval = null;
    this.spawnTimer = null;
    this.isGameOver = false;

    this.initElements();
    this.bindEvents();
    this.switchMode('short');
  }

  initElements() {
    // Mode UI
    this.modeBadge = document.getElementById('mode-badge');
    this.tabBtns = document.querySelectorAll('.tab-btn');
    this.categorySelect = document.getElementById('category-select');
    this.btnSound = document.getElementById('btn-sound');
    this.btnBack = document.getElementById('btn-back');

    // Stats UI
    this.statTime = document.getElementById('stat-time');
    this.statCPM = document.getElementById('stat-cpm');
    this.statAcc = document.getElementById('stat-acc');
    this.statErrorsSub = document.getElementById('stat-errors-sub');

    // Text Stage UI
    this.textStage = document.getElementById('text-practice-stage');
    this.practiceTitle = document.getElementById('practice-title');
    this.sentenceProgress = document.getElementById('sentence-progress');
    this.linesContainer = document.getElementById('lines-container');
    this.typingInput = document.getElementById('typing-input');
    this.virtualKeyboard = document.getElementById('virtual-keyboard');

    // Word Game UI
    this.gameStage = document.getElementById('word-game-stage');
    this.gameScoreEl = document.getElementById('game-score');
    this.gameLevelEl = document.getElementById('game-level');
    this.gameLivesEl = document.getElementById('game-lives');
    this.fallingArea = document.getElementById('falling-area');
    this.gameInput = document.getElementById('game-input');

    // Modal UI
    this.resultModal = document.getElementById('result-modal');
    this.modalTitle = document.getElementById('modal-title');
    this.resCPM = document.getElementById('res-cpm');
    this.resMaxCPM = document.getElementById('res-max-cpm');
    this.resAcc = document.getElementById('res-acc');
    this.resTime = document.getElementById('res-time');
    this.btnModalConfirm = document.getElementById('btn-modal-confirm');
  }

  bindEvents() {
    // Tab switching
    this.tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.dataset.mode;
        this.switchMode(mode);
      });
    });

    // Category select
    this.categorySelect.addEventListener('change', () => {
      if (this.currentMode === 'short') {
        this.startShortPractice();
      } else if (this.currentMode === 'long') {
        this.startLongPractice();
      } else if (this.currentMode === 'game') {
        this.startWordGame();
      }
    });

    // Sound toggle
    this.btnSound.addEventListener('click', () => {
      const enabled = soundEngine.toggleSound();
      this.btnSound.innerHTML = enabled ? 
        '<i class="fa-solid fa-volume-high"></i>' : 
        '<i class="fa-solid fa-volume-xmark"></i>';
    });

    this.btnBack.addEventListener('click', () => {
      this.switchMode('short');
    });

    // Typing Input Events for Short/Long Practice
    this.typingInput.addEventListener('input', (e) => this.handleTypingInput(e));
    this.typingInput.addEventListener('keydown', (e) => {
      this.highlightKey(e.key, true);
      soundEngine.playKeyPress();
      if (e.key === 'Enter') {
        this.handleLineSubmit();
      }
    });

    this.typingInput.addEventListener('keyup', (e) => {
      this.highlightKey(e.key, false);
    });

    // Word Game Input Event
    this.gameInput.addEventListener('keydown', (e) => {
      soundEngine.playKeyPress();
      if (e.key === 'Enter') {
        this.handleGameWordSubmit();
      }
    });

    // Modal Confirm
    this.btnModalConfirm.addEventListener('click', () => {
      this.resultModal.classList.add('hidden');
      this.switchMode(this.currentMode);
    });
  }

  // --- MODE SWITCHING ---
  switchMode(mode) {
    this.currentMode = mode;
    this.stopTimer();
    this.stopWordGameLoop();

    // Reset stats
    this.elapsedSeconds = 0;
    this.totalStrokes = 0;
    this.correctStrokes = 0;
    this.errorCount = 0;
    this.maxCPM = 0;
    this.updateStatsDisplay();

    // Update active tab buttons
    this.tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // Update Mode Badge Title
    const badgeTitles = {
      short: '단문연습',
      long: '장문연습',
      game: '낱말게임'
    };
    this.modeBadge.textContent = badgeTitles[mode];

    // Show/Hide Stages
    if (mode === 'game') {
      this.textStage.classList.add('hidden');
      this.gameStage.classList.remove('hidden');
      this.populateCategorySelect(['쉬움', '보통', '어려움']);
      this.startWordGame();
    } else {
      this.textStage.classList.remove('hidden');
      this.gameStage.classList.add('hidden');

      if (mode === 'short') {
        this.populateCategorySelect(['모든 범주', '속담 및 명언']);
        this.startShortPractice();
      } else { // long
        const articleTitles = TAJA_TEXTS.long.map(a => a.title);
        this.populateCategorySelect(articleTitles);
        this.startLongPractice();
      }
    }
  }

  populateCategorySelect(options) {
    this.categorySelect.innerHTML = options.map(opt => `<option value="${opt}">${opt}</option>`).join('');
  }

  // --- STATS ENGINE ---
  startTimer() {
    if (this.timerInterval) return;
    this.startTime = Date.now() - (this.elapsedSeconds * 1000);
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
      this.updateStatsDisplay();
    }, 500);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateStatsDisplay() {
    // Time format MM:SS
    const mins = Math.floor(this.elapsedSeconds / 60).toString().padStart(2, '0');
    const secs = (this.elapsedSeconds % 60).toString().padStart(2, '0');
    this.statTime.textContent = `${mins}:${secs}`;

    // CPM calculation
    let cpm = 0;
    if (this.elapsedSeconds > 0 && this.totalStrokes > 0) {
      cpm = Math.round((this.correctStrokes / this.elapsedSeconds) * 60);
    }
    if (cpm > this.maxCPM) this.maxCPM = cpm;
    this.statCPM.textContent = cpm;

    // Accuracy calculation
    let acc = 100.00;
    if (this.totalStrokes > 0) {
      acc = ((this.correctStrokes / (this.totalStrokes + this.errorCount)) * 100).toFixed(2);
      if (acc < 0) acc = 0;
      if (acc > 100) acc = 100;
    }
    this.statAcc.textContent = acc;
    this.statErrorsSub.textContent = `오타 ${this.errorCount}`;
  }

  // --- MODE 1: SHORT PRACTICE ---
  startShortPractice() {
    this.shortList = [...TAJA_TEXTS.short];
    this.shortIndex = 0;
    
    this.practiceTitle.querySelector('span:first-child').textContent = '단문 연습';
    this.renderShortSentence();
    this.typingInput.value = '';
    this.typingInput.focus();
  }

  renderShortSentence() {
    this.sentenceProgress.textContent = `${this.shortIndex + 1} / ${this.shortList.length}`;
    const targetText = this.shortList[this.shortIndex];

    this.linesContainer.innerHTML = `
      <div class="line-block active">
        <div class="target-text-display" id="target-line"></div>
      </div>
    `;

    this.updateTargetDisplay(targetText, '');
  }

  // --- MODE 2: LONG PRACTICE ---
  startLongPractice() {
    const selectedTitle = this.categorySelect.value;
    this.longArticle = TAJA_TEXTS.long.find(a => a.title === selectedTitle) || TAJA_TEXTS.long[0];
    this.longLineIndex = 0;

    this.practiceTitle.querySelector('span:first-child').textContent = this.longArticle.title;
    this.sentenceProgress.textContent = `1 / ${this.longArticle.lines.length}`;

    this.renderLongLines();
    this.typingInput.value = '';
    this.typingInput.focus();
  }

  renderLongLines() {
    this.linesContainer.innerHTML = '';
    
    // Display 4 lines around current index
    const total = this.longArticle.lines.length;
    const start = Math.max(0, Math.min(this.longLineIndex, total - 4));
    const end = Math.min(total, start + 4);

    for (let i = start; i < end; i++) {
      const lineBlock = document.createElement('div');
      lineBlock.className = `line-block ${i === this.longLineIndex ? 'active' : ''}`;
      lineBlock.innerHTML = `<div class="target-text-display" id="line-disp-${i}">${this.escapeHtml(this.longArticle.lines[i])}</div>`;
      this.linesContainer.appendChild(lineBlock);
    }

    this.sentenceProgress.textContent = `${this.longLineIndex + 1} / ${total}`;
    this.updateTargetDisplay(this.longArticle.lines[this.longLineIndex], this.typingInput.value);
  }

  // --- INPUT & LINE PROGRESSION LOGIC ---
  handleTypingInput(e) {
    if (!this.timerInterval && this.typingInput.value.length > 0) {
      this.startTimer();
    }

    const currentInput = this.typingInput.value;
    let targetText = '';

    if (this.currentMode === 'short') {
      targetText = this.shortList[this.shortIndex];
    } else if (this.currentMode === 'long') {
      targetText = this.longArticle.lines[this.longLineIndex];
    }

    this.updateTargetDisplay(targetText, currentInput);
  }

  updateTargetDisplay(targetText, currentInput) {
    const displayEl = this.currentMode === 'short' ? 
      document.getElementById('target-line') : 
      document.getElementById(`line-disp-${this.longLineIndex}`);

    if (!displayEl) return;

    let html = '';
    let correctCount = 0;
    let currentErrors = 0;

    // Korean character stroke estimation (approx 2.5 strokes per Korean char)
    for (let i = 0; i < targetText.length; i++) {
      const targetChar = targetText[i];
      const inputChar = currentInput[i];

      if (i < currentInput.length) {
        if (inputChar === targetChar) {
          html += `<span class="correct">${this.escapeHtml(targetChar)}</span>`;
          correctCount += 2;
        } else {
          html += `<span class="wrong">${this.escapeHtml(targetChar)}</span>`;
          currentErrors++;
        }
      } else if (i === currentInput.length) {
        html += `<span class="current">${this.escapeHtml(targetChar)}</span>`;
      } else {
        html += `<span>${this.escapeHtml(targetChar)}</span>`;
      }
    }

    displayEl.innerHTML = html;

    // Accumulate stats
    this.correctStrokes = Math.max(this.correctStrokes, (this.longLineIndex * 30) + (this.shortIndex * 20) + correctCount);
    this.totalStrokes = Math.max(this.totalStrokes, (this.longLineIndex * 30) + (this.shortIndex * 20) + currentInput.length * 2);
    if (currentErrors > 0 && e && e.inputType && e.inputType.includes('insert')) {
      this.errorCount++;
      soundEngine.playError();
    }

    this.updateStatsDisplay();
  }

  handleLineSubmit() {
    const currentInput = this.typingInput.value;
    let targetText = '';

    if (this.currentMode === 'short') {
      targetText = this.shortList[this.shortIndex];
      soundEngine.playCompleteLine();

      if (this.shortIndex < this.shortList.length - 1) {
        this.shortIndex++;
        this.renderShortSentence();
        this.typingInput.value = '';
      } else {
        this.finishPractice();
      }
    } else if (this.currentMode === 'long') {
      targetText = this.longArticle.lines[this.longLineIndex];
      soundEngine.playCompleteLine();

      if (this.longLineIndex < this.longArticle.lines.length - 1) {
        this.longLineIndex++;
        this.renderLongLines();
        this.typingInput.value = '';
      } else {
        this.finishPractice();
      }
    }
  }

  finishPractice() {
    this.stopTimer();
    soundEngine.playCompleteLine();

    this.modalTitle.textContent = '연습 완료! 🎉';
    this.resCPM.textContent = `${this.statCPM.textContent} 타/분`;
    this.resMaxCPM.textContent = `${this.maxCPM} 타/분`;
    this.resAcc.textContent = `${this.statAcc.textContent} %`;
    this.resTime.textContent = this.statTime.textContent;

    this.resultModal.classList.remove('hidden');
  }

  // --- VIRTUAL KEYBOARD HIGHLIGHT ---
  highlightKey(key, isPressed) {
    if (!key) return;
    const lowerKey = key.toLowerCase();
    
    // Find matching key element
    const keys = this.virtualKeyboard.querySelectorAll('.key');
    keys.forEach(k => {
      const dataKey = (k.dataset.key || '').toLowerCase();
      const dataKr = (k.dataset.kr || '').toLowerCase();
      if (dataKey === lowerKey || dataKr === lowerKey || (lowerKey === ' ' && dataKey === ' ')) {
        k.classList.toggle('pressed', isPressed);
      }
    });
  }

  // --- MODE 3: WORD GAME (FALLING WORDS ARCADE) ---
  startWordGame() {
    this.stopWordGameLoop();
    this.fallingArea.innerHTML = '';
    this.gameScore = 0;
    this.gameLevel = 1;
    this.gameLives = 5;
    this.isGameOver = false;

    this.updateGameHud();
    this.gameInput.value = '';
    this.gameInput.focus();

    this.startTimer();

    // Word spawn loop
    this.spawnTimer = setInterval(() => this.spawnWord(), 2000);
    
    // Animation loop (updates word positions)
    this.gameLoopInterval = setInterval(() => this.updateWordPositions(), 50);
  }

  stopWordGameLoop() {
    if (this.spawnTimer) clearInterval(this.spawnTimer);
    if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);
    this.spawnTimer = null;
    this.gameLoopInterval = null;
  }

  spawnWord() {
    if (this.isGameOver) return;

    const diff = this.categorySelect.value === '어려움' ? 'hard' : (this.categorySelect.value === '보통' ? 'medium' : 'easy');
    const wordList = TAJA_TEXTS.words[diff];
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];

    const areaWidth = this.fallingArea.clientWidth - 120;
    const posX = Math.floor(Math.random() * areaWidth) + 20;

    const el = document.createElement('div');
    el.className = 'falling-word';
    el.textContent = randomWord;
    el.style.left = `${posX}px`;
    el.style.top = `0px`;

    const wordObj = {
      word: randomWord,
      el: el,
      x: posX,
      y: 0,
      speed: 1.5 + (this.gameLevel * 0.5)
    };

    this.fallingArea.appendChild(el);
    this.fallingWords.push(wordObj);
  }

  updateWordPositions() {
    if (this.isGameOver) return;
    const maxHeight = this.fallingArea.clientHeight - 40;

    for (let i = this.fallingWords.length - 1; i >= 0; i--) {
      const w = this.fallingWords[i];
      w.y += w.speed;
      w.el.style.top = `${w.y}px`;

      // Word reached bottom
      if (w.y >= maxHeight) {
        soundEngine.playError();
        w.el.remove();
        this.fallingWords.splice(i, 1);
        
        this.gameLives--;
        this.errorCount++;
        this.updateGameHud();
        this.updateStatsDisplay();

        if (this.gameLives <= 0) {
          this.gameOver();
          break;
        }
      }
    }
  }

  handleGameWordSubmit() {
    const inputVal = this.gameInput.value.trim();
    if (!inputVal) return;

    let matched = false;
    for (let i = 0; i < this.fallingWords.length; i++) {
      if (this.fallingWords[i].word === inputVal) {
        soundEngine.playExplosion();
        
        // Remove word element
        this.fallingWords[i].el.remove();
        this.fallingWords.splice(i, 1);

        this.gameScore += 100;
        this.correctStrokes += inputVal.length * 2;
        this.totalStrokes += inputVal.length * 2;
        matched = true;

        // Level up every 500 score
        if (this.gameScore % 500 === 0) {
          this.gameLevel++;
        }

        break;
      }
    }

    if (!matched) {
      soundEngine.playError();
      this.errorCount++;
    }

    this.gameInput.value = '';
    this.updateGameHud();
    this.updateStatsDisplay();
  }

  updateGameHud() {
    this.gameScoreEl.textContent = this.gameScore;
    this.gameLevelEl.textContent = this.gameLevel;
    
    // Heart icons
    let hearts = '';
    for (let i = 0; i < 5; i++) {
      if (i < this.gameLives) {
        hearts += '<i class="fa-solid fa-heart"></i>';
      } else {
        hearts += '<i class="fa-regular fa-heart" style="color: #64748B;"></i>';
      }
    }
    this.gameLivesEl.innerHTML = hearts;
  }

  gameOver() {
    this.isGameOver = true;
    this.stopWordGameLoop();
    this.stopTimer();

    this.modalTitle.textContent = '게임 오버! 🎮';
    this.resCPM.textContent = `${this.gameScore} 점`;
    this.resMaxCPM.textContent = `레벨 ${this.gameLevel}`;
    this.resAcc.textContent = `${this.statAcc.textContent} %`;
    this.resTime.textContent = this.statTime.textContent;

    this.resultModal.classList.remove('hidden');
  }

  escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}

// Initialize Application when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new HancomTajaApp();
});

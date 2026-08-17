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

    // Cookie Typing Runner State
    this.runnerDistance = 0;
    this.runnerScore = 0;
    this.runnerCombo = 0;
    this.runnerMaxCombo = 0;
    this.runnerJellies = [];
    this.runnerObstacles = [];
    this.runnerAnimationId = null;
    this.cookieFrames = [
      'assets/runner/gretel-run-1.png',
      'assets/runner/gretel-run-2.png',
      'assets/runner/gretel-run-3.png',
      'assets/runner/gretel-run-4.png',
      'assets/runner/gretel-run-5.png',
      'assets/runner/gretel-run-6.png'
    ];
    this.cookieFrame = 0;
    this.runnerWorlds = [
      { src: 'assets/runner/bg-forest.jpg?v=3', name: '1. 숲속', accent: '#22C55E' },
      { src: 'assets/runner/bg-candyhouse.jpg?v=3', name: '2. 과자집', accent: '#F43F5E' },
      { src: 'assets/runner/bg-witchkitchen.jpg?v=3', name: '3. 마녀의 주방', accent: '#A855F7' },
      { src: 'assets/runner/bg-escape.jpg?v=3', name: '4. 과자집 탈출', accent: '#FDE047' }
    ];
    this.runnerStageIndex = 0;
    this.runnerWorldChanging = false;

    this.initElements();
    this.bindEvents();
    // Do not auto-start a mode here, wait for landing screen selection
  }

  initElements() {
    // Landing UI
    this.landingScreen = document.getElementById('landing-screen');
    this.mainApp = document.getElementById('main-app');
    this.modeCards = document.querySelectorAll('.mode-card');

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

    // Cookie Run Typing Runner UI
    this.runnerStage = document.getElementById('runner-game-stage');
    this.runnerHpFill = document.getElementById('runner-hp-fill');
    this.runnerHpText = document.getElementById('runner-hp-text');
    this.runnerDistanceEl = document.getElementById('runner-distance');
    this.runnerScoreEl = document.getElementById('runner-score');
    this.runnerComboEl = document.getElementById('runner-combo');
    this.runnerDrainEl = document.getElementById('runner-drain');
    this.runnerWorldNameEl = document.getElementById('runner-world-name');
    this.runnerWorldBanner = document.getElementById('runner-world-banner');
    this.runnerHpJelly = document.getElementById('runner-hp-jelly');
    this.runnerBg = document.getElementById('runner-bg');
    this.runnerGround = document.getElementById('runner-ground');
    this.runnerWorld = document.getElementById('runner-world');
    this.runnerJellyTrack = document.getElementById('runner-jelly-track');
    this.runnerCharWrap = document.getElementById('runner-char-wrap');
    this.runnerObstacleTrack = document.getElementById('runner-obstacle-track');
    this.runnerChar = document.getElementById('runner-char');
    this.runnerPet = document.getElementById('runner-pet');
    this.runnerDashEffect = document.getElementById('runner-dash-effect');
    this.runnerCrashEffect = document.getElementById('runner-crash-effect');
    this.runnerStoryTitle = document.getElementById('runner-story-title');
    this.runnerStoryProgress = document.getElementById('runner-story-progress');
    this.runnerStoryTarget = document.getElementById('runner-story-target');
    this.runnerInput = document.getElementById('runner-input');

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
    // Landing Screen mode selection
    this.modeCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const mode = e.currentTarget.dataset.launch;
        this.hideLandingScreen(mode);
      });
    });

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
      } else if (this.currentMode === 'runner') {
        this.startRunnerGame();
      }
    });

    // Sound toggle
    this.btnSound.addEventListener('click', () => {
      const enabled = soundEngine.toggleSound();
      this.btnSound.innerHTML = enabled ?
        '<i class="fa-solid fa-volume-high"></i>' :
        '<i class="fa-solid fa-volume-xmark"></i>';
      if (enabled && this.currentMode === 'runner' && !this.isGameOver) {
        soundEngine.startRunnerBgm();
      }
    });

    this.btnBack.addEventListener('click', () => {
      this.showLandingScreen();
    });

    // Typing Input Events for Short/Long Practice
    this.typingInput.addEventListener('input', (e) => this.handleTypingInput(e));
    this.typingInput.addEventListener('keydown', (e) => {
      this.highlightKey(e, true);
      soundEngine.playKeyPress();
      if (e.key === 'Enter') {
        this.handleLineSubmit();
      } else if (e.key === ' ') {
        let targetText = '';
        if (this.currentMode === 'short') targetText = this.shortList[this.shortIndex] || '';
        else if (this.currentMode === 'long') targetText = this.longArticle ? this.longArticle.lines[this.longLineIndex] || '' : '';
        
        const currentVal = this.typingInput.value;
        if (currentVal.trim() === targetText.trim() && currentVal.length > 0) {
          e.preventDefault();
          this.handleLineSubmit();
        }
      }
    });

    this.typingInput.addEventListener('keyup', (e) => {
      this.highlightKey(e, false);
    });

    // Word Game Input Event
    this.gameInput.addEventListener('keydown', (e) => {
      soundEngine.playKeyPress();
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.handleGameWordSubmit();
      }
    });
    this.gameInput.addEventListener('input', () => this.highlightTargetWords());

    // Cookie Typing Runner input (IME-safe)
    if (this.runnerInput) {
      this.runnerInput.addEventListener('compositionstart', () => {
        this.runnerComposing = true;
      });
      this.runnerInput.addEventListener('compositionend', (e) => {
        this.runnerComposing = false;
        this.handleRunnerTypingInput(e);
      });
      this.runnerInput.addEventListener('input', (e) => this.handleRunnerTypingInput(e));
      this.runnerInput.addEventListener('keydown', (e) => {
        soundEngine.playKeyPress();
        if (e.key === 'Enter') {
          e.preventDefault();
          this.handleRunnerLineSubmit();
        }
      });
    }

    // Modal Confirm
    this.btnModalConfirm.addEventListener('click', () => {
      this.resultModal.classList.add('hidden');
      this.switchMode(this.currentMode);
    });
  }

  // --- LANDING SCREEN LOGIC ---
  showLandingScreen() {
    this.stopTimer();
    this.stopWordGameLoop();
    this.stopRunnerGameLoop();
    this.mainApp.classList.add('hidden');
    if (this.landingScreen) {
      this.landingScreen.style.display = 'flex';
      this.landingScreen.classList.remove('fade-out');
    }
  }

  hideLandingScreen(mode) {
    if (this.landingScreen) {
      // Play a positive sound when starting
      soundEngine.playCompleteLine();
      
      this.landingScreen.classList.add('fade-out');
      setTimeout(() => {
        this.landingScreen.style.display = 'none';
        this.mainApp.classList.remove('hidden');
        this.switchMode(mode);
      }, 600);
    } else {
      this.mainApp.classList.remove('hidden');
      this.switchMode(mode);
    }
  }

  // --- MODE SWITCHING ---
  switchMode(mode) {
    this.currentMode = mode;
    this.stopTimer();
    this.stopWordGameLoop();
    this.stopRunnerGameLoop();

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
      game: '낱말게임',
      runner: '타자러너'
    };
    this.modeBadge.textContent = badgeTitles[mode] || '타자연습';

    // Show/Hide Stages
    if (mode === 'game') {
      this.textStage.classList.add('hidden');
      if (this.runnerStage) this.runnerStage.classList.add('hidden');
      this.gameStage.classList.remove('hidden');
      this.populateCategorySelect(['쉬움', '보통', '어려움']);
      this.startWordGame();
    } else if (mode === 'runner') {
      this.textStage.classList.add('hidden');
      this.gameStage.classList.add('hidden');
      if (this.runnerStage) this.runnerStage.classList.remove('hidden');
      const novelTitles = TAJA_TEXTS.novels.map(n => n.title);
      this.populateCategorySelect(novelTitles);
      this.startRunnerGame();
    } else {
      this.textStage.classList.remove('hidden');
      this.gameStage.classList.add('hidden');
      if (this.runnerStage) this.runnerStage.classList.add('hidden');

      if (mode === 'short') {
        this.populateCategorySelect(['속담 및 명언']);
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

    this.updateTargetDisplay(targetText, currentInput, e);

    // Auto-advance when exact match completed
    if (targetText && currentInput === targetText && !this.isSubmittingLine) {
      setTimeout(() => {
        if (this.typingInput && this.typingInput.value === targetText) {
          this.handleLineSubmit();
        }
      }, 10);
    }
  }

  updateTargetDisplay(targetText, currentInput, e) {
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
      const charToShow = targetChar === ' ' ? '&nbsp;' : this.escapeHtml(targetChar);

      if (i < currentInput.length) {
        if (inputChar === targetChar) {
          html += `<span class="correct">${charToShow}</span>`;
          correctCount += 2;
        } else {
          html += `<span class="wrong">${charToShow}</span>`;
          currentErrors++;
        }
      } else if (i === currentInput.length) {
        html += `<span class="current">${charToShow}</span>`;
      } else {
        html += `<span>${charToShow}</span>`;
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
    this.highlightGuideKey();
  }

  clearTypingInput() {
    if (!this.typingInput) return;
    this.typingInput.blur();
    this.typingInput.value = '';
    this.typingInput.focus();
    const currentTarget = (this.currentMode === 'short' ? this.shortList[this.shortIndex] : (this.longArticle ? this.longArticle.lines[this.longLineIndex] : '')) || '';
    this.updateTargetDisplay(currentTarget, '');
  }

  handleLineSubmit() {
    if (this.isSubmittingLine) return;
    this.isSubmittingLine = true;

    if (this.currentMode === 'short') {
      soundEngine.playCompleteLine();

      if (this.shortIndex < this.shortList.length - 1) {
        this.shortIndex++;
        this.clearTypingInput();
        this.renderShortSentence();
      } else {
        this.clearTypingInput();
        this.finishPractice();
      }
    } else if (this.currentMode === 'long') {
      soundEngine.playCompleteLine();

      if (this.longLineIndex < this.longArticle.lines.length - 1) {
        this.longLineIndex++;
        this.clearTypingInput();
        this.renderLongLines();
      } else {
        this.clearTypingInput();
        this.finishPractice();
      }
    }

    this.isSubmittingLine = false;
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
  highlightKey(e, isPressed) {
    if (!e) return;

    let eventCode = e.code || '';
    let eventKey = (e.key || '').toLowerCase();
    
    // Find matching key element
    const keys = this.virtualKeyboard.querySelectorAll('.key');
    keys.forEach(k => {
      const dataCode = k.dataset.code || '';
      const dataKey = (k.dataset.key || '').toLowerCase();
      const dataKr = (k.dataset.kr || '').toLowerCase();

      let match = false;
      if (dataCode && dataCode === eventCode) match = true;
      else if (dataKey && dataKey === eventKey) match = true;
      else if (dataKr && dataKr === eventKey) match = true;
      else if (eventKey === ' ' && (dataKey === ' ' || dataCode === 'Space')) match = true;

      if (match) {
        k.classList.toggle('pressed', isPressed);
      }
    });

    if (isPressed) {
      this.highlightGuideKey();
    }
  }

  getJamoKeyCodes(char) {
    const codeMap = {
      ' ': ['Space'], '.': ['Period'], ',': ['Comma'], '?': ['Slash', 'ShiftLeft'],
      '!': ['Digit1', 'ShiftLeft'], '~': ['Backquote', 'ShiftLeft'], '-': ['Minus'],
      'ㄱ': ['KeyR'], 'ㄲ': ['KeyR'], 'ㄴ': ['KeyS'], 'ㄷ': ['KeyE'], 'ㄸ': ['KeyE'],
      'ㄹ': ['KeyF'], 'ㅁ': ['KeyA'], 'ㅂ': ['KeyQ'], 'ㅃ': ['KeyQ'], 'ㅅ': ['KeyT'],
      'ㅆ': ['KeyT'], 'ㅇ': ['KeyD'], 'ㅈ': ['KeyW'], 'ㅉ': ['KeyW'], 'ㅊ': ['KeyC'],
      'ㅋ': ['KeyZ'], 'ㅌ': ['KeyX'], 'ㅍ': ['KeyV'], 'ㅎ': ['KeyG'],
      'ㅏ': ['KeyK'], 'ㅐ': ['KeyO'], 'ㅑ': ['KeyI'], 'ㅒ': ['KeyO'], 'ㅓ': ['KeyJ'],
      'ㅔ': ['KeyP'], 'ㅕ': ['KeyU'], 'ㅖ': ['KeyP'], 'ㅗ': ['KeyH'], 'ㅘ': ['KeyH', 'KeyK'],
      'ㅙ': ['KeyH', 'KeyO'], 'ㅚ': ['KeyH', 'KeyL'], 'ㅛ': ['KeyY'], 'ㅜ': ['KeyN'],
      'ㅝ': ['KeyN', 'KeyJ'], 'ㅞ': ['KeyN', 'KeyP'], 'ㅟ': ['KeyN', 'KeyL'], 'ㅠ': ['KeyB'],
      'ㅡ': ['KeyM'], 'ㅢ': ['KeyM', 'KeyL'], 'ㅣ': ['KeyL']
    };

    if (!char) return [];
    if (codeMap[char]) return codeMap[char];

    const code = char.charCodeAt(0);
    if (code >= 0xAC00 && code <= 0xD7A3) {
      const idx = code - 0xAC00;
      const choIdx = Math.floor(idx / 588);
      const jungIdx = Math.floor((idx % 588) / 28);
      const jongIdx = idx % 28;

      const choList = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
      const jungList = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
      const jongList = ['', 'ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

      const result = [];
      if (choList[choIdx] && codeMap[choList[choIdx]]) result.push(...codeMap[choList[choIdx]]);
      if (jungList[jungIdx] && codeMap[jungList[jungIdx]]) result.push(...codeMap[jungList[jungIdx]]);
      if (jongIdx > 0 && jongList[jongIdx] && codeMap[jongList[jongIdx]]) result.push(...codeMap[jongList[jongIdx]]);
      return result;
    }

    return [];
  }

  highlightGuideKey() {
    let targetText = '';
    if (this.currentMode === 'short' && this.shortList[this.shortIndex]) {
      targetText = this.shortList[this.shortIndex];
    } else if (this.currentMode === 'long' && this.longArticle && this.longArticle.lines[this.longLineIndex]) {
      targetText = this.longArticle.lines[this.longLineIndex];
    }

    const currentInput = this.typingInput ? this.typingInput.value : '';
    const nextChar = targetText[currentInput.length] || '';

    const targetCodes = this.getJamoKeyCodes(nextChar);

    const keys = this.virtualKeyboard.querySelectorAll('.key');
    keys.forEach(k => {
      const dataCode = k.dataset.code || '';
      const isGuide = targetCodes.includes(dataCode);
      k.classList.toggle('active-guide', isGuide);
    });
  }

  // --- MODE 3: WORD GAME (FALLING WORDS ARCADE) ---
  startWordGame() {
    this.stopWordGameLoop();
    if (this.fallingArea) this.fallingArea.innerHTML = '';
    this.fallingWords = [];
    this.gameScore = 0;
    this.gameLevel = 1;
    this.gameLives = 5;
    this.isGameOver = false;

    this.updateGameHud();

    setTimeout(() => {
      if (this.gameInput) {
        this.gameInput.value = '';
        this.gameInput.focus();
      }
    }, 50);

    this.startTimer();
    this.spawnWord(); // Spawn 1st word immediately!

    this.spawnTimer = setInterval(() => this.spawnWord(), 2200);

    const animate = () => {
      if (!this.isGameOver && this.currentMode === 'game') {
        this.updateWordPositions();
        this.animationFrameId = requestAnimationFrame(animate);
      }
    };
    this.animationFrameId = requestAnimationFrame(animate);
  }

  stopWordGameLoop() {
    if (this.spawnTimer) clearInterval(this.spawnTimer);
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.spawnTimer = null;
    this.animationFrameId = null;
  }

  spawnWord() {
    if (this.isGameOver || this.currentMode !== 'game') return;

    const diff = this.categorySelect.value === '어려움' ? 'hard' : (this.categorySelect.value === '보통' ? 'medium' : 'easy');
    const wordList = TAJA_TEXTS.words[diff] || TAJA_TEXTS.words.easy;

    if (!this.recentWords) this.recentWords = [];

    // Filter out words currently falling on screen OR spawned recently
    const activeWords = this.fallingWords.map(w => w.word);
    let candidates = wordList.filter(w => !activeWords.includes(w) && !this.recentWords.includes(w));

    if (candidates.length === 0) {
      candidates = wordList.filter(w => !activeWords.includes(w));
    }
    if (candidates.length === 0) {
      candidates = wordList;
    }

    const randomWord = candidates[Math.floor(Math.random() * candidates.length)];

    this.recentWords.push(randomWord);
    if (this.recentWords.length > 25) {
      this.recentWords.shift();
    }

    const clientW = (this.fallingArea && this.fallingArea.clientWidth > 200) ? this.fallingArea.clientWidth : 650;
    const areaWidth = Math.max(200, clientW - 150);
    const posX = Math.floor(Math.random() * areaWidth) + 16;

    const skins = ['skin-fire', 'skin-rock', 'skin-ice'];
    const el = document.createElement('div');
    el.className = 'falling-word ' + skins[Math.floor(Math.random() * skins.length)];
    if (randomWord.length >= 5) el.classList.add('is-long');
    el.textContent = randomWord;
    el.style.left = `${posX}px`;

    const wordObj = {
      word: randomWord,
      el: el,
      x: posX,
      y: 0,
      speed: 1.2 + (this.gameLevel * 0.4),
      rot: (Math.random() * 50 - 25),
      spin: (Math.random() * 0.55 + 0.12) * (Math.random() < 0.5 ? 1 : -1)
    };
    el.style.transform = `translateY(0px) rotate(${wordObj.rot}deg)`;

    if (this.fallingArea) {
      this.fallingArea.appendChild(el);
      this.fallingWords.push(wordObj);
    }
  }

  updateWordPositions() {
    if (this.isGameOver || !this.fallingArea) return;
    const clientH = (this.fallingArea.clientHeight > 100) ? this.fallingArea.clientHeight : 500;
    const maxHeight = clientH - 108;

    for (let i = this.fallingWords.length - 1; i >= 0; i--) {
      const w = this.fallingWords[i];
      if (w.leaving) continue;
      w.y += w.speed;
      w.rot += w.spin;
      w.el.style.transform = `translateY(${w.y}px) rotate(${w.rot}deg)`;

      // Word reached bottom
      if (w.y >= maxHeight) {
        soundEngine.playError();
        w.leaving = true;
        w.el.style.setProperty('--wy', `${w.y}px`);
        w.el.style.setProperty('--rot', `${w.rot}deg`);
        w.el.classList.add('is-miss');
        setTimeout(() => { if (w.el) w.el.remove(); }, 320);
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
        const hit = this.fallingWords[i];
        hit.leaving = true;
        hit.el.style.setProperty('--wy', `${hit.y}px`);
        hit.el.style.setProperty('--rot', `${hit.rot}deg`);
        hit.el.classList.add('is-pop');
        this.spawnExplosionSparks(hit.x, hit.y);
        setTimeout(() => { if (hit.el) hit.el.remove(); }, 450);
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
    this.highlightTargetWords();
    this.updateGameHud();
    this.updateStatsDisplay();
  }

  spawnExplosionSparks(x, y) {
    if (!this.fallingArea) return;
    const colors = ['#F97316', '#FBBF24', '#38BDF8', '#FFFFFF', '#EF4444', '#A855F7'];
    for (let k = 0; k < 12; k++) {
      const spark = document.createElement('div');
      spark.className = 'wg-spark';
      spark.style.left = `${x + 68}px`;
      spark.style.top = `${y + 68}px`;
      const angle = (Math.PI * 2 * k) / 12 + (Math.random() * 0.4 - 0.2);
      const dist = Math.random() * 65 + 40;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      spark.style.setProperty('--tx', `${tx}px`);
      spark.style.setProperty('--ty', `${ty}px`);
      spark.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      spark.style.boxShadow = `0 0 10px ${spark.style.backgroundColor}`;
      this.fallingArea.appendChild(spark);
      setTimeout(() => { if (spark) spark.remove(); }, 600);
    }
  }

  highlightTargetWords() {
    const v = this.gameInput ? this.gameInput.value.trim() : '';
    if (!this.fallingWords) return;
    this.fallingWords.forEach((w) => {
      if (!w.el || w.leaving) return;
      w.el.classList.toggle('targeted', v.length > 0 && w.word.startsWith(v));
    });
  }

  updateGameHud() {
    this.gameScoreEl.textContent = this.gameScore;
    this.gameLevelEl.textContent = this.gameLevel;

    if (!this.gameLivesEl) return;
    let hearts = '';
    for (let i = 0; i < 5; i++) {
      if (i < this.gameLives) {
        hearts += '<img class="wg-heart" src="assets/game/heart.png" alt="">';
      } else {
        hearts += '<img class="wg-heart is-empty" src="assets/game/heart-empty.png" alt="">';
      }
    }
    this.gameLivesEl.innerHTML = hearts;
  }

  gameOver() {
    this.isGameOver = true;
    this.stopWordGameLoop();
    this.stopTimer();

    // Clean up falling words DOM elements
    if (this.fallingArea) this.fallingArea.innerHTML = '';
    this.fallingWords = [];

    this.modalTitle.textContent = '운석 방어 실패! ☄️';
    this.resCPM.textContent = `${this.gameScore} 점`;
    this.resMaxCPM.textContent = `레벨 ${this.gameLevel}`;
    this.resAcc.textContent = `${this.statAcc.textContent} %`;
    this.resTime.textContent = this.statTime.textContent;

    this.resultModal.classList.remove('hidden');
  }

  // --- MODE 4: COOKIE TYPING RUNNER (right-facing, sentence dash, IME-safe) ---
  startRunnerGame() {
    this.stopRunnerGameLoop();

    const selectedTitle = this.categorySelect ? this.categorySelect.value : '';
    this.currentNovel = TAJA_TEXTS.novels.find(n => n.title === selectedTitle) || TAJA_TEXTS.novels[0];

    this.runnerLineIndex = 0;
    this.runnerHP = 100;
    this.runnerDistance = 0;
    this.runnerScore = 0;
    this.runnerCombo = 0;
    this.runnerMaxCombo = 0;
    this.isGameOver = false;
    this.runnerJellies = [];
    this.runnerObstacles = [];
    this.lastCorrectLen = 0;
    this.runnerTypoLatched = false;
    this.runnerFallen = false;
    this.runnerComposing = false;
    this.runnerDashing = false;
    this.runnerWorldChanging = false;
    this.runnerStageIndex = 0;
    this.runnerHitUntil = 0;
    this.cookieFrame = 0;
    this.cookieFrameAcc = 0;
    this.lastFrameTs = 0;
    this.distAcc = 0;

    if (this.runnerJellyTrack) this.runnerJellyTrack.innerHTML = '';
    if (this.runnerObstacleTrack) this.runnerObstacleTrack.innerHTML = '';
    if (this.runnerCharWrap) {
      this.runnerCharWrap.classList.remove('is-dashing', 'is-hit', 'is-fallen', 'is-getting-up', 'is-world-exit', 'is-world-enter', 'is-world-arrive');
      this.runnerCharWrap.style.transform = '';
    }
    if (this.runnerWorld) this.runnerWorld.classList.remove('is-dashing', 'is-hurt');
    if (this.runnerHpJelly) {
      this.runnerHpJelly.classList.add('hidden');
      this.runnerHpJelly.classList.remove('is-eaten');
    }
    if (this.runnerChar) this.runnerChar.src = this.cookieFrames[0];
    this.applyRunnerWorld(0, false);

    this.updateRunnerHP(100);
    this.updateRunnerHud();
    this.renderRunnerTargetLine();

    setTimeout(() => {
      if (this.runnerInput) {
        this.runnerInput.value = '';
        this.runnerInput.focus();
      }
    }, 50);

    this.startTimer();
    this.startRunnerGameLoop();
    soundEngine.startRunnerBgm();
  }

  startRunnerGameLoop() {
    this.stopRunnerGameLoop(false);

    this.runnerHpDrainTimer = setInterval(() => {
      if (this.isGameOver || this.currentMode !== 'runner' || this.runnerWorldChanging) return;
      this.runnerHP -= this.getRunnerHpDrain();
      this.updateRunnerHP(this.runnerHP);
      if (this.runnerHP <= 0) this.runnerGameOver();
    }, 1000);

    this.runnerJellySpawnTimer = setInterval(() => this.spawnRunnerJellyTrail(), 1600);

    const tick = (ts) => {
      if (this.isGameOver || this.currentMode !== 'runner') return;
      const dt = this.lastFrameTs ? Math.min(48, ts - this.lastFrameTs) : 16;
      this.lastFrameTs = ts;
      this.stepRunnerWorld(dt);
      this.runnerAnimationId = requestAnimationFrame(tick);
    };
    this.runnerAnimationId = requestAnimationFrame(tick);
  }

  stopRunnerGameLoop(stopBgm = true) {
    if (this.runnerHpDrainTimer) clearInterval(this.runnerHpDrainTimer);
    if (this.runnerJellySpawnTimer) clearInterval(this.runnerJellySpawnTimer);
    if (this.runnerObstacleSpawnTimer) clearInterval(this.runnerObstacleSpawnTimer);
    if (this.runnerAnimationId) cancelAnimationFrame(this.runnerAnimationId);

    this.runnerHpDrainTimer = null;
    this.runnerJellySpawnTimer = null;
    this.runnerObstacleSpawnTimer = null;
    this.runnerAnimationId = null;
    if (stopBgm) soundEngine.stopRunnerBgm();
  }

  stepRunnerWorld(dt) {
    this.distAcc += dt;
    if (this.distAcc >= 180) {
      this.distAcc = 0;
      if (!this.runnerFallen) {
        this.runnerDistance += this.runnerDashing ? 3 : 1;
        this.updateRunnerHud();
      }
    }

    this.cookieFrameAcc += dt;
    const frameMs = this.runnerDashing ? 55 : 90;
    if (this.cookieFrameAcc >= frameMs && !this.runnerFallen && Date.now() > this.runnerHitUntil) {
      this.cookieFrameAcc = 0;
      this.cookieFrame = (this.cookieFrame + 1) % this.cookieFrames.length;
      if (this.runnerChar) this.runnerChar.src = this.cookieFrames[this.cookieFrame];
    }

    this.updateRunnerJellies();
  }

  renderRunnerTargetLine() {
    if (!this.currentNovel || !this.runnerStoryTarget) return;
    const line = this.currentNovel.lines[this.runnerLineIndex] || '';
    if (this.runnerStoryTitle) this.runnerStoryTitle.textContent = this.currentNovel.title;
    if (this.runnerStoryProgress) {
      this.runnerStoryProgress.textContent = `${this.runnerLineIndex + 1} / ${this.currentNovel.lines.length} 문장`;
    }
    this.lastCorrectLen = 0;
    this.runnerTypoLatched = false;
    this.updateRunnerTargetDisplay(line, this.runnerInput ? this.runnerInput.value : '');
  }

  decomposeHangul(ch) {
    if (!ch) return '';
    const code = ch.charCodeAt(0);
    if (code < 0xAC00 || code > 0xD7A3) return ch;
    const idx = code - 0xAC00;
    const cho = Math.floor(idx / 588);
    const jung = Math.floor((idx % 588) / 28);
    const jong = idx % 28;
    const choList = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
    const jungList = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
    const jongList = ' ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ';
    return choList[cho] + jungList[jung] + (jong > 0 ? jongList[jong] : '');
  }

  isValidTypingPrefix(input, target) {
    if (!input) return true;
    if (target.startsWith(input)) return true;
    const head = input.slice(0, -1);
    if (!target.startsWith(head)) return false;
    const next = target[head.length] || '';
    const last = input[input.length - 1];
    if (!next || last === next) return !!next && last === next;
    const dLast = this.decomposeHangul(last);
    const dNext = this.decomposeHangul(next);
    return dNext.startsWith(dLast) || dLast[0] === dNext[0];
  }

  getCommittedCorrectLen(input, target) {
    let n = 0;
    const max = Math.min(input.length, target.length);
    for (let i = 0; i < max; i++) {
      if (input[i] === target[i]) n++;
      else break;
    }
    return n;
  }

  updateRunnerTargetDisplay(targetLine, currentInput) {
    if (!this.runnerStoryTarget) return;
    this.runnerStoryTarget.innerHTML = '';

    for (let i = 0; i < targetLine.length; i++) {
      const span = document.createElement('span');
      const targetChar = targetLine[i];
      span.innerHTML = targetChar === ' ' ? '&nbsp;' : this.escapeHtml(targetChar);

      if (i < currentInput.length) {
        if (currentInput[i] === targetChar) {
          span.className = 'correct';
        } else if (i === currentInput.length - 1 && this.isValidTypingPrefix(currentInput, targetLine)) {
          span.className = 'current';
        } else {
          span.className = 'wrong';
        }
      } else if (i === currentInput.length) {
        span.className = 'current';
      }
      this.runnerStoryTarget.appendChild(span);
    }
  }

  handleRunnerTypingInput(e) {
    if (this.isGameOver || !this.currentNovel || !this.runnerInput) return;

    const targetLine = this.currentNovel.lines[this.runnerLineIndex] || '';
    const currentInput = this.runnerInput.value;
    this.updateRunnerTargetDisplay(targetLine, currentInput);

    const composing = this.runnerComposing || (e && e.isComposing);
    if (composing) return;

    const isDelete = e && e.inputType && e.inputType.indexOf('delete') === 0;
    if (isDelete || currentInput.length < this.lastCorrectLen) {
      this.lastCorrectLen = this.getCommittedCorrectLen(currentInput, targetLine);
      const stillWrong = !this.isValidTypingPrefix(currentInput, targetLine);
      this.runnerTypoLatched = stillWrong;
      if (!stillWrong) this.setRunnerFallen(false);
      this.updateStatsDisplay();
      return;
    }

    this.totalStrokes++;

    if (!this.isValidTypingPrefix(currentInput, targetLine)) {
      if (!this.runnerTypoLatched) {
        this.runnerTypoLatched = true;
        this.errorCount++;
        this.setRunnerFallen(true);
      }
      this.updateStatsDisplay();
      return;
    }

    this.setRunnerFallen(false);
    this.runnerTypoLatched = false;
    const committed = this.getCommittedCorrectLen(currentInput, targetLine);
    if (committed > this.lastCorrectLen) {
      const gained = committed - this.lastCorrectLen;
      this.lastCorrectLen = committed;
      this.correctStrokes += gained;
      this.runnerScore += gained;
      this.runnerDistance += 2 * gained;
      this.updateRunnerHud();
      this.checkWorldAdvance();
    }

    this.updateStatsDisplay();

    if (currentInput === targetLine && targetLine.length > 0) {
      this.handleRunnerLineSubmit();
    }
  }

  handleRunnerLineSubmit() {
    if (this.isGameOver || !this.currentNovel || !this.runnerInput) return;

    const targetLine = this.currentNovel.lines[this.runnerLineIndex] || '';
    const typed = this.runnerInput.value;
    if (typed !== targetLine) return;

    soundEngine.playCompleteLine();
    if (!this.runnerWorldChanging) this.beginJellyDash();

    this.runnerHP = Math.min(100, this.runnerHP + 20);
    this.updateRunnerHP(this.runnerHP);
    soundEngine.playHeal();

    this.runnerCombo++;
    if (this.runnerCombo > this.runnerMaxCombo) this.runnerMaxCombo = this.runnerCombo;
    this.runnerDistance += 40;

    if (this.runnerDashEffect) {
      this.runnerDashEffect.textContent = '문장 완성! 체력 +20';
      this.runnerDashEffect.classList.remove('hidden');
      setTimeout(() => {
        if (this.runnerDashEffect) this.runnerDashEffect.classList.add('hidden');
      }, 900);
    }

    this.runnerLineIndex++;
    if (this.runnerLineIndex >= this.currentNovel.lines.length) {
      this.runnerLineIndex = 0;
    }

    this.runnerInput.value = '';
    this.renderRunnerTargetLine();
    this.updateRunnerHud();
  }

  beginJellyDash() {
    this.runnerDashing = true;
    if (this.runnerWorld) this.runnerWorld.classList.add('is-dashing');
    if (this.runnerCharWrap) this.runnerCharWrap.classList.add('is-dashing');
    soundEngine.playDash();

    this.runnerJellies.forEach((j) => {
      if (!j.el) return;
      j.el.classList.add('is-eaten');
      setTimeout(() => { if (j.el) j.el.remove(); }, 360);
    });
    this.runnerJellies = [];

    setTimeout(() => {
      this.runnerDashing = false;
      if (this.runnerWorld) this.runnerWorld.classList.remove('is-dashing');
      if (this.runnerCharWrap) this.runnerCharWrap.classList.remove('is-dashing');
    }, 700);
  }

  setRunnerFallen(fallen) {
    if (this.runnerFallen === fallen) return;
    if (this.isGameOver || this.runnerWorldChanging) return;

    this.runnerFallen = fallen;
    if (!this.runnerCharWrap) return;

    if (fallen) {
      soundEngine.playCrash();
      this.runnerCombo = 0;
      this.updateRunnerHud();
      this.runnerCharWrap.classList.remove('is-dashing', 'is-getting-up', 'is-hit');
      this.runnerCharWrap.classList.add('is-fallen');
      if (this.runnerChar) this.runnerChar.src = 'assets/runner/gretel-hit.png';
      if (this.runnerCrashEffect) {
        this.runnerCrashEffect.textContent = '넘어졌어요! 문장을 고치면 일어납니다';
        this.runnerCrashEffect.classList.remove('hidden');
      }
      return;
    }

    this.runnerCharWrap.classList.remove('is-fallen');
    this.runnerCharWrap.classList.add('is-getting-up');
    setTimeout(() => {
      if (this.runnerCharWrap) this.runnerCharWrap.classList.remove('is-getting-up');
    }, 350);
    if (this.runnerCrashEffect) this.runnerCrashEffect.classList.add('hidden');
    if (this.runnerChar) this.runnerChar.src = this.cookieFrames[this.cookieFrame];
  }

  spawnRunnerJellyTrail() {
    if (this.isGameOver || this.currentMode !== 'runner' || this.runnerDashing || this.runnerWorldChanging || this.runnerFallen) return;
    if (!this.runnerJellyTrack || !this.runnerWorld) return;
    if (this.runnerJellies.length > 22) return;

    const kinds = [
      'assets/runner/snack-lollipop.png',
      'assets/runner/snack-cookie.png',
      'assets/runner/snack-candy.png',
      'assets/runner/snack-donut.png'
    ];
    const worldW = this.runnerWorld.clientWidth > 200 ? this.runnerWorld.clientWidth : 700;
    const worldH = this.runnerWorld.clientHeight > 100 ? this.runnerWorld.clientHeight : 240;
    const count = 3 + Math.floor(Math.random() * 3);
    
    // Bottom ground lane placement: directly along Gretel's running path
    const groundLaneY = worldH - 100 + (Math.random() * 12 - 6);
    const speed = 3.2 + Math.min(2.4, this.runnerCombo * 0.18) + this.runnerStageIndex * 0.28;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('img');
      el.className = 'cr-jelly';
      el.src = kinds[Math.floor(Math.random() * kinds.length)];
      el.alt = '과자';
      const x = worldW + 30 + i * 56;
      const y = groundLaneY;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      this.runnerJellyTrack.appendChild(el);
      this.runnerJellies.push({ el, x, y, speed, eaten: false });
    }
  }

  spawnJellySparkleBurst(x, y) {
    if (!this.runnerJellyTrack) return;
    const colors = ['#FDE047', '#F43F5E', '#38BDF8', '#A855F7', '#FFFFFF'];
    const count = 5;
    for (let i = 0; i < count; i++) {
      const sp = document.createElement('div');
      sp.className = 'cr-snack-sparkle';
      const ang = (i / count) * 2 * Math.PI + (Math.random() * 0.4);
      const dist = 24 + Math.random() * 22;
      const tx = Math.cos(ang) * dist;
      const ty = Math.sin(ang) * dist - 10;
      sp.style.setProperty('--tx', `${tx}px`);
      sp.style.setProperty('--ty', `${ty}px`);
      sp.style.backgroundColor = colors[i % colors.length];
      sp.style.left = `${x + 18}px`;
      sp.style.top = `${y + 14}px`;
      this.runnerJellyTrack.appendChild(sp);
      setTimeout(() => sp.remove(), 450);
    }
  }

  updateRunnerJellies() {
    if (!this.runnerJellies) return;
    const scroll = this.runnerDashing ? 9.5 : 3.2;

    // Gretel is at left: 8% (roughly x = 60 ~ 110px)
    const heroX = 85;

    for (let i = this.runnerJellies.length - 1; i >= 0; i--) {
      const j = this.runnerJellies[i];
      j.x -= j.speed || scroll;
      if (j.el) {
        j.el.style.left = `${j.x}px`;
        j.el.style.top = `${j.y}px`;
      }

      // Check if Gretel runs into the sweet snack on the ground (Cookie Run magnetic eating)
      if (!j.eaten && !this.runnerFallen && j.x <= heroX + 40 && j.x >= heroX - 25) {
        j.eaten = true;
        if (j.el) {
          j.el.classList.add('is-eaten');
          this.spawnJellySparkleBurst(j.x, j.y);
          if (this.runnerCharWrap) {
            this.runnerCharWrap.classList.add('is-nomming');
            setTimeout(() => {
              if (this.runnerCharWrap) this.runnerCharWrap.classList.remove('is-nomming');
            }, 180);
          }
          setTimeout(() => {
            if (j.el) j.el.remove();
          }, 380);
        }
      }

      if (j.x < -70) {
        if (j.el) j.el.remove();
        this.runnerJellies.splice(i, 1);
      }
    }
  }

  updateRunnerHP(hp) {
    this.runnerHP = Math.max(0, Math.min(100, hp));
    if (this.runnerHpFill) {
      this.runnerHpFill.style.width = `${this.runnerHP}%`;
      this.runnerHpFill.classList.toggle('is-low', this.runnerHP < 30);
    }
    if (this.runnerHpText) this.runnerHpText.textContent = `${Math.round(this.runnerHP)}`;
    if (this.runnerWorld) this.runnerWorld.classList.toggle('is-hurt', this.runnerHP < 30);
  }

  getRunnerHpDrain() {
    return 1 + Math.floor(Math.max(0, this.runnerScore) / 50);
  }

  applyRunnerWorld(index, animateBg) {
    this.runnerStageIndex = index;
    const world = this.runnerWorlds[index % this.runnerWorlds.length];
    if (!world) return;

    const paint = () => {
      if (this.runnerBg) this.runnerBg.style.backgroundImage = `url("${world.src}")`;
      if (this.runnerGround) this.runnerGround.style.borderTopColor = world.accent;
      if (this.runnerWorldNameEl) this.runnerWorldNameEl.textContent = world.name;
    };

    if (animateBg && this.runnerBg) {
      this.runnerBg.classList.add('is-fading');
      setTimeout(() => {
        paint();
        this.runnerBg.classList.remove('is-fading');
      }, 280);
    } else {
      paint();
    }
  }

  checkWorldAdvance() {
    if (this.runnerWorldChanging || this.isGameOver) return;
    const targetStage = Math.floor(this.runnerScore / 100);
    if (targetStage > this.runnerStageIndex) {
      this.beginWorldTransition(targetStage);
    }
  }

  spawnWorldHpJelly() {
    if (!this.runnerHpJelly) return;
    this.runnerHpJelly.classList.remove('hidden', 'is-eaten');
  }

  eatWorldHpJelly() {
    if (this.isGameOver || this.currentMode !== 'runner') return;
    if (this.runnerHpJelly) this.runnerHpJelly.classList.add('is-eaten');
    this.runnerHP = Math.min(100, this.runnerHP + 30);
    this.updateRunnerHP(this.runnerHP);
    soundEngine.playHeal();
    if (this.runnerWorldBanner) {
      const world = this.runnerWorlds[this.runnerStageIndex % this.runnerWorlds.length];
      this.runnerWorldBanner.textContent = `${world ? world.name : '새 세계'} 도착! 체력 +30`;
    }
    if (this.runnerDashEffect) {
      this.runnerDashEffect.textContent = '체력 젤리! +30';
      this.runnerDashEffect.classList.remove('hidden');
      setTimeout(() => {
        if (this.runnerDashEffect) this.runnerDashEffect.classList.add('hidden');
      }, 900);
    }
  }

  beginWorldTransition(targetStage) {
    if (this.runnerWorldChanging || this.isGameOver) return;
    this.runnerWorldChanging = true;
    this.runnerDashing = true;

    if (this.runnerWorld) this.runnerWorld.classList.add('is-dashing');
    if (this.runnerCharWrap) {
      this.runnerCharWrap.classList.remove('is-dashing', 'is-hit', 'is-fallen', 'is-getting-up', 'is-world-enter', 'is-world-arrive');
      this.runnerCharWrap.classList.add('is-world-exit');
    }
    soundEngine.playDash();

    this.runnerJellies.forEach((j) => {
      if (j.el) j.el.remove();
    });
    this.runnerJellies = [];

    setTimeout(() => {
      if (this.isGameOver || this.currentMode !== 'runner') {
        this.runnerWorldChanging = false;
        return;
      }

      this.applyRunnerWorld(targetStage, true);
      this.spawnWorldHpJelly();

      if (this.runnerCharWrap) {
        this.runnerCharWrap.classList.remove('is-world-exit');
        this.runnerCharWrap.classList.add('is-world-enter');
      }

      const world = this.runnerWorlds[targetStage % this.runnerWorlds.length];
      if (this.runnerWorldBanner) {
        this.runnerWorldBanner.textContent = `${world.name} 도착!`;
        this.runnerWorldBanner.classList.remove('hidden');
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (this.runnerCharWrap) {
            this.runnerCharWrap.classList.remove('is-world-enter');
            this.runnerCharWrap.classList.add('is-world-arrive');
          }
        });
      });

      setTimeout(() => this.eatWorldHpJelly(), 380);

      setTimeout(() => {
        if (this.runnerCharWrap) {
          this.runnerCharWrap.classList.remove('is-world-arrive', 'is-world-enter', 'is-world-exit');
        }
        if (this.runnerWorld) this.runnerWorld.classList.remove('is-dashing');
        if (this.runnerWorldBanner) this.runnerWorldBanner.classList.add('hidden');
        if (this.runnerHpJelly) {
          this.runnerHpJelly.classList.add('hidden');
          this.runnerHpJelly.classList.remove('is-eaten');
        }
        this.runnerDashing = false;
        this.runnerWorldChanging = false;
        this.updateRunnerHud();
        this.checkWorldAdvance();
      }, 1100);
    }, 800);
  }

  updateRunnerHud() {
    if (this.runnerDistanceEl) this.runnerDistanceEl.textContent = `${Math.floor(this.runnerDistance)} m`;
    if (this.runnerScoreEl) this.runnerScoreEl.textContent = this.runnerScore;
    if (this.runnerComboEl) this.runnerComboEl.textContent = `${this.runnerCombo}x`;
    if (this.runnerDrainEl) this.runnerDrainEl.textContent = `-${this.getRunnerHpDrain()}`;
    const world = this.runnerWorlds[this.runnerStageIndex % this.runnerWorlds.length];
    if (this.runnerWorldNameEl && world) this.runnerWorldNameEl.textContent = world.name;
  }

  runnerGameOver() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.stopRunnerGameLoop();
    this.stopTimer();

    if (this.runnerJellyTrack) this.runnerJellyTrack.innerHTML = '';
    if (this.runnerObstacleTrack) this.runnerObstacleTrack.innerHTML = '';
    this.runnerJellies = [];
    this.runnerObstacles = [];

    soundEngine.playCrash();
    this.modalTitle.textContent = '체력 고갈! 질주 종료';
    this.resCPM.textContent = `${Math.floor(this.runnerDistance)} m`;
    this.resMaxCPM.textContent = `${this.runnerScore} 점 (${this.runnerMaxCombo}x 최고 콤보)`;
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

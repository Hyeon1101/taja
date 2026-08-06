# GDD-001: Hancom Taja Typing Practice & Game Design Specification

## 🎮 Game Overview & Pillars
- **Game Title**: Hancom Taja Typing Practice (한컴 타자 연습)
- **Target Audience**: Korean typing learners, casual arcade gamers, students, and office workers.
- **Design Pillars**:
  1. **Feedback & Accuracy First**: Immediate visual feedback for correct/incorrect key strikes and live CPM (Characters Per Minute) calculations.
  2. **Authentic Nostalgic Experience**: Visual theme and layout inspired by Hancom Taja (`https://tt.hancomtaja.com/`).
  3. **Multi-Mode Engagement**: Seamless transition between structured learning (Short/Long Text) and high-action arcade gaming (Word Rain).

---

## 🔁 Core Loop & Mechanics

### 0. Game Start / Landing Screen
- **Input**: User clicks on one of three premium mode cards (Short, Long, Game) featuring custom thumbnail covers.
- **Feedback**: Magnetic hover effects on cards, glass morphism aesthetics, and a smooth slide-out transition revealing the main game stage.
- **Completion**: Mode initializes only after selection, triggering an encouraging chime sound.
### 1. Short Sentence Practice (단문 연습)
- **Input**: User types single-line sentences (e.g. proverbs, famous quotes).
- **Feedback**: Real-time character highlighting (Green/Normal for correct, Red with highlight for error, Pulsing Yellow underline for current character).
- **Completion**: Pressing `Enter` advances to the next sentence with a 3-note harmonic chime.
- **Tuning**: 10~20 sentences per session.

### 2. Long Text Practice (장문 연습)
- **Input**: Multi-line classics (애국가, 별 헤는 밤, 청포도, 훈민정음 어제 서문).
- **View**: Displays 4 lines at a time with automatic line scrolling upon pressing `Enter`.
- **Tuning**: Calculates continuous CPM based on total Korean jamo/keystroke estimations.

### 3. Word Drop Game (낱말 게임)
- **Input**: Words spawn at random X coordinates and fall vertically toward the bottom boundary.
- **Objective**: Type the exact word in the input box and hit `Enter` to destroy the bubble before it reaches the floor.
- **Progression**:
  - Score +100 per destroyed word.
  - Speed & spawn rate increase every 500 points (Level Up).
  - 5 Hearts total life system; losing a heart triggers error sound FX.

---

## 📊 Live Statistics Engine (진행중 통계)
- **Elapsed Time**: `MM:SS` timer updated every 500ms.
- **CPM (Speed)**: `(Correct Keystrokes / Elapsed Seconds) * 60`.
- **Accuracy (%)**: `(Correct Keystrokes / (Total Keystrokes + Errors)) * 100`.
- **Error Counter**: Real-time counter of missed characters or words.

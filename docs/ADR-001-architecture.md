# ADR-001: Architecture Decision Record - Modular Browser-Native Game Architecture

## Status
Accepted

## Context
The goal is to build a responsive, zero-dependency, high-performance web application mimicking Hancom Taja (`tt.hancomtaja.com`) that can run directly in any browser and deploy seamlessly to GitHub Pages.

## Decision
1. **Frontend Core**: Standard HTML5, CSS3 (Vanilla CSS with CSS Variables), and ES6 JavaScript modules.
2. **Audio Subsystem**: Web Audio API (`SoundEngine`) synthesized sound effects (mechanical keyboard click, chime, error buzz, explosion) eliminating external MP3 network dependencies and latency.
3. **State Management**: Event-driven `HancomTajaApp` class acting as Orchestrator for tab routing, real-time stat timers, virtual keyboard key highlights, and falling word physics loops.
4. **Zero Build Step**: Native ES6 browser execution ensuring instant GitHub Pages compatibility without complex bundler pipelines.

## Consequences
- **Pros**: Zero initial loading delay, instant static hosting on GitHub Pages, offline support, lightweight bundle size (< 100KB).
- **Cons**: Advanced 3D rendering or complex physics are limited, but perfect for 2D typing arcade games.

## Premium UI/UX Design System
1. **Design Philosophy**: Implements "Senior Developer" premium aesthetics.
2. **Core Techniques**: Uses CSS Glass Morphism (`backdrop-filter: blur(30px) saturate(150%)`), custom gradients, and 60fps cubic-bezier transitions for magnetic hover effects.
3. **State Machine**: Enhanced `HancomTajaApp` orchestrator starts in a `LandingScreen` state, overriding the main stage until the user selects a specific training mode.

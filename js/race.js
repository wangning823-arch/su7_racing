import { CONFIG } from './config.js';

export class RaceManager {
  constructor() {
    this.state = 'MENU';
    this.countdownTime = 0;
    this.raceTime = 0;
    this.karts = [];
    this.finishedKarts = [];
    this.numCheckpoints = 10;
    this.totalLaps = CONFIG.totalLaps;
  }

  startCountdown() {
    this.state = 'COUNTDOWN';
    this.countdownTime = 3.5;
    this.raceTime = 0;
    this.finishedKarts = [];
    for (const k of this.karts) {
      k.lap = 0;
      k.checkpoint = 0;
      k.totalCheckpoints = 0;
      k.finished = false;
      k.finishTime = 0;
    }
  }

  update(dt) {
    if (this.state === 'COUNTDOWN') {
      this.countdownTime -= dt;
      if (this.countdownTime <= 0) this.state = 'RACING';
    }
    if (this.state === 'RACING') {
      this.raceTime += dt;
      this.updatePositions();
      this.checkFinish();
    }
  }

  updateCheckpoints(kart) {
    if (kart.finished) return;
    kart.currentSplineT = kart.physics.currentSplineT;
    const bestT = kart.currentSplineT;

    // Checkpoint logic
    const cpIdx = Math.floor(bestT * this.numCheckpoints) % this.numCheckpoints;
    if (cpIdx !== kart.checkpoint) {
      if (cpIdx === (kart.checkpoint + 1) % this.numCheckpoints) {
        kart.checkpoint = cpIdx;
        kart.totalCheckpoints++;
        if (cpIdx === 0 && kart.totalCheckpoints >= this.numCheckpoints) {
          kart.lap++;
          if (kart.lap >= this.totalLaps) {
            kart.finished = true;
            kart.finishTime = this.raceTime;
            this.finishedKarts.push(kart);
          }
        }
      }
    }
  }

  updatePositions() {
    const sorted = [...this.karts].sort((a, b) => {
      if (a.finished && !b.finished) return -1;
      if (!a.finished && b.finished) return 1;
      if (a.finished && b.finished) return a.finishTime - b.finishTime;
      if (a.lap !== b.lap) return b.lap - a.lap;
      return b.totalCheckpoints - a.totalCheckpoints;
    });
    sorted.forEach((k, i) => { k.position = i + 1; });
  }

  checkFinish() {
    if (this.finishedKarts.length >= this.karts.length) {
      this.state = 'FINISHED';
    }
    // Auto-finish after max time
    if (this.raceTime > 300) {
      this.state = 'FINISHED';
    }
  }

  getRankText(kart) {
    return `#${kart.position} / ${this.karts.length}`;
  }

  getTimeText(time) {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 100);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  }
}

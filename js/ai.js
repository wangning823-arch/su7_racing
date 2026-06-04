import { CONFIG } from './config.js';

export class AIController {
  constructor(difficulty, track) {
    this.track = track;
    this.speedCoeff = CONFIG.aiSpeeds[difficulty];
    this.lookahead = CONFIG.aiLookaheads[difficulty];
    this.nearestIdx = 0;
    this.difficulty = difficulty;
  }

  getInput(kart) {
    const pos = kart.physics.chassisBody.position;
    const vel = kart.physics.chassisBody.velocity;
    const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z);

    // Find nearest waypoint
    let minDist = Infinity;
    const wps = this.track.waypoints;
    const searchStart = (this.nearestIdx - 25 + wps.length) % wps.length;
    for (let j = 0; j < 50; j++) {
      const idx = (searchStart + j) % wps.length;
      const wp = wps[idx];
      const d = Math.sqrt((pos.x - wp.pos.x) ** 2 + (pos.z - wp.pos.z) ** 2);
      if (d < minDist) { minDist = d; this.nearestIdx = idx; }
    }

    // Look ahead
    const lookIdx = (this.nearestIdx + this.lookahead) % wps.length;
    const target = wps[lookIdx].pos;

    // Steering via cross product — heading-convention independent
    const dx = target.x - pos.x;
    const dz = target.z - pos.z;
    const fwdX = Math.sin(kart.physics.heading);
    const fwdZ = Math.cos(kart.physics.heading);
    const cross = fwdX * dz - fwdZ * dx;
    const dot = fwdX * dx + fwdZ * dz;
    const errAngle = Math.atan2(cross, dot);
    const steer = Math.max(-1, Math.min(1, errAngle * 1.0));

    // Throttle/brake — use nearby waypoint curvature
    const nearIdx = (this.nearestIdx + 3) % wps.length;
    const nearPt = wps[nearIdx].pos;
    const ndx = nearPt.x - pos.x;
    const ndz = nearPt.z - pos.z;
    const nCross = fwdX * ndz - fwdZ * ndx;
    const nDot = fwdX * ndx + fwdZ * ndz;
    const nearErrAngle = Math.abs(Math.atan2(nCross, nDot));
    const nearDist = Math.sqrt(ndx * ndx + ndz * ndz);
    const curvature = nearErrAngle / (nearDist + 1) * 100;
    let throttle = this.speedCoeff;
    let brake = 0;

    if (curvature > 3 && speed > 15) {
      brake = 0.5;
      throttle = 0.3;
    }
    if (curvature > 6) {
      brake = 0.8;
      throttle = 0.1;
    }

    // Rubber band
    if (kart.position > 3) throttle *= 1.1;
    if (kart.position <= 1) throttle *= 0.95;

    return {
      throttle: Math.max(0, Math.min(1, throttle)),
      brake: Math.max(0, Math.min(1, brake)),
      steer,
      drift: false
    };
  }
}

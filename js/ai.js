import { CONFIG } from './config.js?v=2';

export class AIController {
  constructor(difficulty, track) {
    this.track = track;
    this.speedCoeff = CONFIG.aiSpeeds[difficulty];
    this.lookahead = CONFIG.aiLookaheads[difficulty];
    this.difficulty = difficulty;
    this.frameCount = 0;
    this.splineT = 0;
  }

  initPosition(pos) {
    // Find closest spline parameter by brute force
    const sp = this.track.spline;
    let bestT = 0;
    let bestDist = Infinity;
    for (let t = 0; t < 1; t += 0.005) {
      const p = sp.getPointAt(t);
      const d = (pos.x - p.x) ** 2 + (pos.z - p.z) ** 2;
      if (d < bestDist) { bestDist = d; bestT = t; }
    }
    // Refine
    const step = 0.005;
    for (let t = Math.max(0, bestT - step); t <= Math.min(1, bestT + step); t += 0.0005) {
      const p = sp.getPointAt(t);
      const d = (pos.x - p.x) ** 2 + (pos.z - p.z) ** 2;
      if (d < bestDist) { bestDist = d; bestT = t; }
    }
    this.splineT = bestT;
    this.frameCount = 0;
  }

  getInput(kart) {
    const pos = kart.physics.chassisBody.position;
    const speed = Math.sqrt(
      kart.physics.chassisBody.velocity.x ** 2 +
      kart.physics.chassisBody.velocity.z ** 2
    );
    const heading = kart.physics.heading;
    const hfwdX = Math.sin(heading);
    const hfwdZ = Math.cos(heading);
    const sp = this.track.spline;

    this.frameCount++;

    // Step 1: Update splineT — find closest point on spline
    let bestT = this.splineT;
    let bestDist = Infinity;
    // Search near current t (small window for efficiency)
    for (let dt = -0.02; dt <= 0.02; dt += 0.001) {
      let t = (this.splineT + dt + 1) % 1;
      const p = sp.getPointAt(t);
      const d = (pos.x - p.x) ** 2 + (pos.z - p.z) ** 2;
      if (d < bestDist) { bestDist = d; bestT = t; }
    }
    this.splineT = bestT;

    // Step 2: Get track tangent at current position (forward direction)
    const tangent = sp.getTangentAt(this.splineT);
    const tFwdX = tangent.x;
    const tFwdZ = tangent.z;

    // Step 3: Target = a point ahead on the spline
    // Look ahead proportional to speed
    const lookAheadT = Math.max(0.01, Math.min(0.05, speed * 0.001 + 0.01));
    const targetT = (this.splineT + lookAheadT) % 1;
    const target = sp.getPointAt(targetT);

    // Step 4: Steering — align kart heading with track tangent
    // Use cross product to determine turn direction
    const dx = target.x - pos.x;
    const dz = target.z - pos.z;
    const cross = hfwdZ * dx - hfwdX * dz;
    const dot = hfwdX * dx + hfwdZ * dz;
    const errAngle = Math.atan2(cross, dot);
    const steer = Math.max(-1, Math.min(1, errAngle));

    // Throttle / brake
    let throttle = this.speedCoeff;
    let brake = 0;

    // Startup: first 40 frames, gentle steering
    if (this.frameCount < 40) {
      const startupSteer = Math.max(-0.3, Math.min(0.3, errAngle * 0.3));
      return {
        throttle: Math.max(0, Math.min(1, throttle)),
        brake: 0,
        steer: startupSteer,
        drift: false
      };
    }

    if (Math.abs(errAngle) > 0.4) {
      throttle *= 0.5;
    }
    if (Math.abs(errAngle) > 0.8) {
      brake = 0.5;
      throttle = 0.1;
    }

    return {
      throttle: Math.max(0, Math.min(1, throttle)),
      brake: Math.max(0, Math.min(1, brake)),
      steer,
      drift: false
    };
  }
}

import { KartPhysics } from './physics.js';
import { KartRenderer } from './kart-renderer.js';
import { CONFIG } from './config.js';

export class Kart {
  constructor(scene, world, startPos, startAngle, color, index, isPlayer = false, track = null) {
    this.index = index;
    this.isPlayer = isPlayer;
    this.name = CONFIG.kartNames[index];
    this.color = color;
    this.physics = new KartPhysics(world, startPos, startAngle, track);
    this.renderer = new KartRenderer(scene, color);
    this.lap = 0;
    this.checkpoint = 0;
    this.lastCheckpointTime = 0;
    this.totalCheckpoints = 0;
    this.finished = false;
    this.finishTime = 0;
    this.position = index + 1;
    this.currentSplineT = 0;
  }

  update(input, dt) {
    this.physics.update(input.throttle, input.brake, input.steer, input.drift, dt);
    this.renderer.update(this.physics);
  }

  reset(pos, angle) {
    this.physics.reset(pos, angle);
  }
}

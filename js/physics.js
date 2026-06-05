import * as CANNON from 'cannon-es';
import { CONFIG } from './config.js?v=2';

export class KartPhysics {
  constructor(world, startPos, startAngle, track, mass = CONFIG.kartMass) {
    this.world = world;
    this.track = track;
    this.mass = mass;
    const chassisShape = new CANNON.Box(new CANNON.Vec3(CONFIG.chassisW / 2, CONFIG.chassisH / 2, CONFIG.chassisL / 2));
    this.chassisBody = new CANNON.Body({ mass, material: new CANNON.Material({ friction: 0.8 }) });
    this.chassisBody.addShape(chassisShape);
    this.chassisBody.position.set(startPos.x, startPos.y + 0.5, startPos.z);
    this.chassisBody.linearDamping = 0.01;
    this.chassisBody.angularDamping = 0.99;

    const q = new CANNON.Quaternion();
    q.setFromEuler(0, startAngle, 0);
    this.chassisBody.quaternion.copy(q);

    this.heading = startAngle;
    world.addBody(this.chassisBody);

    this.speed = 0;
    this.isDrifting = false;
    this.currentSplineT = 0;
  }

  update(throttle, brake, steer, drift, dt) {
    const vel = this.chassisBody.velocity;
    this.speed = Math.sqrt(vel.x * vel.x + vel.z * vel.z);

    // Steering
    if (this.speed > 0.5) {
      const speedRatio = this.speed / CONFIG.maxSpeed;
      const steerLimit = CONFIG.steerAngle * (1 - speedRatio * 0.3);
      const steerInput = steer * steerLimit;
      const turnAmount = steerInput * 5.0 * Math.min(1, this.speed / 8);
      this.heading += turnAmount * dt;
    }

    // Apply heading as quaternion
    const headingQuat = new CANNON.Quaternion();
    headingQuat.setFromEuler(0, this.heading, 0);
    this.chassisBody.quaternion.copy(headingQuat);

    // Forward direction
    const fwdX = Math.sin(this.heading);
    const fwdZ = Math.cos(this.heading);

    // Engine: direct velocity change
    const speedRatio = this.speed / CONFIG.maxSpeed;
    if (throttle > 0) {
      const accel = (CONFIG.engineForce / this.mass) * throttle * (1 - speedRatio * speedRatio);
      vel.x += fwdX * accel * dt;
      vel.z += fwdZ * accel * dt;
    }

    // Braking: direct velocity change opposing motion
    if (brake > 0 && this.speed > 0.1) {
      const brakeDecel = this.speed > 3 ? (CONFIG.brakeForce / this.mass) * 15 * brake : (CONFIG.brakeForce / this.mass) * 5 * brake;
      const vLen = this.speed;
      vel.x -= (vel.x / vLen) * brakeDecel * dt;
      vel.z -= (vel.z / vLen) * brakeDecel * dt;
    }

    // Lateral friction: remove sideways velocity + prevent backward motion
    if (this.speed > 0.5) {
      const fwdDot = vel.x * fwdX + vel.z * fwdZ;
      const projX = fwdX * fwdDot;
      const projZ = fwdZ * fwdDot;
      const sideX = vel.x - projX;
      const sideZ = vel.z - projZ;
      const keep = this.isDrifting ? 0.95 : 0.1;

      if (fwdDot >= 0) {
        // Moving forward: keep forward + small lateral
        vel.x = projX + sideX * keep;
        vel.z = projZ + sideZ * keep;
      } else {
        // Moving backward: zero out backward component (prevent reverse)
        vel.x = sideX * keep;
        vel.z = sideZ * keep;
      }
    }

    this.isDrifting = drift && this.speed > 8;
  }

  postUpdate() {
    const info = this.getTrackInfo();
    const pos = this.chassisBody.position;

    const groundY = info.height + 0.4;
    if (pos.y < groundY) {
      pos.y = groundY;
      this.chassisBody.position = pos;
      if (this.chassisBody.velocity.y < 0) {
        this.chassisBody.velocity.y *= 0.3;
      }
    }

    const halfTrack = CONFIG.trackWidth / 2 - 1.0;
    if (Math.abs(info.lateralOffset) > halfTrack) {
      const pushDir = info.lateralOffset > 0 ? -1 : 1;
      const overshoot = Math.abs(info.lateralOffset) - halfTrack;
      pos.x += info.right.x * pushDir * overshoot * 0.5;
      pos.z += info.right.z * pushDir * overshoot * 0.5;
      this.chassisBody.position = pos;

      const vel = this.chassisBody.velocity;
      const latVel = vel.x * info.right.x + vel.z * info.right.z;
      vel.x -= info.right.x * latVel;
      vel.z -= info.right.z * latVel;
    }

    this.chassisBody.angularVelocity.y *= 0.8;
  }

  getTrackInfo() {
    const pos = this.chassisBody.position;
    let minDist = Infinity;
    let bestT = 0;
    if (this.track && this.track.spline) {
      const sp = this.track.spline;
      for (let t = 0; t < 1; t += 0.005) {
        const p = sp.getPointAt(t);
        const d = (pos.x - p.x) ** 2 + (pos.z - p.z) ** 2;
        if (d < minDist) { minDist = d; bestT = t; }
      }
      minDist = Math.sqrt(minDist);
      const step = 0.005;
      const lo = Math.max(0, bestT - step);
      const hi = Math.min(1, bestT + step);
      for (let t = lo; t <= hi; t += 0.0005) {
        const p = sp.getPointAt(t);
        const d = Math.sqrt((pos.x - p.x) ** 2 + (pos.z - p.z) ** 2);
        if (d < minDist) { minDist = d; bestT = t; }
      }
    }
    this.currentSplineT = bestT;
    const nearest = this.track.spline.getPointAt(bestT);
    const tangent = this.track.spline.getTangentAt(bestT);
    const right = { x: tangent.z, y: 0, z: -tangent.x };
    const dx = pos.x - nearest.x;
    const dz = pos.z - nearest.z;
    const lateralOffset = dx * right.x + dz * right.z;
    return { height: nearest.y, nearest, tangent, right, lateralOffset };
  }

  getTrackHeight() {
    return this.getTrackInfo().height;
  }

  reset(pos, angle) {
    this.heading = angle;
    this.chassisBody.position.set(pos.x, pos.y + 0.5, pos.z);
    this.chassisBody.velocity.set(0, 0, 0);
    this.chassisBody.angularVelocity.set(0, 0, 0);
    const q = new CANNON.Quaternion();
    q.setFromEuler(0, angle, 0);
    this.chassisBody.quaternion.copy(q);
  }
}

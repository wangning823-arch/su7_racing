import * as THREE from 'three';
import { CONFIG } from './config.js?v=2';

export class CameraController {
  constructor(camera) {
    this.camera = camera;
    this.offset = new THREE.Vector3(0, CONFIG.cameraHeight, -CONFIG.cameraDistance);
    this.lookOffset = new THREE.Vector3(0, 1, 5);
  }

  update(targetKart, dt) {
    const b = targetKart.physics.chassisBody;
    const pos = new THREE.Vector3(b.position.x, b.position.y, b.position.z);
    const heading = targetKart.physics.heading;
    const quat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, heading, 0, 'YXZ'));

    const desiredPos = this.offset.clone().applyQuaternion(quat).add(pos);
    const lookAt = this.lookOffset.clone().applyQuaternion(quat).add(pos);

    const lerp = 1 - Math.pow(0.06, dt * 60);
    this.camera.position.lerp(desiredPos, lerp);

    const currentLook = new THREE.Vector3();
    this.camera.getWorldDirection(currentLook);
    currentLook.multiplyScalar(10).add(this.camera.position);
    currentLook.lerp(lookAt, lerp);
    this.camera.lookAt(lookAt);

    const speed = targetKart.physics.speed;
    const targetFov = 60 + (speed / CONFIG.maxSpeed) * 15;
    this.camera.fov += (targetFov - this.camera.fov) * lerp;
    this.camera.updateProjectionMatrix();
  }
}

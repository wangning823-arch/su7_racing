import * as THREE from 'three';

export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    this.sharedGeo = new THREE.SphereGeometry(0.3, 6, 6);
    this.emitTimer = 0;
  }

  emitDriftSmoke(position) {
    this.emitTimer += 0.016;
    if (this.emitTimer < 0.05) return;
    this.emitTimer = 0;

    const mat = new THREE.MeshBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.5 });
    const mesh = new THREE.Mesh(this.sharedGeo, mat);
    mesh.position.copy(position);
    mesh.position.y += 0.2;
    this.scene.add(mesh);
    this.particles.push({ mesh, life: 1.0, vy: 0.5 });
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt * 2;
      p.mesh.position.y += p.vy * dt;
      p.mesh.material.opacity = Math.max(0, p.life * 0.5);
      const s = 1 + (1 - p.life) * 2;
      p.mesh.scale.set(s, s, s);
      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        p.mesh.material.dispose();
        this.particles.splice(i, 1);
      }
    }
  }
}

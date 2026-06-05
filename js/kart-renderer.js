import * as THREE from 'three';
import { CONFIG } from './config.js?v=2';

export class KartRenderer {
  constructor(scene, color) {
    this.group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.25, metalness: 0.75 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.05, metalness: 0.95 });
    const carbonMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4, metalness: 0.3 });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.15, metalness: 0.9 });
    const driverMat = new THREE.MeshStandardMaterial({ color: 0xffcc99 });
    const visorMat = new THREE.MeshStandardMaterial({ color: 0x111133, roughness: 0.05, metalness: 0.8, transparent: true, opacity: 0.85 });

    const W = CONFIG.chassisW;
    const H = CONFIG.chassisH;
    const L = CONFIG.chassisL;

    // NOTE: +Z = front (nose), -Z = rear (wing) — matches kart forward direction

    // ── NOSE CONE (front, +Z) ──
    const noseGeo = new THREE.BoxGeometry(W * 0.5, H * 0.7, L * 0.35);
    noseGeo.translate(0, 0, L * 0.3);
    const nose = new THREE.Mesh(noseGeo, mat);
    nose.position.set(0, 0.15, 0);
    nose.castShadow = true;
    this.group.add(nose);

    // Nose tip - tapered cone
    const tipGeo = new THREE.ConeGeometry(W * 0.2, L * 0.18, 4);
    tipGeo.rotateX(Math.PI / 2);
    const tip = new THREE.Mesh(tipGeo, mat);
    tip.position.set(0, 0.15, L * 0.53);
    tip.castShadow = true;
    this.group.add(tip);

    // Nose pillars
    for (let x of [-W * 0.15, W * 0.15]) {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.07, L * 0.18), carbonMat);
      pillar.position.set(x, 0.11, L * 0.22);
      this.group.add(pillar);
    }

    // ── FRONT WING (front, +Z) ──
    const fwGeo = new THREE.BoxGeometry(W * 1.9, 0.025, 0.14);
    const fw = new THREE.Mesh(fwGeo, carbonMat);
    fw.position.set(0, 0.07, L * 0.5);
    fw.castShadow = true;
    this.group.add(fw);

    // Front wing flaps (multi-element)
    for (let i = 0; i < 2; i++) {
      const flap = new THREE.Mesh(
        new THREE.BoxGeometry(W * 1.7, 0.015, 0.04),
        carbonMat
      );
      flap.position.set(0, 0.09 + i * 0.022, L * 0.48 - i * 0.03);
      flap.rotation.x = 0.15 + i * 0.1;
      this.group.add(flap);
    }

    // Front wing endplates
    for (let side of [-1, 1]) {
      const ep = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.1, 0.2), carbonMat);
      ep.position.set(side * W * 0.92, 0.11, L * 0.5);
      this.group.add(ep);
      const strake = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.055, 0.1), carbonMat);
      strake.position.set(side * W * 0.55, 0.09, L * 0.5);
      this.group.add(strake);
    }

    // ── MAIN CHASSIS / MONOCOQUE ──
    const bodyGeo = new THREE.BoxGeometry(W, H * 1.2, L * 0.55);
    bodyGeo.translate(0, 0, -L * 0.02);
    const body = new THREE.Mesh(bodyGeo, mat);
    body.position.set(0, 0.18, 0);
    body.castShadow = true;
    this.group.add(body);

    // Chassis top taper
    const topGeo = new THREE.BoxGeometry(W * 0.82, H * 0.35, L * 0.32);
    topGeo.translate(0, 0, -L * 0.05);
    const topCover = new THREE.Mesh(topGeo, mat);
    topCover.position.set(0, 0.35, 0);
    this.group.add(topCover);

    // ── SIDE PODS ──
    for (let side of [-1, 1]) {
      const podGeo = new THREE.BoxGeometry(W * 0.36, H * 1.4, L * 0.38);
      podGeo.translate(0, 0, -L * 0.02);
      const pod = new THREE.Mesh(podGeo, mat);
      pod.position.set(side * W * 0.58, 0.17, 0);
      pod.castShadow = true;
      this.group.add(pod);

      const podTop = new THREE.Mesh(
        new THREE.BoxGeometry(W * 0.33, 0.04, L * 0.32),
        mat
      );
      podTop.position.set(side * W * 0.58, 0.34, -L * 0.02);
      this.group.add(podTop);

      const intakeGeo = new THREE.BoxGeometry(W * 0.28, H * 0.8, 0.04);
      const intake = new THREE.Mesh(intakeGeo, darkMat);
      intake.position.set(side * W * 0.58, 0.19, L * 0.14);
      this.group.add(intake);

      for (let j = 0; j < 3; j++) {
        const louver = new THREE.Mesh(
          new THREE.BoxGeometry(0.015, 0.025, 0.06),
          darkMat
        );
        louver.position.set(side * W * 0.75, 0.16 + j * 0.045, -L * 0.02 - j * 0.06);
        this.group.add(louver);
      }
    }

    // ── COCKPIT ──
    const cockpitGeo = new THREE.BoxGeometry(W * 0.5, H * 0.22, L * 0.2);
    const cockpit = new THREE.Mesh(cockpitGeo, darkMat);
    cockpit.position.set(0, 0.37, L * 0.05);
    this.group.add(cockpit);

    const seatGeo = new THREE.BoxGeometry(W * 0.38, H * 0.5, L * 0.16);
    const seat = new THREE.Mesh(seatGeo, darkMat);
    seat.position.set(0, 0.24, L * 0.05);
    this.group.add(seat);

    // ── HALO ──
    const haloGroup = new THREE.Group();
    const haloTopGeo = new THREE.TorusGeometry(0.17, 0.022, 8, 12, Math.PI);
    const haloTop = new THREE.Mesh(haloTopGeo, chromeMat);
    haloTop.rotation.y = Math.PI / 2;
    haloTop.rotation.z = Math.PI;
    haloTop.position.set(0, 0.50, L * 0.08);
    haloGroup.add(haloTop);

    const haloLPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.17, 6), chromeMat);
    haloLPillar.position.set(-W * 0.2, 0.42, L * 0.08);
    haloGroup.add(haloLPillar);

    const haloRPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.17, 6), chromeMat);
    haloRPillar.position.set(W * 0.2, 0.42, L * 0.08);
    haloGroup.add(haloRPillar);

    const haloCPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.12, 6), chromeMat);
    haloCPillar.position.set(0, 0.44, L * 0.18);
    haloCPillar.rotation.x = -0.5;
    haloGroup.add(haloCPillar);

    const haloRP = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.1, 6), chromeMat);
    haloRP.position.set(0, 0.44, -L * 0.02);
    haloRP.rotation.x = 0.4;
    haloGroup.add(haloRP);
    this.group.add(haloGroup);

    // ── DRIVER ──
    const torso = new THREE.Mesh(new THREE.BoxGeometry(W * 0.28, H * 1.3, L * 0.1), mat);
    torso.position.set(0, 0.30, L * 0.04);
    this.group.add(torso);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), driverMat);
    head.position.set(0, 0.47, L * 0.06);
    this.group.add(head);

    const helmetGeo = new THREE.SphereGeometry(0.12, 10, 10);
    const helmet = new THREE.Mesh(helmetGeo, mat);
    helmet.position.set(0, 0.48, L * 0.06);
    helmet.scale.set(1, 0.85, 1.1);
    this.group.add(helmet);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(W * 0.17, 0.04, 0.06), visorMat);
    visor.position.set(0, 0.47, L * 0.16);
    visor.rotation.x = -0.15;
    this.group.add(visor);

    // ── AIRBOX ──
    const airboxGeo = new THREE.BoxGeometry(W * 0.24, H * 0.65, L * 0.1);
    const airbox = new THREE.Mesh(airboxGeo, mat);
    airbox.position.set(0, 0.47, -L * 0.02);
    this.group.add(airbox);
    const airIntake = new THREE.Mesh(new THREE.BoxGeometry(W * 0.19, H * 0.35, 0.02), darkMat);
    airIntake.position.set(0, 0.49, L * 0.03);
    this.group.add(airIntake);

    // ── ENGINE COVER (rear, -Z) ──
    const engGeo = new THREE.BoxGeometry(W * 0.72, H * 1.1, L * 0.26);
    engGeo.translate(0, 0, -L * 0.24);
    const engCover = new THREE.Mesh(engGeo, mat);
    engCover.position.set(0, 0.28, 0);
    engCover.castShadow = true;
    this.group.add(engCover);

    // Shark fin
    const finGeo = new THREE.BoxGeometry(0.02, H * 1.3, L * 0.18);
    const fin = new THREE.Mesh(finGeo, mat);
    fin.position.set(0, 0.42, -L * 0.3);
    this.group.add(fin);

    // Exhaust pipes
    for (let side of [-1, 1]) {
      const exhaust = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.04, 0.08, 8),
        chromeMat
      );
      exhaust.rotation.x = Math.PI / 2;
      exhaust.position.set(side * 0.12, 0.18, -L * 0.44);
      this.group.add(exhaust);
    }

    // ── REAR WING (rear, -Z) ──
    const rwGeo = new THREE.BoxGeometry(W * 1.7, 0.06, 0.08);
    const rw = new THREE.Mesh(rwGeo, carbonMat);
    rw.position.set(0, 0.50, -L * 0.44);
    rw.castShadow = true;
    this.group.add(rw);

    const rwFlap = new THREE.Mesh(
      new THREE.BoxGeometry(W * 1.6, 0.04, 0.05),
      carbonMat
    );
    rwFlap.position.set(0, 0.57, -L * 0.44);
    rwFlap.rotation.x = 0.2;
    this.group.add(rwFlap);

    for (let side of [-1, 1]) {
      const rwEp = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.18, 0.13), carbonMat);
      rwEp.position.set(side * W * 0.82, 0.50, -L * 0.44);
      this.group.add(rwEp);
    }

    for (let side of [-1, 1]) {
      const pillarGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.22, 6);
      const pillar = new THREE.Mesh(pillarGeo, carbonMat);
      pillar.position.set(side * W * 0.35, 0.39, -L * 0.4);
      pillar.rotation.x = 0.2;
      this.group.add(pillar);
    }

    // ── REAR DIFFUSER (rear, -Z) ──
    const diffGeo = new THREE.BoxGeometry(W * 0.88, 0.08, 0.12);
    const diff = new THREE.Mesh(diffGeo, carbonMat);
    diff.position.set(0, 0.09, -L * 0.48);
    this.group.add(diff);
    for (let i = -2; i <= 2; i++) {
      const strake = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.06, 0.1), carbonMat);
      strake.position.set(i * W * 0.15, 0.11, -L * 0.48);
      this.group.add(strake);
    }

    // ── SUSPENSION ARMS ──
    const armMat = carbonMat;
    const armGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.42, 5);
    const suspPos = [
      { x: -W * 0.78, z: L * 0.34 },   // FL
      { x: W * 0.78, z: L * 0.34 },    // FR
      { x: -W * 0.72, z: -L * 0.34 },  // RL
      { x: W * 0.72, z: -L * 0.34 }    // RR
    ];
    for (const sp of suspPos) {
      const uArm = new THREE.Mesh(armGeo, armMat);
      const armAngle = Math.atan2(sp.x, 0.38);
      uArm.rotation.z = armAngle;
      uArm.position.set(sp.x * 0.42, 0.28, sp.z);
      this.group.add(uArm);
      const lArm = new THREE.Mesh(armGeo, armMat);
      lArm.rotation.z = armAngle;
      lArm.position.set(sp.x * 0.42, 0.12, sp.z);
      this.group.add(lArm);
    }

    // ── WHEELS (F1 slick tires) ──
    this.wheels = [];
    const wheelPositions = [
      { x: -W * 0.78, z: L * 0.34, r: CONFIG.wheelRadius * 0.92 },
      { x: W * 0.78, z: L * 0.34, r: CONFIG.wheelRadius * 0.92 },
      { x: -W * 0.72, z: -L * 0.34, r: CONFIG.wheelRadius },
      { x: W * 0.72, z: -L * 0.34, r: CONFIG.wheelRadius }
    ];

    for (const wp of wheelPositions) {
      const wheelGroup = new THREE.Group();
      const isFront = wp.z > 0;
      const tireW = isFront ? 0.14 : 0.19;

      const tire = new THREE.Mesh(
        new THREE.CylinderGeometry(wp.r, wp.r, tireW, 20),
        tireMat
      );
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheelGroup.add(tire);

      const sidewall = new THREE.Mesh(
        new THREE.TorusGeometry(wp.r * 0.85, 0.02, 6, 16),
        tireMat
      );
      sidewall.rotation.y = Math.PI / 2;
      sidewall.position.x = tireW * 0.48;
      wheelGroup.add(sidewall);
      const sidewall2 = sidewall.clone();
      sidewall2.position.x = -tireW * 0.48;
      wheelGroup.add(sidewall2);

      const rimDisc = new THREE.Mesh(
        new THREE.CylinderGeometry(wp.r * 0.7, wp.r * 0.7, 0.02, 20),
        rimMat
      );
      rimDisc.rotation.z = Math.PI / 2;
      rimDisc.position.x = tireW * 0.49;
      wheelGroup.add(rimDisc);

      for (let s = 0; s < 5; s++) {
        const spoke = new THREE.Mesh(
          new THREE.BoxGeometry(0.015, wp.r * 1.2, 0.025),
          rimMat
        );
        spoke.rotation.z = (s / 5) * Math.PI;
        spoke.position.x = tireW * 0.49;
        wheelGroup.add(spoke);
      }

      const lockNut = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.03, 6),
        chromeMat
      );
      lockNut.rotation.z = Math.PI / 2;
      lockNut.position.x = tireW * 0.52;
      wheelGroup.add(lockNut);

      const duct = new THREE.Mesh(
        new THREE.CylinderGeometry(wp.r * 0.45, wp.r * 0.5, 0.04, 12),
        darkMat
      );
      duct.rotation.z = Math.PI / 2;
      duct.position.x = -tireW * 0.45;
      wheelGroup.add(duct);

      wheelGroup.position.set(wp.x, 0.18, wp.z);
      this.group.add(wheelGroup);
      this.wheels.push(wheelGroup);
    }

    scene.add(this.group);
  }

  update(physics) {
    const b = physics.chassisBody;
    this.group.position.set(b.position.x, b.position.y, b.position.z);
    const q = new THREE.Quaternion(b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w);
    this.group.quaternion.copy(q);
  }
}

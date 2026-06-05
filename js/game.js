import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { CONFIG } from './config.js?v=2';
import { InputManager } from './input.js?v=2';
import { TrackBuilder } from './track.js?v=2';
import { Kart } from './kart.js?v=2';
import { KartRenderer } from './kart-renderer.js?v=2';
import { AIController } from './ai.js?v=2';
import { CameraController } from './camera.js?v=2';
import { RaceManager } from './race.js?v=2';
import { MiniMap } from './minimap.js?v=2';
import { HUD } from './hud.js?v=2';
import { ParticleSystem } from './particles.js?v=2';

export class Game {
  constructor() {
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.physicsWorld = null;
    this.track = null;
    this.karts = [];
    this.player = null;
    this.aiControllers = [];
    this.cameraController = null;
    this.raceManager = null;
    this.hud = null;
    this.minimap = null;
    this.particles = null;
    this.input = null;
    this.clock = null;
    this.accumulator = 0;
    this.fixedDt = 1 / 60;
    this.running = false;
  }

  init() {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    document.body.appendChild(this.renderer.domElement);

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.Fog(0x87ceeb, 100, 300);

    // Camera
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 1.0);
    sun.position.set(50, 100, 50);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -80;
    sun.shadow.camera.right = 80;
    sun.shadow.camera.top = 80;
    sun.shadow.camera.bottom = -80;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 200;
    this.sun = sun;
    this.scene.add(sun);
    this.scene.add(sun.target);

    // Physics
    this.physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0)
    });
    this.physicsWorld.defaultContactMaterial.friction = 0.3;

    // Track
    this.track = new TrackBuilder(this.scene, this.physicsWorld);
    this.track.build();

    // Ground plane for physics (prevents karts from falling through)
    const groundBody = new CANNON.Body({
      mass: 0,
      material: new CANNON.Material({ friction: 0.5, restitution: 0.1 })
    });
    groundBody.addShape(new CANNON.Plane());
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    groundBody.position.set(0, -0.1, 0);
    this.physicsWorld.addBody(groundBody);

    // Input
    this.input = new InputManager();

    // Create karts
    const startPositions = this.track.getStartPositions();
    this.karts = [];

    // Player kart
    this.player = new Kart(this.scene, this.physicsWorld, startPositions[0].pos, startPositions[0].angle, CONFIG.colors[0], 0, true, this.track);
    this.karts.push(this.player);

    // AI karts
    this.aiControllers = [];
    for (let i = 0; i < CONFIG.numAI; i++) {
      const kart = new Kart(this.scene, this.physicsWorld, startPositions[i + 1].pos, startPositions[i + 1].angle, CONFIG.colors[i + 1], i + 1, false, this.track);
      this.karts.push(kart);
      const ai = new AIController(i, this.track);
      ai.initPosition(startPositions[i + 1].pos);
      this.aiControllers.push(ai);
    }

    // RaceManager
    this.raceManager = new RaceManager();
    this.raceManager.karts = this.karts;
    this.raceManager.track = this.track;

    // Camera
    this.cameraController = new CameraController(this.camera);

    // HUD & MiniMap
    this.hud = new HUD();
    this.minimap = new MiniMap(document.getElementById('minimap'), this.track);

    // Particles
    this.particles = new ParticleSystem(this.scene);

    // Clock
    this.clock = new THREE.Clock();

    // Events
    window.addEventListener('resize', () => this.onResize());
    document.getElementById('startBtn').addEventListener('click', () => this.startRace());
    document.getElementById('restartBtn').addEventListener('click', () => this.startRace());

    // Preload car model
    KartRenderer.preload();
  }

  startRace() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    this.hud.show();

    // Reset positions
    const startPositions = this.track.getStartPositions();
    for (let i = 0; i < this.karts.length; i++) {
      this.karts[i].reset(startPositions[i].pos, startPositions[i].angle);
    }

    // Reset AI waypoint tracking
    for (let i = 0; i < this.aiControllers.length; i++) {
      this.aiControllers[i].initPosition(startPositions[i + 1].pos);
    }

    this.raceManager.startCountdown();
    this.running = true;
    this.clock.start();
    this.animate();
  }

  animate() {
    if (!this.running) return;
    requestAnimationFrame(() => this.animate());

    let dt = this.clock.getDelta();
    if (dt > 0.1) dt = 0.1;

    // Update race state
    this.raceManager.update(dt);

    // Handle input based on race state
    if (this.raceManager.state === 'RACING') {
      // Cache input once per frame
      const rawInput = this.input.getInput();
      const playerInput = { ...rawInput, steer: -rawInput.steer };
      const aiInputs = this.aiControllers.map((ai, i) => ai.getInput(this.karts[i + 1]));

      // Physics loop: apply forces then step each substep
      this.accumulator += dt;
      while (this.accumulator >= this.fixedDt) {
        // Apply forces before each physics step
        this.player.update(playerInput, this.fixedDt);
        for (let i = 0; i < this.aiControllers.length; i++) {
          this.karts[i + 1].update(aiInputs[i], this.fixedDt);
        }
        this.physicsWorld.step(this.fixedDt);
        this.accumulator -= this.fixedDt;
      }

      // Post-physics ground/boundary correction
      for (const kart of this.karts) {
        kart.physics.postUpdate();
      }

      // Drift particles
      if (this.player.physics.isDrifting) {
        const pos = this.player.physics.chassisBody.position;
        this.particles.emitDriftSmoke(new THREE.Vector3(pos.x, pos.y, pos.z));
      }

      // Update checkpoints
      for (const kart of this.karts) {
        this.raceManager.updateCheckpoints(kart);
      }

      // Respawn karts that fell off track
      for (let ki = 0; ki < this.karts.length; ki++) {
        const kart = this.karts[ki];
        if (kart.physics.chassisBody.position.y < -5) {
          const t = kart.physics.currentSplineT || 0;
          const p = this.track.spline.getPointAt(t);
          const tang = this.track.spline.getTangentAt(t);
          const angle = Math.atan2(tang.x, tang.z);
          kart.physics.reset(p, angle);
          // Update AI nearest waypoint after respawn
          if (!kart.isPlayer && this.aiControllers[ki - 1]) {
            this.aiControllers[ki - 1].initPosition(p);
          }
        }
      }

      // Camera
      this.cameraController.update(this.player, dt);

      // Sun follows player
      const pp = this.player.physics.chassisBody.position;
      this.sun.position.set(pp.x + 50, 100, pp.z + 50);
      this.sun.target.position.set(pp.x, 0, pp.z);
      this.sun.target.updateMatrixWorld();

      // HUD
      this.hud.update(this.player, this.raceManager);
      this.minimap.draw(this.karts);

      // Particles
      this.particles.update(dt);

    } else if (this.raceManager.state === 'COUNTDOWN') {
      this.hud.showCountdown(this.raceManager.countdownTime);

      // Hide countdown when transition to RACING
      if (this.raceManager.countdownTime <= 0) {
        this.hud.hideCountdown();
      }

      // Physics step (for stability)
      this.accumulator += dt;
      while (this.accumulator >= this.fixedDt) {
        this.physicsWorld.step(this.fixedDt);
        this.accumulator -= this.fixedDt;
      }

      // Camera still works during countdown
      this.cameraController.update(this.player, dt);
      this.minimap.draw(this.karts);

    } else if (this.raceManager.state === 'FINISHED') {
      this.showResults();
      this.running = false;
    }

    this.renderer.render(this.scene, this.camera);
  }

  showResults() {
    this.hud.hide();
    const table = document.getElementById('results-table');
    table.innerHTML = '<tr><th>名次</th><th>选手</th><th>时间</th></tr>';

    const sorted = [...this.karts].sort((a, b) => {
      if (a.finished && !b.finished) return -1;
      if (!a.finished && b.finished) return 1;
      return (a.finishTime || 999) - (b.finishTime || 999);
    });

    for (const kart of sorted) {
      const time = kart.finished ? this.raceManager.getTimeText(kart.finishTime) : '未完赛';
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>#${kart.position}</td><td style="color:#${kart.color.toString(16).padStart(6, '0')}">${kart.name}</td><td>${time}</td>`;
      table.appendChild(tr);
    }

    document.getElementById('results').style.display = 'flex';
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

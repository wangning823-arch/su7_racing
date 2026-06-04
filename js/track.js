import * as THREE from 'three';
import { CONFIG } from './config.js';

export class TrackBuilder {
  constructor(scene, physicsWorld) {
    this.scene = scene;
    this.world = physicsWorld;
    this.spline = null;
    this.waypoints = [];
    this.trackLength = 0;
    this.checkpoints = [];
  }

  build() {
    const y = 0;
    const pts = [
      new THREE.Vector3(125, y, 0),
      new THREE.Vector3(133, y, 21),
      new THREE.Vector3(121, y, 39),
      new THREE.Vector3(95, y, 49),
      new THREE.Vector3(71, y, 51),
      new THREE.Vector3(55, y, 55),
      new THREE.Vector3(45, y, 62),
      new THREE.Vector3(33, y, 64),
      new THREE.Vector3(18, y, 55),
      new THREE.Vector3(6, y, 36),
      new THREE.Vector3(0, y, 30),
      new THREE.Vector3(-5, y, 30),
      new THREE.Vector3(-12, y, 36),
      new THREE.Vector3(-26, y, 52),
      new THREE.Vector3(-45, y, 62),
      new THREE.Vector3(-65, y, 65),
      new THREE.Vector3(-87, y, 63),
      new THREE.Vector3(-108, y, 55),
      new THREE.Vector3(-121, y, 39),
      new THREE.Vector3(-119, y, 19),
      new THREE.Vector3(-105, y, 0),
      new THREE.Vector3(-91, y, -14),
      new THREE.Vector3(-85, y, -28),
      new THREE.Vector3(-84, y, -43),
      new THREE.Vector3(-76, y, -55),
      new THREE.Vector3(-58, y, -58),
      new THREE.Vector3(-36, y, -50),
      new THREE.Vector3(-21, y, -42),
      new THREE.Vector3(-14, y, -44),
      new THREE.Vector3(-9, y, -56),
      new THREE.Vector3(0, y, -68),
      new THREE.Vector3(11, y, -70),
      new THREE.Vector3(20, y, -63),
      new THREE.Vector3(28, y, -54),
      new THREE.Vector3(36, y, -50),
      new THREE.Vector3(48, y, -48),
      new THREE.Vector3(60, y, -44),
      new THREE.Vector3(71, y, -36),
      new THREE.Vector3(85, y, -28),
      new THREE.Vector3(105, y, -17),
    ];

    this.spline = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5);
    this.trackLength = this.spline.getLength();

    this.buildRoad();
    this.buildCurbs();
    this.buildBarriers();
    this.buildGround();
    this.buildTrees();
    this.buildStartLine();
    this.buildScenery();
    this.generateWaypoints();
    this.generateCheckpoints();
  }

  buildRoad() {
    const segs = CONFIG.trackSegments;
    const frames = this.spline.computeFrenetFrames(segs, true);
    const hw = CONFIG.trackWidth / 2;
    const verts = [], uvs = [], indices = [];

    for (let i = 0; i <= segs; i++) {
      const p = this.spline.getPointAt(i / segs);
      const b = frames.binormals[i];
      const lp = p.clone().add(b.clone().multiplyScalar(-hw));
      const rp = p.clone().add(b.clone().multiplyScalar(hw));
      verts.push(lp.x, lp.y + 0.06, lp.z, rp.x, rp.y + 0.06, rp.z);
      uvs.push(0, i / segs * 80, 1, i / segs * 80);
    }
    for (let i = 0; i < segs; i++) {
      const a = i * 2, b = a + 1;
      const c = ((i + 1) % (segs + 1)) * 2, d = c + 1;
      indices.push(a, c, b, b, c, d);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#333';
    for (let i = 0; i < 16; i++)
      for (let j = 0; j < 16; j++)
        if ((i + j) % 2 === 0) ctx.fillRect(i * 16, j * 16, 16, 16);
    ctx.fillStyle = '#555';
    ctx.fillRect(0, 120, 256, 16);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 15]);
    ctx.beginPath();
    ctx.moveTo(128, 0);
    ctx.lineTo(128, 256);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 256, 3);
    ctx.fillRect(0, 253, 256, 3);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;

    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6, metalness: 0.1 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    this.scene.add(mesh);
  }

  buildCurbs() {
    const segs = 200;
    const frames = this.spline.computeFrenetFrames(segs, true);
    const hw = CONFIG.trackWidth / 2;
    const curbW = 1.0;

    for (let side of [-1, 1]) {
      const verts = [], uvs = [], indices = [];
      for (let i = 0; i <= segs; i++) {
        const p = this.spline.getPointAt(i / segs);
        const b = frames.binormals[i];
        const inner = p.clone().add(b.clone().multiplyScalar(hw * side));
        const outer = p.clone().add(b.clone().multiplyScalar((hw + curbW) * side));
        verts.push(inner.x, inner.y + 0.07, inner.z, outer.x, outer.y + 0.07, outer.z);
        uvs.push(0, i / segs * 40, 1, i / segs * 40);
      }
      for (let i = 0; i < segs; i++) {
        const a = i * 2, b = a + 1;
        const c = ((i + 1) % (segs + 1)) * 2, d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(indices);
      geo.computeVertexNormals();

      const canvas = document.createElement('canvas');
      canvas.width = 64; canvas.height = 64;
      const ctx = canvas.getContext('2d');
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#e74c3c' : '#ffffff';
        ctx.fillRect(i * 8, 0, 8, 64);
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    }
  }

  buildBarriers() {
    const segs = 200;
    const frames = this.spline.computeFrenetFrames(segs, true);
    const hw = CONFIG.trackWidth / 2 + 1.3;
    const h = 0.8;

    for (let side of [-1, 1]) {
      const verts = [], indices = [];
      for (let i = 0; i <= segs; i++) {
        const p = this.spline.getPointAt(i / segs);
        const b = frames.binormals[i];
        const x = p.x + b.x * hw * side;
        const y = p.y;
        const z = p.z + b.z * hw * side;
        verts.push(x, y, z, x, y + h, z);
      }
      for (let i = 0; i < segs; i++) {
        const a = i * 2, b = a + 1;
        const c = ((i + 1) % (segs + 1)) * 2, d = c + 1;
        if (side === -1) indices.push(a, b, c, b, d, c);
        else indices.push(a, c, b, b, c, d);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      geo.setIndex(indices);
      geo.computeVertexNormals();

      const mat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.4, metalness: 0.5 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      this.scene.add(mesh);
    }
  }

  buildGround() {
    const geo = new THREE.PlaneGeometry(500, 500);
    geo.rotateX(-Math.PI / 2);

    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, '#3d7a28');
    grad.addColorStop(1, '#2d5a1e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = '#4a8c35';
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * 120, y = Math.random() * 120;
      ctx.fillRect(x, y, 2 + Math.random() * 3, 2 + Math.random() * 3);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(50, 50);
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 });
    const ground = new THREE.Mesh(geo, mat);
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  buildTrees() {
    const count = 400;
    const trunkGeo = new THREE.CylinderGeometry(0.15, 0.25, 2.5, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3a1a });
    const leavesGeo1 = new THREE.SphereGeometry(1.8, 8, 6);
    const leavesGeo2 = new THREE.ConeGeometry(1.5, 3.5, 8);
    const leavesMat1 = new THREE.MeshStandardMaterial({ color: 0x2e7d32 });
    const leavesMat2 = new THREE.MeshStandardMaterial({ color: 0x388e3c });

    const trunkMesh = new THREE.InstancedMesh(trunkGeo, trunkMat, count);
    const leaves1 = new THREE.InstancedMesh(leavesGeo1, leavesMat1, Math.floor(count * 0.6));
    const leaves2 = new THREE.InstancedMesh(leavesGeo2, leavesMat2, Math.ceil(count * 0.4));
    const dummy = new THREE.Object3D();

    let idx1 = 0, idx2 = 0;
    for (let i = 0; i < count; i++) {
      let x, z;
      do {
        x = (Math.random() - 0.5) * 400;
        z = (Math.random() - 0.5) * 400;
      } while (this.distToTrack(x, z) < 18);
      const y = this.getTerrainHeight(x, z);
      const scale = 0.7 + Math.random() * 0.8;
      dummy.position.set(x, y + 1.2 * scale, z);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      trunkMesh.setMatrixAt(i, dummy.matrix);
      if (i < count * 0.6) {
        dummy.position.set(x, y + 3.2 * scale, z);
        dummy.updateMatrix();
        leaves1.setMatrixAt(idx1++, dummy.matrix);
      } else {
        dummy.position.set(x, y + 3.5 * scale, z);
        dummy.updateMatrix();
        leaves2.setMatrixAt(idx2++, dummy.matrix);
      }
    }
    trunkMesh.instanceMatrix.needsUpdate = true;
    leaves1.instanceMatrix.needsUpdate = true;
    leaves2.instanceMatrix.needsUpdate = true;
    this.scene.add(trunkMesh);
    this.scene.add(leaves1);
    this.scene.add(leaves2);
  }

  buildStartLine() {
    const p = this.spline.getPointAt(0);
    const t = this.spline.getTangentAt(0);
    const angle = Math.atan2(t.x, t.z);
    const right = new THREE.Vector3(t.z, 0, -t.x).normalize();

    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 32;
    const ctx = canvas.getContext('2d');
    for (let i = 0; i < 16; i++)
      for (let j = 0; j < 4; j++) {
        ctx.fillStyle = (i + j) % 2 === 0 ? '#fff' : '#111';
        ctx.fillRect(i * 8, j * 8, 8, 8);
      }
    const tex = new THREE.CanvasTexture(canvas);
    const geo = new THREE.PlaneGeometry(CONFIG.trackWidth, 2);
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 });
    const line = new THREE.Mesh(geo, mat);
    line.rotation.x = -Math.PI / 2;
    line.rotation.z = -angle;
    line.position.set(p.x, p.y + 0.08, p.z);
    this.scene.add(line);

    const poleGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.7 });
    for (let side of [-1, 1]) {
      const pole = new THREE.Mesh(poleGeo, poleMat);
      const offset = right.clone().multiplyScalar(CONFIG.trackWidth / 2 * side);
      pole.position.set(p.x + offset.x, p.y + 2, p.z + offset.z);
      this.scene.add(pole);
      const flag = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 0.8),
        new THREE.MeshStandardMaterial({ color: side === -1 ? 0xe74c3c : 0x3498db, side: THREE.DoubleSide })
      );
      flag.position.set(p.x + offset.x, p.y + 3.6, p.z + offset.z);
      flag.rotation.y = angle;
      this.scene.add(flag);
    }
  }

  buildScenery() {
    const p90 = this.spline.getPointAt(0.9);
    const t90 = this.spline.getTangentAt(0.9);
    const right90 = new THREE.Vector3(t90.z, 0, -t90.x).normalize();

    const standPos = p90.clone().add(right90.clone().multiplyScalar(25));
    const standGeo = new THREE.BoxGeometry(20, 4, 6);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x34495e, roughness: 0.6 });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.set(standPos.x, standPos.y + 2, standPos.z);
    stand.rotation.y = Math.atan2(t90.x, t90.z);
    stand.castShadow = true;
    this.scene.add(stand);

    const roofGeo = new THREE.BoxGeometry(22, 0.3, 8);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(standPos.x, standPos.y + 4.3, standPos.z);
    roof.rotation.y = Math.atan2(t90.x, t90.z);
    this.scene.add(roof);

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 3; j++) {
        const seat = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.8, 0.5),
          new THREE.MeshStandardMaterial({ color: [0xe74c3c, 0x3498db, 0xf1c40f][j % 3] })
        );
        const sx = standPos.x + (i - 5) * 1.8;
        const sy = standPos.y + 0.5 + j * 1.2;
        const sz = standPos.z + (j - 1) * 2;
        seat.position.set(sx, sy, sz);
        seat.rotation.y = Math.atan2(t90.x, t90.z);
        this.scene.add(seat);
      }
    }

    const p25 = this.spline.getPointAt(0.25);
    const t25 = this.spline.getTangentAt(0.25);
    const right25 = new THREE.Vector3(t25.z, 0, -t25.x).normalize();
    const boardPos = p25.clone().add(right25.clone().multiplyScalar(-20));
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(8, 3, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.3 })
    );
    board.position.set(boardPos.x, boardPos.y + 2.5, boardPos.z);
    board.rotation.y = Math.atan2(t25.x, t25.z);
    this.scene.add(board);

    const tireGeo = new THREE.TorusGeometry(0.4, 0.2, 8, 12);
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const p60 = this.spline.getPointAt(0.6);
    const t60 = this.spline.getTangentAt(0.6);
    const right60 = new THREE.Vector3(t60.z, 0, -t60.x).normalize();
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 3; j++) {
        const tire = new THREE.Mesh(tireGeo, tireMat);
        const tx = p60.x + right60.x * (10 + j * 1.2) - t60.x * (i - 2) * 1.5;
        const tz = p60.z + right60.z * (10 + j * 1.2) - t60.z * (i - 2) * 1.5;
        const ty = this.getTerrainHeight(tx, tz) + 0.4 + j * 0.8;
        tire.position.set(tx, ty, tz);
        tire.rotation.x = Math.PI / 2;
        this.scene.add(tire);
      }
    }
  }

  distToTrack(x, z) {
    let minD = Infinity;
    for (let t = 0; t < 1; t += 0.01) {
      const p = this.spline.getPointAt(t);
      const d = Math.sqrt((x - p.x) ** 2 + (z - p.z) ** 2);
      if (d < minD) minD = d;
    }
    return minD;
  }

  getTerrainHeight() {
    return 0;
  }

  generateWaypoints() {
    this.waypoints = [];
    const n = 100;
    for (let i = 0; i < n; i++) {
      const p = this.spline.getPointAt(i / n);
      const t = this.spline.getTangentAt(i / n);
      this.waypoints.push({ pos: p, tangent: t, index: i });
    }
  }

  generateCheckpoints() {
    this.checkpoints = [];
    const n = 10;
    for (let i = 0; i < n; i++) {
      this.checkpoints.push({
        t: i / n,
        pos: this.spline.getPointAt(i / n)
      });
    }
  }

  getStartPositions() {
    const positions = [];
    const startT = this.spline.getPointAt(0);
    const tangent = this.spline.getTangentAt(0);
    const right = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

    for (let i = 0; i < 6; i++) {
      const col = (i % 2) === 0 ? -1 : 1;
      const offset = right.clone().multiplyScalar(col * 1.8);
      const back = tangent.clone().multiplyScalar(-i * 5);
      const pos = startT.clone().add(offset).add(back);
      positions.push({ pos, angle: Math.atan2(tangent.x, tangent.z) });
    }
    return positions;
  }
}

import * as THREE from 'three';
import { CONFIG } from './config.js?v=2';

export class TrackBuilder {
  constructor(scene, physicsWorld) {
    this.scene = scene;
    this.world = physicsWorld;
    this.spline = null;
    this.waypoints = [];
    this.trackLength = 0;
    this.checkpoints = [];
    this.meshes = [];
    this.theme = null;
  }

  clear() {
    for (const m of this.meshes) {
      this.scene.remove(m);
      if (m.geometry) m.geometry.dispose();
      if (m.material) {
        if (Array.isArray(m.material)) m.material.forEach(mt => mt.dispose());
        else m.material.dispose();
      }
    }
    this.meshes = [];
    this.spline = null;
    this._frames = null;
    this._frameCount = 0;
    this.waypoints = [];
    this.checkpoints = [];
  }

  _add(mesh) {
    this.scene.add(mesh);
    this.meshes.push(mesh);
  }

  build(trackDef, theme = null) {
    this.theme = theme || trackDef.theme || null;

    // Convert [x,y,z] arrays to Vector3
    const pts = trackDef.points.map(p => new THREE.Vector3(p[0], p[1], p[2]));

    // Apply track width override if provided
    if (trackDef.trackWidth) {
      this._trackWidth = trackDef.trackWidth;
    }

    this.spline = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5);
    this.trackLength = this.spline.getLength();

    // Store Frenet frames for physics tilt computation
    const segs = CONFIG.trackSegments;
    this._frames = this.spline.computeFrenetFrames(segs, true);
    this._frameCount = segs;

    this.buildRoad();
    this.buildCurbs();
    this.buildBarriers();
    this.buildGround();
    this.buildTrees();
    this.generateWaypoints();
    this.generateCheckpoints();
    this.buildStartLine();
    this.buildArrows();
    this.buildScenery();
    this.buildBuildings();
  }

  buildRoad() {
    const segs = CONFIG.trackSegments;
    const frames = this.spline.computeFrenetFrames(segs, true);
    const hw = (this._trackWidth || CONFIG.trackWidth) / 2;
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
    this._add(mesh);
  }

  buildCurbs() {
    const segs = 200;
    const frames = this.spline.computeFrenetFrames(segs, true);
    const hw = (this._trackWidth || CONFIG.trackWidth) / 2;
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
      this._add(mesh);
    }
  }

  buildBarriers() {
    const segs = 200;
    const frames = this.spline.computeFrenetFrames(segs, true);
    const hw = (this._trackWidth || CONFIG.trackWidth) / 2 + 1.3;
    const h = 0.8;

    for (let side of [-1, 1]) {
      const verts = [], indices = [];
      for (let i = 0; i <= segs; i++) {
        const p = this.spline.getPointAt(i / segs);
        const b = frames.binormals[i];
        const baseX = p.x + b.x * hw * side;
        const baseY = p.y + b.y * hw * side;
        const baseZ = p.z + b.z * hw * side;
        // Barrier extends vertically (world up)
        verts.push(baseX, baseY, baseZ, baseX, baseY + h, baseZ);
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
      this._add(mesh);
    }
  }

  buildGround() {
    const geo = new THREE.PlaneGeometry(500, 500);
    geo.rotateX(-Math.PI / 2);

    const g = this.theme?.ground || {};

    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, g.centerColor || '#3d7a28');
    grad.addColorStop(1, g.edgeColor || '#2d5a1e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = g.dotColor || '#4a8c35';
    for (let i = 0; i < (g.dotCount ?? 40); i++) {
      const x = Math.random() * 120, y = Math.random() * 120;
      ctx.fillRect(x, y, 2 + Math.random() * 3, 2 + Math.random() * 3);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(50, 50);
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: g.roughness ?? 0.95 });
    const ground = new THREE.Mesh(geo, mat);
    ground.position.y = -2;
    ground.receiveShadow = true;
    this._add(ground);
  }

  _createLeafGeometry(type) {
    switch (type) {
      case 'cactus': return new THREE.ConeGeometry(0.4, 4.0, 6);
      case 'dead': return new THREE.ConeGeometry(0.3, 2.0, 4);
      case 'cone': return new THREE.ConeGeometry(1.5, 3.5, 8);
      default: return new THREE.SphereGeometry(1.8, 8, 6);
    }
  }

  buildTrees() {
    const t = this.theme?.trees || {};
    const count = t.count ?? 400;
    if (count === 0) return;

    const trunkGeo = new THREE.CylinderGeometry(
      t.trunkRadiusTop ?? 0.15, t.trunkRadiusBottom ?? 0.25, t.trunkHeight ?? 2.5, 6
    );
    const trunkMat = new THREE.MeshStandardMaterial({ color: t.trunkColor ?? 0x5a3a1a });
    const leafGeo1 = this._createLeafGeometry(t.leafGeometries?.[0] ?? 'sphere');
    const leafGeo2 = this._createLeafGeometry(t.leafGeometries?.[1] ?? 'cone');
    const leavesMat1 = new THREE.MeshStandardMaterial({ color: t.leafColors?.[0] ?? 0x2e7d32 });
    const leavesMat2 = new THREE.MeshStandardMaterial({ color: t.leafColors?.[1] ?? 0x388e3c });

    const trunkMesh = new THREE.InstancedMesh(trunkGeo, trunkMat, count);
    const leaves1 = new THREE.InstancedMesh(leafGeo1, leavesMat1, Math.floor(count * 0.6));
    const leaves2 = new THREE.InstancedMesh(leafGeo2, leavesMat2, Math.ceil(count * 0.4));
    const dummy = new THREE.Object3D();

    const minDist = t.minDistToTrack ?? 18;
    let idx1 = 0, idx2 = 0;
    for (let i = 0; i < count; i++) {
      let x, z;
      do {
        x = (Math.random() - 0.5) * 400;
        z = (Math.random() - 0.5) * 400;
      } while (this.distToTrack(x, z) < minDist);
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
    this._add(trunkMesh);
    this._add(leaves1);
    this._add(leaves2);
  }

  buildStartLine() {
    const p = this.spline.getPointAt(0);
    // Use waypoint direction instead of spline tangent (more reliable)
    const wp0 = this.waypoints[0].pos;
    const wp1 = this.waypoints[1].pos;
    const fwdDx = wp1.x - wp0.x;
    const fwdDz = wp1.z - wp0.z;
    const fwdLen = Math.sqrt(fwdDx * fwdDx + fwdDz * fwdDz);
    const t = new THREE.Vector3(fwdDx / fwdLen, 0, fwdDz / fwdLen);
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
    const geo = new THREE.PlaneGeometry(this._trackWidth || CONFIG.trackWidth, 2);
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 });
    const line = new THREE.Mesh(geo, mat);
    line.rotation.x = -Math.PI / 2;
    line.rotation.z = -angle;
    line.position.set(p.x, p.y + 0.08, p.z);
    this._add(line);

    const poleGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.7 });
    for (let side of [-1, 1]) {
      const pole = new THREE.Mesh(poleGeo, poleMat);
      const offset = right.clone().multiplyScalar((this._trackWidth || CONFIG.trackWidth) / 2 * side);
      pole.position.set(p.x + offset.x, p.y + 2, p.z + offset.z);
      this._add(pole);
      const flag = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 0.8),
        new THREE.MeshStandardMaterial({ color: side === -1 ? 0xe74c3c : 0x3498db, side: THREE.DoubleSide })
      );
      flag.position.set(p.x + offset.x, p.y + 3.6, p.z + offset.z);
      flag.rotation.y = angle;
      this._add(flag);
    }
  }

  buildArrows() {
    // Classic filled arrow in XZ plane, pointing +Z
    const headW = 0.8;  // head half width
    const headLen = 0.7; // head length
    const stemW = 0.2;   // stem half width
    const stemLen = 1.3; // stem length
    const tipZ = headLen;
    const baseZ = 0;
    const tailZ = -stemLen;

    const verts = [
      0,          0, tipZ,       // 0: tip
      -headW,     0, baseZ,     // 1: left head
      headW,      0, baseZ,     // 2: right head
      -stemW,     0, baseZ,     // 3: left stem start
      stemW,      0, baseZ,     // 4: right stem start
      -stemW,     0, tailZ,     // 5: left tail
      stemW,      0, tailZ,     // 6: right tail
    ];

    const indices = [
      // Head: two triangles
      0, 1, 2,
      // Head-to-stem transition: fill corners between head and stem
      1, 3, 2,
      3, 4, 2,
      // Stem: two triangles
      3, 5, 6,
      3, 6, 4,
    ];

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });

    const count = 40;
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const p = this.spline.getPointAt(t);
      const tangent = this.spline.getTangentAt(t);
      const angle = Math.atan2(tangent.x, tangent.z);

      const arrow = new THREE.Mesh(geo, mat);
      arrow.rotation.y = angle;
      arrow.position.set(p.x, p.y + 0.1, p.z);
      this._add(arrow);
    }
  }

  buildScenery() {
    const s = this.theme?.scenery || {};
    const p90 = this.spline.getPointAt(0.9);
    const t90 = this.spline.getTangentAt(0.9);
    const right90 = new THREE.Vector3(t90.z, 0, -t90.x).normalize();

    const standPos = p90.clone().add(right90.clone().multiplyScalar(25));
    const standGeo = new THREE.BoxGeometry(20, 4, 6);
    const standMat = new THREE.MeshStandardMaterial({ color: s.standColor ?? 0x34495e, roughness: 0.6 });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.set(standPos.x, standPos.y + 2, standPos.z);
    stand.rotation.y = Math.atan2(t90.x, t90.z);
    stand.castShadow = true;
    this._add(stand);

    const roofGeo = new THREE.BoxGeometry(22, 0.3, 8);
    const roofMat = new THREE.MeshStandardMaterial({ color: s.roofColor ?? 0xe74c3c });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(standPos.x, standPos.y + 4.3, standPos.z);
    roof.rotation.y = Math.atan2(t90.x, t90.z);
    this._add(roof);

    const seatColors = s.seatColors ?? [0xe74c3c, 0x3498db, 0xf1c40f];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 3; j++) {
        const seat = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.8, 0.5),
          new THREE.MeshStandardMaterial({ color: seatColors[j % 3] })
        );
        const sx = standPos.x + (i - 5) * 1.8;
        const sy = standPos.y + 0.5 + j * 1.2;
        const sz = standPos.z + (j - 1) * 2;
        seat.position.set(sx, sy, sz);
        seat.rotation.y = Math.atan2(t90.x, t90.z);
        this._add(seat);
      }
    }

    const p25 = this.spline.getPointAt(0.25);
    const t25 = this.spline.getTangentAt(0.25);
    const right25 = new THREE.Vector3(t25.z, 0, -t25.x).normalize();
    const boardPos = p25.clone().add(right25.clone().multiplyScalar(-20));
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(8, 3, 0.3),
      new THREE.MeshStandardMaterial({ color: s.boardColor ?? 0x2c3e50, roughness: 0.3 })
    );
    board.position.set(boardPos.x, boardPos.y + 2.5, boardPos.z);
    board.rotation.y = Math.atan2(t25.x, t25.z);
    this._add(board);

    const tireGeo = new THREE.TorusGeometry(0.4, 0.2, 8, 12);
    const tireMat = new THREE.MeshStandardMaterial({ color: s.tireColor ?? 0x222222 });
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
        this._add(tire);
      }
    }
  }

  buildBuildings() {
    const b = this.theme?.buildings;
    if (!b) return;

    const count = b.count ?? 80;
    const hw = (this._trackWidth || CONFIG.trackWidth) / 2;
    const minDist = b.minDistToTrack ?? 10;

    const buildingColors = [0x555566, 0x4a4a5a, 0x606070, 0x505060, 0x484858, 0x5a5a6a];

    for (let i = 0; i < count; i++) {
      let x, z;
      let attempts = 0;
      do {
        x = (Math.random() - 0.5) * 300;
        z = (Math.random() - 0.5) * 300;
        attempts++;
      } while (this.distToTrack(x, z) < minDist && attempts < 50);
      if (attempts >= 50) continue;

      const w = (b.minWidth ?? 6) + Math.random() * ((b.maxWidth ?? 14) - (b.minWidth ?? 6));
      const d = (b.minWidth ?? 6) + Math.random() * ((b.maxWidth ?? 14) - (b.minWidth ?? 6));
      const h = (b.minHeight ?? 8) + Math.random() * ((b.maxHeight ?? 30) - (b.minHeight ?? 8));

      const geo = new THREE.BoxGeometry(w, h, d);
      const color = buildingColors[Math.floor(Math.random() * buildingColors.length)];
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.2 });
      const building = new THREE.Mesh(geo, mat);
      building.position.set(x, h / 2 - 2, z);
      building.castShadow = true;
      building.receiveShadow = true;
      this._add(building);

      // Windows: emissive dots on building faces
      const windowMat = new THREE.MeshStandardMaterial({ color: 0xffeeaa, emissive: 0xffeeaa, emissiveIntensity: 0.3 });
      const winGeo = new THREE.PlaneGeometry(0.8, 0.6);
      const floors = Math.floor(h / 3);
      const winCols = Math.floor(w / 2);
      for (let f = 0; f < floors; f++) {
        for (let c = 0; c < winCols; c++) {
          if (Math.random() > 0.6) continue;
          const win = new THREE.Mesh(winGeo, windowMat);
          win.position.set(
            x - w / 2 + 1 + c * 2,
            1 + f * 3,
            z + d / 2 + 0.05
          );
          this._add(win);
        }
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

  getTerrainHeight(x, z) {
    if (!this.spline) return 0;
    let minD = Infinity;
    let bestT = 0;
    for (let t = 0; t < 1; t += 0.01) {
      const p = this.spline.getPointAt(t);
      const d = (x - p.x) ** 2 + (z - p.z) ** 2;
      if (d < minD) { minD = d; bestT = t; }
    }
    return this.spline.getPointAt(bestT).y;
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
    // Use spline tangent at t=0 for consistent starting direction
    const tangent = this.spline.getTangentAt(0).normalize();
    const right = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();
    const angle = Math.atan2(tangent.x, tangent.z);

    for (let i = 0; i < 6; i++) {
      const col = (i % 2) === 0 ? -1 : 1;
      const offset = right.clone().multiplyScalar(col * 1.8);
      const back = tangent.clone().multiplyScalar(-i * 5);
      const pos = startT.clone().add(offset).add(back);
      positions.push({ pos, angle });
    }
    return positions;
  }
}

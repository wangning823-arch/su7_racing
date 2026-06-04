export class MiniMap {
  constructor(canvas, track) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.track = track;
    this.trackPoints = [];
    const n = 200;
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (let i = 0; i < n; i++) {
      const p = track.spline.getPointAt(i / n);
      this.trackPoints.push(p);
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.z < minZ) minZ = p.z;
      if (p.z > maxZ) maxZ = p.z;
    }
    const margin = 15;
    this.minX = minX - margin;
    this.maxX = maxX + margin;
    this.minZ = minZ - margin;
    this.maxZ = maxZ + margin;
  }

  toScreen(x, z) {
    const sx = ((x - this.minX) / (this.maxX - this.minX)) * 140 + 10;
    const sy = ((z - this.minZ) / (this.maxZ - this.minZ)) * 140 + 10;
    return [sx, sy];
  }

  draw(karts) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, 160, 160);

    // Draw track
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < this.trackPoints.length; i++) {
      const [sx, sy] = this.toScreen(this.trackPoints[i].x, this.trackPoints[i].z);
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.closePath();
    ctx.stroke();

    // Draw karts
    for (const kart of karts) {
      const p = kart.physics.chassisBody.position;
      const [sx, sy] = this.toScreen(p.x, p.z);
      ctx.fillStyle = kart.isPlayer ? '#fff' : '#' + kart.color.toString(16).padStart(6, '0');
      ctx.beginPath();
      ctx.arc(sx, sy, kart.isPlayer ? 5 : 3, 0, Math.PI * 2);
      ctx.fill();
      if (kart.isPlayer) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
}

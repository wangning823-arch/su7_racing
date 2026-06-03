const fs = require('fs');

const html = fs.readFileSync('/home/root1/users/admin/projects/test1/kart-racer.html', 'utf-8');

let passed = 0, failed = 0;
function assert(condition, msg) {
  if (condition) { passed++; }
  else { failed++; console.error('FAIL:', msg); }
}

// ========================================
// 1. HTML Structure Tests
// ========================================
console.log('\n=== HTML Structure ===');

assert(html.includes('<!DOCTYPE html>'), 'Has DOCTYPE');
assert(html.includes('<html'), 'Has html tag');
assert(html.includes('</html>'), 'Has closing html tag');
assert(html.includes('<head>'), 'Has head tag');
assert(html.includes('<body>'), 'Has body tag');
assert(html.includes('</script>'), 'Script tags closed');
assert(html.includes('charset="UTF-8"'), 'UTF-8 charset');

// ========================================
// 2. CDN Dependencies Tests
// ========================================
console.log('\n=== CDN Dependencies ===');

assert(html.includes('cannon-es@0.20.0') || html.includes('cannon-es'), 'cannon-es CDN');
assert(html.includes('three@0.172.0'), 'Three.js CDN');
assert(html.includes('nipplejs'), 'nipplejs CDN');
assert(html.includes('importmap'), 'Has importmap');
assert(html.includes('"three"'), 'Three.js in importmap');
assert(html.includes('"cannon-es"'), 'cannon-es in importmap');
assert(html.includes("import * as CANNON from 'cannon-es'"), 'CANNON imported as ES module');

// ========================================
// 3. DOM Element Tests
// ========================================
console.log('\n=== DOM Elements ===');

const domIds = [
  'menu', 'startBtn', 'hud', 'hud-position', 'hud-lap',
  'hud-time', 'hud-speed', 'hud-countdown', 'minimap',
  'results', 'results-table', 'restartBtn', 'touch-controls',
  'joystick-zone', 'throttle-btn', 'brake-btn', 'drift-btn'
];

for (const id of domIds) {
  assert(html.includes(`id="${id}"`), `DOM element #${id} exists`);
}

// ========================================
// 4. CSS Class Tests
// ========================================
console.log('\n=== CSS Styles ===');

const cssChecks = [
  ['#menu', 'Menu styles'],
  ['#hud', 'HUD styles'],
  ['#minimap', 'Minimap styles'],
  ['#results', 'Results styles'],
  ['#touch-controls', 'Touch controls styles'],
  ['#drift-btn', 'Drift button styles'],
];

for (const [selector, desc] of cssChecks) {
  assert(html.includes(selector), `CSS: ${desc}`);
}

// ========================================
// 5. JavaScript Class Tests
// ========================================
console.log('\n=== JS Classes ===');

const classes = [
  'InputManager', 'TrackBuilder', 'KartPhysics', 'KartRenderer',
  'Kart', 'AIController', 'CameraController', 'RaceManager',
  'MiniMap', 'HUD', 'ParticleSystem', 'Game'
];

for (const cls of classes) {
  assert(html.includes(`class ${cls}`), `Class ${cls} defined`);
}

// ========================================
// 6. CONFIG Constants Tests
// ========================================
console.log('\n=== CONFIG ===');

const configKeys = [
  'maxSpeed', 'engineForce', 'brakeForce', 'steerAngle',
  'kartMass', 'chassisW', 'chassisH', 'chassisL',
  'wheelRadius', 'trackWidth', 'trackSegments', 'totalLaps',
  'numAI', 'aiSpeeds', 'aiLookaheads', 'cameraDistance',
  'cameraHeight', 'colors', 'kartNames'
];

for (const key of configKeys) {
  assert(html.includes(key), `CONFIG.${key} defined`);
}

// ========================================
// 7. Three.js Features Tests
// ========================================
console.log('\n=== Three.js Features ===');

const threeFeatures = [
  ['WebGLRenderer', 'WebGL Renderer'],
  ['PerspectiveCamera', 'Perspective Camera'],
  ['Scene', 'Scene'],
  ['DirectionalLight', 'Directional Light'],
  ['AmbientLight', 'Ambient Light'],
  ['CatmullRomCurve3', 'Spline curve'],
  ['BufferGeometry', 'Buffer geometry'],
  ['MeshStandardMaterial', 'PBR material'],
  ['InstancedMesh', 'Instanced mesh'],
  ['PCFSoftShadowMap', 'Soft shadows'],
  ['ACESFilmicToneMapping', 'Tone mapping'],
  ['Fog', 'Fog effect'],
  ['SphereGeometry', 'Sphere geometry'],
  ['CylinderGeometry', 'Cylinder geometry'],
  ['BoxGeometry', 'Box geometry'],
  ['ConeGeometry', 'Cone geometry'],
  ['PlaneGeometry', 'Plane geometry'],
];

for (const [feature, desc] of threeFeatures) {
  assert(html.includes(feature), `Three.js: ${desc}`);
}

// ========================================
// 8. Physics Features Tests
// ========================================
console.log('\n=== Physics Features ===');

const physicsFeatures = [
  ['CANNON.World', 'Physics world'],
  ['CANNON.Box', 'Box shape'],
  ['CANNON.Body', 'Physics body'],
  ['CANNON.Material', 'Physics material'],
  ['CANNON.Vec3', 'Vector3'],
  ['CANNON.Quaternion', 'Quaternion'],
  ['gravity', 'Gravity'],
  ['engineForce', 'Engine force'],
  ['linearDamping', 'Linear damping'],
  ['angularDamping', 'Angular damping'],
  ['isDrifting', 'Friction (drift)'],
  ['getTrackHeight', 'Track height detection'],
];

for (const [feature, desc] of physicsFeatures) {
  assert(html.includes(feature), `Physics: ${desc}`);
}

// ========================================
// 9. Game Logic Tests
// ========================================
console.log('\n=== Game Logic ===');

// State machine
assert(html.includes("'MENU'"), 'State: MENU');
assert(html.includes("'COUNTDOWN'"), 'State: COUNTDOWN');
assert(html.includes("'RACING'"), 'State: RACING');
assert(html.includes("'FINISHED'"), 'State: FINISHED');

// Race features
assert(html.includes('startCountdown'), 'Countdown function');
assert(html.includes('updateCheckpoints'), 'Checkpoint tracking');
assert(html.includes('updatePositions'), 'Position ranking');
assert(html.includes('checkFinish'), 'Finish detection');
assert(html.includes('totalLaps'), 'Lap counting');

// AI
assert(html.includes('pure pursuit') || html.includes('Pure Pursuit') || html.includes('nearestIdx'), 'AI waypoint following');
assert(html.includes('lookahead'), 'AI lookahead');
assert(html.includes('curvature'), 'AI curvature detection');

// Input
assert(html.includes('KeyW'), 'Key W input');
assert(html.includes('KeyA'), 'Key A input');
assert(html.includes('KeyS'), 'Key S input');
assert(html.includes('KeyD'), 'Key D input');
assert(html.includes('ArrowUp'), 'Arrow Up input');
assert(html.includes('ArrowDown'), 'Arrow Down input');
assert(html.includes('ArrowLeft'), 'Arrow Left input');
assert(html.includes('ArrowRight'), 'Arrow Right input');
assert(html.includes('Space'), 'Space input (drift)');

// ========================================
// 10. Track Spline Tests
// ========================================
console.log('\n=== Track Spline ===');

// Count control points
const cpMatch = html.match(/new THREE\.Vector3\(/g);
const cpCount = cpMatch ? cpMatch.length : 0;
assert(cpCount >= 20, `Track has ${cpCount} control points (need >= 20)`);

// Closed loop
assert(html.includes("CatmullRomCurve3(pts, true") || html.includes("CatmullRomCurve3(pts, true,"), 'Spline is closed loop');

// ========================================
// 11. Kart Setup Tests
// ========================================
console.log('\n=== Kart Setup ===');

// 6 karts (1 player + 5 AI)
assert(html.includes('CONFIG.numAI'), 'Uses numAI config');
assert(html.includes(', true)') || html.includes('isPlayer'), 'Player kart marked');
assert(html.includes('isPlayer'), 'isPlayer property used');

// Colors
assert(html.includes('0xe94560'), 'Player color defined');
assert(html.includes('0x3498db'), 'AI-1 color defined');

// Names
assert(html.includes("'玩家'"), 'Player name');
assert(html.includes("'闪电'"), 'AI name');

// ========================================
// 12. Camera System Tests
// ========================================
console.log('\n=== Camera ===');

assert(html.includes('cameraDistance'), 'Camera distance config');
assert(html.includes('cameraHeight'), 'Camera height config');
assert(html.includes('lerp'), 'Camera smoothing');
assert(html.includes('fov'), 'FOV adjustment');
assert(html.includes('updateProjectionMatrix'), 'Projection update');

// ========================================
// 13. UI Tests
// ========================================
console.log('\n=== UI ===');

// HUD
assert(html.includes('hud-position'), 'Position display');
assert(html.includes('hud-lap'), 'Lap display');
assert(html.includes('hud-time'), 'Time display');
assert(html.includes('hud-speed'), 'Speed display');
assert(html.includes('hud-countdown'), 'Countdown display');
assert(html.includes('km/h'), 'Speed unit');

// Results
assert(html.includes('results-table'), 'Results table');
assert(html.includes('名次'), 'Rank column');
assert(html.includes('选手'), 'Name column');
assert(html.includes('时间'), 'Time column');
assert(html.includes('未完赛'), 'DNF text');

// MiniMap
assert(html.includes('minimap'), 'Minimap canvas');
assert(html.includes('160'), 'Minimap size');

// ========================================
// 14. Particle System Tests
// ========================================
console.log('\n=== Particles ===');

assert(html.includes('emitDriftSmoke'), 'Drift smoke function');
assert(html.includes('ParticleSystem'), 'ParticleSystem class');
assert(html.includes('SphereGeometry'), 'Smoke geometry');

// ========================================
// 15. Event Handler Tests
// ========================================
console.log('\n=== Events ===');

assert(html.includes('startBtn'), 'Start button handler');
assert(html.includes('restartBtn'), 'Restart button handler');
assert(html.includes('resize'), 'Window resize handler');
assert(html.includes('keydown'), 'Key down handler');
assert(html.includes('keyup'), 'Key up handler');
assert(html.includes('touchstart'), 'Touch start handler');
assert(html.includes('touchend'), 'Touch end handler');
assert(html.includes('touchcancel'), 'Touch cancel handler');

// ========================================
// 16. Performance Tests
// ========================================
console.log('\n=== Performance ===');

assert(html.includes('setPixelRatio'), 'Pixel ratio limit');
assert(html.includes('antialias'), 'Antialiasing');
assert(html.includes('shadowMap'), 'Shadow mapping');
assert(html.includes('receiveShadow'), 'Receive shadows');
assert(html.includes('castShadow'), 'Cast shadows');

// ========================================
// 17. Game Loop Tests
// ========================================
console.log('\n=== Game Loop ===');

assert(html.includes('requestAnimationFrame'), 'Animation loop');
assert(html.includes('getDelta'), 'Delta time');
assert(html.includes('accumulator'), 'Fixed timestep accumulator');
assert(html.includes('fixedDt'), 'Fixed dt value');
assert(html.includes('physicsWorld.step'), 'Physics step');

// ========================================
// 18. Respawn System Tests
// ========================================
console.log('\n=== Respawn ===');

assert(html.includes('position.y < -5'), 'Fall detection');
assert(html.includes('currentSplineT'), 'Spline position tracking');
assert(html.includes('physics.reset'), 'Physics reset');

// ========================================
// 19. Start Positions Tests
// ========================================
console.log('\n=== Start Positions ===');

assert(html.includes('getStartPositions'), 'Start positions function');
assert(html.includes('tangent'), 'Tangent direction');
assert(html.includes('crossVectors'), 'Right vector calculation');

// ========================================
// 20. Code Quality Tests
// ========================================
console.log('\n=== Code Quality ===');

// Check for common JS issues
const scriptMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/);
if (scriptMatch) {
  const code = scriptMatch[1];

  // No undefined references (basic check)
  assert(!code.includes('undefined.'), 'No undefined access');

  // Proper error handling patterns
  assert(code.includes('Math.max') && code.includes('Math.min'), 'Clamping values');

  // Consistent naming
  assert(code.includes('this.scene'), 'this.scene used');
  assert(code.includes('this.camera'), 'this.camera used');
  assert(code.includes('this.physicsWorld'), 'this.physicsWorld used');
}

// ========================================
// 20. Syntax Check (via eval-like)
// ========================================
console.log('\n=== Syntax Check ===');

try {
  const moduleScript = html.match(/<script type="module">([\s\S]*?)<\/script>/);
  if (moduleScript) {
    const code = moduleScript[1];
    // Replace imports with stubs
    const stubCode = code
      .replace(/import \* as THREE from 'three';/g, 'const THREE = {};')
      .replace(/import \* as CANNON from 'cannon-es';/g, 'const CANNON = {};');
    new Function(stubCode);
    assert(true, 'JavaScript syntax is valid');
  }
} catch(e) {
  assert(false, `Syntax error: ${e.message}`);
}

// ========================================
// 21. Track Intersection Test
// ========================================
console.log('\n=== Track Intersection Check ===');

{
  // Extract control points from HTML
  const cpMatches = [...html.matchAll(/new THREE\.Vector3\(([^)]+)\)/g)];
  const trackPts = cpMatches.map(m => {
    const parts = m[1].split(',').map(s => parseFloat(s.trim()));
    return [parts[0], parts[2]]; // x, z (skip y)
  });

  function dist(a, b) { return Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2); }
  function catmullRom(p0, p1, p2, p3, t) {
    const d01 = Math.max(dist(p0, p1), 1e-6);
    const d12 = Math.max(dist(p1, p2), 1e-6);
    const d23 = Math.max(dist(p2, p3), 1e-6);
    const t0 = 0, t1 = t0 + Math.pow(d01, 0.5), t2 = t1 + Math.pow(d12, 0.5), t3 = t2 + Math.pow(d23, 0.5);
    const tt = t1 + (t2 - t1) * t;
    const a1x = (t1-tt)/(t1-t0)*p0[0] + (tt-t0)/(t1-t0)*p1[0];
    const a1y = (t1-tt)/(t1-t0)*p0[1] + (tt-t0)/(t1-t0)*p1[1];
    const a2x = (t2-tt)/(t2-t1)*p1[0] + (tt-t1)/(t2-t1)*p2[0];
    const a2y = (t2-tt)/(t2-t1)*p1[1] + (tt-t1)/(t2-t1)*p2[1];
    const a3x = (t3-tt)/(t3-t2)*p2[0] + (tt-t2)/(t3-t2)*p3[0];
    const a3y = (t3-tt)/(t3-t2)*p2[1] + (tt-t2)/(t3-t2)*p3[1];
    const b1x = (t2-tt)/(t2-t0)*a1x + (tt-t0)/(t2-t0)*a2x;
    const b1y = (t2-tt)/(t2-t0)*a1y + (tt-t0)/(t2-t0)*a2y;
    const b2x = (t3-tt)/(t3-t1)*a2x + (tt-t1)/(t3-t1)*a3x;
    const b2y = (t3-tt)/(t3-t1)*a2y + (tt-t1)/(t3-t1)*a3y;
    return [(t2-tt)/(t2-t1)*b1x + (tt-t1)/(t2-t1)*b2x, (t2-tt)/(t2-t1)*b1y + (tt-t1)/(t2-t1)*b2y];
  }

  const n = trackPts.length;
  const samples = [];
  for (let i = 0; i < n; i++) {
    const p0 = trackPts[(i-1+n)%n], p1 = trackPts[i], p2 = trackPts[(i+1)%n], p3 = trackPts[(i+2)%n];
    for (let s = 0; s < 50; s++) samples.push(catmullRom(p0, p1, p2, p3, s/50));
  }

  function segsCross(a, b, c, d) {
    const d1x=b[0]-a[0], d1y=b[1]-a[1], d2x=d[0]-c[0], d2y=d[1]-c[1];
    const cross = d1x*d2y - d1y*d2x;
    if (Math.abs(cross) < 1e-10) return false;
    const t = ((c[0]-a[0])*d2y - (c[1]-a[1])*d2x) / cross;
    const u = ((c[0]-a[0])*d1y - (c[1]-a[1])*d1x) / cross;
    return t > 0.01 && t < 0.99 && u > 0.01 && u < 0.99;
  }

  let crossings = 0;
  const len = samples.length;
  for (let i = 0; i < len; i++) {
    const a = samples[i], b = samples[(i+1)%len];
    for (let j = i+2; j < len; j++) {
      if (i === 0 && j === len-1) continue;
      const c = samples[j], d = samples[(j+1)%len];
      if (segsCross(a, b, c, d)) crossings++;
    }
  }
  assert(crossings === 0, `Track has no self-intersections (${crossings} found)`);
}

// ========================================
// Summary
// ========================================
console.log('\n' + '='.repeat(50));
console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
console.log('='.repeat(50));

if (failed > 0) {
  process.exit(1);
}

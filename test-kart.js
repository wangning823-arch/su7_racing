const fs = require('fs');

const root = '/home/root1/users/admin/projects/test1/';

// Read all source files
const html = fs.readFileSync(root + 'index.html', 'utf-8');

const jsFiles = [
  'js/config.js',
  'js/input.js',
  'js/track.js',
  'js/physics.js',
  'js/kart-renderer.js',
  'js/kart.js',
  'js/ai.js',
  'js/camera.js',
  'js/race.js',
  'js/minimap.js',
  'js/hud.js',
  'js/particles.js',
  'js/game.js',
  'js/main.js'
];

const jsContents = {};
let allJs = '';
for (const f of jsFiles) {
  const content = fs.readFileSync(root + f, 'utf-8');
  jsContents[f] = content;
  allJs += '\n' + content;
}

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

// Check ES module imports in JS files
assert(allJs.includes("import * as THREE from 'three'"), 'THREE imported as ES module');
assert(allJs.includes("import * as CANNON from 'cannon-es'"), 'CANNON imported as ES module');

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
  assert(allJs.includes(`class ${cls}`), `Class ${cls} defined`);
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
  assert(allJs.includes(key), `CONFIG.${key} defined`);
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
  assert(allJs.includes(feature), `Three.js: ${desc}`);
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
  assert(allJs.includes(feature), `Physics: ${desc}`);
}

// ========================================
// 9. Game Logic Tests
// ========================================
console.log('\n=== Game Logic ===');

// State machine
assert(allJs.includes("'MENU'"), 'State: MENU');
assert(allJs.includes("'COUNTDOWN'"), 'State: COUNTDOWN');
assert(allJs.includes("'RACING'"), 'State: RACING');
assert(allJs.includes("'FINISHED'"), 'State: FINISHED');

// Race features
assert(allJs.includes('startCountdown'), 'Countdown function');
assert(allJs.includes('updateCheckpoints'), 'Checkpoint tracking');
assert(allJs.includes('updatePositions'), 'Position ranking');
assert(allJs.includes('checkFinish'), 'Finish detection');
assert(allJs.includes('totalLaps'), 'Lap counting');

// AI
assert(allJs.includes('pure pursuit') || allJs.includes('Pure Pursuit') || allJs.includes('nearestIdx'), 'AI waypoint following');
assert(allJs.includes('lookahead'), 'AI lookahead');
assert(allJs.includes('errAngle'), 'AI steering error angle');

// Input
assert(allJs.includes('KeyW'), 'Key W input');
assert(allJs.includes('KeyA'), 'Key A input');
assert(allJs.includes('KeyS'), 'Key S input');
assert(allJs.includes('KeyD'), 'Key D input');
assert(allJs.includes('ArrowUp'), 'Arrow Up input');
assert(allJs.includes('ArrowDown'), 'Arrow Down input');
assert(allJs.includes('ArrowLeft'), 'Arrow Left input');
assert(allJs.includes('ArrowRight'), 'Arrow Right input');
assert(allJs.includes('Space'), 'Space input (drift)');

// ========================================
// 10. Track Spline Tests
// ========================================
console.log('\n=== Track Spline ===');

// Count control points across all JS files
const cpMatch = allJs.match(/new THREE\.Vector3\(/g);
const cpCount = cpMatch ? cpMatch.length : 0;
assert(cpCount >= 20, `Track has ${cpCount} control points (need >= 20)`);

// Closed loop
assert(allJs.includes("CatmullRomCurve3(pts, true") || allJs.includes("CatmullRomCurve3(pts, true,"), 'Spline is closed loop');

// ========================================
// 11. Kart Setup Tests
// ========================================
console.log('\n=== Kart Setup ===');

// 6 karts (1 player + 5 AI)
assert(allJs.includes('CONFIG.numAI'), 'Uses numAI config');
assert(allJs.includes(', true)') || allJs.includes('isPlayer'), 'Player kart marked');
assert(allJs.includes('isPlayer'), 'isPlayer property used');

// Colors
assert(allJs.includes('0xe94560'), 'Player color defined');
assert(allJs.includes('0x3498db'), 'AI-1 color defined');

// Names
assert(allJs.includes("'玩家'"), 'Player name');
assert(allJs.includes("'闪电'"), 'AI name');

// ========================================
// 12. Camera System Tests
// ========================================
console.log('\n=== Camera ===');

assert(allJs.includes('cameraDistance'), 'Camera distance config');
assert(allJs.includes('cameraHeight'), 'Camera height config');
assert(allJs.includes('lerp'), 'Camera smoothing');
assert(allJs.includes('fov'), 'FOV adjustment');
assert(allJs.includes('updateProjectionMatrix'), 'Projection update');

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
assert(allJs.includes('km/h'), 'Speed unit');

// Results
assert(html.includes('results-table'), 'Results table');
assert(allJs.includes('名次'), 'Rank column');
assert(allJs.includes('选手'), 'Name column');
assert(allJs.includes('时间'), 'Time column');
assert(allJs.includes('未完赛'), 'DNF text');

// MiniMap
assert(html.includes('minimap'), 'Minimap canvas');
assert(html.includes('160'), 'Minimap size');

// ========================================
// 14. Particle System Tests
// ========================================
console.log('\n=== Particles ===');

assert(allJs.includes('emitDriftSmoke'), 'Drift smoke function');
assert(allJs.includes('ParticleSystem'), 'ParticleSystem class');
assert(allJs.includes('SphereGeometry'), 'Smoke geometry');

// ========================================
// 15. Event Handler Tests
// ========================================
console.log('\n=== Events ===');

assert(html.includes('startBtn'), 'Start button handler');
assert(html.includes('restartBtn'), 'Restart button handler');
assert(allJs.includes('resize'), 'Window resize handler');
assert(allJs.includes('keydown'), 'Key down handler');
assert(allJs.includes('keyup'), 'Key up handler');
assert(allJs.includes('touchstart'), 'Touch start handler');
assert(allJs.includes('touchend'), 'Touch end handler');
assert(allJs.includes('touchcancel'), 'Touch cancel handler');

// ========================================
// 16. Performance Tests
// ========================================
console.log('\n=== Performance ===');

assert(allJs.includes('setPixelRatio'), 'Pixel ratio limit');
assert(allJs.includes('antialias'), 'Antialiasing');
assert(allJs.includes('shadowMap'), 'Shadow mapping');
assert(allJs.includes('receiveShadow'), 'Receive shadows');
assert(allJs.includes('castShadow'), 'Cast shadows');

// ========================================
// 17. Game Loop Tests
// ========================================
console.log('\n=== Game Loop ===');

assert(allJs.includes('requestAnimationFrame'), 'Animation loop');
assert(allJs.includes('getDelta'), 'Delta time');
assert(allJs.includes('accumulator'), 'Fixed timestep accumulator');
assert(allJs.includes('fixedDt'), 'Fixed dt value');
assert(allJs.includes('physicsWorld.step'), 'Physics step');

// ========================================
// 18. Respawn System Tests
// ========================================
console.log('\n=== Respawn ===');

assert(allJs.includes('position.y < -5'), 'Fall detection');
assert(allJs.includes('currentSplineT'), 'Spline position tracking');
assert(allJs.includes('physics.reset'), 'Physics reset');

// ========================================
// 19. Start Positions Tests
// ========================================
console.log('\n=== Start Positions ===');

assert(allJs.includes('getStartPositions'), 'Start positions function');
assert(allJs.includes('tangent'), 'Tangent direction');
assert(allJs.includes('crossVectors'), 'Right vector calculation');

// ========================================
// 20. Code Quality Tests
// ========================================
console.log('\n=== Code Quality ===');

// Check for common JS issues across all files
assert(!allJs.includes('undefined.'), 'No undefined access');
assert(allJs.includes('Math.max') && allJs.includes('Math.min'), 'Clamping values');
assert(allJs.includes('this.scene'), 'this.scene used');
assert(allJs.includes('this.camera'), 'this.camera used');
assert(allJs.includes('this.physicsWorld'), 'this.physicsWorld used');

// ========================================
// 21. Module Structure Tests
// ========================================
console.log('\n=== Module Structure ===');

// Check that each module exports its main class
assert(jsContents['js/config.js'].includes('export const CONFIG'), 'config.js exports CONFIG');
assert(jsContents['js/input.js'].includes('export class InputManager'), 'input.js exports InputManager');
assert(jsContents['js/track.js'].includes('export class TrackBuilder'), 'track.js exports TrackBuilder');
assert(jsContents['js/physics.js'].includes('export class KartPhysics'), 'physics.js exports KartPhysics');
assert(jsContents['js/kart-renderer.js'].includes('export class KartRenderer'), 'kart-renderer.js exports KartRenderer');
assert(jsContents['js/kart.js'].includes('export class Kart'), 'kart.js exports Kart');
assert(jsContents['js/ai.js'].includes('export class AIController'), 'ai.js exports AIController');
assert(jsContents['js/camera.js'].includes('export class CameraController'), 'camera.js exports CameraController');
assert(jsContents['js/race.js'].includes('export class RaceManager'), 'race.js exports RaceManager');
assert(jsContents['js/minimap.js'].includes('export class MiniMap'), 'minimap.js exports MiniMap');
assert(jsContents['js/hud.js'].includes('export class HUD'), 'hud.js exports HUD');
assert(jsContents['js/particles.js'].includes('export class ParticleSystem'), 'particles.js exports ParticleSystem');
assert(jsContents['js/game.js'].includes('export class Game'), 'game.js exports Game');

// Check that game.js imports all dependencies
assert(jsContents['js/game.js'].includes("import { InputManager }"), 'game.js imports InputManager');
assert(jsContents['js/game.js'].includes("import { TrackBuilder }"), 'game.js imports TrackBuilder');
assert(jsContents['js/game.js'].includes("import { Kart }"), 'game.js imports Kart');
assert(jsContents['js/game.js'].includes("import { AIController }"), 'game.js imports AIController');
assert(jsContents['js/game.js'].includes("import { CameraController }"), 'game.js imports CameraController');
assert(jsContents['js/game.js'].includes("import { RaceManager }"), 'game.js imports RaceManager');
assert(jsContents['js/game.js'].includes("import { MiniMap }"), 'game.js imports MiniMap');
assert(jsContents['js/game.js'].includes("import { HUD }"), 'game.js imports HUD');
assert(jsContents['js/game.js'].includes("import { ParticleSystem }"), 'game.js imports ParticleSystem');

// Check main.js entry point
assert(jsContents['js/main.js'].includes("import { Game }"), 'main.js imports Game');
assert(jsContents['js/main.js'].includes('new Game()'), 'main.js instantiates Game');
assert(jsContents['js/main.js'].includes('game.init()'), 'main.js calls init()');

// Check HTML loads main.js as module
assert(html.includes('type="module" src="js/main.js'), 'HTML loads main.js as module');

// ========================================
// 22. Syntax Check (via eval-like)
// ========================================
console.log('\n=== Syntax Check ===');

try {
  // Check each JS file for syntax validity
  for (const [file, content] of Object.entries(jsContents)) {
    try {
      // Replace imports/exports with stubs for syntax check
      const stubCode = content
        .replace(/import\s+\{[^}]+\}\s+from\s+'[^']+';/g, '')
        .replace(/import\s+\*\s+as\s+\w+\s+from\s+'[^']+';/g, '')
        .replace(/export\s+/g, '');
      new Function(stubCode);
      assert(true, `${file} syntax valid`);
    } catch(e) {
      assert(false, `Syntax error in ${file}: ${e.message}`);
    }
  }
} catch(e) {
  assert(false, `Syntax check failed: ${e.message}`);
}

// ========================================
// 23. Track Intersection Test
// ========================================
console.log('\n=== Track Intersection Check ===');

{
  // Extract control points from track.js
  const trackCode = jsContents['js/track.js'];
  const cpMatches = [...trackCode.matchAll(/new THREE\.Vector3\(([^)]+)\)/g)];
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

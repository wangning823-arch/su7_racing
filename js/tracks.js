// Track definitions: each track is { id, name, difficulty, trackWidth, points: [[x,y,z], ...], theme }
// points arrays are converted to THREE.Vector3 by TrackBuilder

export const DEFAULT_THEME = {
  sky: { color: 0x87ceeb, fogNear: 100, fogFar: 300 },
  ground: { centerColor: '#3d7a28', edgeColor: '#2d5a1e', dotColor: '#4a8c35', dotCount: 40, roughness: 0.95 },
  trees: { count: 400, trunkColor: 0x5a3a1a, trunkHeight: 2.5, trunkRadiusTop: 0.15, trunkRadiusBottom: 0.25, leafColors: [0x2e7d32, 0x388e3c], leafGeometries: ['sphere', 'cone'], minDistToTrack: 18 },
  lighting: { ambientColor: 0xffffff, ambientIntensity: 0.4, sunColor: 0xffffff, sunIntensity: 1.0 },
  scenery: { standColor: 0x34495e, roofColor: 0xe74c3c, seatColors: [0xe74c3c, 0x3498db, 0xf1c40f], boardColor: 0x2c3e50, tireColor: 0x222222 },
};

export const TRACKS = [
  {
    id: 'hill-circuit',
    name: '丘陵赛道',
    difficulty: 'easy',
    trackWidth: 14,
    points: [
      [125, 0, 0], [133, 0.5, 21], [121, 1.5, 39], [95, 3, 49],
      [71, 5, 51], [55, 7, 55], [45, 8, 62], [33, 7, 64],
      [18, 5, 55], [6, 3, 36], [0, 1.5, 30], [-5, 0.5, 30],
      [-12, 0, 36], [-26, -0.5, 52], [-45, -1, 62], [-65, 0, 65],
      [-87, 2, 63], [-108, 4, 55], [-121, 6, 39], [-119, 7.5, 19],
      [-105, 8, 0], [-91, 7, -14], [-85, 5, -28], [-84, 3, -43],
      [-76, 1.5, -55], [-58, 0, -58], [-36, -0.5, -50], [-21, 0, -42],
      [-14, 0.5, -44], [-9, 1.5, -56], [0, 2.5, -68], [11, 2, -70],
      [20, 1, -63], [28, 0.5, -54], [36, 0, -50], [48, -0.3, -48],
      [60, -0.5, -44], [71, -0.3, -36], [85, 0, -28], [105, 0, -17],
    ]
  },
  {
    id: 'classic-oval',
    name: '经典椭圆',
    difficulty: 'easy',
    trackWidth: 16,
    points: [
      [100, 0, 0], [110, 0, 20], [105, 0, 40], [85, 0, 55],
      [60, 0, 60], [30, 0, 62], [0, 0, 55], [-30, 0, 45],
      [-55, 0, 30], [-70, 0, 10], [-75, 0, -15], [-65, 0, -35],
      [-45, 0, -50], [-20, 0, -58], [10, 0, -60], [40, 0, -55],
      [65, 0, -40], [80, 0, -20],
    ],
    theme: {
      sky: { color: 0xd4883a, fogNear: 80, fogFar: 250 },
      ground: { centerColor: '#c2a64e', edgeColor: '#a08838', dotColor: '#b89840', dotCount: 20, roughness: 0.98 },
      trees: { count: 60, trunkColor: 0x5a7a2a, leafColors: [0x6b8e23, 0x8fbc3a], leafGeometries: ['cactus', 'cactus'], minDistToTrack: 20 },
      lighting: { ambientColor: 0xffe0b0, ambientIntensity: 0.5, sunColor: 0xffcc66, sunIntensity: 1.3 },
      scenery: { standColor: 0x8b6914, roofColor: 0xcc5500, seatColors: [0xcc5500, 0xdaa520, 0x8b4513], boardColor: 0x5c3d0e, tireColor: 0x333322 },
    }
  },
  {
    id: 'city-streets',
    name: '城市街道',
    difficulty: 'medium',
    trackWidth: 13,
    points: [
      [80, 0, 0], [80, 0, 25], [80, 0, 50], [65, 0, 60],
      [40, 0, 60], [25, 0, 50], [25, 0, 30], [25, 0, 15],
      [10, 0, 15], [-10, 0, 15], [-25, 0, 25], [-25, 0, 45],
      [-25, 0, 65], [-40, 0, 75], [-65, 0, 75], [-80, 0, 65],
      [-80, 0, 45], [-80, 0, 25], [-65, 0, 15], [-45, 0, 15],
      [-45, 0, 0], [-45, 0, -20], [-55, 0, -35], [-70, 0, -40],
      [-80, 0, -55], [-80, 0, -70], [-65, 0, -80], [-40, 0, -80],
      [-15, 0, -80], [10, 0, -80], [35, 0, -80], [55, 0, -75],
      [70, 0, -60], [80, 0, -40], [80, 0, -20],
    ],
    theme: {
      sky: { color: 0x9eaab8, fogNear: 90, fogFar: 280 },
      ground: { centerColor: '#6b6b6b', edgeColor: '#505050', dotColor: '#787878', dotCount: 60, roughness: 0.9 },
      trees: { count: 0 },
      lighting: { ambientColor: 0xd0d8e0, ambientIntensity: 0.55, sunColor: 0xe8e0d8, sunIntensity: 0.8 },
      scenery: { standColor: 0x4a4a52, roofColor: 0x2c3e50, seatColors: [0x555566, 0x666677, 0x444455], boardColor: 0x1a1a2e, tireColor: 0x111111 },
      buildings: { count: 100, minHeight: 8, maxHeight: 30, minWidth: 6, maxWidth: 14, minDistToTrack: 10 },
    }
  },
  {
    id: 'extreme-circuit',
    name: '极限赛道',
    difficulty: 'hard',
    trackWidth: 11,
    points: [
      [60, 0, 0], [65, 0, 15], [55, 0, 30], [40, 0, 35],
      [30, 0, 25], [25, 0, 35], [10, 0, 40], [-5, 0, 35],
      [-15, 0, 25], [-25, 0, 30], [-35, 0, 40], [-45, 0, 35],
      [-50, 0, 20], [-55, 0, 5], [-50, 0, -10], [-40, 0, -20],
      [-30, 0, -15], [-25, 0, -25], [-10, 0, -35], [5, 0, -40],
      [20, 0, -35], [30, 0, -25], [40, 0, -30], [50, 0, -40],
      [55, 0, -25], [50, 0, -10],
    ],
    theme: {
      sky: { color: 0x2a1510, fogNear: 60, fogFar: 200 },
      ground: { centerColor: '#2a1a0e', edgeColor: '#1a0f08', dotColor: '#3a2215', dotCount: 30, roughness: 1.0 },
      trees: { count: 120, trunkColor: 0x1a0a02, trunkHeight: 2.0, trunkRadiusTop: 0.1, trunkRadiusBottom: 0.2, leafColors: [0x1a0a02, 0x2a1508], leafGeometries: ['dead', 'dead'], minDistToTrack: 16 },
      lighting: { ambientColor: 0x662211, ambientIntensity: 0.3, sunColor: 0xff4422, sunIntensity: 0.7 },
      scenery: { standColor: 0x1a0a02, roofColor: 0x8b1a00, seatColors: [0x8b1a00, 0x551100, 0x330800], boardColor: 0x0a0502, tireColor: 0x110808 },
    }
  },
];

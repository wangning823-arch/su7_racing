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
  // ===== EASY TRACKS =====

  // 1. 丘陵赛道 (Hill Circuit) - easy
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

  // 2. 经典椭圆 (Classic Oval) - easy
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

  // 3. 公园环线 (Park Loop) - easy
  {
    id: 'park-loop',
    name: '公园环线',
    difficulty: 'easy',
    trackWidth: 15,
    points: [
      [90, 0, 0], [100, 0, 15], [100, 0, 35], [100, 0, 55],
      [90, 0, 70], [70, 0, 80], [45, 0, 80], [20, 0, 80],
      [0, 0, 80], [-20, 0, 80], [-45, 0, 80], [-70, 0, 75],
      [-85, 0, 60], [-90, 0, 40], [-90, 0, 20], [-90, 0, 0],
      [-90, 0, -20], [-90, 0, -40], [-85, 0, -60], [-70, 0, -75],
      [-45, 0, -80], [-20, 0, -80], [0, 0, -80], [20, 0, -80],
      [45, 0, -80], [70, 0, -75], [85, 0, -60], [90, 0, -40],
      [90, 0, -20],
    ],
    theme: {
      sky: { color: 0x7ec8e3, fogNear: 120, fogFar: 350 },
      ground: { centerColor: '#4caf50', edgeColor: '#388e3c', dotColor: '#66bb6a', dotCount: 50, roughness: 0.9 },
      trees: { count: 500, trunkColor: 0x6d4c2a, trunkHeight: 2.0, trunkRadiusTop: 0.12, trunkRadiusBottom: 0.2, leafColors: [0x43a047, 0x66bb6a, 0x81c784], leafGeometries: ['sphere', 'sphere'], minDistToTrack: 15 },
      lighting: { ambientColor: 0xffffff, ambientIntensity: 0.5, sunColor: 0xffffff, sunIntensity: 1.1 },
      scenery: { standColor: 0x8d6e4a, roofColor: 0x4caf50, seatColors: [0x4caf50, 0xffc107, 0x2196f3], boardColor: 0x5d4037, tireColor: 0x333333 },
    }
  },

  // 4. 农场赛道 (Farm Track) - easy
  {
    id: 'farm-track',
    name: '农场赛道',
    difficulty: 'easy',
    trackWidth: 15,
    points: [
      [110, 0, 0], [120, 0, 15], [115, 0, 35], [95, 0, 50],
      [70, 0, 55], [40, 0, 55], [10, 0, 55], [-20, 0, 55],
      [-50, 0, 50], [-75, 0, 40], [-95, 0, 25], [-105, 0, 5],
      [-100, 0, -15], [-85, 0, -30], [-60, 0, -35], [-30, 0, -35],
      [-10, 0, -30], [10, 0, -20], [30, 0, -10], [60, 0, -5],
      [90, 0, -5],
    ],
    theme: {
      sky: { color: 0x87ceeb, fogNear: 110, fogFar: 320 },
      ground: { centerColor: '#8d6e38', edgeColor: '#6d5020', dotColor: '#a08040', dotCount: 30, roughness: 0.97 },
      trees: { count: 80, trunkColor: 0x5a3a1a, trunkHeight: 3.0, trunkRadiusTop: 0.1, trunkRadiusBottom: 0.18, leafColors: [0x7cb342, 0x9ccc65], leafGeometries: ['cone', 'cone'], minDistToTrack: 18 },
      lighting: { ambientColor: 0xfff8e1, ambientIntensity: 0.45, sunColor: 0xffe082, sunIntensity: 1.2 },
      scenery: { standColor: 0x795548, roofColor: 0xc62828, seatColors: [0xc62828, 0xff8f00, 0x4e342e], boardColor: 0x3e2723, tireColor: 0x222222 },
      buildings: { count: 5, minHeight: 6, maxHeight: 10, minWidth: 10, maxWidth: 18, minDistToTrack: 25 },
    }
  },

  // ===== MEDIUM TRACKS =====

  // 5. 城市街道 (City Streets) - medium
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

  // 6. 海岸线 (Coastal Road) - medium
  {
    id: 'coastal-road',
    name: '海岸线',
    difficulty: 'medium',
    themeId: 'coastal',
    trackWidth: 13,
    points: [
      [120, 0, -60], [92, 0, -45], [64, 0, -60], [38, 0, -78], [14, 0, -74],
      [-5, 0, -50], [-22, 0, -28], [-38, 0, -12], [-52, 0, -24], [-64, 0, -46],
      [-78, 0, -70], [-92, 0, -82], [-110, 0, -75], [-124, 0, -52],
      [-132, 0, -20], [-132, 0, 14], [-125, 0, 42], [-108, 0, 66],
      [-86, 0, 82], [-60, 0, 92], [-36, 0, 96], [-10, 0, 86],
      [12, 0, 92], [36, 0, 78], [56, 0, 90], [80, 0, 72],
      [102, 0, 84], [120, 0, 65], [132, 0, 76], [142, 0, 48],
      [146, 0, 14], [142, 0, -20], [132, 0, -48],
    ],
    theme: {
      sky: { color: 0x4da6ff, fogNear: 100, fogFar: 300 },
      ground: { centerColor: '#d4b896', edgeColor: '#c4a876', dotColor: '#e0c8a0', dotCount: 25, roughness: 0.98 },
      trees: { count: 150, trunkColor: 0x8b6942, trunkHeight: 3.5, trunkRadiusTop: 0.1, trunkRadiusBottom: 0.2, leafColors: [0x228b22, 0x32cd32], leafGeometries: ['palm', 'palm'], minDistToTrack: 16 },
      lighting: { ambientColor: 0xe0f0ff, ambientIntensity: 0.5, sunColor: 0xffee88, sunIntensity: 1.2 },
      scenery: { standColor: 0x5d8aa8, roofColor: 0x0077be, seatColors: [0x0077be, 0xffffff, 0xff6600], boardColor: 0x003366, tireColor: 0x333333 },
      buildings: { count: 3, minHeight: 12, maxHeight: 18, minWidth: 4, maxWidth: 6, minDistToTrack: 30 },
    }
  },

  // 7. 森林穿越 (Forest Trail) - medium
  {
    id: 'forest-trail',
    name: '森林穿越',
    difficulty: 'medium',
    themeId: 'forest',
    trackWidth: 13,
    points: [
      [-105, 0, -98], [-88, 0, -112], [-65, 0, -100], [-42, 0, -118], [-18, 0, -102],
      [5, 0, -115], [28, 0, -100], [50, 0, -115], [72, 0, -100], [95, 0, -112],
      [112, 0, -95], [118, 0, -72], [105, 0, -52], [88, 0, -68], [68, 0, -50],
      [45, 0, -68], [22, 0, -50], [0, 0, -68], [-22, 0, -48], [-48, 0, -68],
      [-72, 0, -45], [-95, 0, -62], [-112, 0, -38], [-108, 0, -12], [-88, 0, 8],
      [-65, 0, -12], [-40, 0, 10], [-15, 0, -12], [12, 0, 10], [38, 0, -8],
      [62, 0, 15], [88, 0, -2], [108, 0, 22], [115, 0, 50], [98, 0, 72],
      [72, 0, 55], [45, 0, 78], [18, 0, 62], [-12, 0, 85], [-42, 0, 68],
      [-75, 0, 92], [-102, 0, 72], [-118, 0, 48],
    ],
    theme: {
      sky: { color: 0x2d5a27, fogNear: 60, fogFar: 200 },
      ground: { centerColor: '#1a3a12', edgeColor: '#0f2808', dotColor: '#2a4a1a', dotCount: 45, roughness: 1.0 },
      trees: { count: 600, trunkColor: 0x3a2010, trunkHeight: 4.0, trunkRadiusTop: 0.15, trunkRadiusBottom: 0.3, leafColors: [0x1b5e20, 0x2e7d32, 0x33691e], leafGeometries: ['cone', 'cone'], minDistToTrack: 12 },
      lighting: { ambientColor: 0x4a6a3a, ambientIntensity: 0.35, sunColor: 0x88aa66, sunIntensity: 0.6 },
      scenery: { standColor: 0x3e2723, roofColor: 0x1b5e20, seatColors: [0x33691e, 0x558b2f, 0x4e342e], boardColor: 0x1a1a1a, tireColor: 0x222222 },
    }
  },

  // 8. 沙漠峡谷 (Desert Canyon) - medium
  {
    id: 'desert-canyon',
    name: '沙漠峡谷',
    difficulty: 'medium',
    themeId: 'desert',
    trackWidth: 12,
    points: [
      [-88, 0, 5], [-52, 0, -25], [-18, 0, -58], [15, 0, -85],
      [52, 0, -102], [88, 0, -98], [118, 0, -75], [142, 0, -38],
      [158, 0, -2], [168, 0, 32], [172, 0, 68], [160, 0, 95],
      [140, 0, 112], [115, 0, 122], [88, 0, 128], [58, 0, 132],
      [28, 0, 125], [-5, 0, 135], [-35, 0, 125], [-58, 0, 108],
      [-78, 0, 82], [-98, 0, 52], [-115, 0, 18], [-132, 0, -12],
      [-148, 0, -42], [-158, 0, -68], [-150, 0, -90], [-132, 0, -98],
      [-112, 0, -88], [-92, 0, -58],
    ],
    theme: {
      sky: { color: 0xe8c87a, fogNear: 80, fogFar: 260 },
      ground: { centerColor: '#d4a855', edgeColor: '#b89040', dotColor: '#c8a04a', dotCount: 15, roughness: 1.0 },
      trees: { count: 80, trunkColor: 0x6d5a2a, trunkHeight: 1.5, trunkRadiusTop: 0.08, trunkRadiusBottom: 0.15, leafColors: [0x7a8a2a, 0x6a7a1a], leafGeometries: ['cactus', 'dead'], minDistToTrack: 14 },
      lighting: { ambientColor: 0xffe8b0, ambientIntensity: 0.55, sunColor: 0xffdd66, sunIntensity: 1.4 },
      scenery: { standColor: 0x8a7a50, roofColor: 0xc8a040, seatColors: [0xc8a040, 0xa08030, 0x806020], boardColor: 0x605030, tireColor: 0x333322 },
    }
  },

  // ===== HARD TRACKS =====

  // 9. 极限赛道 (Extreme Circuit) - hard
  {
    id: 'extreme-circuit',
    name: '极限赛道',
    difficulty: 'hard',
    themeId: 'future',
    trackWidth: 11,
    points: [
      [-150, 0, -158], [-118, 0, -102], [-90, 0, -164], [-58, 0, -98],
      [-32, 0, -162], [-5, 0, -96], [22, 0, -160], [50, 0, -94],
      [78, 0, -160], [106, 0, -96], [132, 0, -160], [158, 0, -100],
      [178, 0, -155], [198, 0, -118],
      [214, 0, -80], [226, 0, -42], [210, 0, -8], [226, 0, 25],
      [210, 0, 58], [226, 0, 88], [210, 0, 114], [226, 0, 140],
      [210, 0, 162], [216, 0, 182],
      [200, 0, 202], [162, 0, 174], [128, 0, 210], [92, 0, 184],
      [58, 0, 210], [26, 0, 180], [0, 0, 202], [-26, 0, 180],
      [-54, 0, 202], [-82, 0, 180], [-110, 0, 202], [-136, 0, 174],
      [-164, 0, 198], [-190, 0, 170],
      [-208, 0, 138], [-224, 0, 100], [-206, 0, 62], [-224, 0, 28],
      [-206, 0, -6], [-224, 0, -40], [-206, 0, -66], [-224, 0, -96],
      [-206, 0, -120], [-220, 0, -148], [-210, 0, -156], [-182, 0, -150],
    ],
    theme: {
      sky: { color: 0x1a0a20, fogNear: 60, fogFar: 200 },
      ground: { centerColor: '#1a1a2a', edgeColor: '#0a0a18', dotColor: '#2a2a3a', dotCount: 35, roughness: 0.85 },
      trees: { count: 200, trunkColor: 0x2a1a3a, trunkHeight: 3.0, trunkRadiusTop: 0.08, trunkRadiusBottom: 0.15, leafColors: [0x6a3aaa, 0x8a4acc, 0x4a2a8a], leafGeometries: ['crystal', 'crystal'], minDistToTrack: 14 },
      lighting: { ambientColor: 0x4a2a6a, ambientIntensity: 0.35, sunColor: 0xaa66ff, sunIntensity: 0.8 },
      scenery: { standColor: 0x1a1a2a, roofColor: 0x6a3aaa, seatColors: [0x6a3aaa, 0x4a2a8a, 0x8a4acc], boardColor: 0x0a0a18, tireColor: 0x1a0a2a },
    }
  },

  // 10. 夜市迷宫 (Night Market Maze) - hard
  {
    id: 'nightmarket-maze',
    name: '夜市迷宫',
    difficulty: 'hard',
    themeId: 'nightmarket',
    trackWidth: 11,
    points: [
      [-100, 0, -85], [-94, 0, -73], [-88, 0, -84], [-82, 0, -97],
      [-76, 0, -87], [-70, 0, -73], [-64, 0, -82], [-58, 0, -96],
      [-52, 0, -89], [-45, 0, -74], [-39, 0, -80], [-33, 0, -95],
      [-27, 0, -91], [-21, 0, -75], [-15, 0, -78], [-9, 0, -94],
      [-3, 0, -93], [3, 0, -77], [9, 0, -76], [15, 0, -92],
      [21, 0, -95], [27, 0, -79], [33, 0, -75], [39, 0, -90],
      [45, 0, -96], [52, 0, -81], [58, 0, -74], [64, 0, -88],
      [70, 0, -97], [76, 0, -83], [82, 0, -73], [88, 0, -86],
      [94, 0, -97], [100, 0, -85],
      [100, 0, 85], [94, 0, 97], [88, 0, 86], [82, 0, 73],
      [76, 0, 83], [70, 0, 97], [64, 0, 88], [58, 0, 74],
      [52, 0, 81], [45, 0, 96], [39, 0, 90], [33, 0, 75],
      [27, 0, 79], [21, 0, 95], [15, 0, 92], [9, 0, 76],
      [3, 0, 77], [-3, 0, 93], [-9, 0, 94], [-15, 0, 78],
      [-21, 0, 75], [-27, 0, 91], [-33, 0, 95], [-39, 0, 80],
      [-45, 0, 74], [-52, 0, 89], [-58, 0, 96], [-64, 0, 82],
      [-70, 0, 73], [-76, 0, 87], [-82, 0, 97], [-88, 0, 84],
      [-94, 0, 73], [-100, 0, 85],
    ],
    theme: {
      sky: { color: 0x0a0a1a, fogNear: 50, fogFar: 180 },
      ground: { centerColor: '#2a2a2a', edgeColor: '#1a1a1a', dotColor: '#3a3a3a', dotCount: 50, roughness: 0.92 },
      trees: { count: 0 },
      lighting: { ambientColor: 0x4a3a6a, ambientIntensity: 0.4, sunColor: 0xff66aa, sunIntensity: 0.5 },
      scenery: { standColor: 0x2a2a2a, roofColor: 0xff4488, seatColors: [0xff4488, 0x44ffaa, 0xffaa44], boardColor: 0x1a1a2a, tireColor: 0x111111 },
      buildings: { count: 80, minHeight: 5, maxHeight: 15, minWidth: 4, maxWidth: 10, minDistToTrack: 8 },
    }
  },

  // 11. 雪地发夹 (Snow Hairpins) - hard
  {
    id: 'snow-hairpins',
    name: '雪地发夹',
    difficulty: 'hard',
    themeId: 'snow',
    trackWidth: 11,
    points: [
      [-150, 0, -140], [-136, 0, -118], [-121, 0, -137], [-107, 0, -161],
      [-93, 0, -146], [-79, 0, -120], [-64, 0, -130], [-50, 0, -159],
      [-36, 0, -152], [-21, 0, -123], [-7, 0, -125], [7, 0, -155],
      [21, 0, -157], [36, 0, -128], [50, 0, -121], [64, 0, -150],
      [79, 0, -160], [93, 0, -134], [107, 0, -119], [121, 0, -143],
      [136, 0, -162], [150, 0, -140],
      [150, 0, 140], [136, 0, 162], [121, 0, 143], [107, 0, 119],
      [93, 0, 134], [79, 0, 160], [64, 0, 150], [50, 0, 121],
      [36, 0, 128], [21, 0, 157], [7, 0, 155], [-7, 0, 125],
      [-21, 0, 123], [-36, 0, 152], [-50, 0, 159], [-64, 0, 130],
      [-79, 0, 120], [-93, 0, 146], [-107, 0, 161], [-121, 0, 137],
      [-136, 0, 118], [-150, 0, 140],
    ],
    theme: {
      sky: { color: 0xc8d8e8, fogNear: 90, fogFar: 280 },
      ground: { centerColor: '#e8e8f0', edgeColor: '#d0d0e0', dotColor: '#f0f0ff', dotCount: 20, roughness: 0.85 },
      trees: { count: 250, trunkColor: 0x5a4a3a, trunkHeight: 3.0, trunkRadiusTop: 0.12, trunkRadiusBottom: 0.2, leafColors: [0x2e5a32, 0x3a6a3e, 0xffffff], leafGeometries: ['pine', 'pine'], minDistToTrack: 14 },
      lighting: { ambientColor: 0xd0e0f0, ambientIntensity: 0.6, sunColor: 0xe8f0ff, sunIntensity: 0.9 },
      scenery: { standColor: 0x607080, roofColor: 0x4080b0, seatColors: [0x4080b0, 0xe0e0f0, 0x3060a0], boardColor: 0x304050, tireColor: 0x333333 },
    }
  },

  // 12. 纽博格林北环 (Nürburgring Nordschleife) - hard
  {
    id: 'nurburgring-nordschleife',
    name: '纽博格林北环',
    difficulty: 'hard',
    trackWidth: 10,
    themeId: 'nurburgring',
    points: [
      [-90,39,-100],[-72,38,-82],[-85,39,-65],[-65,38,-50],[-80,39,-36],[-55,40,-22],
      [-30,44,-12],[-5,48,-5],[20,50,-2],[50,48,0],[80,45,3],[105,42,12],
      [120,38,30],[115,34,50],[95,30,60],[70,24,74],[45,14,92],[25,8,110],
      [10,14,122],[-10,22,128],[-35,30,120],[-55,34,102],[-75,36,84],[-95,38,67],
      [-110,34,50],[-125,28,34],[-140,22,17],[-155,16,2],[-165,10,-12],[-175,4,-28],
      [-180,0,-45],[-175,6,-62],[-165,14,-78],[-150,20,-88],[-130,24,-96],[-105,28,-100],
      [-80,32,-103],[-55,36,-106],[-30,40,-108],[-5,44,-108],[20,47,-106],[45,49,-103],
      [65,50,-96],[80,50,-82],[78,52,-68],[65,54,-54],[50,52,-42],[35,48,-33],
      [20,42,-26],[5,36,-22],[-12,30,-24],[-28,26,-32],[-40,24,-44],[-38,26,-58],
      [-25,30,-70],[-10,34,-85],[8,34,-100],[30,34,-115],[55,35,-128],[80,36,-138],
      [108,38,-155],[138,39,-178],[165,40,-205],[185,40,-235],[182,39,-265],[165,38,-288],
      [135,37,-298],[102,37,-292],[70,38,-282],[36,39,-272],[6,39,-265],[-24,39,-260],
      [-52,39,-255],[-74,39,-248],[-86,39,-235],[-90,39,-210],[-93,39,-180],[-94,39,-155],
      [-94,39,-140],[-93,39,-128],[-92,39,-115],[-90,39,-100],
    ],
    theme: {
      sky: { color: 0x6a8a6a, fogNear: 120, fogFar: 400 },
      ground: { centerColor: '#1a3a0a', edgeColor: '#0f2805', dotColor: '#2a4a1a', dotCount: 50, roughness: 0.95 },
      trees: { count: 1500, trunkColor: 0x3a2810, trunkHeight: 3.5, trunkRadiusTop: 0.12, trunkRadiusBottom: 0.22, leafColors: [0x1b5e20, 0x2e7d32, 0x33691e, 0x1a4a12], leafGeometries: ['cone', 'pine'], minDistToTrack: 10 },
      lighting: { ambientColor: 0x88aa88, ambientIntensity: 0.4, sunColor: 0xffeedd, sunIntensity: 0.9 },
      scenery: { standColor: 0x3e2723, roofColor: 0x1b5e20, seatColors: [0x33691e, 0x558b2f, 0x4e342e], boardColor: 0x1a1a1a, tireColor: 0x222222 },
      shadow: { extent: 120 },
    }
  },
];

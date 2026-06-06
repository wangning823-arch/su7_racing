# Multi-Map System Design

## Overview

Add 10 selectable tracks to the kart racing game (currently 1 track). Players choose a track before each race from a map selection screen.

## Architecture

### Track Registry (`js/tracks.js`)

A centralized data file exporting an array of track definitions. Each track is a plain object:

```js
{
  id: 'classic-oval',          // unique string ID
  name: '经典椭圆',            // display name
  theme: 'racetrack',          // visual theme key
  difficulty: 'easy',          // 'easy' | 'medium' | 'hard'
  trackWidth: 16,              // road width in units (default 14)
  points: [                    // THREE.Vector3 control points
    [125, 0, 0],              // [x, y, z] arrays for compactness
    [133, 0, 21],
    // ...
  ],
  scenery: {                   // optional scenery overrides
    trees: true,               // include trees (default true)
    spectators: true,          // include spectator stand
    billboard: true,           // include billboard
    tires: true                // include tire barriers
  }
}
```

### TrackBuilder Changes (`js/track.js`)

- `TrackBuilder.build(trackId)` accepts a track ID, looks up definition from `tracks.js`
- `build()` reads points from the track definition instead of hardcoded array
- `buildScenery()` checks `trackDef.scenery` flags
- `buildGround()` applies theme-specific ground color
- `buildTrees()` places theme-appropriate tree types
- Track definition stored as `this.trackDef` for use by sub-methods

### Game Flow Changes (`js/game.js`)

Current: `init()` → build track → show menu → START → race

New: `init()` → show track selection → user picks track → build track → START → race

The track is NOT built during `init()`. It is built only after the user selects a track.

### Map Selection UI (`index.html` + `js/game.js`)

A new screen between menu and race:

- Grid of 10 track cards (2 rows x 5 columns)
- Each card shows: track name, difficulty badge, track shape preview (small canvas)
- Click to select, then START button appears
- After race finishes, "Restart" returns to track selection

### Visual Themes

Each theme defines:
- Ground color (base plane)
- Tree model type (sphere, cone, palm, cactus, pine, building)
- Tree color palette
- Optional scenery objects

| Theme | Ground | Trees | Extra |
|-------|--------|-------|-------|
| racetrack | dark gray | sphere green | grandstand, billboard |
| park | bright green | sphere light green | benches |
| farm | brown-green | scattered crops | barn |
| city | gray concrete | buildings (box geometry) | streetlights |
| coastal | sand | palm trees | lighthouse, waves |
| forest | dark green | tall pine trees | fallen logs |
| desert | sand yellow | cactus, dead bushes | rocks |
| nightmarket | dark asphalt | neon signs | food stalls |
| snow | white | snow-covered pines | igloos |
| future | metallic gray | crystal spires | glowing tubes |

## 10 Track Designs

### Easy Tracks

#### 1. 经典椭圆 (Classic Oval) - `classic-oval`
- **Theme**: racetrack
- **Shape**: Smooth ellipse, ~220x130 units
- **Width**: 16
- **Points**: 20 control points forming a wide oval
- **Character**: Beginner-friendly, wide turns, easy to maintain speed

#### 2. 公园环线 (Park Loop) - `park-loop`
- **Theme**: park
- **Shape**: Rounded rectangle, ~200x120 units
- **Width**: 15
- **Points**: 24 control points, 4 gentle curves at corners
- **Character**: Relaxed drive through parkland, mild curves

#### 3. 农场赛道 (Farm Track) - `farm-track`
- **Theme**: farm
- **Shape**: Elongated S-shape, ~250x100 units
- **Width**: 15
- **Points**: 22 control points, two large U-turns
- **Character**: Simple back-and-forth layout, open fields

### Medium Tracks

#### 4. 城市街道 (City Streets) - `city-streets`
- **Theme**: city
- **Shape**: Figure-8 with crossing, ~200x180 units
- **Width**: 14
- **Points**: 30 control points forming figure-8
- **Character**: 90-degree turns, intersection crossing, urban feel

#### 5. 海岸线 (Coastal Road) - `coastal-road`
- **Theme**: coastal
- **Shape**: Serpentine S-curves, ~240x160 units
- **Width**: 13
- **Points**: 32 control points, 3-4 connected S-bends
- **Character**: Flowing rhythm, scenic ocean-side drive

#### 6. 森林穿越 (Forest Trail) - `forest-trail`
- **Theme**: forest
- **Shape**: Irregular multi-bend, ~180x180 units
- **Width**: 13
- **Points**: 34 control points, tight turns
- **Character**: Dense tree cover, limited visibility, technical

#### 7. 沙漠峡谷 (Desert Canyon) - `desert-canyon`
- **Theme**: desert
- **Shape**: Narrow winding, ~220x140 units
- **Width**: 12
- **Points**: 30 control points, narrow passages
- **Character**: Tight road through canyon, sandy landscape

### Hard Tracks

#### 8. 夜市迷宫 (Night Market Maze) - `nightmarket-maze`
- **Theme**: nightmarket
- **Shape**: Complex multi-bend, ~180x180 units
- **Width**: 11
- **Points**: 36 control points, tight chicanes
- **Character**: Narrow lanes, quick direction changes, neon atmosphere

#### 9. 雪地发夹 (Snow Hairpins) - `snow-hairpins`
- **Theme**: snow
- **Shape**: Tight hairpin密集, ~200x160 units
- **Width**: 11
- **Points**: 32 control points, 5-6 180-degree hairpins
- **Character**: Technical hairpin driving, snowy scenery

#### 10. 极限赛道 (Extreme Circuit) - `extreme-circuit`
- **Theme**: future
- **Shape**: Super complex, ~200x200 units
- **Width**: 10
- **Points**: 40 control points, compound corners
- **Character**: Narrowest road, most turns, ultimate challenge

## File Changes

| File | Change |
|------|--------|
| `js/tracks.js` | **New** - Track registry with 10 definitions |
| `js/track.js` | Refactor `build()` to accept track ID, parameterize themes |
| `js/game.js` | Add track selection flow, delay track build |
| `js/config.js` | Add per-track config overrides if needed |
| `index.html` | Add track selection UI panel + CSS |
| `js/minimap.js` | Auto-adapts (reads `track.spline`), no changes needed |
| `js/physics.js` | No changes (all tracks flat, `getTerrainHeight()` stays 0) |
| `js/ai.js` | No changes (AI uses `track.spline`, auto-adapts) |

## Scope

- 10 track definitions with control points
- Track selection UI
- Theme-based visual differentiation
- No elevation changes (all y=0)
- No new car models or physics changes
- Keep existing 1 track as track #1

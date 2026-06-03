# 3D卡丁车赛车游戏 - 实现计划

## 技术选型

| 组件 | 选择 | 原因 |
|------|------|------|
| 3D渲染 | **Three.js r172** (CDN importmap) | 最轻量、PBR材质、软阴影、单文件友好 |
| 物理引擎 | **cannon-es 0.20.0** (CDN script) | 内置RaycastVehicle、纯JS无需WASM、~130KB |
| 移动端控制 | **nipplejs** (CDN script) | 虚拟摇杆、多点触控、零配置 |
| 赛道生成 | **CatmullRomCurve3** + 自定义BufferGeometry | 样条曲线生成路面、护栏、地形 |
| AI对手 | **Pure Pursuit** 纯追踪算法 | 工业级卡丁车AI标准(Mario Kart同款) |
| 漂移 | 动态 `setSideFriction` 后轮 | cannon-es内置支持 |

## CDN加载顺序

```html
<!-- 1. 物理引擎 -->
<script src="https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js"></script>
<!-- 2. 移动端摇杆 -->
<script src="https://cdn.jsdelivr.net/npm/nipplejs/dist/nipplejs.min.js"></script>
<!-- 3. Three.js importmap -->
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.172.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.172.0/examples/jsm/"
  }
}
</script>
<!-- 4. 游戏代码 -->
<script type="module">...</script>
```

---

## 架构设计 (13个类/模块)

```
1.  CONFIG           - 所有可调常量(速度、力、颜色、赛道参数)
2.  InputManager     - 键盘WASD/方向键 + 触摸 -> {throttle, brake, steer, drift}
3.  TrackBuilder     - 样条曲线 -> 路面网格、护栏、地面、装饰物、三棱网格碰撞
4.  KartPhysics      - cannon-es RaycastVehicle(4轮、后驱、漂移)
5.  KartRenderer     - Three.js Group: 底盘+轮子+驾驶员+头盔
6.  Kart             - 组合物理+渲染+圈数追踪
7.  AIController     - 纯追踪航点转向 + 难度缩放
8.  CameraController - 第三人称追逐相机 + lerp平滑
9.  RaceManager      - 检查点、圈数、排名
10. MiniMap          - 160x160 canvas覆盖层显示赛道+卡丁车位置
11. HUD              - 速度、名次、圈数、计时器(HTML覆盖层)
12. ParticleSystem   - 漂移烟雾、加速火焰
13. Game             - 编排器: 初始化、固定时间步循环、状态机
```

---

## 赛道设计

### 样条控制点 (~30个点，总长约1200m)

```
起点/终点直道 -> 右急弯 -> 上坡S弯(海拔0->18) -> 山顶发卡弯
-> 下坡大弧线 -> 长直道 -> 高速左弯 -> 隧道段
-> 连续S弯 -> 低速技术弯 -> 回到起点直道
```

### 赛道参数
- 路宽: 14单位
- 样条分段: 1000段
- 护栏高度: 1.2单位
- 地形: 200x200平面 + 噪声高度变形

### 视觉效果
- 路面: 棋盘格纹理(UV重复) + 路肩红白条纹
- 护栏: 金属质感 MeshStandardMaterial
- 地形: 绿色草地 + 纹理
- 装饰: 树木(InstancedMesh)、观众看台、旗帜

---

## 卡丁车物理模型

### RaycastVehicle配置

```javascript
chassis: Box(0.8, 0.3, 1.5), mass=150
wheels: 4个, 半径=0.3, 悬挂刚度=30, 摩擦=1.5
驱动: 后轮驱动(索引2,3)
转向: 前轮(索引0,1), 最大0.5弧度
```

### 操控调优
- 速度相关力衰减: `force *= max(0, 1 - (speed/maxSpeed)^2)`
- 空气阻力 + 滚动阻力
- 防侧倾修正扭矩(稳定性)
- 漂移: 后轮 setSideFriction(0.5) 时后轮打滑

### 卡丁车3D模型(程序化几何)
- 底盘: Box + 圆角边缘
- 轮子: CylinderGeometry x4
- 驾驶员: 球体(头) + 圆柱(身体)
- 头盔: 半球 + 面罩
- 尾翼: 薄Box
- 颜色: 每辆卡丁车不同颜色

---

## AI系统

### 纯追踪算法

```
1. 从样条获取100个均匀航点
2. 找最近航点(搜索窗口±15)
3. 前瞻距离 = 6 + speed/10 (速度越快看得越远)
4. 曲率 = 2 * 横向偏移 / 距离^2 -> 转向角
5. 远处曲率 > 0.15 且速度 > 15 时刹车
```

### 难度差异化 (5个AI对手)

| AI | 速度系数 | 前瞻距离 | 特点 |
|----|----------|----------|------|
| AI-1 | 1.00 | 18 | 最强，完美走线 |
| AI-2 | 0.95 | 16 | 强，偶尔失误 |
| AI-3 | 0.90 | 14 | 中等 |
| AI-4 | 0.85 | 12 | 较弱 |
| AI-5 | 0.80 | 10 | 最弱 |

### 橡皮筋AI
- 落后时: 力 *= 1.1
- 领先时: 力 *= 0.9

---

## 相机系统

- 位置: 卡丁车后方 `CAMERA_DISTANCE` 沿前进方向, 上方 `CAMERA_HEIGHT`
- 注视: 卡丁车前方5单位
- 平滑: `1 - (1-0.06)^(dt*60)` 帧率无关插值
- FOV: 60-75 根据速度动态调整(速度感)

---

## UI设计

### HUD (HTML覆盖层)
```
左上: 位置 #1/6  圈数 2/3
右上: 计时器 01:23.45
底部中央: 速度表 120 km/h
右下: 迷你地图 160x160
```

### 迷你地图
- Canvas 160x160
- 灰色线条画赛道轮廓
- 彩色圆点标记各卡丁车位置
- 白色高亮玩家

### 游戏状态机
```
MENU -> COUNTDOWN -> RACING -> FINISHED -> MENU
```

---

## 控制方案

### 键盘(桌面)
| 键 | 功能 |
|----|------|
| W / ↑ | 加速 |
| S / ↓ | 刹车/倒车 |
| A / ← | 左转 |
| D / → | 右转 |
| Space | 漂移 |

### 触摸(移动端)
- 左半屏: nipplejs虚拟摇杆(转向+加减速)
- 右半屏: 漂移按钮

---

## 性能优化

1. **InstancedMesh**: 树木、护栏柱等重复物体
2. **LOD**: 远处物体降低精度
3. **阴影**: 仅玩家卡丁车投射阴影
4. **物理**: 固定时间步1/60s, 最大子步3
5. **渲染**: 像素比限制max(1.5), 抗锯齿开
6. **AI**: 最近航点搜索用滑动窗口而非全量遍历

---

## 实现顺序

| 步骤 | 内容 | 估计行数 |
|------|------|----------|
| 1 | HTML骨架 + CSS覆盖层 + importmap | ~100 |
| 2 | CONFIG + InputManager | ~80 |
| 3 | TrackBuilder(样条、路面、护栏、地面) | ~200 |
| 4 | Physics世界 + KartPhysics(RaycastVehicle) | ~150 |
| 5 | KartRenderer + Kart类 | ~120 |
| 6 | Game循环(一辆可驾驶卡丁车在赛道上) | ~80 |
| 7 | CameraController | ~40 |
| 8 | 赛道碰撞三棱网格 | ~60 |
| 9 | AIController + 5个AI卡丁车 | ~150 |
| 10 | RaceManager(倒计时、检查点、圈数、排名) | ~100 |
| 11 | HUD + MiniMap | ~100 |
| 12 | 菜单/结果界面 | ~60 |
| 13 | 触摸控制 | ~60 |
| 14 | 环境(树木、装饰) | ~60 |
| 15 | 粒子系统(漂移烟雾、加速火焰) | ~60 |
| 16 | 打磨: 速度FOV、阴影、重生、卡住检测 | ~80 |
| **总计** | | **~1500行** |

---

## 输出文件

- `/home/root1/users/admin/projects/test1/kart-racer.html` - 完整游戏单文件

---

## 验证清单

1. 浏览器打开 kart-racer.html -> 看到菜单界面
2. 点击START -> 倒计时3-2-1-GO
3. WASD/方向键驾驶 -> 卡丁车加速、转向、刹车手感好
4. 5个AI对手跟随赛道比赛
5. 完成3圈 -> 显示结果界面
6. 移动端触摸控制正常
7. 迷你地图显示所有卡丁车位置
8. HUD显示速度、名次、圈数、计时
9. 漂移有视觉效果(烟雾)和物理效果
10. 赛道足够长，有高低起伏和各种弯道

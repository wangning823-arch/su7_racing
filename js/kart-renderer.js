import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CONFIG } from './config.js?v=2';

// Shared loader and preloaded model
const sharedLoader = new GLTFLoader();
let preloadedGltf = null;
let preloadPromise = null;

function updateLoadingUI(progress) {
  const bar = document.getElementById('loading-bar');
  const text = document.getElementById('loading-text');
  if (bar) bar.style.width = (progress * 100) + '%';
  if (text) text.textContent = '加载中... ' + Math.round(progress * 100) + '%';
}

function onModelLoaded() {
  const btn = document.getElementById('startBtn');
  const loadingContainer = document.getElementById('loading-container');
  if (btn) {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';
  }
  if (loadingContainer) loadingContainer.style.display = 'none';
}

export class KartRenderer {
  static preload() {
    if (!preloadPromise) {
      preloadPromise = new Promise((resolve, reject) => {
        sharedLoader.load(
          'models/su7_ultra_low/scene.gltf',
          (gltf) => {
            preloadedGltf = gltf;
            updateLoadingUI(1);
            onModelLoaded();
            resolve(gltf);
          },
          (xhr) => {
            if (xhr.lengthComputable) {
              updateLoadingUI(xhr.loaded / xhr.total);
            }
          },
          (error) => {
            console.error('Error loading SU7 model:', error);
            reject(error);
          }
        );
      });
    }
    return preloadPromise;
  }

  constructor(scene, color) {
    this.group = new THREE.Group();
    this.wheels = [];
    this.modelLoaded = false;

    const buildModel = (gltf) => {
      const model = gltf.scene.clone();

      // Calculate bounding box to determine proper scale
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const min = box.min;

      // Scale to 1.5x game size for visibility
      const modelLength = Math.max(size.x, size.y, size.z);
      const targetSize = CONFIG.chassisL * 1.5;
      const scale = targetSize / modelLength;
      model.scale.set(scale, scale, scale);

      // Lower model so wheels touch ground
      model.position.y = -min.y * scale;

      // Optimize materials for performance
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.flatShading = true;
            child.material.side = THREE.FrontSide;
          }
        }
      });

      this.group.add(model);
      this.modelLoaded = true;
    };

    // Use preloaded model or load fresh
    if (preloadedGltf) {
      buildModel(preloadedGltf);
    } else {
      sharedLoader.load('models/su7_ultra_low/scene.gltf', buildModel, undefined, (error) => {
        console.error('Error loading SU7 model:', error);
      });
    }

    scene.add(this.group);
  }

  update(physics) {
    const b = physics.chassisBody;
    this.group.position.set(b.position.x, b.position.y, b.position.z);
    const q = new THREE.Quaternion(b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w);
    this.group.quaternion.copy(q);
  }
}

/**
 * Satyam Yadav - 3D WebGL Portfolio Scene
 * Three.js Procedural Mechanical Engineering & Data Lattice
 */

(function () {
  'use strict';

  // Global Scene State
  let scene, camera, renderer;
  let centralCore, outerRing1, outerRing2, outerRing3;
  let particleSystem, nodesGroup, connectionLines;
  let pointLight1, pointLight2;
  let targetRotationX = 0, targetRotationY = 0;
  let currentRotationX = 0, currentRotationY = 0;
  let mouseX = 0, mouseY = 0;
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  let scrollProgress = 0;
  let currentPreset = 'crystal';
  let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initThree() {
    const container = document.getElementById('webgl-canvas-container');
    if (!container) return;

    // Verify Three.js loaded
    if (typeof THREE === 'undefined') {
      console.warn('Three.js library not detected. Running fallback.');
      createFallbackBackground(container);
      return;
    }

    // 1. Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.0018);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 450;
    camera.position.y = 20;

    // 3. Renderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('three-canvas'),
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
    } catch (e) {
      console.warn('WebGL init failed:', e);
      createFallbackBackground(container);
      return;
    }

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x0e172a, 1.2);
    scene.add(ambientLight);

    pointLight1 = new THREE.PointLight(0x38bdf8, 2.8, 800);
    pointLight1.position.set(150, 150, 200);
    scene.add(pointLight1);

    pointLight2 = new THREE.PointLight(0x8b5cf6, 2.2, 800);
    pointLight2.position.set(-150, -150, 100);
    scene.add(pointLight2);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(0, 300, 300);
    scene.add(dirLight);

    // 5. Build Procedural 3D Objects
    buildCoreAssembly();
    buildSupplyChainNodes();
    buildBackgroundDataParticles();

    // 6. Event Listeners
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('scroll', onDocumentScroll, { passive: true });

    // Scene Preset Buttons
    setupPresetButtons();

    // 7. Start Animation Loop
    animate();
  }

  // --- 3D Mechanical & Crystal Core ---
  function buildCoreAssembly() {
    const coreGroup = new THREE.Group();
    coreGroup.position.set(180, 0, 0); // Positioned slightly to the right for desktop hero balance

    // A. DRDO SSPL Crystal Growth Core (Icosahedron faceted gem)
    const innerGeom = new THREE.IcosahedronGeometry(55, 1);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0x0ea5e9,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
      specular: 0xffffff,
      shininess: 90,
      transparent: true,
      opacity: 0.75,
      wireframe: false
    });
    const crystal = new THREE.Mesh(innerGeom, innerMat);
    coreGroup.add(crystal);

    // Wireframe overlay for crystal precision
    const wireGeom = new THREE.IcosahedronGeometry(56, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const crystalWire = new THREE.Mesh(wireGeom, wireMat);
    coreGroup.add(crystalWire);

    // B. Concentric Mechanical Gimbal / Gear Rings
    const ring1Geom = new THREE.TorusGeometry(85, 1.8, 16, 80);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: true
    });
    outerRing1 = new THREE.Mesh(ring1Geom, ring1Mat);
    coreGroup.add(outerRing1);

    const ring2Geom = new THREE.TorusGeometry(115, 1.8, 16, 90);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      metalness: 0.7,
      roughness: 0.3,
      wireframe: true
    });
    outerRing2 = new THREE.Mesh(ring2Geom, ring2Mat);
    coreGroup.add(outerRing2);

    const ring3Geom = new THREE.TorusGeometry(145, 1.2, 16, 100);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: true
    });
    outerRing3 = new THREE.Mesh(ring3Geom, ring3Mat);
    coreGroup.add(outerRing3);

    centralCore = coreGroup;
    scene.add(centralCore);
  }

  // --- Supply Chain / Analytics Orbital Nodes ---
  function buildSupplyChainNodes() {
    nodesGroup = new THREE.Group();
    const nodeCount = 36;
    const nodeGeom = new THREE.SphereGeometry(3.5, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    const positions = [];
    const radius = 220;

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi) + 180;
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      const node = new THREE.Mesh(nodeGeom, nodeMat.clone());
      node.position.set(x, y, z);
      node.userData = {
        baseX: x,
        baseY: y,
        baseZ: z,
        speed: 0.001 + Math.random() * 0.002,
        offset: Math.random() * Math.PI * 2
      };
      nodesGroup.add(node);
      positions.push(new THREE.Vector3(x, y, z));
    }

    // Dynamic Connection Lines (Supply Chain Graph Edges)
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.2
    });
    const lineGeom = new THREE.BufferGeometry();
    const linePoints = [];

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (positions[i].distanceTo(positions[j]) < 90) {
          linePoints.push(positions[i].x, positions[i].y, positions[i].z);
          linePoints.push(positions[j].x, positions[j].y, positions[j].z);
        }
      }
    }

    lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
    connectionLines = new THREE.LineSegments(lineGeom, lineMat);
    nodesGroup.add(connectionLines);

    scene.add(nodesGroup);
  }

  // --- Background Particle Matrix ---
  function buildBackgroundDataParticles() {
    const particleCount = 450;
    const geom = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const colArray = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x38bdf8);
    const color2 = new THREE.Color(0x8b5cf6);
    const color3 = new THREE.Color(0x10b981);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 1600;
      posArray[i + 1] = (Math.random() - 0.5) * 1200;
      posArray[i + 2] = (Math.random() - 0.5) * 1000;

      const r = Math.random();
      const chosenColor = r < 0.5 ? color1 : r < 0.8 ? color2 : color3;
      colArray[i] = chosenColor.r;
      colArray[i + 1] = chosenColor.g;
      colArray[i + 2] = chosenColor.b;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colArray, 3));

    // Particle Material
    const mat = new THREE.PointsMaterial({
      size: 4,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(geom, mat);
    scene.add(particleSystem);
  }

  // --- Responsive Handling ---
  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;

    // Adjust camera distance for mobile
    if (window.innerWidth < 768) {
      camera.position.z = 620;
      if (centralCore) centralCore.position.set(0, 80, 0);
      if (nodesGroup) nodesGroup.position.set(-180, 80, 0);
    } else {
      camera.position.z = 450;
      if (centralCore) centralCore.position.set(180, 0, 0);
      if (nodesGroup) nodesGroup.position.set(0, 0, 0);
    }

    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.05;
    mouseY = (event.clientY - windowHalfY) * 0.05;

    // Move point lights dynamically
    if (pointLight1) {
      pointLight1.position.x = mouseX * 4 + 100;
      pointLight1.position.y = -mouseY * 4 + 100;
    }
  }

  function onDocumentScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = window.scrollY / (maxScroll || 1);
  }

  // --- Camera & Scene Presets ---
  function setupPresetButtons() {
    const btns = document.querySelectorAll('.scene-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const preset = btn.getAttribute('data-preset');
        applyPreset(preset);
      });
    });
  }

  function applyPreset(preset) {
    currentPreset = preset;
    if (!camera || !centralCore) return;

    if (preset === 'crystal') {
      camera.position.set(window.innerWidth < 768 ? 0 : 80, 10, 420);
      camera.lookAt(window.innerWidth < 768 ? 0 : 180, 0, 0);
    } else if (preset === 'network' || preset === 'supply') {
      camera.position.set(0, 150, 520);
      camera.lookAt(0, 0, 0);
    } else if (preset === 'gimbal') {
      camera.position.set(180, -80, 360);
      camera.lookAt(180, 0, 0);
    }
  }

  // --- Animation Loop ---
  function animate() {
    requestAnimationFrame(animate);

    const time = performance.now() * 0.001;
    const motionSpeed = isReducedMotion ? 0.2 : 1;

    // Smooth mouse parallax
    targetRotationY = mouseX * 0.0006;
    targetRotationX = mouseY * 0.0006;

    currentRotationX += (targetRotationX - currentRotationX) * 0.05;
    currentRotationY += (targetRotationY - currentRotationY) * 0.05;

    // Central Core Rotations
    if (centralCore) {
      centralCore.rotation.y += 0.005 * motionSpeed;
      centralCore.rotation.x = Math.sin(time * 0.5) * 0.15 + currentRotationX;
      centralCore.rotation.z = Math.cos(time * 0.4) * 0.1;

      // Scroll-driven subtle rotation
      centralCore.rotation.y += scrollProgress * 0.02;

      // Gimbal Rings differential rotations
      if (outerRing1) {
        outerRing1.rotation.x += 0.012 * motionSpeed;
        outerRing1.rotation.y += 0.008 * motionSpeed;
      }
      if (outerRing2) {
        outerRing2.rotation.y -= 0.015 * motionSpeed;
        outerRing2.rotation.z += 0.006 * motionSpeed;
      }
      if (outerRing3) {
        outerRing3.rotation.z += 0.009 * motionSpeed;
        outerRing3.rotation.x -= 0.007 * motionSpeed;
      }
    }

    // Supply Chain Nodes Orbit
    if (nodesGroup) {
      nodesGroup.rotation.y += 0.002 * motionSpeed;
      nodesGroup.rotation.x = Math.cos(time * 0.3) * 0.08 + currentRotationX;
    }

    // Background Particle Drift
    if (particleSystem) {
      particleSystem.rotation.y -= 0.0006 * motionSpeed;
      particleSystem.rotation.x += 0.0003 * motionSpeed;
    }

    // Camera Gentle Breathing
    camera.position.x += ((mouseX * 0.8) - camera.position.x + (window.innerWidth < 768 ? 0 : 80)) * 0.03;
    camera.position.y += ((-mouseY * 0.8 + 20) - camera.position.y) * 0.03;

    renderer.render(scene, camera);
  }

  // Graceful Fallback for non-WebGL browsers
  function createFallbackBackground(container) {
    container.innerHTML = `
      <div style="position: absolute; inset: 0; background: radial-gradient(circle at 75% 30%, rgba(56,189,248,0.15), transparent 60%), radial-gradient(circle at 20% 80%, rgba(139,92,246,0.15), transparent 50%); pointer-events: none;"></div>
    `;
  }

  // Execute on DOM Load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThree);
  } else {
    initThree();
  }
})();

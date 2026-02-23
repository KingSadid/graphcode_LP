/* ============================================
   Three.js — Animated 3D Particle Background
   ============================================ */

export function initThreeScene() {
  const canvas = document.getElementById('three-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 30;

  // --- Mouse tracking ---
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // --- Particle field ---
  const PARTICLE_COUNT = 1800;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const pink = new THREE.Color(0xE91E8C);
  const blue = new THREE.Color(0x6C63FF);
  const white = new THREE.Color(0x8892A4);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    positions[i3]     = (Math.random() - 0.5) * 60;
    positions[i3 + 1] = (Math.random() - 0.5) * 60;
    positions[i3 + 2] = (Math.random() - 0.5) * 40;

    const color = Math.random() < 0.4 ? pink : Math.random() < 0.5 ? blue : white;
    colors[i3]     = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // --- Floating geometries ---
  const geoMat = new THREE.MeshBasicMaterial({
    color: 0xE91E8C,
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  });

  const meshes = [
    new THREE.Mesh(new THREE.IcosahedronGeometry(3, 1), geoMat),
    new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.6, 8, 24), geoMat.clone()),
    new THREE.Mesh(new THREE.OctahedronGeometry(2, 0), geoMat.clone()),
  ];

  meshes[0].position.set(-12, 5, -10);
  meshes[1].position.set(14, -6, -8);
  meshes[1].material.color.set(0x6C63FF);
  meshes[2].position.set(0, 10, -12);
  meshes[2].material.color.set(0x8892A4);

  meshes.forEach((m) => scene.add(m));

  // --- Connection lines ---
  const LINE_COUNT = 60;
  const linePositions = new Float32Array(LINE_COUNT * 6);
  for (let i = 0; i < LINE_COUNT; i++) {
    const i6 = i * 6;
    linePositions[i6]     = (Math.random() - 0.5) * 50;
    linePositions[i6 + 1] = (Math.random() - 0.5) * 50;
    linePositions[i6 + 2] = (Math.random() - 0.5) * 30;
    linePositions[i6 + 3] = linePositions[i6] + (Math.random() - 0.5) * 8;
    linePositions[i6 + 4] = linePositions[i6 + 1] + (Math.random() - 0.5) * 8;
    linePositions[i6 + 5] = linePositions[i6 + 2] + (Math.random() - 0.5) * 5;
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0xE91E8C, transparent: true, opacity: 0.06 });
  scene.add(new THREE.LineSegments(lineGeo, lineMat));

  // --- Animation loop ---
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Smooth mouse follow
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    // Rotate particles
    particles.rotation.y = t * 0.03 + mouse.x * 0.3;
    particles.rotation.x = mouse.y * 0.2;

    // Rotate geometries
    meshes.forEach((m, i) => {
      m.rotation.x = t * (0.1 + i * 0.05);
      m.rotation.y = t * (0.08 + i * 0.04);
      m.position.y += Math.sin(t + i * 2) * 0.003;
    });

    renderer.render(scene, camera);
  }

  animate();

  // --- Resize ---
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

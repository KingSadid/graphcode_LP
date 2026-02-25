/* ============================================
   Three.js — Scene Factory (Optimised)
   ============================================
   Particle counts, geometry segments, and extra
   objects have been drastically reduced to keep
   the animation loop below 4ms per frame.
   ============================================ */

export function initThreeScene(namespace) {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return null;

  const dpr = Math.min(window.devicePixelRatio, 1.5); // cap DPR for perf
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 30;

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const onMouseMove = (e) => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('mousemove', onMouseMove);

  const clock = new THREE.Clock();
  let animationId;

  const sceneData = buildScene(namespace, scene);

  function animate() {
    animationId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    updateScene(namespace, sceneData, t, mouse);
    renderer.render(scene, camera);
  }

  animate();

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize);

  // Cleanup
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
    renderer.dispose();
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    });
  };
}

/* --------------------------------------------------
   Router
   -------------------------------------------------- */
function buildScene(ns, scene) {
  switch (ns) {
    case 'inicio': return buildHero(scene);
    case 'productos': return buildProducts(scene);
    case 'fundadores': return buildFounders(scene);
    case 'redes': return buildNetwork(scene);
    case 'contacto': return buildContact(scene);
    default: return buildHero(scene);
  }
}

function updateScene(ns, data, t, mouse) {
  switch (ns) {
    case 'inicio': return updateHero(data, t, mouse);
    case 'productos': return updateProducts(data, t, mouse);
    case 'fundadores': return updateFounders(data, t, mouse);
    case 'redes': return updateNetwork(data, t, mouse);
    case 'contacto': return updateContact(data, t, mouse);
    default: return updateHero(data, t, mouse);
  }
}

/* --------------------------------------------------
   Shared helpers
   -------------------------------------------------- */
function makeParticles(scene, count, spread, colors, size, opacity) {
  const positions = new Float32Array(count * 3);
  const colorsArr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * spread;
    positions[i3 + 1] = (Math.random() - 0.5) * spread;
    positions[i3 + 2] = (Math.random() - 0.5) * (spread * 0.6);
    const c = colors[Math.floor(Math.random() * colors.length)];
    colorsArr[i3] = c.r; colorsArr[i3 + 1] = c.g; colorsArr[i3 + 2] = c.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colorsArr, 3));
  const mat = new THREE.PointsMaterial({
    size, vertexColors: true, transparent: true, opacity, sizeAttenuation: true
  });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);
  return pts;
}

/* ============================
   INICIO — Hero
   ============================ */
function buildHero(scene) {
  const d = {};
  const pink = new THREE.Color(0xE91E8C);
  const blue = new THREE.Color(0x6C63FF);
  const white = new THREE.Color(0x8892A4);

  d.particles = makeParticles(scene, 800, 80, [pink, blue, white], 0.1, 0.7);

  // Two wireframe meshes
  const wireMat = new THREE.MeshBasicMaterial({ color: 0xE91E8C, wireframe: true, transparent: true, opacity: 0.1 });
  d.meshes = [
    new THREE.Mesh(new THREE.IcosahedronGeometry(3, 1), wireMat),
    new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.6, 8, 20), wireMat.clone()),
  ];
  d.meshes[0].position.set(-12, 5, -10);
  d.meshes[1].position.set(14, -6, -8);
  d.meshes[1].material.color.set(0x6C63FF);
  d.meshes.forEach(m => scene.add(m));

  // Connection lines
  const lc = 30;
  const lp = new Float32Array(lc * 6);
  for (let i = 0; i < lc; i++) {
    const i6 = i * 6;
    lp[i6] = (Math.random() - 0.5) * 50;
    lp[i6 + 1] = (Math.random() - 0.5) * 50;
    lp[i6 + 2] = (Math.random() - 0.5) * 30;
    lp[i6 + 3] = lp[i6] + (Math.random() - 0.5) * 8;
    lp[i6 + 4] = lp[i6 + 1] + (Math.random() - 0.5) * 8;
    lp[i6 + 5] = lp[i6 + 2] + (Math.random() - 0.5) * 5;
  }
  const lg = new THREE.BufferGeometry();
  lg.setAttribute('position', new THREE.BufferAttribute(lp, 3));
  d.lines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0xE91E8C, transparent: true, opacity: 0.05 }));
  scene.add(d.lines);

  return d;
}

function updateHero(d, t, mouse) {
  d.particles.rotation.y = t * 0.03 + mouse.x * 0.3;
  d.particles.rotation.x = mouse.y * 0.2;
  d.meshes.forEach((m, i) => {
    m.rotation.x = t * (0.1 + i * 0.05);
    m.rotation.y = t * (0.08 + i * 0.04);
  });
  d.lines.rotation.y = t * 0.01;
}

/* ============================
   PRODUCTOS — Crystal Shards
   ============================ */
function buildProducts(scene) {
  const d = {};
  const cyan = new THREE.Color(0x00E5FF);
  const magenta = new THREE.Color(0xFF00E5);
  const pink = new THREE.Color(0xE91E8C);

  d.particles = makeParticles(scene, 600, 70, [cyan, magenta, pink], 0.12, 0.55);

  // 3 crystal shapes
  d.crystals = [];
  const geos = [
    new THREE.DodecahedronGeometry(1.5, 0),
    new THREE.ConeGeometry(1, 3, 5),
    new THREE.TetrahedronGeometry(1.8, 0),
  ];
  const cols = [0x00E5FF, 0xFF00E5, 0xE91E8C];
  geos.forEach((g, i) => {
    const mat = new THREE.MeshBasicMaterial({ color: cols[i], wireframe: true, transparent: true, opacity: 0.12 });
    const mesh = new THREE.Mesh(g, mat);
    mesh.position.set((Math.random() - 0.5) * 25, (Math.random() - 0.5) * 20, -10 - Math.random() * 10);
    scene.add(mesh);
    d.crystals.push(mesh);
  });

  return d;
}

function updateProducts(d, t, mouse) {
  d.particles.rotation.y = t * 0.02 + mouse.x * 0.2;
  d.particles.rotation.x = t * 0.01 + mouse.y * 0.15;
  d.crystals.forEach((c, i) => {
    c.rotation.x = t * (0.15 + i * 0.03);
    c.rotation.y = t * (0.12 + i * 0.05);
  });
}

/* ============================
   FUNDADORES — DNA Helix
   ============================ */
function buildFounders(scene) {
  const d = {};
  const gold = new THREE.Color(0xFFD700);
  const warmPink = new THREE.Color(0xE91E8C);
  const softBlue = new THREE.Color(0x4A90D9);

  d.particles = makeParticles(scene, 500, 60, [gold, warmPink, softBlue], 0.1, 0.6);

  // Simplified DNA — 15 pairs instead of 40
  d.helixGroup = new THREE.Group();
  const helixCount = 15;
  const sharedGeo = new THREE.SphereGeometry(0.25, 6, 6);
  for (let i = 0; i < helixCount; i++) {
    const angle = (i / helixCount) * Math.PI * 4;
    const y = (i / helixCount) * 30 - 15;
    const r = 5;
    const s1 = new THREE.Mesh(sharedGeo, new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.25 }));
    s1.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
    const s2 = new THREE.Mesh(sharedGeo, new THREE.MeshBasicMaterial({ color: 0xE91E8C, transparent: true, opacity: 0.25 }));
    s2.position.set(Math.cos(angle + Math.PI) * r, y, Math.sin(angle + Math.PI) * r);
    d.helixGroup.add(s1, s2);
  }
  d.helixGroup.position.z = -15;
  scene.add(d.helixGroup);

  return d;
}

function updateFounders(d, t, mouse) {
  d.particles.rotation.y = t * 0.015 + mouse.x * 0.2;
  d.particles.rotation.x = mouse.y * 0.1;
  d.helixGroup.rotation.y = t * 0.12;
}

/* ============================
   REDES — Network Mesh
   ============================ */
function buildNetwork(scene) {
  const d = {};
  const neonBlue = new THREE.Color(0x00B4FF);
  const pink = new THREE.Color(0xE91E8C);
  const purple = new THREE.Color(0x9B59B6);

  d.particles = makeParticles(scene, 600, 70, [neonBlue, pink, purple], 0.11, 0.65);

  // 3 orbiting spheres
  d.orbitals = [];
  const cols = [0x00B4FF, 0xE91E8C, 0x9B59B6];
  const sharedGeo = new THREE.SphereGeometry(0.5, 8, 8);
  for (let i = 0; i < 3; i++) {
    const sphere = new THREE.Mesh(sharedGeo, new THREE.MeshBasicMaterial({ color: cols[i], transparent: true, opacity: 0.2 }));
    scene.add(sphere);
    d.orbitals.push({ sphere, angle: (i / 3) * Math.PI * 2, radius: 8 + i * 3, speed: 0.15 + i * 0.05 });
  }

  // Network lines
  const lc = 40;
  const lp = new Float32Array(lc * 6);
  for (let i = 0; i < lc; i++) {
    const i6 = i * 6;
    lp[i6] = (Math.random() - 0.5) * 50;
    lp[i6 + 1] = (Math.random() - 0.5) * 50;
    lp[i6 + 2] = (Math.random() - 0.5) * 30;
    lp[i6 + 3] = lp[i6] + (Math.random() - 0.5) * 12;
    lp[i6 + 4] = lp[i6 + 1] + (Math.random() - 0.5) * 12;
    lp[i6 + 5] = lp[i6 + 2] + (Math.random() - 0.5) * 8;
  }
  const lg = new THREE.BufferGeometry();
  lg.setAttribute('position', new THREE.BufferAttribute(lp, 3));
  d.networkLines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x00B4FF, transparent: true, opacity: 0.05 }));
  scene.add(d.networkLines);

  return d;
}

function updateNetwork(d, t, mouse) {
  d.particles.rotation.y = t * 0.02 + mouse.x * 0.25;
  d.particles.rotation.x = mouse.y * 0.15;
  d.orbitals.forEach((o) => {
    o.angle += 0.003 * o.speed;
    o.sphere.position.x = Math.cos(o.angle) * o.radius;
    o.sphere.position.y = Math.sin(o.angle * 0.7) * o.radius * 0.5;
    o.sphere.position.z = Math.sin(o.angle) * o.radius - 12;
  });
  d.networkLines.rotation.y = t * 0.008;
}

/* ============================
   CONTACTO — Flowing Ribbons
   ============================ */
function buildContact(scene) {
  const d = {};
  const warmWhite = new THREE.Color(0xFFF5F0);
  const pink = new THREE.Color(0xE91E8C);
  const softPurple = new THREE.Color(0x9B7FDB);

  d.particles = makeParticles(scene, 400, 60, [warmWhite, pink, softPurple], 0.08, 0.45);

  // 2 ribbon curves (simplified segments)
  d.ribbons = [];
  const ribbonColors = [0xE91E8C, 0x6C63FF];
  for (let r = 0; r < 2; r++) {
    const points = [];
    for (let i = 0; i <= 30; i++) {
      const frac = i / 30;
      points.push(new THREE.Vector3(
        (frac - 0.5) * 40,
        Math.sin(frac * Math.PI * 3 + r * 2) * 6,
        -10 - r * 5
      ));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeo = new THREE.TubeGeometry(curve, 40, 0.08, 4, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: ribbonColors[r], transparent: true, opacity: 0.1 });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(tube);
    d.ribbons.push({ mesh: tube, offset: r * 2 });
  }

  return d;
}

function updateContact(d, t, mouse) {
  d.particles.rotation.y = t * 0.012 + mouse.x * 0.15;
  d.particles.rotation.x = mouse.y * 0.1;
  d.ribbons.forEach((ribbon) => {
    ribbon.mesh.rotation.z = Math.sin(t * 0.2 + ribbon.offset) * 0.05;
    ribbon.mesh.position.y = Math.sin(t * 0.3 + ribbon.offset) * 0.5;
  });
}

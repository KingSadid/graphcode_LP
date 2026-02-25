/* ============================================
   Three.js — Scene Factory (unique scene per page)
   ============================================ */

export function initThreeScene(namespace) {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return null;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

  // Build scene based on namespace
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

  // Return cleanup function
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
   Scene Builders — Each namespace gets unique visuals
   -------------------------------------------------- */

function buildScene(namespace, scene) {
  switch (namespace) {
    case 'inicio': return buildHeroScene(scene);
    case 'productos': return buildProductsScene(scene);
    case 'fundadores': return buildFoundersScene(scene);
    case 'redes': return buildNetworkScene(scene);
    case 'contacto': return buildContactScene(scene);
    default: return buildHeroScene(scene);
  }
}

function updateScene(namespace, data, t, mouse) {
  switch (namespace) {
    case 'inicio': return updateHeroScene(data, t, mouse);
    case 'productos': return updateProductsScene(data, t, mouse);
    case 'fundadores': return updateFoundersScene(data, t, mouse);
    case 'redes': return updateNetworkScene(data, t, mouse);
    case 'contacto': return updateContactScene(data, t, mouse);
    default: return updateHeroScene(data, t, mouse);
  }
}

/* ============================
   INICIO — Enhanced Hero Scene
   ============================ */
function buildHeroScene(scene) {
  const data = {};

  // Main particle field — stars
  const COUNT = 2500;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const pink = new THREE.Color(0xE91E8C);
  const blue = new THREE.Color(0x6C63FF);
  const white = new THREE.Color(0x8892A4);

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 80;
    positions[i3 + 1] = (Math.random() - 0.5) * 80;
    positions[i3 + 2] = (Math.random() - 0.5) * 50;
    const c = Math.random() < 0.35 ? pink : Math.random() < 0.5 ? blue : white;
    colors[i3] = c.r; colors[i3 + 1] = c.g; colors[i3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({ size: 0.09, vertexColors: true, transparent: true, opacity: 0.75, sizeAttenuation: true });
  data.particles = new THREE.Points(geo, mat);
  scene.add(data.particles);

  // Shooting stars
  data.shootingStars = [];
  for (let i = 0; i < 5; i++) {
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(6);
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.LineBasicMaterial({ color: 0xE91E8C, transparent: true, opacity: 0 });
    const star = new THREE.LineSegments(starGeo, starMat);
    scene.add(star);
    data.shootingStars.push({
      mesh: star,
      pos: starPos,
      speed: 0.5 + Math.random() * 1.5,
      timer: Math.random() * 10,
      active: false,
      x: 0, y: 0, z: 0
    });
  }

  // Floating geometries
  const geoMat = new THREE.MeshBasicMaterial({ color: 0xE91E8C, wireframe: true, transparent: true, opacity: 0.12 });
  data.meshes = [
    new THREE.Mesh(new THREE.IcosahedronGeometry(3, 1), geoMat),
    new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.6, 8, 24), geoMat.clone()),
    new THREE.Mesh(new THREE.OctahedronGeometry(2, 0), geoMat.clone()),
  ];
  data.meshes[0].position.set(-12, 5, -10);
  data.meshes[1].position.set(14, -6, -8);
  data.meshes[1].material.color.set(0x6C63FF);
  data.meshes[2].position.set(0, 10, -12);
  data.meshes[2].material.color.set(0x8892A4);
  data.meshes.forEach(m => scene.add(m));

  // Pulsing rings
  data.rings = [];
  const ringColors = [0xE91E8C, 0x6C63FF, 0x8892A4];
  for (let i = 0; i < 3; i++) {
    const ringGeo = new THREE.TorusGeometry(4 + i * 2, 0.05, 8, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: ringColors[i], transparent: true, opacity: 0.08 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(0, 0, -15 - i * 3);
    scene.add(ring);
    data.rings.push(ring);
  }

  // Connection lines
  const LINE_COUNT = 60;
  const linePos = new Float32Array(LINE_COUNT * 6);
  for (let i = 0; i < LINE_COUNT; i++) {
    const i6 = i * 6;
    linePos[i6] = (Math.random() - 0.5) * 50;
    linePos[i6 + 1] = (Math.random() - 0.5) * 50;
    linePos[i6 + 2] = (Math.random() - 0.5) * 30;
    linePos[i6 + 3] = linePos[i6] + (Math.random() - 0.5) * 8;
    linePos[i6 + 4] = linePos[i6 + 1] + (Math.random() - 0.5) * 8;
    linePos[i6 + 5] = linePos[i6 + 2] + (Math.random() - 0.5) * 5;
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0xE91E8C, transparent: true, opacity: 0.06 });
  data.lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(data.lines);

  return data;
}

function updateHeroScene(data, t, mouse) {
  data.particles.rotation.y = t * 0.03 + mouse.x * 0.3;
  data.particles.rotation.x = mouse.y * 0.2;

  data.meshes.forEach((m, i) => {
    m.rotation.x = t * (0.1 + i * 0.05);
    m.rotation.y = t * (0.08 + i * 0.04);
    m.position.y += Math.sin(t + i * 2) * 0.003;
  });

  // Pulsing rings
  data.rings.forEach((ring, i) => {
    ring.rotation.x = t * 0.05 * (i + 1);
    ring.rotation.y = t * 0.03 * (i + 1);
    ring.material.opacity = 0.05 + Math.sin(t * 0.5 + i) * 0.04;
    const s = 1 + Math.sin(t * 0.3 + i * 1.5) * 0.15;
    ring.scale.set(s, s, s);
  });

  // Shooting stars
  data.shootingStars.forEach((star) => {
    star.timer -= 0.016;
    if (star.timer <= 0 && !star.active) {
      star.active = true;
      star.x = (Math.random() - 0.5) * 60;
      star.y = 20 + Math.random() * 15;
      star.z = -5 - Math.random() * 20;
      star.mesh.material.opacity = 0.8;
    }
    if (star.active) {
      star.x += star.speed * 0.8;
      star.y -= star.speed * 0.5;
      star.pos[0] = star.x; star.pos[1] = star.y; star.pos[2] = star.z;
      star.pos[3] = star.x - 2; star.pos[4] = star.y + 1.2; star.pos[5] = star.z;
      star.mesh.geometry.attributes.position.needsUpdate = true;
      star.mesh.material.opacity *= 0.98;
      if (star.mesh.material.opacity < 0.01) {
        star.active = false;
        star.timer = 3 + Math.random() * 6;
        star.mesh.material.opacity = 0;
      }
    }
  });

  data.lines.rotation.y = t * 0.01;
}

/* ============================
   PRODUCTOS — Crystal Shards
   ============================ */
function buildProductsScene(scene) {
  const data = {};

  // Crystal particle field
  const COUNT = 1500;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const cyan = new THREE.Color(0x00E5FF);
  const magenta = new THREE.Color(0xFF00E5);
  const pink = new THREE.Color(0xE91E8C);

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 70;
    positions[i3 + 1] = (Math.random() - 0.5) * 70;
    positions[i3 + 2] = (Math.random() - 0.5) * 40;
    const c = Math.random() < 0.33 ? cyan : Math.random() < 0.5 ? magenta : pink;
    colors[i3] = c.r; colors[i3 + 1] = c.g; colors[i3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({ size: 0.12, vertexColors: true, transparent: true, opacity: 0.6, sizeAttenuation: true });
  data.particles = new THREE.Points(geo, mat);
  scene.add(data.particles);

  // Crystal geometries
  const crystalMat = new THREE.MeshBasicMaterial({ color: 0x00E5FF, wireframe: true, transparent: true, opacity: 0.15 });
  data.crystals = [];
  for (let i = 0; i < 6; i++) {
    const geom = i % 3 === 0
      ? new THREE.DodecahedronGeometry(1.5 + Math.random(), 0)
      : i % 3 === 1
        ? new THREE.ConeGeometry(1, 3, 6)
        : new THREE.TetrahedronGeometry(1.8, 0);
    const m = crystalMat.clone();
    m.color.set([0x00E5FF, 0xFF00E5, 0xE91E8C][i % 3]);
    const mesh = new THREE.Mesh(geom, m);
    mesh.position.set(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 25,
      -8 - Math.random() * 15
    );
    scene.add(mesh);
    data.crystals.push(mesh);
  }

  return data;
}

function updateProductsScene(data, t, mouse) {
  data.particles.rotation.y = t * 0.02 + mouse.x * 0.2;
  data.particles.rotation.x = t * 0.01 + mouse.y * 0.15;

  data.crystals.forEach((c, i) => {
    c.rotation.x = t * (0.15 + i * 0.03);
    c.rotation.y = t * (0.12 + i * 0.05);
    c.rotation.z = t * 0.05;
    c.position.y += Math.sin(t * 0.8 + i * 1.3) * 0.004;
    c.material.opacity = 0.1 + Math.sin(t + i * 0.7) * 0.06;
  });
}

/* ============================
   FUNDADORES — DNA Helix
   ============================ */
function buildFoundersScene(scene) {
  const data = {};

  // Warm particles
  const COUNT = 1200;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const gold = new THREE.Color(0xFFD700);
  const warmPink = new THREE.Color(0xE91E8C);
  const softBlue = new THREE.Color(0x4A90D9);

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 60;
    positions[i3 + 1] = (Math.random() - 0.5) * 60;
    positions[i3 + 2] = (Math.random() - 0.5) * 40;
    const c = Math.random() < 0.3 ? gold : Math.random() < 0.5 ? warmPink : softBlue;
    colors[i3] = c.r; colors[i3 + 1] = c.g; colors[i3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({ size: 0.1, vertexColors: true, transparent: true, opacity: 0.65, sizeAttenuation: true });
  data.particles = new THREE.Points(geo, mat);
  scene.add(data.particles);

  // DNA Helix structure
  data.helixSpheres = [];
  const helixCount = 40;
  for (let i = 0; i < helixCount; i++) {
    const angle = (i / helixCount) * Math.PI * 6;
    const y = (i / helixCount) * 40 - 20;
    const radius = 5;

    // Strand 1
    const s1Geo = new THREE.SphereGeometry(0.25, 8, 8);
    const s1Mat = new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.3 });
    const s1 = new THREE.Mesh(s1Geo, s1Mat);
    s1.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius - 15);
    scene.add(s1);

    // Strand 2
    const s2Geo = new THREE.SphereGeometry(0.25, 8, 8);
    const s2Mat = new THREE.MeshBasicMaterial({ color: 0xE91E8C, transparent: true, opacity: 0.3 });
    const s2 = new THREE.Mesh(s2Geo, s2Mat);
    s2.position.set(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius - 15);
    scene.add(s2);

    data.helixSpheres.push(s1, s2);
  }

  // Torus knots
  data.knots = [];
  for (let i = 0; i < 2; i++) {
    const knotGeo = new THREE.TorusKnotGeometry(2, 0.4, 64, 8);
    const knotMat = new THREE.MeshBasicMaterial({ color: i === 0 ? 0xFFD700 : 0x4A90D9, wireframe: true, transparent: true, opacity: 0.08 });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    knot.position.set(i === 0 ? -15 : 15, 0, -12);
    scene.add(knot);
    data.knots.push(knot);
  }

  return data;
}

function updateFoundersScene(data, t, mouse) {
  data.particles.rotation.y = t * 0.015 + mouse.x * 0.2;
  data.particles.rotation.x = mouse.y * 0.1;

  // Rotate helix
  data.helixSpheres.forEach((s) => {
    s.position.y += Math.sin(t * 0.5) * 0.002;
    s.material.opacity = 0.2 + Math.sin(t + s.position.y * 0.3) * 0.12;
  });

  data.knots.forEach((k, i) => {
    k.rotation.x = t * 0.1 * (i + 1);
    k.rotation.y = t * 0.08 * (i + 1);
  });
}

/* ============================
   REDES — Network Mesh
   ============================ */
function buildNetworkScene(scene) {
  const data = {};

  // Network node particles
  const COUNT = 2000;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const neonBlue = new THREE.Color(0x00B4FF);
  const pink = new THREE.Color(0xE91E8C);
  const purple = new THREE.Color(0x9B59B6);

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 70;
    positions[i3 + 1] = (Math.random() - 0.5) * 70;
    positions[i3 + 2] = (Math.random() - 0.5) * 45;
    const c = Math.random() < 0.4 ? neonBlue : Math.random() < 0.5 ? pink : purple;
    colors[i3] = c.r; colors[i3 + 1] = c.g; colors[i3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({ size: 0.11, vertexColors: true, transparent: true, opacity: 0.7, sizeAttenuation: true });
  data.particles = new THREE.Points(geo, mat);
  scene.add(data.particles);

  // Orbiting connected spheres
  data.orbitals = [];
  const orbitColors = [0x00B4FF, 0xE91E8C, 0x9B59B6, 0x00B4FF, 0xE91E8C];
  for (let i = 0; i < 5; i++) {
    const sGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const sMat = new THREE.MeshBasicMaterial({ color: orbitColors[i], transparent: true, opacity: 0.25 });
    const sphere = new THREE.Mesh(sGeo, sMat);
    scene.add(sphere);

    // Ring around each sphere
    const rGeo = new THREE.TorusGeometry(1.2, 0.03, 8, 32);
    const rMat = new THREE.MeshBasicMaterial({ color: orbitColors[i], transparent: true, opacity: 0.15 });
    const ring = new THREE.Mesh(rGeo, rMat);
    sphere.add(ring);

    data.orbitals.push({ sphere, ring, angle: (i / 5) * Math.PI * 2, radius: 8 + i * 2, speed: 0.2 + i * 0.05 });
  }

  // Network lines
  const lineCount = 80;
  const linePos = new Float32Array(lineCount * 6);
  for (let i = 0; i < lineCount; i++) {
    const i6 = i * 6;
    linePos[i6] = (Math.random() - 0.5) * 50;
    linePos[i6 + 1] = (Math.random() - 0.5) * 50;
    linePos[i6 + 2] = (Math.random() - 0.5) * 30;
    linePos[i6 + 3] = linePos[i6] + (Math.random() - 0.5) * 12;
    linePos[i6 + 4] = linePos[i6 + 1] + (Math.random() - 0.5) * 12;
    linePos[i6 + 5] = linePos[i6 + 2] + (Math.random() - 0.5) * 8;
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0x00B4FF, transparent: true, opacity: 0.05 });
  data.networkLines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(data.networkLines);

  return data;
}

function updateNetworkScene(data, t, mouse) {
  data.particles.rotation.y = t * 0.02 + mouse.x * 0.25;
  data.particles.rotation.x = mouse.y * 0.15;

  data.orbitals.forEach((o) => {
    o.angle += 0.003 * o.speed;
    o.sphere.position.x = Math.cos(o.angle) * o.radius;
    o.sphere.position.y = Math.sin(o.angle * 0.7) * o.radius * 0.5;
    o.sphere.position.z = Math.sin(o.angle) * o.radius - 12;
    o.ring.rotation.x = t * 0.5;
    o.ring.rotation.z = t * 0.3;
    o.sphere.material.opacity = 0.2 + Math.sin(t + o.angle) * 0.1;
  });

  data.networkLines.rotation.y = t * 0.008;
  data.networkLines.rotation.x = Math.sin(t * 0.1) * 0.02;
}

/* ============================
   CONTACTO — Flowing Ribbons
   ============================ */
function buildContactScene(scene) {
  const data = {};

  // Soft gradient particles
  const COUNT = 1000;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const warmWhite = new THREE.Color(0xFFF5F0);
  const pink = new THREE.Color(0xE91E8C);
  const softPurple = new THREE.Color(0x9B7FDB);

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 60;
    positions[i3 + 1] = (Math.random() - 0.5) * 60;
    positions[i3 + 2] = (Math.random() - 0.5) * 35;
    const c = Math.random() < 0.3 ? warmWhite : Math.random() < 0.5 ? pink : softPurple;
    colors[i3] = c.r; colors[i3 + 1] = c.g; colors[i3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({ size: 0.08, vertexColors: true, transparent: true, opacity: 0.5, sizeAttenuation: true });
  data.particles = new THREE.Points(geo, mat);
  scene.add(data.particles);

  // Flowing ribbon curves
  data.ribbons = [];
  const ribbonColors = [0xE91E8C, 0x6C63FF, 0x9B7FDB];
  for (let r = 0; r < 3; r++) {
    const points = [];
    for (let i = 0; i <= 50; i++) {
      const t = i / 50;
      points.push(new THREE.Vector3(
        (t - 0.5) * 40,
        Math.sin(t * Math.PI * 3 + r * 2) * 6,
        -10 - r * 5
      ));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeo = new THREE.TubeGeometry(curve, 80, 0.08, 6, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: ribbonColors[r], transparent: true, opacity: 0.12 });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(tube);
    data.ribbons.push({ mesh: tube, basePoints: points, offset: r * 2 });
  }

  // Soft cubes
  data.cubes = [];
  for (let i = 0; i < 4; i++) {
    const cubeGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const cubeMat = new THREE.MeshBasicMaterial({ color: [0xE91E8C, 0x6C63FF, 0x9B7FDB, 0xFFF5F0][i], wireframe: true, transparent: true, opacity: 0.08 });
    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    cube.position.set((Math.random() - 0.5) * 25, (Math.random() - 0.5) * 20, -8 - Math.random() * 10);
    scene.add(cube);
    data.cubes.push(cube);
  }

  return data;
}

function updateContactScene(data, t, mouse) {
  data.particles.rotation.y = t * 0.012 + mouse.x * 0.15;
  data.particles.rotation.x = mouse.y * 0.1;

  data.ribbons.forEach((ribbon) => {
    ribbon.mesh.rotation.z = Math.sin(t * 0.2 + ribbon.offset) * 0.05;
    ribbon.mesh.position.y = Math.sin(t * 0.3 + ribbon.offset) * 0.5;
    ribbon.mesh.material.opacity = 0.08 + Math.sin(t * 0.4 + ribbon.offset) * 0.04;
  });

  data.cubes.forEach((cube, i) => {
    cube.rotation.x = t * 0.1 * (i + 1);
    cube.rotation.y = t * 0.08 * (i + 1);
    cube.position.y += Math.sin(t * 0.5 + i * 1.5) * 0.002;
  });
}

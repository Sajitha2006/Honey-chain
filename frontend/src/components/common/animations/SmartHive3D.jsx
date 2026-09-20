import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const SmartHive3D = () => {
  const mountRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch (e) {
      setWebglSupported(false);
      return;
    }

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070a11, 0.08);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 7.5);

    // 2. RENDERER
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // 3. LIGHTING
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 1.2);
    scene.add(ambientLight);

    // Main Golden Key Light
    const keyLight = new THREE.DirectionalLight(0xf59e0b, 3.5);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Warm Rim Light
    const rimLight = new THREE.DirectionalLight(0xd97706, 2.0);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    // Internal Hive Glow Point Light
    const internalGlow = new THREE.PointLight(0xfbbf24, 4.0, 5);
    internalGlow.position.set(0, 0.2, 0);
    scene.add(internalGlow);

    // Bottom Ambient Honey Light
    const honeyLight = new THREE.PointLight(0xd97706, 3.0, 4);
    honeyLight.position.set(0, -1.5, 1);
    scene.add(honeyLight);

    // 4. HIVE MODEL GROUP
    const hiveGroup = new THREE.Group();
    scene.add(hiveGroup);

    // Materials
    const woodDarkMat = new THREE.MeshStandardMaterial({
      color: 0x3d2314,
      roughness: 0.7,
      metalness: 0.1,
    });

    const woodMainMat = new THREE.MeshStandardMaterial({
      color: 0x6e4326,
      roughness: 0.6,
      metalness: 0.05,
    });

    const woodLightMat = new THREE.MeshStandardMaterial({
      color: 0x966138,
      roughness: 0.5,
      metalness: 0.1,
    });

    const goldAccentMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xd97706,
      emissiveIntensity: 0.3,
    });

    const glowingCoreMat = new THREE.MeshBasicMaterial({
      color: 0xfcd34d,
    });

    // Base Stand (Wooden Legs & Frame)
    const legGeo = new THREE.BoxGeometry(0.2, 0.8, 0.2);
    const legPositions = [
      [-1.1, -1.8, -0.9],
      [1.1, -1.8, -0.9],
      [-1.1, -1.8, 0.9],
      [1.1, -1.8, 0.9],
    ];

    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, woodDarkMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      leg.receiveShadow = true;
      hiveGroup.add(leg);
    });

    // Stand Base Plate
    const basePlate = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.15, 2.2),
      woodDarkMat
    );
    basePlate.position.set(0, -1.35, 0);
    basePlate.castShadow = true;
    basePlate.receiveShadow = true;
    hiveGroup.add(basePlate);

    // Hive Tier Boxes (Bottom, Middle, Top)
    const boxHeights = [0.75, 0.7, 0.65];
    const boxYOffsets = [-0.9, -0.1, 0.6];
    const boxWidths = [2.2, 2.1, 2.0];

    boxHeights.forEach((h, i) => {
      const w = boxWidths[i];
      const y = boxYOffsets[i];

      // Outer Wooden Box
      const boxGeo = new THREE.BoxGeometry(w, h, w * 0.85);
      const mat = i % 2 === 0 ? woodMainMat : woodLightMat;
      const boxMesh = new THREE.Mesh(boxGeo, mat);
      boxMesh.position.set(0, y, 0);
      boxMesh.castShadow = true;
      boxMesh.receiveShadow = true;
      hiveGroup.add(boxMesh);

      // Gold Trim Handles on Sides
      const handleGeo = new THREE.BoxGeometry(0.5, 0.08, 0.1);
      const handleLeft = new THREE.Mesh(handleGeo, goldAccentMat);
      handleLeft.position.set(-w / 2 - 0.04, y, 0);
      hiveGroup.add(handleLeft);

      const handleRight = new THREE.Mesh(handleGeo, goldAccentMat);
      handleRight.position.set(w / 2 + 0.04, y, 0);
      hiveGroup.add(handleRight);
    });

    // Entrance Slot on Lower Box
    const entranceSlot = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.12, 0.1),
      new THREE.MeshBasicMaterial({ color: 0x0f0b08 })
    );
    entranceSlot.position.set(0, -1.15, 0.93);
    hiveGroup.add(entranceSlot);

    // Glowing Internal Honeycomb Core inside Entrance
    const innerGlowCore = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.08, 0.05),
      glowingCoreMat
    );
    innerGlowCore.position.set(0, -1.15, 0.9);
    hiveGroup.add(innerGlowCore);

    // Hive Roof (Angled Sloped Lid)
    const roofBase = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.12, 2.2),
      woodDarkMat
    );
    roofBase.position.set(0, 1.0, 0);
    roofBase.castShadow = true;
    hiveGroup.add(roofBase);

    // Roof Pitch (Pitched Top)
    const roofShape = new THREE.Shape();
    roofShape.moveTo(-1.3, 0);
    roofShape.lineTo(0, 0.5);
    roofShape.lineTo(1.3, 0);
    roofShape.closePath();

    const extrudeSettings = {
      depth: 2.1,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.03,
    };
    const roofGeo = new THREE.ExtrudeGeometry(roofShape, extrudeSettings);
    roofGeo.center();
    const roofCap = new THREE.Mesh(roofGeo, woodDarkMat);
    roofCap.position.set(0, 1.3, 0);
    roofCap.rotation.y = Math.PI / 2;
    roofCap.castShadow = true;
    hiveGroup.add(roofCap);

    // Golden Crest / Badge on Roof Front
    const crestGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.04, 6);
    const crestMesh = new THREE.Mesh(crestGeo, goldAccentMat);
    crestMesh.rotation.x = Math.PI / 2;
    crestMesh.position.set(0, 1.15, 1.05);
    hiveGroup.add(crestMesh);

    // Ground Soft Shadow Disk
    const shadowGeo = new THREE.PlaneGeometry(4.5, 4.5);
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext("2d");
    const sGrad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    sGrad.addColorStop(0, "rgba(0,0,0,0.75)");
    sGrad.addColorStop(0.5, "rgba(245,158,11,0.15)");
    sGrad.addColorStop(1, "rgba(0,0,0,0)");
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    const shadowDisk = new THREE.Mesh(shadowGeo, shadowMat);
    shadowDisk.rotation.x = -Math.PI / 2;
    shadowDisk.position.set(0, -2.2, 0);
    scene.add(shadowDisk);

    // 5. 3D BEES & FLIGHT PATHS
    const beeGroupList = [];
    const NUM_BEES = 9;

    // Create 3D Bee Geometry
    const createBeeMesh = () => {
      const bee = new THREE.Group();

      // Bee Abdomen (Striped Capsule)
      const bodyGeo = new THREE.SphereGeometry(0.12, 12, 12);
      bodyGeo.scale(0.9, 0.9, 1.4);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.4,
        metalness: 0.2,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.castShadow = true;
      bee.add(body);

      // Stripes (Dark Rings)
      const stripeGeo = new THREE.TorusGeometry(0.11, 0.02, 8, 16);
      const stripeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
      const stripe1 = new THREE.Mesh(stripeGeo, stripeMat);
      stripe1.position.z = -0.04;
      bee.add(stripe1);
      const stripe2 = new THREE.Mesh(stripeGeo, stripeMat);
      stripe2.position.z = 0.04;
      bee.add(stripe2);

      // Bee Head
      const headGeo = new THREE.SphereGeometry(0.08, 10, 10);
      const headMat = new THREE.MeshBasicMaterial({ color: 0x1a120b });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.z = 0.16;
      bee.add(head);

      // Translucent Wings
      const wingGeo = new THREE.PlaneGeometry(0.18, 0.09);
      const wingMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide,
      });

      const wingL = new THREE.Mesh(wingGeo, wingMat);
      wingL.position.set(-0.1, 0.06, 0);
      wingL.rotation.set(0.2, 0.3, 0.4);
      bee.add(wingL);

      const wingR = new THREE.Mesh(wingGeo, wingMat);
      wingR.position.set(0.1, 0.06, 0);
      wingR.rotation.set(0.2, -0.3, -0.4);
      bee.add(wingR);

      // Bee Glow Point Light
      const beeLight = new THREE.PointLight(0xf59e0b, 0.5, 0.8);
      beeLight.position.set(0, 0, 0);
      bee.add(beeLight);

      return { mesh: bee, wingL, wingR };
    };

    for (let i = 0; i < NUM_BEES; i++) {
      const beeData = createBeeMesh();
      const radius = 1.8 + Math.random() * 1.5;
      const speed = 0.6 + Math.random() * 0.8;
      const phase = Math.random() * Math.PI * 2;
      const yOffset = (Math.random() - 0.5) * 2.0;

      scene.add(beeData.mesh);
      beeGroupList.push({
        ...beeData,
        radius,
        speed,
        phase,
        yOffset,
        baseY: yOffset,
      });
    }

    // 6. VOLUMETRIC POLLEN PARTICLES
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }

    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMat = new THREE.PointsMaterial({
      color: 0xfcd34d,
      size: 0.08,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const pollenParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(pollenParticles);

    // 7. MOUSE PARALLAX & ANIMATION LOOP
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 2;
      mouseY = y * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Hive Idle Float & Mouse Tilt
      const floatY = Math.sin(elapsedTime * 1.5) * 0.08;
      hiveGroup.position.y = floatY;

      targetRotY = mouseX * 0.35;
      targetRotX = mouseY * 0.2;

      hiveGroup.rotation.y += (targetRotY - hiveGroup.rotation.y) * 0.05;
      hiveGroup.rotation.x += (targetRotX - hiveGroup.rotation.x) * 0.05;

      // Internal Glow Breathing Effect
      internalGlow.intensity = 3.5 + Math.sin(elapsedTime * 3) * 1.0;

      // Bees Flight Path Animation
      beeGroupList.forEach((bee, idx) => {
        const t = elapsedTime * bee.speed + bee.phase;

        // Smooth Lissajous / Curved 3D Path
        const x = Math.sin(t * 1.2) * bee.radius + Math.cos(t * 0.5) * 0.4;
        const z = Math.cos(t * 0.9) * bee.radius + Math.sin(t * 0.7) * 0.4;
        const y = bee.baseY + Math.sin(t * 2.2) * 0.4;

        // Tangent direction for smooth rotation facing
        const nextT = t + 0.05;
        const nextX = Math.sin(nextT * 1.2) * bee.radius + Math.cos(nextT * 0.5) * 0.4;
        const nextZ = Math.cos(nextT * 0.9) * bee.radius + Math.sin(nextT * 0.7) * 0.4;
        const nextY = bee.baseY + Math.sin(nextT * 2.2) * 0.4;

        bee.mesh.position.set(x, y, z);
        bee.mesh.lookAt(nextX, nextY, nextZ);

        // Wing Flutter
        const wingFlutter = Math.sin(elapsedTime * 45 + idx) * 0.6;
        bee.wingL.rotation.z = 0.4 + wingFlutter;
        bee.wingR.rotation.z = -0.4 - wingFlutter;
      });

      // Pollen Dust Slow Drift
      const positions = pollenParticles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(elapsedTime + i) * 0.002;
        if (positions[i * 3 + 1] > 3) positions[i * 3 + 1] = -3;
      }
      pollenParticles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 8. RESIZE HANDLER
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (!webglSupported) {
    return (
      <div className="smart-hive-fallback" style={{ width: "100%", height: "100%", minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle, rgba(245,158,11,0.2) 0%, rgba(7,10,17,0.9) 70%)", borderRadius: 28, border: "1px solid rgba(245,158,11,0.3)", position: "relative", overflow: "hidden" }}>
        <div style={{ textAlign: "center", padding: 20 }}>
          <div style={{ fontSize: 72, marginBottom: 12 }}>🐝</div>
          <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>3D Smart Hive #HV-2024</h3>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Real-time IoT Micro-Climate Node Active</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 460,
        position: "relative",
        cursor: "grab",
      }}
    />
  );
};

export default SmartHive3D;

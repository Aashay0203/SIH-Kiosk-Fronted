import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Sparkles, ShieldCheck, HeartPulse } from "lucide-react";
import "./MedicalCoreOrb3D.css";

export default function MedicalCoreOrb3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.offsetWidth / container.offsetHeight,
      0.1,
      1000
    );
    camera.position.z = 32;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Inner Glowing Core Sphere
    const coreGeo = new THREE.IcosahedronGeometry(7, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Outer Orbiting Rings
    const ring1Geo = new THREE.TorusGeometry(10, 0.2, 16, 60);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.7,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat);
    scene.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(12, 0.15, 16, 60);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    scene.add(ring2);

    // Particle Swarm
    const particleCount = 100;
    const partGeo = new THREE.BufferGeometry();
    const partPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 14 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      partPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      partPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      partPositions[i * 3 + 2] = radius * Math.cos(phi);
    }

    partGeo.setAttribute("position", new THREE.BufferAttribute(partPositions, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.8,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(partGeo, partMat);
    scene.add(particleSystem);

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Pulsating heartbeat scale
      const pulse = 1 + Math.sin(elapsed * 3) * 0.08;
      coreMesh.scale.set(pulse, pulse, pulse);

      coreMesh.rotation.y = elapsed * 0.4;
      coreMesh.rotation.x = elapsed * 0.2;

      ring1.rotation.x = elapsed * 0.5;
      ring1.rotation.y = elapsed * 0.3;

      ring2.rotation.y = -elapsed * 0.4;
      ring2.rotation.z = elapsed * 0.2;

      particleSystem.rotation.y = elapsed * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.offsetWidth / container.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="medical-core-orb-wrap">
      <div className="core-orb-canvas-box" ref={mountRef} />
      <div className="core-orb-badge">
        <HeartPulse size={14} className="text-emerald-400" />
        <span>74 BPM • Realtime AI Core</span>
      </div>
    </div>
  );
}

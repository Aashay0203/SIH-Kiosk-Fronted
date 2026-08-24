import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Activity, Heart, Droplets, Wind, ShieldCheck } from "lucide-react";
import { playTap } from "../utils/audioFX";
import "./Biometrics3DCore.css";

export default function Biometrics3DCore({ vitals }) {
  const mountRef = useRef(null);

  const defaultVitals = {
    bpm: "74",
    bp: "120/80",
    spo2: "98%",
    glucose: "94",
    bmi: "22.4",
  };

  const data = { ...defaultVitals, ...vitals };

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
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3D Hexagonal Core
    const hexGeo = new THREE.DodecahedronGeometry(6, 1);
    const hexMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const hexMesh = new THREE.Mesh(hexGeo, hexMat);
    scene.add(hexMesh);

    // Outer Orbiting Nodes
    const orbitGroup = new THREE.Group();
    const nodeCount = 5;
    const nodeGeo = new THREE.SphereGeometry(0.8, 12, 12);
    const nodeColors = [0xf43f5e, 0x10b981, 0x38bdf8, 0xfbbf24, 0xa855f7];

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const nodeMat = new THREE.MeshBasicMaterial({ color: nodeColors[i] });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(Math.cos(angle) * 9, Math.sin(angle) * 9, 0);
      orbitGroup.add(node);
    }
    scene.add(orbitGroup);

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      hexMesh.rotation.y = elapsed * 0.5;
      hexMesh.rotation.x = elapsed * 0.3;

      orbitGroup.rotation.z = -elapsed * 0.4;
      orbitGroup.rotation.x = Math.sin(elapsed * 0.5) * 0.3;

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
    <div className="biometrics-3d-root">
      <div className="biometrics-core-canvas" ref={mountRef} />

      {/* Interactive 3D Vitals Grid */}
      <div className="biometrics-telemetry-grid">
        <div className="biometric-tile" onClick={playTap}>
          <Heart size={16} className="text-rose-400" />
          <span className="bio-title">Heart Rate</span>
          <span className="bio-val">{data.bpm} <small>BPM</small></span>
        </div>

        <div className="biometric-tile" onClick={playTap}>
          <Activity size={16} className="text-sky-400" />
          <span className="bio-title">Blood Pressure</span>
          <span className="bio-val">{data.bp} <small>mmHg</small></span>
        </div>

        <div className="biometric-tile" onClick={playTap}>
          <Wind size={16} className="text-emerald-400" />
          <span className="bio-title">Oxygen SpO2</span>
          <span className="bio-val">{data.spo2}</span>
        </div>

        <div className="biometric-tile" onClick={playTap}>
          <Droplets size={16} className="text-amber-400" />
          <span className="bio-title">Blood Glucose</span>
          <span className="bio-val">{data.glucose} <small>mg/dL</small></span>
        </div>
      </div>
    </div>
  );
}

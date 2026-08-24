import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Dna, Sparkles } from "lucide-react";
import "./DnaHelix3D.css";

export default function DnaHelix3D() {
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
    camera.position.z = 28;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const dnaGroup = new THREE.Group();

    // Construct DNA Double Helix
    const numPairs = 24;
    const strandRadius = 4.5;
    const height = 24;

    const sphereGeo = new THREE.SphereGeometry(0.5, 12, 12);
    const strand1Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const strand2Mat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const bondMat = new THREE.LineBasicMaterial({
      color: 0x64748b,
      transparent: true,
      opacity: 0.5,
    });

    for (let i = 0; i < numPairs; i++) {
      const angle = (i / numPairs) * Math.PI * 4;
      const y = (i / numPairs) * height - height / 2;

      const x1 = Math.cos(angle) * strandRadius;
      const z1 = Math.sin(angle) * strandRadius;

      const x2 = Math.cos(angle + Math.PI) * strandRadius;
      const z2 = Math.sin(angle + Math.PI) * strandRadius;

      // Base pair nodes
      const node1 = new THREE.Mesh(sphereGeo, strand1Mat);
      node1.position.set(x1, y, z1);
      dnaGroup.add(node1);

      const node2 = new THREE.Mesh(sphereGeo, strand2Mat);
      node2.position.set(x2, y, z2);
      dnaGroup.add(node2);

      // Connecting Bond Line
      const bondGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x1, y, z1),
        new THREE.Vector3(x2, y, z2),
      ]);
      const bond = new THREE.Line(bondGeo, bondMat);
      dnaGroup.add(bond);
    }

    scene.add(dnaGroup);

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      dnaGroup.rotation.y = elapsed * 0.8;
      dnaGroup.rotation.x = Math.sin(elapsed * 0.4) * 0.2;

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
    <div className="dna-helix-3d-wrap">
      <div className="dna-canvas-box" ref={mountRef} />
      <div className="dna-label">
        <Sparkles size={12} className="text-sky-400" />
        <span>3D Genomics & Pathology Telemetry</span>
      </div>
    </div>
  );
}

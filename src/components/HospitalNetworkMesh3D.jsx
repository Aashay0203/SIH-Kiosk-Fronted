import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Building2, Activity, Sparkles, Users } from "lucide-react";
import "./HospitalNetworkMesh3D.css";

export default function HospitalNetworkMesh3D() {
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
    camera.position.set(20, 24, 36);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const cityGroup = new THREE.Group();

    // Ground Grid
    const gridHelper = new THREE.GridHelper(36, 18, 0x38bdf8, 0x1e293b);
    cityGroup.add(gridHelper);

    // 3D Hospital Nodes (Wireframe buildings)
    const buildingGeo = new THREE.BoxGeometry(4, 10, 4);
    const buildingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });

    const positions = [
      [-6, 5, -6],
      [6, 7, -6],
      [0, 9, 4],
      [-8, 4, 6],
      [8, 6, 6],
    ];

    positions.forEach((pos) => {
      const building = new THREE.Mesh(buildingGeo, buildingMat);
      building.position.set(...pos);
      cityGroup.add(building);

      // Beacon on top
      const beaconGeo = new THREE.SphereGeometry(0.8, 12, 12);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(pos[0], pos[1] + 5.5, pos[2]);
      cityGroup.add(beacon);
    });

    scene.add(cityGroup);

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      cityGroup.rotation.y = elapsed * 0.15;

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
    <div className="hospital-network-3d-wrap">
      <div className="network-mesh-canvas" ref={mountRef} />
      <div className="network-mesh-badge">
        <Sparkles size={12} className="text-sky-400" />
        <span>3D DelhiMed Hospital Mesh Network</span>
      </div>
    </div>
  );
}

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Bot, Sparkles, MessageSquare } from "lucide-react";
import { playSuccess, playTap } from "../utils/audioFX";
import "./AiMedicAvatar3D.css";

export default function AiMedicAvatar3D() {
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
    camera.position.z = 26;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const botGroup = new THREE.Group();

    // Robot Head
    const headGeo = new THREE.BoxGeometry(7, 5.5, 6);
    const headMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    botGroup.add(headMesh);

    // Glowing Visor Eyes
    const eyeGeo = new THREE.BoxGeometry(4.8, 1.4, 6.2);
    const eyeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });
    const eyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
    eyeMesh.position.y = 0.5;
    botGroup.add(eyeMesh);

    // Antenna
    const antStemGeo = new THREE.CylinderGeometry(0.2, 0.2, 3);
    const antStemMat = new THREE.MeshBasicMaterial({ color: 0x64748b });
    const antStem = new THREE.Mesh(antStemGeo, antStemMat);
    antStem.position.y = 4;
    botGroup.add(antStem);

    const antSphereGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const antSphereMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const antSphere = new THREE.Mesh(antSphereGeo, antSphereMat);
    antSphere.position.y = 5.6;
    botGroup.add(antSphere);

    scene.add(botGroup);

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Floating bobbing motion
      botGroup.position.y = Math.sin(elapsed * 2) * 1.2;
      botGroup.rotation.y = Math.sin(elapsed * 0.8) * 0.4;
      botGroup.rotation.x = Math.sin(elapsed * 0.5) * 0.1;

      // Pulse antenna
      const pulse = 1 + Math.sin(elapsed * 6) * 0.2;
      antSphere.scale.set(pulse, pulse, pulse);

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

  const handleClick = () => {
    playSuccess();
  };

  return (
    <div className="medic-bot-3d-wrap" onClick={handleClick}>
      <div className="medic-bot-canvas" ref={mountRef} />
      <div className="medic-bot-bubble">
        <Bot size={14} className="text-sky-400" />
        <span>DelhiMed AI Medic • Online 24x7</span>
      </div>
    </div>
  );
}

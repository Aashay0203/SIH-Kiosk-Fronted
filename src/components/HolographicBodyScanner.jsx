import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { playTap, playHeartbeat } from "../utils/audioFX";
import {
  Activity,
  Heart,
  Brain,
  Wind,
  ShieldCheck,
  RotateCw,
  Sparkles,
} from "lucide-react";
import "./HolographicBodyScanner.css";

const ORGANS = [
  {
    id: "brain",
    name: "Cerebral / Neural Cortex",
    icon: Brain,
    pos: [0, 18, 0],
    color: "#a855f7",
    status: "Optimal",
    metrics: "EEG Alpha: 10.2 Hz • Reflex: 120ms",
    risk: "Low Risk",
  },
  {
    id: "heart",
    name: "Cardiovascular System",
    icon: Heart,
    pos: [1.2, 8, 2],
    color: "#f43f5e",
    status: "Normal Sinus Rhythm",
    metrics: "Heart Rate: 74 BPM • BP: 120/80 mmHg",
    risk: "Healthy",
  },
  {
    id: "lungs",
    name: "Pulmonary System",
    icon: Wind,
    pos: [-1.2, 8, 1.5],
    color: "#38bdf8",
    status: "Clear Bilateral Breath Sounds",
    metrics: "SpO2: 98% • Resp Rate: 16/min",
    risk: "Normal",
  },
  {
    id: "liver",
    name: "Hepatic & Metabolic",
    icon: Activity,
    pos: [2.5, 0, 1.5],
    color: "#fbbf24",
    status: "Normal Function",
    metrics: "SGOT: 24 U/L • SGPT: 28 U/L",
    risk: "Optimal",
  },
  {
    id: "kidneys",
    name: "Renal & Filtration",
    icon: ShieldCheck,
    pos: [-2.5, -2, -1],
    color: "#34d399",
    status: "Normal eGFR",
    metrics: "Serum Creatinine: 0.9 mg/dL • eGFR: >90",
    risk: "Healthy",
  },
];

export default function HolographicBodyScanner({ onSelectOrgan }) {
  const mountRef = useRef(null);
  const [selectedOrgan, setSelectedOrgan] = useState(ORGANS[1]); // Heart by default
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.offsetWidth / container.offsetHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 55);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Anatomical Hologram Wireframe Body Model
    const bodyGroup = new THREE.Group();

    // Head
    const headGeo = new THREE.SphereGeometry(4.5, 16, 16);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const headMesh = new THREE.Mesh(headGeo, wireMat);
    headMesh.position.y = 18;
    bodyGroup.add(headMesh);

    // Torso
    const torsoGeo = new THREE.CylinderGeometry(5.5, 4.2, 18, 16, 8, true);
    const torsoMesh = new THREE.Mesh(torsoGeo, wireMat);
    torsoMesh.position.y = 4;
    bodyGroup.add(torsoMesh);

    // Pelvis
    const pelvisGeo = new THREE.CylinderGeometry(4.2, 3.8, 6, 16, 4, true);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, wireMat);
    pelvisMesh.position.y = -8;
    bodyGroup.add(pelvisMesh);

    // Limbs
    const limbMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });

    // Left & Right Arms
    const armGeo = new THREE.CylinderGeometry(1.2, 0.9, 16, 8);
    const leftArm = new THREE.Mesh(armGeo, limbMat);
    leftArm.position.set(-8, 3, 0);
    leftArm.rotation.z = 0.2;
    bodyGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, limbMat);
    rightArm.position.set(8, 3, 0);
    rightArm.rotation.z = -0.2;
    bodyGroup.add(rightArm);

    // Left & Right Legs
    const legGeo = new THREE.CylinderGeometry(1.8, 1.1, 20, 8);
    const leftLeg = new THREE.Mesh(legGeo, limbMat);
    leftLeg.position.set(-3.2, -20, 0);
    bodyGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, limbMat);
    rightLeg.position.set(3.2, -20, 0);
    bodyGroup.add(rightLeg);

    // Pulsating Organ Nodes (Spheres)
    const organNodes = [];
    ORGANS.forEach((organ) => {
      const nodeGeo = new THREE.SphereGeometry(1.4, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(organ.color),
        transparent: true,
        opacity: 0.85,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(...organ.pos);
      nodeMesh.userData = organ;

      // Outer glowing ring
      const ringGeo = new THREE.RingGeometry(1.8, 2.2, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(organ.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      nodeMesh.add(ringMesh);

      bodyGroup.add(nodeMesh);
      organNodes.push({ mesh: nodeMesh, ring: ringMesh });
    });

    scene.add(bodyGroup);

    // Horizontal Scanning Laser Plane
    const scanGeo = new THREE.PlaneGeometry(36, 1);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    const scanPlane = new THREE.Mesh(scanGeo, scanMat);
    scanPlane.rotation.x = Math.PI / 2;
    scene.add(scanPlane);

    // Interactive Drag Controls
    let isDragging = false;
    let prevMouseX = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      bodyGroup.rotation.y += deltaX * 0.01;
      prevMouseX = e.clientX;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.offsetWidth / container.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (isRotating && !isDragging) {
        bodyGroup.rotation.y = Math.sin(elapsed * 0.5) * 0.45;
      }

      // Pulse organ nodes
      organNodes.forEach(({ ring }, idx) => {
        const scale = 1 + Math.sin(elapsed * 4 + idx) * 0.25;
        ring.scale.set(scale, scale, scale);
      });

      // Scanning plane traverse
      scanPlane.position.y = Math.sin(elapsed * 1.5) * 22;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isRotating]);

  const handleOrganClick = (organ) => {
    playHeartbeat();
    setSelectedOrgan(organ);
    onSelectOrgan?.(organ);
  };

  const SelectedIcon = selectedOrgan.icon;

  return (
    <div className="holo-scanner-wrapper">
      <div className="holo-scanner-header">
        <div className="holo-scanner-title-group">
          <Sparkles size={16} className="text-sky-400" />
          <span>3D Holographic Anatomy & Pathology Scanner</span>
        </div>
        <button
          className="holo-rot-toggle"
          onClick={() => {
            playTap();
            setIsRotating(!isRotating);
          }}
        >
          <RotateCw size={13} />
          <span>{isRotating ? "Pause Rotation" : "Auto-Rotate"}</span>
        </button>
      </div>

      <div className="holo-scanner-grid">
        {/* 3D WebGL Canvas Viewport */}
        <div className="holo-3d-viewport" ref={mountRef}>
          <div className="holo-hud-crosshairs">
            <span className="crosshair-tl"></span>
            <span className="crosshair-tr"></span>
            <span className="crosshair-bl"></span>
            <span className="crosshair-br"></span>
          </div>
          <div className="holo-viewport-label">Live Bio-Scan 2030 • 60 FPS WebGL</div>
        </div>

        {/* Organ Selector & Live Telemetry Inspector */}
        <div className="holo-telemetry-side">
          <p className="holo-side-heading">Systemic Organ Diagnostics</p>
          <div className="holo-organ-chips">
            {ORGANS.map((organ) => {
              const Icon = organ.icon;
              const isSelected = selectedOrgan.id === organ.id;
              return (
                <button
                  key={organ.id}
                  className={`holo-organ-btn ${isSelected ? "selected" : ""}`}
                  style={{
                    borderColor: isSelected ? organ.color : "var(--border)",
                  }}
                  onClick={() => handleOrganClick(organ)}
                >
                  <div
                    className="organ-btn-dot"
                    style={{ backgroundColor: organ.color }}
                  />
                  <Icon size={14} />
                  <span>{organ.name.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Organ Metric Card */}
          <div className="holo-organ-detail-card">
            <div className="detail-card-top">
              <div className="detail-card-icon-wrap" style={{ color: selectedOrgan.color }}>
                <SelectedIcon size={24} />
              </div>
              <div className="detail-card-meta">
                <h4 className="detail-card-name">{selectedOrgan.name}</h4>
                <span className="detail-card-status" style={{ color: selectedOrgan.color }}>
                  ● {selectedOrgan.status}
                </span>
              </div>
            </div>

            <div className="detail-card-metric-box">
              <span className="metric-box-label">Realtime Telemetry</span>
              <p className="metric-box-val">{selectedOrgan.metrics}</p>
            </div>

            <div className="detail-card-footer">
              <span className="risk-badge" style={{ backgroundColor: `${selectedOrgan.color}22`, color: selectedOrgan.color }}>
                {selectedOrgan.risk}
              </span>
              <span className="ai-verified-tag">✓ DelhiMed AI Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

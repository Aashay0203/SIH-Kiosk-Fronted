import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { playTap, playLubDub, playSuccess } from "../utils/audioFX";
import {
  Activity,
  Heart,
  Brain,
  Wind,
  ShieldCheck,
  RotateCw,
  Sparkles,
  Layers,
  Zap,
  ZoomIn,
  ZoomOut,
  Radio,
} from "lucide-react";
import "./HolographicBodyScanner.css";

const VIEW_MODES = [
  { id: "hologram", label: "Quantum Hologram", icon: Sparkles, color: "#38bdf8" },
  { id: "neural", label: "Neural EEG Mesh", icon: Zap, color: "#a855f7" },
  { id: "xray", label: "X-Ray Skeletal", icon: Layers, color: "#94a3b8" },
  { id: "vascular", label: "Vascular Blood Flow", icon: Heart, color: "#f43f5e" },
];

const ORGANS = [
  {
    id: "brain",
    name: "Cerebral Cortex & Neural Pathways",
    icon: Brain,
    pos: [0, 18, 0],
    color: "#a855f7",
    status: "Optimal Neural Synapses",
    metrics: "EEG Alpha: 10.2 Hz • Reflex Latency: 118ms",
    risk: "Low Risk",
    aiNote: "Brainwave frequencies are balanced. No signs of neurological fatigue.",
  },
  {
    id: "heart",
    name: "Cardiovascular System (S1/S2 Valve)",
    icon: Heart,
    pos: [1.2, 8, 2],
    color: "#f43f5e",
    status: "Normal Sinus Rhythm (74 BPM)",
    metrics: "BP: 120/80 mmHg • Ejection Fraction: 62%",
    risk: "Healthy",
    aiNote: "Cardiac output is strong. Mitral & aortic valve timings are optimal.",
  },
  {
    id: "lungs",
    name: "Pulmonary & Respiratory Tree",
    icon: Wind,
    pos: [-1.2, 8, 1.5],
    color: "#38bdf8",
    status: "Clear Bilateral Breath Sounds",
    metrics: "SpO2: 98% • Tidal Volume: 500 mL",
    risk: "Normal",
    aiNote: "Oxygen exchange capacity is exceptional. Bronchial pathways clear.",
  },
  {
    id: "liver",
    name: "Hepatic & Metabolic Filter",
    icon: Activity,
    pos: [2.5, 0, 1.5],
    color: "#fbbf24",
    status: "Active Filtration",
    metrics: "SGOT: 24 U/L • SGPT: 28 U/L",
    risk: "Optimal",
    aiNote: "Enzyme biomarkers within target threshold. Metabolic rate standard.",
  },
  {
    id: "kidneys",
    name: "Renal & Glomerular Filtration",
    icon: ShieldCheck,
    pos: [-2.5, -2, -1],
    color: "#34d399",
    status: "Normal eGFR Filtration",
    metrics: "Creatinine: 0.9 mg/dL • eGFR: >90 mL/min",
    risk: "Healthy",
    aiNote: "Fluid electrolyte balance stable. Glomerular rate optimal.",
  },
];

export default function HolographicBodyScanner({ onSelectOrgan }) {
  const mountRef = useRef(null);
  const [selectedOrgan, setSelectedOrgan] = useState(ORGANS[1]); // Heart by default
  const [viewMode, setViewMode] = useState("hologram");
  const [isRotating, setIsRotating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(55);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const bodyGroupRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.offsetWidth / container.offsetHeight,
      0.1,
      1000
    );
    camera.position.set(0, 4, zoomLevel);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Anatomical Hologram Wireframe Body Model
    const bodyGroup = new THREE.Group();
    bodyGroupRef.current = bodyGroup;

    // Multi-Layer Materials Based on View Mode
    const getWireColor = () => {
      if (viewMode === "neural") return 0xa855f7;
      if (viewMode === "xray") return 0xe2e8f0;
      if (viewMode === "vascular") return 0xf43f5e;
      return 0x00f0ff; // Quantum Cyan
    };

    const wireMat = new THREE.MeshBasicMaterial({
      color: getWireColor(),
      wireframe: true,
      transparent: true,
      opacity: viewMode === "xray" ? 0.6 : 0.35,
    });

    // Head
    const headGeo = new THREE.SphereGeometry(4.5, 18, 18);
    const headMesh = new THREE.Mesh(headGeo, wireMat);
    headMesh.position.y = 18;
    bodyGroup.add(headMesh);

    // Torso Ribcage
    const torsoGeo = new THREE.CylinderGeometry(5.5, 4.2, 18, 16, 8, true);
    const torsoMesh = new THREE.Mesh(torsoGeo, wireMat);
    torsoMesh.position.y = 4;
    bodyGroup.add(torsoMesh);

    // Spine Column
    const spineGeo = new THREE.CylinderGeometry(0.8, 0.8, 22, 8);
    const spineMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
    });
    const spineMesh = new THREE.Mesh(spineGeo, spineMat);
    spineMesh.position.set(0, 4, -1);
    bodyGroup.add(spineMesh);

    // Pelvis
    const pelvisGeo = new THREE.CylinderGeometry(4.2, 3.8, 6, 16, 4, true);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, wireMat);
    pelvisMesh.position.y = -8;
    bodyGroup.add(pelvisMesh);

    // Limbs
    const limbMat = new THREE.MeshBasicMaterial({
      color: getWireColor(),
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });

    const armGeo = new THREE.CylinderGeometry(1.2, 0.9, 16, 8);
    const leftArm = new THREE.Mesh(armGeo, limbMat);
    leftArm.position.set(-8, 3, 0);
    leftArm.rotation.z = 0.2;
    bodyGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, limbMat);
    rightArm.position.set(8, 3, 0);
    rightArm.rotation.z = -0.2;
    bodyGroup.add(rightArm);

    const legGeo = new THREE.CylinderGeometry(1.8, 1.1, 20, 8);
    const leftLeg = new THREE.Mesh(legGeo, limbMat);
    leftLeg.position.set(-3.2, -20, 0);
    bodyGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, limbMat);
    rightLeg.position.set(3.2, -20, 0);
    bodyGroup.add(rightLeg);

    // Vascular & Neural Particle Circulation System
    const particleCount = viewMode === "vascular" ? 180 : 80;
    const partGeo = new THREE.BufferGeometry();
    const partPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      partPositions[i * 3] = (Math.random() - 0.5) * 6;
      partPositions[i * 3 + 1] = (Math.random() - 0.5) * 36;
      partPositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }

    partGeo.setAttribute("position", new THREE.BufferAttribute(partPositions, 3));
    const partMat = new THREE.PointsMaterial({
      color: viewMode === "vascular" ? 0xf43f5e : 0x00f0ff,
      size: 1.2,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const circulationSystem = new THREE.Points(partGeo, partMat);
    particlesRef.current = circulationSystem;
    bodyGroup.add(circulationSystem);

    // Pulsating Organ Nodes (Spheres & Halo Rings)
    const organNodes = [];
    ORGANS.forEach((organ) => {
      const nodeGeo = new THREE.SphereGeometry(1.5, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(organ.color),
        transparent: true,
        opacity: 0.9,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(...organ.pos);

      // Glowing Halo Ring
      const ringGeo = new THREE.RingGeometry(2.0, 2.5, 20);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(organ.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      nodeMesh.add(ringMesh);

      bodyGroup.add(nodeMesh);
      organNodes.push({ mesh: nodeMesh, ring: ringMesh });
    });

    scene.add(bodyGroup);

    // Quantum Laser Scanning Grid Plane
    const scanGeo = new THREE.PlaneGeometry(36, 1.2);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    const scanPlane = new THREE.Mesh(scanGeo, scanMat);
    scanPlane.rotation.x = Math.PI / 2;
    scene.add(scanPlane);

    // 360° Mouse & Touch Orbital Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      bodyGroup.rotation.y += deltaX * 0.01;
      bodyGroup.rotation.x += deltaY * 0.005;

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Scroll Zoom
    const onWheel = (e) => {
      e.preventDefault();
      setZoomLevel((prev) => {
        const next = Math.max(30, Math.min(80, prev + e.deltaY * 0.05));
        if (cameraRef.current) cameraRef.current.position.z = next;
        return next;
      });
    };

    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("wheel", onWheel, { passive: false });
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

    // 60 FPS Quantum Render Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (isRotating && !isDragging) {
        bodyGroup.rotation.y = Math.sin(elapsed * 0.4) * 0.5;
      }

      // Vascular particle circulation speed
      if (circulationSystem) {
        const positions = circulationSystem.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] -= 0.12; // Blood flow downward
          if (positions[i] < -20) positions[i] = 18;
        }
        circulationSystem.geometry.attributes.position.needsUpdate = true;
      }

      // Pulse organ nodes
      organNodes.forEach(({ ring }, idx) => {
        const scale = 1 + Math.sin(elapsed * 4 + idx) * 0.28;
        ring.scale.set(scale, scale, scale);
      });

      // Scanning plane traverse
      scanPlane.position.y = Math.sin(elapsed * 1.6) * 22;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("wheel", onWheel);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [viewMode, isRotating]);

  const handleOrganClick = (organ) => {
    if (organ.id === "heart") {
      playLubDub();
    } else {
      playTap();
    }
    setSelectedOrgan(organ);
    onSelectOrgan?.(organ);
  };

  const handleZoom = (delta) => {
    playTap();
    setZoomLevel((prev) => {
      const next = Math.max(30, Math.min(80, prev + delta));
      if (cameraRef.current) cameraRef.current.position.z = next;
      return next;
    });
  };

  const SelectedIcon = selectedOrgan.icon;

  return (
    <div className="quantum-scanner-root">
      {/* Top HUD Header */}
      <div className="quantum-scanner-header">
        <div className="quantum-title-group">
          <div className="quantum-live-pulse" />
          <span className="quantum-title-text">2100 Quantum Multi-Layer Anatomy Scanner</span>
        </div>

        {/* 4 View Modes */}
        <div className="quantum-view-modes">
          {VIEW_MODES.map((m) => {
            const Icon = m.icon;
            const isActive = viewMode === m.id;
            return (
              <button
                key={m.id}
                className={`quantum-mode-btn ${isActive ? "active" : ""}`}
                style={{
                  borderColor: isActive ? m.color : "var(--border)",
                  color: isActive ? m.color : "var(--text-muted)",
                }}
                onClick={() => {
                  playTap();
                  setViewMode(m.id);
                }}
              >
                <Icon size={13} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="quantum-scanner-grid">
        {/* 3D WebGL Viewport */}
        <div className="quantum-viewport-box" ref={mountRef}>
          {/* Cyber Crosshairs */}
          <div className="quantum-crosshairs">
            <span className="q-tl" />
            <span className="q-tr" />
            <span className="q-bl" />
            <span className="q-br" />
          </div>

          {/* Floating Telemetry HUD */}
          <div className="quantum-hud-overlay">
            <span className="hud-metric">LATENCY: 0.2ms</span>
            <span className="hud-metric">FPS: 60 WebGL</span>
            <span className="hud-metric">S1/S2 STETHOSCOPE ACTIVE</span>
          </div>

          {/* Quick Camera Action Controls */}
          <div className="quantum-cam-controls">
            <button
              className="cam-ctrl-btn"
              onClick={() => handleZoom(-10)}
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              className="cam-ctrl-btn"
              onClick={() => handleZoom(10)}
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              className={`cam-ctrl-btn ${isRotating ? "rotating" : ""}`}
              onClick={() => {
                playTap();
                setIsRotating(!isRotating);
              }}
              title="Toggle Auto-Orbit"
            >
              <RotateCw size={14} />
            </button>
          </div>
        </div>

        {/* Interactive Organ Pathology Telemetry */}
        <div className="quantum-telemetry-panel">
          <p className="quantum-panel-title">Systemic Organ Matrix</p>
          <div className="quantum-organ-chips">
            {ORGANS.map((organ) => {
              const Icon = organ.icon;
              const isSelected = selectedOrgan.id === organ.id;
              return (
                <button
                  key={organ.id}
                  className={`quantum-organ-chip ${isSelected ? "selected" : ""}`}
                  style={{
                    borderColor: isSelected ? organ.color : "var(--border)",
                    boxShadow: isSelected ? `0 0 16px ${organ.color}33` : "none",
                  }}
                  onClick={() => handleOrganClick(organ)}
                >
                  <div
                    className="organ-dot"
                    style={{ backgroundColor: organ.color }}
                  />
                  <Icon size={14} />
                  <span>{organ.name.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Organ Deep Inspection HUD Card */}
          <div className="quantum-detail-hud">
            <div className="hud-card-top">
              <div
                className="hud-icon-wrap"
                style={{ color: selectedOrgan.color, borderColor: selectedOrgan.color }}
              >
                <SelectedIcon size={26} />
              </div>
              <div>
                <h4 className="hud-organ-name">{selectedOrgan.name}</h4>
                <span className="hud-organ-status" style={{ color: selectedOrgan.color }}>
                  ● {selectedOrgan.status}
                </span>
              </div>
            </div>

            <div className="hud-metric-row">
              <span className="hud-label">Live Diagnostic Telemetry</span>
              <p className="hud-val">{selectedOrgan.metrics}</p>
            </div>

            <div className="hud-ai-insight">
              <span className="hud-ai-label">🤖 DelhiMed 2100 AI Pathology Assessment</span>
              <p className="hud-ai-text">{selectedOrgan.aiNote}</p>
            </div>

            <div className="hud-footer">
              <span
                className="hud-risk-badge"
                style={{
                  backgroundColor: `${selectedOrgan.color}22`,
                  color: selectedOrgan.color,
                  borderColor: selectedOrgan.color,
                }}
              >
                {selectedOrgan.risk}
              </span>
              <button
                className="hud-listen-btn"
                onClick={() => {
                  playLubDub();
                  playSuccess();
                }}
              >
                <Radio size={13} />
                <span>Listen Stethoscope</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

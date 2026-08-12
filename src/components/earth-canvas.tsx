"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls, Sphere, Line } from "@react-three/drei";
import { useMemo, useRef, Suspense } from "react";
import * as THREE from "three";

/**
 * Eco Africa Awards — 3D Earth / Africa Hero
 * - A glowing globe with stylised continents
 * - Africa highlighted in emerald, with amber pulses marking climate action cities
 * - Orbiting ring of satellites representing the awards network
 */

// Stylised continent as a flat shape projected onto sphere via lat/long points
function buildContinentGeometry(
  points: [number, number][], // [lat, lon] pairs
  radius: number,
  heightOffset: number = 0.015
) {
  const shape = new THREE.Shape();
  const vec3Points: THREE.Vector3[] = [];

  points.forEach((p, i) => {
    const phi = (90 - p[0]) * (Math.PI / 180);
    const theta = (p[1] + 180) * (Math.PI / 180);
    const x = -(radius + heightOffset) * Math.sin(phi) * Math.cos(theta);
    const y = (radius + heightOffset) * Math.cos(phi);
    const z = (radius + heightOffset) * Math.sin(phi) * Math.sin(theta);
    vec3Points.push(new THREE.Vector3(x, y, z));
  });

  // Build a CatmullRom curve for smooth continent outline
  const curve = new THREE.CatmullRomCurve3(vec3Points, true);
  const smoothPoints = curve.getPoints(120);

  const geometry = new THREE.BufferGeometry().setFromPoints(smoothPoints);
  return geometry;
}

// Approximate continent outlines (lat, lon) — stylised, not cartographic
const AFRICA_OUTLINE: [number, number][] = [
  [37, 10], [35, 11], [32, 20], [31, 25], [31, 32], [27, 34], [22, 37], [16, 40],
  [11, 43], [8, 50], [-2, 42], [-12, 40], [-25, 36], [-34, 26], [-34, 20], [-30, 17],
  [-22, 14], [-15, 12], [-6, 12], [4, 9], [8, 4], [5, -3], [7, -8], [12, -16],
  [21, -17], [28, -12], [33, -8], [36, -3], [37, 5],
];

const EURASIA_OUTLINE: [number, number][] = [
  [70, -10], [72, 30], [75, 70], [70, 110], [65, 140], [55, 140], [45, 130],
  [40, 120], [35, 110], [30, 100], [22, 90], [15, 80], [10, 78], [8, 70], [12, 60],
  [15, 50], [25, 45], [35, 35], [42, 28], [48, 15], [55, 5], [62, -5], [68, -8],
];

const AMERICAS_OUTLINE: [number, number][] = [
  [70, -80], [75, -100], [70, -130], [60, -140], [50, -125], [40, -120], [30, -115],
  [22, -100], [15, -90], [8, -80], [0, -75], [-8, -78], [-15, -72], [-25, -70],
  [-35, -65], [-45, -72], [-55, -68], [-50, -75], [-30, -90], [-15, -100],
  [0, -120], [15, -135], [30, -120], [50, -100], [60, -90],
];

const AUSTRALIA_OUTLINE: [number, number][] = [
  [-12, 130], [-10, 142], [-20, 150], [-30, 153], [-38, 145], [-35, 135],
  [-32, 120], [-22, 113], [-15, 122],
];

// Climate action pulse points (lat, lon, label)
const PULSE_POINTS: { lat: number; lon: number; label: string; color: string }[] = [
  { lat: -1, lon: 36, label: "Nairobi", color: "#10b981" },
  { lat: 30, lon: 31, label: "Cairo", color: "#f59e0b" },
  { lat: 6, lon: 3, label: "Lagos", color: "#10b981" },
  { lat: -26, lon: 28, label: "Johannesburg", color: "#f59e0b" },
  { lat: -1, lon: 30, label: "Kigali", color: "#10b981" },
  { lat: 9, lon: 38, label: "Addis Ababa", color: "#f59e0b" },
  { lat: 33, lon: -7, label: "Casablanca", color: "#10b981" },
  { lat: -34, lon: 18, label: "Cape Town", color: "#f59e0b" },
  { lat: 5, lon: -1, label: "Accra", color: "#10b981" },
  { lat: 14, lon: -17, label: "Dakar", color: "#f59e0b" },
  { lat: -6, lon: 35, label: "Dar es Salaam", color: "#10b981" },
  { lat: -15, lon: 35, label: "Lilongwe", color: "#f59e0b" },
];

function latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

function Globe({ radius = 2 }: { radius?: number }) {
  const africaRef = useRef<THREE.Line>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  const africaGeo = useMemo(() => buildContinentGeometry(AFRICA_OUTLINE, radius, 0.025), [radius]);
  const eurasiaGeo = useMemo(() => buildContinentGeometry(EURASIA_OUTLINE, radius, 0.01), [radius]);
  const americasGeo = useMemo(() => buildContinentGeometry(AMERICAS_OUTLINE, radius, 0.01), [radius]);
  const australiaGeo = useMemo(() => buildContinentGeometry(AUSTRALIA_OUTLINE, radius, 0.01), [radius]);

  const africaPulsePoints = useMemo(
    () =>
      PULSE_POINTS.map((p) => ({
        ...p,
        position: latLonToVec3(p.lat, p.lon, radius + 0.02),
      })),
    [radius]
  );

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.06;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.03;
    }
    if (africaRef.current) {
      // gentle pulse opacity
      const t = state.clock.elapsedTime;
      const mat = africaRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.7 + Math.sin(t * 1.5) * 0.3;
    }
  });

  return (
    <group>
      {/* Earth sphere - deep midnight */}
      <Sphere ref={earthRef} args={[radius, 64, 64]}>
        <meshStandardMaterial
          color="#0a1f1a"
          emissive="#06140f"
          emissiveIntensity={0.6}
          roughness={0.85}
          metalness={0.15}
        />
      </Sphere>

      {/* Inner glow wireframe - subtle latitude/longitude grid */}
      <Sphere args={[radius + 0.005, 32, 32]}>
        <meshBasicMaterial color="#1a3a30" wireframe transparent opacity={0.18} />
      </Sphere>

      {/* Continents - glowing outlines */}
      {/* Africa — bright emerald */}
      <line ref={africaRef}>
        <primitive object={africaGeo} attach="geometry" />
        <lineBasicMaterial color="#10b981" linewidth={3} transparent opacity={1} />
      </line>

      <line>
        <primitive object={eurasiaGeo} attach="geometry" />
        <lineBasicMaterial color="#3d5a4f" linewidth={1} transparent opacity={0.6} />
      </line>

      <line>
        <primitive object={americasGeo} attach="geometry" />
        <lineBasicMaterial color="#3d5a4f" linewidth={1} transparent opacity={0.6} />
      </line>

      <line>
        <primitive object={australiaGeo} attach="geometry" />
        <lineBasicMaterial color="#3d5a4f" linewidth={1} transparent opacity={0.6} />
      </line>

      {/* Africa fill (semi-transparent glow) */}
      <mesh>
        <sphereGeometry args={[radius + 0.018, 64, 64, 0, Math.PI * 2, 0, Math.PI * 2]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.04} />
      </mesh>

      {/* Pulse points — climate action cities */}
      {africaPulsePoints.map((p, i) => (
        <ClimatePulse key={i} position={p.position} color={p.color} delay={i * 0.4} />
      ))}

      {/* Atmosphere */}
      <Sphere ref={atmosphereRef} args={[radius * 1.18, 48, 48]}>
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>

      {/* Outer halo */}
      <Sphere args={[radius * 1.35, 48, 48]}>
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={0.025}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>
    </group>
  );
}

function ClimatePulse({
  position,
  color,
  delay = 0,
}: {
  position: THREE.Vector3;
  color: string;
  delay?: number;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  const dotRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime + delay;
    if (ringRef.current) {
      const pulse = (t % 2) / 2;
      const scale = 1 + pulse * 3;
      ringRef.current.scale.set(scale, scale, scale);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.6 - pulse * 0.6);
    }
    if (dotRef.current) {
      const mat = dotRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.8 + Math.sin(t * 3) * 0.2;
    }
  });

  return (
    <group position={position}>
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={1} />
      </mesh>
      <mesh ref={ringRef}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function OrbitRing({ radius = 3.1, color = "#f59e0b" }: { radius?: number; color?: string }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);

  const ringRef = useRef<THREE.Line>(null);

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.08;
      ringRef.current.rotation.x = Math.PI / 2.4;
    }
  });

  return (
    <line ref={ringRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(points.flatMap((p) => [p.x, p.y, p.z])), 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={0.4} />
    </line>
  );
}

function OrbitingSatellite({
  radius = 3.1,
  speed = 0.4,
  offset = 0,
  color = "#10b981",
  size = 0.05,
}: {
  radius?: number;
  speed?: number;
  offset?: number;
  color?: string;
  size?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset;
    if (ref.current) {
      const x = Math.cos(t) * radius;
      const z = Math.sin(t) * radius;
      const y = Math.sin(t * 0.5) * 0.3;
      ref.current.position.set(x, y, z);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} color="#fbbf24" />
      <pointLight position={[-5, 2, -3]} intensity={0.8} color="#10b981" />

      <Globe radius={2} />

      <OrbitRing radius={3.0} color="#f59e0b" />
      <OrbitRing radius={3.4} color="#10b981" />
      <OrbitRing radius={2.6} color="#dc684d" />

      <OrbitingSatellite radius={3.0} speed={0.35} offset={0} color="#f59e0b" />
      <OrbitingSatellite radius={3.4} speed={0.28} offset={Math.PI * 0.7} color="#10b981" />
      <OrbitingSatellite radius={2.6} speed={0.42} offset={Math.PI * 1.3} color="#dc684d" />

      <Stars
        radius={50}
        depth={50}
        count={3000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        rotateSpeed={0.3}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.6}
      />
    </>
  );
}

export function EarthCanvas({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

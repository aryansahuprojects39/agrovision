import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// Shared cursor tracker
function usePointer() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
      pointer.current = {
        x: (clientX / window.innerWidth) * 2 - 1,
        y: -(clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
    };
  }, []);

  return pointer;
}

// Camera subtly follows cursor
function InteractiveCameraRig() {
  const { camera } = useThree();
  const pointer = usePointer();
  const target = useRef(new THREE.Vector3(0, 0, 5));

  useFrame(() => {
    target.current.set(pointer.current.x * 0.5, pointer.current.y * 0.3, 5);
    camera.position.lerp(target.current, 0.03);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Leaf shape geometry (flat elliptical shape with a curve)
function createLeafShape() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.15, 0.3, 0.3, 0.6, 0, 1);
  shape.bezierCurveTo(-0.3, 0.6, -0.15, 0.3, 0, 0);
  return shape;
}

// Petal shape for flowers
function createPetalShape() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.08, 0.15, 0.15, 0.35, 0, 0.5);
  shape.bezierCurveTo(-0.15, 0.35, -0.08, 0.15, 0, 0);
  return shape;
}

// Seasonal leaf that drifts toward cursor
function SeasonalLeaf({
  position,
  scale,
  color,
  pointer,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const ref = useRef<THREE.Group>(null);
  const leafShape = useMemo(() => createLeafShape(), []);
  const speed = useMemo(() => 0.4 + Math.random() * 0.6, []);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const followStrength = useMemo(() => 0.3 + Math.random() * 0.5, []);
  const basePos = useRef(new THREE.Vector3(...position));

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + phase;

    // Drift toward cursor
    const targetX = basePos.current.x + pointer.current.x * followStrength * 2;
    const targetY = basePos.current.y + pointer.current.y * followStrength * 1.5;

    ref.current.position.x += (targetX - ref.current.position.x) * 0.02;
    ref.current.position.y += (targetY - ref.current.position.y) * 0.02;
    ref.current.position.z = basePos.current.z;

    // Gentle tumbling rotation like a falling leaf
    ref.current.rotation.x = Math.sin(t * 0.7) * 0.4;
    ref.current.rotation.y = t * 0.3;
    ref.current.rotation.z = Math.cos(t * 0.5) * 0.3;

    // Subtle floating bob
    ref.current.position.y += Math.sin(t) * 0.01;
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={ref} position={position} scale={scale}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <shapeGeometry args={[leafShape]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
            roughness={0.6}
          />
        </mesh>
        {/* Leaf vein / midrib */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
          <shapeGeometry args={[leafShape]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.3}
            wireframe
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Flower that follows cursor
function SeasonalFlower({
  position,
  scale,
  color,
  centerColor,
  pointer,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  centerColor: string;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const ref = useRef<THREE.Group>(null);
  const petalShape = useMemo(() => createPetalShape(), []);
  const speed = useMemo(() => 0.3 + Math.random() * 0.4, []);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const followStrength = useMemo(() => 0.2 + Math.random() * 0.4, []);
  const basePos = useRef(new THREE.Vector3(...position));
  const petalCount = 5;

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + phase;

    const targetX = basePos.current.x + pointer.current.x * followStrength * 2;
    const targetY = basePos.current.y + pointer.current.y * followStrength * 1.5;

    ref.current.position.x += (targetX - ref.current.position.x) * 0.015;
    ref.current.position.y += (targetY - ref.current.position.y) * 0.015;

    ref.current.rotation.z = Math.sin(t * 0.4) * 0.15;
    ref.current.rotation.x = Math.cos(t * 0.3) * 0.1;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.6}>
      <group ref={ref} position={position} scale={scale}>
        {/* Petals */}
        {Array.from({ length: petalCount }).map((_, i) => (
          <mesh
            key={i}
            rotation={[Math.PI / 2, 0, (i / petalCount) * Math.PI * 2]}
          >
            <shapeGeometry args={[petalShape]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.65}
              side={THREE.DoubleSide}
              roughness={0.4}
            />
          </mesh>
        ))}
        {/* Flower center */}
        <mesh>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial
            color={centerColor}
            emissive={centerColor}
            emissiveIntensity={0.4}
            roughness={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Small floating pollen/sparkle particle
function PollenParticle({
  position,
  pointer,
}: {
  position: [number, number, number];
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const speed = useMemo(() => 0.5 + Math.random() * 1.5, []);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const followStrength = useMemo(() => 0.1 + Math.random() * 0.3, []);
  const basePos = useRef(new THREE.Vector3(...position));

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + phase;

    const targetX = basePos.current.x + pointer.current.x * followStrength * 3;
    const targetY = basePos.current.y + pointer.current.y * followStrength * 2;

    ref.current.position.x += (targetX - ref.current.position.x) * 0.025;
    ref.current.position.y += (targetY - ref.current.position.y) * 0.025;
    ref.current.position.y += Math.sin(t) * 0.005;
    ref.current.position.x += Math.cos(t * 0.7) * 0.003;

    ref.current.scale.setScalar(0.7 + Math.sin(t * 2) * 0.3);
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.025, 6, 6]} />
      <meshStandardMaterial
        color="#f9fbe7"
        emissive="#cddc39"
        emissiveIntensity={0.6}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

// Shared pointer context component
function SceneContent() {
  const pointer = usePointer();

  const leaves = useMemo(
    () => [
      { pos: [-3.5, 1.8, -2] as [number, number, number], scale: 0.9, color: "#43a047" },
      { pos: [3.8, -0.3, -1.5] as [number, number, number], scale: 0.7, color: "#66bb6a" },
      { pos: [-2.2, -1.8, -3] as [number, number, number], scale: 1.1, color: "#2e7d32" },
      { pos: [2.2, 2.2, -2.5] as [number, number, number], scale: 0.6, color: "#81c784" },
      { pos: [4.2, 0.8, -1] as [number, number, number], scale: 0.5, color: "#388e3c" },
      { pos: [-4.2, 0.2, -2] as [number, number, number], scale: 0.8, color: "#4caf50" },
      { pos: [0.5, -2.2, -2] as [number, number, number], scale: 0.65, color: "#a5d6a7" },
      { pos: [-1.2, 2.8, -1.5] as [number, number, number], scale: 0.55, color: "#1b5e20" },
      { pos: [1.5, 1.0, -2.8] as [number, number, number], scale: 0.75, color: "#558b2f" },
      { pos: [-0.8, -0.5, -1.8] as [number, number, number], scale: 0.45, color: "#7cb342" },
    ],
    []
  );

  const flowers = useMemo(
    () => [
      { pos: [1.5, 1.5, -1.2] as [number, number, number], scale: 0.5, color: "#f8bbd0", center: "#ffeb3b" },
      { pos: [-2, -0.5, -1.8] as [number, number, number], scale: 0.4, color: "#fff9c4", center: "#ff9800" },
      { pos: [3, -1.5, -2] as [number, number, number], scale: 0.35, color: "#e1bee7", center: "#ffc107" },
      { pos: [-3.5, 2.2, -1.5] as [number, number, number], scale: 0.45, color: "#ffccbc", center: "#e91e63" },
      { pos: [0, 2.5, -2.2] as [number, number, number], scale: 0.3, color: "#b2dfdb", center: "#ff5722" },
    ],
    []
  );

  const pollen = useMemo(
    () =>
      Array.from({ length: 25 }, () => ({
        pos: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 6,
          -1 - Math.random() * 3,
        ] as [number, number, number],
      })),
    []
  );

  return (
    <>
      <InteractiveCameraRig />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.7} />
      <pointLight position={[-3, 2, 2]} intensity={0.4} color="#66bb6a" />
      <pointLight position={[3, -1, 1]} intensity={0.3} color="#f8bbd0" />

      {leaves.map((l, i) => (
        <SeasonalLeaf key={`leaf-${i}`} position={l.pos} scale={l.scale} color={l.color} pointer={pointer} />
      ))}
      {flowers.map((f, i) => (
        <SeasonalFlower key={`flower-${i}`} position={f.pos} scale={f.scale} color={f.color} centerColor={f.center} pointer={pointer} />
      ))}
      {pollen.map((p, i) => (
        <PollenParticle key={`pollen-${i}`} position={p.pos} pointer={pointer} />
      ))}
    </>
  );
}

const FloatingElements3D = () => {
  return (
    <div className="absolute inset-0 z-0" style={{ touchAction: "pan-y" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true, powerPreference: "default" }}
        dpr={[1, 1.5]}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
};

export default FloatingElements3D;

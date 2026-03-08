import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function Leaf3D({ position, scale, color }: { position: [number, number, number]; scale: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const speed = useMemo(() => 0.3 + Math.random() * 0.5, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * speed;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={ref} position={position} scale={scale}>
        <sphereGeometry args={[0.3, 8, 6]} />
        <meshStandardMaterial color={color} transparent opacity={0.7} roughness={0.6} />
      </mesh>
    </Float>
  );
}

function Droplet({ position, scale }: { position: [number, number, number]; scale: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.5;
  });

  return (
    <Float speed={2} floatIntensity={0.8}>
      <mesh ref={ref} position={position} scale={scale}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#4fc3f7" transparent opacity={0.5} roughness={0.2} metalness={0.3} />
      </mesh>
    </Float>
  );
}

function Particle({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const speed = useMemo(() => 0.5 + Math.random() * 1.5, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
    ref.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed * 0.7) * 0.2;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.04, 6, 6]} />
      <meshStandardMaterial color="#a5d6a7" emissive="#66bb6a" emissiveIntensity={0.5} transparent opacity={0.6} />
    </mesh>
  );
}

const FloatingElements3D = () => {
  const leaves = useMemo(() => [
    { pos: [-3, 1.5, -2] as [number, number, number], scale: 0.8, color: "#43a047" },
    { pos: [3.5, -0.5, -1.5] as [number, number, number], scale: 0.6, color: "#66bb6a" },
    { pos: [-2, -1.5, -3] as [number, number, number], scale: 1, color: "#2e7d32" },
    { pos: [2, 2, -2.5] as [number, number, number], scale: 0.5, color: "#81c784" },
    { pos: [4, 0.5, -1] as [number, number, number], scale: 0.4, color: "#388e3c" },
    { pos: [-4, 0, -2] as [number, number, number], scale: 0.7, color: "#4caf50" },
  ], []);

  const droplets = useMemo(() => [
    { pos: [1, 1, -1] as [number, number, number], scale: 0.7 },
    { pos: [-1.5, -1, -2] as [number, number, number], scale: 0.5 },
    { pos: [2.5, -1.5, -1.5] as [number, number, number], scale: 0.6 },
  ], []);

  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      pos: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        -1 - Math.random() * 3,
      ] as [number, number, number],
    })),
  []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-3, 2, 2]} intensity={0.4} color="#66bb6a" />

        {leaves.map((l, i) => (
          <Leaf3D key={`leaf-${i}`} position={l.pos} scale={l.scale} color={l.color} />
        ))}
        {droplets.map((d, i) => (
          <Droplet key={`drop-${i}`} position={d.pos} scale={d.scale} />
        ))}
        {particles.map((p, i) => (
          <Particle key={`particle-${i}`} position={p.pos} />
        ))}
      </Canvas>
    </div>
  );
};

export default FloatingElements3D;

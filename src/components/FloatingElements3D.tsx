import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// Touch/mouse tracker for interactive response
function usePointer() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
      setPointer({
        x: (clientX / window.innerWidth) * 2 - 1,
        y: -(clientY / window.innerHeight) * 2 + 1,
      });
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

function InteractiveCameraRig() {
  const { camera } = useThree();
  const pointer = usePointer();
  const target = useRef(new THREE.Vector3(0, 0, 5));

  useFrame(() => {
    target.current.set(pointer.x * 0.5, pointer.y * 0.3, 5);
    camera.position.lerp(target.current, 0.03);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Leaf3D({ position, scale, color }: { position: [number, number, number]; scale: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const speed = useMemo(() => 0.3 + Math.random() * 0.5, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * speed;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3;
    ref.current.rotation.x = Math.cos(state.clock.elapsedTime * speed * 0.3) * 0.15;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial color={color} transparent opacity={0.65} roughness={0.5} flatShading />
      </mesh>
    </Float>
  );
}

function Droplet({ position, scale }: { position: [number, number, number]; scale: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.5;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
  });

  return (
    <Float speed={2} floatIntensity={0.8}>
      <mesh ref={ref} position={position} scale={scale}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#4fc3f7" transparent opacity={0.45} roughness={0.2} metalness={0.3} />
      </mesh>
    </Float>
  );
}

function GlowParticle({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const speed = useMemo(() => 0.5 + Math.random() * 1.5, []);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + phase;
    ref.current.position.y = position[1] + Math.sin(t) * 0.3;
    ref.current.position.x = position[0] + Math.cos(t * 0.7) * 0.2;
    ref.current.scale.setScalar(0.8 + Math.sin(t * 2) * 0.3);
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.035, 6, 6]} />
      <meshStandardMaterial
        color="#a5d6a7"
        emissive="#66bb6a"
        emissiveIntensity={0.8}
        transparent
        opacity={0.55}
      />
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
    { pos: [0, -2, -2] as [number, number, number], scale: 0.55, color: "#a5d6a7" },
    { pos: [-1, 2.5, -1.5] as [number, number, number], scale: 0.45, color: "#1b5e20" },
  ], []);

  const droplets = useMemo(() => [
    { pos: [1, 1, -1] as [number, number, number], scale: 0.7 },
    { pos: [-1.5, -1, -2] as [number, number, number], scale: 0.5 },
    { pos: [2.5, -1.5, -1.5] as [number, number, number], scale: 0.6 },
    { pos: [-3, 1, -1] as [number, number, number], scale: 0.4 },
  ], []);

  const particles = useMemo(() =>
    Array.from({ length: 30 }, () => ({
      pos: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        -1 - Math.random() * 3,
      ] as [number, number, number],
    })),
  []);

  return (
    <div className="absolute inset-0 z-0" style={{ touchAction: "pan-y" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true, powerPreference: "default" }}
        dpr={[1, 1.5]}
      >
        <InteractiveCameraRig />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.7} />
        <pointLight position={[-3, 2, 2]} intensity={0.4} color="#66bb6a" />
        <pointLight position={[3, -1, 1]} intensity={0.3} color="#4fc3f7" />

        {leaves.map((l, i) => (
          <Leaf3D key={`leaf-${i}`} position={l.pos} scale={l.scale} color={l.color} />
        ))}
        {droplets.map((d, i) => (
          <Droplet key={`drop-${i}`} position={d.pos} scale={d.scale} />
        ))}
        {particles.map((p, i) => (
          <GlowParticle key={`particle-${i}`} position={p.pos} />
        ))}
      </Canvas>
    </div>
  );
};

export default FloatingElements3D;

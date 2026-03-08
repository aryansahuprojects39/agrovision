import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, Html } from "@react-three/drei";
import * as THREE from "three";

interface AffectedZone {
  x: number;
  y: number;
  radius: number;
}

interface Disease3DProps {
  disease: string;
  severity_level: string;
  infected_area_percent: number;
  spread_pattern: string;
  affected_zones: AffectedZone[];
}

const severityColors: Record<string, string> = {
  healthy: "#43a047",
  mild: "#cddc39",
  moderate: "#ff9800",
  severe: "#f44336",
  critical: "#880e4f",
};

const severityEmissive: Record<string, string> = {
  healthy: "#2e7d32",
  mild: "#827717",
  moderate: "#e65100",
  severe: "#b71c1c",
  critical: "#4a0028",
};

function LeafShape({ severity, infectedPercent }: { severity: string; infectedPercent: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const healthyColor = "#43a047";
  const sickColor = severityColors[severity] || "#f44336";

  // Create leaf-like shape using a custom geometry
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Leaf shape
    shape.moveTo(0, -1.8);
    shape.bezierCurveTo(0.8, -1, 1.2, 0, 0.9, 0.8);
    shape.bezierCurveTo(0.6, 1.4, 0.2, 1.8, 0, 2);
    shape.bezierCurveTo(-0.2, 1.8, -0.6, 1.4, -0.9, 0.8);
    shape.bezierCurveTo(-1.2, 0, -0.8, -1, 0, -1.8);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
    });
    return geo;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    // Gentle breathing animation
    const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    ref.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={ref} geometry={geometry} rotation={[0, 0, 0]} castShadow receiveShadow>
      <meshStandardMaterial
        color={severity === "healthy" ? healthyColor : sickColor}
        roughness={0.6}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function LeafVeins() {
  const points = useMemo(() => {
    const curves: THREE.Vector3[][] = [];
    // Central vein
    const central: THREE.Vector3[] = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      central.push(new THREE.Vector3(0, -1.8 + t * 3.8, 0.06));
    }
    curves.push(central);

    // Side veins
    for (let j = 0; j < 5; j++) {
      const yStart = -1 + j * 0.7;
      const sideR: THREE.Vector3[] = [];
      const sideL: THREE.Vector3[] = [];
      for (let i = 0; i <= 8; i++) {
        const t = i / 8;
        const xR = t * (0.6 - j * 0.05);
        const xL = -t * (0.6 - j * 0.05);
        const y = yStart + t * 0.3;
        sideR.push(new THREE.Vector3(xR, y, 0.06));
        sideL.push(new THREE.Vector3(xL, y, 0.06));
      }
      curves.push(sideR, sideL);
    }
    return curves;
  }, []);

  return (
    <>
      {points.map((curve, i) => {
        const geo = new THREE.BufferGeometry().setFromPoints(curve);
        const mat = new THREE.LineBasicMaterial({ color: "#2e7d32", opacity: 0.4, transparent: true });
        return (
          <primitive key={i} object={new THREE.Line(geo, mat)} />
        );
      })}
    </>
  );
}

function InfectionSpot({ zone, severity, index }: { zone: AffectedZone; severity: string; index: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const color = severityColors[severity] || "#f44336";
  const emissive = severityEmissive[severity] || "#b71c1c";

  // Map zone coordinates to leaf surface
  const position: [number, number, number] = [
    (zone.x - 0.5) * 1.6,
    -1.8 + zone.y * 3.8,
    0.1,
  ];

  const spotRadius = zone.radius * 1.2;

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + index;
    // Pulsating effect
    const pulse = 1 + Math.sin(t * 2) * 0.15;
    ref.current.scale.set(pulse, pulse, pulse);
    // Slight glow oscillation
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.3 + Math.sin(t * 3) * 0.2;
  });

  return (
    <Float speed={0.5} floatIntensity={0.1}>
      <mesh ref={ref} position={position}>
        <circleGeometry args={[spotRadius, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.4}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Outer ring for spread indication */}
      <mesh position={position}>
        <ringGeometry args={[spotRadius, spotRadius + 0.05, 32]} />
        <meshStandardMaterial
          color={emissive}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

function SpreadParticles({ pattern, severity }: { pattern: string; severity: string }) {
  const particles = useMemo(() => {
    const result: { pos: [number, number, number]; speed: number }[] = [];
    const count = severity === "critical" ? 40 : severity === "severe" ? 30 : 20;

    for (let i = 0; i < count; i++) {
      let x = 0, y = 0;
      switch (pattern) {
        case "edges":
          const angle = Math.random() * Math.PI * 2;
          x = Math.cos(angle) * (0.7 + Math.random() * 0.3);
          y = Math.sin(angle) * (1.4 + Math.random() * 0.3);
          break;
        case "veins":
          x = (Math.random() - 0.5) * 0.3;
          y = -1.8 + Math.random() * 3.8;
          break;
        case "center":
          x = (Math.random() - 0.5) * 0.6;
          y = (Math.random() - 0.5) * 1.2;
          break;
        case "uniform":
          x = (Math.random() - 0.5) * 1.6;
          y = -1.8 + Math.random() * 3.8;
          break;
        default: // spots
          x = (Math.random() - 0.5) * 1.4;
          y = -1.2 + Math.random() * 3;
          break;
      }
      result.push({
        pos: [x, y, 0.12 + Math.random() * 0.2],
        speed: 0.5 + Math.random() * 1.5,
      });
    }
    return result;
  }, [pattern, severity]);

  const color = severityColors[severity] || "#f44336";

  return (
    <>
      {particles.map((p, i) => (
        <SpreadParticle key={i} position={p.pos} speed={p.speed} color={color} index={i} />
      ))}
    </>
  );
}

function SpreadParticle({ position, speed, color, index }: {
  position: [number, number, number];
  speed: number;
  color: string;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + index;
    ref.current.position.x = position[0] + Math.sin(t) * 0.1;
    ref.current.position.y = position[1] + Math.cos(t * 0.7) * 0.08;
    ref.current.position.z = position[2] + Math.sin(t * 1.3) * 0.05;
    const s = 0.5 + Math.sin(t * 2) * 0.3;
    ref.current.scale.setScalar(s);
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.025, 6, 6]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

function StemGeometry() {
  const ref = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={ref} position={[0, -2.2, 0]}>
      <cylinderGeometry args={[0.03, 0.05, 1, 8]} />
      <meshStandardMaterial color="#33691e" roughness={0.8} />
    </mesh>
  );
}

function SeverityIndicator({ severity, infectedPercent }: { severity: string; infectedPercent: number }) {
  return (
    <Html position={[1.8, 1.5, 0]} center>
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg min-w-[140px] pointer-events-none">
        <div className="text-xs font-semibold text-foreground mb-1">Severity</div>
        <div className="flex items-center gap-2 mb-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: severityColors[severity] }}
          />
          <span className="text-sm font-bold capitalize" style={{ color: severityColors[severity] }}>
            {severity}
          </span>
        </div>
        <div className="text-xs text-muted-foreground mb-1">Infected Area</div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${infectedPercent}%`,
              backgroundColor: severityColors[severity],
            }}
          />
        </div>
        <div className="text-xs font-semibold mt-1" style={{ color: severityColors[severity] }}>
          {infectedPercent}%
        </div>
      </div>
    </Html>
  );
}

function Scene({ data }: { data: Disease3DProps }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <pointLight position={[-3, 2, 3]} intensity={0.3} color="#66bb6a" />
      <pointLight
        position={[2, -1, 2]}
        intensity={0.4}
        color={severityColors[data.severity_level]}
      />

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        autoRotate
        autoRotateSpeed={1}
        enableDamping
        dampingFactor={0.05}
      />

      <group>
        <LeafShape severity={data.severity_level} infectedPercent={data.infected_area_percent} />
        <LeafVeins />
        <StemGeometry />

        {data.severity_level !== "healthy" && (
          <>
            {data.affected_zones.map((zone, i) => (
              <InfectionSpot key={i} zone={zone} severity={data.severity_level} index={i} />
            ))}
            <SpreadParticles pattern={data.spread_pattern} severity={data.severity_level} />
          </>
        )}

        <SeverityIndicator severity={data.severity_level} infectedPercent={data.infected_area_percent} />
      </group>
    </>
  );
}

const Disease3DVisualization = ({ data }: { data: Disease3DProps }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#43a047" }} />
          <span>Healthy</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: severityColors[data.severity_level] }} />
          <span className="capitalize">{data.severity_level}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>🔄 Drag to rotate</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>🔍 Scroll to zoom</span>
        </div>
      </div>

      {/* 3D Canvas */}
      <div
        className={`rounded-lg border border-border overflow-hidden bg-card transition-all duration-300 ${
          isExpanded ? "h-[500px]" : "h-[350px]"
        }`}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          style={{ background: "transparent" }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 2]}
          shadows
        >
          <Scene data={data} />
        </Canvas>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-center text-sm text-primary hover:underline"
      >
        {isExpanded ? "Collapse View" : "Expand View"}
      </button>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 rounded-lg bg-accent/50">
          <div className="text-2xl font-bold" style={{ color: severityColors[data.severity_level] }}>
            {data.infected_area_percent}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">Infected Area</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-accent/50">
          <div className="text-2xl font-bold capitalize" style={{ color: severityColors[data.severity_level] }}>
            {data.severity_level}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Severity</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-accent/50">
          <div className="text-2xl font-bold capitalize text-foreground">
            {data.spread_pattern}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Spread Pattern</div>
        </div>
      </div>
    </div>
  );
};

export default Disease3DVisualization;

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { content } from '../../data/content';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface SkillNodeProps {
  name: string;
  position: [number, number, number];
  color: string;
  isHovered: boolean;
  onHover: (name: string | null) => void;
}

function SkillOrb({ name, position, color, isHovered, onHover }: SkillNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4;
      meshRef.current.rotation.y += delta * 0.5;

      const targetScale = isHovered ? 1.45 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(name);
        }}
        onPointerOut={() => onHover(null)}
      >
        <dodecahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial
          color={isHovered ? '#ffffff' : color}
          emissive={color}
          emissiveIntensity={isHovered ? 1.6 : 0.7}
          roughness={0.2}
          metalness={0.8}
          wireframe={!isHovered}
        />
      </mesh>

      {/* Floating 3D/HTML Badge */}
      <Html distanceFactor={10} position={[0, -0.65, 0]} center pointerEvents="none">
        <div
          className={`transition-all duration-200 px-2.5 py-1 rounded-md text-xs font-mono font-semibold whitespace-nowrap border select-none ${
            isHovered
              ? 'bg-primary text-white border-primary-light shadow-[0_0_15px_var(--color-primary-glow)] scale-110'
              : 'bg-bg-card/90 text-text-primary border-border opacity-75'
          }`}
        >
          {name}
        </div>
      </Html>
    </group>
  );
}

function OrbCluster({ hoveredSkill, setHoveredSkill }: { hoveredSkill: string | null; setHoveredSkill: (s: string | null) => void }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && !hoveredSkill) {
      groupRef.current.rotation.y += delta * 0.12;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.0006) * 0.15;
    }
  });

  // Collect all skills from content.skills
  const allSkills = Object.entries(content.skills).flatMap(([_, skills]) => skills);

  // Distribute skills evenly on a spherical/cylindrical orbit
  const nodes = allSkills.map((skill, index) => {
    const total = allSkills.length;
    const phi = Math.acos(-1 + (2 * index) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;
    const radius = 2.4;

    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);

    const colors = ['#7c5cff', '#22d3ee', '#a855f7', '#38bdf8', '#818cf8'];
    const color = colors[index % colors.length];

    return {
      name: skill,
      position: [x, y, z] as [number, number, number],
      color,
    };
  });

  return (
    <group ref={groupRef}>
      {/* Central energy sphere */}
      <mesh>
        <sphereGeometry args={[0.6, 24, 24]} />
        <meshStandardMaterial
          color="#7c5cff"
          emissive="#7c5cff"
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {nodes.map((node) => (
        <SkillOrb
          key={node.name}
          name={node.name}
          position={node.position}
          color={node.color}
          isHovered={hoveredSkill === node.name}
          onHover={setHoveredSkill}
        />
      ))}
    </group>
  );
}

export const SkillsScene: React.FC = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] rounded-3xl overflow-hidden glass-panel border border-border">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1.8} color="#7c5cff" />
        <pointLight position={[-5, -5, -5]} intensity={1.8} color="#22d3ee" />

        <OrbCluster hoveredSkill={hoveredSkill} setHoveredSkill={setHoveredSkill} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} dampingFactor={0.05} />
      </Canvas>

      {/* Helper hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] font-mono text-text-muted bg-bg/80 px-3 py-1 rounded-full border border-border pointer-events-none select-none">
        Drag to rotate constellation • Hover nodes
      </div>
    </div>
  );
};

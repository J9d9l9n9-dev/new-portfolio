import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ParticleCanvas } from '../ui/ParticleCanvas';

// Orbiting Starfield / Dust
function ParticleStarfield({ count = 1200 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorViolet = new THREE.Color('#7c5cff');
    const colorCyan = new THREE.Color('#22d3ee');
    const colorWhite = new THREE.Color('#ffffff');

    for (let i = 0; i < count; i++) {
      // Spread in a spherical volume
      const radius = 6 + Math.random() * 14;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      // Color distribution
      const r = Math.random();
      const c = r < 0.45 ? colorViolet : r < 0.85 ? colorCyan : colorWhite;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.07}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Interactive Central Kinetic Core
function KineticCore() {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    // Parallax mouse response
    const targetX = state.pointer.x * 0.7;
    const targetY = state.pointer.y * 0.7;

    // Scroll offset transformation
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const scrollFactor = Math.min(scrollY / 800, 1.5);

    if (groupRef.current) {
      // Smooth lerp to mouse parallax
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.05;
      // Scroll moves core down & changes z-depth
      groupRef.current.position.y = -scrollFactor * 1.2;
      groupRef.current.position.z = -scrollFactor * 0.8;
    }

    if (innerRef.current) {
      innerRef.current.rotation.x += delta * 0.35;
      innerRef.current.rotation.y += delta * 0.45;
    }

    if (ringRef1.current) {
      ringRef1.current.rotation.z += delta * 0.25;
      ringRef1.current.rotation.x += delta * 0.15;
    }

    if (ringRef2.current) {
      ringRef2.current.rotation.y -= delta * 0.3;
      ringRef2.current.rotation.z -= delta * 0.18;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Core Icosahedron with Wireframe Glow */}
        <mesh ref={innerRef}>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshStandardMaterial
            color="#7c5cff"
            emissive="#4318ff"
            emissiveIntensity={0.6}
            roughness={0.15}
            metalness={0.85}
            wireframe={true}
          />
        </mesh>

        {/* Inner Solid Shimmering Gem */}
        <mesh>
          <octahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#0891b2"
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Outer Orbiting Gyro Ring 1 */}
        <mesh ref={ringRef1}>
          <torusGeometry args={[2.2, 0.035, 16, 100]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={0.9}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Outer Orbiting Gyro Ring 2 */}
        <mesh ref={ringRef2}>
          <torusGeometry args={[2.7, 0.025, 16, 100]} />
          <meshStandardMaterial
            color="#7c5cff"
            emissive="#7c5cff"
            emissiveIntensity={0.7}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Floating Accent Geometries */}
        <mesh position={[2.5, 1.2, -1]}>
          <dodecahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color="#22d3ee" wireframe />
        </mesh>
        <mesh position={[-2.4, -1.1, 0.8]}>
          <tetrahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial color="#7c5cff" wireframe />
        </mesh>
      </group>
    </Float>
  );
}

// Camera controller reacting to scroll
function CameraRig() {
  useFrame((state) => {
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const progress = Math.min(scrollY / 1200, 1);

    // Dynamic camera journey
    state.camera.position.z = 6 + progress * 2;
    state.camera.position.y = -progress * 1.5;
  });

  return null;
}

export const HeroScene: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  // If user prefers reduced motion, render the 2D lightweight fallback
  if (prefersReducedMotion) {
    return <ParticleCanvas className="opacity-60" particleCount={40} />;
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]} // Performance rule: cap DPR at 2
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.4} />
        {/* Violet spotlight from top left */}
        <pointLight position={[-6, 6, 4]} intensity={2.5} color="#7c5cff" />
        {/* Cyan spotlight from bottom right */}
        <pointLight position={[6, -6, 4]} intensity={2.5} color="#22d3ee" />
        {/* Center rim light */}
        <pointLight position={[0, 0, -3]} intensity={1.5} color="#ffffff" />

        <KineticCore />
        <ParticleStarfield count={1000} />
        <CameraRig />
      </Canvas>
    </div>
  );
};

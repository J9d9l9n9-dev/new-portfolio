import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';

function InteractiveMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    // Interactive mouse tracking
    const mouseX = state.pointer.x * 1.5;
    const mouseY = state.pointer.y * 1.5;

    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4;
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouseX * 0.5, 0.08);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mouseY * 0.5, 0.08);
    }

    if (wireframeRef.current) {
      wireframeRef.current.rotation.x -= delta * 0.3;
      wireframeRef.current.rotation.y -= delta * 0.3;
      wireframeRef.current.position.x = THREE.MathUtils.lerp(wireframeRef.current.position.x, mouseX * 0.3, 0.08);
      wireframeRef.current.position.y = THREE.MathUtils.lerp(wireframeRef.current.position.y, mouseY * 0.3, 0.08);
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.8} floatIntensity={1.5}>
      <group>
        {/* Core solid crystal */}
        <mesh ref={meshRef}>
          <octahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial
            color="#7c5cff"
            emissive="#5832e6"
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>

        {/* Outer wireframe shell */}
        <mesh ref={wireframeRef}>
          <icosahedronGeometry args={[1.7, 0]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={0.6}
            wireframe
            roughness={0.3}
          />
        </mesh>

        {/* Tiny floating satellite */}
        <mesh position={[2, 0.8, -0.5]}>
          <tetrahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.9} />
        </mesh>
      </group>
    </Float>
  );
}

export const ContactScene: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <div className="w-full h-[280px] sm:h-[340px] rounded-3xl overflow-hidden glass-panel border border-border relative">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[4, 4, 4]} intensity={2} color="#7c5cff" />
        <pointLight position={[-4, -4, 4]} intensity={2} color="#22d3ee" />
        <InteractiveMesh />
      </Canvas>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] font-mono text-text-muted bg-bg/80 px-3 py-1 rounded-full border border-border pointer-events-none select-none">
        Move cursor to perturb kinetic crystal
      </div>
    </div>
  );
};

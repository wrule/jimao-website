// app/components/three/Background.tsx
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const KLEIN_BLUE = '#002FA7';

function CrystalGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.z += 0.003;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1.2, 0]} />
      <meshPhysicalMaterial
        color={KLEIN_BLUE}
        metalness={0.2}
        roughness={0.1}
        transmission={0.9}
        thickness={0.5}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 200;
  
  const positions = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 2;
    const r = 2 + Math.random() * 3;

    positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
    positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    positions[i * 3 + 2] = r * Math.cos(theta);
    
    scales[i] = Math.random() * 0.5 + 0.5;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={particleCount}
          array={scales}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#4169E1"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function Background() {
  return (
    <div 
      className="fixed inset-0 -z-10 bg-[#002FA7]"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -10,
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 6],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.6} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} />

        <CrystalGeometry />
        <Particles />

        <EffectComposer>
          <Bloom
            intensity={0.4}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

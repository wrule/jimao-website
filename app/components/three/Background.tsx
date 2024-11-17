// app/components/three/Background.tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { MeshTransmissionMaterial, Float } from '@react-three/drei';

function Particles() {
  const count = 1000;
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
}

function GlassGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1, 0.3, 100, 16]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.5}
          roughness={0}
          chromaticAberration={1}
          anisotropy={0.3}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
        />
      </mesh>
    </Float>
  );
}

export default function Background() {
  // 克莱因蓝 (IKB) RGB: 0, 47, 167
  return (
    <div className="fixed inset-0 -z-10 w-full h-[100dvh]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['rgb(0, 47, 167)']} />
        
        {/* 环境光 */}
        <ambientLight intensity={0.5} />
        
        {/* 主光源 */}
        <directionalLight position={[5, 5, 5]} intensity={1} />
        
        {/* 补光 */}
        <pointLight position={[-5, -5, -5]} intensity={0.5} />
        
        {/* 玻璃几何体 */}
        <GlassGeometry />
        
        {/* 粒子效果 */}
        <Particles />
      </Canvas>
    </div>
  );
}

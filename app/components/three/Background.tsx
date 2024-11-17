import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { MeshTransmissionMaterial, Float } from '@react-three/drei';

function Particles() {
  const count = 640; // 减少20%粒子数量 (800 * 0.8 = 640)
  const particlesRef = useRef<THREE.Points>(null);
  
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const theta = THREE.MathUtils.randFloatSpread(360);
    const phi = THREE.MathUtils.randFloatSpread(360);
    const r = 2.5 + Math.random() * 4;

    positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
    positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    positions[i * 3 + 2] = r * Math.cos(theta);

    const shade = Math.random();
    colors[i * 3] = 0.9 + shade * 0.1;
    colors[i * 3 + 1] = 0.95 + shade * 0.05;
    colors[i * 3 + 2] = 1;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
      particlesRef.current.rotation.x = state.clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function TorusGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.3}
      floatIntensity={0.3}
    >
      <mesh ref={meshRef}>
        <torusKnotGeometry 
          args={[0.7, 0.25, 200, 32, 2, 3]}
        />
        <MeshTransmissionMaterial
          samples={32}
          resolution={512}
          transmission={1}
          thickness={0.15}
          roughness={0.05}
          metalness={0.1}
          attenuationDistance={8}
          attenuationColor="#ffffff"
          color="#88ccff"
          ior={1.5}
          chromaticAberration={0.02}
          distortion={0.4}
          distortionScale={0.3}
          temporalDistortion={0.08}
          clearcoat={0.3}
          transparent={true}
          opacity={0.8}
          envMapIntensity={1.5}
          backsideThickness={0.3}
        />
      </mesh>
    </Float>
  );
}

export default function Scene() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-[100dvh]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 70 }}
        gl={{ 
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#002FA7']} /> {/* 克莱因蓝 */}
        
        <ambientLight intensity={0.3} />
        <spotLight 
          position={[5, 5, 5]} 
          intensity={0.6}
          angle={0.5}
          penumbra={1}
          distance={20}
        />
        <pointLight position={[-5, -5, -5]} intensity={0.2} />
        
        <TorusGeometry />
        <Particles />
      </Canvas>
    </div>
  );
}

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { MeshTransmissionMaterial, Float } from '@react-three/drei';

function Particles() {
  const count = 500; // 减少到500个粒子
  const particlesRef = useRef<THREE.Points>(null);
  
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const theta = THREE.MathUtils.randFloatSpread(360);
    const phi = THREE.MathUtils.randFloatSpread(360);
    const r = 2 + Math.random() * 3;

    positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
    positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    positions[i * 3 + 2] = r * Math.cos(theta);

    const shade = Math.random();
    colors[i * 3] = 0.8 + shade * 0.2;
    colors[i * 3 + 1] = 0.9 + shade * 0.1;
    colors[i * 3 + 2] = 1;
  }

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
        size={0.02} // 略微增大粒子尺寸
        vertexColors
        transparent
        opacity={0.4} // 降低粒子透明度
        sizeAttenuation={true}
      />
    </points>
  );
}

function TorusGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.4}
      floatIntensity={0.4}
    >
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[0.8, 0.3, 100, 16, 2, 3]} />
        <MeshTransmissionMaterial
          samples={16} // 增加采样次数
          resolution={256}
          transmission={1}
          thickness={0.2} // 减小厚度
          roughness={0.1}
          metalness={0}
          attenuationDistance={5}
          attenuationColor="#ffffff"
          color="#ffffff"
          ior={1.2} // 降低折射率
          chromaticAberration={0.03}
          distortion={0.3}
          distortionScale={0.4}
          temporalDistortion={0.1}
          clearcoat={0.1} // 减少清漆效果
          transparent={true}
          opacity={0.6} // 增加透明度
          envMapIntensity={0.5} // 降低环境贴图强度
        />
      </mesh>
    </Float>
  );
}

export default function Scene() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-[100dvh]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ 
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1
        }}
      >
        <color attach="background" args={['rgb(0, 47, 167)']} />
        
        <ambientLight intensity={0.2} />
        <spotLight 
          position={[5, 5, 5]} 
          intensity={0.4} // 降低光照强度
          angle={0.4}
          penumbra={1}
        />
        <pointLight position={[-5, -5, -5]} intensity={0.1} />
        
        <TorusGeometry />
        <Particles />
      </Canvas>
    </div>
  );
}

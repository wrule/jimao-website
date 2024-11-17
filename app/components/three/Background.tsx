import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { MeshTransmissionMaterial, Float } from '@react-three/drei';

function Particles() {
  const count = 800; // 增加粒子数量
  const particlesRef = useRef<THREE.Points>(null);
  
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const theta = THREE.MathUtils.randFloatSpread(360);
    const phi = THREE.MathUtils.randFloatSpread(360);
    const r = 2.5 + Math.random() * 4; // 扩大粒子分布范围

    positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
    positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    positions[i * 3 + 2] = r * Math.cos(theta);

    const shade = Math.random();
    colors[i * 3] = 0.9 + shade * 0.1;     // 更亮的蓝白色
    colors[i * 3 + 1] = 0.95 + shade * 0.05;
    colors[i * 3 + 2] = 1;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.03; // 降低旋转速度
      particlesRef.current.rotation.x = state.clock.getElapsedTime() * 0.01; // 添加微小的X轴旋转
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
        size={0.015} // 调整粒子大小
        vertexColors
        transparent
        opacity={0.6} // 提高透明度
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending} // 添加混合模式
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
      speed={1.5} // 降低浮动速度
      rotationIntensity={0.3}
      floatIntensity={0.3}
    >
      <mesh ref={meshRef}>
        <torusKnotGeometry 
          args={[0.7, 0.25, 200, 32, 2, 3]} // 增加分段数，使形状更平滑
        />
        <MeshTransmissionMaterial
          samples={32} // 增加采样次数
          resolution={512} // 提高分辨率
          transmission={1}
          thickness={0.15} // 减小厚度
          roughness={0.05} // 降低粗糙度
          metalness={0.1}
          attenuationDistance={8}
          attenuationColor="#ffffff"
          color="#88ccff" // 添加淡蓝色
          ior={1.5} // 增加折射率
          chromaticAberration={0.02} // 减小色差
          distortion={0.4}
          distortionScale={0.3}
          temporalDistortion={0.08}
          clearcoat={0.3}
          transparent={true}
          opacity={0.8}
          envMapIntensity={1.5} // 增加环境反射
          backsideThickness={0.3} // 增加背面厚度
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
          toneMappingExposure: 1.2, // 略微提高曝光
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        dpr={[1, 2]} // 适应高DPI屏幕
      >
        <color attach="background" args={['rgb(0, 32, 128)']} /> // 调整背景色
        
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

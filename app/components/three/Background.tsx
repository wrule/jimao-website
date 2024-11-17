// app/components/three/Background.tsx
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Vector3, Color, BackSide } from 'three';
import { PerspectiveCamera } from '@react-three/drei';

// 流动的几何体
function FloatingGeometry() {
  const mesh = useRef<any>();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBaseColor: { value: new Color('#002FA7') },
      uAccentColor: { value: new Color('#1E90FF') },
    }),
    []
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.getElapsedTime() * 0.3;
  });

  const vertexShader = `
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform float uTime;

    void main() {
      vPosition = position;
      vUv = uv;
      
      vec3 pos = position;
      pos.x += sin(pos.y * 0.5 + uTime) * 0.3;
      pos.y += cos(pos.x * 0.5 + uTime) * 0.3;
      pos.z += sin(pos.x * pos.y * 0.2 + uTime) * 0.3;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 uBaseColor;
    uniform vec3 uAccentColor;
    uniform float uTime;
    varying vec3 vPosition;
    varying vec2 vUv;

    void main() {
      vec3 color = mix(uBaseColor, uAccentColor, 
        sin(vUv.x * 4.0 + uTime * 0.5) * 0.5 + 0.5);
      
      float glow = sin(vUv.x * 10.0 + vUv.y * 10.0 + uTime) * 0.1 + 0.9;
      color *= glow;

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <torusKnotGeometry args={[3, 0.8, 200, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

// 环境光晕
function AmbientHalo() {
  const meshRef = useRef<any>();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.z = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[15, 32, 32]} />
      <meshBasicMaterial
        color="#002FA7"
        transparent
        opacity={0.2}
        side={BackSide}
      />
    </mesh>
  );
}

// 背景粒子
function BackgroundParticles() {
  const points = useRef<any>();
  const particleCount = 1000;

  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    if (points.current) {
      points.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
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

// 主背景组件
export default function Background() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas>
        <color attach="background" args={['#002FA7']} />
        <fog attach="fog" args={['#002FA7', 10, 25]} />
        
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />
        
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <FloatingGeometry />
        <AmbientHalo />
        <BackgroundParticles />
        
        <EffectComposer>
          <Bloom
            intensity={0.7}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            height={300}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

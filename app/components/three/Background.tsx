// app/components/three/Background.tsx
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import { Vector3, Color } from 'three';
import { PerspectiveCamera } from '@react-three/drei';

// 抽象波浪场景
function AbstractWaves() {
  const mesh = useRef<any>();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new Color('#002FA7') },
    }),
    []
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    uniforms.uTime.value = time;
    
    if (mesh.current) {
      mesh.current.rotation.x = Math.sin(time * 0.1) * 0.2;
      mesh.current.rotation.y = Math.sin(time * 0.15) * 0.2;
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;

    void main() {
      vUv = uv;
      
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      
      float elevation = sin(modelPosition.x * 2.0 + uTime * 0.5) * 
                       sin(modelPosition.y * 2.0 + uTime * 0.5) * 0.5;
                       
      modelPosition.z += elevation;
      vElevation = elevation;

      gl_Position = projectionMatrix * viewMatrix * modelPosition;
    }
  `;

  const fragmentShader = `
    uniform vec3 uColor;
    varying float vElevation;
    
    void main() {
      float intensity = vElevation * 2.0 + 0.8;
      vec3 color = mix(uColor, vec3(1.0), intensity * 0.2);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 4, 0, 0]}>
      <planeGeometry args={[15, 15, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

// 发光环组件
function LightRings() {
  const group = useRef<any>();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.z = time * 0.1;
      group.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }
  });

  return (
    <group ref={group}>
      {[1, 2, 3].map((ring, i) => (
        <mesh key={ring} position={[0, 0, -i * 0.5]}>
          <torusGeometry args={[2 + i * 0.8, 0.05, 16, 100]} />
          <meshStandardMaterial
            color="#002FA7"
            emissive="#002FA7"
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

// 大气效果组件
function Atmosphere() {
  const mesh = useRef<any>();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.z = time * 0.05;
    }
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[10, 32, 32]} />
      <meshStandardMaterial
        color="#002FA7"
        transparent
        opacity={0.1}
        side={2}
      />
    </mesh>
  );
}

// 相机控制
function CameraRig() {
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    state.camera.position.x = Math.sin(time * 0.1) * 2;
    state.camera.position.y = Math.cos(time * 0.1) * 2;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

// 主背景组件
export default function Background() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas>
        <color attach="background" args={['#002FA7']} />
        <fog attach="fog" args={['#002FA7', 5, 15]} />
        
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={75} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <AbstractWaves />
        <LightRings />
        <Atmosphere />
        <CameraRig />
        
        <EffectComposer>
          <Bloom
            intensity={1}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            height={300}
          />
          <Noise opacity={0.02} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

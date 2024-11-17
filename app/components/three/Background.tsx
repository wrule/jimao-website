// app/components/three/Background.tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { useGLTF, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

function Tree() {
  // 修改这里的类型定义
  const treeRef = useRef<THREE.Group>(null);
  
  const geometry = useMemo(() => new THREE.CylinderGeometry(0.2, 0.4, 2, 8), []);
  const leavesGeometry = useMemo(() => new THREE.ConeGeometry(1, 2, 8), []);
  
  useFrame((state, delta) => {
    if (treeRef.current) {
      treeRef.current.rotation.y += Math.sin(state.clock.elapsedTime) * 0.001;
      treeRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <Float
      speed={1.5} 
      rotationIntensity={0.2} 
      floatIntensity={0.5}
    >
      <group ref={treeRef}>
        <mesh position={[0, 1, 0]} castShadow>
          <primitive object={geometry} attach="geometry" />
          <meshStandardMaterial color="#4a321d" />
        </mesh>
        <mesh position={[0, 2.5, 0]} castShadow>
          <primitive object={leavesGeometry} attach="geometry" />
          <meshStandardMaterial color="#2d5a27" />
        </mesh>
      </group>
    </Float>
  );
}

const Background = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 2, 10], fov: 45 }}
        shadows
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={2048}
        />
        <Tree />
        <Environment preset="sunset" />
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -1, 0]}
          receiveShadow
        >
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
      </Canvas>
    </div>
  );
};

export default Background;

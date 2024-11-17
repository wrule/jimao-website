// app/components/three/Background.tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';

// 单个硬币组件
function Coin({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [fallen, setFallen] = useState(false);
  
  const coinGeometry = useMemo(() => new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32), []);
  
  useFrame(() => {
    if (!meshRef.current || fallen) return;
    
    // 硬币掉落的物理模拟
    meshRef.current.position.y -= 0.05;
    meshRef.current.rotation.x += 0.1;
    
    if (meshRef.current.position.y < -8) {
      setFallen(true);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <primitive object={coinGeometry} attach="geometry" />
      <meshStandardMaterial
        color="#FFD700"
        metalness={1}
        roughness={0.2}
      />
    </mesh>
  );
}

// 推币器组件
function Pusher() {
  const pusherRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (pusherRef.current) {
      // 推币器往复运动
      pusherRef.current.position.z = Math.sin(state.clock.elapsedTime * 2) * 2;
    }
  });

  return (
    <mesh
      ref={pusherRef}
      position={[0, 0, 4]}
    >
      <boxGeometry args={[8, 0.5, 1]} />
      <meshStandardMaterial
        color="#404040"
        metalness={0.5}
        roughness={0.5}
      />
    </mesh>
  );
}

// 主场景组件
function CoinPusherScene() {
  const [coins, setCoins] = useState<Array<[number, number, number]>>([]);
  
  // 定期添加新硬币
  useFrame(() => {
    if (Math.random() < 0.02) {
      const x = (Math.random() - 0.5) * 6;
      setCoins(prev => [...prev, [x, 5, 3]]);
      
      // 限制硬币数量
      if (coins.length > 50) {
        setCoins(prev => prev.slice(1));
      }
    }
  });

  return (
    <group>
      {/* 推币台面 */}
      <mesh rotation={[-Math.PI / 12, 0, 0]} position={[0, -2, 0]}>
        <boxGeometry args={[10, 0.2, 8]} />
        <meshStandardMaterial
          color="#2C3E50"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* 侧边挡板 */}
      <mesh position={[-5, -2, 0]}>
        <boxGeometry args={[0.2, 4, 8]} />
        <meshStandardMaterial color="#2C3E50" />
      </mesh>
      <mesh position={[5, -2, 0]}>
        <boxGeometry args={[0.2, 4, 8]} />
        <meshStandardMaterial color="#2C3E50" />
      </mesh>

      {/* 推币器 */}
      <Pusher />

      {/* 硬币 */}
      {coins.map((position, index) => (
        <Coin key={index} position={position} />
      ))}
    </group>
  );
}

const Background = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 5, 15], fov: 45 }}
        gl={{ antialias: true }}
      >
        {/* 环境光和主光源 */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={1}
          castShadow
        />
        <spotLight
          position={[0, 10, 0]}
          intensity={0.8}
          angle={0.5}
          penumbra={1}
        />

        {/* 赌场氛围灯光 */}
        <pointLight position={[-5, 5, 5]} intensity={0.5} color="#ff0000" />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#0000ff" />

        <CoinPusherScene />

        {/* 背景颜色 */}
        <color attach="background" args={['#1a1a1a']} />
        <fog attach="fog" args={['#1a1a1a', 15, 25]} />
      </Canvas>
    </div>
  );
};

export default Background;

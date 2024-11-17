import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { random } from 'maath'

function ParticleField() {
  const ref = useRef<THREE.Points>(null)
  
  // 显式转换为 Float32Array
  const positions = new Float32Array(5000 * 3)
  random.inSphere(positions, { radius: 12 })

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.1
      ref.current.rotation.y -= delta * 0.05
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

interface BackgroundProps {
  children?: React.ReactNode;
}

export default function Background({ children }: BackgroundProps) {
  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 1] }}
          gl={{ antialias: true, alpha: true }}
        >
          <color attach="background" args={['#000033']} />
          <fogExp2 attach="fog" args={['#000033', 0.05]} />
          <ParticleField />
        </Canvas>
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

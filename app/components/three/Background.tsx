import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { random } from 'maath'

function ParticleField() {
  const ref = useRef<THREE.Points>(null)
  
  const count = 5000
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    random.inSphere(positions, { radius: 12 })
    return positions
  }, [])

  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.x -= delta * 0.1
    ref.current.rotation.y -= delta * 0.05
  })

  return (
    <Points
      ref={ref}
      positions={positions}
      stride={3}
      frustumCulled={false}
    >
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

function MovingGradient() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime
    }
  })

  const shaderData = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color('#0047ab') },
        uColorB: { value: new THREE.Color('#000033') },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        varying vec2 vUv;

        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = length(vUv - center);
          float wave = sin(dist * 10.0 - uTime) * 0.5 + 0.5;
          vec3 color = mix(uColorA, uColorB, wave);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    }),
    []
  )

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <planeGeometry args={[50, 50]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={shaderData.vertexShader}
        fragmentShader={shaderData.fragmentShader}
        uniforms={shaderData.uniforms}
      />
    </mesh>
  )
}

export default function Background() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <color attach="background" args={['#000033']} />
        <fogExp2 attach="fog" args={['#000033', 0.05]} />
        <ambientLight intensity={0.5} />
        <MovingGradient />
        <ParticleField />
      </Canvas>
    </div>
  );
}

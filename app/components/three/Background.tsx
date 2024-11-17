// app/components/three/Background.tsx
import { Canvas } from '@react-three/fiber';

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-[100dvh]">
      <Canvas>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.1} />
      </Canvas>
    </div>
  );
}
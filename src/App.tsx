import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import Scene from './components/Scene'

export default function App() {
  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ fov: 35, near: 0.1, far: 1000, position: [15, 12, 15] }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <div className="hud">WASD / ARROW KEYS TO NAVIGATE</div>
    </>
  )
}

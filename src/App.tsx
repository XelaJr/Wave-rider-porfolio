import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import Scene from './components/Scene'
import IslandPanel from './components/IslandPanel'

export default function App() {
  const [activeIsland, setActiveIsland] = useState<string | null>(null)

  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ fov: 35, near: 0.1, far: 1000, position: [15, 12, 15] }}
      >
        <Suspense fallback={null}>
          <Scene onIslandClick={setActiveIsland} />
        </Suspense>
      </Canvas>
      <IslandPanel islandId={activeIsland} onClose={() => setActiveIsland(null)} />
      <div className="hud">WASD / ARROW KEYS TO NAVIGATE</div>
    </>
  )
}
